import { useCallback, useEffect, useMemo, useState } from "react";

import { GenerateReadingUseCase } from "../../application/use-cases/generate-reading";
import { GetDeckCardsUseCase } from "../../application/use-cases/get-deck-cards";
import type { PlayerProfile } from "../../domain/entities/player";
import type { PositionedCard } from "../../domain/entities/reading";
import { TarotInterpreter } from "../../domain/services/tarot-interpreter";
import { JsonCardRepository } from "../../infrastructure/repositories/json-card-repository";
import { JsonResponseRepository } from "../../infrastructure/repositories/json-response-repository";
import {
  FORM_STEPS,
  POSITION_ORDER,
  type GameState,
  type SelectedCards,
} from "../types/game-types";

const EMPTY_FORM: PlayerProfile = {
  name: "",
  sex: "",
  birthDate: "",
  birthTime: "",
  question: "",
};

const shuffleIds = (ids: string[]): string[] => {
  const next = [...ids];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [next[i], next[randomIndex]] = [next[randomIndex], next[i]];
  }
  return next;
};

export const useGameController = () => {
  const [state, setState] = useState<GameState>({
    screen: "activation",
    isLit: false,
    isLoading: true,
    isShuffling: false,
    cards: [],
    deckOrder: [],
    selectedCards: {},
    formStep: 0,
    formData: EMPTY_FORM,
    reading: null,
    error: null,
  });

  const getCards = useMemo(
    () => new GetDeckCardsUseCase(new JsonCardRepository()),
    [],
  );
  const generateReading = useMemo(
    () =>
      new GenerateReadingUseCase(
        new JsonResponseRepository(),
        new TarotInterpreter(),
      ),
    [],
  );

  useEffect(() => {
    const loadCards = async () => {
      try {
        const cards = await getCards.execute();
        setState((previous) => ({
          ...previous,
          cards,
          deckOrder: shuffleIds(cards.map((card) => card.id)),
          isLoading: false,
        }));
      } catch (error) {
        setState((previous) => ({
          ...previous,
          isLoading: false,
          error:
            error instanceof Error
              ? error.message
              : "Falha ao carregar o baralho.",
        }));
      }
    };

    void loadCards();
  }, [getCards]);

  const igniteCandle = useCallback(() => {
    setState((previous) => ({ ...previous, isLit: true }));

    window.setTimeout(() => {
      setState((previous) => ({ ...previous, screen: "form" }));
    }, 1800);
  }, []);

  const updateFormField = useCallback(
    (field: keyof PlayerProfile, value: string) => {
      setState((previous) => ({
        ...previous,
        formData: {
          ...previous.formData,
          [field]: value,
        },
      }));
    },
    [],
  );

  const nextFormStep = useCallback(() => {
    setState((previous) => {
      const maxStep = FORM_STEPS.length - 1;
      const next = Math.min(previous.formStep + 1, maxStep);
      return { ...previous, formStep: next };
    });
  }, []);

  const previousFormStep = useCallback(() => {
    setState((previous) => ({
      ...previous,
      formStep: Math.max(previous.formStep - 1, 0),
    }));
  }, []);

  const goToSelection = useCallback(() => {
    setState((previous) => ({ ...previous, screen: "selection" }));
  }, []);

  const shuffleDeck = useCallback(() => {
    setState((previous) => ({
      ...previous,
      isShuffling: true,
      deckOrder: shuffleIds(previous.deckOrder),
    }));

    window.setTimeout(() => {
      setState((previous) => ({ ...previous, isShuffling: false }));
    }, 900);
  }, []);

  const selectCard = useCallback((cardId: string) => {
    setState((previous) => {
      const card = previous.cards.find((item) => item.id === cardId);
      if (!card) {
        return previous;
      }

      const takenIds = new Set(
        Object.values(previous.selectedCards).map((item) => item?.id),
      );
      if (takenIds.has(cardId)) {
        return previous;
      }

      const position = POSITION_ORDER.find(
        (slot) => !previous.selectedCards[slot],
      );
      if (!position) {
        return previous;
      }

      const selectedCards: SelectedCards = {
        ...previous.selectedCards,
        [position]: card,
      };

      return {
        ...previous,
        selectedCards,
      };
    });
  }, []);

  const removeSelectedCard = useCallback(
    (position: "past" | "present" | "future") => {
      setState((previous) => {
        if (!previous.selectedCards[position]) {
          return previous;
        }

        const selectedCards = { ...previous.selectedCards };
        delete selectedCards[position];

        return {
          ...previous,
          selectedCards,
        };
      });
    },
    [],
  );

  const generateAnswer = useCallback(async () => {
    const positionedCards = POSITION_ORDER.flatMap((position) => {
      const card = state.selectedCards[position];
      if (!card) {
        return [];
      }

      const payload: PositionedCard = {
        position,
        card,
      };

      return [payload];
    });

    if (positionedCards.length !== 3) {
      return;
    }

    const reading = await generateReading.execute(
      state.formData,
      positionedCards,
    );
    setState((previous) => ({ ...previous, reading, screen: "response" }));
  }, [generateReading, state.formData, state.selectedCards]);

  const restart = useCallback(() => {
    setState((previous) => ({
      ...previous,
      screen: "activation",
      isLit: false,
      isShuffling: false,
      selectedCards: {},
      formStep: 0,
      formData: EMPTY_FORM,
      reading: null,
      deckOrder: shuffleIds(previous.cards.map((card) => card.id)),
    }));
  }, []);

  const canAdvanceForm = useMemo(() => {
    const field = FORM_STEPS[state.formStep];
    const value = state.formData[field];
    return value.trim().length > 0;
  }, [state.formData, state.formStep]);

  const canAnswer = useMemo(
    () =>
      POSITION_ORDER.every((position) =>
        Boolean(state.selectedCards[position]),
      ),
    [state.selectedCards],
  );

  const orderedCards = useMemo(() => {
    const map = new Map(state.cards.map((card) => [card.id, card]));
    return state.deckOrder
      .map((id) => map.get(id))
      .filter((card): card is NonNullable<typeof card> => Boolean(card));
  }, [state.cards, state.deckOrder]);

  return {
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
  };
};
