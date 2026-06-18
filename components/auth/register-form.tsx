"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getFirebaseErrorMessage } from "@/lib/firebase-errors";
import { registerUser } from "@/services/firebaseAuthService";

export function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [handle, setHandle] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setWarning("");
    setLoading(true);

    try {
      const result = await registerUser({
        name,
        handle,
        email,
        password
      });

      if (!result.profileSaved) {
        setWarning(
          "Conta criada no Authentication, mas o Firestore bloqueou a criacao do perfil em users. Confira as regras do Firestore."
        );
        return;
      }

      router.replace("/dashboard");
    } catch (error) {
      setError(
        getFirebaseErrorMessage(
          error,
          "Nao foi possivel criar a conta. Verifique os dados e tente novamente."
        )
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Nome"
        required
      />
      <Input
        value={handle}
        onChange={(event) => setHandle(event.target.value)}
        placeholder="@usuario"
      />
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
      {warning ? (
        <p className="rounded-md bg-amber-500/15 p-3 text-sm text-amber-200">{warning}</p>
      ) : null}
      <Button className="w-full" disabled={loading}>
        <UserPlus className="h-4 w-4" />
        {loading ? "Criando..." : "Criar conta"}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Ja tem conta?{" "}
        <Link href="/login" className="font-medium text-primary">
          Entrar
        </Link>
      </p>
    </form>
  );
}
