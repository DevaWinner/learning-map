import { useCallback, useEffect, useRef } from "react";

type BrowserAudioContextConstructor = new () => AudioContext;
type BrowserWindowWithAudio = Window &
  typeof globalThis & {
    webkitAudioContext?: BrowserAudioContextConstructor;
  };

interface ToneOptions {
  frequency: number;
  duration: number;
  volume: number;
  type?: OscillatorType;
  attack?: number;
  release?: number;
  endFrequency?: number;
  startOffset?: number;
}

function scheduleTone(
  audioContext: AudioContext,
  {
    frequency,
    duration,
    volume,
    type = "sine",
    attack = 0.005,
    release = 0.04,
    endFrequency,
    startOffset = 0,
  }: ToneOptions,
) {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  const startTime = audioContext.currentTime + startOffset;
  const stopTime = startTime + duration;

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, startTime);

  if (endFrequency) {
    oscillator.frequency.exponentialRampToValueAtTime(endFrequency, stopTime);
  }

  gainNode.gain.setValueAtTime(0.0001, startTime);
  gainNode.gain.exponentialRampToValueAtTime(volume, startTime + attack);
  gainNode.gain.exponentialRampToValueAtTime(
    0.0001,
    Math.max(startTime + attack + 0.01, stopTime - release),
  );

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.start(startTime);
  oscillator.stop(stopTime);
}

export function useTimerAudio() {
  const audioContextRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(async () => {
    if (typeof window === "undefined") {
      return null;
    }

    const browserWindow = window as BrowserWindowWithAudio;
    const AudioContextConstructor =
      browserWindow.AudioContext ?? browserWindow.webkitAudioContext;

    if (!AudioContextConstructor) {
      return null;
    }

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContextConstructor();
    }

    if (audioContextRef.current.state === "suspended") {
      await audioContextRef.current.resume();
    }

    return audioContextRef.current;
  }, []);

  const primeAudio = useCallback(async () => {
    await getAudioContext();
  }, [getAudioContext]);

  const playTick = useCallback(() => {
    const audioContext = audioContextRef.current;

    if (!audioContext || audioContext.state !== "running") {
      return;
    }

    scheduleTone(audioContext, {
      frequency: 1320,
      endFrequency: 1160,
      duration: 0.08,
      volume: 0.06,
      type: "square",
      attack: 0.002,
      release: 0.05,
    });
  }, []);

  const playCompletion = useCallback(() => {
    const audioContext = audioContextRef.current;

    if (!audioContext || audioContext.state !== "running") {
      return;
    }

    scheduleTone(audioContext, {
      frequency: 784,
      endFrequency: 932,
      duration: 0.2,
      volume: 0.09,
      type: "triangle",
      attack: 0.01,
      release: 0.1,
      startOffset: 0,
    });
    scheduleTone(audioContext, {
      frequency: 1047,
      endFrequency: 1319,
      duration: 0.22,
      volume: 0.1,
      type: "triangle",
      attack: 0.01,
      release: 0.1,
      startOffset: 0.12,
    });
    scheduleTone(audioContext, {
      frequency: 1397,
      endFrequency: 1760,
      duration: 0.4,
      volume: 0.12,
      type: "triangle",
      attack: 0.01,
      release: 0.16,
      startOffset: 0.26,
    });
  }, []);

  useEffect(() => {
    return () => {
      const audioContext = audioContextRef.current;
      audioContextRef.current = null;

      if (audioContext && audioContext.state !== "closed") {
        void audioContext.close().catch(() => undefined);
      }
    };
  }, []);

  return {
    primeAudio,
    playTick,
    playCompletion,
  };
}
