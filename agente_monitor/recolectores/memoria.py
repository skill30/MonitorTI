import psutil

def obtener_memoria():
    try:
        mem = psutil.virtual_memory()
        return {
            "mem_total": float(mem.total),
            "mem_disponible": float(mem.available),
            "mem_uso_percent": float(mem.percent)
        }
    
    except Exception as e:
        print(f"Error obteniendo memoria: {e}")
        return {
            "mem_total": 0.0,
            "mem_disponible": 0.0,
            "mem_uso_percent": 0.0
        }