import { useState } from "react";

import castleTextureDark2 from "../../assets/castle-texture-dark-2.jpg";
import candleImage from "../../assets/vela.png";

type ActivationScreenProps = {
  isLit: boolean;
  onIgnite: () => void;
};

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
        src={castleTextureDark2}
        alt="Templo escuro"
      />
      <div className="dark-overlay" />

      <div
        className="cursor-lighter"
        style={{ left: cursorPosition.x, top: cursorPosition.y }}
        aria-hidden="true"
      >
        <span className="lighter-flame" />
        <span className="lighter-core" />
        <span className="lighter-body" />
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
        <img src={candleImage} alt="Vela branca" className="candle-image" />
        <span className="flame" />
      </button>
    </section>
  );
};
