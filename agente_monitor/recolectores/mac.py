import uuid

def obtener_mac_local():
    """
    Devuelve la MAC del equipo en formato xx:xx:xx:xx:xx:xx
    Usa uuid.getnode() como método sencillo y portable.
    """
    try:
        mac_int = uuid.getnode()
        mac_str = ':'.join(f'{(mac_int >> ele) & 0xff:02x}' for ele in range(40, -1, -8))
        return mac_str
    except Exception as e:
        print(f"Error obteniendo MAC: {e}")
        return "00:00:00:00:00:00"