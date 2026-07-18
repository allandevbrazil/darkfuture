import type { TarotCard, TarotPosition } from "../../domain/entities/card";
import type { PlayerProfile } from "../../domain/entities/player";
import type { ReadingResult } from "../../domain/entities/reading";

export type GameScreen = "activation" | "form" | "selection" | "response";

export type SelectedCards = Partial<Record<TarotPosition, TarotCard>>;

export type GameState = {
  screen: GameScreen;
  isLit: boolean;
  isLoading: boolean;
  isShuffling: boolean;
  cards: TarotCard[];
  deckOrder: string[];
  selectedCards: SelectedCards;
  formStep: number;
  formData: PlayerProfile;
  reading: ReadingResult | null;
  error: string | null;
};

export const FORM_STEPS: Array<keyof PlayerProfile> = [
  "name",
  "age",
  "sex",
  "birthDate",
  "birthTime",
  "question",
];

export const POSITION_ORDER: TarotPosition[] = ["past", "present", "future"];
