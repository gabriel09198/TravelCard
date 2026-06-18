import { MessageSquarePlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { posts } from "@/lib/mock-data";

export default function CommunityPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold">Comunidade</h1>
          <p className="text-muted-foreground">Comente sobre cartas, decks, estrategias e trocas.</p>
        </div>
        <Button>
          <MessageSquarePlus className="h-4 w-4" />
          Novo topico
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Criar conversa</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          <Input placeholder="Titulo do topico" />
          <Input placeholder="Categoria: deck, carta, estrategia ou troca" />
          <textarea
            className="min-h-28 rounded-md border bg-background/70 px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="Escreva sua pergunta ou comentario"
          />
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {posts.map((post) => (
          <Card key={post.id}>
            <CardHeader>
              <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                <div>
                  <CardTitle className="text-lg">{post.topic}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {post.author} · {post.createdAt}
                  </p>
                </div>
                <span className="w-fit rounded-sm border px-2 py-1 text-xs font-medium">{post.tag}</span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{post.body}</p>
              <p className="mt-3 text-sm font-medium">{post.replies} respostas</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
