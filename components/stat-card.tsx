import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  label: string;
  value: string | number;
  helper: string;
  icon: LucideIcon;
}

export function StatCard({ label, value, helper, icon: Icon }: StatCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="flex items-center gap-4 p-5">
        <div className="flex h-11 w-11 items-center justify-center rounded-md border border-amber-400/35 bg-gradient-to-br from-red-600/65 to-amber-700/45 text-amber-100 shadow-md shadow-black/25">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-bold text-muted-foreground">{label}</p>
          <p className="pirate-title text-2xl font-black">{value}</p>
          <p className="text-xs text-muted-foreground">{helper}</p>
        </div>
      </CardContent>
    </Card>
  );
}
