from fastapi import FastAPI
from . import models, database
from .routers import monitoreo
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Crear tablas si no existen
models.Base.metadata.create_all(bind=database.engine)

app.include_router(monitoreo.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


