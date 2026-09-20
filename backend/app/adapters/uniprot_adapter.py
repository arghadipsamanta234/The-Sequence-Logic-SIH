import httpx
from typing import Any, Dict, Optional
from app.adapters.base import BaseScientificAdapter, AdapterResult
from app.db.models import ServiceStatus, MethodType

class UniProtAdapter(BaseScientificAdapter):
    def __init__(self):
        super().__init__(
            service_name="UniProt Knowledgebase REST API",
            endpoint_url="https://rest.uniprot.org/uniprotkb"
        )

    async def check_health(self) -> ServiceStatus:
        try:
            async with httpx.AsyncClient(timeout=4.0) as client:
                res = await client.get(f"{self.endpoint_url}/P0DTC2.json")
                if res.status_code == 200:
                    return ServiceStatus.CONNECTED
                return ServiceStatus.SERVICE_UNAVAILABLE
        except Exception:
            return ServiceStatus.SERVICE_UNAVAILABLE

    async def execute(self, accession: str) -> AdapterResult:
        """Fetch protein record and sequence from UniProt KB."""
        url = f"{self.endpoint_url}/{accession.strip().upper()}.json"
        try:
            async with httpx.AsyncClient(timeout=8.0) as client:
                res = await client.get(url)
                if res.status_code == 200:
                    data = res.json()
                    seq_entry = data.get("sequence", {})
                    organism_entry = data.get("organism", {})
                    protein_desc = data.get("proteinDescription", {})
                    
                    recommended_name = (
                        protein_desc.get("recommendedName", {})
                        .get("fullName", {})
                        .get("value", "Unknown Protein")
                    )
                    
                    extracted = {
                        "accession": accession.upper(),
                        "name": recommended_name,
                        "organism": organism_entry.get("scientificName", "Unknown Organism"),
                        "tax_id": organism_entry.get("taxonId"),
                        "sequence": seq_entry.get("value", "").replace("\n", "").strip(),
                        "length": seq_entry.get("length", 0),
                        "source": "UniProtKB",
                        "raw_json_preview": data.get("entryType")
                    }
                    return AdapterResult(
                        service_name=self.service_name,
                        status=ServiceStatus.CONNECTED,
                        is_operational=True,
                        method_type=MethodType.REAL_API,
                        execution_method="UniProtKB REST API (v2024_01)",
                        data=extracted,
                        provenance_note=f"Retrieved real record for accession {accession} from {url}."
                    )
                elif res.status_code == 404:
                    return AdapterResult(
                        service_name=self.service_name,
                        status=ServiceStatus.CONNECTED,
                        is_operational=True,
                        method_type=MethodType.REAL_API,
                        execution_method="UniProtKB REST API",
                        error_message=f"Accession '{accession}' not found in UniProt Knowledgebase (HTTP 404).",
                        provenance_note="Query executed against UniProtKB; target accession does not exist."
                    )
                else:
                    return AdapterResult(
                        service_name=self.service_name,
                        status=ServiceStatus.SERVICE_UNAVAILABLE,
                        is_operational=False,
                        method_type=MethodType.REAL_API,
                        execution_method="UniProtKB REST API",
                        error_message=f"UniProtKB returned HTTP error {res.status_code}.",
                        provenance_note="Service responded with error code."
                    )
        except Exception as e:
            return AdapterResult(
                service_name=self.service_name,
                status=ServiceStatus.SERVICE_UNAVAILABLE,
                is_operational=False,
                method_type=MethodType.REAL_API,
                execution_method="UniProtKB REST API",
                error_message=f"Connection failed: {str(e)}",
                provenance_note="UniProtKB endpoint unreachable or timed out. Falling back to local manual entry."
            )
