import httpx
from typing import Any, Dict, List, Optional
from app.adapters.base import BaseScientificAdapter, AdapterResult
from app.db.models import ServiceStatus, MethodType

class IEDBAdapter(BaseScientificAdapter):
    def __init__(self):
        super().__init__(
            service_name="Immune Epitope Database (IEDB) Prediction API",
            endpoint_url="http://tools-api.iedb.org/tools_api"
        )

    async def check_health(self) -> ServiceStatus:
        """Check if IEDB API is reachable."""
        try:
            async with httpx.AsyncClient(timeout=4.0) as client:
                res = await client.get(f"{self.endpoint_url}/mhci/")
                # IEDB typically responds with 200 or 400 when active
                if res.status_code in [200, 400, 405]:
                    return ServiceStatus.CONNECTED
                return ServiceStatus.SERVICE_UNAVAILABLE
        except Exception:
            return ServiceStatus.SERVICE_UNAVAILABLE

    async def execute(
        self,
        sequence: str,
        allele: str = "HLA-A*02:01",
        length: int = 9,
        method: str = "recommended"
    ) -> AdapterResult:
        """
        Queries IEDB MHC-I prediction tool.
        If service is unavailable, reports explicit status and provenance.
        """
        api_url = f"{self.endpoint_url}/mhci/"
        payload = {
            "method": method,
            "sequence_text": sequence,
            "allele": allele,
            "length": str(length)
        }
        
        try:
            async with httpx.AsyncClient(timeout=8.0) as client:
                res = await client.post(api_url, data=payload)
                if res.status_code == 200 and len(res.text.strip()) > 0:
                    lines = [line.split("\t") for line in res.text.strip().split("\n") if line]
                    header = lines[0]
                    rows = lines[1:]
                    
                    epitopes = []
                    for row in rows[:10]: # Top 10
                        if len(row) >= 6:
                            epitopes.append({
                                "allele": row[0] if len(row) > 0 else allele,
                                "start": int(row[1]) if row[1].isdigit() else 1,
                                "end": int(row[2]) if row[2].isdigit() else length,
                                "peptide": row[5] if len(row) > 5 else "",
                                "score": float(row[-1]) if row[-1].replace('.', '', 1).isdigit() else 0.0,
                                "source_tool": "IEDB NetMHCpan/Recommended"
                            })
                    
                    return AdapterResult(
                        service_name=self.service_name,
                        status=ServiceStatus.CONNECTED,
                        is_operational=True,
                        method_type=MethodType.REAL_API,
                        execution_method="IEDB MHC-I Prediction REST API (v2023)",
                        data={"epitopes": epitopes, "count": len(epitopes)},
                        provenance_note=f"Calculated via remote IEDB API for allele {allele}, k-mer {length}."
                    )
                else:
                    return AdapterResult(
                        service_name=self.service_name,
                        status=ServiceStatus.SERVICE_UNAVAILABLE,
                        is_operational=False,
                        method_type=MethodType.REAL_API,
                        execution_method="IEDB MHC-I REST API",
                        error_message=f"IEDB API returned code {res.status_code}: {res.text[:100]}",
                        provenance_note="Remote IEDB server returned non-successful response."
                    )
        except Exception as e:
            return AdapterResult(
                service_name=self.service_name,
                status=ServiceStatus.SERVICE_UNAVAILABLE,
                is_operational=False,
                method_type=MethodType.REAL_API,
                execution_method="IEDB MHC-I REST API",
                error_message=f"IEDB server unreachable: {str(e)}",
                provenance_note="Remote IEDB server unreachable. Fallback must use separate local matrix labeling."
            )
