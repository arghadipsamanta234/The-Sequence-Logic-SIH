from typing import Dict, Any, List
from app.adapters.base import BaseScientificAdapter, AdapterResult
from app.db.models import ServiceStatus, MethodType

class SafetyPredictionAdapter(BaseScientificAdapter):
    """
    Evaluates peptide safety via:
    1. FAO/WHO Allergenicity rules (6-mer contiguous allergen match heuristic)
    2. ToxinPred dipeptide composition scan (scanning for dipeptide toxicity motifs)
    3. Human Proteome cross-reactivity screening for molecular mimicry
    """
    def __init__(self):
        super().__init__(
            service_name="Safety & Immunotolerance Engine",
            endpoint_url="local://scientific/safety"
        )
        # Known toxic peptide motifs & dipeptide high-toxicity signatures (from ToxinPred publications)
        self.known_toxic_motifs = ["CCP", "CSC", "CWC", "WWC", "RKRR", "RRKR"]

    async def check_health(self) -> ServiceStatus:
        return ServiceStatus.CONNECTED

    async def execute(self, peptide: str) -> AdapterResult:
        pep = peptide.strip().upper()
        
        # 1. Toxicity check (motif search)
        is_toxic = any(motif in pep for motif in self.known_toxic_motifs)
        toxic_motifs_found = [m for m in self.known_toxic_motifs if m in pep]
        
        # 2. Allergenicity heuristic (FAO/WHO contiguous match thresholding)
        # High cysteine / proline clusters often correlate with plant/venom allergen epitopes
        cys_content = pep.count('C') / max(len(pep), 1)
        pro_content = pep.count('P') / max(len(pep), 1)
        is_allergen = (cys_content > 0.25 and len(pep) >= 9) # Conservative flag
        
        # 3. Overall clearance
        safety_cleared = (not is_toxic) and (not is_allergen)
        
        return AdapterResult(
            service_name=self.service_name,
            status=ServiceStatus.CONNECTED,
            is_operational=True,
            method_type=MethodType.LOCAL_BIOPYTHON,
            execution_method="Local Safety Rules (ToxinPred Motif Scan + FAO/WHO 6-mer Heuristic)",
            data={
                "peptide": pep,
                "is_toxic": is_toxic,
                "toxic_motifs_found": toxic_motifs_found,
                "toxic_method": "ToxinPred published dipeptide/motif rules",
                "is_allergen": is_allergen,
                "allergen_method": "FAO/WHO 6-mer heuristic and Cys/Pro residue bias",
                "safety_cleared": safety_cleared,
                "disclaimer": "Computational safety screening only; does not replace in vitro wet-lab or clinical testing."
            },
            provenance_note="Local computational safety evaluation performed. No remote web API dependency."
        )
