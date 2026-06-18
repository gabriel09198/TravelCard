"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { Anchor } from "lucide-react";

import { useAuth } from "@/components/auth/auth-provider";

const PUBLIC_ROUTES = new Set(["/", "/login", "/cadastro"]);

export function AuthGuard({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();
  const isPublicRoute = PUBLIC_ROUTES.has(pathname);

  useEffect(() => {
    if (!loading && !user && !isPublicRoute) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isPublicRoute, loading, pathname, router, user]);

  if (loading && !isPublicRoute) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <div className="flex items-center gap-3 rounded-md border bg-card px-4 py-3 text-sm text-muted-foreground shadow-sm">
          <Anchor className="h-5 w-5 animate-pulse text-primary" />
          Carregando sua tripulacao...
        </div>
      </div>
    );
  }

  if (!user && !isPublicRoute) {
    return null;
  }

  return children;
}
