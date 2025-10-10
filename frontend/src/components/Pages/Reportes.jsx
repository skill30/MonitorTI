import { useEffect, useState } from "react";
import jsPDF from "jspdf";

export default function Reporte() {
  const [totalRegistros, setTotalRegistros] = useState(0);
  const [equipos, setEquipos] = useState([]);
  const [pcsCaidas, setPcsCaidas] = useState(0);
  const [registrosRecientes, setRegistrosRecientes] = useState([]);
  const [vlans, setVlans] = useState([]);
  const [filtros, setFiltros] = useState({
    fechaInicio: "",
    fechaFin: "",
    vlanId: "",
    dispositivo: "",
  });

  useEffect(() => {
    fetch("http://10.0.0.138:8000/api/registros/")
      .then(res => res.json())
      .then(data => setTotalRegistros(data.length));

    fetch("http://10.0.0.138:8000/api/equipos/")
      .then(res => res.json())
      .then(data => {
        setEquipos(data);
        setRegistrosRecientes(data.slice(-5).reverse());
      });

    fetch("http://10.0.0.138:8000/api/equipos/caidos")
      .then(res => res.json())
      .then(data => setPcsCaidas(data.length));

    fetch("http://10.0.0.138:8000/api/vlans/")
      .then(res => res.json())
      .then(data => setVlans(data));
  }, []);

  // Manejar cambios en los filtros
  const handleFiltroChange = (e) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  // Generar PDF con los datos filtrados
  const handleGenerarReporte = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Reporte de Red", 10, 15);
    doc.setFontSize(12);
    doc.text(`Fecha de generación: ${new Date().toLocaleString()}`, 10, 25);
    doc.text(`Rango de fechas: ${filtros.fechaInicio || "-"} a ${filtros.fechaFin || "-"}`, 10, 35);
    doc.text(`VLAN: ${filtros.vlanId ? vlans.find(v => v.id == filtros.vlanId)?.nombre : "-"}`, 10, 45);
    doc.text(`Dispositivo: ${filtros.dispositivo || "-"}`, 10, 55);

    doc.text(`Total de registros: ${totalRegistros}`, 10, 70);
    doc.text(`Equipos conectados: ${equipos.length}`, 10, 80);
    doc.text(`PCs caídas: ${pcsCaidas}`, 10, 90);

    doc.text("Últimos dispositivos registrados:", 10, 105);
    registrosRecientes.forEach((eq, i) => {
      doc.text(
        `${eq.id} - ${eq.nombre} (VLAN ${eq.vlan_id})`,
        10,
        115 + i * 8
      );
    });

    doc.save("reporte_red.pdf");
  };

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
            <input
              type="date"
              name="fechaInicio"
              value={filtros.fechaInicio}
              onChange={handleFiltroChange}
              className="mt-1 px-3 py-2 border rounded-md w-full"
            />
            <input
              type="date"
              name="fechaFin"
              value={filtros.fechaFin}
              onChange={handleFiltroChange}
              className="mt-1 px-3 py-2 border rounded-md w-full"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700">VLAN</label>
            <select
              name="vlanId"
              value={filtros.vlanId}
              onChange={handleFiltroChange}
              className="mt-1 px-3 py-2 border rounded-md w-full"
            >
              <option value="">Seleccionar VLAN</option>
              {vlans.map(vlan => (
                <option key={vlan.id} value={vlan.id}>
                  {vlan.nombre}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-700">Dispositivo</label>
            <select
              name="dispositivo"
              value={filtros.dispositivo}
              onChange={handleFiltroChange}
              className="mt-1 px-3 py-2 border rounded-md w-full"
              disabled={!filtros.vlanId}
            >
              <option value="">Seleccionar dispositivo</option>
              {equipos
                .filter(eq => eq.vlan_id == filtros.vlanId)
                .map(eq => (
                  <option key={eq.id} value={eq.nombre}>
                    {eq.nombre}
                  </option>
                ))}
            </select>
          </div>
        </div>
        <button
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          onClick={handleGenerarReporte}
        >
          Generar reporte
        </button>
      </section>

      {/* Métricas */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-gray-100 rounded-md shadow text-center">
          <h3 className="text-sm text-gray-600">Total de registros</h3>
          <p className="text-2xl font-bold">{totalRegistros}</p>
        </div>
        <div className="p-6 bg-gray-100 rounded-md shadow text-center">
          <h3 className="text-sm text-gray-600">Equipos conectados</h3>
          <p className="text-2xl font-bold">{equipos.length}</p>
        </div>
        <div className="p-6 bg-gray-100 rounded-md shadow text-center">
          <h3 className="text-sm text-gray-600">PCs caídas</h3>
          <p className="text-2xl font-bold text-red-600">{pcsCaidas}</p>
        </div>
      </section>

      {/* Tabla de registros recientes */}
      <section className="p-6 bg-gray-100 rounded-md shadow">
        <h2 className="text-lg font-semibold mb-4">Últimos dispositivos registrados</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 border">ID</th>
                <th className="px-4 py-2 border">Nombre</th>
                <th className="px-4 py-2 border">VLAN</th>
              </tr>
            </thead>
            <tbody>
              {registrosRecientes.map(equipo => (
                <tr key={equipo.id} className="text-center">
                  <td className="px-4 py-2 border">{equipo.id}</td>
                  <td className="px-4 py-2 border">{equipo.nombre}</td>
                  <td className="px-4 py-2 border">{equipo.vlan_id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
