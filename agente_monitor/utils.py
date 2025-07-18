import requests
from config import SERVIDOR_URL, ID_EQUIPO, TOKEN

def enviar_datos(data):
    payload = {
        "equipo": ID_EQUIPO,
        "datos": data
    }
    headers = {"Authorization": f"Bearer {TOKEN}"}
    try:
        res = requests.post(SERVIDOR_URL, json=payload, headers=headers, timeout=5)
        print(f"Enviado: {res.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"Error al enviar: {e}")