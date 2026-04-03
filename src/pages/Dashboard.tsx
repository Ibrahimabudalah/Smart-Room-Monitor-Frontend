import { useEffect, useState } from "react";
import SensorChart from "../components/SensorChart";
import SensorCard from "../components/SensorCard";
import InsightCard from "../components/InsightCard";
import { getSensorHistory } from "../utils/sensor";
import type { SensorData } from "../utils/sensor";
import StatCard from "../components/StatCard";

export default function Dashboard() {
  const [temp, setTemp] = useState<number[]>([]);
  const [humidity, setHumidity] = useState<number[]>([]);
  const [pressure, setPressure] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [range, setRange] = useState(1);

  // Helpers
  const average = (arr: number[]) =>
    arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

  const min = (arr: number[]) => (arr.length ? Math.min(...arr) : 0);
  const max = (arr: number[]) => (arr.length ? Math.max(...arr) : 0);

  // downsample to prevent chart lag
  const downsample = (data: SensorData[], maxPoints = 200) => {
    const step = Math.ceil(data.length / maxPoints);
    return data.filter((_, i) => i % step === 0);
  };

  // trend calculation
  const calculateTrend = (data: number[]) => {
    if (data.length < 10) return 0;

    const recent = data.slice(-5);
    const prev = data.slice(-10, -5);

    const avgRecent = recent.reduce((a, b) => a + b, 0) / recent.length;

    const avgPrev = prev.reduce((a, b) => a + b, 0) / prev.length;

    return avgRecent - avgPrev;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res: SensorData[] = await getSensorHistory(range);

        const normalized = [...res].reverse();

        // downsample large datasets
        const data = downsample(normalized);

        setTemp(data.map((d) => d.temperature));
        setHumidity(data.map((d) => d.humidity));
        setPressure(data.map((d) => d.pressure));

        setLabels(
          data.map((d) =>
            new Date(d.created_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          ),
        );

        if (data.length > 0) {
          setLastUpdated(
            new Date(data[data.length - 1].created_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          );
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000);

    return () => clearInterval(interval);
  }, [range]);

  // Latest values
  const latestTemp = temp.at(-1) || 0;
  const latestHumidity = humidity.at(-1) || 0;
  const latestPressure = pressure.at(-1) || 0;

  // Trends
  const tempTrend = calculateTrend(temp);
  const humidityTrend = calculateTrend(humidity);
  const pressureTrend = calculateTrend(pressure);

  // Stats
  const avgTemp = average(temp);
  const minTemp = min(temp);
  const maxTemp = max(temp);

  const avgHumidity = average(humidity);
  const minHumidity = min(humidity);
  const maxHumidity = max(humidity);

  const avgPressure = average(pressure);
  const minPressure = min(pressure);
  const maxPressure = max(pressure);

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-1">Dashboard</h1>
        <p className="text-sm text-gray-400">
          Last updated: {lastUpdated || "--"}
        </p>
      </div>

      {/* Time Filters */}
      <div className="flex gap-2 flex-wrap">
        {[1, 3, 6, 12, 24].map((h) => (
          <button
            key={h}
            onClick={() => setRange(h)}
            className={`px-3 py-1 rounded ${
              range === h ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            {h}H
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-400">Loading dashboard...</p>
      ) : (
        <>
          {/* Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <SensorCard
              label="Temperature"
              value={`${latestTemp.toFixed(1)}°C`}
              trend={tempTrend}
            />
            <SensorCard
              label="Humidity"
              value={`${latestHumidity.toFixed(1)}%`}
              trend={humidityTrend}
            />
            <SensorCard
              label="Pressure"
              value={`${latestPressure.toFixed(1)} hPa`}
              trend={pressureTrend}
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <SensorChart
              title="Temperature (°C)"
              dataPoints={temp}
              labels={labels}
              color="#ef4444"
            />
            <SensorChart
              title="Humidity (%)"
              dataPoints={humidity}
              labels={labels}
              color="#3b82f6"
            />
            <SensorChart
              title="Pressure (hPa)"
              dataPoints={pressure}
              labels={labels}
              color="#8b5cf6"
            />
          </div>
          {/* 🔥 Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              title="Temperature Stats"
              avg={avgTemp}
              min={minTemp}
              max={maxTemp}
              unit="°C"
            />

            <StatCard
              title="Humidity Stats"
              avg={avgHumidity}
              min={minHumidity}
              max={maxHumidity}
              unit="%"
            />

            <StatCard
              title="Pressure Stats"
              avg={avgPressure}
              min={minPressure}
              max={maxPressure}
              unit="hPa"
            />
          </div>

          <InsightCard />
        </>
      )}
    </div>
  );
}
