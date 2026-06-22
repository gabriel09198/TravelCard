import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  limit,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  where
} from "firebase/firestore";

import { firestore } from "@/lib/firebase";
import type { ChatMessage, ChatRoom, ChatRoomType } from "@/types/onePieceCard";

const CHATS_COLLECTION = "chats";
const GENERAL_CHAT_ID = "general";

export interface SendChatMessageInput {
  text: string;
  userId: string;
  userName: string;
  userEmail: string;
}

export interface CreateCrewChatInput {
  name: string;
  password: string;
  userId: string;
}

export interface CreatePrivateChatInput {
  name: string;
  userId: string;
  memberIds: string[];
}

function chatDocument(chatId: string) {
  return doc(firestore, CHATS_COLLECTION, chatId);
}

function messagesCollection(chatId: string) {
  return collection(firestore, CHATS_COLLECTION, chatId, "messages");
}

function normalizeChat(documentId: string, data: Record<string, unknown>): ChatRoom {
  return {
    id: documentId,
    type: (data.type as ChatRoomType) ?? "private",
    name: (data.name as string) ?? "Chat",
    createdBy: (data.createdBy as string) ?? "",
    members: Array.isArray(data.members) ? (data.members as string[]) : [],
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : undefined
  };
}

async function hashCrewPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(`travelcard-crew:${password.trim()}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function crewChatId(password: string): Promise<string> {
  return `crew_${await hashCrewPassword(password)}`;
}

export async function ensureGeneralChat(userId: string): Promise<void> {
  const generalRef = chatDocument(GENERAL_CHAT_ID);
  const snapshot = await getDoc(generalRef);

  if (snapshot.exists()) {
    return;
  }

  await setDoc(generalRef, {
    type: "general",
    name: "Chat Geral",
    createdBy: userId,
    members: [],
    createdAt: serverTimestamp()
  });
}

export function subscribeToAvailableChats(
  userId: string,
  onChange: (chats: ChatRoom[]) => void,
  onError?: (error: Error) => void
) {
  let generalChat: ChatRoom | null = null;
  let userChats: ChatRoom[] = [];

  function emitChats() {
    onChange([...(generalChat ? [generalChat] : []), ...userChats]);
  }

  const chatsQuery = query(
    collection(firestore, CHATS_COLLECTION),
    where("visibleTo", "array-contains", userId)
  );

  const unsubscribeGeneral = onSnapshot(
    chatDocument(GENERAL_CHAT_ID),
    (snapshot) => {
      generalChat = snapshot.exists()
        ? normalizeChat(snapshot.id, snapshot.data())
        : {
            id: GENERAL_CHAT_ID,
            type: "general",
            name: "Chat Geral",
            createdBy: "",
            members: []
          };
      emitChats();
    },
    onError
  );

  const unsubscribeUserChats = onSnapshot(
    chatsQuery,
    (snapshot) => {
      userChats = snapshot.docs
        .map((documentSnapshot) => normalizeChat(documentSnapshot.id, documentSnapshot.data()))
        .filter((chat) => chat.type !== "general")
        .sort((a, b) => {
          return a.name.localeCompare(b.name);
        });

      emitChats();
    },
    onError
  );

  return () => {
    unsubscribeGeneral();
    unsubscribeUserChats();
  };
}

export async function createCrewChat(input: CreateCrewChatInput): Promise<string> {
  const passwordHash = await hashCrewPassword(input.password);
  const chatId = await crewChatId(input.password);

  await setDoc(chatDocument(chatId), {
    type: "crew",
    name: input.name.trim(),
    createdBy: input.userId,
    members: [input.userId],
    visibleTo: [input.userId],
    crewPasswordHash: passwordHash,
    createdAt: serverTimestamp()
  });

  return chatId;
}

export async function joinCrewChat(userId: string, password: string): Promise<string> {
  const passwordHash = await hashCrewPassword(password);
  const chatId = await crewChatId(password);

  await updateDoc(chatDocument(chatId), {
    crewPasswordHash: passwordHash,
    members: arrayUnion(userId),
    visibleTo: arrayUnion(userId)
  });

  return chatId;
}

export async function createPrivateChat(input: CreatePrivateChatInput): Promise<string> {
  const members = Array.from(new Set([input.userId, ...input.memberIds.map((member) => member.trim())]))
    .filter(Boolean);

  const documentRef = await addDoc(collection(firestore, CHATS_COLLECTION), {
    type: "private",
    name: input.name.trim(),
    createdBy: input.userId,
    members,
    visibleTo: members,
    createdAt: serverTimestamp()
  });

  return documentRef.id;
}

export async function sendChatMessage(
  chatId: string,
  input: SendChatMessageInput
): Promise<void> {
  await addDoc(messagesCollection(chatId), {
    ...input,
    createdAt: serverTimestamp()
  });
}

export function subscribeToChatMessages(
  chatId: string,
  onChange: (messages: ChatMessage[]) => void,
  onError?: (error: Error) => void
) {
  const chatMessagesQuery = query(messagesCollection(chatId), limit(100));

  return onSnapshot(
    chatMessagesQuery,
    (snapshot) => {
      onChange(
        snapshot.docs
          .map((documentSnapshot) => {
            const data = documentSnapshot.data();
            const createdAt =
              data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date();

            return {
              id: documentSnapshot.id,
              text: data.text,
              userId: data.userId,
              userName: data.userName,
              userEmail: data.userEmail,
              createdAt
            };
          })
          .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
      );
    },
    onError
  );
}
