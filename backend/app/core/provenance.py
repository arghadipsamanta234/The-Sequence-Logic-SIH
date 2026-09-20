import hashlib
import json
from datetime import datetime, timezone
from typing import Any, Optional
from sqlmodel import Session
from app.db.models import ProvenanceRecord, MethodType, ServiceStatus

def compute_sha256(data: str | bytes) -> str:
    """Calculate standard SHA-256 cryptographic hash."""
    if isinstance(data, str):
        data = data.encode("utf-8")
    return hashlib.sha256(data).hexdigest()

def record_provenance(
    session: Session,
    stage_name: str,
    source: str,
    method: str,
    tool: str,
    tool_version: str,
    method_type: MethodType,
    analysis_id: Optional[int] = None,
    accession: Optional[str] = None,
    parameters: Optional[dict[str, Any]] = None,
    input_data: Optional[str | bytes] = None,
    output_data: Optional[str | bytes] = None,
    status: ServiceStatus = ServiceStatus.CONNECTED,
    notes: Optional[str] = None
) -> ProvenanceRecord:
    """
    Creates and commits an immutable ProvenanceRecord.
    Strictly follows scientific integrity rules:
    - Never masquerades fallbacks as original tools.
    - Records input and output SHA-256 hashes.
    - Preserves exact timestamp and parameters.
    """
    param_str = json.dumps(parameters or {}, sort_keys=True)
    input_hash = compute_sha256(input_data) if input_data is not None else None
    output_hash = compute_sha256(output_data) if output_data is not None else None
    
    provenance = ProvenanceRecord(
        analysis_id=analysis_id,
        stage_name=stage_name,
        source=source,
        accession=accession,
        method=method,
        method_type=method_type,
        tool=tool,
        tool_version=tool_version,
        parameters=param_str,
        input_hash=input_hash,
        output_hash=output_hash,
        status=status,
        notes=notes,
        timestamp=datetime.now(timezone.utc)
    )
    
    session.add(provenance)
    session.commit()
    session.refresh(provenance)
    return provenance
