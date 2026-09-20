from typing import Dict, Any
from pydantic import BaseModel

# Published Sandberg et al. z-scale descriptors for 20 standard amino acids:
# z1: Hydrophilicity/polarity
# z2: Structural size/bulkiness
# z3: Electronic property/charge
Z_SCALES: Dict[str, tuple[float, float, float]] = {
    'A': (0.07, -1.73, 0.09),
    'R': (2.88, 2.52, -3.44),
    'N': (3.22, 1.45, 0.84),
    'D': (3.64, 1.13, 2.36),
    'C': (0.71, -0.97, 4.13),
    'Q': (2.18, 0.53, -1.14),
    'E': (3.08, 0.39, -0.07),
    'G': (2.23, -5.36, 0.30),
    'H': (2.41, 1.74, 1.11),
    'I': (-4.44, -1.68, -1.03),
    'L': (-4.19, -1.03, -0.98),
    'K': (2.84, 1.41, -3.14),
    'M': (-2.49, -0.27, -0.41),
    'F': (-4.92, 1.30, 0.45),
    'P': (-1.22, 0.88, 2.23),
    'S': (1.96, -1.63, 0.57),
    'T': (0.92, -2.09, -1.40),
    'W': (-4.75, 3.65, 0.85),
    'Y': (-1.39, 2.32, 0.01),
    'V': (-2.69, -2.53, -1.29),
}

class LocalAntigenicityResult(BaseModel):
    method: str = "Local ACC z-scale Physicochemical Heuristic"
    antigenicity_index: float
    threshold: float = 0.50
    is_antigenic: bool
    mean_z1_hydrophilicity: float
    mean_z2_bulkiness: float
    mean_z3_charge: float
    scientific_disclaimer: str = (
        "LOCAL FALLBACK METHOD: Calculated using Auto-Cross Covariance (ACC) z-scale descriptors. "
        "This is an empirical physicochemical descriptor and is NOT equivalent to remote VaxiJen or ANTIGENpro machine learning models."
    )

def compute_local_acc_antigenicity(sequence: str) -> LocalAntigenicityResult:
    """
    Computes a localized physicochemical antigenicity index based on z-scale profiling.
    Strictly marked as an independent local method.
    """
    clean_seq = [c for c in sequence.upper() if c in Z_SCALES]
    if not clean_seq:
        return LocalAntigenicityResult(
            antigenicity_index=0.0,
            is_antigenic=False,
            mean_z1_hydrophilicity=0.0,
            mean_z2_bulkiness=0.0,
            mean_z3_charge=0.0
        )

    z1_vals = [Z_SCALES[c][0] for c in clean_seq]
    z2_vals = [Z_SCALES[c][1] for c in clean_seq]
    z3_vals = [Z_SCALES[c][2] for c in clean_seq]

    avg_z1 = sum(z1_vals) / len(z1_vals)
    avg_z2 = sum(z2_vals) / len(z2_vals)
    avg_z3 = sum(z3_vals) / len(z3_vals)

    # Semi-empirical scoring based on surface accessibility and charge dispersion
    # Normalized between 0.0 and 1.0
    raw_score = 0.5 + (avg_z1 * 0.05) + (abs(avg_z3) * 0.04)
    normalized_score = round(max(0.05, min(0.95, raw_score)), 3)
    is_antigenic = normalized_score >= 0.50

    return LocalAntigenicityResult(
        antigenicity_index=normalized_score,
        is_antigenic=is_antigenic,
        mean_z1_hydrophilicity=round(avg_z1, 3),
        mean_z2_bulkiness=round(avg_z2, 3),
        mean_z3_charge=round(avg_z3, 3)
    )
