import { useEffect, useMemo } from "react";

import { useGameController } from "./presentation/hooks/use-game-controller";
import { useAudioController } from "./presentation/hooks/use-audio-controller";
import { ActivationScreen } from "./presentation/screens/activation-screen";
import { FormScreen } from "./presentation/screens/form-screen";
import { ResponseScreen } from "./presentation/screens/response-screen";
import { SelectionScreen } from "./presentation/screens/selection-screen";

function App() {
  const {
    state,
    orderedCards,
    canAdvanceForm,
    canAnswer,
    igniteCandle,
    updateFormField,
    nextFormStep,
    previousFormStep,
    goToSelection,
    shuffleDeck,
    selectCard,
    removeSelectedCard,
    generateAnswer,
    restart,
  } = useGameController();
  const { playMusic, playEffect, unlockAudio, stopAll, toggleMusic, isPaused } =
    useAudioController();

  useEffect(() => {
    void playMusic(state.screen);
  }, [playMusic, state.screen]);

  useEffect(() => stopAll, [stopAll]);

  const content = useMemo(() => {
    if (state.isLoading) {
      return (
        <section className="screen loading-screen">
          <p>Carregando o ritual...</p>
        </section>
      );
    }

    if (state.error) {
      return (
        <section className="screen loading-screen">
          <p>{state.error}</p>
        </section>
      );
    }

    if (state.screen === "activation") {
      return (
        <ActivationScreen
          isLit={state.isLit}
          onIgnite={() => {
            void unlockAudio();
            void playEffect("candle");
            igniteCandle();
          }}
        />
      );
    }

    if (state.screen === "form") {
      return (
        <FormScreen
          step={state.formStep}
          formData={state.formData}
          canAdvance={canAdvanceForm}
          onChange={updateFormField}
          onBack={previousFormStep}
          onNext={nextFormStep}
          onSubmit={goToSelection}
        />
      );
    }

    if (state.screen === "selection") {
      return (
        <SelectionScreen
          deck={orderedCards}
          selectedCards={state.selectedCards}
          isShuffling={state.isShuffling}
          canAnswer={canAnswer}
          onShuffle={shuffleDeck}
          onSelectCard={(cardId) => {
            void unlockAudio();
            void playEffect("card");
            selectCard(cardId);
          }}
          onRemoveCard={removeSelectedCard}
          onAnswer={() => {
            void generateAnswer();
          }}
        />
      );
    }

    if (state.screen === "response" && state.reading) {
      return <ResponseScreen reading={state.reading} onRestart={restart} />;
    }

    return null;
  }, [
    canAdvanceForm,
    canAnswer,
    generateAnswer,
    goToSelection,
    igniteCandle,
    nextFormStep,
    orderedCards,
    previousFormStep,
    removeSelectedCard,
    restart,
    selectCard,
    shuffleDeck,
    state,
    playEffect,
    unlockAudio,
    updateFormField,
  ]);

  return (
    <main
      className="app-shell"
      onPointerDownCapture={() => {
        void unlockAudio();
        void playMusic(state.screen);
      }}
    >
      <div
        className="top-audio-bar"
        role="toolbar"
        aria-label="Controle de musica"
      >
        <span className="top-audio-brand">Entidades Ocultas</span>

        <button
          type="button"
          className="top-audio-toggle"
          onClick={() => {
            void unlockAudio();
            void toggleMusic();
          }}
          aria-label={isPaused ? "Continuar musica" : "Pausar musica"}
          title={isPaused ? "Continuar musica" : "Pausar musica"}
        >
          {isPaused ? (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7 5h3v14H7zM14 5h3v14h-3z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7 5v14l11-7z" />
            </svg>
          )}
          <span>{isPaused ? "Continuar" : "Pausar"}</span>
        </button>
      </div>

      {content}
    </main>
  );
}

export default App;
