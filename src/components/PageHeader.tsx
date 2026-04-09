import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
  badgeText?: string;
  trailing?: ReactNode;
}

export default function PageHeader({
  eyebrow,
  title,
  description,
  badgeText,
  trailing,
}: PageHeaderProps) {
  return (
    <div className="mb-8 space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl space-y-3">
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-muted-foreground">
            {eyebrow}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {title}
            </h1>
            {badgeText ? <Badge variant="secondary">{badgeText}</Badge> : null}
          </div>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            {description}
          </p>
        </div>

        {trailing}
      </div>

      <Separator />
    </div>
  );
}
