from fastapi import APIRouter, Depends, HTTPException, Header, Request
from sqlalchemy import func
from sqlalchemy.orm import Session
from fastapi.responses import HTMLResponse
from typing import List
from datetime import datetime, timedelta
import logging

from .. import models, schemas, database

router = APIRouter(

    prefix="/api"

)

TOKEN_ESPERADO = "secreto123"

# --- DB Dependency ---
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ============================
# VLAN Endpoints
# ============================

@router.post("/vlans/", response_model=schemas.VLAN)
def crear_vlan(vlan: schemas.VLANCreate, db: Session = Depends(get_db)):
    existente = db.query(models.VLAN).filter_by(nombre=vlan.nombre).first()
    if existente:
        raise HTTPException(status_code=400, detail="VLAN ya existe")
    nueva = models.VLAN(nombre=vlan.nombre)
    db.add(nueva)
    db.commit()
    db.refresh(nueva)
    return nueva

@router.get("/vlans/", response_model=List[schemas.VLAN])
def obtener_vlans(db: Session = Depends(get_db)):
    return db.query(models.VLAN).all()

# ============================
# Conteo de Equipos por VLAN
# ============================

@router.get("/vlans/equipos/conteo")
def conteo_equipos_por_vlan(db: Session = Depends(get_db)):
    resultados = (
        db.query(
            models.VLAN.nombre.label("vlan"),
            func.count(models.Equipo.id).label("total_equipos")
        )
        .join(models.Equipo, models.Equipo.vlan_id == models.VLAN.id)
        .group_by(models.VLAN.nombre)
        .all()
    )

    return [
        {"vlan": r.vlan, "total_equipos": r.total_equipos}
        for r in resultados
    ]

# ============================
# Equipo Endpoints
# ============================

logging.basicConfig(level=logging.INFO)

@router.post("/equipos/", response_model=schemas.EquipoCreate)
async def registrar_equipo(equipo: schemas.EquipoCreate, db: Session = Depends(get_db)):
    db_equipo = db.query(models.Equipo).filter(models.Equipo.nombre == equipo.nombre).first()
    if db_equipo:
        raise HTTPException(status_code=400, detail="El equipo ya está registrado")
    nuevo_equipo = models.Equipo(
        nombre=equipo.nombre,
        vlan_id=equipo.vlan_id,
        ip=equipo.ip,
        mac=equipo.mac
    )
    db.add(nuevo_equipo)
    db.commit()
    db.refresh(nuevo_equipo)
    return nuevo_equipo

@router.get("/equipos/", response_model=List[schemas.Equipo])
def obtener_equipos(db: Session = Depends(get_db)):

    return db.query(models.Equipo).all()

# ============================
# Registros
# ============================

@router.post("/registros/")
def recibir_data(payload: schemas.RegistroCreate, db: Session = Depends(get_db), authorization: str = Header(None)):
    if authorization != f"Bearer {TOKEN_ESPERADO}":

        raise HTTPException(status_code=401, detail="Token inválido")

    equipo = db.query(models.Equipo).filter_by(nombre=payload.equipo).first()
    if not equipo:
        
        raise HTTPException(status_code=404, detail="Equipo no encontrado")

    nuevo = models.Registro(
        equipo_id=equipo.id,
        cpu_percent=payload.datos.get("cpu_percent", 0),
        mem_total=payload.datos.get("mem_total", 0),
        mem_disponible=payload.datos.get("mem_disponible", 0),
        mem_uso_percent=payload.datos.get("mem_uso_percent", 0),
        disco_total=payload.datos.get("disco_total", 0),
        disco_usado=payload.datos.get("disco_usado", 0),
        disco_percent=payload.datos.get("disco_percent", 0),
        bytes_enviados=payload.datos.get("bytes_enviados", 0),      # <--- NUEVO
        bytes_recibidos=payload.datos.get("bytes_recibidos", 0),    # <--- NUEVO    
    )

    db.add(nuevo)
    db.commit()
    return {"status": "ok", "registro_id": nuevo.id}

