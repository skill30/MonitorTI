import psutil

def obtener_disco():
    try:
        disco = psutil.disk_usage('/')
        return {
            "disco_total": float(disco.total),
            "disco_usado": float(disco.used),
            "disco_percent": float(disco.percent)
        }
    except Exception as e:
        print(f"Error obteniendo disco: {e}")
        return {
            "disco_total": 0.0,
            "disco_usado": 0.0,
            "disco_percent": 0.0
        }
