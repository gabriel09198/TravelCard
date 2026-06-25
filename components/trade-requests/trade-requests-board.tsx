"use client";

import Image from "next/image";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { FirebaseError } from "firebase/app";
import {
  Check,
  Globe2,
  HandCoins,
  RefreshCw,
  Repeat2,
  Search,
  UserRound
} from "lucide-react";

import { useAuth } from "@/components/auth/auth-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  createTradeRequest,
  subscribeToPublicProfiles,
  subscribeToTradeRequests
} from "@/services/tradeRequestsService";
import type {
  OnePieceCard,
  PublicUserProfile,
  TradeOfferTarget,
  TradeRequest,
  TradeRequestType
} from "@/types/onePieceCard";

function getTradeRequestErrorMessage(error: unknown): string {
  if (error instanceof FirebaseError) {
    if (error.code === "permission-denied") {
      return "O Firebase bloqueou a solicitacao. Publique as regras novas do Firestore para liberar o mercado geral.";
    }

    if (error.code === "unavailable") {
      return "O Firebase esta temporariamente indisponivel. Tente novamente em instantes.";
    }

    return `Nao foi possivel salvar a solicitacao (${error.code}).`;
  }

  return "Nao foi possivel salvar a solicitacao.";
}

export function TradeRequestsBoard() {
  const { user, profile } = useAuth();
  const [requests, setRequests] = useState<TradeRequest[]>([]);
  const [profiles, setProfiles] = useState<PublicUserProfile[]>([]);
  const [requestType, setRequestType] = useState<TradeRequestType>("troca");
  const [offerTarget, setOfferTarget] = useState<TradeOfferTarget>("geral");
  const [cardQuery, setCardQuery] = useState("");
  const [cardResults, setCardResults] = useState<OnePieceCard[]>([]);
  const [selectedCard, setSelectedCard] = useState<OnePieceCard | null>(null);
  const [targetQuery, setTargetQuery] = useState("");
  const [selectedTarget, setSelectedTarget] = useState<PublicUserProfile | null>(null);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [wantedCard, setWantedCard] = useState("");
  const [error, setError] = useState("");
  const [searchingCards, setSearchingCards] = useState(false);
  const [hasSearchedCards, setHasSearchedCards] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      setRequests([]);
      setProfiles([]);
      setError("");
      return undefined;
    }

    const unsubscribeRequests = subscribeToTradeRequests(user.uid, setRequests, (loadError) => {
      setError(getTradeRequestErrorMessage(loadError));
    });
    const unsubscribeProfiles = subscribeToPublicProfiles(user.uid, setProfiles, (loadError) => {
      setError(getTradeRequestErrorMessage(loadError));
    });

    return () => {
      unsubscribeRequests();
      unsubscribeProfiles();
    };
  }, [user]);

  const filteredProfiles = useMemo(() => {
    const normalizedQuery = targetQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return profiles.slice(0, 8);
    }

    return profiles
      .filter(
        (item) =>
          item.name.toLowerCase().includes(normalizedQuery) ||
          item.email.toLowerCase().includes(normalizedQuery)
      )
      .slice(0, 8);
  }, [profiles, targetQuery]);

  async function searchCards() {
    const query = cardQuery.trim();

    if (!query) {
      setCardResults([]);
      setHasSearchedCards(false);
      return;
    }

    setSearchingCards(true);
    setHasSearchedCards(true);
    setError("");

    try {
      const response = await fetch(`/api/cartas/search?q=${encodeURIComponent(query)}`);

      if (!response.ok) {
        throw new Error("Erro ao buscar cartas");
      }

      setCardResults((await response.json()) as OnePieceCard[]);
    } catch {
      setCardResults([]);
      setError("Nao foi possivel buscar cartas agora.");
    } finally {
      setSearchingCards(false);
    }
  }

  function selectCard(card: OnePieceCard) {
    setSelectedCard(card);
    setCardQuery(`${card.name} - ${card.code}`);
    setCardResults([]);
    setHasSearchedCards(false);
  }

  function changeOfferTarget(target: TradeOfferTarget) {
    setOfferTarget(target);

    if (target === "geral") {
      setSelectedTarget(null);
      setTargetQuery("");
    }
  }

  function resetForm() {
    setRequestType("troca");
    setOfferTarget("geral");
    setCardQuery("");
    setCardResults([]);
    setSelectedCard(null);
    setTargetQuery("");
    setSelectedTarget(null);
    setDescription("");
    setPrice("");
    setWantedCard("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user) return;

    if (!selectedCard) {
      setError("Pesquise e selecione uma carta antes de publicar.");
      return;
    }

    if (offerTarget === "usuario" && !selectedTarget) {
      setError("Selecione a pessoa que recebera a solicitacao.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      await createTradeRequest({
        cardId: selectedCard.id,
        cardName: selectedCard.name,
        cardCode: selectedCard.code,
        cardImage: selectedCard.imageUrl ?? undefined,
        cardColor: selectedCard.color,
        cardType: selectedCard.type,
        requestType,
        offerTarget,
        targetUserId: selectedTarget?.id,
        targetUserName: selectedTarget?.name,
        targetUserEmail: selectedTarget?.email,
        description,
        price: requestType === "venda" && price ? Number(price) : null,
        wantedCard: requestType === "troca" ? wantedCard : "",
        createdByUserId: user.uid,
        createdByName: profile?.name ?? user.displayName ?? user.email ?? "Usuario",
        createdByEmail: user.email ?? ""
      });

      resetForm();
    } catch (saveError) {
      console.error("Erro ao publicar solicitacao no Firestore:", saveError);
      setError(getTradeRequestErrorMessage(saveError));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[420px_1fr]">
      <Card className="h-fit">
        <CardHeader>
          <CardTitle className="pirate-title">Nova solicitacao</CardTitle>
          <p className="text-sm text-muted-foreground">
            Escolha uma carta do catalogo e defina quem podera receber sua oferta.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="pirate-subtitle block text-xs">Carta oferecida</label>
              <div className="flex gap-2">
                <Input
                  value={cardQuery}
                  onChange={(event) => {
                    setCardQuery(event.target.value);
                    setSelectedCard(null);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      void searchCards();
                    }
                  }}
                  placeholder="Pesquise por nome ou codigo"
                  autoComplete="off"
                />
                <Button type="button" size="icon" onClick={() => void searchCards()} disabled={searchingCards}>
                  <Search className="h-4 w-4" />
                </Button>
              </div>

              {searchingCards ? (
                <p className="rounded-md border border-amber-500/20 p-3 text-sm text-muted-foreground">
                  Buscando cartas...
                </p>
              ) : cardResults.length > 0 ? (
                <div className="pirate-scrollbar max-h-64 space-y-1 overflow-y-auto rounded-md border border-amber-500/30 bg-slate-950/95 p-2">
                  {cardResults.map((card) => (
                    <button
                      key={card.id}
                      type="button"
                      onClick={() => selectCard(card)}
                      className="flex w-full items-center gap-3 rounded-md border border-transparent p-2 text-left transition hover:border-amber-400/40 hover:bg-amber-500/10"
                    >
                      <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded border bg-muted">
                        {card.imageUrl ? (
                          <Image src={card.imageUrl} alt={card.name} fill sizes="48px" className="object-cover" />
                        ) : null}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold">{card.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {card.code} · {card.color} · {card.type}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : hasSearchedCards ? (
                <p className="rounded-md border border-amber-500/20 p-3 text-sm text-muted-foreground">
                  Nenhuma carta encontrada.
                </p>
              ) : null}

              {selectedCard ? (
                <div className="pirate-parchment flex items-center gap-3 rounded-md p-3">
                  <div className="relative h-20 w-14 shrink-0 overflow-hidden rounded border bg-muted">
                    {selectedCard.imageUrl ? (
                      <Image
                        src={selectedCard.imageUrl}
                        alt={selectedCard.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-300" />
                      <p className="truncate text-sm font-bold">{selectedCard.name}</p>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {selectedCard.code} · {selectedCard.color} · {selectedCard.type}
                    </p>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={requestType === "troca" ? "default" : "outline"}
                onClick={() => setRequestType("troca")}
              >
                <Repeat2 className="h-4 w-4" />
                Troca
              </Button>
              <Button
                type="button"
                variant={requestType === "venda" ? "default" : "outline"}
                onClick={() => setRequestType("venda")}
              >
                <HandCoins className="h-4 w-4" />
                Venda
              </Button>
            </div>

            <div className="space-y-2">
              <label className="pirate-subtitle block text-xs">Oferecer para</label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={offerTarget === "geral" ? "secondary" : "outline"}
                  onClick={() => changeOfferTarget("geral")}
                >
                  <Globe2 className="h-4 w-4" />
                  Geral
                </Button>
                <Button
                  type="button"
                  variant={offerTarget === "usuario" ? "secondary" : "outline"}
                  onClick={() => changeOfferTarget("usuario")}
                >
                  <UserRound className="h-4 w-4" />
                  Pessoa
                </Button>
              </div>
            </div>

            {offerTarget === "usuario" ? (
              <div className="space-y-2">
                <Input
                  value={targetQuery}
                  onChange={(event) => {
                    setTargetQuery(event.target.value);
                    setSelectedTarget(null);
                  }}
                  placeholder="Pesquisar usuario por nome ou email"
                  autoComplete="off"
                />
                {!selectedTarget ? (
                  <div className="pirate-scrollbar max-h-52 space-y-1 overflow-y-auto rounded-md border border-amber-500/30 bg-slate-950/95 p-2">
                    {filteredProfiles.length > 0 ? (
                      filteredProfiles.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            setSelectedTarget(item);
                            setTargetQuery(`${item.name} - ${item.email}`);
                          }}
                          className="w-full rounded-md border border-transparent p-2 text-left transition hover:border-amber-400/40 hover:bg-amber-500/10"
                        >
                          <p className="text-sm font-bold">{item.name}</p>
                          <p className="text-xs text-muted-foreground">{item.email}</p>
                        </button>
                      ))
                    ) : (
                      <p className="p-3 text-center text-sm text-muted-foreground">
                        Nenhum outro usuario encontrado.
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="pirate-parchment flex items-center gap-3 rounded-md p-3">
                    <Check className="h-4 w-4 text-emerald-300" />
                    <div>
                      <p className="text-sm font-bold">{selectedTarget.name}</p>
                      <p className="text-xs text-muted-foreground">{selectedTarget.email}</p>
                    </div>
                  </div>
                )}
              </div>
            ) : null}

            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="pirate-input min-h-28 px-3 py-2 text-sm placeholder:text-muted-foreground"
              placeholder="Descreva a oferta"
              required
            />

            {requestType === "venda" ? (
              <Input
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                type="number"
                min="0"
                step="0.01"
                placeholder="Valor da venda"
                required
              />
            ) : (
              <Input
                value={wantedCard}
                onChange={(event) => setWantedCard(event.target.value)}
                placeholder="Carta desejada em troca"
              />
            )}

            {error ? <p className="rounded-md bg-red-500/15 p-3 text-sm text-red-200">{error}</p> : null}
            <Button className="w-full" disabled={saving}>
              {saving ? "Salvando..." : "Publicar solicitacao"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {requests.length === 0 ? (
          <Card className="pirate-parchment">
            <CardContent className="flex min-h-52 items-center justify-center text-center text-muted-foreground">
              <div>
                <RefreshCw className="mx-auto mb-3 h-8 w-8" />
                Nenhuma solicitacao disponivel no porto.
              </div>
            </CardContent>
          </Card>
        ) : (
          requests.map((request) => (
            <Card key={request.id} className="bounty-card overflow-hidden">
              <div className="grid sm:grid-cols-[132px_1fr]">
                <div className="relative min-h-44 bg-muted/30">
                  {request.cardImage ? (
                    <Image
                      src={request.cardImage}
                      alt={request.cardName}
                      fill
                      sizes="132px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full min-h-44 items-center justify-center p-3 text-center text-xs text-muted-foreground">
                      Sem imagem
                    </div>
                  )}
                </div>
                <div>
                  <CardHeader>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="mb-2 flex flex-wrap gap-2">
                          <Badge
                            className={
                              request.requestType === "venda"
                                ? "border-amber-500/30 bg-amber-500/15 text-amber-200"
                                : "border-sky-500/30 bg-sky-500/15 text-sky-200"
                            }
                          >
                            {request.requestType === "venda" ? "Venda" : "Troca"}
                          </Badge>
                          <Badge>{request.cardCode}</Badge>
                          <Badge>
                            {request.offerTarget === "geral"
                              ? "Para todos"
                              : `Para ${request.targetUserName ?? "usuario"}`}
                          </Badge>
                        </div>
                        <CardTitle className="pirate-title">{request.cardName}</CardTitle>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {[request.cardColor, request.cardType].filter(Boolean).join(" · ")}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {request.createdAt.toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm leading-6 text-muted-foreground">{request.description}</p>
                    {request.requestType === "venda" && request.price != null ? (
                      <p className="text-sm font-semibold">Valor: R$ {request.price.toFixed(2)}</p>
                    ) : null}
                    {request.requestType === "troca" && request.wantedCard ? (
                      <p className="text-sm font-semibold">Procura: {request.wantedCard}</p>
                    ) : null}
                    <p className="text-xs text-muted-foreground">
                      Criado por {request.createdByName} ({request.createdByEmail})
                    </p>
                    {request.offerTarget === "usuario" && request.targetUserEmail ? (
                      <p className="text-xs text-amber-200/80">
                        Destinado a {request.targetUserName} ({request.targetUserEmail})
                      </p>
                    ) : null}
                  </CardContent>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
