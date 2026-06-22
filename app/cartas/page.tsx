import { Suspense } from "react";

import { OnePieceCardItem } from "@/components/cards/OnePieceCardItem";
import { OnePieceCardSearch } from "@/components/cards/OnePieceCardSearch";
import { getOnePieceCards, searchOnePieceCards } from "@/services/onePieceCardsService";

interface CardsPageProps {
  searchParams?: Promise<{
    q?: string;
  }>;
}

export default async function CardsPage({ searchParams }: CardsPageProps) {
  const params = await searchParams;
  const query = params?.q?.trim() ?? "";

  try {
    const cards = query ? await searchOnePieceCards(query) : await getOnePieceCards();
    const visibleCards = query ? cards.slice(0, 120) : cards.slice(0, 60);

    return (
      <div className="space-y-5">
        <div className="pirate-parchment flex flex-col gap-2 rounded-lg p-5">
          <p className="pirate-subtitle text-sm">Arquivo de cartas</p>
          <h1 className="pirate-title text-3xl font-black">Cartas</h1>
          <p className="max-w-3xl text-muted-foreground">
            Pesquise cartas por nome ou codigo e veja efeito, custo, poder,
            raridade e imagem direto da OPTCG API.
          </p>
        </div>

        <Suspense>
          <OnePieceCardSearch />
        </Suspense>

        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            {query
              ? `${cards.length} resultado(s) para "${query}"`
              : `${cards.length} carta(s) carregadas da API`}
          </p>
          <p className="text-sm text-muted-foreground">
            Exibindo {visibleCards.length} carta(s)
          </p>
        </div>

        {visibleCards.length > 0 ? (
          <div className="grid gap-4">
            {visibleCards.map((card) => (
              <OnePieceCardItem key={card.id} card={card} />
            ))}
          </div>
        ) : (
          <div className="pirate-parchment rounded-md p-8 text-center text-muted-foreground">
            Nenhuma carta encontrada para essa busca.
          </div>
        )}
      </div>
    );
  } catch {
    return (
      <div className="space-y-5">
        <div>
          <h1 className="pirate-title text-3xl font-black">Cartas</h1>
          <p className="text-muted-foreground">Nao foi possivel carregar as cartas agora.</p>
        </div>
        <Suspense>
          <OnePieceCardSearch />
        </Suspense>
        <div className="rounded-md border border-red-500/30 bg-red-500/15 p-6 text-red-200">
          A OPTCG API nao respondeu como esperado. Tente novamente em alguns instantes.
        </div>
      </div>
    );
  }
}
