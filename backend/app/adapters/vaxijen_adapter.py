import httpx
from app.adapters.base import BaseScientificAdapter, AdapterResult
from app.db.models import ServiceStatus, MethodType

class VaxiJenAdapter(BaseScientificAdapter):
    """
    Adapter for VaxiJen v2.0 server (Univ. of Sofia / DDMG).
    Known legacy service prone to outages.
    Transparently marks status as SERVICE_UNAVAILABLE when endpoint fails.
    NEVER labels any local heuristic as VaxiJen!
    """
    def __init__(self):
        super().__init__(
            service_name="VaxiJen v2.0 Antigenicity Server",
            endpoint_url="http://www.ddg-pharmfac.net/vaxijen/VaxiJen/VaxiJen.html"
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

    async def execute(self, sequence: str, target_type: str = "Virus") -> AdapterResult:
        """
        Attempts to submit sequence to VaxiJen web form.
        If service is unreachable, explicitly reports status without fabricating scores.
        """
        post_url = "http://www.ddg-pharmfac.net/vaxijen/scripts/VaxiJen_scripts.pl"
        payload = {
            "seq": sequence,
            "target": target_type.capitalize()
        }
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                res = await client.post(post_url, data=payload)
                if res.status_code == 200 and "Overall Prediction" in res.text:
                    # In case the legacy Perl script actually replies
                    is_antigen = "Probable ANTIGEN" in res.text
                    return AdapterResult(
                        service_name=self.service_name,
                        status=ServiceStatus.CONNECTED,
                        is_operational=True,
                        method_type=MethodType.REAL_API,
                        execution_method="VaxiJen v2.0 Web Form Response",
                        data={"is_antigen": is_antigen, "server_response": res.text[:200]},
                        provenance_note="Result obtained directly from remote VaxiJen v2.0 server."
                    )
                else:
                    return AdapterResult(
                        service_name=self.service_name,
                        status=ServiceStatus.SERVICE_UNAVAILABLE,
                        is_operational=False,
                        method_type=MethodType.NOT_AVAILABLE,
                        execution_method="Remote VaxiJen v2.0",
                        error_message="VaxiJen server did not return expected evaluation format.",
                        provenance_note="Service unavailable / Not evaluated by remote VaxiJen. Local fallback must be explicitly labelled separately."
                    )
        except Exception as e:
            return AdapterResult(
                service_name=self.service_name,
                status=ServiceStatus.SERVICE_UNAVAILABLE,
                is_operational=False,
                method_type=MethodType.NOT_AVAILABLE,
                execution_method="Remote VaxiJen v2.0",
                error_message=f"VaxiJen server unreachable: {str(e)}",
                provenance_note="Service unavailable / Not evaluated by remote VaxiJen server."
            )
