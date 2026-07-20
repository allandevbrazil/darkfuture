import type { TarotCard, TarotPosition } from "../../domain/entities/card";
import type { SelectedCards } from "../types/game-types";

type SelectionScreenProps = {
  deck: TarotCard[];
  selectedCards: SelectedCards;
  isShuffling: boolean;
  canAnswer: boolean;
  onShuffle: () => void;
  onSelectCard: (cardId: string) => void;
  onRemoveCard: (position: TarotPosition) => void;
  onAnswer: () => void;
};

const POSITION_LABEL: Record<TarotPosition, string> = {
  past: "Passado",
  present: "Presente",
  future: "Futuro",
};

const POSITIONS: TarotPosition[] = ["past", "present", "future"];

export const SelectionScreen = ({
  deck,
  selectedCards,
  isShuffling,
  canAnswer,
  onShuffle,
  onSelectCard,
  onRemoveCard,
  onAnswer,
}: SelectionScreenProps) => {
  const pickedIds = new Set(
    Object.values(selectedCards).map((card) => card?.id),
  );
  const selectedCount = Object.values(selectedCards).filter(Boolean).length;

  return (
    <section className="screen selection-screen">
      <img
        className="screen-bg"
        src="/assets/_fundo.jpg"
        alt="Mesa de cartas"
      />
      <div className="screen-shade" />

      <div className="panel selection-panel">
        <div className="selection-head">
          <div>
            <p className="screen-kicker">Escolha</p>
            <h2>Embaralhar e Selecionar</h2>
            <p className="screen-subtitle">
              Escolha 3 cartas para passado, presente e futuro.
            </p>
            <p className="selection-progress">
              {selectedCount}/3 cartas seladas
            </p>
          </div>

          <div className="selection-actions">
            <button
              type="button"
              className={`btn ${isShuffling ? "pulse" : ""}`}
              onClick={onShuffle}
            >
              Embaralhar deck
            </button>

            <button
              type="button"
              className="btn selection"
              onClick={onAnswer}
              disabled={!canAnswer}
            >
              Responder pergunta
            </button>
          </div>
        </div>

        <div className="selected-slots">
          {POSITIONS.map((position) => {
            const card = selectedCards[position];
            return (
              <button
                key={position}
                type="button"
                className="slot"
                onClick={() => onRemoveCard(position)}
                title={
                  card ? "Clique para remover carta" : "Aguardando selecao"
                }
              >
                <span>{POSITION_LABEL[position]}</span>
                {card ? (
                  <>
                    <img src="/assets/verso.jpg" alt="Carta selada" />
                    <strong>Carta selada</strong>
                  </>
                ) : (
                  <em>Escolha uma carta</em>
                )}
              </button>
            );
          })}
        </div>

        <div className={`deck-grid ${isShuffling ? "is-shuffling" : ""}`}>
          {deck.map((card) => (
            <button
              type="button"
              key={card.id}
              className={`deck-card ${pickedIds.has(card.id) ? "is-picked" : ""}`}
              onClick={() => onSelectCard(card.id)}
              disabled={pickedIds.has(card.id)}
              title={card.name}
            >
              <img src="/assets/verso.jpg" alt="Verso da carta" />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
