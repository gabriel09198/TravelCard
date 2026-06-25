import type { Card, CommunityPost } from "@/types/opcg";

function getCardImageUrl(code: string) {
  return `https://optcgapi.com/media/static/Card_Images/${code}.jpg`;
}

function withCardImages(cardList: Card[]): Card[] {
  return cardList.map((card) => ({
    ...card,
    imageUrl: card.imageUrl ?? getCardImageUrl(card.code)
  }));
}

const rawCards: Card[] = [
  {
    id: "c-1",
    code: "OP01-001",
    name: "Monkey.D.Luffy",
    type: "Leader",
    colors: ["Red", "Green"],
    rarity: "L",
    cost: null,
    power: 5000,
    price: 0.05,
    collection: "Romance Dawn",
    status: ["owned"],
    quantity: 1
  },
  {
    id: "c-2",
    code: "OP05-119",
    name: "Monkey.D.Luffy Gear 5",
    type: "Character",
    colors: ["Purple"],
    rarity: "SEC",
    cost: 10,
    power: 12000,
    price: 42.9,
    collection: "Awakening of the New Era",
    status: ["wanted"],
    quantity: 0
  },
  {
    id: "c-3",
    code: "OP02-004",
    name: "Edward.Newgate",
    type: "Leader",
    colors: ["Red"],
    rarity: "L",
    cost: null,
    power: 6000,
    price: 1.12,
    collection: "Paramount War",
    status: ["owned", "forTrade"],
    quantity: 2
  },
  {
    id: "c-4",
    code: "OP06-118",
    name: "Roronoa Zoro",
    type: "Character",
    colors: ["Green"],
    rarity: "SEC",
    cost: 9,
    power: 9000,
    price: 18.4,
    collection: "Wings of the Captain",
    status: ["wanted"],
    quantity: 0
  },
  {
    id: "c-5",
    code: "ST10-010",
    name: "Trafalgar Law",
    type: "Character",
    colors: ["Red", "Purple"],
    rarity: "SR",
    cost: 4,
    power: 5000,
    price: 0.35,
    collection: "Ultra Deck: Three Captains",
    status: ["owned"],
    quantity: 4
  },
  {
    id: "c-6",
    code: "OP16-022",
    name: "Monkey.D.Luffy",
    type: "Character",
    colors: ["Green", "Blue"],
    rarity: "SR",
    cost: 1,
    power: 0,
    price: 0.05,
    collection: "Legacy of the Master",
    status: ["owned"],
    quantity: 4
  }
];

export const cards: Card[] = withCardImages(rawCards);

export const posts: CommunityPost[] = [
  {
    id: "p-1",
    author: "Marina",
    topic: "Como vocês estão lidando contra Enel?",
    body: "Tenho sentido dificuldade em fechar partida antes da recuperação ficar grande.",
    tag: "Strategy",
    replies: 8,
    createdAt: "Hoje"
  },
  {
    id: "p-2",
    author: "Leo",
    topic: "Troco Zoro SEC por staples roxas",
    body: "Procuro cartas para terminar meu deck de controle.",
    tag: "Trade",
    replies: 3,
    createdAt: "Ontem"
  },
  {
    id: "p-3",
    author: "Gabriel",
    topic: "Lista inicial para Luffy RG",
    body: "Montei uma versão mais barata para jogar local com o pessoal.",
    tag: "Deck",
    replies: 5,
    createdAt: "2 dias"
  }
];
