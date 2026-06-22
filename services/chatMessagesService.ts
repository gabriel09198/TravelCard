import {
  addDoc,
  arrayUnion,
  collection,
  doc,
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
const CREW_DIRECTORY_COLLECTION = "crewDirectory";
const GENERAL_CHAT_ID = "general";

export const STANDARD_CREWS = [
  "Chapeus de Palha",
  "Piratas do Ruivo",
  "Piratas Heart",
  "Piratas Kid",
  "Baroque Works",
  "Marinha",
  "Governo Mundial",
  "Revolucionarios",
  "Cross Guild",
  "Piratas Donquixote",
  "Big Mom",
  "Kaido"
] as const;

export interface CrewOption {
  id: string;
  name: string;
}

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
  crewKey: string;
}

export interface CreatePrivateChatInput {
  name: string;
  userId: string;
  memberIds: string[];
}

function chatDocument(chatId: string) {
  return doc(firestore, CHATS_COLLECTION, chatId);
}

function crewDirectoryDocument(crewKey: string) {
  return doc(firestore, CREW_DIRECTORY_COLLECTION, crewKey);
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

export function normalizeCrewKey(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function hashCrewPassword(crewKey: string, password: string): Promise<string> {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(`travelcard-crew:${crewKey}:${password.trim()}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function crewChatId(crewKey: string, password: string): Promise<string> {
  const passwordHash = await hashCrewPassword(crewKey, password);

  return `crew_${crewKey}_${passwordHash.slice(0, 16)}`;
}

export async function ensureGeneralChat(userId: string): Promise<void> {
  await setDoc(
    chatDocument(GENERAL_CHAT_ID),
    {
      type: "general",
      name: "Chat Geral",
      createdBy: userId,
      members: [],
      visibleTo: [],
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp()
    },
    { merge: true }
  );
}

export function subscribeToCrewDirectory(
  onChange: (crews: CrewOption[]) => void,
  onError?: (error: Error) => void
) {
  return onSnapshot(
    collection(firestore, CREW_DIRECTORY_COLLECTION),
    (snapshot) => {
      const firestoreCrews = snapshot.docs.map((documentSnapshot) => {
        const data = documentSnapshot.data();

        return {
          id: documentSnapshot.id,
          name: data.name as string
        };
      });

      const crewMap = new Map<string, CrewOption>();

      STANDARD_CREWS.forEach((name) => {
        crewMap.set(normalizeCrewKey(name), {
          id: normalizeCrewKey(name),
          name
        });
      });

      firestoreCrews.forEach((crew) => {
        crewMap.set(crew.id, crew);
      });

      onChange(Array.from(crewMap.values()).sort((a, b) => a.name.localeCompare(b.name)));
    },
    onError
  );
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
  const crewKey = input.crewKey || normalizeCrewKey(input.name);
  const passwordHash = await hashCrewPassword(crewKey, input.password);
  const chatId = await crewChatId(crewKey, input.password);

  await setDoc(chatDocument(chatId), {
    type: "crew",
    name: input.name.trim(),
    createdBy: input.userId,
    members: [input.userId],
    visibleTo: [input.userId],
    crewKey,
    crewPasswordHash: passwordHash,
    createdAt: serverTimestamp()
  });

  await setDoc(
    crewDirectoryDocument(crewKey),
    {
      name: input.name.trim(),
      crewKey,
      createdBy: input.userId,
      createdAt: serverTimestamp()
    },
    { merge: true }
  );

  return chatId;
}

export async function joinCrewChat(userId: string, crewKey: string, password: string): Promise<string> {
  const passwordHash = await hashCrewPassword(crewKey, password);
  const chatId = await crewChatId(crewKey, password);

  await updateDoc(chatDocument(chatId), {
    crewKey,
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
  if (chatId === GENERAL_CHAT_ID) {
    await ensureGeneralChat(input.userId);
  }

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
