import Link from "next/link";
import { Anchor, ArrowRight, Compass, Gem, MessageSquareText, ScrollText, Search, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    title: "Organize sua colecao",
    text: "Marque cartas que voce tem, quer comprar ou pretende trocar com o grupo.",
    icon: Search
  },
  {
    title: "Monte seus decks",
    text: "Cadastre listas pessoais, leaders, cores e acompanhe o que falta para fechar cada deck.",
    icon: ShieldCheck
  },
  {
    title: "Converse com colegas",
    text: "Use a comunidade para comentar estrategias, cartas, trocas e ajustes de listas.",
    icon: MessageSquareText
  }
];

export default function HomePage() {
  return (
    <div className="space-y-10">
      <section className="grid min-h-[calc(100vh-12rem)] items-center gap-8 py-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <p className="pirate-subtitle text-sm">Sistema pirata de cartas e decks</p>
          <div className="space-y-4">
            <h1 className="pirate-title max-w-3xl text-4xl font-black leading-tight sm:text-6xl">
              Bastardos do One Piece
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground">
              Um porto seguro para sua tripulacao pesquisar cartas, montar decks, controlar colecao,
              combinar trocas e conversar sobre TCG como quem divide um mapa do tesouro.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild>
              <Link href="/login">
                Entrar no sistema
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/cadastro">Criar conta</Link>
            </Button>
          </div>
          <div className="grid max-w-2xl gap-3 sm:grid-cols-3">
            {["Colecao protegida", "Decks por usuario", "Chat da tripulacao"].map((item) => (
              <div key={item} className="pirate-parchment rounded-md px-3 py-2 text-sm font-bold text-amber-100">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="pirate-panel rounded-lg p-5">
          <div className="mb-5 flex items-center justify-between border-b border-amber-500/20 pb-4">
            <div>
              <p className="pirate-subtitle text-xs">Mapa de bordo</p>
              <h2 className="pirate-title text-2xl font-black">Sua rota no TCG</h2>
            </div>
            <Compass className="h-10 w-10 text-amber-300" />
          </div>
          <div className="grid gap-3">
            {[
              { type: "Cartas", icon: Anchor },
              { type: "Decks", icon: ScrollText },
              { type: "Trocas", icon: Gem },
              { type: "Chat", icon: MessageSquareText }
            ].map(({ type, icon: Icon }) => (
              <div
                key={type}
                className="bounty-card flex items-center justify-between rounded-md p-4 transition hover:-translate-y-0.5 hover:border-amber-300/55"
              >
                <div>
                  <p className="text-sm font-bold text-amber-100">{type}</p>
                  <p className="text-xs text-muted-foreground">Organizacao para navegar com o grupo</p>
                </div>
                <span className="flex h-9 w-9 items-center justify-center rounded-md border border-amber-500/25 bg-amber-500/10 text-amber-200">
                  <Icon className="h-4 w-4" />
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {features.map((feature) => {
          const Icon = feature.icon;

          return (
            <Card key={feature.title}>
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-md border border-amber-500/25 bg-secondary">
                  <Icon className="h-5 w-5" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{feature.text}</p>
              </CardContent>
            </Card>
          );
        })}
      </section>
    </div>
  );
}
