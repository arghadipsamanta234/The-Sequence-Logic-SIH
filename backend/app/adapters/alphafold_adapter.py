import httpx
from typing import Optional
from app.adapters.base import BaseScientificAdapter, AdapterResult
from app.db.models import ServiceStatus, MethodType

class AlphaFoldAdapter(BaseScientificAdapter):
    def __init__(self):
        super().__init__(
            service_name="AlphaFold Protein Structure Database API",
            endpoint_url="https://alphafold.ebi.ac.uk/api/prediction"
        )

    async def check_health(self) -> ServiceStatus:
        try:
            async with httpx.AsyncClient(timeout=4.0) as client:
                res = await client.get(f"{self.endpoint_url}/P0DTC2") # SARS-CoV-2 Spike
                if res.status_code == 200:
                    return ServiceStatus.CONNECTED
                return ServiceStatus.SERVICE_UNAVAILABLE
        except Exception:
            return ServiceStatus.SERVICE_UNAVAILABLE

    async def execute(self, uniprot_accession: str) -> AdapterResult:
        """Fetch predicted structure from AlphaFold EBI DB."""
        clean_acc = uniprot_accession.strip().upper()
        url = f"{self.endpoint_url}/{clean_acc}"
        
        try:
            async with httpx.AsyncClient(timeout=8.0) as client:
                res = await client.get(url)
                if res.status_code == 200:
                    entries = res.json()
                    if isinstance(entries, list) and len(entries) > 0:
                        entry = entries[0]
                        return AdapterResult(
                            service_name=self.service_name,
                            status=ServiceStatus.CONNECTED,
                            is_operational=True,
                            method_type=MethodType.REAL_API,
                            execution_method="AlphaFold DB Prediction API (v4)",
                            data={
                                "uniprot_accession": clean_acc,
                                "entry_id": entry.get("entryId"),
                                "pdb_url": entry.get("pdbUrl"),
                                "cif_url": entry.get("cifUrl"),
                                "mean_plddt": entry.get("globalMetricValue"),
                                "sequence_length": entry.get("uniprotEnd")
                            },
                            provenance_note=f"Retrieved real AlphaFold DB computed structure for {clean_acc}."
                        )
                return AdapterResult(
                    service_name=self.service_name,
                    status=ServiceStatus.CONNECTED,
                    is_operational=True,
                    method_type=MethodType.REAL_API,
                    execution_method="AlphaFold DB Prediction API",
                    error_message=f"No AlphaFold DB structure entry available for '{clean_acc}'.",
                    provenance_note="Query executed against AlphaFold DB; no entry found."
                )
        except Exception as e:
            return AdapterResult(
                service_name=self.service_name,
                status=ServiceStatus.SERVICE_UNAVAILABLE,
                is_operational=False,
                method_type=MethodType.REAL_API,
                execution_method="AlphaFold DB API",
                error_message=f"AlphaFold DB request failed: {str(e)}",
                provenance_note="AlphaFold DB endpoint unreachable or timed out."
            )
