import { useState } from "react";
import { AlertTriangle, Gauge, Thermometer, Waves } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardSkeleton from "@/components/dashboard/DashboardSkeleton";
import InsightPanel from "@/components/dashboard/InsightPanel";
import MetricSummaryCard from "@/components/dashboard/MetricSummaryCard";
import MetricTrendChart from "@/components/dashboard/MetricTrendChart";
import RecentReadingsTable from "@/components/dashboard/RecentReadingsTable";
import useDashboardData from "@/hooks/useDashboardData";
import {
  buildSensorSeries,
  formatSensorTime,
  getMetricStatus,
  getMetricSummary,
  SENSOR_METRIC_META,

} from "@/utils/sensor";

export default function Dashboard() {
  const [range] = useState(1);
  const {
    readings,
    latestReading,
    insights,
    prediction,
    loading,
    error,
    aiError,
  } =
    useDashboardData(range);
  const chartData = buildSensorSeries(readings);
  const temperatureSummary = getMetricSummary(readings, "temperature");
  const humiditySummary = getMetricSummary(readings, "humidity");
  const pressureSummary = getMetricSummary(readings, "pressure");

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <Card className="border-destructive/20 bg-destructive/5">
        <CardContent className="flex flex-col gap-3 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 size-5 text-destructive" />
            <div className="space-y-1">
              <p className="font-medium text-foreground">
                Dashboard data could not be loaded
              </p>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          </div>
          <Badge variant="destructive">Connection issue</Badge>
        </CardContent>
      </Card>
    );
  }

  if (!latestReading) {
    return <DashboardSkeleton />;
  }

  const forecastStatus = prediction
    ? getMetricStatus("temperature", prediction.estimated_temp_in_1_hour)
    : "watch";
  const lastUpdatedLabel = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(latestReading.created_at));

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-border/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(248,250,252,0.9),rgba(241,245,249,0.92))]">
        <CardContent className="flex flex-col gap-6 px-6 py-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <Badge className="w-fit" variant="outline">
              Latest reading {lastUpdatedLabel}
            </Badge>
            <div className="space-y-1">
              <h2 className="text-xl font-semibold text-foreground">
                Room Summary 
              </h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Latest telemetry recorded at{" "}
              <span className="font-medium text-foreground">
                {formatSensorTime(latestReading.created_at)}
              </span>
              .
            </p>
          </div>

         
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricSummaryCard
          delta={temperatureSummary.change}
          description={SENSOR_METRIC_META.temperature.helper}
          icon={Thermometer}
          label={SENSOR_METRIC_META.temperature.label}
          status={temperatureSummary.status}
          supportingText={`Avg ${temperatureSummary.average.toFixed(1)} ${SENSOR_METRIC_META.temperature.unit} · Min ${temperatureSummary.minimum.toFixed(1)} · Max ${temperatureSummary.maximum.toFixed(1)}`}
          value={`${latestReading.temperature.toFixed(1)} ${SENSOR_METRIC_META.temperature.unit}`}
        />
        <MetricSummaryCard
          delta={humiditySummary.change}
          description={SENSOR_METRIC_META.humidity.helper}
          icon={Waves}
          label={SENSOR_METRIC_META.humidity.label}
          status={humiditySummary.status}
          supportingText={`Avg ${humiditySummary.average.toFixed(1)}% · Min ${humiditySummary.minimum.toFixed(1)} · Max ${humiditySummary.maximum.toFixed(1)}`}
          value={`${latestReading.humidity.toFixed(1)}%`}
        />
        <MetricSummaryCard
          delta={pressureSummary.change}
          description={SENSOR_METRIC_META.pressure.helper}
          icon={Gauge}
          label={SENSOR_METRIC_META.pressure.label}
          status={pressureSummary.status}
          supportingText={`Avg ${pressureSummary.average.toFixed(1)} hPa · Min ${pressureSummary.minimum.toFixed(1)} · Max ${pressureSummary.maximum.toFixed(1)}`}
          value={`${latestReading.pressure.toFixed(1)} hPa`}
        />
        {prediction ? (
          <MetricSummaryCard
            delta={
              prediction.estimated_temp_in_1_hour - latestReading.temperature
            }
            description="Predicted temperature from the AI forecast endpoint."
            icon={AlertTriangle}
            label="1 hour forecast"
            status={forecastStatus}
            supportingText={prediction.trend}
            value={`${prediction.estimated_temp_in_1_hour.toFixed(1)} C`}
          />
        ) : (
          <Card className="border-border/70 bg-background/95">
            <CardHeader className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-muted">
                  <AlertTriangle className="size-5 text-foreground" />
                </div>
                <Badge variant="outline">AI offline</Badge>
              </div>
              <div className="space-y-1">
                <CardTitle>1 hour forecast</CardTitle>
                <CardDescription>
                  Predicted temperature from the AI forecast endpoint.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-3xl font-semibold tracking-tight text-foreground">
                Unavailable
              </p>
              <p className="text-sm leading-6 text-muted-foreground">
                {aiError ?? "The AI forecast service is not responding right now."}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <MetricTrendChart
          averageValue={temperatureSummary.average}
          color={SENSOR_METRIC_META.temperature.color}
          data={chartData}
          dataKey="temperature"
          description="Smoothed room temperature history."
          latestValue={latestReading.temperature}
          title="Temperature"
          unit={SENSOR_METRIC_META.temperature.unit}
        />
        <MetricTrendChart
          averageValue={humiditySummary.average}
          color={SENSOR_METRIC_META.humidity.color}
          data={chartData}
          dataKey="humidity"
          description="Relative humidity across the selected period."
          latestValue={latestReading.humidity}
          title="Humidity"
          unit={SENSOR_METRIC_META.humidity.unit}
        />
        <MetricTrendChart
          averageValue={pressureSummary.average}
          color={SENSOR_METRIC_META.pressure.color}
          data={chartData}
          dataKey="pressure"
          description="Pressure movement over the monitoring period."
          latestValue={latestReading.pressure}
          title="Pressure"
          unit={SENSOR_METRIC_META.pressure.unit}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
        <RecentReadingsTable readings={readings} />
        <InsightPanel
          error={aiError}
          insights={insights}
          prediction={prediction}
          status={forecastStatus}
        />
      </div>
    </div>
  );
}
