import type { ReadingMatrix } from "../../application/ports/response-repository";
import type { TarotPosition } from "../entities/card";
import type { PlayerProfile } from "../entities/player";
import type {
  PositionedCard,
  ReadingResult,
  ReadingTheme,
  ReadingTone,
} from "../entities/reading";

const POSITION_LABEL: Record<TarotPosition, string> = {
  past: "passado",
  present: "presente",
  future: "futuro",
};

const THEME_LABELS: Record<ReadingTheme, string> = {
  amor: "Relacionamento",
  amizade: "Amizade",
  trabalho: "Trabalho",
  geral: "Leitura geral",
};

const TONE_LABELS: Record<ReadingTone, string> = {
  abertura: "abertura",
  alerta: "alerta",
  movimento: "movimento",
  estabilidade: "estabilidade",
};

type CardFamily =
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
  | "protection";

const THEME_KEYWORDS: Record<ReadingTheme, string[]> = {
  amor: [
    "amor",
    "relacao",
    "relacionamento",
    "namoro",
    "ficante",
    "crush",
    "paixao",
    "paixão",
    "casal",
    "romance",
    "ciume",
    "ciúme",
    "beijo",
    "saudade",
    "ex",
    "esposa",
    "marido",
  ],
  amizade: [
    "amizade",
    "amigo",
    "amiga",
    "amigos",
    "amigas",
    "colega",
    "colegas",
    "grupo",
    "parceria",
    "convivio",
    "convivência",
    "confianca",
    "confiança",
    "rede",
  ],
  trabalho: [
    "trabalho",
    "emprego",
    "carreira",
    "profissao",
    "profissão",
    "chefe",
    "empresa",
    "cargo",
    "salario",
    "salário",
    "projeto",
    "entrevista",
    "cliente",
    "freela",
    "negocio",
    "negócio",
    "vaga",
    "promoção",
    "promocao",
  ],
  geral: [],
};

const CARD_FAMILY_PATTERNS: Record<CardFamily, string[]> = {
  emotion: ["amor", "coracao", "coração", "afeto", "sent", "emoc"],
  communication: [
    "carta",
    "passaros",
    "pássaros",
    "noticias",
    "mensagem",
    "fala",
  ],
  movement: [
    "cavaleiro",
    "navio",
    "trevo",
    "cegonha",
    "mov",
    "inicio",
    "início",
  ],
  foundation: [
    "casa",
    "arvore",
    "árvore",
    "ancora",
    "âncora",
    "base",
    "seguranca",
    "segurança",
  ],
  strategy: [
    "cobra",
    "raposa",
    "livro",
    "estrateg",
    "estratég",
    "astucia",
    "astúcia",
  ],
  change: [
    "foice",
    "caixao",
    "caixão",
    "encruzilhada",
    "torre",
    "mud",
    "corte",
  ],
  caution: ["rato", "nuvens", "chicote", "cruz", "alert", "desgaste", "confl"],
  healing: ["lirios", "lírios", "estrela", "cura", "paz", "equilibr"],
  material: [
    "peixe",
    "sol",
    "dinhe",
    "abund",
    "resultado",
    "prosper",
    "trabalho",
  ],
  social: ["jardim", "cachorro", "grupo", "social", "amizad", "rede"],
  protection: ["urso", "chave", "prote", "fort", "limite", "segur"],
};

const THEME_FAMILY_BIAS: Record<ReadingTheme, Record<CardFamily, number>> = {
  amor: {
    emotion: 3,
    communication: 2,
    movement: 0,
    foundation: 1,
    strategy: -1,
    change: 0,
    caution: -2,
    healing: 1,
    material: -1,
    social: 1,
    protection: 1,
  },
  amizade: {
    emotion: 1,
    communication: 3,
    movement: 0,
    foundation: 1,
    strategy: -1,
    change: 0,
    caution: -2,
    healing: 1,
    material: -1,
    social: 3,
    protection: 1,
  },
  trabalho: {
    emotion: 0,
    communication: 1,
    movement: 2,
    foundation: 2,
    strategy: 3,
    change: 1,
    caution: -1,
    healing: 0,
    material: 3,
    social: 0,
    protection: 1,
  },
  geral: {
    emotion: 1,
    communication: 1,
    movement: 1,
    foundation: 1,
    strategy: 0,
    change: 0,
    caution: -1,
    healing: 1,
    material: 0,
    social: 1,
    protection: 1,
  },
};

