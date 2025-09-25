import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from "chart.js";

ChartJS.register(Title, Tooltip, Legend, ArcElement);

export default function GraficoVLAN() {
  const data = {
    labels: ["VLAN 10", "VLAN 20", "VLAN 30"],
    datasets: [
      {
        data: [12, 19, 7],
        backgroundColor: ["#3b82f6", "#10b981", "#f59e0b"],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // <- clave
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-2xl shadow h-[300px]">
      <h2 className="text-lg font-semibold mb-2">Distribución de VLAN</h2>
      <div className="h-[240px] w-full">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
}
