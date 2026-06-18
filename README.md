# OPCG Club

Plataforma web para um grupo de jogadores de One Piece Card Game organizar decks, colecao, lista de desejos, trocas e conversas.

## Stack

- Next.js com App Router
- TypeScript
- Tailwind CSS
- Componentes no estilo shadcn UI
- Prisma com PostgreSQL
- NextAuth planejado para autenticacao

## Como rodar

```bash
npm install
npm run dev
```

Depois abra `http://localhost:3000`.

Para usar banco real, copie `.env.example` para `.env`, configure `DATABASE_URL` e rode:

```bash
npx prisma generate
npx prisma migrate dev
```

## Estrutura

- `app/`: rotas e paginas do App Router.
- `components/`: componentes reutilizaveis de UI e dominio.
- `lib/`: helpers e dados mockados da primeira versao.
- `types/`: tipos TypeScript do dominio.
- `prisma/`: modelo inicial do banco.

## Proximas etapas

1. Conectar cadastro e login com NextAuth.
2. Trocar os mocks em `lib/mock-data.ts` por consultas no Prisma.
3. Criar formularios com validacao para decks, cartas e posts.
4. Implementar filtros reais com estado na URL.
5. Adicionar permissoes para perfil privado/publico.
