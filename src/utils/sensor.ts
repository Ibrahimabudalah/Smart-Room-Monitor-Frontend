import api from "./axios";

export interface SensorData {
  temperature: number;
  humidity: number;
  pressure: number;
  created_at: string;
}

export const getSensorHistory = async (hours = 1) => {
  const res = await api.get(
    `${import.meta.env.VITE_HISTORY_SENSOR_DATA}?hours=${hours}`
  );
  return res.data;
};

export const getLatestSensor = async (): Promise<SensorData> => {
  const res = await api.get(import.meta.env.VITE_LATEST_SENSOR_DATA);
  return res.data;
};