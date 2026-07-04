import { Banknote, Clock, Gauge, Goal, Percent, Shield, Sigma, HelpCircle } from "lucide-react";
import type { Metrics } from "../types";
import { formatPercent, formatVnd } from "../utils/format";
import { PROFIT_TARGET_PER_MATCH, AVG_SKILL_GAP_TARGET } from "../algorithms/constants";

type Props = {
  metrics?: Metrics;
};

type Card = {
  label: string;
  value: string;
  icon: React.ComponentType<{ size: number }>;
  tooltip?: string;
  pass?: boolean;
};

export function MetricsCards({ metrics }: Props) {
  const profitPerMatch = metrics && metrics.totalMatches ? metrics.totalProfit / metrics.totalMatches : 0;
  const profitPass = profitPerMatch >= PROFIT_TARGET_PER_MATCH;
  const skillGapPass = metrics && metrics.avgSkillGap <= AVG_SKILL_GAP_TARGET;

  const cards: Card[] = [
    { 
      label: "Total Profit", 
      value: metrics ? formatVnd(metrics.totalProfit) : "-", 
      icon: Banknote,
      tooltip: "Sum of net profit + matching fee across all matches"
    },
    { 
      label: "Avg Skill Gap", 
      value: metrics ? metrics.avgSkillGap.toFixed(2) : "-", 
      icon: Shield,
      tooltip: `Target ≤ ${AVG_SKILL_GAP_TARGET} for fair matches`,
      pass: skillGapPass
    },
    { 
      label: "Match Rate", 
      value: metrics ? formatPercent(metrics.matchRate) : "-", 
      icon: Percent,
      tooltip: "Percentage of teams successfully matched"
    },
    { 
      label: "Court Util.", 
      value: metrics ? formatPercent(metrics.courtUtilization) : "-", 
      icon: Gauge,
      tooltip: "Fraction of available court-slots used"
    },
    { 
      label: "Runtime", 
      value: metrics ? `${metrics.runtimeMs.toFixed(2)} ms` : "-", 
      icon: Clock,
      tooltip: "Pipeline execution time (SP1–SP5)"
    },
    { 
      label: "Total Matches", 
      value: metrics ? metrics.totalMatches.toString() : "-", 
      icon: Goal,
      tooltip: "Number of scheduled matches"
    },
  ];

  return (
    <section className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-3">
      {cards.map((card) => {
        const Icon = card.icon;
        const showBadge = card.pass !== undefined;
        
        return (
          <div key={card.label} className="panel min-w-0 p-4 relative group">
            <div className="flex items-start justify-between mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-900">
                <Icon size={20} />
              </div>
              {showBadge && (
                <div className={`px-2 py-1 rounded text-xs font-bold whitespace-nowrap ${
                  card.pass ? "bg-emerald-100 text-emerald-800" : "bg-orange-100 text-orange-800"
                }`}>
                  {card.pass ? "✓ Pass" : "⚠ Gap"}
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-1">
              <p className="text-xs font-bold uppercase text-slate-500 flex-1">{card.label}</p>
              {card.tooltip && (
                <div className="cursor-help" title={card.tooltip}>
                  <HelpCircle size={14} className="text-slate-400" />
                </div>
              )}
            </div>
            <p className="mt-2 truncate text-lg font-black text-blue-950" title={card.value}>{card.value}</p>
          </div>
        );
      })}
    </section>
  );
}
