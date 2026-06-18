import type { Card, CommunityPost, Deck, UserProfile } from "@/types/opcg";

function getCardImageUrl(code: string) {
  return `https://optcgapi.com/media/static/Card_Images/${code}.jpg`;
}

function withCardImages(cardList: Card[]): Card[] {
  return cardList.map((card) => ({
    ...card,
    imageUrl: card.imageUrl ?? getCardImageUrl(card.code)
  }));
}

export const currentUser: UserProfile = {
  id: "u-1",
  name: "Gabriel",
  handle: "@gabriel",
  favoriteColor: "Blue",
  decks: 3,
  ownedCards: 186,
  wantedCards: 24
};

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
  },
  {
    id: "c-7",
    code: "OP02-028",
    name: "Bentham",
    type: "Character",
    colors: ["Blue"],
    rarity: "R",
    cost: 2,
    power: 1000,
    price: 0.05,
    collection: "Paramount War",
    status: ["owned"],
    quantity: 4
  },
  {
    id: "c-8",
    code: "OP03-047",
    name: "Jinbe",
    type: "Character",
    colors: ["Green"],
    rarity: "R",
    cost: 2,
    power: 2000,
    price: 0.04,
    collection: "Pillars of Strength",
    status: ["owned"],
    quantity: 1
  },
  {
    id: "c-9",
    code: "OP01-073",
    name: "Daz.Bonez",
    type: "Character",
    colors: ["Blue"],
    rarity: "UC",
    cost: 2,
    power: 2000,
    price: 0.02,
    collection: "Romance Dawn",
    status: ["owned"],
    quantity: 4
  },
  {
    id: "c-10",
    code: "OP03-108",
    name: "Galdino",
    type: "Character",
    colors: ["Green"],
    rarity: "R",
    cost: 2,
    power: 3000,
    price: 0.01,
    collection: "Pillars of Strength",
    status: ["owned"],
    quantity: 3
  },
  {
    id: "c-11",
    code: "OP03-044",
    name: "Galdino",
    type: "Character",
    colors: ["Green"],
    rarity: "UC",
    cost: 2,
    power: 3000,
    price: 1.09,
    collection: "Pillars of Strength",
    status: ["owned"],
    quantity: 2
  },
  {
    id: "c-12",
    code: "OP03-055",
    name: "Galdino",
    type: "Character",
    colors: ["Blue"],
    rarity: "R",
    cost: 4,
    power: 5000,
    price: 6.85,
    collection: "Pillars of Strength",
    status: ["owned"],
    quantity: 4
  },
  {
    id: "c-13",
    code: "OP16-040",
    name: "Crocodile",
    type: "Character",
    colors: ["Blue"],
    rarity: "SR",
    cost: 4,
    power: 6000,
    price: 0.1,
    collection: "Legacy of the Master",
    status: ["owned"],
    quantity: 4
  },
  {
    id: "c-14",
    code: "OP09-051",
    name: "Buggy",
    type: "Character",
    colors: ["Blue"],
    rarity: "R",
    cost: 5,
    power: 6000,
    price: 0.96,
    collection: "Emperors in the New World",
    status: ["owned"],
    quantity: 4
  },
  {
    id: "c-15",
    code: "OP02-059",
    name: "Miss Olive",
    type: "Character",
    colors: ["Blue"],
    rarity: "C",
    cost: 5,
    power: 6000,
    price: 0.01,
    collection: "Paramount War",
    status: ["owned"],
    quantity: 2
  },
  {
    id: "c-16",
    code: "OP02-047",
    name: "Impel Down",
    type: "Stage",
    colors: ["Blue"],
    rarity: "C",
    cost: 6,
    power: 6000,
    price: 6.37,
    collection: "Paramount War",
    status: ["owned"],
    quantity: 9
  },
  {
    id: "c-17",
    code: "OP07-051",
    name: "Boa Hancock",
    type: "Character",
    colors: ["Blue"],
    rarity: "SR",
    cost: 7,
    power: 9000,
    price: 1.99,
    collection: "500 Years in the Future",
    status: ["owned"],
    quantity: 4
  },
  {
    id: "c-18",
    code: "OP06-058",
    name: "Gum-Gum Rain",
    type: "Event",
    colors: ["Blue"],
    rarity: "UC",
    cost: 0,
    price: 0.1,
    collection: "Wings of the Captain",
    status: ["owned"],
    quantity: 1
  },
  {
    id: "c-19",
    code: "OP16-043",
    name: "To the Navy Headquarters!",
    type: "Event",
    colors: ["Green"],
    rarity: "C",
    cost: 1,
    price: 0.02,
    collection: "Legacy of the Master",
    status: ["owned"],
    quantity: 4
  }
];

export const cards: Card[] = withCardImages(rawCards);

export const decks: Deck[] = [
  {
    id: "d-1",
    name: "Luffy Red Green Aggro",
    leader: "Monkey.D.Luffy",
    colors: ["Red", "Green"],
    format: "Local",
    owner: "Gabriel",
    updatedAt: "2026-06-12",
    cards: [
      { cardId: "c-1", quantity: 1 },
      { cardId: "c-6", quantity: 4 },
      { cardId: "c-7", quantity: 4 },
      { cardId: "c-8", quantity: 1 },
      { cardId: "c-9", quantity: 4 },
      { cardId: "c-10", quantity: 3 },
      { cardId: "c-11", quantity: 2 },
      { cardId: "c-12", quantity: 4 },
      { cardId: "c-13", quantity: 4 },
      { cardId: "c-14", quantity: 4 },
      { cardId: "c-15", quantity: 2 },
      { cardId: "c-16", quantity: 9 },
      { cardId: "c-17", quantity: 4 },
      { cardId: "c-18", quantity: 1 },
      { cardId: "c-19", quantity: 4 }
    ]
  },
  {
    id: "d-2",
    name: "Whitebeard Pressure",
    leader: "Edward.Newgate",
    colors: ["Red"],
    format: "Tournament",
    owner: "Marina",
    updatedAt: "2026-06-15",
    cards: [{ cardId: "c-3", quantity: 1 }]
  },
  {
    id: "d-3",
    name: "Purple Control",
    leader: "Monkey.D.Luffy Gear 5",
    colors: ["Purple"],
    format: "Casual",
    owner: "Leo",
    updatedAt: "2026-06-10",
    cards: [{ cardId: "c-2", quantity: 2 }]
  }
];

export const profiles: UserProfile[] = [
  currentUser,
  {
    id: "u-2",
    name: "Marina",
    handle: "@marina",
    favoriteColor: "Red",
    decks: 2,
    ownedCards: 210,
    wantedCards: 16
  },
  {
    id: "u-3",
    name: "Leo",
    handle: "@leo",
    favoriteColor: "Purple",
    decks: 4,
    ownedCards: 154,
    wantedCards: 31
  }
];

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
