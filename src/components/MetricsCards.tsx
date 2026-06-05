import { Banknote, Clock, Gauge, Goal, Percent, Shield, Sigma } from "lucide-react";
import type { Metrics } from "../types";
import { formatPercent, formatVnd } from "../utils/format";

type Props = {
  metrics?: Metrics;
};

export function MetricsCards({ metrics }: Props) {
  const cards = [
    { label: "Total Profit", value: metrics ? formatVnd(metrics.totalProfit) : "-", icon: Banknote },
    { label: "Total Skill Gap", value: metrics ? metrics.totalSkillGap.toFixed(1) : "-", icon: Sigma },
    { label: "Average Skill Gap", value: metrics ? metrics.avgSkillGap.toFixed(2) : "-", icon: Shield },
    { label: "Match Rate", value: metrics ? formatPercent(metrics.matchRate) : "-", icon: Percent },
    { label: "Court Utilization", value: metrics ? formatPercent(metrics.courtUtilization) : "-", icon: Gauge },
    { label: "Runtime", value: metrics ? `${metrics.runtimeMs.toFixed(2)} ms` : "-", icon: Clock },
    { label: "Matches", value: metrics ? metrics.totalMatches.toString() : "-", icon: Goal },
  ];

  return (
    <section className="grid grid-cols-[repeat(auto-fit,minmax(165px,1fr))] gap-3">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.label} className="panel min-w-0 p-4">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-900">
              <Icon size={20} />
            </div>
            <p className="min-h-8 text-xs font-bold uppercase leading-4 text-slate-500">{card.label}</p>
            <p className="mt-2 truncate text-xl font-black text-blue-950" title={card.value}>{card.value}</p>
          </div>
        );
      })}
    </section>
  );
}
