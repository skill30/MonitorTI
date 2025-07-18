import React, { useEffect, useState } from "react";

export default function RegistroTabla() {
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/api/registros")
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener registros");
        return res.json();
      })
      .then((data) => setRegistros(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const formatearFecha = (fechaString) => {
    if (!fechaString) return "Fecha no disponible";
    try {
      const fechaValida = new Date(fechaString.replace(" ", "T"));
      return fechaValida.toLocaleString("es-ES", {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch {
      return "Fecha inválida";
    }
  };

  if (loading) return <p className="text-gray-600">Cargando registros...</p>;
  if (error) return <p className="text-red-500">⚠️ {error}</p>;

  return (
    <div className="overflow-x-auto p-4 bg-white shadow-lg rounded-2xl">
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-700">
        📋 Registros del Sistema
      </h2>
      <table className="w-full table-auto border-collapse border border-gray-300">
        <thead className="bg-blue-100 text-gray-700">
          <tr>
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Equipo</th>
            <th className="p-2 border">Uso CPU(%)</th>
            <th className="p-2 border">memoria total</th>
            <th className="p-2 border">memoria disponible</th>
            <th className="p-2 border">memoria uso (%)</th>
            <th className="p-2 border">RAM (MB)</th>
            <th className="p-2 border">Fecha</th>
          </tr>
        </thead>
        <tbody>
          {registros.map((item) => (
            <tr key={item.id} className="hover:bg-gray-100 text-center">
              <td className="p-2 border">{item.id}</td>
              <td className="p-2 border">{item.equipo}</td>
              <td className="p-2 border">{item.cpu_percent}</td>
              <td className="p-2 border">{item.mem_total}</td>
              <td className="p-2 border">{item.mem_disponible}</td>
              <td className="p-2 border">{item.mem_uso_percent}</td>
              <td className="p-2 border">{item.disco_total}</td>
              <td className="p-2 border">{item.disco_usado}</td>
              <td className="p-2 border">{item.disco_percent}</td>
              <td className="p-2 border">{item.ram}</td>
              <td className="p-2 border">{formatearFecha(item.timestamp)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


