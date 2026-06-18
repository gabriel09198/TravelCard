import { ArrowLeftRight, Check, ShoppingBag } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { CardStatus } from "@/types/opcg";

const statusMap: Record<CardStatus, { label: string; icon: typeof Check; className: string }> = {
  owned: {
    label: "Tenho",
    icon: Check,
    className: "border-emerald-500/30 bg-emerald-500/15 text-emerald-200"
  },
  wanted: {
    label: "Quero comprar",
    icon: ShoppingBag,
    className: "border-amber-500/30 bg-amber-500/15 text-amber-200"
  },
  forTrade: {
    label: "Quero trocar",
    icon: ArrowLeftRight,
    className: "border-sky-500/30 bg-sky-500/15 text-sky-200"
  }
};

export function CardStatusBadge({ status }: { status: CardStatus }) {
  const item = statusMap[status];
  const Icon = item.icon;

  return (
    <Badge className={item.className}>
      <Icon className="mr-1 h-3 w-3" />
      {item.label}
    </Badge>
  );
}
