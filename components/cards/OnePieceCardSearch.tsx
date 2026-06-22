"use client";

import { FormEvent, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function OnePieceCardSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const params = new URLSearchParams(searchParams.toString());

    if (query.trim()) {
      params.set("q", query.trim());
    } else {
      params.delete("q");
    }

    startTransition(() => {
      router.replace(`/cartas?${params.toString()}`);
    });
  }

  function clearSearch() {
    setQuery("");
    startTransition(() => {
      router.replace("/cartas");
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="pirate-panel grid gap-2 rounded-lg p-3 sm:grid-cols-[1fr_auto_auto]"
    >
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="pl-9"
          placeholder="Pesquisar por nome ou codigo, ex: Luffy ou OP01-001"
        />
      </div>
      <Button type="submit" disabled={isPending}>
        <Search className="h-4 w-4" />
        {isPending ? "Buscando..." : "Buscar"}
      </Button>
      <Button type="button" variant="secondary" onClick={clearSearch} disabled={isPending}>
        <X className="h-4 w-4" />
        Limpar
      </Button>
    </form>
  );
}
