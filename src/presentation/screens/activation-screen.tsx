type ActivationScreenProps = {
  isLit: boolean;
  onIgnite: () => void;
};

export const ActivationScreen = ({
  isLit,
  onIgnite,
}: ActivationScreenProps) => {
  return (
    <section className={`screen activation-screen ${isLit ? "is-lit" : ""}`}>
      <img
        className="activation-bg"
        src="/assets/fundo.jpg"
        alt="Templo escuro"
      />
      <div className="dark-overlay" />

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
        <span className="flame" />
      </button>
    </section>
  );
};
