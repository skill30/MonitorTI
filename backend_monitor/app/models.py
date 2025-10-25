from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class VLAN(Base):
    __tablename__ = "vlans"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, unique=True, nullable=False)
    equipos = relationship("Equipo", back_populates="vlan")


class Equipo(Base):
    __tablename__ = "equipos"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    vlan_id = Column(Integer, ForeignKey("vlans.id"))
    ip = Column(String, nullable=False)  # Agregar esta columna
    mac = Column(String, nullable=False)  # Agregar esta columnas

    vlan = relationship("VLAN", back_populates="equipos")
    registros = relationship("Registro", back_populates="equipo")

class Registro(Base):
    __tablename__ = "registros"

    id = Column(Integer, primary_key=True, index=True)
    equipo_id = Column(Integer, ForeignKey("equipos.id"), nullable=False)
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

    equipo = relationship("Equipo", back_populates="registros")

class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, unique=True, nullable=False)  # Nombre de usuario único
    hashed_password = Column(String, nullable=False)  # Contraseña hasheada
    rol = Column(String, nullable=False)  # Rol del usuario (e.g., admin, user)