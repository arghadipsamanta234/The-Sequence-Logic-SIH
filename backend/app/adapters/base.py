from abc import ABC, abstractmethod
from typing import Any, Dict, Optional
from pydantic import BaseModel
from app.db.models import ServiceStatus, MethodType

class AdapterResult(BaseModel):
    service_name: str
    status: ServiceStatus
    is_operational: bool
    method_type: MethodType
    execution_method: str
    data: Optional[Dict[str, Any]] = None
    error_message: Optional[str] = None
    provenance_note: str

class BaseScientificAdapter(ABC):
    """
    Abstract base class for all scientific data and simulation adapters.
    Strictly enforces transparent reporting of operational status.
    """
    def __init__(self, service_name: str, endpoint_url: str):
        self.service_name = service_name
        self.endpoint_url = endpoint_url

    @abstractmethod
    async def check_health(self) -> ServiceStatus:
        """Ping or check availability of the service or local tool."""
        pass

    @abstractmethod
    async def execute(self, *args, **kwargs) -> AdapterResult:
        """Execute query or simulation. Never fabricate results if unavailable."""
        pass
