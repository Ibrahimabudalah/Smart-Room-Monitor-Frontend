import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import PageHeader from "./PageHeader";

const pageMeta: Record<
  string,
  { eyebrow: string; title: string; description: string; badgeText: string }
> = {
  "/dashboard": {
    eyebrow: "Room telemetry",
    title: "Dashboard",
    description:
      "Track environmental conditions, review recent readings, and act on system guidance from a single view.",
    badgeText: "Live data",
  },
  "/chat": {
    eyebrow: "Operator support",
    title: "AI Assistant",
    description:
      "Work through room-condition questions with guided prompts, clear replies, and recommended next actions.",
    badgeText: "Session ready",
  },
};

export default function Layout() {
  const location = useLocation();
  const meta = pageMeta[location.pathname] ?? pageMeta["/dashboard"];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(239,246,255,0.96),_rgba(248,251,255,0.94)_34%,_rgba(255,255,255,1)_70%)]">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(135deg,rgba(15,23,42,0.025),transparent_32%,rgba(96,165,250,0.07)_74%,rgba(191,219,254,0.08))]" />
    <Navbar />

      <main className="mx-auto max-w-7xl px-4 pb-10 pt-6 sm:px-6 lg:px-8">
        <PageHeader
          badgeText={meta.badgeText}
          description={meta.description}
          eyebrow={meta.eyebrow}
          title={meta.title}
        />

        <Outlet />
      </main>
    </div>
  );
}
