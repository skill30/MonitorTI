import psutil

def obtener_red():
    net = psutil.net_io_counters()
    return {
        "bytes_enviados": net.bytes_sent,
        "bytes_recibidos": net.bytes_recv
    }
