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
import {
  createCrewChat,
  createPrivateChat,
  ensureGeneralChat,
  joinCrewChat,
  sendChatMessage,
  subscribeToAvailableChats,
  subscribeToChatMessages
} from "@/services/chatMessagesService";
import type { ChatMessage, ChatRoom, ChatRoomType } from "@/types/onePieceCard";
import { cn } from "@/lib/utils";

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
  const [crewName, setCrewName] = useState("");
  const [crewPassword, setCrewPassword] = useState("");
  const [joinPassword, setJoinPassword] = useState("");
  const [privateName, setPrivateName] = useState("");
  const [privateMembers, setPrivateMembers] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const activeChat = useMemo(
    () => chats.find((chat) => chat.id === activeChatId) ?? chats[0],
    [activeChatId, chats]
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

    try {
      await sendChatMessage(activeChat.id, {
        text: trimmedText,
        userId: user.uid,
        userName: profile?.name ?? user.displayName ?? user.email ?? "Usuario",
        userEmail: user.email ?? ""
      });
    } catch (sendError) {
      console.error("Nao foi possivel enviar a mensagem.", sendError);
      setError("Nao foi possivel enviar a mensagem.");
      setText(trimmedText);
    }
  }

  async function handleCreateCrew(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user || !crewName.trim() || !crewPassword.trim()) return;

    setBusy(true);
    setError("");

    try {
      const chatId = await createCrewChat({
        name: crewName,
        password: crewPassword,
        userId: user.uid
      });
      setCrewName("");
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

    setBusy(true);
    setError("");

    try {
      const chatId = await joinCrewChat(user.uid, joinPassword);
      setJoinPassword("");
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
    <div className="fixed bottom-4 right-4 z-50">
      {open ? (
        <div className="mb-3 flex h-[min(720px,calc(100vh-6rem))] w-[calc(100vw-2rem)] max-w-4xl overflow-hidden rounded-md border border-amber-500/35 bg-card shadow-2xl shadow-black/45">
          <aside className="hidden w-64 shrink-0 border-r border-amber-500/25 bg-slate-950/70 p-3 md:block">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="font-black text-amber-100">Chats</p>
                <p className="text-xs text-muted-foreground">{chats.length} disponiveis</p>
              </div>
              <Button type="button" size="icon" variant="ghost" onClick={() => setOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {(["general", "crew", "private"] as ChatRoomType[]).map((type) => (
              <div key={type} className="mb-4">
                <p className="mb-2 text-xs font-bold uppercase text-amber-300">
                  {chatSectionLabels[type]}
                </p>
                <div className="space-y-2">
                  {chats.filter((chat) => chat.type === type).map((chat) => {
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
                            ? "border-amber-300/60 bg-amber-500/15 text-amber-100"
                            : "border-transparent text-muted-foreground hover:border-amber-500/25 hover:text-foreground"
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
            <div className="flex items-center justify-between border-b border-amber-500/25 bg-primary px-4 py-3 text-primary-foreground">
              <div className="min-w-0">
                <p className="truncate font-semibold">{activeChat?.name ?? "Chat"}</p>
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

            <div className="flex gap-2 overflow-x-auto border-b border-amber-500/20 bg-slate-950/40 p-2 md:hidden">
              {chats.map((chat) => {
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

            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-muted/35 p-3">
              {messages.length === 0 ? (
                <p className="rounded-md bg-background/80 p-3 text-center text-sm text-muted-foreground">
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
                          "max-w-[82%] rounded-md px-3 py-2 text-sm shadow-sm",
                          mine ? "bg-primary text-primary-foreground" : "bg-background"
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

            <div className="border-t border-amber-500/20 bg-card p-3">
              <div className="mb-3 grid gap-2 lg:grid-cols-3">
                <form onSubmit={handleJoinCrew} className="flex gap-2">
                  <Input
                    value={joinPassword}
                    onChange={(event) => setJoinPassword(event.target.value)}
                    placeholder="Codigo da tripulacao"
                    type="password"
                  />
                  <Button type="submit" size="icon" variant="outline" disabled={busy}>
                    <LockKeyhole className="h-4 w-4" />
                  </Button>
                </form>
                <form onSubmit={handleCreateCrew} className="flex gap-2">
                  <Input
                    value={crewName}
                    onChange={(event) => setCrewName(event.target.value)}
                    placeholder="Nova tripulacao"
                  />
                  <Input
                    value={crewPassword}
                    onChange={(event) => setCrewPassword(event.target.value)}
                    placeholder="Codigo"
                    type="password"
                  />
                  <Button type="submit" size="icon" variant="outline" disabled={busy}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </form>
                <form onSubmit={handleCreatePrivate} className="flex gap-2">
                  <Input
                    value={privateName}
                    onChange={(event) => setPrivateName(event.target.value)}
                    placeholder="Grupo privado"
                  />
                  <Input
                    value={privateMembers}
                    onChange={(event) => setPrivateMembers(event.target.value)}
                    placeholder="UIDs separados por virgula"
                  />
                  <Button type="submit" size="icon" variant="outline" disabled={busy}>
                    <Users className="h-4 w-4" />
                  </Button>
                </form>
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
        className="h-12 w-12 rounded-full shadow-xl"
        onClick={() => setOpen((current) => !current)}
        aria-label="Abrir chat"
      >
        <MessageCircle className="h-5 w-5" />
      </Button>
    </div>
  );
}
