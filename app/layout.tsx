import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { AuthGuard } from "@/components/auth/auth-guard";
import { AuthProvider } from "@/components/auth/auth-provider";
import { ChatWidget } from "@/components/chat/chat-widget";
import { FirebaseAnalytics } from "@/components/firebase-analytics";
import { PirateBackground } from "@/components/pirate-background";
import { SiteHeader } from "@/components/site-header";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bastardos do One Piece",
  description: "Plataforma para decks, colecao e trocas de One Piece Card Game."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <PirateBackground />
        <AuthProvider>
          <FirebaseAnalytics />
          <div className="app-shell min-h-screen">
            <SiteHeader />
            <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
              <AuthGuard>{children}</AuthGuard>
            </main>
            <ChatWidget />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
