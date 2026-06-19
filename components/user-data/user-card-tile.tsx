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
    <article className="overflow-hidden rounded-md border bg-card/90 shadow-lg shadow-black/10">
      <div className="bg-muted/50 p-3">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            width={220}
            height={308}
            className="mx-auto aspect-[5/7] w-full max-w-[150px] rounded-md object-cover"
          />
        ) : (
          <div className="mx-auto flex aspect-[5/7] w-full max-w-[150px] items-center justify-center rounded-md border bg-background/60 p-3 text-center text-xs text-muted-foreground">
            Sem imagem
          </div>
        )}
      </div>
      <div className="space-y-2 p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-bold">{name}</p>
            <p className="text-xs text-muted-foreground">{code}</p>
          </div>
          <span className="shrink-0 rounded bg-primary px-2 py-1 text-xs font-bold text-primary-foreground">
            {quantity}x
          </span>
        </div>
        {detail ? <p className="line-clamp-2 text-xs text-muted-foreground">{detail}</p> : null}
      </div>
    </article>
  );
}
