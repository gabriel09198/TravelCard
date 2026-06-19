"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Layers, Plus } from "lucide-react";

import { useAuth } from "@/components/auth/auth-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cards as mockCards, decks as mockDecks } from "@/lib/mock-data";
import {
  createUserDeck,
  subscribeUserDecks
} from "@/services/firebaseUserDataService";
import type { UserDeck } from "@/types/onePieceCard";

function PersonalDeckCard({ deck }: { deck: UserDeck }) {
  return (
    <article className="overflow-hidden rounded-md border bg-card shadow-xl shadow-black/20">
      <div className="space-y-4 p-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h2 className="truncate text-2xl font-black">{deck.name}</h2>
            {deck.description ? (
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{deck.description}</p>
            ) : null}
          </div>
          <Badge className="shrink-0 border-0 bg-secondary text-secondary-foreground">
            {deck.cards.reduce((sum, card) => sum + card.quantity, 0)} cartas
          </Badge>
        </div>

        <div className="max-h-[34rem] overflow-y-auto pr-1">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
            {deck.cards.map((card) => (
              <div
                key={`${deck.id}-${card.cardNumber}`}
                className="min-w-0 overflow-hidden rounded-md border bg-background/60"
              >
                <div className="relative aspect-[5/7] bg-muted/50">
                  {card.imageUrl ? (
                    <Image
                      src={card.imageUrl}
                      alt={card.name ?? card.cardNumber}
                      fill
                      sizes="(min-width: 1280px) 150px, (min-width: 768px) 20vw, 45vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center p-2 text-center text-xs text-muted-foreground">
                      Sem imagem
                    </div>
                  )}
                  <span className="absolute right-1 top-1 rounded bg-primary px-2 py-1 text-xs font-black text-primary-foreground">
                    {card.quantity}x
                  </span>
                </div>
                <div className="space-y-1 p-2">
                  <p className="truncate text-xs font-bold">{card.name ?? card.cardNumber}</p>
                  <p className="truncate text-[11px] text-muted-foreground">{card.cardNumber}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

export function PersonalDecks() {
  const { user } = useAuth();
  const [decks, setDecks] = useState<UserDeck[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return undefined;

    setLoading(true);
    return subscribeUserDecks(
      user.uid,
      (items) => {
        setDecks(items);
        setLoading(false);
      },
      () => {
        setError("Nao foi possivel carregar seus decks.");
        setLoading(false);
      }
    );
  }, [user]);

  async function addExamples() {
    if (!user) return;

    await Promise.all(
      mockDecks.map((deck) =>
        createUserDeck(user.uid, {
          name: deck.name,
          description: `${deck.format} - ${deck.colors.join("/")}`,
          cards: deck.cards.map((entry) => {
            const card = mockCards.find((item) => item.id === entry.cardId);

            return {
              cardId: card?.id ?? entry.cardId,
              name: card?.name ?? entry.cardId,
              cardNumber: card?.code ?? entry.cardId,
              imageUrl: card?.imageUrl,
              quantity: entry.quantity
            };
          })
        })
      )
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold">Meus decks</h1>
          <p className="text-muted-foreground">
            Decks salvos em usuarios/{user?.uid}/decks.
          </p>
        </div>
        <Button onClick={() => void addExamples()}>
          <Plus className="h-4 w-4" />
          Adicionar exemplos
        </Button>
      </div>

      <div className="grid gap-3 rounded-md border bg-card p-3 md:grid-cols-[1fr_180px_180px]">
        <Input placeholder="Buscar deck, leader ou carta" />
        <Input placeholder="Cores" />
        <Input placeholder="Formato" />
      </div>

      {error ? <p className="rounded-md bg-red-500/15 p-3 text-sm text-red-200">{error}</p> : null}

      {!loading && decks.length === 0 ? (
        <div className="rounded-md border bg-card p-8 text-center">
          <Layers className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
          <p className="font-semibold">Voce ainda nao tem decks salvos.</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Cada usuario ve apenas os proprios decks vinculados ao UID.
          </p>
          <Button className="mt-4" onClick={() => void addExamples()}>
            <Plus className="h-4 w-4" />
            Adicionar exemplos
          </Button>
        </div>
      ) : (
        <div className="space-y-5">
          {decks.map((deck) => (
            <PersonalDeckCard key={deck.id} deck={deck} />
          ))}
        </div>
      )}
    </div>
  );
}