# ============================
# Consultas de registros
# ============================

@router.get("/registros/", response_model=List[schemas.Registro])
def obtener_registros(db: Session = Depends(get_db)):
    registros = db.query(models.Registro).order_by(models.Registro.timestamp.desc()).all()
    return [
        schemas.Registro(
            id=r.id,
            equipo=r.equipo.nombre,
            cpu_percent=r.cpu_percent,
            mem_total=r.mem_total,
            mem_disponible=r.mem_disponible,
            mem_uso_percent=r.mem_uso_percent,
            disco_total=r.disco_total,
            disco_usado=r.disco_usado,
            disco_percent=r.disco_percent,
            bytes_enviados=r.bytes_enviados,
            bytes_recibidos=r.bytes_recibidos,
            timestamp=r.timestamp
        ) for r in registros
    ]


# ============================
# Consultas por VLAN o Equipo
# ============================

@router.get("/vlans/{vlan_id}/registros", response_model=List[schemas.Registro])
def registros_por_vlan(vlan_id: int, db: Session = Depends(get_db)):
    registros = (
        db.query(models.Registro)
        .join(models.Equipo)
        .filter(models.Equipo.vlan_id == vlan_id)
        .order_by(models.Registro.timestamp.desc())
        .limit(20)
        .all()
    )
    return [
        schemas.Registro(
            id=r.id,
            equipo=r.equipo.nombre,
            cpu_percent=r.cpu_percent,
            mem_total=r.mem_total,
            mem_disponible=r.mem_disponible,
            mem_uso_percent=r.mem_uso_percent,
            disco_total=r.disco_total,
            disco_usado=r.disco_usado,
            disco_percent=r.disco_percent,
            bytes_enviados=r.bytes_enviados,      # <-- asegúrate que esté aquí
            bytes_recibidos=r.bytes_recibidos,    # <-- asegúrate que esté aquí
            timestamp=r.timestamp
        ) for r in registros
    ]

@router.get("/equipos/{equipo_id}/registros", response_model=List[schemas.Registro])
def registros_por_equipo(equipo_id: int, db: Session = Depends(get_db)):
    registros = (
        db.query(models.Registro)
        .filter(models.Registro.equipo_id == equipo_id)
        .order_by(models.Registro.timestamp.desc())
        .limit(20)
        .all()
    )
    return [
        schemas.Registro(
            id=r.id,
            equipo=r.equipo.nombre,
            cpu_percent=r.cpu_percent,
            mem_total=r.mem_total,
            mem_disponible=r.mem_disponible,
            mem_uso_percent=r.mem_uso_percent,
            disco_total=r.disco_total,
            disco_usado=r.disco_usado,
            disco_percent=r.disco_percent,
            bytes_enviados=r.bytes_enviados,      # <-- asegúrate que esté aquí
            bytes_recibidos=r.bytes_recibidos,    # <-- asegúrate que esté aquí
            timestamp=r.timestamp
        ) for r in registros
    ]

# ============================
# Equipos caídos (sin registros recientes)
# ============================

@router.get("/equipos/caidos")
def equipos_caidos(db: Session = Depends(get_db)):
    # Considera "caído" si no tiene registros en los últimos 8 minutos
    hace_8_min = datetime.utcnow() - timedelta(minutes=8)
    equipos = db.query(models.Equipo).all()
    caidos = []
    for equipo in equipos:
        ultimo_registro = (
            db.query(models.Registro)
            .filter(models.Registro.equipo_id == equipo.id)
            .order_by(models.Registro.timestamp.desc())
            .first()
        )
        if not ultimo_registro or ultimo_registro.timestamp < hace_8_min:  # <-- corregido
            caidos.append({
                "id": equipo.id,
                "nombre": equipo.nombre,
                "vlan_id": equipo.vlan_id
            })
    return caidos
