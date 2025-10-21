import psutil

def obtener_cpu():
    try:
        uso = psutil.cpu_percent(interval=1)
        return {
            "cpu_percent": float(uso)  # Aseguramos que sea float
        }
    except Exception as e:
        print(f"Error obteniendo CPU: {e}")
        return {"cpu_percent": 0.0}
