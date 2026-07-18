import type { TarotCard, TarotPosition } from "./card";

export type PositionedCard = {
  position: TarotPosition;
  card: TarotCard;
};

export type ReadingResult = {
  title: string;
  oracleVoice: string;
  synthesis: string;
  recommendation: string;
  cards: PositionedCard[];
};
