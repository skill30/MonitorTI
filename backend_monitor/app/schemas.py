from pydantic import BaseModel
from typing import Dict, Optional
from datetime import datetime

# ===== VLAN =====

class VLANBase(BaseModel):
    nombre: str

class VLANCreate(VLANBase):
    pass

class VLAN(VLANBase):
    id: int

    class Config:
        from_attributes = True

# ===== Equipo =====

class EquipoBase(BaseModel):
    nombre: str
    vlan_id: int

class EquipoCreate(EquipoBase):
    pass

class Equipo(EquipoBase):
    id: int

    class Config:
        from_attributes = True

# ===== Registro =====

# Modelo para recibir datos al hacer POST (desde agente o interfaz)
class RegistroCreate(BaseModel):
    equipo: str  # nombre del equipo
    datos: Dict[str, float]

# Modelo para devolver datos al hacer GET
class Registro(BaseModel):
    id: int
    equipo: str
    cpu_percent: float
    mem_total: float
    mem_disponible: float
    mem_uso_percent: float
    disco_total: float
    disco_usado: float
    disco_percent: float
    timestamp: datetime

    class Config:
        from_attributes = True

