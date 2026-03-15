import { useLocation, useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/presentation/components/ui/tabs";

const navigationItems = [
  {
    to: "/overview",
    label: "Overview",
  },
  {
    to: "/sessions",
    label: "Sessions",
  },
  {
    to: "/timer",
    label: "Timer",
  },
  {
    to: "/reporting",
    label: "Reporting",
  },
  {
    to: "/projects",
    label: "Projects",
  },
];

export function SectionNavigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath =
    navigationItems.find((item) => location.pathname.startsWith(item.to))?.to ??
    "/overview";

  return (
    <>
      {/* Fixed nav bar pinned to viewport top — never transitions, zero jitter */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-background/95 backdrop-blur-xl">
        <div className="mx-auto w-full max-w-7xl px-4 py-2 sm:px-6">
          <Tabs
            value={currentPath}
            onValueChange={(value) => void navigate(value)}
            className="block w-full"
          >
            <TabsList className="grid h-auto w-full grid-cols-5 rounded-md border border-white/[0.06] bg-white/[0.03] p-1 backdrop-blur-2xl">
              {navigationItems.map((item) => (
                <TabsTrigger
                  key={item.to}
                  value={item.to}
                  className="flex min-w-0 h-12 sm:h-11 items-center justify-center rounded-md px-2 text-center text-sm font-semibold sm:px-3 sm:text-base data-[state=active]:bg-primary/15 data-[state=active]:text-primary data-[state=active]:shadow-[0_0_12px_hsl(160_84%_39%/0.15)]"
                >
                  <span className="truncate">{item.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </nav>
      {/* Spacer to offset content below the fixed nav */}
      <div className="h-16" />
    </>
  );
}
