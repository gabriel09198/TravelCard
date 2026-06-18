import { TradeRequestsBoard } from "@/components/trade-requests/trade-requests-board";

export default function TradeRequestsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-normal text-primary">
          Mercado da tripulacao
        </p>
        <h1 className="mt-1 text-3xl font-bold">Solicitacoes de troca e venda</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Publique cartas que voce quer trocar ou vender e acompanhe o que outras pessoas
          da tripulacao estao procurando.
        </p>
      </div>
      <TradeRequestsBoard />
    </div>
  );
}
