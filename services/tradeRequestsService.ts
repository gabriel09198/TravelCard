import {
  addDoc,
  collection,
  onSnapshot,
  query,
  serverTimestamp,
  Timestamp,
  where
} from "firebase/firestore";

import { firestore } from "@/lib/firebase";
import type { TradeRequest, TradeRequestType } from "@/types/onePieceCard";

const USERS_COLLECTION = "users";
const REQUESTS_COLLECTION = "requests";

export interface CreateTradeRequestInput {
  cardName: string;
  cardCode?: string;
  type: TradeRequestType;
  description: string;
  price?: number | null;
  wantedCard?: string;
  userId: string;
  userName: string;
  userEmail: string;
}

export async function createTradeRequest(input: CreateTradeRequestInput): Promise<string> {
  const documentRef = await addDoc(collection(firestore, USERS_COLLECTION, input.userId, REQUESTS_COLLECTION), {
    ...input,
    createdAt: serverTimestamp()
  });

  return documentRef.id;
}

export function subscribeToTradeRequests(
  userId: string,
  onChange: (requests: TradeRequest[]) => void,
  onError?: (error: Error) => void
) {
  const tradeRequestsQuery = query(
    collection(firestore, USERS_COLLECTION, userId, REQUESTS_COLLECTION),
    where("userId", "==", userId)
  );

  return onSnapshot(
    tradeRequestsQuery,
    (snapshot) => {
      onChange(
        snapshot.docs
          .map((document) => {
            const data = document.data();
            const createdAt =
              data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date();

            return {
              id: document.id,
              cardName: data.cardName,
              cardCode: data.cardCode,
              type: data.type,
              description: data.description,
              price: data.price ?? null,
              wantedCard: data.wantedCard,
              userId: data.userId,
              userName: data.userName,
              userEmail: data.userEmail,
              createdAt
            };
          })
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      );
    },
    onError
  );
}
