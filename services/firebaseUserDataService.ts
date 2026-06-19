import {
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp
} from "firebase/firestore";

import { firestore } from "@/lib/firebase";
import type {
  UserCardCollection,
  UserDeck,
  UserOwnedCard,
  UserWishlistCard
} from "@/types/onePieceCard";

const USERS_COLLECTION = "usuarios";

function userDocument(uid: string) {
  return doc(firestore, USERS_COLLECTION, uid);
}

function userSubcollection(uid: string, subcollection: "cartas" | "decks" | "wishlist") {
  return collection(firestore, USERS_COLLECTION, uid, subcollection);
}

function nullableDate(value: unknown): Date | undefined {
  return value instanceof Timestamp ? value.toDate() : undefined;
}

export async function ensureUsuarioDocument(uid: string, name: string, email: string): Promise<void> {
  await setDoc(
    userDocument(uid),
    {
      nome: name,
      email,
      atualizadoEm: serverTimestamp(),
      criadoEm: serverTimestamp()
    },
    { merge: true }
  );
}

export async function saveUserOwnedCard(uid: string, card: UserOwnedCard): Promise<void> {
  await setDoc(
    doc(userSubcollection(uid, "cartas"), card.id),
    {
      nome: card.name,
      codigo: card.code,
      imagem: card.imageUrl ?? "",
      quantidade: card.quantity,
      tipo: card.type ?? "",
      cor: card.color ?? "",
      raridade: card.rarity ?? "",
      observacoes: card.notes ?? "",
      atualizadoEm: serverTimestamp()
    },
    { merge: true }
  );
}

export function subscribeUserOwnedCards(
  uid: string,
  onChange: (cards: UserOwnedCard[]) => void,
  onError?: (error: Error) => void
) {
  return onSnapshot(
    query(userSubcollection(uid, "cartas"), orderBy("nome", "asc")),
    (snapshot) => {
      onChange(
        snapshot.docs.map((document) => {
          const data = document.data();

          return {
            id: document.id,
            name: data.nome ?? "Carta sem nome",
            code: data.codigo ?? document.id,
            imageUrl: data.imagem || undefined,
            quantity: data.quantidade ?? 0,
            type: data.tipo || undefined,
            color: data.cor || undefined,
            rarity: data.raridade || undefined,
            notes: data.observacoes || undefined
          };
        })
      );
    },
    onError
  );
}

export async function saveUserWishlistCard(uid: string, card: UserWishlistCard): Promise<void> {
  await setDoc(
    doc(userSubcollection(uid, "wishlist"), card.id),
    {
      nome: card.name,
      codigo: card.code,
      imagem: card.imageUrl ?? "",
      quantidadeDesejada: card.desiredQuantity,
      observacoes: card.notes ?? "",
      atualizadoEm: serverTimestamp()
    },
    { merge: true }
  );
}

export function subscribeUserWishlist(
  uid: string,
  onChange: (cards: UserWishlistCard[]) => void,
  onError?: (error: Error) => void
) {
  return onSnapshot(
    query(userSubcollection(uid, "wishlist"), orderBy("nome", "asc")),
    (snapshot) => {
      onChange(
        snapshot.docs.map((document) => {
          const data = document.data();

          return {
            id: document.id,
            name: data.nome ?? "Carta sem nome",
            code: data.codigo ?? document.id,
            imageUrl: data.imagem || undefined,
            desiredQuantity: data.quantidadeDesejada ?? 1,
            notes: data.observacoes || undefined
          };
        })
      );
    },
    onError
  );
}

export async function createUserDeck(uid: string, deck: Omit<UserDeck, "id" | "userId">): Promise<string> {
  const documentRef = await addDoc(userSubcollection(uid, "decks"), {
    nome: deck.name,
    descricao: deck.description ?? "",
    cartas: deck.cards.map((card) => ({
      cardId: card.cardId ?? card.cardNumber,
      nome: card.name ?? "",
      codigo: card.cardNumber,
      imagem: card.imageUrl ?? "",
      quantidade: card.quantity
    })),
    criadoEm: serverTimestamp(),
    atualizadoEm: serverTimestamp()
  });

  return documentRef.id;
}

