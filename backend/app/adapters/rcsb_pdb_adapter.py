import httpx
from typing import Optional
from app.adapters.base import BaseScientificAdapter, AdapterResult
from app.db.models import ServiceStatus, MethodType

class RCSBPDBAdapter(BaseScientificAdapter):
    def __init__(self):
        super().__init__(
            service_name="RCSB Protein Data Bank (PDB) REST API",
            endpoint_url="https://data.rcsb.org/rest/v1/core/entry"
        )

    async def check_health(self) -> ServiceStatus:
        try:
            async with httpx.AsyncClient(timeout=4.0) as client:
                res = await client.get(f"{self.endpoint_url}/4HHB") # Hemoglobin benchmark
                if res.status_code == 200:
                    return ServiceStatus.CONNECTED
                return ServiceStatus.SERVICE_UNAVAILABLE
        except Exception:
            return ServiceStatus.SERVICE_UNAVAILABLE

    async def execute(self, pdb_id: str) -> AdapterResult:
        """Fetch experimental 3D coordinates & metadata from RCSB PDB."""
        clean_id = pdb_id.strip().upper()
        meta_url = f"{self.endpoint_url}/{clean_id}"
        file_url = f"https://files.rcsb.org/download/{clean_id}.pdb"
        
        try:
            async with httpx.AsyncClient(timeout=8.0) as client:
                meta_res = await client.get(meta_url)
                if meta_res.status_code == 200:
                    meta_data = meta_res.json()
                    title = meta_data.get("struct", {}).get("title", "")
                    resolution = (
                        meta_data.get("rcsb_entry_info", {})
                        .get("resolution_combined", [None])[0]
                    )
                    exp_method = meta_data.get("exptl", [{}])[0].get("method", "Unknown")
                    
                    return AdapterResult(
                        service_name=self.service_name,
                        status=ServiceStatus.CONNECTED,
                        is_operational=True,
                        method_type=MethodType.REAL_API,
                        execution_method="RCSB PDB Core REST API (v1)",
                        data={
                            "pdb_id": clean_id,
                            "title": title,
                            "resolution_angstrom": resolution,
                            "experimental_method": exp_method,
                            "download_url": file_url
                        },
                        provenance_note=f"Fetched experimental structure metadata for PDB ID {clean_id}."
                    )
                else:
                    return AdapterResult(
                        service_name=self.service_name,
                        status=ServiceStatus.CONNECTED,
                        is_operational=True,
                        method_type=MethodType.REAL_API,
                        execution_method="RCSB PDB Core REST API",
                        error_message=f"PDB ID '{clean_id}' not found (HTTP {meta_res.status_code}).",
                        provenance_note="Target PDB ID not found in RCSB repository."
                    )
        except Exception as e:
            return AdapterResult(
                service_name=self.service_name,
                status=ServiceStatus.SERVICE_UNAVAILABLE,
                is_operational=False,
                method_type=MethodType.REAL_API,
                execution_method="RCSB PDB Core REST API",
                error_message=f"Connection failed: {str(e)}",
                provenance_note="RCSB PDB service unreachable or timed out."
            )
