import type { ReadingResult } from "../../domain/entities/reading";

type ResponseScreenProps = {
  reading: ReadingResult;
  onRestart: () => void;
};

const POSITION_LABEL: Record<"past" | "present" | "future", string> = {
  past: "Passado",
  present: "Presente",
  future: "Futuro",
};

export const ResponseScreen = ({ reading, onRestart }: ResponseScreenProps) => {
  return (
    <section className="screen response-screen">
      <img
        className="screen-bg"
        src="/assets/_f81253fc-629c-47db-8213-d0f795209bb7.jpg"
        alt="Resposta espiritual"
      />
      <div className="screen-shade" />

      <div className="panel response-panel">
        <p className="screen-kicker">Resposta</p>
        <h2>A Voz das Entidades</h2>
        <h3>{reading.title}</h3>

        <div className="reading-cards">
          {reading.cards.map((entry) => (
            <article
              className="reading-card"
              key={`${entry.position}-${entry.card.id}`}
            >
              <span>{POSITION_LABEL[entry.position]}</span>
              <img src={entry.card.image} alt={entry.card.name} />
              <strong>{entry.card.name}</strong>
            </article>
          ))}
        </div>

        <blockquote>{reading.oracleVoice}</blockquote>
        <p>{reading.synthesis}</p>
        <p className="recommendation">{reading.recommendation}</p>

        <div className="actions-row align-right">
          <button type="button" className="btn" onClick={onRestart}>
            Recomeçar jogo
          </button>
        </div>
      </div>
    </section>
  );
};
