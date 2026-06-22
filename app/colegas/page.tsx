import { Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function FriendsPage() {
  return (
    <div className="space-y-6">
      <div className="pirate-parchment rounded-lg p-5">
        <p className="pirate-subtitle text-sm">Aliados do porto</p>
        <h1 className="pirate-title text-3xl font-black">Colegas</h1>
        <p className="text-muted-foreground">
          Area preparada para recursos sociais sem expor decks ou colecoes de outro usuario.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md border border-amber-500/25 bg-secondary text-amber-100">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="pirate-title">Privacidade ativada</CardTitle>
              <p className="text-sm text-muted-foreground">
                Decks, colecao e desejos agora carregam somente do UID autenticado.
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Quando a area social for conectada ao Firebase, cada consulta tambem deve filtrar por
          userId ou usar subcolecoes em users/{`{uid}`}.
        </CardContent>
      </Card>
    </div>
  );
}
