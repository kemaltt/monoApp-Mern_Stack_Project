import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";

// Chart.js bileşenlerini kaydedin
ChartJS.register(
  CategoryScale, // X ekseni için kategorik ölçek
  LinearScale,   // Y ekseni için doğrusal ölçek
  BarElement,    // Bar grafik elemanı
  Title,         // Başlık özelliği
  Tooltip,       // Tooltip (açıklama balonları)
  Legend         // Efsane (legend) özelliği
);

const BarChart = ({ chartData }) => {
  return (
    <Bar
      data={chartData}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true, position: "top" },
          title: { display: true, text: "Bar Chart Example" },
        },
      }}
    />
  );
};

export default BarChart;
