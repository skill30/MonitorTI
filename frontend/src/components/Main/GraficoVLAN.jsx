import { useEffect, useState } from "react";
import { Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale
} from "chart.js";


ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale
);

export default function GraficoVLAN() {
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("http://localhost:8000/api/registros/agrupados?rango=day");
        if (!res.ok) throw new Error("Error cargando registros");
        const data = await res.json();
        setDatos(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <p>Cargando gráficos...</p>;

  // Datos para el Line Chart
  const labels = datos.map(r => new Date(r.periodo).toLocaleString());
  const cpu = datos.map(r => r.cpu_promedio);
  const memoria = datos.map(r => r.memoria_promedio);
  const disco = datos.map(r => r.disco_promedio);

  const lineData = {
    labels,
    datasets: [
      { label: "CPU (%)", data: cpu, borderColor: "rgba(255,99,132,1)", fill: false },
      { label: "Memoria (%)", data: memoria, borderColor: "rgba(54,162,235,1)", fill: false },
      { label: "Disco (%)", data: disco, borderColor: "rgba(255,206,86,1)", fill: false }
    ]
  };

  // Último registro para Pie Chart
  const ultimo = datos[datos.length - 1] || { cpu_promedio: 0, memoria_promedio: 0, disco_promedio: 0 };
  const pieData = {
    labels: ["CPU", "Memoria", "Disco"],
    datasets: [{ data: [ultimo.cpu_promedio, ultimo.memoria_promedio, ultimo.disco_promedio], backgroundColor: ["#FF6384","#36A2EB","#FFCE56"] }]
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      <div className="p-4 bg-white rounded shadow">
        <h2 className="text-lg font-semibold mb-4">Uso de recursos (último día)</h2>
        <Pie data={pieData} />
      </div>
      <div className="p-4 bg-white rounded shadow">
        <h2 className="text-lg font-semibold mb-4">Tendencia de uso</h2>
        <Line data={lineData} />
      </div>
    </div>
  );
}
