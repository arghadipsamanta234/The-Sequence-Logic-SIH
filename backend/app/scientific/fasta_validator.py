import io
import re
from typing import Optional, List, Tuple
from Bio import SeqIO
from Bio.SeqUtils.ProtParam import ProteinAnalysis
from pydantic import BaseModel
from app.core.provenance import compute_sha256

STANDARD_AMINO_ACIDS = set("ACDEFGHIKLMNPQRSTVWY")
AMBIGUOUS_AMINO_ACIDS = set("BZXUO") # B (Asx), Z (Glx), X (any), U (Sec), O (Pyl)

class FASTAValidationResult(BaseModel):
    is_valid: bool
    sequence: str
    header: str
    length: int
    sha256_hash: str
    errors: List[str] = []
    warnings: List[str] = []
    is_nucleotide_suspect: bool = False
    molecular_weight: Optional[float] = None
    isoelectric_point: Optional[float] = None
    gravy: Optional[float] = None
    instability_index: Optional[float] = None

def validate_protein_fasta(fasta_content: str) -> FASTAValidationResult:
    """
    Validates FASTA protein sequence using Biopython SeqIO.
    Strictly checks IUPAC protein alphabet and catches accidental nucleotide inputs.
    """
    errors: List[str] = []
    warnings: List[str] = []
    
    clean_text = fasta_content.strip()
    if not clean_text:
        return FASTAValidationResult(
            is_valid=False,
            sequence="",
            header="",
            length=0,
            sha256_hash="",
            errors=["Empty sequence input provided."]
        )

    # Format into FASTA if bare sequence was provided
    if not clean_text.startswith(">"):
        clean_text = f">Custom_Sequence\n{clean_text}"

    try:
        record = SeqIO.read(io.StringIO(clean_text), "fasta")
    except ValueError as e:
        # Multiple records or bad formatting
        try:
            records = list(SeqIO.parse(io.StringIO(clean_text), "fasta"))
            if not records:
                return FASTAValidationResult(
                    is_valid=False,
                    sequence="",
                    header="",
                    length=0,
                    sha256_hash="",
                    errors=["No valid FASTA records parsed."]
                )
            if len(records) > 1:
                warnings.append(f"Multiple sequences detected ({len(records)}). Analyzing the primary record: {records[0].id}")
            record = records[0]
        except Exception as parse_err:
            return FASTAValidationResult(
                is_valid=False,
                sequence="",
                header="",
                length=0,
                sha256_hash="",
                errors=[f"FASTA parsing failure: {str(parse_err)}"]
            )
    except Exception as e:
        return FASTAValidationResult(
            is_valid=False,
            sequence="",
            header="",
            length=0,
            sha256_hash="",
            errors=[f"Failed to read FASTA: {str(e)}"]
        )

    raw_seq = str(record.seq).upper().replace(" ", "").replace("\r", "").replace("\n", "").replace("*", "")
    header = str(record.description)

    if len(raw_seq) == 0:
        errors.append("Sequence contains zero residues.")
        return FASTAValidationResult(
            is_valid=False,
            sequence="",
            header=header,
            length=0,
            sha256_hash="",
            errors=errors
        )

    # Check for invalid non-alphabetical characters
    invalid_chars = set(re.findall(r"[^A-Z]", raw_seq))
    if invalid_chars:
        errors.append(f"Illegal non-alphabetical characters found: {', '.join(sorted(invalid_chars))}")

    # Check for ambiguous amino acids
    ambiguous_found = set(raw_seq) & AMBIGUOUS_AMINO_ACIDS
    if ambiguous_found:
        warnings.append(f"Ambiguous or non-standard amino acid codes detected: {', '.join(sorted(ambiguous_found))}")

    # Check for illegal amino acids (e.g. J)
    illegal_amino = set(raw_seq) - STANDARD_AMINO_ACIDS - AMBIGUOUS_AMINO_ACIDS
    if illegal_amino:
        errors.append(f"Invalid amino acid characters: {', '.join(sorted(illegal_amino))}")

    # Check if input looks like DNA/RNA instead of Protein
    nt_chars = set("ATCGUN")
    if len(raw_seq) > 20 and (set(raw_seq).issubset(nt_chars) or sum(raw_seq.count(c) for c in "ATCGU") / len(raw_seq) > 0.90):
        warnings.append("Input composition strongly resembles nucleotide (DNA/RNA) rather than amino acid sequence.")

    sha256_hash = compute_sha256(raw_seq)

    # If valid standard amino acids, compute Biopython ProtParam physicochemical indices
    mw, pi, gravy, instability = None, None, None, None
    if not errors and not (set(raw_seq) & set("BZXUO")):
        try:
            analysis = ProteinAnalysis(raw_seq)
            mw = round(analysis.molecular_weight(), 2)
            pi = round(analysis.isoelectric_point(), 2)
            gravy = round(analysis.gravy(), 3)
            instability = round(analysis.instability_index(), 2)
        except Exception:
            pass

    return FASTAValidationResult(
        is_valid=len(errors) == 0,
        sequence=raw_seq,
        header=header,
        length=len(raw_seq),
        sha256_hash=sha256_hash,
        errors=errors,
        warnings=warnings,
        is_nucleotide_suspect="nucleotide" in "".join(warnings),
        molecular_weight=mw,
        isoelectric_point=pi,
        gravy=gravy,
        instability_index=instability
    )
