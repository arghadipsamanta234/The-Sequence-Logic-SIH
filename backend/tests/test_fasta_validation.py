import pytest
from app.scientific.fasta_validator import validate_protein_fasta

def test_valid_fasta_protein():
    fasta = """>sp|P9WNK5|ESAT6_MYCTU 6 kDa early secretory antigenic target ESAT-6
MTEQQWNFAGIEAAASAIQGNVTSIHSLLDEGKQSLTKLAAAWGGSGSEAYQGVQQKWDATATELNNALQNLARTISEAGQAMASTEGNVTGMFA
"""
    result = validate_protein_fasta(fasta)
    assert result.is_valid is True
    assert result.length == 95
    assert len(result.errors) == 0
    assert result.molecular_weight is not None
    assert result.molecular_weight > 9000 # ~9.9 kDa
    assert result.isoelectric_point is not None
    assert len(result.sha256_hash) == 64

def test_invalid_characters_fasta():
    fasta = """>bad_seq\nMK1234$%^&ACDEF"""
    result = validate_protein_fasta(fasta)
    assert result.is_valid is False
    assert any("Illegal non-alphabetical characters" in e for e in result.errors)

def test_illegal_amino_acid_code():
    fasta = """>illegal_amino\nMKTLLJILAMV""" # 'J' is not a standard amino acid
    result = validate_protein_fasta(fasta)
    assert result.is_valid is False
    assert any("Invalid amino acid characters" in e for e in result.errors)

def test_empty_fasta():
    result = validate_protein_fasta("")
    assert result.is_valid is False
    assert "Empty sequence input provided." in result.errors

def test_accidental_nucleotide_sequence():
    fasta = """>dna_seq\nATGCGATCGATCGATCGATCGATCGAATCGATCGATCGATC"""
    result = validate_protein_fasta(fasta)
    assert result.is_nucleotide_suspect is True
    assert any("nucleotide" in w.lower() for w in result.warnings)
