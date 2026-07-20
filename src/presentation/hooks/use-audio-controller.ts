import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
} from "react";

const VOLUME = {
  activation: 0.18,
  select: 0.16,
  response: 0.14,
  effect: 0.55,
} as const;

const PATHS = {
  activation: "/assets/intro.mp3",
  select: "/assets/music-select-cards.mp3",
  response: "/assets/music-awnser.mp3",
  candle: "/assets/sound-vela-acendendo.wav",
  card: "/assets/sound-select-card.wav",
} as const;

export type AudioScene = "activation" | "form" | "selection" | "response";

export const useAudioController = () => {
  const activationMusicRef = useRef<HTMLAudioElement | null>(null);
  const selectMusicRef = useRef<HTMLAudioElement | null>(null);
  const responseMusicRef = useRef<HTMLAudioElement | null>(null);
  const candleFxRef = useRef<HTMLAudioElement | null>(null);
  const cardFxRef = useRef<HTMLAudioElement | null>(null);
  const currentMusicRef = useRef<HTMLAudioElement | null>(null);
  const desiredSceneRef = useRef<AudioScene>("activation");
  const unlockedRef = useRef(false);
  const [isPaused, setIsPaused] = useState(false);

  const ensureAudio = useCallback(
    (
      ref: MutableRefObject<HTMLAudioElement | null>,
      src: string,
      volume: number,
      loop = true,
    ) => {
      if (!ref.current) {
        const audio = new Audio(src);
        audio.preload = "auto";
        audio.loop = loop;
        audio.volume = volume;
        ref.current = audio;
      }

      return ref.current;
    },
    [],
  );

  const stopCurrentMusic = useCallback(() => {
    const current = currentMusicRef.current;
    if (!current) {
      return;
    }

    current.pause();
    current.currentTime = 0;
    currentMusicRef.current = null;
  }, []);

  const playMusic = useCallback(
    async (scene: AudioScene) => {
      desiredSceneRef.current = scene;

      if (isPaused) {
        return;
      }

      const track =
        scene === "activation"
          ? ensureAudio(activationMusicRef, PATHS.activation, VOLUME.activation)
          : scene === "response"
            ? ensureAudio(responseMusicRef, PATHS.response, VOLUME.response)
            : ensureAudio(selectMusicRef, PATHS.select, VOLUME.select);

      if (currentMusicRef.current === track && !track.paused) {
        return;
      }

      stopCurrentMusic();
      track.currentTime = 0;

      try {
        await track.play();
        currentMusicRef.current = track;
      } catch {
        // Autoplay can be blocked until the first user gesture.
      }
    },
    [ensureAudio, isPaused, stopCurrentMusic],
  );

  const pauseMusic = useCallback(() => {
    const current = currentMusicRef.current;
    if (!current) {
      setIsPaused(true);
      return;
    }

    current.pause();
    setIsPaused(true);
  }, []);

  const resumeMusic = useCallback(async () => {
    setIsPaused(false);
    const scene = desiredSceneRef.current;
    await playMusic(scene);
  }, [playMusic]);

  const toggleMusic = useCallback(async () => {
    if (isPaused) {
      await resumeMusic();
      return;
    }

    pauseMusic();
  }, [isPaused, pauseMusic, resumeMusic]);

  const playEffect = useCallback(
    async (kind: "candle" | "card") => {
      const track =
        kind === "candle"
          ? ensureAudio(candleFxRef, PATHS.candle, VOLUME.effect, false)
          : ensureAudio(cardFxRef, PATHS.card, VOLUME.effect, false);

      track.currentTime = 0;

      try {
        await track.play();
      } catch {
        // Ignore until user gesture is available.
      }
    },
    [ensureAudio],
  );

  const unlockAudio = useCallback(async () => {
    if (unlockedRef.current) {
      return;
    }

    unlockedRef.current = true;
    await Promise.all([
      ensureAudio(activationMusicRef, PATHS.activation, VOLUME.activation),
      ensureAudio(selectMusicRef, PATHS.select, VOLUME.select),
      ensureAudio(responseMusicRef, PATHS.response, VOLUME.response),
      ensureAudio(candleFxRef, PATHS.candle, VOLUME.effect, false),
      ensureAudio(cardFxRef, PATHS.card, VOLUME.effect, false),
    ]);
  }, [ensureAudio]);

  const stopAll = useCallback(() => {
    [
      activationMusicRef.current,
      selectMusicRef.current,
      responseMusicRef.current,
      candleFxRef.current,
      cardFxRef.current,
    ].forEach((audio) => {
      if (!audio) {
        return;
      }
      audio.pause();
      audio.currentTime = 0;
    });
    currentMusicRef.current = null;
  }, []);

  return useMemo(
    () => ({
      playMusic,
      playEffect,
      unlockAudio,
      stopAll,
      pauseMusic,
      resumeMusic,
      toggleMusic,
      isPaused,
    }),
    [
      isPaused,
      pauseMusic,
      playEffect,
      playMusic,
      resumeMusic,
      stopAll,
      toggleMusic,
      unlockAudio,
    ],
  );
};
