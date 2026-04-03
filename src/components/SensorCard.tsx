export default function SensorCard({
  label,
  value,
  trend,
}: {
  label: string;
  value: string;
  trend: number;
}) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow">
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="text-2xl font-bold">{value}</p>

      <p className="text-xs text-gray-400">
        {trend > 0 ? "↑" : "↓"} {Math.abs(trend).toFixed(2)}
      </p>
    </div>
  );
}
