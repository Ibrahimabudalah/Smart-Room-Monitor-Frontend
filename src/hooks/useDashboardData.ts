import { useEffect, useState } from "react";
import {
  type AiInsightResponse,
  type AiPredictionResponse,
  getAiInsights,
  getAiPrediction,
} from "@/utils/ai";
import {
  getLatestSensor,
  getSensorHistory,
  normalizeSensorHistory,
  type SensorData,
} from "@/utils/sensor";

interface UseDashboardDataResult {
  readings: SensorData[];
  latestReading: SensorData | null;
  insights: AiInsightResponse | null;
  prediction: AiPredictionResponse | null;
  loading: boolean;
  error: string | null;
  aiError: string | null;
}

export default function useDashboardData(
  range: number,
): UseDashboardDataResult {
  const [readings, setReadings] = useState<SensorData[]>([]);
  const [latestReading, setLatestReading] = useState<SensorData | null>(null);
  const [insights, setInsights] = useState<AiInsightResponse | null>(null);
  const [prediction, setPrediction] = useState<AiPredictionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    const loadDashboardData = async (showLoading: boolean) => {
      if (showLoading) {
        setLoading(true);
      }

      try {
        const [historyResult, latestResult, insightsResult, predictionResult] =
          await Promise.allSettled([
            getSensorHistory(range),
            getLatestSensor(),
            getAiInsights(),
            getAiPrediction(),
          ]);

        if (!isActive) {
          return;
        }

        if (
          historyResult.status !== "fulfilled" ||
          latestResult.status !== "fulfilled"
        ) {
          throw new Error("Sensor endpoints are unavailable.");
        }

        setReadings(normalizeSensorHistory(historyResult.value));
        setLatestReading(latestResult.value);
        setError(null);

        if (
          insightsResult.status === "fulfilled" &&
          predictionResult.status === "fulfilled"
        ) {
          setInsights(insightsResult.value);
          setPrediction(predictionResult.value);
          setAiError(null);
        } else {
          setInsights(null);
          setPrediction(null);
          setAiError("AI guidance is temporarily unavailable.");
        }
      } catch (caughtError) {
        console.error(caughtError);

        if (!isActive) {
          return;
        }

        setError("Unable to load dashboard data right now.");
        setAiError(null);
      } finally {
        if (showLoading && isActive) {
          setLoading(false);
        }
      }
    };

    void loadDashboardData(true);
    const intervalId = window.setInterval(() => {
      void loadDashboardData(false);
    }, 15000);

    return () => {
      isActive = false;
      window.clearInterval(intervalId);
    };
  }, [range]);

  return {
    readings,
    latestReading,
    insights,
    prediction,
    loading,
    error,
    aiError,
  };
}
