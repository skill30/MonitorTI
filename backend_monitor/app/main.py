from fastapi import FastAPI
from . import models, database
from .routers import monitoreo

app = FastAPI()

# Crear tablas si no existen
models.Base.metadata.create_all(bind=database.engine)

app.include_router(monitoreo.router)


