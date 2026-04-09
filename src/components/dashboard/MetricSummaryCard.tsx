import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { MetricStatus } from "@/utils/sensor";

interface MetricSummaryCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  description: string;
  supportingText: string;
  delta: number;
  status: MetricStatus;
}

const statusVariantMap = {
  stable: "secondary",
  watch: "outline",
  alert: "destructive",
} as const;

const statusLabelMap = {
  stable: "Stable",
  watch: "Watch",
  alert: "Action",
} as const;

export default function MetricSummaryCard({
  icon: Icon,
  label,
  value,
  description,
  supportingText,
  delta,
  status,
}: MetricSummaryCardProps) {
  const TrendIcon =
    delta > 0 ? ArrowUpRight : delta < 0 ? ArrowDownRight : Minus;

  return (
    <Card className="border-border/70 bg-background/95">
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-muted">
            <Icon className="size-5 text-foreground" />
          </div>
          <Badge variant={statusVariantMap[status]}>
            {statusLabelMap[status]}
          </Badge>
        </div>
        <div className="space-y-1">
          <CardTitle>{label}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-3xl font-semibold tracking-tight text-foreground">
          {value}
        </p>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <TrendIcon className="size-4" />
          <span>{Math.abs(delta).toFixed(2)} change across recent samples</span>
        </div>
        <p className="text-sm leading-6 text-muted-foreground">
          {supportingText}
        </p>
      </CardContent>
    </Card>
  );
}
