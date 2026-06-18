import { BookOpenCheck, Layers, ShoppingBag } from "lucide-react";

import { DeckCard } from "@/components/deck-card";
import { OpCard } from "@/components/op-card";
import { StatCard } from "@/components/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cards, currentUser, decks, posts } from "@/lib/mock-data";

export default function DashboardPage() {
  const wanted = cards.filter((card) => card.status.includes("wanted"));

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">Perfil de {currentUser.handle}</p>
        <h1 className="text-3xl font-bold">Oi, {currentUser.name}</h1>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="Decks" value={currentUser.decks} helper="Listas pessoais" icon={Layers} />
        <StatCard
          label="Cartas possuidas"
          value={currentUser.ownedCards}
          helper="Na sua colecao"
          icon={BookOpenCheck}
        />
        <StatCard
          label="Desejadas"
          value={currentUser.wantedCards}
          helper="Para comprar depois"
          icon={ShoppingBag}
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Decks recentes</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {decks.slice(0, 2).map((deck) => (
              <DeckCard key={deck.id} deck={deck} />
            ))}
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Conversas ativas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="border-b pb-3 last:border-0 last:pb-0">
                <p className="text-sm font-medium">{post.topic}</p>
                <p className="text-xs text-muted-foreground">
                  {post.replies} respostas - {post.createdAt}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Prioridade de compra</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {wanted.map((card) => (
            <OpCard key={card.id} card={card} />
          ))}
        </div>
      </section>
    </div>
  );
}
