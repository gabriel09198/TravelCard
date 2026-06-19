"use client";

import Link from "next/link";
import { Anchor, Compass, LogIn, LogOut, Menu, UserPlus } from "lucide-react";

import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { logoutUser } from "@/services/firebaseAuthService";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/cartas", label: "Cartas" },
  { href: "/decks", label: "Decks" },
  { href: "/colecao", label: "Colecao" },
  { href: "/desejos", label: "Desejos" },
  { href: "/solicitacoes", label: "Solicitacoes" },
  { href: "/colegas", label: "Colegas" },
  { href: "/comunidade", label: "Comunidade" }
];

export function SiteHeader() {
  const { user, profile } = useAuth();
  const userName = profile?.name ?? user?.displayName ?? user?.email;

  return (
    <header className="sticky top-0 z-30 border-b border-amber-500/25 bg-slate-950/82 shadow-lg shadow-black/25 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-3 font-semibold">
          <span className="flex h-10 w-10 items-center justify-center rounded-md border border-amber-300/35 bg-gradient-to-br from-red-600 to-red-900 text-primary-foreground shadow-lg shadow-red-950/35 transition-transform group-hover:-rotate-6">
            <Anchor className="h-5 w-5" />
          </span>
          <span className="leading-tight">
            <span className="block text-base font-black text-amber-100">Bastardos do One Piece</span>
            <span className="hidden text-[11px] font-semibold uppercase tracking-normal text-amber-400/80 sm:block">
              Decks, cartas e tesouros
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md border border-transparent px-3 py-2 text-sm font-bold text-muted-foreground transition hover:border-amber-500/25 hover:bg-amber-500/10 hover:text-amber-100"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 sm:flex">
          {user ? (
            <>
              <span className="max-w-36 truncate text-sm font-medium text-muted-foreground">
                {userName}
              </span>
              <Button variant="ghost" size="sm" onClick={() => void logoutUser()}>
                <LogOut className="h-4 w-4" />
                Sair
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login" className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  Entrar
                </Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/cadastro" className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Criar conta
                </Link>
              </Button>
            </>
          )}
        </div>

        <Button variant="outline" size="icon" className="lg:hidden" aria-label="Abrir menu">
          <Menu className="h-5 w-5" />
        </Button>
      </div>
      <div className="border-t border-amber-500/20 px-4 py-2 lg:hidden">
        <div className="flex gap-2 overflow-x-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-md border border-amber-500/25 bg-secondary/80 px-3 py-2 text-sm font-bold text-secondary-foreground"
            >
              {item.label}
            </Link>
          ))}
          {user ? (
            <button
              type="button"
              onClick={() => void logoutUser()}
              className="inline-flex whitespace-nowrap rounded-md border border-amber-500/25 bg-secondary/80 px-3 py-2 text-sm font-bold text-secondary-foreground"
            >
              <Compass className="mr-2 h-4 w-4" />
              Sair
            </button>
          ) : (
            <Link
              href="/login"
              className="whitespace-nowrap rounded-md border border-amber-500/25 bg-secondary/80 px-3 py-2 text-sm font-bold text-secondary-foreground"
            >
              Entrar
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
