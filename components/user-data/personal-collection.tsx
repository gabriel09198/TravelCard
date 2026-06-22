"use client";

import { useEffect, useState } from "react";
import { Filter, Plus, Search } from "lucide-react";

import { useAuth } from "@/components/auth/auth-provider";
import { UserCardTile } from "@/components/user-data/user-card-tile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cards as mockCards } from "@/lib/mock-data";
import {
  saveUserOwnedCard,
  subscribeUserOwnedCards
} from "@/services/firebaseUserDataService";
import type { UserOwnedCard } from "@/types/onePieceCard";

export function PersonalCollection() {
  const { user } = useAuth();
  const [cards, setCards] = useState<UserOwnedCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      setCards([]);
      setError("");
      setLoading(false);
      return undefined;
    }

    setLoading(true);
    return subscribeUserOwnedCards(
      user.uid,
      (items) => {
        setCards(items);
        setLoading(false);
      },
      () => {
        setError("Nao foi possivel carregar sua colecao.");
        setLoading(false);
      }
    );
  }, [user]);

  async function addExamples() {
    if (!user) return;

    await Promise.all(
      mockCards.slice(0, 6).map((card) =>
        saveUserOwnedCard(user.uid, {
          id: card.code,
          name: card.name,
          code: card.code,
          imageUrl: card.imageUrl,
          quantity: Math.max(card.quantity, 1),
          type: card.type,
          color: card.colors.join(", "),
          rarity: card.rarity,
          notes: card.collection
        })
      )
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Minha colecao</h1>
        <p className="text-muted-foreground">
          Cartas salvas em users/{user?.uid}/collection.
        </p>
      </div>

      <div className="grid gap-3 rounded-lg border bg-card p-4 md:grid-cols-[1fr_160px_160px_160px]">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Buscar por nome ou codigo" />
        </div>
        <Input placeholder="Tipo" />
        <Input placeholder="Cor" />
        <Button variant="outline">
          <Filter className="h-4 w-4" />
          Filtrar
        </Button>
      </div>

      {error ? <p className="rounded-md bg-red-500/15 p-3 text-sm text-red-200">{error}</p> : null}

      {!loading && cards.length === 0 ? (
        <div className="rounded-md border bg-card p-8 text-center">
          <p className="font-semibold">Sua colecao ainda esta vazia.</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Adicione cartas para que elas fiquem vinculadas apenas ao seu UID.
          </p>
          <Button className="mt-4" onClick={() => void addExamples()}>
            <Plus className="h-4 w-4" />
            Adicionar exemplos
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {cards.map((card) => (
            <UserCardTile
              key={card.id}
              name={card.name}
              code={card.code}
              imageUrl={card.imageUrl}
              quantity={card.quantity}
              detail={[card.type, card.color, card.rarity].filter(Boolean).join(" - ")}
            />
          ))}
        </div>
      )}
    </div>
  );
}
