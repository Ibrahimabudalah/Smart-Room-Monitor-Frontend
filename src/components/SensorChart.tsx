import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

interface Props {
  title: string;
  dataPoints: number[];
  labels: string[];
  color: string;
}

export default function SensorChart({
  title,
  dataPoints,
  labels,
  color,
}: Props) {
  // Simple trend logic
  const getTrend = () => {
    if (dataPoints.length < 2) return "stable";

    const last = dataPoints[dataPoints.length - 1];
    const prev = dataPoints[dataPoints.length - 2];

    if (last > prev) return "up";
    if (last < prev) return "down";
    return "stable";
  };

  const trend = getTrend();

  const trendUI = {
    up: <span className="text-xs text-green-500">↑ Rising</span>,
    down: <span className="text-xs text-red-500">↓ Falling</span>,
    stable: <span className="text-xs text-gray-400">→ Stable</span>,
  };

  const data = {
    labels,
    datasets: [
      {
        label: title,
        data: dataPoints,
        borderColor: color,
        backgroundColor: color + "22",
        tension: 0.4,
        fill: true,
        pointRadius: 0,
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="bg-white rounded-2xl shadow p-4 hover:shadow-lg transition">
      
      {/* Title + Trend */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold">{title}</h3>
        {trendUI[trend]}
      </div>

      <Line data={data} />
    </div>
  );
}