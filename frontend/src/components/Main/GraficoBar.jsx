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

export default function GraficoBar({ title, labels, dataValues, color }) {
  const data = {
    labels,
    datasets: [
      {
        label: title,
        data: dataValues,
        backgroundColor: color || "rgba(75, 192, 192, 0.6)",
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
    <div className="bg-white p-4 rounded-2xl shadow h-[300px]">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <div className="h-[240px] w-full">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
