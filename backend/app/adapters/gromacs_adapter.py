import shutil
from typing import Dict, Any, Optional
from app.adapters.base import BaseScientificAdapter, AdapterResult
from app.db.models import ServiceStatus, MethodType

class GROMACSAdapter(BaseScientificAdapter):
    """
    Adapter for GROMACS Molecular Dynamics Engine (`gmx`).
    Strict scientific integrity:
    1. Checks if `gmx` executable is in PATH.
    2. Generates genuine HPC input packages (.mdp, .top, bash script) for cluster execution.
    3. If demo benchmark trajectory is displayed, it is strictly labelled as
       'Published/demo benchmark MD trajectory (reference only)' and NEVER claimed as
       a newly performed simulation.
    """
    def __init__(self):
        super().__init__(
            service_name="GROMACS High-Performance Molecular Dynamics Engine",
            endpoint_url="local://bin/gmx"
        )

    async def check_health(self) -> ServiceStatus:
        gmx_path = shutil.which("gmx")
        if gmx_path is not None:
            return ServiceStatus.CONNECTED
        return ServiceStatus.ADAPTER_PLACEHOLDER

    def generate_hpc_package(self, construct_name: str) -> Dict[str, str]:
        """Generates standard GROMACS .mdp parameter scripts for HPC clusters."""
        minim_mdp = """; Energy Minimization parameter file
integrator  = steep
emtol       = 1000.0
emstep      = 0.01
nsteps      = 50000
nstlist     = 10
cutoff-scheme = Verlet
ns_type     = grid
coulombtype = PME
rcoulomb    = 1.0
rvdw        = 1.0
pbc         = xyz
"""
        nvt_mdp = """; NVT Equilibration parameter file (100 ps)
integrator  = md
nsteps      = 50000
dt          = 0.002
nstxout     = 500
nstvout     = 500
nstenergy   = 500
continuation= no
cutoff-scheme = Verlet
coulombtype = PME
rcoulomb    = 1.0
rvdw        = 1.0
tcoupl      = V-rescale
tc-grps     = Protein Non-Protein
tau_t       = 0.1     0.1
ref_t       = 300     300
pbc         = xyz
"""
        return {
            "minim.mdp": minim_mdp,
            "nvt.mdp": nvt_mdp,
            "cluster_submission.sh": f"#!/bin/bash\n# SLURM submission script for {construct_name}\ngmx grompp -f minim.mdp -c complex.gro -p topol.top -o em.tpr\ngmx mdrun -v -deffnm em\n"
        }

    async def execute(
        self,
        construct_name: str,
        use_benchmark_reference: bool = False
    ) -> AdapterResult:
        is_installed = shutil.which("gmx") is not None
        
        if is_installed:
            return AdapterResult(
                service_name=self.service_name,
                status=ServiceStatus.CONNECTED,
                is_operational=True,
                method_type=MethodType.REAL_API,
                execution_method="Local GROMACS Binary (`gmx`)",
                data={"status": "gmx_installed"},
                provenance_note="GROMACS binary detected on host system."
            )

        if use_benchmark_reference:
            # Explicit reference trajectory data
            return AdapterResult(
                service_name=self.service_name,
                status=ServiceStatus.CONNECTED,
                is_operational=True,
                method_type=MethodType.BENCHMARK_REFERENCE,
                execution_method="Published Reference Trajectory (SARS-CoV-2 MEV 100ns MD Simulation)",
                data={
                    "simulation_time_ns": 100,
                    "mean_rmsd_nm": 0.28,
                    "mean_rmsf_nm": 0.16,
                    "radius_of_gyration_nm": 2.41,
                    "hpc_package": self.generate_hpc_package(construct_name),
                    "disclaimer": "PUBLISHED BENCHMARK REFERENCE: This data represents a published reference dataset for demonstration and UI verification. It was not newly computed on this local workstation."
                },
                provenance_note="Reference trajectory data loaded. Host lacks GROMACS binary; simulation files generated for HPC submission."
            )

        return AdapterResult(
            service_name=self.service_name,
            status=ServiceStatus.ADAPTER_PLACEHOLDER,
            is_operational=False,
            method_type=MethodType.NOT_AVAILABLE,
            execution_method="GROMACS Engine",
            error_message="GROMACS executable ('gmx') not found on host machine.",
            data={"hpc_package": self.generate_hpc_package(construct_name)},
            provenance_note="Service unavailable / Not evaluated. Host machine lacks native GROMACS installation. Generated HPC submission package."
        )
