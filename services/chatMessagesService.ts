import {
  addDoc,
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp
} from "firebase/firestore";

import { firestore } from "@/lib/firebase";
import type { ChatMessage } from "@/types/onePieceCard";

const CHAT_MESSAGES_COLLECTION = "chatMessages";

export interface SendChatMessageInput {
  text: string;
  userId: string;
  userName: string;
  userEmail: string;
}

export async function sendChatMessage(input: SendChatMessageInput): Promise<void> {
  await addDoc(collection(firestore, CHAT_MESSAGES_COLLECTION), {
    ...input,
    createdAt: serverTimestamp()
  });
}

export function subscribeToChatMessages(
  onChange: (messages: ChatMessage[]) => void,
  onError?: (error: Error) => void
) {
  const chatMessagesQuery = query(
    collection(firestore, CHAT_MESSAGES_COLLECTION),
    orderBy("createdAt", "asc"),
    limit(80)
  );

  return onSnapshot(
    chatMessagesQuery,
    (snapshot) => {
      onChange(
        snapshot.docs.map((document) => {
          const data = document.data();
          const createdAt =
            data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date();

          return {
            id: document.id,
            text: data.text,
            userId: data.userId,
            userName: data.userName,
            userEmail: data.userEmail,
            createdAt
          };
        })
      );
    },
    onError
  );
}
