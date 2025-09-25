from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy import func
from sqlalchemy.orm import Session
from fastapi.responses import HTMLResponse
from typing import List

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
# Equipo Endpoints
# ============================

@router.post("/equipos/", response_model=schemas.Equipo)
def registrar_equipo(equipo: schemas.EquipoCreate, db: Session = Depends(get_db)):
    vlan = db.query(models.VLAN).filter_by(id=equipo.vlan_id).first()
    if not vlan:
        raise HTTPException(status_code=404, detail="VLAN no encontrada")
    nuevo = models.Equipo(nombre=equipo.nombre, vlan_id=equipo.vlan_id)
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo

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
        disco_percent=payload.datos.get("disco_percent", 0)
    )
    db.add(nuevo)
    db.commit()
    return {"status": "ok", "registro_id": nuevo.id}

@router.get("/registros/agrupados")
def obtener_registros_agrupados(
    rango: str = "day",  # puede ser "hour", "day", "week", "month"
    db: Session = Depends(get_db)
):
    if rango not in ["hour", "day", "week", "month"]:
        return {"error": "Rango no válido. Usa: hour, day, week, month"}

    registros = (
        db.query(
            func.date_trunc(rango, models.Registro.timestamp).label("periodo"),
            func.avg(models.Registro.cpu_percent).label("cpu_promedio"),
            func.avg(models.Registro.mem_uso_percent).label("memoria_promedio"),
            func.avg(models.Registro.disco_percent).label("disco_promedio"),
        )
        .group_by(func.date_trunc(rango, models.Registro.timestamp))
        .order_by(func.date_trunc(rango, models.Registro.timestamp))
        .all()
    )

    return [
        {
            "periodo": r.periodo,
            "cpu_promedio": float(r.cpu_promedio),
            "memoria_promedio": float(r.memoria_promedio),
            "disco_promedio": float(r.disco_promedio),
        }
        for r in registros
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
            timestamp=r.timestamp
        ) for r in registros
    ]
