import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  Bot,
  LayoutDashboard,
  Menu,
  MonitorSpeaker,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { NavLink } from "react-router-dom";

interface NavigationItem {
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
}

const navigationItems: NavigationItem[] = [
  {
    href: "/",
    label: "Dashboard",
    description: "Live telemetry and recent readings",
    icon: LayoutDashboard,
  },
  {
    href: "/chat",
    label: "Assistant",
    description: "Guided AI room support",
    icon: Bot,
  },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <NavLink
          className="flex min-w-0 items-center gap-3"
          to="/"
        >
          <div className="flex size-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-sm">
            <MonitorSpeaker className="size-5" />
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">
              Smart Room Monitor
            </p>
            <p className="truncate text-xs text-muted-foreground">
              Environmental telemetry workspace
            </p>
          </div>
        </NavLink>

        <div className="ml-auto hidden items-center gap-2 md:flex">
          {navigationItems.map((item) => (
            <DesktopNavItem item={item} key={item.href} />
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2 md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                aria-label="Open navigation menu"
                className="md:hidden"
                size="icon"
                variant="outline"
              >
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Navigate</SheetTitle>
                <SheetDescription>
                  Move between monitoring and assistant workflows.
                </SheetDescription>
              </SheetHeader>

              <div className="mt-4 space-y-2 px-4 pb-6">
                {navigationItems.map((item) => (
                  <MobileNavItem item={item} key={item.href} />
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

function DesktopNavItem({ item }: { item: NavigationItem }) {
  const Icon = item.icon;

  return (
    <NavLink
      className={({ isActive }) =>
        cn(
          "flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-colors",
          isActive
            ? "bg-slate-950 text-white shadow-sm"
            : "text-muted-foreground hover:bg-muted hover:text-foreground",
        )
      }
      to={item.href}
    >
      <Icon className="size-4" />
      {item.label}
    </NavLink>
  );
}

function MobileNavItem({ item }: { item: NavigationItem }) {
  const Icon = item.icon;

  return (
    <SheetClose asChild>
      <NavLink
        className={({ isActive }) =>
          cn(
            "flex items-start gap-3 rounded-2xl border px-4 py-4 transition-colors",
            isActive
              ? "border-slate-950 bg-slate-950 text-white"
              : "border-border bg-background hover:bg-muted",
          )
        }
        to={item.href}
      >
        <div className="mt-0.5 rounded-xl bg-background/10 p-2">
          <Icon className="size-4" />
        </div>
        <div className="space-y-1">
          <p className="font-medium">{item.label}</p>
          <p className="text-sm text-muted-foreground">{item.description}</p>
        </div>
        {item.href === "/chat" ? (
          <Sparkles className="ml-auto size-4 text-muted-foreground" />
        ) : null}
      </NavLink>
    </SheetClose>
  );
}
