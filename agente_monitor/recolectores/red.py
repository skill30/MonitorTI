import psutil

def obtener_red():
    try:
        net = psutil.net_io_counters()
        return {
            "bytes_enviados": float(net.bytes_sent),
            "bytes_recibidos": float(net.bytes_recv)
        }
    except Exception as e:
        print(f"Error obteniendo red: {e}")
        return {
            "bytes_enviados": 0.0,
            "bytes_recibidos": 0.0
        }