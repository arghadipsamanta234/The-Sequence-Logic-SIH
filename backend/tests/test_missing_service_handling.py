import pytest
from app.adapters.antigenpro_adapter import ANTIGENproAdapter
from app.adapters.docking_adapter import DockingAdapter
from app.adapters.gromacs_adapter import GROMACSAdapter
from app.db.models import ServiceStatus, MethodType

@pytest.mark.asyncio
async def test_antigenpro_explicit_placeholder():
    adapter = ANTIGENproAdapter()
    result = await adapter.execute("MFVFLVLLPLVSSQC")
    assert result.is_operational is False
    assert result.status == ServiceStatus.ADAPTER_PLACEHOLDER
    assert result.method_type == MethodType.NOT_AVAILABLE
    assert "Service unavailable / Not evaluated" in result.provenance_note

@pytest.mark.asyncio
async def test_docking_missing_binary_handling():
    adapter = DockingAdapter()
    # Without benchmark flag, it should report missing binary honestly
    result = await adapter.execute(ligand_pdb_content="", use_benchmark_reference=False)
    if not result.is_operational:
        assert result.status == ServiceStatus.ADAPTER_PLACEHOLDER
        assert result.method_type == MethodType.NOT_AVAILABLE
        assert "Service unavailable / Not evaluated" in result.provenance_note
        assert "vina" in result.error_message.lower()

@pytest.mark.asyncio
async def test_docking_benchmark_reference_transparency():
    adapter = DockingAdapter()
    result = await adapter.execute(ligand_pdb_content="", use_benchmark_reference=True)
    assert result.is_operational is True
    assert result.method_type == MethodType.BENCHMARK_REFERENCE
    assert "PUBLISHED BENCHMARK REFERENCE" in result.data["disclaimer"]
    assert "was not executed" in result.provenance_note

@pytest.mark.asyncio
async def test_gromacs_missing_binary_and_hpc_package_generation():
    adapter = GROMACSAdapter()
    # Test generation of HPC input parameter files
    result = await adapter.execute(construct_name="MEV-01", use_benchmark_reference=False)
    if not result.is_operational:
        assert result.status == ServiceStatus.ADAPTER_PLACEHOLDER
        assert "minim.mdp" in result.data["hpc_package"]
        assert "nvt.mdp" in result.data["hpc_package"]
        assert "cluster_submission.sh" in result.data["hpc_package"]
        assert "Service unavailable / Not evaluated" in result.provenance_note
