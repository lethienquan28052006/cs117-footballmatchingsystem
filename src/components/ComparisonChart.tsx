import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { ComparisonRow } from "../types";
import { formatVnd } from "../utils/format";

type Props = {
  data: ComparisonRow[];
};

export function ComparisonChart({ data }: Props) {
  return (
    <section className="panel p-4">
      <h2 className="text-lg font-bold text-blue-950">Greedy vs Local Search</h2>
      <div className="mt-4 h-80">
        {data.length ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" tickFormatter={(value) => `${Number(value) / 1000000}M`} />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip formatter={(value, name) => (name === "totalProfit" ? formatVnd(Number(value)) : value)} />
              <Legend />
              <Bar yAxisId="left" dataKey="totalProfit" name="Total Profit" fill="#123c69" radius={[6, 6, 0, 0]} />
              <Bar yAxisId="right" dataKey="avgSkillGap" name="Avg Skill Gap" fill="#ffd23f" radius={[6, 6, 0, 0]} />
              <Bar yAxisId="right" dataKey="totalMatches" name="Total Matches" fill="#2f80ed" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="grid h-full place-items-center rounded-lg border border-dashed border-blue-200 text-sm text-slate-500">Run optimization to compare algorithms.</div>
        )}
      </div>
    </section>
  );
}
