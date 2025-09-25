export default function Reporte() {
  return (
    
    <div className="space-y-8">
      {/* Encabezado */}
      <section className="p-6 bg-gray-100 rounded-md shadow">
        <h1 className="text-2xl font-bold">Reportes</h1>
        <p className="text-gray-600">Visualiza métricas y registros históricos de la red.</p>
      </section>

      {/* Filtros */}
      <section className="p-6 bg-gray-100 rounded-md shadow">
        <h2 className="text-lg font-semibold mb-4">Filtros</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-700">Rango de fechas</label>
            <input type="date" className="mt-1 px-3 py-2 border rounded-md w-full" />
          </div>
          <div>
            <label className="block text-sm text-gray-700">VLAN</label>
            <select className="mt-1 px-3 py-2 border rounded-md w-full">
              <option>Seleccionar VLAN</option>
              <option>VLAN 10</option>
              <option>VLAN 20</option>
              <option>VLAN 30</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-700">Dispositivo</label>
            <select className="mt-1 px-3 py-2 border rounded-md w-full">
              <option>Seleccionar dispositivo</option>
              <option>Router</option>
              <option>Switch</option>
              <option>Servidor</option>
            </select>
          </div>
        </div>
        <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Generar reporte
        </button>
      </section>

      {/* Métricas */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-gray-100 rounded-md shadow text-center">
          <h3 className="text-sm text-gray-600">Total de registros</h3>
          <p className="text-2xl font-bold">1,254</p>
        </div>
        <div className="p-6 bg-gray-100 rounded-md shadow text-center">
          <h3 className="text-sm text-gray-600">Equipos conectados</h3>
          <p className="text-2xl font-bold">37</p>
        </div>
        <div className="p-6 bg-gray-100 rounded-md shadow text-center">
          <h3 className="text-sm text-gray-600">Alertas detectadas</h3>
          <p className="text-2xl font-bold text-red-600">5</p>
        </div>
      </section>

      {/* Tabla de registros */}
      <section className="p-6 bg-gray-100 rounded-md shadow">
        <h2 className="text-lg font-semibold mb-4">Registros recientes</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 border">Fecha</th>
                <th className="px-4 py-2 border">VLAN</th>
                <th className="px-4 py-2 border">Dispositivo</th>
                <th className="px-4 py-2 border">Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-center">
                <td className="px-4 py-2 border">12/09/2025</td>
                <td className="px-4 py-2 border">10</td>
                <td className="px-4 py-2 border">Router</td>
                <td className="px-4 py-2 border text-green-600">Activo</td>
              </tr>
              <tr className="text-center">
                <td className="px-4 py-2 border">12/09/2025</td>
                <td className="px-4 py-2 border">20</td>
                <td className="px-4 py-2 border">Switch</td>
                <td className="px-4 py-2 border text-yellow-600">Advertencia</td>
              </tr>
              <tr className="text-center">
                <td className="px-4 py-2 border">12/09/2025</td>
                <td className="px-4 py-2 border">30</td>
                <td className="px-4 py-2 border">Servidor</td>
                <td className="px-4 py-2 border text-red-600">Caído</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
