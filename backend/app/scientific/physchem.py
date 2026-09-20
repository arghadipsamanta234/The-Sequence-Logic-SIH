from typing import Dict, Any, Optional
from Bio.SeqUtils.ProtParam import ProteinAnalysis
from pydantic import BaseModel

class PhysChemAnalysisResult(BaseModel):
    molecular_weight: float
    theoretical_pi: float
    instability_index: float
    is_stable: bool
    aliphatic_index: float
    gravy_score: float
    is_hydrophilic: bool
    aromaticity: float
    amino_acid_counts: Dict[str, int]
    amino_acid_percentages: Dict[str, float]
    extinction_coefficient_reduced: int
    extinction_coefficient_cystines: int

def compute_physicochemical_properties(sequence: str) -> Optional[PhysChemAnalysisResult]:
    """
    Computes rigorous physicochemical parameters using Biopython ProtParam.
    100% deterministic local computation with zero external dependencies.
    """
    clean_seq = sequence.strip().upper().replace(" ", "")
    # ProtParam requires standard 20 amino acids without ambiguous letters
    clean_seq = "".join(c for c in clean_seq if c in "ACDEFGHIKLMNPQRSTVWY")
    if not clean_seq:
        return None

    try:
        prot = ProteinAnalysis(clean_seq)
        mw = round(prot.molecular_weight(), 2)
        pi = round(prot.isoelectric_point(), 2)
        instability = round(prot.instability_index(), 2)
        is_stable = instability < 40.0
        gravy = round(prot.gravy(), 3)
        is_hydrophilic = gravy < 0.0
        aromaticity = round(prot.aromaticity(), 3)
        
        # Aliphatic index: X(Ala) + a * X(Val) + b * [X(Ile) + X(Leu)]
        # Where a = 2.9, b = 3.9
        total_len = len(clean_seq)
        counts = prot.count_amino_acids()
        ala = (counts.get('A', 0) / total_len) * 100
        val = (counts.get('V', 0) / total_len) * 100
        ile = (counts.get('I', 0) / total_len) * 100
        leu = (counts.get('L', 0) / total_len) * 100
        aliphatic_index = round(ala + 2.9 * val + 3.9 * (ile + leu), 2)
        
        percentages = {aa: round(pct * 100, 2) for aa, pct in prot.get_amino_acids_percent().items()}
        ext_coeff = prot.molar_extinction_coefficient()

        return PhysChemAnalysisResult(
            molecular_weight=mw,
            theoretical_pi=pi,
            instability_index=instability,
            is_stable=is_stable,
            aliphatic_index=aliphatic_index,
            gravy_score=gravy,
            is_hydrophilic=is_hydrophilic,
            aromaticity=aromaticity,
            amino_acid_counts=counts,
            amino_acid_percentages=percentages,
            extinction_coefficient_reduced=ext_coeff[0],
            extinction_coefficient_cystines=ext_coeff[1]
        )
    except Exception:
        return None
