import { DeckCard } from "@/components/deck-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { decks, profiles } from "@/lib/mock-data";

export default function FriendsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Decks dos colegas</h1>
        <p className="text-muted-foreground">Veja o que o pessoal esta montando e jogando.</p>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        {profiles.map((profile) => (
          <Card key={profile.id}>
            <CardHeader>
              <CardTitle>{profile.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{profile.handle}</p>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-2 text-center text-sm">
              <div>
                <p className="font-semibold">{profile.decks}</p>
                <p className="text-xs text-muted-foreground">Decks</p>
              </div>
              <div>
                <p className="font-semibold">{profile.ownedCards}</p>
                <p className="text-xs text-muted-foreground">Cartas</p>
              </div>
              <div>
                <p className="font-semibold">{profile.wantedCards}</p>
                <p className="text-xs text-muted-foreground">Desejos</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {decks.map((deck) => (
          <DeckCard key={deck.id} deck={deck} />
        ))}
      </div>
    </div>
  );
}
