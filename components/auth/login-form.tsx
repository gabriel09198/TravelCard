"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { LogIn } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getFirebaseErrorMessage } from "@/lib/firebase-errors";
import { loginUser } from "@/services/firebaseAuthService";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") ?? "/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await loginUser(email, password);
      router.replace(redirectTo);
    } catch (error) {
      setError(getFirebaseErrorMessage(error, "Nao foi possivel entrar. Confira e-mail e senha."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        type="email"
        placeholder="email@exemplo.com"
        required
      />
      <Input
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        type="password"
        placeholder="Senha"
        minLength={6}
        required
      />
      {error ? <p className="rounded-md bg-red-500/15 p-3 text-sm text-red-200">{error}</p> : null}
      <div className="text-right">
        <Link href="/recuperar-senha" className="text-sm font-medium text-primary">
          Esqueci minha senha
        </Link>
      </div>
      <Button className="w-full" disabled={loading}>
        <LogIn className="h-4 w-4" />
        {loading ? "Entrando..." : "Entrar"}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Ainda nao tem conta?{" "}
        <Link href="/cadastro" className="font-medium text-primary">
          Criar conta
        </Link>
      </p>
    </form>
  );
}
