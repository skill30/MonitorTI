# test_recolectores.py
from recolectores.cpu import obtener_cpu
from recolectores.memoria import obtener_memoria
from recolectores.disco import obtener_disco
from recolectores.red import obtener_red
from recolectores.mac import obtener_mac_local

print("CPU:", obtener_cpu())
print("Memoria:", obtener_memoria())
print("Disco:", obtener_disco())
print("Red:", obtener_red())
print("Mac_address:", obtener_mac_local())  # Ejemplo de obtención de MAC