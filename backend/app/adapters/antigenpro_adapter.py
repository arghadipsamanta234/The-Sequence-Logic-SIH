import httpx
from app.adapters.base import BaseScientificAdapter, AdapterResult
from app.db.models import ServiceStatus, MethodType

class ANTIGENproAdapter(BaseScientificAdapter):
    """
    Adapter for ANTIGENpro (SCRATCH-1D suite, UC Irvine).
    Reports explicit status and never fabricates machine learning scores.
    """
    def __init__(self):
        super().__init__(
            service_name="ANTIGENpro (SCRATCH suite)",
            endpoint_url="http://scratch.proteomics.ics.uci.edu"
        )

    async def check_health(self) -> ServiceStatus:
        try:
            async with httpx.AsyncClient(timeout=3.0) as client:
                res = await client.get(self.endpoint_url)
                if res.status_code == 200:
                    return ServiceStatus.CONNECTED
                return ServiceStatus.SERVICE_UNAVAILABLE
        except Exception:
            return ServiceStatus.SERVICE_UNAVAILABLE

    async def execute(self, sequence: str) -> AdapterResult:
        """
        SCRATCH-1D requires email submission or command-line suite installation.
        Adapter transparently reports adapter status.
        """
        return AdapterResult(
            service_name=self.service_name,
            status=ServiceStatus.ADAPTER_PLACEHOLDER,
            is_operational=False,
            method_type=MethodType.NOT_AVAILABLE,
            execution_method="ANTIGENpro Web Service",
            error_message="ANTIGENpro requires asynchronous batch email submission or local SCRATCH suite binary.",
            provenance_note="Service unavailable / Not evaluated. Local ACC z-scale descriptor can be run separately as a distinct local method."
        )
