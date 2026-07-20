import type { CardRepository } from "../../application/ports/card-repository";
import type { TarotCard } from "../../domain/entities/card";

export class JsonCardRepository implements CardRepository {
  async getAllCards(): Promise<TarotCard[]> {
    const response = await fetch(`${import.meta.env.BASE_URL}mocks/cards.json`);
    if (!response.ok) {
      throw new Error("Nao foi possivel carregar as cartas.");
    }

    const cards = (await response.json()) as TarotCard[];
    return cards;
  }
}
