import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { SensorChartPoint, SensorMetricKey } from "@/utils/sensor";

interface MetricTrendChartProps {
  title: string;
  description: string;
  data: SensorChartPoint[];
  dataKey: SensorMetricKey;
  color: string;
  unit: string;
  latestValue: number;
  averageValue: number;
}

export default function MetricTrendChart({
  title,
  description,
  data,
  dataKey,
  color,
  unit,
  latestValue,
  averageValue,
}: MetricTrendChartProps) {
  const chartConfig = {
    value: {
      label: title,
      color,
    },
  } satisfies ChartConfig;
  const gradientId = `${dataKey}-gradient`;

  return (
    <Card className="border-border/70 bg-background/95">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <CardAction>
          <Badge variant="outline">
            Avg {averageValue.toFixed(1)} {unit}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-2xl font-semibold text-foreground">
            {latestValue.toFixed(1)} {unit}
          </p>
          <p className="text-sm text-muted-foreground">Latest sampled value</p>
        </div>

        <ChartContainer className="min-h-[220px] w-full" config={chartConfig}>
          <AreaChart accessibilityLayer data={data} margin={{ left: 8, right: 8 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-value)"
                  stopOpacity={0.32}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-value)"
                  stopOpacity={0.04}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              axisLine={false}
              dataKey="label"
              minTickGap={24}
              tickLine={false}
              tickMargin={8}
            />
            <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
            <Area
              dataKey={dataKey}
              fill={`url(#${gradientId})`}
              fillOpacity={1}
              stroke="var(--color-value)"
              strokeWidth={2}
              type="monotone"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
