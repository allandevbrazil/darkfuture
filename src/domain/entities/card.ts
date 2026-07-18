export type TarotPosition = "past" | "present" | "future";

export type CardMeaning = {
  past: string;
  present: string;
  future: string;
};

export type TarotCard = {
  id: string;
  name: string;
  image: string;
  keywords: string[];
  meaning: CardMeaning;
};
