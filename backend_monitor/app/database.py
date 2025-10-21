from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# URL de conexión (puede venir de .env)
SQLALCHEMY_DATABASE_URL = "postgresql://Capo:cisco123@10.0.0.138/monitoring_db"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()