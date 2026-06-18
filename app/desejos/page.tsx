import { ShoppingBag } from "lucide-react";

import { OpCard } from "@/components/op-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cards } from "@/lib/mock-data";

export default function WishlistPage() {
  const wantedCards = cards.filter((card) => card.status.includes("wanted"));

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold">Cartas desejadas</h1>
          <p className="text-muted-foreground">Liste o que voce quer comprar futuramente.</p>
        </div>
        <Button>
          <ShoppingBag className="h-4 w-4" />
          Adicionar desejo
        </Button>
      </div>

      <div className="rounded-lg border bg-card p-4">
        <Input placeholder="Buscar carta desejada" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {wantedCards.map((card) => (
          <OpCard key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
}
