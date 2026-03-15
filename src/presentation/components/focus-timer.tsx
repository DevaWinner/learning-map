import { useEffect, useState } from "react";
import {
  Bell,
  BellOff,
  Play,
  Pause,
  Square,
  RefreshCcw,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useTimerAudio } from "@/presentation/hooks/use-timer-audio";
import { Button } from "@/presentation/components/ui/button";
import { Card, CardContent } from "@/presentation/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/presentation/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/presentation/components/ui/select";
import type { RoadmapFocusOption } from "@/domain/services/get-week-roadmap-focus-options";

interface FocusTimerProps {
  focusOptions: RoadmapFocusOption[];
  selectedFocusId: RoadmapFocusOption["id"];
  onSelectFocus: (focusId: RoadmapFocusOption["id"]) => void;
  onComplete: (hours: number) => void;
}

function roundHours(hours: number) {
  return Number(hours.toFixed(2));
}

interface TimerSoundSettings {
  tickEnabled: boolean;
  completionEnabled: boolean;
}

const TIMER_SOUND_SETTINGS_STORAGE_KEY = "roadmap-os.timer-sound-settings";
const defaultSoundSettings: TimerSoundSettings = {
  tickEnabled: true,
  completionEnabled: true,
};

function loadTimerSoundSettings(): TimerSoundSettings {
  if (typeof window === "undefined") {
    return defaultSoundSettings;
  }

  try {
    const raw = window.localStorage.getItem(TIMER_SOUND_SETTINGS_STORAGE_KEY);
    if (!raw) {
      return defaultSoundSettings;
    }

    const parsed = JSON.parse(raw) as Partial<TimerSoundSettings>;

    return {
      tickEnabled: parsed.tickEnabled ?? true,
      completionEnabled: parsed.completionEnabled ?? true,
    };
  } catch {
    return defaultSoundSettings;
  }
}

