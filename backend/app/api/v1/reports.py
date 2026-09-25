import json
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import HTMLResponse
from sqlmodel import Session, select
from app.db.session import get_session
from app.db.models import AnalysisRun, Construct, CandidateScore, ProvenanceRecord, Report
from app.core.provenance import compute_sha256

router = APIRouter(prefix="/reports", tags=["Scientific Research Dossier & Export"])

@router.get("/{analysis_id}")
async def get_analysis_report(
    analysis_id: int,
    session: Session = Depends(get_session)
):
    """
    Generates an audit-ready, scientific research dossier including:
    - Executive summary
    - Target sequence metadata and Biopython ProtParam validation
    - Screening results and methodology
    - Multi-epitope construct details
    - Full cryptographic provenance log with SHA-256 checksums
    """
    analysis = session.get(AnalysisRun, analysis_id)
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis run not found.")

    stmt_prov = select(ProvenanceRecord).where(ProvenanceRecord.analysis_id == analysis_id).order_by(ProvenanceRecord.timestamp.asc())
    provenance = session.exec(stmt_prov).all()

    stmt_const = select(Construct).where(Construct.analysis_id == analysis_id)
    constructs = session.exec(stmt_const).all()

    construct_summaries = []
    for c in constructs:
        score = session.exec(select(CandidateScore).where(CandidateScore.construct_id == c.id)).first()
        construct_summaries.append({
            "name": c.name,
            "length": c.length,
            "adjuvant": c.adjuvant_name,
            "mw_da": c.molecular_weight,
            "pi": c.theoretical_pi,
            "instability": c.instability_index,
            "composite_score": score.composite_pareto_score if score else 0.0,
            "rank": score.rank if score else 1,
            "full_sequence": getattr(c, "sequence", getattr(c, "full_sequence", ""))  # সিকোয়েন্স ফিল্ড যুক্ত করা হলো
        })

    report_payload = {
        "analysis_id": analysis.id,
        "title": analysis.title,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "organism": analysis.sequence.protein.organism if analysis.sequence and analysis.sequence.protein else "Unknown",
        "protein": analysis.sequence.protein.name if analysis.sequence and analysis.sequence.protein else "Unknown",
        "accession": analysis.sequence.protein.accession if analysis.sequence and analysis.sequence.protein else "Unknown",
        "sequence_hash": analysis.sequence.sha256_hash if analysis.sequence else "",
        "candidates": construct_summaries,
        "provenance_audit_log": [
            {
                "stage": p.stage_name,
                "tool": p.tool,
                "version": p.tool_version,
                "method": p.method,
                "method_type": p.method_type,
                "input_hash": p.input_hash,
                "output_hash": p.output_hash,
                "status": p.status,
                "notes": p.notes,
                "timestamp": p.timestamp.isoformat()
            }
            for p in provenance
        ],
        "disclaimer": (
            "NOTICE OF SCIENTIFIC INTEGRITY: This research report was computationally compiled by the Sequence Logic pipeline. "
            "All predicted scores represent in silico mathematical models. Experimental synthesis, in vitro expression, "
            "and in vivo immunological evaluations are strictly required before clinical application."
        )
    }

    report_hash = compute_sha256(json.dumps(report_payload, sort_keys=True))
    report_payload["report_checksum_sha256"] = report_hash

    return report_payload