import Image from "next/image";
import { Copy, Edit3, Share2, ShoppingCart } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cards as cardCatalog } from "@/lib/mock-data";
import type { Deck } from "@/types/opcg";
import { cn } from "@/lib/utils";

const colorStyles = {
  Red: {
    frame: "border-red-500 bg-red-950",
    art: "from-red-300 via-orange-100 to-rose-500",
    chip: "bg-red-500/15 text-red-100 ring-red-400/25"
  },
  Green: {
    frame: "border-emerald-500 bg-emerald-950",
    art: "from-emerald-300 via-cyan-100 to-lime-500",
    chip: "bg-emerald-500/15 text-emerald-100 ring-emerald-400/25"
  },
  Blue: {
    frame: "border-sky-500 bg-sky-950",
    art: "from-sky-300 via-white to-blue-600",
    chip: "bg-sky-500/15 text-sky-100 ring-sky-400/25"
  },
  Purple: {
    frame: "border-fuchsia-500 bg-fuchsia-950",
    art: "from-fuchsia-300 via-purple-100 to-violet-700",
    chip: "bg-fuchsia-500/15 text-fuchsia-100 ring-fuchsia-400/25"
  },
  Black: {
    frame: "border-zinc-500 bg-zinc-950",
    art: "from-zinc-300 via-zinc-100 to-zinc-700",
    chip: "bg-zinc-500/15 text-zinc-100 ring-zinc-400/25"
  },
  Yellow: {
    frame: "border-yellow-400 bg-yellow-950",
    art: "from-yellow-200 via-white to-amber-500",
    chip: "bg-yellow-500/15 text-yellow-100 ring-yellow-400/25"
  }
};

const formatLabel = {
  Casual: "Casual",
  Local: "Local",
  Tournament: "Torneio"
};

export function DeckCard({ deck }: { deck: Deck }) {
  const deckCards = deck.cards
    .map((entry) => {
      const card = cardCatalog.find((item) => item.id === entry.cardId);
      return card ? { ...card, deckQuantity: entry.quantity } : null;
    })
    .filter(Boolean);
  const leader = deckCards.find((card) => card?.type === "Leader") ?? deckCards[0];
  const totalCards = deck.cards.reduce((sum, card) => sum + card.quantity, 0);
  const totalPrice = deckCards.reduce(
    (sum, card) => sum + (card?.price ?? 0) * (card?.deckQuantity ?? 0),
    0
  );

  return (
    <article className="overflow-hidden rounded-md border border-zinc-800 bg-black text-white shadow-xl shadow-black/20">
      <div className="space-y-4 p-3 sm:p-4">
        <div className="flex gap-3">
          <div
            className={cn(
              "relative h-20 w-20 shrink-0 overflow-hidden rounded-md border-2",
              leader ? colorStyles[leader.colors[0]].frame : "border-zinc-700 bg-zinc-900"
            )}
          >
            <div
              className={cn(
                "absolute inset-0 bg-gradient-to-br",
                leader ? colorStyles[leader.colors[0]].art : "from-zinc-700 to-zinc-950"
              )}
            />
            <div className="absolute inset-x-0 bottom-0 z-10 bg-black/70 px-1.5 py-1 text-[10px] font-black uppercase leading-none">
              {leader?.name ?? deck.leader}
            </div>
            {leader?.imageUrl ? (
              <Image
                src={leader.imageUrl}
                alt={leader.name}
                fill
                sizes="80px"
                className="object-cover"
              />
            ) : null}
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-black leading-tight tracking-normal text-zinc-50 sm:text-3xl">
              {deck.name}
            </h2>
            <p className="mt-1 text-sm text-sky-300">
              {deck.owner.toLowerCase()} <span className="text-zinc-500">- atualizado em {deck.updatedAt}</span>
            </p>
            <p className="mt-3 max-w-4xl text-sm leading-6 text-zinc-400">
              Lista {deck.colors.join("/")} com {deck.leader}, preparada para compartilhar com colegas,
              testar matchups e fechar compras.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {deck.colors.map((color) => (
            <Badge key={color} className={cn("border-0 ring-1", colorStyles[color].chip)}>
              {color}
            </Badge>
          ))}
          <Badge className="border-0 bg-zinc-700 text-zinc-100">{formatLabel[deck.format]}</Badge>
          <Badge className="border-0 bg-zinc-700 text-zinc-100">{totalCards} cartas</Badge>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" className="h-9 bg-blue-600 px-3 font-semibold hover:bg-blue-500">
            <Copy className="h-4 w-4" />
            Copiar
          </Button>
          <Button size="sm" className="h-9 bg-violet-600 px-3 font-semibold hover:bg-violet-500">
            <Edit3 className="h-4 w-4" />
            Editar
          </Button>
          <Button size="sm" className="h-9 bg-rose-600 px-3 font-semibold hover:bg-rose-500">
            <ShoppingCart className="h-4 w-4" />
            Comprar ~${totalPrice.toFixed(2)}
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="h-9 bg-zinc-800 px-3 font-semibold text-zinc-100 hover:bg-zinc-700"
          >
            <Share2 className="h-4 w-4" />
            Compartilhar
          </Button>
        </div>

        <div className="-mx-1 overflow-x-auto px-1 pb-2">
          <div className="flex min-w-full gap-4">
            {deckCards.map((card) => {
              if (!card) return null;
              const style = colorStyles[card.colors[0]];

              return (
                <div
                  key={`${deck.id}-${card.id}`}
                  className="w-[132px] shrink-0 overflow-hidden rounded-md border border-zinc-800 bg-zinc-950/80 shadow-lg shadow-black/20 sm:w-[148px]"
                >
                  <div className={cn("relative aspect-[5/7] overflow-hidden border-b-2", style.frame)}>
                    <div className={cn("absolute inset-0 bg-gradient-to-br", style.art)} />
                    <div className="absolute inset-1 rounded bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.85),transparent_24%),radial-gradient(circle_at_70%_38%,rgba(0,0,0,0.22),transparent_28%)]" />
                    {card.imageUrl ? (
                      <Image
                        src={card.imageUrl}
                        alt={card.name}
                        fill
                        sizes="(min-width: 640px) 148px, 132px"
                        className="object-cover"
                      />
                    ) : null}
                    <div className="absolute left-2 top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-black text-zinc-950 shadow">
                      {card.cost ?? "L"}
                    </div>
                    {card.power ? (
                      <div className="absolute right-2 top-2 z-10 rounded bg-white/90 px-1.5 py-0.5 text-[10px] font-black text-zinc-950 shadow">
                        {card.power}
                      </div>
                    ) : null}
                    <div className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-between gap-2 bg-black/82 px-2 py-1.5 text-[11px] font-bold">
                      <span>${(card.price ?? 0).toFixed(2)}</span>
                      <span className="truncate pl-1">{card.code}</span>
                    </div>
                  </div>
                  <div className="space-y-2 p-2.5 text-left">
                    <p className="line-clamp-2 min-h-8 text-xs font-black leading-4 text-zinc-100">
                      {card.name}
                    </p>
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-[11px] text-zinc-400">
                      {card.type} - {card.rarity}
                      </p>
                      <span className="shrink-0 rounded bg-primary px-2 py-1 text-xs font-black text-white shadow-sm">
                        {card.deckQuantity}x
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </article>
  );
}
