"use client";

import Image from "next/image";
import { BookOpenCheck, Layers, MessageSquareText, ShoppingBag } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { useAuth } from "@/components/auth/auth-provider";
import { StatCard } from "@/components/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  subscribeUserDecks,
  subscribeUserOwnedCards,
  subscribeUserWishlist
} from "@/services/firebaseUserDataService";
import type { UserDeck, UserOwnedCard, UserWishlistCard } from "@/types/onePieceCard";

function RecentUserDeck({ deck }: { deck: UserDeck }) {
  const totalCards = deck.cards.reduce((sum, card) => sum + card.quantity, 0);

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <CardTitle className="truncate text-amber-100">{deck.name}</CardTitle>
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
              {deck.description || "Deck salvo na sua conta."}
            </p>
          </div>
          <span className="shrink-0 rounded-md border border-amber-500/25 bg-amber-500/10 px-2 py-1 text-xs font-bold text-amber-100">
            {totalCards} cartas
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-2">
          {deck.cards.slice(0, 8).map((card) => (
            <div key={card.cardNumber} className="text-center">
              <div className="relative aspect-[5/7] overflow-hidden rounded border border-amber-500/25 bg-muted/40">
                {card.imageUrl ? (
                  <Image
                    src={card.imageUrl}
                    alt={card.name ?? card.cardNumber}
                    fill
                    sizes="90px"
                    className="object-cover"
                  />
                ) : null}
              </div>
              <p className="mt-1 text-xs font-black text-amber-100">{card.quantity}x</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function UserDashboardOverview() {
  const { user, profile } = useAuth();
  const [decks, setDecks] = useState<UserDeck[]>([]);
  const [ownedCards, setOwnedCards] = useState<UserOwnedCard[]>([]);
  const [wishlist, setWishlist] = useState<UserWishlistCard[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      setDecks([]);
      setOwnedCards([]);
      setWishlist([]);
      setError("");
      return undefined;
    }

    const unsubscribers = [
      subscribeUserDecks(user.uid, setDecks, () => setError("Nao foi possivel carregar seus decks.")),
      subscribeUserOwnedCards(user.uid, setOwnedCards, () =>
        setError("Nao foi possivel carregar sua colecao.")
      ),
      subscribeUserWishlist(user.uid, setWishlist, () =>
        setError("Nao foi possivel carregar sua lista de desejos.")
      )
    ];

    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, [user]);

  const ownedTotal = useMemo(
    () => ownedCards.reduce((sum, card) => sum + card.quantity, 0),
    [ownedCards]
  );
  const wishlistTotal = useMemo(
    () => wishlist.reduce((sum, card) => sum + card.desiredQuantity, 0),
    [wishlist]
  );

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-bold text-amber-300">Perfil de {profile?.handle || user?.email}</p>
        <h1 className="text-3xl font-black text-amber-100">
          Oi, {profile?.name ?? user?.displayName ?? "tripulante"}
        </h1>
      </div>

      {error ? <p className="rounded-md bg-red-500/15 p-3 text-sm text-red-200">{error}</p> : null}

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="Decks" value={decks.length} helper="Listas da sua conta" icon={Layers} />
        <StatCard
          label="Cartas possuidas"
          value={ownedTotal}
          helper="Na sua colecao"
          icon={BookOpenCheck}
        />
        <StatCard
          label="Desejadas"
          value={wishlistTotal}
          helper="Para comprar depois"
          icon={ShoppingBag}
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <h2 className="text-xl font-black text-amber-100">Decks recentes</h2>
          {decks.length === 0 ? (
            <Card>
              <CardContent className="flex min-h-52 items-center justify-center text-center text-muted-foreground">
                Nenhum deck salvo para este usuario.
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {decks.slice(0, 2).map((deck) => (
                <RecentUserDeck key={deck.id} deck={deck} />
              ))}
            </div>
          )}
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-amber-100">Resumo da tripulacao</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3 rounded-md border border-amber-500/20 bg-background/55 p-3">
              <MessageSquareText className="h-5 w-5 shrink-0 text-amber-300" />
              <p className="text-sm text-muted-foreground">
                Dados carregados somente de users/{user?.uid}. Ao trocar de conta, este painel limpa e recarrega.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-black text-amber-100">Prioridade de compra</h2>
        {wishlist.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-sm text-muted-foreground">
              Nenhuma carta desejada salva para este usuario.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {wishlist.slice(0, 6).map((card) => (
              <Card key={card.id}>
                <CardContent className="flex items-center gap-3 p-3">
                  <div className="relative aspect-[5/7] w-14 shrink-0 overflow-hidden rounded border border-amber-500/25 bg-muted/40">
                    {card.imageUrl ? (
                      <Image src={card.imageUrl} alt={card.name} fill sizes="56px" className="object-cover" />
                    ) : null}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-amber-100">{card.name}</p>
                    <p className="text-xs text-muted-foreground">{card.code}</p>
                    <p className="text-xs font-bold">{card.desiredQuantity}x</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
