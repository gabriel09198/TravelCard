import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  where
} from "firebase/firestore";

import { firestore } from "@/lib/firebase";
import type {
  UserDeck,
  UserWishlistCard
} from "@/types/onePieceCard";

const USERS_COLLECTION = "users";

function userSubcollection(uid: string, subcollection: "decks" | "wishlist") {
  return collection(firestore, USERS_COLLECTION, uid, subcollection);
}

function nullableDate(value: unknown): Date | undefined {
  return value instanceof Timestamp ? value.toDate() : undefined;
}

export async function saveUserWishlistCard(uid: string, card: UserWishlistCard): Promise<void> {
  await setDoc(
    doc(userSubcollection(uid, "wishlist"), card.id),
    {
      userId: uid,
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
    query(userSubcollection(uid, "wishlist"), where("userId", "==", uid)),
    (snapshot) => {
      onChange(
        snapshot.docs
          .map((document) => {
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
          .sort((a, b) => a.name.localeCompare(b.name))
      );
    },
    onError
  );
}

export async function createUserDeck(uid: string, deck: Omit<UserDeck, "id" | "userId">): Promise<string> {
  const documentRef = await addDoc(userSubcollection(uid, "decks"), {
    userId: uid,
    nome: deck.name,
    descricao: deck.description ?? "",
    cores: deck.colors ?? [],
    cartas: deck.cards.map((card) => ({
      cardId: card.cardId ?? card.cardNumber,
      nome: card.name ?? "",
      codigo: card.cardNumber,
      imagem: card.imageUrl ?? "",
      quantidade: card.quantity,
      preco: card.price ?? null
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
      userId: uid,
      nome: deck.name,
      descricao: deck.description ?? "",
      cores: deck.colors ?? [],
      cartas: deck.cards.map((card) => ({
        cardId: card.cardId ?? card.cardNumber,
        nome: card.name ?? "",
        codigo: card.cardNumber,
        imagem: card.imageUrl ?? "",
        quantidade: card.quantity,
        preco: card.price ?? null
      })),
      atualizadoEm: serverTimestamp()
    },
    { merge: true }
  );
}

export async function deleteUserDeck(uid: string, deckId: string): Promise<void> {
  await deleteDoc(doc(userSubcollection(uid, "decks"), deckId));
}

export function subscribeUserDecks(
  uid: string,
  onChange: (decks: UserDeck[]) => void,
  onError?: (error: Error) => void
) {
  return onSnapshot(
    query(userSubcollection(uid, "decks"), where("userId", "==", uid)),
    (snapshot) => {
      onChange(
        snapshot.docs
          .map((document) => {
            const data = document.data();

            return {
              id: document.id,
              userId: data.userId ?? uid,
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
                      preco?: number | null;
                    }) => ({
                      cardId: card.cardId ?? card.codigo ?? "",
                      name: card.nome ?? "Carta sem nome",
                      cardNumber: card.codigo ?? card.cardId ?? "",
                      imageUrl: card.imagem || undefined,
                      quantity: card.quantidade ?? 1,
                      price: card.preco ?? null
                    })
                  )
                : [],
              colors: Array.isArray(data.cores) ? data.cores : [],
              createdAt: nullableDate(data.criadoEm),
              updatedAt: nullableDate(data.atualizadoEm)
            };
          })
          .sort((a, b) => (b.updatedAt?.getTime() ?? 0) - (a.updatedAt?.getTime() ?? 0))
      );
    },
    onError
  );
}
