import { ArrowLeftRight, Check, ShoppingBag } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { CardStatus } from "@/types/opcg";

const statusMap: Record<CardStatus, { label: string; icon: typeof Check; className: string }> = {
  owned: {
    label: "Tenho",
    icon: Check,
    className: "border-emerald-200 bg-emerald-50 text-emerald-800"
  },
  wanted: {
    label: "Quero comprar",
    icon: ShoppingBag,
    className: "border-amber-200 bg-amber-50 text-amber-800"
  },
  forTrade: {
    label: "Quero trocar",
    icon: ArrowLeftRight,
    className: "border-sky-200 bg-sky-50 text-sky-800"
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
