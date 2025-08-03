import React, { useEffect, useState } from "react";

export default function RegistroDashboard() {
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

  const calcularPromedio = (campo) => {
    const valores = registros.map((r) => parseFloat(r[campo]) || 0);
    const total = valores.reduce((a, b) => a + b, 0);
    return (total / valores.length).toFixed(1);
  };

  const renderCard = (titulo, campo) => (
    <div className="card rounded-lg border border-[#E0E0E0] shadow-sm">
      <div className="bg-[#F0F0F0] h-10 flex items-center px-3 rounded-t-lg">
        <h2 className="text-sm font-semibold uppercase">{titulo}</h2>
      </div>
      <div className="p-3 overflow-auto h-[210px]">
        <table className="w-full">
          <thead>
            <tr className="bg-white font-semibold">
              <th className="text-left py-2 px-3">Nombre</th>
              <th className="text-center py-2 px-3">PERCENTAGE USED</th>
              <th className="text-center py-2 px-3">PROM</th>
            </tr>
          </thead>
          <tbody>
            {registros.map((r) => (
              <tr key={r.id} className="even:bg-[#F9F9F9] hover:bg-[#F0F0F0]">
                <td className="py-2 px-3">{r.equipo}</td>
                <td className="text-center py-2 px-3">
                  {r[campo]}%
                </td>
                <td className="text-center py-2 px-3">
                  {calcularPromedio(campo)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  if (loading) return <p className="text-gray-400 font-mono p-4">Cargando registros...</p>;
  if (error) return <p className="text-red-500 font-mono p-4">⚠️ {error}</p>;

  return (
    <div className="bg-white font-['Inter'] text-[#1E1E1E] p-6 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold uppercase">GENERAL</h1>
        <div className="border-b border-[#E0E0E0] mt-4 w-full"></div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-items-center">
        {renderCard("Uso de CPU (%) por máquina", "cpu_percent")}
        {renderCard("Uso de Disco (%) por máquina", "disco_percent")}
        {renderCard("Uso de RAM (%) por máquina", "mem_uso_percent")}
        {renderCard("Uso de GPU (%) por máquina", "gpu_percent")}
      </div>
    </div>
  );
}