export async function saveUserDeck(uid: string, deck: UserDeck): Promise<void> {
  await setDoc(
    doc(userSubcollection(uid, "decks"), deck.id),
    {
      nome: deck.name,
      descricao: deck.description ?? "",
      cartas: deck.cards.map((card) => ({
        cardId: card.cardId ?? card.cardNumber,
        nome: card.name ?? "",
        codigo: card.cardNumber,
        imagem: card.imageUrl ?? "",
        quantidade: card.quantity
      })),
      atualizadoEm: serverTimestamp()
    },
    { merge: true }
  );
}

export function subscribeUserDecks(
  uid: string,
  onChange: (decks: UserDeck[]) => void,
  onError?: (error: Error) => void
) {
  return onSnapshot(
    query(userSubcollection(uid, "decks"), orderBy("atualizadoEm", "desc")),
    (snapshot) => {
      onChange(
        snapshot.docs.map((document) => {
          const data = document.data();

          return {
            id: document.id,
            userId: uid,
            name: data.nome ?? "Deck sem nome",
            description: data.descricao ?? "",
            cards: Array.isArray(data.cartas)
              ? data.cartas.map(
                  (card: {
                    cardId?: string;
                    nome?: string;
                    codigo?: string;
                    imagem?: string;
                    quantidade?: number;
                  }) => ({
                    cardId: card.cardId ?? card.codigo ?? "",
                    name: card.nome ?? "Carta sem nome",
                    cardNumber: card.codigo ?? card.cardId ?? "",
                    imageUrl: card.imagem || undefined,
                    quantity: card.quantidade ?? 1
                  })
                )
              : [],
            createdAt: nullableDate(data.criadoEm),
            updatedAt: nullableDate(data.atualizadoEm)
          };
        })
      );
    },
    onError
  );
}

export async function saveUserCardCollection(card: UserCardCollection): Promise<void> {
  await saveUserOwnedCard(card.userId, {
    id: card.cardId,
    name: card.name ?? card.cardNumber,
    code: card.cardNumber,
    imageUrl: card.imageUrl,
    quantity: card.quantity,
    type: card.type,
    color: card.color,
    rarity: card.rarity,
    notes: card.notes
  });
}

export async function getUserCardCollection(userId: string): Promise<UserCardCollection[]> {
  const snapshot = await getDocs(userSubcollection(userId, "cartas"));

  return snapshot.docs.map((document) => {
    const data = document.data();

    return {
      userId,
      cardId: document.id,
      cardNumber: data.codigo ?? document.id,
      name: data.nome,
      imageUrl: data.imagem,
      quantity: data.quantidade ?? 0,
      status: "tenho",
      type: data.tipo,
      color: data.cor,
      rarity: data.raridade,
      notes: data.observacoes
    };
  });
}

export async function getUserDecks(userId: string): Promise<UserDeck[]> {
  const snapshot = await getDocs(userSubcollection(userId, "decks"));

  return snapshot.docs.map((document) => {
    const data = document.data();

    return {
      id: document.id,
      userId,
      name: data.nome ?? "Deck sem nome",
      description: data.descricao ?? "",
      cards: Array.isArray(data.cartas)
        ? data.cartas.map(
            (card: {
              cardId?: string;
              nome?: string;
              codigo?: string;
              imagem?: string;
              quantidade?: number;
            }) => ({
              cardId: card.cardId ?? card.codigo ?? "",
              name: card.nome ?? "Carta sem nome",
              cardNumber: card.codigo ?? card.cardId ?? "",
              imageUrl: card.imagem || undefined,
              quantity: card.quantidade ?? 1
            })
          )
        : []
    };
  });
}
