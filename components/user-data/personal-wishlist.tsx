"use client";

import { useEffect, useState } from "react";
import { Plus, ShoppingBag } from "lucide-react";

import { useAuth } from "@/components/auth/auth-provider";
import { UserCardTile } from "@/components/user-data/user-card-tile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cards as mockCards } from "@/lib/mock-data";
import {
  saveUserWishlistCard,
  subscribeUserWishlist
} from "@/services/firebaseUserDataService";
import type { UserWishlistCard } from "@/types/onePieceCard";

export function PersonalWishlist() {
  const { user } = useAuth();
  const [cards, setCards] = useState<UserWishlistCard[]>([]);
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
    return subscribeUserWishlist(
      user.uid,
      (items) => {
        setCards(items);
        setLoading(false);
      },
      () => {
        setError("Nao foi possivel carregar sua wishlist.");
        setLoading(false);
      }
    );
  }, [user]);

  async function addExamples() {
    if (!user) return;

    await Promise.all(
      mockCards
        .filter((card) => card.status.includes("wanted"))
        .map((card) =>
          saveUserWishlistCard(user.uid, {
            id: card.code,
            name: card.name,
            code: card.code,
            imageUrl: card.imageUrl,
            desiredQuantity: Math.max(card.quantity, 1),
            notes: card.collection
          })
        )
    );
  }

  return (
    <div className="space-y-6">
      <div className="pirate-parchment flex flex-col justify-between gap-4 rounded-lg p-5 sm:flex-row sm:items-center">
        <div>
          <p className="pirate-subtitle text-sm">Tesouros procurados</p>
          <h1 className="pirate-title text-3xl font-black">Cartas desejadas</h1>
          <p className="text-muted-foreground">
            Wishlist salva em users/{user?.uid}/wishlist.
          </p>
        </div>
        <Button onClick={() => void addExamples()}>
          <ShoppingBag className="h-4 w-4" />
          Adicionar exemplos
        </Button>
      </div>

      <div className="pirate-panel rounded-lg p-4">
        <Input placeholder="Buscar carta desejada" />
      </div>

      {error ? <p className="rounded-md bg-red-500/15 p-3 text-sm text-red-200">{error}</p> : null}

      {!loading && cards.length === 0 ? (
        <div className="pirate-parchment rounded-lg p-8 text-center">
          <p className="font-semibold text-amber-100">Sua lista de tesouros ainda esta vazia.</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Cada usuario tem sua propria wishlist protegida pelo UID.
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
              quantity={card.desiredQuantity}
              detail={card.notes}
            />
          ))}
        </div>
      )}
    </div>
  );
}
