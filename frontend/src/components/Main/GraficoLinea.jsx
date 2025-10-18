import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale
);

export default function GraficoLinea() {
  const [vlans, setVlans] = useState([]);
  const [vlanId, setVlanId] = useState("");
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(false);

  // Obtener lista de VLANs
  useEffect(() => {
    async function fetchVlans() {
      const res = await fetch("http://192.168.1.53:8000/api/vlans/");
      const data = await res.json();
      setVlans(data);
      if (data.length > 0) setVlanId(data[0].id);
    }
    fetchVlans();
  }, []);

  // Obtener registros de la VLAN seleccionada
  useEffect(() => {
    if (!vlanId) return;
    setLoading(true);
    async function fetchRegistros() {
      const res = await fetch(`http://192.168.1.53:8000/api/vlans/${vlanId}/registros`);
      const data = await res.json();
      setRegistros(data.reverse()); // Para que estén en orden cronológico
      setLoading(false);
    }
    fetchRegistros();
  }, [vlanId]);

  const labels = registros.map(r =>
    new Date(r.timestamp).toLocaleString("es-MX", { hour: "2-digit", minute: "2-digit" })
  );
  const cpu = registros.map(r => r.cpu_percent);

  const data = {
    labels,
    datasets: [

      {
        label: "CPU %",
        data: cpu,
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
        fill: true,
      },

    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-2xl shadow h-[300px] flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">Uso de CPU por VLAN</h2>
        <select
          className="border rounded px-2 py-1 text-sm"
          value={vlanId}
          onChange={e => setVlanId(e.target.value)}
        >
          {vlans.map(vlan => (
            <option key={vlan.id} value={vlan.id}>
              {vlan.nombre}
            </option>
          ))}
        </select>
      </div>
      <div className="h-[240px] w-full">
        {loading ? (
          <p>Cargando datos...</p>
        ) : (
          <Line data={data} options={options} />
        )}
      </div>
    </div>
  );
}