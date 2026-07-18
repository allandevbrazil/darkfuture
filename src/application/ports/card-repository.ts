import type { TarotCard } from "../../domain/entities/card";

export interface CardRepository {
  getAllCards(): Promise<TarotCard[]>;
}
