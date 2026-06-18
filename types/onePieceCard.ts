export type OnePieceCardStatus = "tenho" | "quero_comprar";

export interface OnePieceCardApiCard {
  inventory_price?: number | null;
  market_price?: number | null;
  card_name?: string | null;
  set_name?: string | null;
  card_text?: string | null;
  set_id?: string | null;
  rarity?: string | null;
  card_set_id?: string | null;
  card_color?: string | null;
  card_type?: string | null;
  life?: string | number | null;
  card_cost?: string | number | null;
  card_power?: string | number | null;
  sub_types?: string | null;
  counter_amount?: number | null;
  attribute?: string | null;
  card_image_id?: string | null;
  card_image?: string | null;
}

export interface OnePieceCard {
  id: string;
  name: string;
  code: string;
  type: string;
  color: string;
  cost: number | null;
  power: number | null;
  rarity: string;
  effect: string;
  imageUrl: string | null;
  setName: string;
  setId: string;
  subTypes: string[];
  counter: number | null;
  attribute: string | null;
  marketPrice: number | null;
}

export interface UserCardCollection {
  userId: string;
  cardId: string;
  cardNumber: string;
  quantity: number;
  status: OnePieceCardStatus;
}

export interface UserDeckCard {
  cardNumber: string;
  quantity: number;
}

export interface UserDeck {
  id: string;
  userId: string;
  name: string;
  cards: UserDeckCard[];
}

export type TradeRequestType = "troca" | "venda";

export interface AppUserProfile {
  id: string;
  name: string;
  email: string;
  handle?: string;
  createdAt?: Date;
}

export interface TradeRequest {
  id: string;
  cardName: string;
  cardCode?: string;
  type: TradeRequestType;
  description: string;
  price?: number | null;
  wantedCard?: string;
  userId: string;
  userName: string;
  userEmail: string;
  createdAt: Date;
}

export interface ChatMessage {
  id: string;
  text: string;
  userId: string;
  userName: string;
  userEmail: string;
  createdAt: Date;
}
