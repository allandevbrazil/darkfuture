import { useState } from "react";

type ActivationScreenProps = {
  isLit: boolean;
  onIgnite: () => void;
};

const ASSET_BASE = import.meta.env.BASE_URL;

export const ActivationScreen = ({
  isLit,
  onIgnite,
}: ActivationScreenProps) => {
  const [cursorPosition, setCursorPosition] = useState({ x: -200, y: -200 });

  return (
    <section
      className={`screen activation-screen ${isLit ? "is-lit" : ""}`}
      onMouseMove={(event) =>
        setCursorPosition({ x: event.clientX, y: event.clientY })
      }
      onMouseLeave={() => setCursorPosition({ x: -200, y: -200 })}
    >
      <img
        className="activation-bg"
        src={`${ASSET_BASE}assets/castle-texture-dark-2.jpg`}
        alt="Templo escuro"
      />
      <div className="dark-overlay" />

      <div
        className="cursor-lighter"
        style={{ left: cursorPosition.x, top: cursorPosition.y }}
        aria-hidden="true"
      >
        <svg
          className="lighter-svg"
          viewBox="0 0 64 96"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="lighterBody" x1="18" y1="12" x2="46" y2="84">
              <stop offset="0%" stopColor="#fbfbfb" />
              <stop offset="45%" stopColor="#d8d8d8" />
              <stop offset="100%" stopColor="#7b7b7b" />
            </linearGradient>
            <linearGradient id="lighterGlow" x1="32" y1="0" x2="32" y2="36">
              <stop offset="0%" stopColor="#fff4b8" />
              <stop offset="50%" stopColor="#ffb04d" />
              <stop offset="100%" stopColor="#ea5f2a" />
            </linearGradient>
          </defs>
          <path
            d="M22 14c0-4.418 3.582-8 8-8h4c4.418 0 8 3.582 8 8v6H22v-6Z"
            fill="url(#lighterBody)"
          />
          <rect
            x="18"
            y="20"
            width="28"
            height="46"
            rx="8"
            fill="url(#lighterBody)"
          />
          <rect
            x="22"
            y="34"
            width="20"
            height="16"
            rx="4"
            fill="#4b4b4b"
            opacity="0.88"
          />
          <path
            d="M30.5 2C34.5 8.5 39 13.5 39 20c0 5-3.8 9-8.5 9S22 25 22 20c0-6.5 4.5-11.5 8.5-18Z"
            fill="url(#lighterGlow)"
            className="lighter-flame"
          />
          <path
            d="M24 8l-5 6"
            stroke="#5d5d5d"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M41 8l5 6"
            stroke="#5d5d5d"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="activation-content">
        <p className="screen-kicker">Ativacao</p>
        <h1>A Vela Apagada</h1>
        <p className="screen-subtitle">
          Toque no foco da vela para abrir o ritual e ouvir a voz das entidades.
        </p>
      </div>

      <button
        type="button"
        className={`candle-hotspot ${isLit ? "lit" : ""}`}
        onClick={onIgnite}
        disabled={isLit}
        aria-label="Acender vela"
      >
        <img
          src={`${ASSET_BASE}assets/vela.png`}
          alt="Vela branca"
          className="candle-image"
        />
        <span className="flame" />
      </button>
    </section>
  );
};
