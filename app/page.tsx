import Link from "next/link";
import { ArrowRight, MessageSquareText, Search, ShieldCheck } from "lucide-react";

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
          <p className="text-sm font-semibold uppercase tracking-normal text-primary">One Piece Card Game</p>
          <div className="space-y-4">
            <h1 className="max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">
              Bastardos do One Piece
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground">
              Um sistema para sua tripulacao pesquisar cartas, montar decks, controlar colecao,
              combinar trocas e conversar sobre One Piece TCG em um so lugar.
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
        </div>

        <div className="rounded-md border bg-card/80 p-5 shadow-2xl shadow-black/30 backdrop-blur">
          <div className="grid gap-3">
            {["Cartas", "Decks", "Trocas", "Chat"].map((type, index) => (
              <div
                key={type}
                className="flex items-center justify-between rounded-md border bg-background/65 p-4 shadow-sm"
              >
                <div>
                  <p className="text-sm font-semibold">{type}</p>
                  <p className="text-xs text-muted-foreground">Organizacao para jogar com o grupo</p>
                </div>
                <span className="text-2xl font-bold text-primary">{index + 1}</span>
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
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-md bg-secondary">
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
