import {
  addDoc,
  collection,
  onSnapshot,
  query,
  serverTimestamp,
  Timestamp,
  where,
  type DocumentData,
  type QueryDocumentSnapshot
} from "firebase/firestore";

import { firestore } from "@/lib/firebase";
import type {
  PublicUserProfile,
  TradeOfferTarget,
  TradeRequest,
  TradeRequestType
} from "@/types/onePieceCard";

const TRADE_REQUESTS_COLLECTION = "tradeRequests";
const PUBLIC_PROFILES_COLLECTION = "publicProfiles";

export interface CreateTradeRequestInput {
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
}

function normalizeTradeRequest(
  documentSnapshot: QueryDocumentSnapshot<DocumentData>
): TradeRequest {
  const data = documentSnapshot.data();

  return {
    id: documentSnapshot.id,
    cardId: data.cardId ?? data.cardCode ?? documentSnapshot.id,
    cardName: data.cardName ?? "Carta sem nome",
    cardCode: data.cardCode ?? "",
    cardImage: data.cardImage || undefined,
    cardColor: data.cardColor || undefined,
    cardType: data.cardType || undefined,
    requestType: data.requestType ?? "troca",
    offerTarget: data.offerTarget ?? "geral",
    targetUserId: data.targetUserId || undefined,
    targetUserName: data.targetUserName || undefined,
    targetUserEmail: data.targetUserEmail || undefined,
    description: data.description ?? "",
    price: data.price ?? null,
    wantedCard: data.wantedCard || undefined,
    createdByUserId: data.createdByUserId ?? "",
    createdByName: data.createdByName ?? "Usuario",
    createdByEmail: data.createdByEmail ?? "",
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date()
  };
}

export async function createTradeRequest(input: CreateTradeRequestInput): Promise<string> {
  const documentRef = await addDoc(collection(firestore, TRADE_REQUESTS_COLLECTION), {
    ...input,
    targetUserId: input.offerTarget === "usuario" ? input.targetUserId ?? "" : "",
    targetUserName: input.offerTarget === "usuario" ? input.targetUserName ?? "" : "",
    targetUserEmail: input.offerTarget === "usuario" ? input.targetUserEmail ?? "" : "",
    createdAt: serverTimestamp()
  });

  return documentRef.id;
}

export function subscribeToPublicProfiles(
  currentUserId: string,
  onChange: (profiles: PublicUserProfile[]) => void,
  onError?: (error: Error) => void
) {
  return onSnapshot(
    collection(firestore, PUBLIC_PROFILES_COLLECTION),
    (snapshot) => {
      onChange(
        snapshot.docs
          .map((documentSnapshot) => {
            const data = documentSnapshot.data();

            return {
              id: documentSnapshot.id,
              name: data.name ?? "Usuario",
              email: data.email ?? ""
            };
          })
          .filter((profile) => profile.id !== currentUserId)
          .sort((a, b) => a.name.localeCompare(b.name))
      );
    },
    onError
  );
}

export function subscribeToTradeRequests(
  userId: string,
  onChange: (requests: TradeRequest[]) => void,
  onError?: (error: Error) => void
) {
  const requestGroups = new Map<string, TradeRequest[]>();

  function emitRequests() {
    const uniqueRequests = new Map<string, TradeRequest>();

    requestGroups.forEach((requests) => {
      requests.forEach((request) => uniqueRequests.set(request.id, request));
    });

    onChange(
      Array.from(uniqueRequests.values()).sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
      )
    );
  }

  const queries = [
    query(
      collection(firestore, TRADE_REQUESTS_COLLECTION),
      where("offerTarget", "==", "geral")
    ),
    query(
      collection(firestore, TRADE_REQUESTS_COLLECTION),
      where("targetUserId", "==", userId)
    ),
    query(
      collection(firestore, TRADE_REQUESTS_COLLECTION),
      where("createdByUserId", "==", userId)
    )
  ];

  const unsubscribes = queries.map((tradeRequestQuery, index) =>
    onSnapshot(
      tradeRequestQuery,
      (snapshot) => {
        requestGroups.set(
          String(index),
          snapshot.docs.map(normalizeTradeRequest)
        );
        emitRequests();
      },
      onError
    )
  );

  return () => {
    unsubscribes.forEach((unsubscribe) => unsubscribe());
  };
}