export function FocusTimer({
  focusOptions,
  selectedFocusId,
  onSelectFocus,
  onComplete,
}: FocusTimerProps) {
  const [targetMinutes, setTargetMinutes] = useState(60); // Default to 1 hour
  const [secondsLeft, setSecondsLeft] = useState(60 * 60);
  const [isActive, setIsActive] = useState(false);
  const [totalElapsedSeconds, setTotalElapsedSeconds] = useState(0);
  const [soundSettings, setSoundSettings] = useState<TimerSoundSettings>(
    loadTimerSoundSettings,
  );
  const { primeAudio, playTick, playCompletion } = useTimerAudio();

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(
      TIMER_SOUND_SETTINGS_STORAGE_KEY,
      JSON.stringify(soundSettings),
    );
  }, [soundSettings]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        if (soundSettings.tickEnabled) {
          playTick();
        }
        setSecondsLeft((s) => s - 1);
        setTotalElapsedSeconds((s) => s + 1);
      }, 1000);
    } else if (isActive && secondsLeft === 0) {
      // Timer hit precisely 0
      setIsActive(false);
      if (soundSettings.completionEnabled) {
        playCompletion();
      }
      onComplete(roundHours(targetMinutes / 60));
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [
    isActive,
    secondsLeft,
    soundSettings,
    targetMinutes,
    onComplete,
    playCompletion,
    playTick,
  ]);

  const isMuted = !soundSettings.tickEnabled && !soundSettings.completionEnabled;

  const toggleSoundSetting = (key: keyof TimerSoundSettings) => {
    setSoundSettings((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  const handleStart = () => {
    void primeAudio();
    setIsActive(true);
  };
  const handlePause = () => setIsActive(false);

  const handleFinish = () => {
    setIsActive(false);
    if (totalElapsedSeconds > 0) {
      onComplete(roundHours(totalElapsedSeconds / 3600));
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
    <Card className="relative mx-auto max-w-xl overflow-hidden border-primary/20 bg-primary/[0.02] shadow-2xl backdrop-blur-3xl">
      <CardContent className="flex flex-col items-center justify-center space-y-8 p-6 sm:p-10 lg:p-12">
        <div className="flex w-full justify-end">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="size-11 rounded-xl border-white/[0.08] bg-white/[0.04]"
                aria-label={isMuted ? "Sound muted" : "Sound settings"}
              >
                {isMuted ? <VolumeX /> : <Volume2 />}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 space-y-4">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground">
                  Timer sound
                </p>
                <p className="text-xs leading-5 text-muted-foreground">
                  Mute the countdown tick, the completion chime, or both.
                </p>
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  className="flex w-full items-center justify-between rounded-2xl border border-white/[0.06] bg-white/[0.03] px-4 py-3 text-left transition-colors hover:bg-white/[0.05]"
                  onClick={() => toggleSoundSetting("tickEnabled")}
                >
                  <div className="flex items-start gap-3">
                    {soundSettings.tickEnabled ? (
                      <Volume2 className="mt-0.5 size-4 text-primary" />
                    ) : (
                      <VolumeX className="mt-0.5 size-4 text-muted-foreground" />
                    )}
                    <div className="space-y-1">
                      <div className="text-sm font-semibold text-foreground">
                        Countdown tick
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Plays each second while the timer runs.
                      </div>
                    </div>
                  </div>
                  <div
                    className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${
                      soundSettings.tickEnabled
                        ? "bg-primary/15 text-primary"
                        : "bg-white/[0.05] text-muted-foreground"
                    }`}
                  >
                    {soundSettings.tickEnabled ? "On" : "Off"}
                  </div>
                </button>

                <button
                  type="button"
                  className="flex w-full items-center justify-between rounded-2xl border border-white/[0.06] bg-white/[0.03] px-4 py-3 text-left transition-colors hover:bg-white/[0.05]"
                  onClick={() => toggleSoundSetting("completionEnabled")}
                >
                  <div className="flex items-start gap-3">
                    {soundSettings.completionEnabled ? (
                      <Bell className="mt-0.5 size-4 text-primary" />
                    ) : (
                      <BellOff className="mt-0.5 size-4 text-muted-foreground" />
                    )}
                    <div className="space-y-1">
                      <div className="text-sm font-semibold text-foreground">
                        Completion chime
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Plays when the timer reaches zero.
                      </div>
                    </div>
                  </div>
                  <div
                    className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${
                      soundSettings.completionEnabled
                        ? "bg-primary/15 text-primary"
                        : "bg-white/[0.05] text-muted-foreground"
                    }`}
                  >
                    {soundSettings.completionEnabled ? "On" : "Off"}
                  </div>
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {!isActive && totalElapsedSeconds === 0 && (
          <div className="grid w-full gap-4 md:grid-cols-[13rem_minmax(0,1fr)]">
            <div className="w-full">
              <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                Duration
              </div>
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

            <div className="w-full min-w-0">
              <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                Working on
              </div>
              <Select value={selectedFocusId} onValueChange={onSelectFocus}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select roadmap focus" />
                </SelectTrigger>
                <SelectContent>
                  {focusOptions.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      <div className="min-w-0">
                        <div className="font-semibold">{option.label}</div>
                        <div className="truncate text-xs text-muted-foreground">
                          {option.detail}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Minimal offset when running to keep UI balanced */}
        {(isActive || totalElapsedSeconds > 0) && <div className="h-8" />}

        <div className="relative flex items-center justify-center py-2">
          {/* Ambient glow effect that pulses while active */}
          <div
            className={`absolute inset-0 rounded-full bg-primary/20 blur-[100px] transition-opacity duration-1000 ${isActive ? "opacity-100 animate-pulse" : "opacity-30"}`}
          />
          <div className="relative font-mono text-6xl font-bold tracking-tighter text-foreground sm:text-7xl md:text-[7.5rem]">
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
            onClick={totalElapsedSeconds > 0 ? handleFinish : handleReset}
            className="h-14 w-36 text-base font-bold"
          >
            {totalElapsedSeconds > 0 ? (
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
