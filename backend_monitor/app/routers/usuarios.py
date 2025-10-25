from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import models, schemas, database
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta

router = APIRouter(
    prefix="/api/usuarios",
    tags=["usuarios"]
)

# Contexto para hashear y verificar contraseñas
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Configuración del token JWT
SECRET_KEY = "Cisco123" # Cambia esto por una clave segura en producción
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# --- DB Dependency ---
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ===== Funciones auxiliares =====

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifica si una contraseña en texto plano coincide con su hash."""
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict) -> str:
    """Crea un token de acceso JWT."""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# ===== Endpoint de login =====
@router.post("/login")
def login(usuario: schemas.UsuarioLogin, db: Session = Depends(get_db)):
    """Autentica a un usuario y devuelve un token si las credenciales son válidas."""
    # Buscar al usuario en la base de datos
    user = db.query(models.Usuario).filter(models.Usuario.nombre == usuario.nombre).first()
    if not user or not verify_password(usuario.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Credenciales inválidas")

    # Crear un token de acceso
    access_token = create_access_token(data={"sub": user.nombre, "rol": user.rol})
    return {"access_token": access_token, "token_type": "bearer"}

# ===== Endpoint para registrar usuarios =====

@router.post("/register", response_model=schemas.Usuario)
def crear_usuario(usuario: schemas.UsuarioCreate, db: Session = Depends(get_db)):
    """Crea un nuevo usuario con la contraseña hasheada."""
    # Verificar si el usuario ya existe
    existente = db.query(models.Usuario).filter(models.Usuario.nombre == usuario.nombre).first()
    if existente:
        raise HTTPException(status_code=400, detail="El usuario ya existe")

    # Validar el tipo de dato de la contraseña
    if not isinstance(usuario.password, str):
        print("Tipo de password recibido:", type(usuario.password), usuario.password)
        raise HTTPException(status_code=400, detail="La contraseña debe ser una cadena de texto")

    # Truncar y hashear la contraseña
    hashed_password = pwd_context.hash(usuario.password[:72])

    # Crear el nuevo usuario
    nuevo_usuario = models.Usuario(
        nombre=usuario.nombre,
        hashed_password=hashed_password,
        rol=usuario.rol
    )

    db.add(nuevo_usuario)
    db.commit()
    db.refresh(nuevo_usuario)
    return nuevo_usuario

# ===== Endpoint para listar usuarios ======
@router.get("/", response_model=list[schemas.Usuario])
def listar_usuarios(db: Session = Depends(get_db)):
    """Lista todos los usuarios."""
    usuarios = db.query(models.Usuario).all()
    return usuarios


# ===== Endpoint para eliminar un usuario =====
@router.delete("/{usuario_id}")
def eliminar_usuario(usuario_id: int, db: Session = Depends(get_db)):
    """Elimina un usuario por su ID."""
    usuario = db.query(models.Usuario).filter(models.Usuario.id == usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    db.delete(usuario)
    db.commit()
    return {"detail": "Usuario eliminado exitosamente"}

# ===== Endpoint para actualizar un usuario =====
@router.put("/{user_id}", response_model=schemas.Usuario)
def actualizar_usuario(user_id: int, payload: schemas.UsuarioUpdate, db: Session = Depends(get_db)):
    u = db.query(models.Usuario).filter(models.Usuario.id == user_id).first()
    if not u:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    if payload.nombre is not None:
        u.nombre = payload.nombre
    if payload.rol is not None:
        u.rol = payload.rol
    # manejar cambio de contraseña: hashear si se recibe 'password'
    if payload.password is not None:
        # truncar a 72 antes de hashear (bcrypt)
        u.hashed_password = pwd_context.hash(payload.password[:72])
    db.add(u)
    db.commit()
    db.refresh(u)
    return u
