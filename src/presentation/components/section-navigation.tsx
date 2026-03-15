import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/presentation/components/ui/button";
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const currentPath =
    navigationItems.find((item) => location.pathname.startsWith(item.to))?.to ??
    "/overview";
  const currentItem =
    navigationItems.find((item) => item.to === currentPath) ?? navigationItems[0];

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [currentPath]);

  const handleNavigate = (to: string) => {
    setIsMobileMenuOpen(false);
    void navigate(to);
  };

  return (
    <>
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-background/95 backdrop-blur-xl">
        <div className="mx-auto w-full max-w-7xl px-4 py-2 sm:px-6">
          <div className="flex items-center justify-between gap-3 md:hidden">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                Navigation
              </p>
              <p className="truncate text-sm font-semibold text-foreground">
                {currentItem.label}
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="size-11 rounded-xl border-white/[0.08] bg-white/[0.04]"
              aria-controls="mobile-navigation-panel"
              aria-expanded={isMobileMenuOpen}
              aria-label={
                isMobileMenuOpen
                  ? "Close navigation menu"
                  : "Open navigation menu"
              }
              onClick={() => setIsMobileMenuOpen((open) => !open)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
          <Tabs
            value={currentPath}
            onValueChange={(value) => void navigate(value)}
            className="hidden w-full md:block"
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

      {isMobileMenuOpen ? (
        <div className="fixed inset-0 top-[4.5rem] z-40 px-4 pb-6 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-background/72 backdrop-blur-sm"
            aria-label="Close navigation menu"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div
            id="mobile-navigation-panel"
            className="relative z-10 mx-auto w-full max-w-md rounded-3xl border border-white/[0.08] bg-card/95 p-2 shadow-[0_24px_80px_rgba(0,0,0,0.45)]"
          >
            <div className="space-y-1">
              {navigationItems.map((item) => {
                const isActive = item.to === currentPath;

                return (
                  <button
                    key={item.to}
                    type="button"
                    className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left transition-colors ${
                      isActive
                        ? "bg-primary/15 text-primary"
                        : "text-foreground hover:bg-white/[0.04]"
                    }`}
                    onClick={() => handleNavigate(item.to)}
                  >
                    <span className="text-sm font-semibold">{item.label}</span>
                    <span
                      className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${
                        isActive ? "text-primary/80" : "text-muted-foreground"
                      }`}
                    >
                      {isActive ? "Current" : "Open"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}

      <div className="h-[4.5rem] md:h-16" />
    </>
  );
}
