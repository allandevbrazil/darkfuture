import { useEffect, useRef, useState } from "react";

import type { ReadingResult } from "../../domain/entities/reading";

type ResponseScreenProps = {
  reading: ReadingResult;
  onRestart: () => void;
  onAskAnotherQuestion: () => void;
};

const POSITION_LABEL: Record<"past" | "present" | "future", string> = {
  past: "Passado",
  present: "Presente",
  future: "Futuro",
};

const THEME_LABEL: Record<ReadingResult["theme"], string> = {
  amor: "Relacionamento",
  amizade: "Amizade",
  trabalho: "Trabalho",
  geral: "Leitura geral",
};

const TONE_LABEL: Record<ReadingResult["tone"], string> = {
  abertura: "abertura",
  alerta: "alerta",
  movimento: "movimento",
  estabilidade: "estabilidade",
};

const REVEAL_DELAYS = [3000, 5000, 6000] as const;
const REVEAL_FLIP_DURATION = 900;
const REVEAL_SOUND_PATH = "/assets/sound-select-card.wav";
const REVEAL_SOUND_VOLUME = 0.55;
type CardRevealState = "hidden" | "flipping" | "revealed";

export const ResponseScreen = ({
  reading,
  onRestart,
  onAskAnotherQuestion,
}: ResponseScreenProps) => {
  const [cardStates, setCardStates] = useState<CardRevealState[]>([
    "hidden",
    "hidden",
    "hidden",
  ]);
  const [showReadingText, setShowReadingText] = useState(false);
  const revealFxRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const timeouts = REVEAL_DELAYS.map((delay, index) =>
      window.setTimeout(() => {
        setCardStates((current) =>
          current.map((state, currentIndex) =>
            currentIndex === index ? "flipping" : state,
          ),
        );

        window.setTimeout(() => {
          setCardStates((current) =>
            current.map((state, currentIndex) =>
              currentIndex === index ? "revealed" : state,
            ),
          );
        }, REVEAL_FLIP_DURATION);

        if (index === REVEAL_DELAYS.length - 1) {
          const revealFx = new Audio(REVEAL_SOUND_PATH);
          revealFx.preload = "auto";
          revealFx.volume = REVEAL_SOUND_VOLUME;
          revealFxRef.current = revealFx;

          const showText = () => setShowReadingText(true);
          revealFx.addEventListener("ended", showText, { once: true });

          void revealFx.play().catch(() => {
            showText();
          });
        }
      }, delay),
    );

    return () => {
      timeouts.forEach((timeoutId) => window.clearTimeout(timeoutId));

      const revealFx = revealFxRef.current;
      if (revealFx) {
        revealFx.pause();
        revealFx.currentTime = 0;
        revealFxRef.current = null;
      }
    };
  }, [reading]);

  return (
    <section className="screen response-screen">
      <img
        className="screen-bg"
        src="/assets/castle-texture.jpg"
        alt="Resposta espiritual"
      />
      <div className="screen-shade" />

      <div className="panel response-panel">
        <p className="screen-kicker">Resposta</p>
        <h2>A Voz das Entidades</h2>
        <h3>{reading.title}</h3>
        <p className="reading-meta">
          Tema: {THEME_LABEL[reading.theme]} • Energia:{" "}
          {TONE_LABEL[reading.tone]}
        </p>

        <div className="response-flip-stage" aria-label="Revelacao das cartas">
          {reading.cards.map((entry, index) => (
            <article
              className={`response-flip-card response-flip-card--${cardStates[index]}`}
              key={`${entry.position}-${entry.card.id}`}
            >
              <span>{POSITION_LABEL[entry.position]}</span>
              <div className="response-card-viewport">
                <img
                  className="response-card-face response-card-back"
                  src="/assets/verso.jpg"
                  alt="Verso da carta"
                />
                <img
                  className="response-card-face response-card-front"
                  src={entry.card.image}
                  alt={entry.card.name}
                />
              </div>
              {cardStates[index] === "revealed" ? (
                <strong>{entry.card.name}</strong>
              ) : (
                <strong className="response-card-name-placeholder">
                  &nbsp;
                </strong>
              )}
            </article>
          ))}
        </div>

        {showReadingText ? (
          <div className="response-text-flow">
            <p className="reading-context">{reading.contextSummary}</p>
            <blockquote>{reading.oracleVoice}</blockquote>
            <p>{reading.synthesis}</p>
            <p className="recommendation">{reading.recommendation}</p>
          </div>
        ) : (
          <p className="reading-waiting">A leitura esta se manifestando...</p>
        )}

        <div className="actions-row align-right">
          <button
            type="button"
            className="btn ghost"
            onClick={onAskAnotherQuestion}
          >
            Fazer outra pergunta
          </button>
          <button type="button" className="btn" onClick={onRestart}>
            Recomeçar jogo
          </button>
        </div>
      </div>
    </section>
  );
};
