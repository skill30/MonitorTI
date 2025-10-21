import asyncio
import aiohttp
from datetime import datetime, timezone
from config import ID_EQUIPO, VLAN, SERVIDOR_URL, TOKEN
from recolectores.cpu import obtener_cpu
from recolectores.memoria import obtener_memoria
from recolectores.disco import obtener_disco
from recolectores.red import obtener_red
import traceback

class AgenteMonitor:
    def __init__(self):
        self.buffer_datos = []
        self.tamano_lote = 10  # Número de registros antes de enviar
        self.intervalo_envio = 30  # Segundos entre envíos

    async def recolectar_datos(self):
        try:

            cpu_datos = obtener_cpu()
            memoria_datos = obtener_memoria()
            disco_datos = obtener_disco()
            red_datos = obtener_red()

            # Formatear datos según el esquema RegistroCreate (usar claves reales)
            datos = {
                "equipo": ID_EQUIPO,
                "datos": {
                    "cpu_percent": float(cpu_datos.get("cpu_percent", 0.0)),
                    "mem_total": float(memoria_datos.get("mem_total", 0.0)),
                    "mem_disponible": float(memoria_datos.get("mem_disponible", 0.0)),
                    "mem_uso_percent": float(memoria_datos.get("mem_uso_percent", 0.0)),
                    "disco_total": float(disco_datos.get("disco_total", 0.0)),
                    "disco_usado": float(disco_datos.get("disco_usado", 0.0)),
                    "disco_percent": float(disco_datos.get("disco_percent", 0.0)),
                    "bytes_enviados": float(red_datos.get("bytes_enviados", 0.0)),
                    "bytes_recibidos": float(red_datos.get("bytes_recibidos", 0.0))
                },
                "fecha": datetime.now(timezone.utc).isoformat()
            }

            # Debug: mostrar payload que se añadirá al buffer
            print("Debug - Payload recolectado:", datos)

            self.buffer_datos.append(datos)
            
            if len(self.buffer_datos) >= self.tamano_lote:
                await self.enviar_lote()
                
        except Exception as e:
            print(f"❌ Error al recolectar datos: {str(e)}")
            print(f"Traza completa:", traceback.format_exc())

    async def enviar_lote(self):
        if not self.buffer_datos:
            return

        headers = {
            "Authorization": f"Bearer {TOKEN}",
            "Content-Type": "application/json"
        }

        async with aiohttp.ClientSession() as session:
            try:
                # Enviar registros uno por uno en lugar de enviar el lote completo
                for datos in self.buffer_datos:
                    # Debug antes de enviar
                    print("Debug - Enviando registro al servidor:", datos)
                    async with session.post(
                        SERVIDOR_URL,
                        json=datos,
                        headers=headers
                    ) as response:
                        resp_text = await response.text()
                        if response.status in (200, 201):
                            print(f"✅ Registro enviado exitosamente (status {response.status})")
                        else:
                            print(f"❌ Error al enviar datos: {response.status}")
                            print(f"Respuesta del servidor: {resp_text}")
                            print(f"Datos enviados: {datos}")
                            # no hacemos break, intentamos con los demás
                            continue

                # Limpiar buffer solo si pasaron los envíos
                self.buffer_datos = []
                
            except Exception as e:
                print(f"❌ Error de conexión: {str(e)}")
                print(traceback.format_exc())

    async def ejecutar(self):
        print("🟢 Agente iniciado (modo asíncrono)")
        while True:
            try:
                await self.recolectar_datos()
                
                # Si hay datos en buffer, esperar intervalo_envio y enviar
                if len(self.buffer_datos) > 0:
                    await asyncio.sleep(self.intervalo_envio)
                    await self.enviar_lote()
                
                await asyncio.sleep(10)  # Intervalo de recolección
            except Exception as e:
                print(f"❌ Error en el ciclo principal: {str(e)}")
                await asyncio.sleep(5)

if __name__ == "__main__":
    agente = AgenteMonitor()
    asyncio.run(agente.ejecutar())