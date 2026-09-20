import httpx
from typing import Any, Dict, Optional
from app.adapters.base import BaseScientificAdapter, AdapterResult
from app.db.models import ServiceStatus, MethodType

class NCBIAdapter(BaseScientificAdapter):
    def __init__(self):
        super().__init__(
            service_name="NCBI Entrez E-Utilities API",
            endpoint_url="https://eutils.ncbi.nlm.nih.gov/entrez/eutils"
        )

    async def check_health(self) -> ServiceStatus:
        try:
            async with httpx.AsyncClient(timeout=4.0) as client:
                res = await client.get(f"{self.endpoint_url}/einfo.fcgi?retmode=json")
                if res.status_code == 200:
                    return ServiceStatus.CONNECTED
                return ServiceStatus.SERVICE_UNAVAILABLE
        except Exception:
            return ServiceStatus.SERVICE_UNAVAILABLE

    async def execute(self, accession: str, db: str = "protein") -> AdapterResult:
        """Fetch protein or nucleotide sequence from NCBI Entrez."""
        fetch_url = f"{self.endpoint_url}/efetch.fcgi"
        params = {
            "db": db,
            "id": accession.strip(),
            "rettype": "fasta",
            "retmode": "text"
        }
        try:
            async with httpx.AsyncClient(timeout=8.0) as client:
                res = await client.get(fetch_url, params=params)
                if res.status_code == 200 and ">" in res.text:
                    lines = res.text.strip().split("\n")
                    header = lines[0].lstrip(">")
                    seq = "".join(lines[1:]).replace(" ", "").replace("\r", "")
                    
                    return AdapterResult(
                        service_name=self.service_name,
                        status=ServiceStatus.CONNECTED,
                        is_operational=True,
                        method_type=MethodType.REAL_API,
                        execution_method="NCBI Entrez efetch (v2.0)",
                        data={
                            "accession": accession,
                            "header": header,
                            "sequence": seq,
                            "length": len(seq),
                            "source": "NCBI_Entrez"
                        },
                        provenance_note=f"Fetched biological record from NCBI database '{db}' via efetch.fcgi."
                    )
                else:
                    return AdapterResult(
                        service_name=self.service_name,
                        status=ServiceStatus.CONNECTED,
                        is_operational=True,
                        method_type=MethodType.REAL_API,
                        execution_method="NCBI Entrez efetch",
                        error_message=f"Accession '{accession}' not found in NCBI '{db}' or returned non-FASTA response.",
                        provenance_note="Query executed against NCBI; target accession was empty or invalid."
                    )
        except Exception as e:
            return AdapterResult(
                service_name=self.service_name,
                status=ServiceStatus.SERVICE_UNAVAILABLE,
                is_operational=False,
                method_type=MethodType.REAL_API,
                execution_method="NCBI Entrez efetch",
                error_message=f"NCBI Entrez request failed: {str(e)}",
                provenance_note="NCBI Entrez endpoint unreachable or timed out."
            )
