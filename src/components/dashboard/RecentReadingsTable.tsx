import { MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  formatSensorClock,
  getOverallStatus,
  type SensorData,
} from "@/utils/sensor";

const statusVariantMap = {
  stable: "secondary",
  watch: "outline",
  alert: "destructive",
} as const;

export default function RecentReadingsTable({
  readings,
}: {
  readings: SensorData[];
}) {
  const latestRows = [...readings].slice(-8).reverse();

  return (
    <Card className="border-border/70 bg-background/95">
      <CardHeader>
        <CardTitle>Recent readings</CardTitle>
        <CardDescription>
          Quick inspection of the most recent telemetry points in the selected
          window.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>Temperature</TableHead>
              <TableHead>Humidity</TableHead>
              <TableHead>Pressure</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {latestRows.map((reading) => {
              const status = getOverallStatus(reading);

              return (
                <TableRow key={reading.created_at}>
                  <TableCell className="font-medium">
                    {formatSensorClock(reading.created_at)}
                  </TableCell>
                  <TableCell>{reading.temperature.toFixed(1)} C</TableCell>
                  <TableCell>{reading.humidity.toFixed(1)}%</TableCell>
                  <TableCell>{reading.pressure.toFixed(1)} hPa</TableCell>
                  <TableCell>
                    <Badge variant={statusVariantMap[status]}>
                      {status === "alert"
                        ? "Action"
                        : status === "watch"
                          ? "Watch"
                          : "Stable"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-label="Open row actions"
                          size="icon-sm"
                          variant="ghost"
                        >
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Reading</DropdownMenuLabel>
                        <DropdownMenuItem>
                          Logged at {formatSensorClock(reading.created_at)}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          Temperature {reading.temperature.toFixed(1)} C
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          Humidity {reading.humidity.toFixed(1)}%
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          Pressure {reading.pressure.toFixed(1)} hPa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
