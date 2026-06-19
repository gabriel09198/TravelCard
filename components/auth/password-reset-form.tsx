"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getFirebaseErrorMessage } from "@/lib/firebase-errors";
import { sendPasswordReset } from "@/services/firebaseAuthService";

export function PasswordResetForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await sendPasswordReset(email);
      setSuccess("Enviamos um link de redefinicao para o seu e-mail. Confira sua caixa de entrada.");
    } catch (error) {
      setError(
        getFirebaseErrorMessage(
          error,
          "Nao foi possivel enviar o e-mail de redefinicao. Tente novamente."
        )
      );
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
      {error ? <p className="rounded-md bg-red-500/15 p-3 text-sm text-red-200">{error}</p> : null}
      {success ? (
        <p className="rounded-md bg-emerald-500/15 p-3 text-sm text-emerald-200">{success}</p>
      ) : null}
      <Button className="w-full" disabled={loading}>
        <Mail className="h-4 w-4" />
        {loading ? "Enviando..." : "Enviar link de redefinicao"}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Lembrou a senha?{" "}
        <Link href="/login" className="font-medium text-primary">
          Entrar
        </Link>
      </p>
    </form>
  );
}
