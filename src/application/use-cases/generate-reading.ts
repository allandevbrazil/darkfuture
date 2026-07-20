import type { ResponseRepository } from "../ports/response-repository";
import type { PlayerProfile } from "../../domain/entities/player";
import type {
  PositionedCard,
  ReadingResult,
} from "../../domain/entities/reading";
import { TarotInterpreter } from "../../domain/services/tarot-interpreter";

export class GenerateReadingUseCase {
  private readonly responseRepository: ResponseRepository;

  private readonly interpreter: TarotInterpreter;

  constructor(
    responseRepository: ResponseRepository,
    interpreter: TarotInterpreter,
  ) {
    this.responseRepository = responseRepository;
    this.interpreter = interpreter;
  }

  async execute(
    player: PlayerProfile,
    selectedCards: PositionedCard[],
  ): Promise<ReadingResult> {
    const matrix = await this.responseRepository.getMatrix();
    return this.interpreter.interpret(player, selectedCards, matrix);
  }
}
