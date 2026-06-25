import { Anchor } from "lucide-react";
import { Suspense } from "react";

import { LoginForm } from "@/components/auth/login-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <div className="mx-auto grid min-h-[calc(100vh-10rem)] max-w-5xl items-center gap-6 lg:grid-cols-[1fr_420px]">
      <div className="hidden space-y-4 lg:block">
        <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Anchor className="h-6 w-6" />
        </div>
        <h1 className="text-4xl font-bold leading-tight">Bastardos do One Piece</h1>
        <p className="max-w-xl text-lg text-muted-foreground">
          Entre para pesquisar cartas, montar decks e combinar trocas com a tripulacao.
        </p>
      </div>
      <Card className="w-full overflow-hidden border-2 shadow-xl">
        <CardHeader>
          <CardTitle>Entrar</CardTitle>
          <p className="text-sm text-muted-foreground">
            Acesse sua conta com e-mail e senha.
          </p>
        </CardHeader>
        <CardContent>
          <Suspense>
            <LoginForm />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
