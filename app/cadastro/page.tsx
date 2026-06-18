import { Anchor } from "lucide-react";

import { RegisterForm } from "@/components/auth/register-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RegisterPage() {
  return (
    <div className="mx-auto grid min-h-[calc(100vh-10rem)] max-w-5xl items-center gap-6 lg:grid-cols-[1fr_440px]">
      <div className="hidden space-y-4 lg:block">
        <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Anchor className="h-6 w-6" />
        </div>
        <h1 className="text-4xl font-bold leading-tight">Sua tripulacao, seus decks, suas cartas.</h1>
        <p className="max-w-xl text-lg text-muted-foreground">
          Crie uma conta para salvar colecao, desejos, solicitacoes e conversas no Firebase.
        </p>
      </div>
      <Card className="w-full overflow-hidden border-2 shadow-xl">
        <CardHeader>
          <CardTitle>Criar conta</CardTitle>
          <p className="text-sm text-muted-foreground">
            Crie seu perfil para cadastrar decks, colecao e lista de desejos.
          </p>
        </CardHeader>
        <CardContent>
          <RegisterForm />
        </CardContent>
      </Card>
    </div>
  );
}
