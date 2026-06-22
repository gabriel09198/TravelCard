import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import type { OnePieceCard } from "@/types/onePieceCard";

const colorClassByName: Record<string, string> = {
  Red: "border-red-500/30 bg-red-500/15 text-red-200",
  Green: "border-emerald-500/30 bg-emerald-500/15 text-emerald-200",
  Blue: "border-sky-500/30 bg-sky-500/15 text-sky-200",
  Purple: "border-violet-500/30 bg-violet-500/15 text-violet-200",
  Black: "border-zinc-500/30 bg-zinc-500/20 text-zinc-200",
  Yellow: "border-yellow-500/30 bg-yellow-500/15 text-yellow-200"
};

export function OnePieceCardItem({ card }: { card: OnePieceCard }) {
  return (
    <article className="bounty-card grid overflow-hidden rounded-lg transition-all hover:-translate-y-1 hover:border-amber-300/60 hover:shadow-amber-950/25 sm:grid-cols-[184px_1fr]">
      <div className="flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-yellow-950/35 p-4">
        {card.imageUrl ? (
          <Image
            src={card.imageUrl}
            alt={card.name}
            width={300}
            height={420}
            className="aspect-[5/7] w-full max-w-[164px] rounded-md border border-amber-400/35 object-cover shadow-lg shadow-black/40"
            loading="lazy"
          />
        ) : (
          <div className="flex aspect-[5/7] w-full max-w-[164px] items-center justify-center rounded-md border border-amber-500/25 bg-background/80 p-3 text-center text-sm font-semibold text-muted-foreground">
            Sem imagem
          </div>
        )}
      </div>

      <div className="min-w-0 space-y-3 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-normal text-muted-foreground">
              {card.code} - {card.setName}
            </p>
            <h2 className="pirate-title mt-1 text-xl font-black leading-tight">{card.name}</h2>
          </div>
          <div className="flex flex-wrap gap-2 sm:justify-end">
            <Badge className={colorClassByName[card.color] ?? "bg-secondary"}>
              {card.color}
            </Badge>
            <Badge>{card.rarity}</Badge>
          </div>
        </div>

        <div className="grid gap-2 text-sm sm:grid-cols-4">
          <div>
            <p className="text-xs text-muted-foreground">Tipo</p>
            <p className="font-semibold">{card.type}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Custo</p>
            <p className="font-semibold">{card.cost ?? "-"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Poder</p>
            <p className="font-semibold">{card.power ?? "-"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Counter</p>
            <p className="font-semibold">{card.counter ?? "-"}</p>
          </div>
        </div>

        <p className="text-sm leading-6 text-muted-foreground">{card.effect}</p>

        {card.subTypes.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {card.subTypes.slice(0, 6).map((subType) => (
              <Badge key={subType} className="border-amber-500/25 bg-background/80 text-muted-foreground">
                {subType}
              </Badge>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}
