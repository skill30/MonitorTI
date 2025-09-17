import React, { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { getRegistrosAgrupados } from "../utils/api";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale
);

export default function RegistroDashboard() {
  const [registros, setRegistros] = useState([]);
  const [rango, setRango] = useState("day");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let activo = true;
    getRegistrosAgrupados(rango)
      .then(data => {
        if (activo) setRegistros(data);
      })
      .catch(console.error);

    return () => { activo = false };
  }, [rango]);

  if (cargando) return <p className="text-gray-500">Cargando gráficos...</p>;
  if (!registros.length) return <p className="text-gray-500">No hay datos para mostrar</p>;

  const labels = registros,.map(r => new Date(r.periodo).toLocaleDateString());
  const cpuPromedio = registros.map(r => r.cpu_promedio);
  const memoriaPromedio = registros.map(r => r.memoria_promedio);
  const discoPromedio = registros.map(r => r.disco_promedio);

  const dataCPU = { labels, datasets: [{ label: "CPU Promedio (%)", data: cpuPromedio, backgroundColor: "rgba(75, 192, 192, 0.6)" }] };
  const dataMemoria = { labels, datasets: [{ label: "Memoria Promedio (%)", data: memoriaPromedio, backgroundColor: "rgba(255, 99, 132, 0.6)" }] };
  const dataDisco = { labels, datasets: [{ label: "Disco Promedio (%)", data: discoPromedio, backgroundColor: "rgba(153, 102, 255, 0.6)" }] };

  return (
    <div className="space-y-6 mt-8">
      <div className="flex gap-2">
        {["hour", "day", "week", "month"].map(opcion => (
          <button
            key={opcion}
            className={`px-3 py-1 rounded ${rango === opcion ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            onClick={() => setRango(opcion)}
          >
            {opcion}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-lg font-bold mb-4">Uso de CPU Promedio</h2>
          <Bar data={dataCPU} />
        </div>

        <div className="p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-lg font-bold mb-4">Distribución de Memoria Promedio</h2>
          <Pie data={dataMemoria} />
        </div>

        <div className="p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-lg font-bold mb-4">Uso de Disco Promedio</h2>
          <Bar data={dataDisco} />
        </div>
      </div>
    </div>
  );
}
