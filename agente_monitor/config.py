import json
import os
import requests
import socket

CONFIG_FILE = "config_agente.json"
DEFAULT_CONFIG = {
    "id_equipo": "",
    "vlan": "",
    "servidor_url": "http://192.168.1.53:8000/api/registros/",
    "intervalo_segundos": 10,
    "token": "secreto123",
    "ip": None  # Inicializamos el campo IP
}

def obtener_vlans_disponibles(api_url, token):
    try:
        headers = {"Authorization": f"Bearer {token}"}
        res = requests.get(api_url.replace("/registros/", "/vlans/"), headers=headers, timeout=5)
        if res.status_code == 200:
            return res.json()
        else:
            print(f"⚠️  Error al obtener VLANs: {res.status_code}")
            return []
    except Exception as e:
        print(f"❌ Error de conexión al obtener VLANs: {e}")
        return []

def obtener_ip_local():
    """Obtiene la dirección IP local real del equipo."""
    try:
        # Crear un socket temporal para determinar la IP
        with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
            # Conectar a una dirección arbitraria (no se envían datos)
            s.connect(("8.8.8.8", 80))
            ip_local = s.getsockname()[0]
        return ip_local
    except Exception as e:
        print(f"❌ Error al obtener la IP local: {e}")
        return "0.0.0.0"

def registrar_equipo(nombre_equipo, nombre_vlan, servidor_url, token, lista_vlans):
    try:
        vlan_obj = next((v for v in lista_vlans if v["nombre"] == nombre_vlan), None)
        if not vlan_obj:
            print("❌ No se encontró el ID de la VLAN seleccionada.")
            return False

        url_equipo = servidor_url.replace("/registros/", "/equipos/")
        payload = {
            "nombre": nombre_equipo,
            "vlan_id": int(vlan_obj["id"]),
            "ip": obtener_ip_local()  # Asegúrate de incluir este campo
        }
        
        headers = {"Authorization": f"Bearer {token}"}
        res = requests.post(url_equipo, json=payload, headers=headers)

        if res.status_code == 200:
            print("✅ Equipo registrado correctamente.")
        elif res.status_code == 400:
            print("ℹ️  El equipo ya estaba registrado.")
        else:
            print(f"Payload enviado: {payload}")
            print(f"❌ Error al registrar el equipo: {res.status_code}")
        return True
    except Exception as e:
        print(f"❌ Error al registrar equipo: {e}")
        return False

def configurar_agente():
    print("⚙️  Configuración inicial del agente:")
    DEFAULT_CONFIG["id_equipo"] = input("🖥️  Nombre del equipo: ").strip()

    vlans = obtener_vlans_disponibles(DEFAULT_CONFIG["servidor_url"], DEFAULT_CONFIG["token"])
    if not vlans:
        print("❌ No se pudieron cargar las VLANs. Verifica la conexión o el token.")
        exit(1)

    print("🌐 VLANs disponibles:")
    for i, vlan in enumerate(vlans):
        print(f"  {i+1}. {vlan['nombre']}")

    while True:
        opcion = input("Selecciona el número de la VLAN: ").strip()
        if opcion.isdigit() and 1 <= int(opcion) <= len(vlans):
            DEFAULT_CONFIG["vlan"] = vlans[int(opcion) - 1]["nombre"]
            break
        else:
            print("❌ Opción no válida. Intenta de nuevo.")

    # Agregar la IP al diccionario de configuración
    DEFAULT_CONFIG["ip"] = obtener_ip_local()

    # Intentar registrar equipo
    exito = registrar_equipo(
        DEFAULT_CONFIG["id_equipo"],
        DEFAULT_CONFIG["vlan"],
        DEFAULT_CONFIG["servidor_url"],
        DEFAULT_CONFIG["token"],
        vlans
    )

    if not exito:
        print("❌ No se pudo registrar el equipo. Abortando configuración.")
        exit(1)

    # Guardar configuración solo si el registro fue exitoso
    with open(CONFIG_FILE, "w") as f:
        json.dump(DEFAULT_CONFIG, f, indent=4)
    print("✅ Configuración guardada en", CONFIG_FILE)

# Ejecutar configuración solo si no existe el archivo
if not os.path.exists(CONFIG_FILE):
    configurar_agente()

# Cargar configuración ya existente
with open(CONFIG_FILE, "r") as f:
    cfg = json.load(f)

ID_EQUIPO = cfg["id_equipo"]
VLAN = cfg["vlan"]
SERVIDOR_URL = cfg["servidor_url"]
INTERVALO_SEGUNDOS = cfg["intervalo_segundos"]
TOKEN = cfg["token"]
