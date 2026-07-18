import type { CardRepository } from "../ports/card-repository";
import type { TarotCard } from "../../domain/entities/card";

export class GetDeckCardsUseCase {
  private readonly cardRepository: CardRepository;

  constructor(cardRepository: CardRepository) {
    this.cardRepository = cardRepository;
  }

  async execute(): Promise<TarotCard[]> {
    const cards = await this.cardRepository.getAllCards();
    return cards;
  }
}
