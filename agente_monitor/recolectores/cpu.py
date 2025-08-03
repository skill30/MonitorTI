import psutil

def obtener_cpu():
    return {"cpu_percent": psutil.cpu_percent(interval=1)}
