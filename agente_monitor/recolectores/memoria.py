import psutil

def obtener_memoria():
    mem = psutil.virtual_memory()
    return {
        "mem_total": mem.total,
        "mem_disponible": mem.available,
        "mem_uso_percent": mem.percent
    }