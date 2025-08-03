MonitorTI
proyecto que busca ser una apoyo para centralizar el monitoreo
de varias computadoras en un solo lugar y asi facilitar
diagnosticos predectivos de anomalias o patrones inusuales y 
poder prevenir algun tipo de fallas o taques.

el proyecto esta en desarrollo, aun no tiene instalador.
El programa solo se ejecuta desde terminal.

requisitos previos
- python instalado
- crear espacios virtuales es requisito para instalar las dependencias.
- tener postgresql instalado y modificar "backend_monitor/app/database.py" segun sus credenciales
- 
Recomendacion (no obligatorio) abrir cada carpeta en una ventana individual de visual
o del IDE que estes usando.

1) tener espacios virtuales (venv), en agente_monitor backend_monitor.
   python3 -m venv venv #el segundo venv es el nombre, se puede cambiar.
  
2) activar espacios virtuales en agente_monitor, backend_monitor.
   source venv/bin/activate. en windows ./venv/Scripts/activate o 
   venv\Scripts\activate.
  
3) en el espacio vitual hacer pip install -r requirements.txt
   si da error revisar el nombre del txt, por que los puse diferntes, tambien
   ver el directorio, tienen que estar en la carpeta raiz de la carpeta,
   si abriste la carpeta individual backend_monitor o en agente_monitor

4) si frontend da error hacer npm install o bun install,
   ademas hacer npx astro add tawilwindcss y npx astro add react.
   si eso tambien da error, hacer la isntalacion manual.

  Dependencias insaladas!!!
  cuando ya tengas dependencias de astro, agente_monitor y backend_monitor
  podos pasar a ejecutar y probar.

  1) ajecutar backend.
     uvicorn app.main:app --reload o -r (creo que funciona)
     este se encargara de crear las tablas necesarias si la url esta correcta
     si todo fue bien en la tabla vlans tendras que agregar un registro
     "id" = 1
     "nombre" = "VLAN 10"
  3) ejecutar agente.
     la primera ves que se ejecuta va a pedir que llenes algunos campos
     en nombre podes poner cualquiera y en vlan poner la opcion 1.


Ya tendrias el programa ejecutandose exitosamente y enviara cada 10seg 
estadisticas sin incluir "Bytes_enviados", "Bytes_recibidos"
