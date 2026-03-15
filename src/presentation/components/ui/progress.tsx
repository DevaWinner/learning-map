import * as React from "react";
import { cn } from "@/lib/utils";

const Progress = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value?: number }
>(({ className, value, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative h-2 w-full overflow-hidden rounded-full bg-white/[0.06]",
      className,
    )}
    {...props}
  >
    <div
      className="h-full rounded-full bg-gradient-to-r from-primary to-primary/70 shadow-[0_0_12px_hsl(160_84%_39%/0.3)]"
      style={{ width: `${value ?? 0}%`, transition: "width 0.5s ease-out" }}
    />
  </div>
));
Progress.displayName = "Progress";

export { Progress };
