import api from "./axios";

export interface SensorData {
  id?: number;
  temperature: number;
  humidity: number;
  pressure: number;
  created_at: string;
  updated_at?: string;
}

export type SensorMetricKey = "temperature" | "humidity" | "pressure";
export type MetricStatus = "stable" | "watch" | "alert";

export interface SensorChartPoint {
  label: string;
  fullLabel: string;
  temperature: number;
  humidity: number;
  pressure: number;
}

export interface MetricSummary {
  current: number;
  average: number;
  minimum: number;
  maximum: number;
  change: number;
  status: MetricStatus;
}

export const SENSOR_RANGE_OPTIONS = [
  { value: 1, label: "Last 1 hour" },
  { value: 3, label: "Last 3 hours" },
  { value: 6, label: "Last 6 hours" },
  { value: 12, label: "Last 12 hours" },
  { value: 24, label: "Last 24 hours" },
] as const;

export const SENSOR_METRIC_META = {
  temperature: {
    label: "Temperature",
    unit: "C",
    color: "#f97316",
    helper: "Comfort target: 20-24 C",
  },
  humidity: {
    label: "Humidity",
    unit: "%",
    color: "#0ea5e9",
    helper: "Recommended: 35-60%",
  },
  pressure: {
    label: "Pressure",
    unit: "hPa",
    color: "#6366f1",
    helper: "Expected indoor band: 1008-1022 hPa",
  },
} as const satisfies Record<
  SensorMetricKey,
  { label: string; unit: string; color: string; helper: string }
>;

export const getSensorHistory = async (hours = 1) => {
  const res = await api.get(
    `${import.meta.env.VITE_HISTORY_SENSOR_DATA}?hours=${hours}`
  );
  return res.data as SensorData[];
};

export async function getLatestSensor() {
  const response = await api.get(import.meta.env.VITE_LATEST_SENSOR_DATA);
  return response.data as SensorData;
}

export function normalizeSensorHistory(readings: SensorData[]) {
  return [...readings].sort(
    (left, right) =>
      new Date(left.created_at).getTime() - new Date(right.created_at).getTime(),
  );
}

export function formatSensorTime(timestamp: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

export function formatSensorClock(timestamp: string) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

export function buildSensorSeries(readings: SensorData[], maxPoints = 72) {
  const normalized = normalizeSensorHistory(readings);
  const step =
    normalized.length > maxPoints
      ? Math.ceil(normalized.length / maxPoints)
      : 1;

  return normalized
    .filter(
      (_, index) => index % step === 0 || index === normalized.length - 1,
    )
    .map((reading) => ({
      label: formatSensorClock(reading.created_at),
      fullLabel: formatSensorTime(reading.created_at),
      temperature: reading.temperature,
      humidity: reading.humidity,
      pressure: reading.pressure,
    }));
}

export function getMetricSummary(
  readings: SensorData[],
  metric: SensorMetricKey,
): MetricSummary {
  const values = readings.map((reading) => reading[metric]);

  if (values.length === 0) {
    return {
      current: 0,
      average: 0,
      minimum: 0,
      maximum: 0,
      change: 0,
      status: "watch",
    };
  }

  const current = values.at(-1) ?? 0;
  const average =
    values.reduce((total, value) => total + value, 0) / values.length;
  const minimum = Math.min(...values);
  const maximum = Math.max(...values);
  const windowSize = Math.min(6, Math.max(1, Math.floor(values.length / 2)));
  const recent = values.slice(-windowSize);
  const previous = values.slice(-windowSize * 2, -windowSize);
  const recentAverage =
    recent.reduce((total, value) => total + value, 0) / recent.length;
  const previousAverage = previous.length
    ? previous.reduce((total, value) => total + value, 0) / previous.length
    : recentAverage;

  return {
    current,
    average,
    minimum,
    maximum,
    change: recentAverage - previousAverage,
    status: getMetricStatus(metric, current),
  };
}

export function getMetricStatus(metric: SensorMetricKey, value: number): MetricStatus {
  switch (metric) {
    case "temperature":
      if (value >= 20 && value <= 24) return "stable";
      if (value >= 18 && value <= 26) return "watch";
      return "alert";
    case "humidity":
      if (value >= 35 && value <= 60) return "stable";
      if (value >= 30 && value <= 65) return "watch";
      return "alert";
    case "pressure":
      if (value >= 1008 && value <= 1022) return "stable";
      if (value >= 1003 && value <= 1027) return "watch";
      return "alert";
    default:
      return "watch";
  }
}

export function getOverallStatus(reading: SensorData): MetricStatus {
  const statuses = [
    getMetricStatus("temperature", reading.temperature),
    getMetricStatus("humidity", reading.humidity),
    getMetricStatus("pressure", reading.pressure),
  ];

  if (statuses.includes("alert")) {
    return "alert";
  }

  if (statuses.includes("watch")) {
    return "watch";
  }

  return "stable";
}
