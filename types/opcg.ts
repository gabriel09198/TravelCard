export type CardColor = "Red" | "Green" | "Blue" | "Purple" | "Black" | "Yellow";

export type CardStatus = "owned" | "wanted" | "forTrade";

export type CardType = "Leader" | "Character" | "Event" | "Stage";

export type CardRarity = "C" | "UC" | "R" | "SR" | "SEC" | "L" | "P";

export interface Card {
  id: string;
  code: string;
  name: string;
  type: CardType;
  colors: CardColor[];
  rarity: CardRarity;
  cost: number | null;
  power?: number;
  price?: number;
  imageUrl?: string;
  collection: string;
  status: CardStatus[];
  quantity: number;
}

export interface CommunityPost {
  id: string;
  author: string;
  topic: string;
  body: string;
  tag: "Deck" | "Card" | "Trade" | "Strategy";
  replies: number;
  createdAt: string;
}
