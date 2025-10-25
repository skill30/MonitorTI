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
    mac: Optional[str] = None

class EquipoCreate(BaseModel):
    nombre: str
    vlan_id: int
    ip: str
    mac: str
    
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
    bytes_enviados: float
    bytes_recibidos: float
    timestamp: datetime

    class Config:
        from_attributes = True

# ===== Usuario =====

class UsuarioBase(BaseModel):
    nombre: str
    rol: str

class UsuarioCreate(BaseModel):
    nombre: str
    password: str  # Contraseña en texto plano para el registro
    rol: str

class UsuarioUpdate(BaseModel):
    nombre: Optional[str] = None
    rol: Optional[str] = None
    password: Optional[str] = None  # Nueva contraseña en texto plano

class UsuarioLogin(BaseModel):
    nombre: str
    password: str

class Usuario(UsuarioBase):
    id: int

    class Config:
        from_attributes = True


