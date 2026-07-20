import type { TarotPosition } from "../../domain/entities/card";
import type { ReadingTheme, ReadingTone } from "../../domain/entities/reading";

export type ReadingMatrix = {
  themes: Record<
    ReadingTheme,
    {
      openings: string[];
      bridges: Record<TarotPosition, string[]>;
      conclusions: string[];
      advices: string[];
    }
  >;
  toneSupport: Record<ReadingTone, string[]>;
  familySignals: Record<
    | "emotion"
    | "communication"
    | "movement"
    | "foundation"
    | "strategy"
    | "change"
    | "caution"
    | "healing"
    | "material"
    | "social"
    | "protection",
    string[]
  >;
};

export interface ResponseRepository {
  getMatrix(): Promise<ReadingMatrix>;
}
