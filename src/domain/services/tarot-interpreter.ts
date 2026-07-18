import type { ResponseTemplates } from "../../application/ports/response-repository";
import type { TarotPosition } from "../entities/card";
import type { PlayerProfile } from "../entities/player";
import type { PositionedCard, ReadingResult } from "../entities/reading";

const POSITION_LABEL: Record<TarotPosition, string> = {
  past: "passado",
  present: "presente",
  future: "futuro",
};

const BRIGHT_KEYWORDS = [
  "sucesso",
  "sorte",
  "claridade",
  "cura",
  "protecao",
  "amor",
  "conquista",
];

const chooseByHash = (items: string[], seed: string): string => {
  if (items.length === 0) {
    return "";
  }

  const hash = seed
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return items[hash % items.length];
};

export class TarotInterpreter {
  interpret(
    player: PlayerProfile,
    cards: PositionedCard[],
    templates: ResponseTemplates,
  ): ReadingResult {
    const sortedCards = [...cards].sort((a, b) => {
      const order: Record<TarotPosition, number> = {
        past: 0,
        present: 1,
        future: 2,
      };
      return order[a.position] - order[b.position];
    });

    const signalScore = sortedCards
      .flatMap((entry) => entry.card.keywords)
      .reduce((acc, keyword) => {
        const normalized = keyword.toLowerCase();
        return BRIGHT_KEYWORDS.some((bright) => normalized.includes(bright))
          ? acc + 1
          : acc - 1;
      }, 0);

    const seed = `${player.name}-${player.question}-${sortedCards.map((item) => item.card.id).join("-")}`;

    const synthesisParts = sortedCards.map((entry) => {
      const message = entry.card.meaning[entry.position];
      return `${entry.card.name} no ${POSITION_LABEL[entry.position]} indica ${message}.`;
    });

    const toneComplement =
      signalScore >= 0
        ? "As entidades mostram abertura de caminhos, mas pedem foco e disciplina."
        : "As entidades alertam para ruido espiritual e escolhas impulsivas; avance com cautela.";

    return {
      title: `Leitura das Entidades para ${player.name}`,
      oracleVoice: chooseByHash(templates.intros, seed),
      synthesis: `${synthesisParts.join(" ")} ${toneComplement}`,
      recommendation: `${chooseByHash(templates.conclusions, seed)} ${chooseByHash(templates.advices, seed)}`,
      cards: sortedCards,
    };
  }
}
