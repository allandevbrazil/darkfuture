import { useMemo } from "react";

import { useGameController } from "./presentation/hooks/use-game-controller";
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
      return <ActivationScreen isLit={state.isLit} onIgnite={igniteCandle} />;
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
          onSelectCard={selectCard}
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
    updateFormField,
  ]);

  return <main className="app-shell">{content}</main>;
}

export default App;
