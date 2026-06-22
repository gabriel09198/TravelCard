"use client";

import Image from "next/image";

interface UserCardTileProps {
  name: string;
  code: string;
  imageUrl?: string;
  quantity: number;
  detail?: string;
}

export function UserCardTile({ name, code, imageUrl, quantity, detail }: UserCardTileProps) {
  return (
    <article className="bounty-card overflow-hidden rounded-lg transition-all hover:-translate-y-1 hover:border-amber-300/55">
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-yellow-950/30 p-3">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            width={220}
            height={308}
            className="mx-auto aspect-[5/7] w-full max-w-[150px] rounded-md border border-amber-400/35 object-cover shadow-md shadow-black/35"
          />
        ) : (
          <div className="mx-auto flex aspect-[5/7] w-full max-w-[150px] items-center justify-center rounded-md border border-amber-500/25 bg-background/70 p-3 text-center text-xs text-muted-foreground">
            Sem imagem
          </div>
        )}
      </div>
      <div className="space-y-2 p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-amber-100">{name}</p>
            <p className="text-xs text-muted-foreground">{code}</p>
          </div>
          <span className="shrink-0 rounded border border-amber-300/30 bg-primary px-2 py-1 text-xs font-bold text-primary-foreground">
            {quantity}x
          </span>
        </div>
        {detail ? <p className="line-clamp-2 text-xs text-muted-foreground">{detail}</p> : null}
      </div>
    </article>
  );
}
