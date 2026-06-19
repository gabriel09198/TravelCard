"use client";

import Image from "next/image";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { Layers, Minus, Pencil, Plus, Search, Trash2, X } from "lucide-react";

import { useAuth } from "@/components/auth/auth-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { firebaseAuth } from "@/lib/firebase";
import {
  createUserDeck,
  deleteUserDeck,
  saveUserDeck,
  subscribeUserDecks
} from "@/services/firebaseUserDataService";
import type { OnePieceCard, UserDeck, UserDeckCard } from "@/types/onePieceCard";

const DECK_COLORS = ["Red", "Green", "Blue", "Purple", "Black", "Yellow"] as const;

function PersonalDeckCard({
  deck,
  onEdit,
  onDelete
}: {
  deck: UserDeck;
  onEdit: (deck: UserDeck) => void;
  onDelete: (deck: UserDeck) => void;
}) {
  return (
    <article className="overflow-hidden rounded-md border bg-card shadow-xl shadow-black/20">
      <div className="space-y-4 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h2 className="truncate text-2xl font-black">{deck.name}</h2>
            {deck.description ? (
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{deck.description}</p>
            ) : null}
            <div className="mt-2 flex flex-wrap gap-2">
              {deck.colors?.map((color) => <Badge key={color}>{color}</Badge>)}
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <Badge className="border-0 bg-secondary text-secondary-foreground">
              {deck.cards.reduce((sum, card) => sum + card.quantity, 0)} cartas
            </Badge>
            <Button size="sm" variant="secondary" onClick={() => onEdit(deck)}>
              <Pencil className="h-4 w-4" />
              Editar
            </Button>
            <Button size="sm" variant="outline" onClick={() => onDelete(deck)}>
              <Trash2 className="h-4 w-4" />
              Excluir
            </Button>
          </div>
        </div>

        <div className="max-h-[36rem] overflow-y-auto pr-1">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(128px,1fr))] justify-items-center gap-x-4 gap-y-5 sm:grid-cols-[repeat(auto-fill,minmax(142px,1fr))]">
            {deck.cards.map((card) => (
              <div key={`${deck.id}-${card.cardNumber}`} className="w-full max-w-[158px] text-center">
                <div className="relative aspect-[5/7] overflow-hidden rounded-md border bg-muted/50 shadow-lg shadow-black/25">
                  {card.imageUrl ? (
                    <Image
                      src={card.imageUrl}
                      alt={card.name ?? card.cardNumber}
                      fill
                      sizes="(min-width: 640px) 158px, 44vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center p-2 text-center text-xs text-muted-foreground">
                      Sem imagem
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-black/82 px-2 py-1.5 text-left">
                    <div className="flex items-center justify-between gap-2 text-[11px] font-bold">
                      <span>{card.price ? `$${card.price.toFixed(2)}` : "-"}</span>
                      <span className="truncate">{card.cardNumber}</span>
                    </div>
                    <p className="truncate text-[11px] font-black text-zinc-100">{card.name}</p>
                  </div>
                </div>
                <p className="mt-2 text-center text-base font-black leading-none text-zinc-100">
                  {card.quantity}x
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

function DeckFormModal({
  deck,
  onClose,
  onSaved
}: {
  deck: UserDeck | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { user } = useAuth();
  const [name, setName] = useState(deck?.name ?? "");
  const [description, setDescription] = useState(deck?.description ?? "");
  const [colors, setColors] = useState<string[]>(deck?.colors ?? []);
  const [selectedCards, setSelectedCards] = useState<UserDeckCard[]>(deck?.cards ?? []);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<OnePieceCard[]>([]);
  const [searching, setSearching] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const totalCards = useMemo(
    () => selectedCards.reduce((sum, card) => sum + card.quantity, 0),
    [selectedCards]
  );

  async function searchCards() {
    if (!query.trim()) return;

    setSearching(true);
    setError("");

    try {
      const response = await fetch(`/api/cartas/search?q=${encodeURIComponent(query.trim())}`);

      if (!response.ok) {
        throw new Error("Erro ao buscar cartas");
      }

      const data = (await response.json()) as OnePieceCard[];
      setResults(data);
    } catch (searchError) {
      console.error("Erro ao buscar cartas para o deck:", searchError);
      setError("Nao foi possivel buscar cartas agora.");
    } finally {
      setSearching(false);
    }
  }

  function addCard(card: OnePieceCard) {
    setSelectedCards((current) => {
      const existing = current.find((item) => item.cardNumber === card.code);

      if (existing) {
        return current.map((item) =>
          item.cardNumber === card.code ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      return [
        ...current,
        {
          cardId: card.id,
          name: card.name,
          cardNumber: card.code,
          imageUrl: card.imageUrl ?? undefined,
          quantity: 1,
          price: card.marketPrice
        }
      ];
    });
  }

  function changeQuantity(cardNumber: string, delta: number) {
    setSelectedCards((current) =>
      current.map((card) =>
        card.cardNumber === cardNumber
          ? { ...card, quantity: Math.max(1, card.quantity + delta) }
          : card
      )
    );
  }

  function removeCard(cardNumber: string) {
    setSelectedCards((current) => current.filter((card) => card.cardNumber !== cardNumber));
  }

  function toggleColor(color: string) {
    setColors((current) =>
      current.includes(color) ? current.filter((item) => item !== color) : [...current, color]
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const uid = firebaseAuth.currentUser?.uid ?? user?.uid;
    const trimmedName = name.trim();

    if (!uid) {
      setError("Voce precisa estar logado para salvar um deck.");
      return;
    }

    if (!trimmedName) {
      setError("Informe um nome para o deck.");
      return;
    }

    if (colors.length === 0) {
      setError("Selecione pelo menos uma cor para o deck.");
      return;
    }

    if (selectedCards.length === 0) {
      setError("Adicione pelo menos uma carta ao deck.");
      return;
    }

    if (selectedCards.some((card) => card.quantity <= 0)) {
      setError("Todas as cartas precisam ter quantidade maior que zero.");
      return;
    }

    setSaving(true);
    setError("");

    const payload = {
      name: trimmedName,
      description: description.trim(),
      colors,
      cards: selectedCards
    };

    try {
      if (deck) {
        await saveUserDeck(uid, {
          ...payload,
          id: deck.id,
          userId: uid
        });
      } else {
        await createUserDeck(uid, payload);
      }

      onSaved();
      onClose();
    } catch (saveError) {
      console.error("Erro ao salvar deck em usuarios/{uid}/decks:", saveError);
      setError("Nao foi possivel salvar o deck.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 p-3 backdrop-blur-sm sm:p-4">
      <div className="mx-auto flex max-h-[94vh] w-full max-w-7xl flex-col overflow-hidden rounded-md border bg-card shadow-2xl shadow-black/40">
        <div className="flex items-start justify-between gap-4 border-b p-4">
          <div>
            <h2 className="text-2xl font-black">{deck ? "Editar deck" : "Criar deck"}</h2>
            <p className="text-sm text-muted-foreground">
              Escolha cartas, defina quantidades e salve em usuarios/{user?.uid}/decks.
            </p>
          </div>
          <Button type="button" variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="grid min-h-0 flex-1 gap-4 overflow-y-auto p-4 lg:grid-cols-[380px_1fr]">
          <div className="space-y-4">
            <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Nome do deck" required />
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="min-h-24 w-full rounded-md border bg-background/70 px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="Descricao do deck"
            />
            <div className="rounded-md border bg-background/40 p-3">
              <p className="mb-2 text-sm font-semibold">Cores do deck</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {DECK_COLORS.map((color) => {
                  const selected = colors.includes(color);

                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={() => toggleColor(color)}
                      className={`rounded-md border px-3 py-2 text-sm font-bold transition ${
                        selected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "bg-background/70 text-muted-foreground hover:border-primary hover:text-foreground"
                      }`}
                      aria-pressed={selected}
                    >
                      {color}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-md border bg-background/40 p-3">
              <p className="mb-2 text-sm font-semibold">Buscar cartas</p>
              <div className="flex gap-2">
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Nome ou codigo"
                />
                <Button type="button" onClick={() => void searchCards()} disabled={searching}>
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {error ? <p className="rounded-md bg-red-500/15 p-3 text-sm text-red-200">{error}</p> : null}

            <Button type="submit" className="w-full" disabled={saving}>
              {saving ? "Salvando..." : `Salvar deck (${totalCards} cartas)`}
            </Button>
          </div>

          <div className="grid gap-4 xl:grid-cols-[1fr_340px]">
            <div className="space-y-3">
              <h3 className="font-bold">Resultados</h3>
              <div className="max-h-[34rem] overflow-y-auto pr-1">
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
                  {results.map((card) => (
                    <button
                      key={card.id}
                      type="button"
                      onClick={() => addCard(card)}
                      className="overflow-hidden rounded-md border bg-background/60 text-left transition hover:border-primary"
                    >
                      <div className="relative aspect-[5/7] bg-muted/40">
                        {card.imageUrl ? (
                          <Image src={card.imageUrl} alt={card.name} fill sizes="160px" className="object-cover" />
                        ) : null}
                      </div>
                      <div className="space-y-1 p-2">
                        <p className="truncate text-xs font-bold">{card.name}</p>
                        <p className="text-[11px] text-muted-foreground">{card.code}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-3 rounded-md border bg-background/40 p-3">
              <h3 className="font-bold">Cartas no deck</h3>
              <div className="max-h-[34rem] space-y-2 overflow-y-auto pr-1">
                {selectedCards.length === 0 ? (
                  <p className="rounded-md border p-4 text-center text-sm text-muted-foreground">
                    Nenhuma carta adicionada ainda.
                  </p>
                ) : (
                  selectedCards.map((card) => (
                    <div key={card.cardNumber} className="flex gap-3 rounded-md border bg-card/70 p-2">
                      <div className="relative aspect-[5/7] w-16 shrink-0 overflow-hidden rounded border bg-muted/40">
                        {card.imageUrl ? (
                          <Image src={card.imageUrl} alt={card.name ?? card.cardNumber} fill sizes="64px" className="object-cover" />
                        ) : null}
                      </div>
                      <div className="min-w-0 flex-1 space-y-2">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold">{card.name}</p>
                          <p className="text-xs text-muted-foreground">{card.cardNumber}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button type="button" size="icon" variant="secondary" className="h-8 w-8" onClick={() => changeQuantity(card.cardNumber, -1)}>
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="min-w-8 text-center text-sm font-black">{card.quantity}x</span>
                          <Button type="button" size="icon" variant="secondary" className="h-8 w-8" onClick={() => changeQuantity(card.cardNumber, 1)}>
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button type="button" size="icon" variant="ghost" className="ml-auto h-8 w-8" onClick={() => removeCard(card.cardNumber)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export function PersonalDecks() {
  const { user } = useAuth();
  const [decks, setDecks] = useState<UserDeck[]>([]);
  const [editingDeck, setEditingDeck] = useState<UserDeck | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return undefined;

    setLoading(true);
    return subscribeUserDecks(
      user.uid,
      (items) => {
        setDecks(items);
        setLoading(false);
      },
      () => {
        setError("Nao foi possivel carregar seus decks.");
        setLoading(false);
      }
    );
  }, [user]);

  function openCreateForm() {
    setEditingDeck(null);
    setFormOpen(true);
  }

  function openEditForm(deck: UserDeck) {
    setEditingDeck(deck);
    setFormOpen(true);
  }

  async function handleDelete(deck: UserDeck) {
    if (!user) return;

    const confirmed = window.confirm(`Excluir o deck "${deck.name}"?`);

    if (!confirmed) return;

    await deleteUserDeck(user.uid, deck.id);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold">Meus decks</h1>
          <p className="text-muted-foreground">
            Decks salvos em usuarios/{user?.uid}/decks.
          </p>
        </div>
        <Button onClick={openCreateForm}>
          <Plus className="h-4 w-4" />
          Criar deck
        </Button>
      </div>

      <div className="grid gap-3 rounded-md border bg-card p-3 md:grid-cols-[1fr_180px]">
        <Input placeholder="Buscar deck, leader ou carta" />
        <Input placeholder="Cores" />
      </div>

      {error ? <p className="rounded-md bg-red-500/15 p-3 text-sm text-red-200">{error}</p> : null}

      {!loading && decks.length === 0 ? (
        <div className="rounded-md border bg-card p-8 text-center">
          <Layers className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
          <p className="font-semibold">Voce ainda nao tem decks salvos.</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Crie seu primeiro deck escolhendo as cartas e a quantidade de cada uma.
          </p>
          <Button className="mt-4" onClick={openCreateForm}>
            <Plus className="h-4 w-4" />
            Criar meu primeiro deck
          </Button>
        </div>
      ) : (
        <div className="space-y-5">
          {decks.map((deck) => (
            <PersonalDeckCard
              key={deck.id}
              deck={deck}
              onEdit={openEditForm}
              onDelete={(item) => void handleDelete(item)}
            />
          ))}
        </div>
      )}

      {formOpen ? (
        <DeckFormModal
          deck={editingDeck}
          onClose={() => setFormOpen(false)}
          onSaved={() => setEditingDeck(null)}
        />
      ) : null}
    </div>
  );
}
