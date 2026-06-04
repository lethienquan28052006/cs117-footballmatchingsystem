import { Banknote, Clock, Gauge, Goal, Percent, Shield } from "lucide-react";
import type { Metrics } from "../types";
import { formatPercent, formatVnd } from "../utils/format";

type Props = {
  metrics?: Metrics;
};

export function MetricsCards({ metrics }: Props) {
  const cards = [
    { label: "Total Profit", value: metrics ? formatVnd(metrics.totalProfit) : "-", icon: Banknote },
    { label: "Average Skill Gap", value: metrics ? metrics.avgSkillGap.toFixed(2) : "-", icon: Shield },
    { label: "Match Rate", value: metrics ? formatPercent(metrics.matchRate) : "-", icon: Percent },
    { label: "Fill Rate", value: metrics ? formatPercent(metrics.fillRate) : "-", icon: Gauge },
    { label: "Runtime", value: metrics ? `${metrics.runtimeMs.toFixed(2)} ms` : "-", icon: Clock },
    { label: "Total Matches", value: metrics ? metrics.totalMatches.toString() : "-", icon: Goal },
  ];

  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.label} className="panel p-4">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-900">
              <Icon size={20} />
            </div>
            <p className="text-xs font-bold uppercase text-slate-500">{card.label}</p>
            <p className="mt-2 break-words text-xl font-black text-blue-950">{card.value}</p>
          </div>
        );
      })}
    </section>
  );
}
