import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from "chart.js";

ChartJS.register(Title, Tooltip, Legend, ArcElement);

export default function GraficoVLAN() {
  const [dataVLAN, setDataVLAN] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Llama al backend (ajusta la URL según tu IP/puerto)
        const res = await fetch("http://localhost:8000/api/registros/agrupados");
        const registros = await res.json();

        // Contamos los registros por VLAN
        const conteo = {};
        registros.forEach(reg => {
          const vlan = reg.vlan_id; // Ajusta si en tu schema viene como "vlan.nombre"
          conteo[vlan] = (conteo[vlan] || 0) + 1;
        });

        setDataVLAN(Object.entries(conteo));
      } catch (err) {
        console.error("Error al cargar registros", err);
      }
    };

    fetchData();
  }, []);

  const chartData = {
    labels: dataVLAN.map(([vlan]) => `VLAN ${vlan}`),
    datasets: [
      {
        data: dataVLAN.map(([_, count]) => count),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#8BC34A", "#FF9800"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ width: "400px", margin: "auto" }}>
      <h2>Registros por VLAN</h2>
      <Pie data={chartData} />
    </div>
  );
}
