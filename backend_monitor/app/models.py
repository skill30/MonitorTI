from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime
from .database import Base

class Registro(Base):
    __tablename__ = "registros"
    id = Column(Integer, primary_key=True, index=True)
    equipo = Column(String, index=True)
    cpu_percent = Column(Float)
    mem_total = Column(Float)
    mem_disponible = Column(Float)
    mem_uso_percent = Column(Float)
    disco_total = Column(Float)
    disco_usado = Column(Float)
    disco_percent = Column(Float)
    bytes_enviados = Column(Float)
    bytes_recibidos = Column(Float)
    timestamp = Column(DateTime, default=datetime.utcnow)
