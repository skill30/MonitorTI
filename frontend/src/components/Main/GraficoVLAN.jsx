import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function GraficoVLAN() {
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("http://10.0.0.138:8000/api/vlans/equipos/conteo");
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

  if (loading) return <p>Cargando gráfico de VLANs...</p>;

  const labels = datos.map(r => r.vlan);
  const values = datos.map(r => r.total_equipos);

  const pieData = {
    labels,
    datasets: [{
      data: values,
      backgroundColor: [
        "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"
      ]
    }]
  };

  const pieOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom" }
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow flex flex-col items-center justify-center w-full h-full">
      <h2 className="text-lg font-semibold mb-4 text-center">Equipos por VLAN</h2>
      <div
        className="flex items-center justify-center w-full h-full"
        style={{ maxWidth: "100%", maxHeight: "calc(40vh - 4rem)", height: "100%", minHeight: 0 }}
      >
        <Pie data={pieData} options={pieOptions} width={300} height={220} />
      </div>
    </div>
  );
}