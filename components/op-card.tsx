import Image from "next/image";

import { Card as CardShell, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CardStatusBadge } from "@/components/card-status";
import type { Card } from "@/types/opcg";

export function OpCard({ card }: { card: Card }) {
  return (
    <CardShell className="overflow-hidden">
      <div className="bg-muted p-3">
        {card.imageUrl ? (
          <Image
            src={card.imageUrl}
            alt={card.name}
            width={300}
            height={420}
            className="mx-auto aspect-[5/7] w-full max-w-[180px] rounded-md object-cover shadow-sm"
          />
        ) : (
          <div className="mx-auto flex aspect-[5/7] w-full max-w-[180px] items-center justify-center rounded-md border bg-background p-4 text-center text-sm font-semibold text-muted-foreground">
            Sem imagem
          </div>
        )}
      </div>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-medium text-muted-foreground">{card.code}</p>
            <CardTitle className="mt-1 text-base leading-snug">{card.name}</CardTitle>
          </div>
          <span className="shrink-0 rounded-sm bg-accent px-2 py-1 text-xs font-semibold">
            {card.rarity}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Tipo</p>
            <p className="font-medium">{card.type}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Custo</p>
            <p className="font-medium">{card.cost ?? "-"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Cor</p>
            <p className="font-medium">{card.colors.join(", ")}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Qtd.</p>
            <p className="font-medium">{card.quantity}</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{card.collection}</p>
        <div className="flex flex-wrap gap-2">
          {card.status.map((status) => (
            <CardStatusBadge key={status} status={status} />
          ))}
        </div>
      </CardContent>
    </CardShell>
  );
}
