import { Plus } from "lucide-react";

import { DeckCard } from "@/components/deck-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { decks } from "@/lib/mock-data";

export default function DecksPage() {
  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold">Meus decks</h1>
          <p className="text-muted-foreground">
            Decklists em formato visual para revisar, copiar e compartilhar.
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4" />
          Novo deck
        </Button>
      </div>

      <div className="grid gap-3 rounded-md border bg-card p-3 md:grid-cols-[1fr_180px_180px]">
        <Input placeholder="Buscar deck, leader ou carta" />
        <Input placeholder="Cores" />
        <Input placeholder="Formato" />
      </div>

      <div className="space-y-5">
        {decks.map((deck) => (
          <DeckCard key={deck.id} deck={deck} />
        ))}
      </div>
    </div>
  );
}
