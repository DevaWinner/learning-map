import { useState, useEffect } from "react";
import { Download } from "lucide-react";
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
  const [promptInstall, setPromptInstall] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setSupportsPWA(true);
      setPromptInstall(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const onClick = async () => {
    if (!promptInstall) return;
    promptInstall.prompt();
    const { outcome } = await promptInstall.userChoice;

    // Check if the user accepted the prompt
    if (outcome === "accepted") {
      setSupportsPWA(false);
    }
  };

  if (!supportsPWA) {
    return null;
  }

  return (
    <Button
      variant="outline"
      size="lg"
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 gap-2 shadow-xl hover:bg-primary/10 hover:text-primary"
    >
      <Download className="size-4" />
      Install App
    </Button>
  );
}
