import { Anchor } from "lucide-react";

import { PasswordResetForm } from "@/components/auth/password-reset-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PasswordResetPage() {
  return (
    <div className="mx-auto grid min-h-[calc(100vh-10rem)] max-w-5xl items-center gap-6 lg:grid-cols-[1fr_420px]">
      <div className="hidden space-y-4 lg:block">
        <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Anchor className="h-6 w-6" />
        </div>
        <h1 className="text-4xl font-bold leading-tight">Recupere sua senha.</h1>
        <p className="max-w-xl text-lg text-muted-foreground">
          Informe o e-mail da sua conta e enviaremos um link seguro para redefinir a senha.
        </p>
      </div>
      <Card className="w-full overflow-hidden border-2 shadow-xl">
        <CardHeader>
          <CardTitle>Recuperar senha</CardTitle>
          <p className="text-sm text-muted-foreground">
            O link sera enviado pelo Firebase Authentication.
          </p>
        </CardHeader>
        <CardContent>
          <PasswordResetForm />
        </CardContent>
      </Card>
    </div>
  );
}
