# OPCG Club

Plataforma web para um grupo de jogadores de One Piece Card Game organizar decks, lista de desejos, trocas e conversas.

## Stack

- Next.js com App Router
- TypeScript
- Tailwind CSS
- Componentes no estilo shadcn UI
- Firebase Authentication e Cloud Firestore
- Prisma com PostgreSQL mantido como modelo legado para avaliacao

## Como rodar

```bash
npm install
npm run dev
```

Depois abra `http://localhost:3000`.

O sistema atual usa Firebase. O schema Prisma legado foi mantido por seguranca e deve ser
revisado antes de ser removido. Para utiliza-lo, configure `DATABASE_URL` e rode:

```bash
npx prisma generate
npx prisma migrate dev
```

## Estrutura

- `app/`: rotas e paginas do App Router.
- `components/`: componentes reutilizaveis de UI e dominio.
- `lib/`: helpers e dados mockados da primeira versao.
- `types/`: tipos TypeScript do dominio.
- `prisma/`: modelo legado de banco, mantido para revisao manual.

## Proximas etapas

1. Substituir os exemplos restantes de `lib/mock-data.ts` por dados reais.
2. Criar formularios com validacao para cartas e posts.
3. Adicionar permissoes para perfil privado/publico.
