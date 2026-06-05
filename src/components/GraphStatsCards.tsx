import { GitBranch, Network, Share2, Users } from "lucide-react";
import type { GraphStats } from "../types";

type Props = {
  stats?: GraphStats;
};

export function GraphStatsCards({ stats }: Props) {
  const cards = [
    { label: "Vertices", value: stats ? stats.vertices.toString() : "-", icon: Users },
    { label: "Edges", value: stats ? stats.edges.toString() : "-", icon: GitBranch },
    { label: "Average Degree", value: stats ? stats.averageDegree.toFixed(2) : "-", icon: Network },
    { label: "Feasible Match Count", value: stats ? stats.feasibleMatchCount.toString() : "-", icon: Share2 },
  ];

  return (
    <section className="grid grid-cols-[repeat(auto-fit,minmax(210px,1fr))] gap-3">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.label} className="panel min-w-0 p-4">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-900">
              <Icon size={18} />
            </div>
            <p className="min-h-8 text-xs font-bold uppercase leading-4 text-slate-500">{card.label}</p>
            <p className="mt-2 text-2xl font-black text-blue-950">{card.value}</p>
          </div>
        );
      })}
    </section>
  );
}
