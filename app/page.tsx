import Link from "next/link";
import { Anchor, ArrowRight, MessageSquareText, Search, ShieldCheck } from "lucide-react";

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
          <p className="text-sm font-bold uppercase tracking-normal text-amber-300">Sistema de cartas e decks</p>
          <div className="space-y-4">
            <h1 className="max-w-3xl text-4xl font-black leading-tight text-amber-100 sm:text-5xl">
              Bastardos do One Piece
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground">
              Um porto seguro para sua tripulacao pesquisar cartas, montar decks, controlar colecao,
              combinar trocas e conversar sobre TCG em um so lugar.
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

        <div className="rounded-md border border-amber-500/30 bg-card/85 p-5 shadow-2xl shadow-black/35 backdrop-blur">
          <div className="grid gap-3">
            {["Cartas", "Decks", "Trocas", "Chat"].map((type, index) => (
              <div
                key={type}
                className="flex items-center justify-between rounded-md border border-amber-500/20 bg-background/65 p-4 shadow-sm"
              >
                <div>
                  <p className="text-sm font-bold text-amber-100">{type}</p>
                  <p className="text-xs text-muted-foreground">Organizacao para navegar com o grupo</p>
                </div>
                <span className="flex h-9 w-9 items-center justify-center rounded-md border border-amber-500/25 bg-amber-500/10 text-amber-200">
                  {index === 0 ? <Anchor className="h-4 w-4" /> : index + 1}
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
