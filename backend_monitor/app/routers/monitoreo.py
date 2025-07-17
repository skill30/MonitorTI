from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from fastapi.responses import HTMLResponse
from typing import List

from .. import models, schemas, database

router = APIRouter()

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

TOKEN_ESPERADO = "secreto123"

@router.post("/api/data")
def recibir_data(payload: schemas.RegistroCreate, db: Session = Depends(get_db), authorization: str = Header(None)):
    if authorization != f"Bearer {TOKEN_ESPERADO}":
        raise HTTPException(status_code=401, detail="Token inválido")
    data = payload.datos
    nuevo = models.Registro(equipo=payload.equipo, **data)
    db.add(nuevo)
    db.commit()
    return {"status": "ok"}

@router.get("/api/registros", response_model=List[schemas.Registro])
def ver_registros_json(db: Session = Depends(get_db)):
    registros = db.query(models.Registro).order_by(models.Registro.timestamp.desc()).limit(20).all()
    return registros

@router.get("/registros", response_class=HTMLResponse)
def ver_registros_html(db: Session = Depends(get_db)):
    registros = db.query(models.Registro).order_by(models.Registro.timestamp.desc()).limit(20).all()

    html = """
    <html>
    <head>
        <title>Registros del Agente</title>
        <style>
            body { font-family: Arial, sans-serif; padding: 20px; background: #f9f9f9; }
            table { width: 100%; border-collapse: collapse; }
            th, td { padding: 8px 12px; border: 1px solid #ccc; text-align: left; }
            th { background: #444; color: #fff; }
            tr:nth-child(even) { background: #eee; }
        </style>
    </head>
    <body>
        <h1>Últimos 20 registros</h1>
        <table>
            <tr>
                <th>Equipo</th>
                <th>CPU (%)</th>
                <th>RAM usada (%)</th>
                <th>Disco (%)</th>
                <th>Red Enviada</th>
                <th>Red Recibida</th>
                <th>Hora</th>
            </tr>
    """

    for r in registros:
        html += f"""
        <tr>
            <td>{r.equipo}</td>
            <td>{r.cpu_percent:.1f}</td>
            <td>{r.mem_uso_percent:.1f}</td>
            <td>{r.disco_percent:.1f}</td>
            <td>{r.bytes_enviados:.0f}</td>
            <td>{r.bytes_recibidos:.0f}</td>
            <td>{r.timestamp.strftime('%Y-%m-%d %H:%M:%S')}</td>
        </tr>
        """

    html += "</table></body></html>"
    return html
