"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";

import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  sendChatMessage,
  subscribeToChatMessages
} from "@/services/chatMessagesService";
import type { ChatMessage } from "@/types/onePieceCard";
import { cn } from "@/lib/utils";

export function ChatWidget() {
  const { user, profile } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!user) return undefined;

    return subscribeToChatMessages(setMessages, () => {
      setError("Nao foi possivel carregar o chat.");
    });
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  if (!user) {
    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedText = text.trim();
    if (!trimmedText || !user) return;

    setText("");
    setError("");

    try {
      await sendChatMessage({
        text: trimmedText,
        userId: user.uid,
        userName: profile?.name ?? user.displayName ?? user.email ?? "Usuario",
        userEmail: user.email ?? ""
      });
    } catch {
      setError("Nao foi possivel enviar a mensagem.");
      setText(trimmedText);
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {open ? (
        <div className="mb-3 w-[calc(100vw-2rem)] max-w-sm overflow-hidden rounded-md border bg-card shadow-2xl">
          <div className="flex items-center justify-between border-b bg-primary px-4 py-3 text-primary-foreground">
            <div>
              <p className="font-semibold">Chat da tripulacao</p>
              <p className="text-xs opacity-85">{messages.length} mensagens</p>
            </div>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="text-primary-foreground hover:bg-white/15 hover:text-primary-foreground"
              onClick={() => setOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="max-h-80 min-h-72 space-y-3 overflow-y-auto bg-muted/45 p-3">
            {messages.length === 0 ? (
              <p className="rounded-md bg-background p-3 text-center text-sm text-muted-foreground">
                Seja o primeiro a mandar mensagem.
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

          <form onSubmit={handleSubmit} className="space-y-2 border-t bg-card p-3">
            {error ? <p className="text-xs text-red-700">{error}</p> : null}
            <div className="flex gap-2">
              <Input
                value={text}
                onChange={(event) => setText(event.target.value)}
                placeholder="Escreva uma mensagem"
              />
              <Button type="submit" size="icon" aria-label="Enviar mensagem">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
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
