import { useState, useEffect } from "react";
import { Download, Share, PlusSquare } from "lucide-react";
import { Button } from "@/presentation/components/ui/button";

// Extend the Window interface to include the beforeinstallprompt event handling
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function InstallAppButton() {
  const [supportsPWA, setSupportsPWA] = useState(false);
  const [isIOSContext, setIsIOSContext] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const [promptInstall, setPromptInstall] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // 1. Android / Desktop Chrome detection
    const handler = (e: Event) => {
      e.preventDefault();
      setSupportsPWA(true);
      setPromptInstall(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // 2. iOS Safari fallback detection
    // iOS doesn't fire beforeinstallprompt. We must manually detect Mobile Safari and check if it's currently standalone.
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    // @ts-ignore - Apple specific non-standard property
    const isStandalone = window.navigator.standalone === true;
    // If we're on iOS and NOT running as an installed PWA already
    if (isIOS && !isStandalone) {
      setSupportsPWA(true);
      setIsIOSContext(true);
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const onClick = async () => {
    if (isIOSContext) {
      // Toggle a tooltip or simply alert the instructions for iOS
      setShowIOSInstructions(true);
      return;
    }

    if (!promptInstall) return;
    promptInstall.prompt();
    const { outcome } = await promptInstall.userChoice;

    if (outcome === "accepted") {
      setSupportsPWA(false);
    }
  };

  if (!supportsPWA) {
    return null;
  }

  return (
    <>
      <Button
        variant="outline"
        size="lg"
        onClick={onClick}
        className="fixed bottom-6 right-6 z-50 gap-2 shadow-xl hover:bg-primary/10 hover:text-primary"
      >
        <Download className="size-4" />
        Install App
      </Button>

      {showIOSInstructions && (
        <div className="fixed bottom-24 right-6 z-50 w-72 rounded-xl border border-white/10 bg-background/95 p-4 shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom-5">
          <p className="text-sm font-medium leading-relaxed text-foreground">
            To install Roadmap OS on iOS:
          </p>
          <ol className="mt-3 space-y-2 text-xs text-muted-foreground">
            <li className="flex items-center gap-2">
              1. Tap the <Share className="size-3 text-primary" /> Share button
              below
            </li>
            <li className="flex items-center gap-2">
              2. Scroll down and tap{" "}
              <PlusSquare className="size-3 text-primary" /> "Add to Home
              Screen"
            </li>
          </ol>
          <div className="mt-4 flex justify-end">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowIOSInstructions(false)}
            >
              Got it
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
