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

export interface UserDeckCard {
  cardId?: string;
  cardNumber: string;
  name?: string;
  imageUrl?: string;
  quantity: number;
  price?: number | null;
}

export interface UserDeck {
  id: string;
  userId: string;
  name: string;
  description?: string;
  colors?: string[];
  cards: UserDeckCard[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserWishlistCard {
  id: string;
  name: string;
  code: string;
  imageUrl?: string;
  desiredQuantity: number;
  notes?: string;
}

export type TradeRequestType = "troca" | "venda";
export type TradeOfferTarget = "geral" | "usuario";

export interface AppUserProfile {
  id: string;
  name: string;
  email: string;
  handle?: string;
  createdAt?: Date;
}

export interface PublicUserProfile {
  id: string;
  name: string;
  email: string;
}

export interface TradeRequest {
  id: string;
  cardId: string;
  cardName: string;
  cardCode: string;
  cardImage?: string;
  cardColor?: string;
  cardType?: string;
  requestType: TradeRequestType;
  offerTarget: TradeOfferTarget;
  targetUserId?: string;
  targetUserName?: string;
  targetUserEmail?: string;
  description: string;
  price?: number | null;
  wantedCard?: string;
  createdByUserId: string;
  createdByName: string;
  createdByEmail: string;
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

export type ChatRoomType = "general" | "crew" | "private";

export interface ChatRoom {
  id: string;
  type: ChatRoomType;
  name: string;
  createdBy: string;
  members: string[];
  createdAt?: Date;
}
