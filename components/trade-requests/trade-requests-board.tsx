"use client";

import { FormEvent, useEffect, useState } from "react";
import { HandCoins, RefreshCw, Repeat2 } from "lucide-react";

import { useAuth } from "@/components/auth/auth-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  createTradeRequest,
  subscribeToTradeRequests
} from "@/services/tradeRequestsService";
import type { TradeRequest, TradeRequestType } from "@/types/onePieceCard";

export function TradeRequestsBoard() {
  const { user, profile } = useAuth();
  const [requests, setRequests] = useState<TradeRequest[]>([]);
  const [type, setType] = useState<TradeRequestType>("troca");
  const [cardName, setCardName] = useState("");
  const [cardCode, setCardCode] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [wantedCard, setWantedCard] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return subscribeToTradeRequests(setRequests, () => {
      setError("Nao foi possivel carregar as solicitacoes.");
    });
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user) return;

    setLoading(true);
    setError("");

    try {
      await createTradeRequest({
        cardName,
        cardCode,
        type,
        description,
        price: type === "venda" && price ? Number(price) : null,
        wantedCard: type === "troca" ? wantedCard : "",
        userId: user.uid,
        userName: profile?.name ?? user.displayName ?? user.email ?? "Usuario",
        userEmail: user.email ?? ""
      });

      setCardName("");
      setCardCode("");
      setDescription("");
      setPrice("");
      setWantedCard("");
      setType("troca");
    } catch {
      setError("Nao foi possivel salvar a solicitacao.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[380px_1fr]">
      <Card className="h-fit border-2">
        <CardHeader>
          <CardTitle>Nova solicitacao</CardTitle>
          <p className="text-sm text-muted-foreground">
            Cadastre cartas para troca ou venda e deixe o grupo responder.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              value={cardName}
              onChange={(event) => setCardName(event.target.value)}
              placeholder="Nome da carta"
              required
            />
            <Input
              value={cardCode}
              onChange={(event) => setCardCode(event.target.value)}
              placeholder="Codigo ou identificador"
            />
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={type === "troca" ? "default" : "outline"}
                onClick={() => setType("troca")}
              >
                <Repeat2 className="h-4 w-4" />
                Troca
              </Button>
              <Button
                type="button"
                variant={type === "venda" ? "default" : "outline"}
                onClick={() => setType("venda")}
              >
                <HandCoins className="h-4 w-4" />
                Venda
              </Button>
            </div>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="min-h-28 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="Descricao"
              required
            />
            {type === "venda" ? (
              <Input
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                type="number"
                min="0"
                step="0.01"
                placeholder="Valor da venda"
              />
            ) : (
              <Input
                value={wantedCard}
                onChange={(event) => setWantedCard(event.target.value)}
                placeholder="Carta desejada em troca"
              />
            )}
            {error ? <p className="rounded-md bg-red-50 p-3 text-sm text-red-800">{error}</p> : null}
            <Button className="w-full" disabled={loading}>
              {loading ? "Salvando..." : "Publicar solicitacao"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {requests.length === 0 ? (
          <Card>
            <CardContent className="flex min-h-52 items-center justify-center text-center text-muted-foreground">
              <div>
                <RefreshCw className="mx-auto mb-3 h-8 w-8" />
                Nenhuma solicitacao cadastrada ainda.
              </div>
            </CardContent>
          </Card>
        ) : (
          requests.map((request) => (
            <Card key={request.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="mb-2 flex flex-wrap gap-2">
                      <Badge
                        className={
                          request.type === "venda"
                            ? "border-amber-200 bg-amber-50 text-amber-900"
                            : "border-sky-200 bg-sky-50 text-sky-900"
                        }
                      >
                        {request.type === "venda" ? "Venda" : "Troca"}
                      </Badge>
                      {request.cardCode ? <Badge>{request.cardCode}</Badge> : null}
                    </div>
                    <CardTitle>{request.cardName}</CardTitle>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {request.createdAt.toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm leading-6 text-muted-foreground">{request.description}</p>
                {request.type === "venda" && request.price ? (
                  <p className="text-sm font-semibold">Valor: R$ {request.price.toFixed(2)}</p>
                ) : null}
                {request.type === "troca" && request.wantedCard ? (
                  <p className="text-sm font-semibold">Procura: {request.wantedCard}</p>
                ) : null}
                <p className="text-xs text-muted-foreground">
                  Criado por {request.userName} ({request.userEmail})
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
