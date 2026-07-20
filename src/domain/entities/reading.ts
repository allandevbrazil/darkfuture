import type { TarotCard, TarotPosition } from "./card";

export type ReadingTheme = "amor" | "amizade" | "trabalho" | "geral";

export type ReadingTone = "abertura" | "alerta" | "movimento" | "estabilidade";

export type PositionedCard = {
  position: TarotPosition;
  card: TarotCard;
};

export type ReadingResult = {
  title: string;
  theme: ReadingTheme;
  tone: ReadingTone;
  contextSummary: string;
  oracleVoice: string;
  synthesis: string;
  recommendation: string;
  cards: PositionedCard[];
};
