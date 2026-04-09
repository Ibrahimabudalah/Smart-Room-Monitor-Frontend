import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import type { AiInsightResponse, AiPredictionResponse } from "@/utils/ai";
import type { MetricStatus } from "@/utils/sensor";

const statusVariantMap = {
  stable: "secondary",
  watch: "outline",
  alert: "destructive",
} as const;

interface InsightPanelProps {
  status: MetricStatus;
  insights: AiInsightResponse | null;
  prediction: AiPredictionResponse | null;
  error?: string | null;
}

export default function InsightPanel({
  status,
  insights,
  prediction,
  error,
}: InsightPanelProps) {
  const isUnavailable = !insights || !prediction;

  return (
    <Card className="border-border/70 bg-background/95">
      <CardHeader className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
            <Sparkles className="size-5" />
          </div>
          <Badge variant={statusVariantMap[status]}>
            {status === "alert"
              ? "Needs action"
              : status === "watch"
                ? "Monitor closely"
                : "Conditions stable"}
          </Badge>
        </div>
        <div className="space-y-1">
          <CardTitle>AI guidance</CardTitle>
          <CardDescription>
            Live recommendations fetched from the backend AI endpoints.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {isUnavailable ? (
          <div className="space-y-4 rounded-2xl border border-dashed border-border bg-muted/40 px-4 py-5">
            <p className="text-sm font-medium text-foreground">
              AI guidance is currently unavailable
            </p>
            <p className="text-sm leading-6 text-muted-foreground">
              {error ??
                "The AI endpoints did not return a usable response. Sensor telemetry is still live."}
            </p>
          </div>
        ) : (
          <>
            <div className="rounded-2xl bg-muted px-4 py-4">
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                1 hour forecast
              </p>
              <p className="mt-2 text-3xl font-semibold text-foreground">
                {prediction.estimated_temp_in_1_hour.toFixed(1)} C
              </p>
            </div>

            <p className="text-sm leading-6 text-muted-foreground">
              {insights.issue}
            </p>

            <Separator />

            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">
                Immediate actions
              </p>
              <ul className="space-y-2 text-sm leading-6 text-muted-foreground">
                <li>{insights.suggestion}</li>
                <li>{prediction.advice}</li>
              </ul>
            </div>
          </>
        )}
      </CardContent>

      <CardFooter className="justify-between">
        <p className="text-xs text-muted-foreground">
          Powered by live AI endpoints.
        </p>
        {!isUnavailable && (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">View details</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl">
              <DialogHeader>
                <DialogTitle>AI telemetry guidance</DialogTitle>
                <DialogDescription>{insights.issue}</DialogDescription>
              </DialogHeader>

              <div className="space-y-5">
                <div className="space-y-3">
                  <p className="text-sm font-medium text-foreground">
                    Current issue
                  </p>
                  <ul className="space-y-2 text-sm leading-6 text-muted-foreground">
                    <li>{insights.issue}</li>
                    <li>{prediction.trend}</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-medium text-foreground">
                    Recommended next steps
                  </p>
                  <ul className="space-y-2 text-sm leading-6 text-muted-foreground">
                    <li>{insights.suggestion}</li>
                    <li>{prediction.advice}</li>
                  </ul>
                </div>
              </div>

              <DialogFooter showCloseButton />
            </DialogContent>
          </Dialog>
        )}
      </CardFooter>
    </Card>
  );
}
