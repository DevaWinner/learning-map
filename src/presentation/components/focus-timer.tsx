import { useState, useEffect } from "react";
import { Play, Pause, Square, RefreshCcw } from "lucide-react";
import { Button } from "@/presentation/components/ui/button";
import { Card, CardContent } from "@/presentation/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/presentation/components/ui/select";

interface FocusTimerProps {
  onComplete: (hours: number) => void;
}

export function FocusTimer({ onComplete }: FocusTimerProps) {
  const [targetMinutes, setTargetMinutes] = useState(60); // Default to 1 hour
  const [secondsLeft, setSecondsLeft] = useState(60 * 60);
  const [isActive, setIsActive] = useState(false);
  const [totalElapsedSeconds, setTotalElapsedSeconds] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((s) => s - 1);
        setTotalElapsedSeconds((s) => s + 1);
      }, 1000);
    } else if (isActive && secondsLeft === 0) {
      // Timer hit precisely 0
      setIsActive(false);
      // Floor the target minutes into hours and round to nearest 0.5
      const hours = Math.max(0.5, Math.round((targetMinutes / 60) * 2) / 2);
      onComplete(hours);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, secondsLeft, totalElapsedSeconds, targetMinutes, onComplete]);

  const handleStart = () => setIsActive(true);
  const handlePause = () => setIsActive(false);

  const handleStop = () => {
    setIsActive(false);
    if (totalElapsedSeconds >= 60) {
      // Allow early finish if they ran it for at least a minute
      const hours = Math.max(
        0.5,
        Math.round((totalElapsedSeconds / 3600) * 2) / 2,
      );
      onComplete(hours);
    } else {
      handleReset();
    }
  };

  const handleReset = () => {
    setIsActive(false);
    setSecondsLeft(targetMinutes * 60);
    setTotalElapsedSeconds(0);
  };

  const handleDurationChange = (val: string) => {
    const mins = parseInt(val, 10);
    setTargetMinutes(mins);
    setSecondsLeft(mins * 60);
    setTotalElapsedSeconds(0);
    setIsActive(false);
  };

  const m = Math.floor(secondsLeft / 60);
  const s = secondsLeft % 60;
  const timeString = `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  const progress = 100 - (secondsLeft / (targetMinutes * 60)) * 100;

  return (
    <Card className="mx-auto max-w-2xl border-primary/20 bg-primary/[0.02] shadow-2xl backdrop-blur-3xl overflow-hidden relative">
      <CardContent className="flex flex-col items-center justify-center space-y-12 p-8 sm:p-16">
        {!isActive && totalElapsedSeconds === 0 && (
          <div className="w-56">
            <Select
              value={targetMinutes.toString()}
              onValueChange={handleDurationChange}
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 Minutes</SelectItem>
                <SelectItem value="25">25 Minutes (Pomodoro)</SelectItem>
                <SelectItem value="45">45 Minutes</SelectItem>
                <SelectItem value="60">1 Hour focus</SelectItem>
                <SelectItem value="90">90 Minutes deep work</SelectItem>
                <SelectItem value="120">2 Hours deep work</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Minimal offset when running to keep UI balanced */}
        {(isActive || totalElapsedSeconds > 0) && <div className="h-11" />}

        <div className="relative flex items-center justify-center py-4">
          {/* Ambient glow effect that pulses while active */}
          <div
            className={`absolute inset-0 rounded-full bg-primary/20 blur-[100px] transition-opacity duration-1000 ${isActive ? "opacity-100 animate-pulse" : "opacity-30"}`}
          />
          <div className="relative font-mono text-7xl font-bold tracking-tighter text-foreground sm:text-8xl md:text-[9rem]">
            {timeString}
          </div>
        </div>

        <div className="w-full h-1.5 overflow-hidden rounded-full bg-white/5">
          <div
            className="h-full bg-primary transition-all duration-1000 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center gap-4">
          {!isActive && secondsLeft > 0 ? (
            <Button
              size="lg"
              onClick={handleStart}
              className="h-14 w-36 text-base font-bold"
            >
              <Play className="mr-2 size-5 fill-current" />
              Start
            </Button>
          ) : (
            secondsLeft > 0 && (
              <Button
                size="lg"
                variant="secondary"
                onClick={handlePause}
                className="h-14 w-36 text-base font-bold"
              >
                <Pause className="mr-2 size-5 fill-current" />
                Pause
              </Button>
            )
          )}

          <Button
            size="lg"
            variant="outline"
            onClick={totalElapsedSeconds > 0 ? handleStop : handleReset}
            className="h-14 w-36 text-base font-bold"
          >
            {totalElapsedSeconds > 0 && !isActive ? (
              <>
                <Square className="mr-2 size-4 fill-current" />
                Finish
              </>
            ) : (
              <>
                <RefreshCcw className="mr-2 size-4" />
                Reset
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
