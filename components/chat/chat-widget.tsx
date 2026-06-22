"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  LockKeyhole,
  MessageCircle,
  Plus,
  Send,
  ShipWheel,
  Users,
  X
} from "lucide-react";

import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { firebaseAuth } from "@/lib/firebase";
import {
  createCrewChat,
  createPrivateChat,
  ensureGeneralChat,
  joinCrewChat,
  normalizeCrewKey,
  sendChatMessage,
  subscribeToAvailableChats,
  subscribeToCrewDirectory,
  subscribeToChatMessages
} from "@/services/chatMessagesService";
import type { CrewOption } from "@/services/chatMessagesService";
import type { ChatMessage, ChatRoom, ChatRoomType } from "@/types/onePieceCard";
import { cn } from "@/lib/utils";

type ChatAction = "" | "join-crew" | "create-crew" | "create-private";

const chatSectionLabels: Record<ChatRoomType, string> = {
  general: "Chat Geral",
  crew: "Minhas Tripulacoes",
  private: "Grupos Privados"
};

function chatTypeIcon(type: ChatRoomType) {
  if (type === "general") return MessageCircle;
  if (type === "crew") return ShipWheel;
  return Users;
}

export function ChatWidget() {
  const { user, profile } = useAuth();
  const [open, setOpen] = useState(false);
  const [chats, setChats] = useState<ChatRoom[]>([]);
  const [activeChatId, setActiveChatId] = useState("general");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [crewOptions, setCrewOptions] = useState<CrewOption[]>([]);
  const [selectedCrewKey, setSelectedCrewKey] = useState("");
  const [customCrewName, setCustomCrewName] = useState("");
  const [crewPassword, setCrewPassword] = useState("");
  const [joinCrewKey, setJoinCrewKey] = useState("");
  const [joinCustomCrewName, setJoinCustomCrewName] = useState("");
  const [joinPassword, setJoinPassword] = useState("");
  const [privateName, setPrivateName] = useState("");
  const [privateMembers, setPrivateMembers] = useState("");
  const [selectedAction, setSelectedAction] = useState<ChatAction>("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const displayChats = useMemo<ChatRoom[]>(
    () =>
      chats.length > 0
        ? chats
        : [
            {
              id: "general",
              type: "general",
              name: "Chat Geral",
              createdBy: "",
              members: []
            }
          ],
    [chats]
  );
  const activeChat = useMemo(
    () => displayChats.find((chat) => chat.id === activeChatId) ?? displayChats[0],
    [activeChatId, displayChats]
  );

  useEffect(() => {
    if (!user) {
      setChats([]);
      setMessages([]);
      setActiveChatId("general");
      setText("");
      setError("");
      setOpen(false);
      return undefined;
    }

    void ensureGeneralChat(user.uid).catch((setupError) => {
      console.error("Nao foi possivel preparar o Chat Geral.", setupError);
    });

    return subscribeToAvailableChats(
      user.uid,
      (items) => {
        setChats(items);
        setActiveChatId((current) =>
          items.some((chat) => chat.id === current) ? current : items[0]?.id ?? "general"
        );
      },
      (loadError) => {
        console.error("Nao foi possivel carregar chats.", loadError);
        setError("Nao foi possivel carregar seus chats.");
      }
    );
  }, [user]);

  useEffect(() => {
    if (!user) {
      setCrewOptions([]);
      return undefined;
    }

    return subscribeToCrewDirectory(
      (items) => {
        setCrewOptions(items);
        setSelectedCrewKey((current) => current || items[0]?.id || "other");
        setJoinCrewKey((current) => current || items[0]?.id || "other");
      },
      (directoryError) => {
        console.error("Nao foi possivel carregar tripulacoes.", directoryError);
      }
    );
  }, [user]);

  useEffect(() => {
    if (!user || !activeChat) {
      setMessages([]);
      return undefined;
    }

    setMessages([]);
    return subscribeToChatMessages(
      activeChat.id,
      setMessages,
      (loadError) => {
        console.error("Nao foi possivel carregar mensagens.", loadError);
        setError("Nao foi possivel carregar as mensagens deste chat.");
      }
    );
  }, [activeChat, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open, activeChatId]);

  if (!user) {
    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedText = text.trim();
    if (!trimmedText || !user || !activeChat) return;

    setText("");
    setError("");
    const authUser = firebaseAuth.currentUser;

    if (!authUser) {
      setError("Voce precisa estar logado para enviar mensagem.");
      return;
    }

    try {
      await sendChatMessage(activeChat.id, {
        text: trimmedText,
        userId: authUser.uid,
        userName: profile?.name ?? authUser.displayName ?? authUser.email ?? "Usuario",
        userEmail: authUser.email ?? ""
      });
    } catch (sendError) {
      console.error("Erro real ao enviar mensagem:", sendError);
      setError("Nao foi possivel enviar a mensagem.");
      setText(trimmedText);
    }
  }

  async function handleCreateCrew(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user || !crewPassword.trim()) return;

    const selectedCrew = crewOptions.find((crew) => crew.id === selectedCrewKey);
    const crewName = selectedCrewKey === "other" ? customCrewName.trim() : selectedCrew?.name ?? "";
    const crewKey = selectedCrewKey === "other" ? normalizeCrewKey(crewName) : selectedCrewKey;

    if (!crewName || !crewKey) {
      setError("Escolha ou informe o nome da tripulacao.");
      return;
    }

    setBusy(true);
    setError("");

    try {
      const chatId = await createCrewChat({
        name: crewName,
        password: crewPassword,
        userId: user.uid,
        crewKey
      });
      setCustomCrewName("");
      setCrewPassword("");
      setActiveChatId(chatId);
    } catch (createError) {
      console.error("Nao foi possivel criar a tripulacao.", createError);
      setError("Nao foi possivel criar a tripulacao.");
    } finally {
      setBusy(false);
    }
  }

  async function handleJoinCrew(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user || !joinPassword.trim()) return;

    const selectedCrew = crewOptions.find((crew) => crew.id === joinCrewKey);
    const crewName = joinCrewKey === "other" ? joinCustomCrewName.trim() : selectedCrew?.name ?? "";
    const crewKey = joinCrewKey === "other" ? normalizeCrewKey(crewName) : joinCrewKey;

    if (!crewKey) {
      setError("Escolha uma tripulacao para entrar.");
      return;
    }

    setBusy(true);
    setError("");

    try {
      const chatId = await joinCrewChat(user.uid, crewKey, joinPassword);
      setJoinPassword("");
      setJoinCustomCrewName("");
      setActiveChatId(chatId);
    } catch (joinError) {
      console.error("Codigo de tripulacao invalido ou sem permissao.", joinError);
      setError("Codigo de tripulacao invalido.");
    } finally {
      setBusy(false);
    }
  }

  async function handleCreatePrivate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user || !privateName.trim()) return;

    setBusy(true);
    setError("");

    try {
      const chatId = await createPrivateChat({
        name: privateName,
        userId: user.uid,
        memberIds: privateMembers.split(",").map((member) => member.trim())
      });
      setPrivateName("");
      setPrivateMembers("");
      setActiveChatId(chatId);
    } catch (createError) {
      console.error("Nao foi possivel criar grupo privado.", createError);
      setError("Nao foi possivel criar o grupo privado.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex max-w-[calc(100vw-2rem)] flex-col items-end">
      {open ? (
        <div className="pirate-panel mb-3 flex h-[min(720px,calc(100vh-6rem))] w-[min(980px,calc(100vw-2rem))] overflow-hidden rounded-lg">
          <aside className="hidden w-64 shrink-0 border-r border-amber-500/25 bg-slate-950/78 p-4 md:block">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="pirate-title font-black">Taverna</p>
                <p className="text-xs text-muted-foreground">{displayChats.length} disponiveis</p>
              </div>
              <Button type="button" size="icon" variant="ghost" onClick={() => setOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {(["general", "crew", "private"] as ChatRoomType[]).map((type) => (
              <div key={type} className="mb-4">
                <p className="pirate-subtitle mb-2 text-xs">
                  {chatSectionLabels[type]}
                </p>
                <div className="space-y-2">
                  {displayChats.filter((chat) => chat.type === type).map((chat) => {
                    const Icon = chatTypeIcon(chat.type);
                    const selected = chat.id === activeChat?.id;

                    return (
                      <button
                        key={chat.id}
                        type="button"
                        onClick={() => setActiveChatId(chat.id)}
                        className={cn(
                          "flex w-full items-center gap-2 rounded-md border px-3 py-2 text-left text-sm transition",
                          selected
                            ? "border-amber-300/70 bg-amber-500/20 text-amber-100 shadow-sm shadow-amber-950/30"
                            : "border-transparent text-muted-foreground hover:border-amber-500/35 hover:bg-amber-500/10 hover:text-foreground"
                        )}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        <span className="truncate">{chat.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </aside>

          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex items-center justify-between border-b border-amber-500/30 bg-gradient-to-r from-red-700 via-red-600 to-amber-800 px-4 py-3 text-primary-foreground">
              <div className="min-w-0">
                <p className="truncate font-black">{activeChat?.name ?? "Chat"}</p>
                <p className="text-xs opacity-85">{messages.length} mensagens</p>
              </div>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="text-primary-foreground hover:bg-white/15 hover:text-primary-foreground md:hidden"
                onClick={() => setOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="pirate-scrollbar flex gap-2 overflow-x-auto border-b border-amber-500/20 bg-slate-950/50 p-2 md:hidden">
              {displayChats.map((chat) => {
                const Icon = chatTypeIcon(chat.type);

                return (
                  <button
                    key={chat.id}
                    type="button"
                    onClick={() => setActiveChatId(chat.id)}
                    className={cn(
                      "flex shrink-0 items-center gap-2 rounded-md border px-3 py-2 text-xs font-bold",
                      chat.id === activeChat?.id
                        ? "border-amber-300/60 bg-amber-500/15 text-amber-100"
                        : "border-amber-500/20 text-muted-foreground"
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {chat.name}
                  </button>
                );
              })}
            </div>

            <div className="pirate-scrollbar min-h-0 flex-1 space-y-3 overflow-y-auto bg-slate-950/42 p-3">
              {messages.length === 0 ? (
                <p className="pirate-parchment rounded-md p-3 text-center text-sm text-muted-foreground">
                  Seja o primeiro a mandar mensagem neste chat.
                </p>
              ) : (
                messages.map((message) => {
                  const mine = message.userId === user.uid;

                  return (
                    <div
                      key={message.id}
                      className={cn("flex", mine ? "justify-end" : "justify-start")}
                    >
                      <div
                        className={cn(
                          "max-w-[82%] rounded-md border px-3 py-2 text-sm shadow-sm",
                          mine
                            ? "border-red-300/25 bg-gradient-to-br from-red-600 to-red-800 text-primary-foreground"
                            : "border-amber-500/25 bg-background/88 text-foreground"
                        )}
                      >
                        <p className="mb-1 text-[11px] font-semibold opacity-75">
                          {message.userName}
                        </p>
                        <p className="leading-5">{message.text}</p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-amber-500/25 bg-card/85 p-3">
              <div className="pirate-parchment mb-3 rounded-md p-3">
                <label className="pirate-subtitle mb-2 block text-xs">
                  O que voce deseja fazer?
                </label>
                <select
                  value={selectedAction}
                  onChange={(event) => setSelectedAction(event.target.value as ChatAction)}
                  className="pirate-select px-3 py-2 text-sm"
                >
                  <option value="">Selecione uma opcao</option>
                  <option value="join-crew">Entrar em tripulacao</option>
                  <option value="create-crew">Criar tripulacao</option>
                  <option value="create-private">Criar grupo privado</option>
                </select>

                {selectedAction === "join-crew" ? (
                  <form onSubmit={handleJoinCrew} className="mt-3 grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
                    <select
                      value={joinCrewKey}
                      onChange={(event) => setJoinCrewKey(event.target.value)}
                      className="pirate-select px-3 py-2 text-sm"
                    >
                      {crewOptions.map((crew) => (
                        <option key={crew.id} value={crew.id}>
                          {crew.name}
                        </option>
                      ))}
                      <option value="other">Outra</option>
                    </select>
                    {joinCrewKey === "other" ? (
                      <Input
                        value={joinCustomCrewName}
                        onChange={(event) => setJoinCustomCrewName(event.target.value)}
                        placeholder="Nome da tripulacao"
                      />
                    ) : null}
                    <Input
                      value={joinPassword}
                      onChange={(event) => setJoinPassword(event.target.value)}
                      placeholder="Codigo da tripulacao"
                      type="password"
                      className="min-w-0"
                    />
                    <Button type="submit" variant="outline" disabled={busy}>
                      <LockKeyhole className="h-4 w-4" />
                      Entrar
                    </Button>
                  </form>
                ) : null}

                {selectedAction === "create-crew" ? (
                  <form onSubmit={handleCreateCrew} className="mt-3 grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
                    <select
                      value={selectedCrewKey}
                      onChange={(event) => setSelectedCrewKey(event.target.value)}
                      className="pirate-select px-3 py-2 text-sm"
                    >
                      {crewOptions.map((crew) => (
                        <option key={crew.id} value={crew.id}>
                          {crew.name}
                        </option>
                      ))}
                      <option value="other">Outra</option>
                    </select>
                    {selectedCrewKey === "other" ? (
                      <Input
                        value={customCrewName}
                        onChange={(event) => setCustomCrewName(event.target.value)}
                        placeholder="Nome personalizado"
                      />
                    ) : null}
                    <Input
                      value={crewPassword}
                      onChange={(event) => setCrewPassword(event.target.value)}
                      placeholder="Codigo"
                      type="password"
                      className="min-w-0"
                    />
                    <Button type="submit" variant="outline" disabled={busy}>
                      <Plus className="h-4 w-4" />
                      Criar
                    </Button>
                  </form>
                ) : null}

                {selectedAction === "create-private" ? (
                  <form onSubmit={handleCreatePrivate} className="mt-3 grid gap-2 sm:grid-cols-[0.8fr_1fr_auto]">
                    <Input
                      value={privateName}
                      onChange={(event) => setPrivateName(event.target.value)}
                      placeholder="Nome do grupo"
                      className="min-w-0"
                    />
                    <Input
                      value={privateMembers}
                      onChange={(event) => setPrivateMembers(event.target.value)}
                      placeholder="UIDs separados por virgula"
                      className="min-w-0"
                    />
                    <Button type="submit" variant="outline" disabled={busy}>
                      <Users className="h-4 w-4" />
                      Criar grupo
                    </Button>
                  </form>
                ) : null}
              </div>

              <form onSubmit={handleSubmit} className="space-y-2">
                {error ? <p className="text-xs text-red-300">{error}</p> : null}
                <div className="flex gap-2">
                  <Input
                    value={text}
                    onChange={(event) => setText(event.target.value)}
                    placeholder={`Mensagem em ${activeChat?.name ?? "chat"}`}
                  />
                  <Button type="submit" size="icon" aria-label="Enviar mensagem">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : null}

      <Button
        type="button"
        size="icon"
        className="h-12 w-12 rounded-full border-2 border-amber-300/55 shadow-xl shadow-red-950/45"
        onClick={() => setOpen((current) => !current)}
        aria-label="Abrir chat"
      >
        <MessageCircle className="h-5 w-5" />
      </Button>
    </div>
  );
}
