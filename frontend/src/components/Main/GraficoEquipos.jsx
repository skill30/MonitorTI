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
  const labels = ["10:00", "11:00", "12:00", "13:00", "14:00"];
  const data = {
    labels,
    datasets: [
      {
        label: "CPU %",
        data: [30, 50, 40, 60, 70],
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
        fill: true,
        tension: 0.4, // suaviza la curva
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
        ticks: {
          stepSize: 20,
        },
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-2xl shadow h-[300px]">
      <h2 className="text-lg font-semibold mb-2">Uso de CPU en el tiempo</h2>
      <div className="h-[240px] w-full">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
