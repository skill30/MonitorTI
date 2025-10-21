import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

export default function GraficoBarRed() {
  const [vlans, setVlans] = useState([]);
  const [vlanId, setVlanId] = useState("");
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(false);

  // Obtener lista de VLANs
  useEffect(() => {
    async function fetchVlans() {
      const res = await fetch("http://10.0.0.138:8000/api/vlans/");
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
      const res = await fetch(
        `http://10.0.0.138:8000/api/vlans/${vlanId}/registros`
      );
      const data = await res.json();
      setRegistros(data.reverse());
      setLoading(false);
    }
    fetchRegistros();
  }, [vlanId]);

  // Sumar los bytes enviados y recibidos de todos los registros de la VLAN seleccionada
  const totalEnviados = registros.reduce(
    (acc, r) => acc + (r.bytes_enviados ?? 0),
    0
  );
  const totalRecibidos = registros.reduce(
    (acc, r) => acc + (r.bytes_recibidos ?? 0),
    0
  );

  const data = {
    labels: ["Bytes Enviados", "Bytes Recibidos"],
    datasets: [
      {
        label: "Tráfico de Red",
        data: [totalEnviados, totalRecibidos],
        backgroundColor: ["#36A2EB", "#FFCE56"],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom" },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <div className="bg-white p-4 rounded-2xl shadow h-[300px] flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">
          Bytes enviados/recibidos por VLAN
        </h2>
        <select
          className="border rounded px-2 py-1 text-sm"
          value={vlanId}
          onChange={(e) => setVlanId(e.target.value)}
        >
          {vlans.map((vlan) => (
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
          <Bar data={data} options={options} />
        )}
      </div>
    </div>
  );
}
