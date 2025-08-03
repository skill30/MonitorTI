#agente_monitor es la carpeta principal donde se encuentran los recolectores cpu, disco, memoria, red, en este archivo
#agente se importan los recolectores y se imprime un indicador para saber si el agente inicio correctamente.
# despues entramos en bucle para repetir el proceso hasta que sea interrumpido.
import schedule
import time
from config import INTERVALO_SEGUNDOS
from recolectores.cpu import obtener_cpu
from recolectores.memoria import obtener_memoria
from recolectores.disco import obtener_disco
from recolectores.red import obtener_red
from utils import enviar_datos 



def ciclo():    
    data = {}
    data.update(obtener_cpu())
    data.update(obtener_memoria())
    data.update(obtener_disco())
    data.update(obtener_red())
    enviar_datos(data)

schedule.every(INTERVALO_SEGUNDOS).seconds.do(ciclo)

print("🟢 Agente iniciado.")
while True:
    schedule.run_pending()
    time.sleep(1)