const normalize = (value: string): string =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const pickBySeed = (items: string[], seed: string): string => {
  if (items.length === 0) {
    return "";
  }

  const hash = normalize(seed)
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);

  return items[hash % items.length];
};

const scoreKeywords = (text: string, keywords: string[]): number => {
  const normalized = normalize(text);
  return keywords.reduce(
    (acc, keyword) => (normalized.includes(normalize(keyword)) ? acc + 1 : acc),
    0,
  );
};

const detectTheme = (question: string): ReadingTheme => {
  let winner: ReadingTheme = "geral";
  let bestScore = 0;

  (Object.keys(THEME_KEYWORDS) as ReadingTheme[]).forEach((theme) => {
    const score = scoreKeywords(question, THEME_KEYWORDS[theme]);
    if (score > bestScore) {
      bestScore = score;
      winner = theme;
    }
  });

  return winner;
};

const detectFamilies = (
  cardKeywords: string[],
  cardName: string,
): CardFamily[] => {
  const source = normalize(`${cardKeywords.join(" ")} ${cardName}`);
  const scoredFamilies = (Object.keys(CARD_FAMILY_PATTERNS) as CardFamily[])
    .map((family) => ({
      family,
      score: CARD_FAMILY_PATTERNS[family].reduce(
        (acc, pattern) => (source.includes(normalize(pattern)) ? acc + 1 : acc),
        0,
      ),
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score);

  return scoredFamilies.map((entry) => entry.family);
};

const detectTone = (
  theme: ReadingTheme,
  familiesByCard: CardFamily[][],
): ReadingTone => {
  const bias = THEME_FAMILY_BIAS[theme];
  const score = familiesByCard.reduce((acc, families) => {
    const primaryFamily = families[0];
    if (!primaryFamily) {
      return acc;
    }
    return acc + bias[primaryFamily];
  }, 0);

  const movementCount = familiesByCard.filter((families) =>
    families.some((family) => family === "movement" || family === "change"),
  ).length;

  if (score >= 4) {
    return "abertura";
  }

  if (score <= -2) {
    return "alerta";
  }

  if (movementCount > 0) {
    return "movimento";
  }

  return "estabilidade";
};

export class TarotInterpreter {
  interpret(
    player: PlayerProfile,
    cards: PositionedCard[],
    matrix: ReadingMatrix,
  ): ReadingResult {
    const sortedCards = [...cards].sort((a, b) => {
      const order: Record<TarotPosition, number> = {
        past: 0,
        present: 1,
        future: 2,
      };
      return order[a.position] - order[b.position];
    });

    const theme = detectTheme(player.question);
    const familiesByCard = sortedCards.map((entry) =>
      detectFamilies(entry.card.keywords, entry.card.name),
    );
    const tone = detectTone(theme, familiesByCard);
    const seed = `${player.name}-${player.question}-${sortedCards
      .map((item) => item.card.id)
      .join("-")}`;

    const opening = pickBySeed(
      matrix.themes[theme].openings,
      `${seed}-opening`,
    );
    const toneSupport = pickBySeed(matrix.toneSupport[tone], `${seed}-tone`);
    const conclusion = pickBySeed(
      matrix.themes[theme].conclusions,
      `${seed}-conclusion`,
    );
    const advice = pickBySeed(matrix.themes[theme].advices, `${seed}-advice`);

    const synthesisParts = sortedCards.map((entry, index) => {
      const families = familiesByCard[index] ?? [];
      const primaryFamily = families[0] ?? "movement";
      const familySignal = pickBySeed(
        matrix.familySignals[primaryFamily],
        `${seed}-${entry.card.id}`,
      );
      const bridge = pickBySeed(
        matrix.themes[theme].bridges[entry.position],
        `${seed}-${entry.position}-${entry.card.id}`,
      );
      const meaning = entry.card.meaning[entry.position];

      return `${entry.card.name} no ${POSITION_LABEL[entry.position]} indica ${meaning}. ${familySignal} ${bridge}`;
    });

    const dominantNames = sortedCards
      .map((entry) => entry.card.name)
      .join(", ");

    return {
      title: `Leitura das Entidades para ${player.name}`,
      theme,
      tone,
      contextSummary: `Tema dominante: ${THEME_LABELS[theme]} • Energia: ${TONE_LABELS[tone]} • Cartas: ${dominantNames}`,
      oracleVoice: opening,
      synthesis: `${synthesisParts.join(" ")} ${toneSupport}`,
      recommendation: `${conclusion} ${advice}`,
      cards: sortedCards,
    };
  }
}
