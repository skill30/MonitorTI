import psutil

def obtener_disco():
    disco = psutil.disk_usage('/')
    return {
        "disco_total": disco.total,
        "disco_usado": disco.used,
        "disco_percent": disco.percent
    }
