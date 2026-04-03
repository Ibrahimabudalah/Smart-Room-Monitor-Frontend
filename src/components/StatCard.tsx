export default function StatCard({
  title,
  avg,
  min,
  max,
  unit,
}: {
  title: string;
  avg: number;
  min: number;
  max: number;
  unit: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow">
      <h3 className="text-sm font-semibold mb-2">{title}</h3>

      <div className="text-sm text-gray-500 space-y-1">
        <p>
          Avg: {avg.toFixed(1)}
          {unit}
        </p>
        <p>
          Min: {min.toFixed(1)}
          {unit}
        </p>
        <p>
          Max: {max.toFixed(1)}
          {unit}
        </p>
      </div>
    </div>
  );
}
