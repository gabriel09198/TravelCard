import { Filter, Search } from "lucide-react";

import { OpCard } from "@/components/op-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cards } from "@/lib/mock-data";

export default function CollectionPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Minha colecao</h1>
        <p className="text-muted-foreground">
          Busque e organize cartas por nome, tipo, cor, raridade, custo e colecao.
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

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <OpCard key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
}
