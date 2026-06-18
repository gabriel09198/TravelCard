import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where
} from "firebase/firestore";

import { firestore } from "@/lib/firebase";
import type { UserCardCollection, UserDeck } from "@/types/onePieceCard";

const USER_COLLECTIONS_PATH = "userCardCollections";
const USER_DECKS_PATH = "userDecks";

export async function saveUserCardCollection(card: UserCardCollection): Promise<void> {
  const documentId = `${card.userId}_${card.cardNumber}_${card.status}`;

  await setDoc(
    doc(firestore, USER_COLLECTIONS_PATH, documentId),
    {
      ...card,
      updatedAt: serverTimestamp()
    },
    { merge: true }
  );
}

export async function getUserCardCollection(userId: string): Promise<UserCardCollection[]> {
  const snapshot = await getDocs(
    query(collection(firestore, USER_COLLECTIONS_PATH), where("userId", "==", userId))
  );

  return snapshot.docs.map((document) => document.data() as UserCardCollection);
}

export async function createUserDeck(deck: Omit<UserDeck, "id">): Promise<string> {
  const documentRef = await addDoc(collection(firestore, USER_DECKS_PATH), {
    ...deck,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });

  return documentRef.id;
}

export async function saveUserDeck(deck: UserDeck): Promise<void> {
  await setDoc(
    doc(firestore, USER_DECKS_PATH, deck.id),
    {
      ...deck,
      updatedAt: serverTimestamp()
    },
    { merge: true }
  );
}

export async function getUserDecks(userId: string): Promise<UserDeck[]> {
  const snapshot = await getDocs(
    query(collection(firestore, USER_DECKS_PATH), where("userId", "==", userId))
  );

  return snapshot.docs.map((document) => ({
    ...(document.data() as Omit<UserDeck, "id">),
    id: document.id
  }));
}
