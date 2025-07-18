from pydantic import BaseModel
from typing import Dict
from datetime import datetime

# Modelo de entrada (POST)
class RegistroCreate(BaseModel):
    equipo: str
    datos: Dict[str, float]

# Modelo de salida (GET)
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

