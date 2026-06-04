import { CartesianGrid, ComposedChart, LabelList, Legend, Line, ResponsiveContainer, Scatter, Tooltip, XAxis, YAxis } from "recharts";
import type { ParetoPoint } from "../types";
import { formatVnd } from "../utils/format";

type Props = {
  data: ParetoPoint[];
};

export function ParetoChart({ data }: Props) {
  const sorted = [...data].sort((a, b) => a.avgSkillGap - b.avgSkillGap);

  return (
    <section className="panel p-4">
      <h2 className="text-lg font-bold text-blue-950">Pareto Trade-off Curve</h2>
      <div className="mt-4 h-80">
        {sorted.length ? (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={sorted}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="avgSkillGap" name="Average Skill Gap" type="number" domain={["dataMin", "dataMax"]} />
              <YAxis dataKey="totalProfit" name="Total Profit" tickFormatter={(value) => `${Number(value) / 1000000}M`} />
              <Tooltip formatter={(value, name) => (name === "totalProfit" ? formatVnd(Number(value)) : value)} cursor={{ strokeDasharray: "3 3" }} />
              <Legend />
              <Line type="monotone" dataKey="totalProfit" name="Trade-off line" stroke="#ffd23f" strokeWidth={2} dot={false} />
              <Scatter dataKey="totalProfit" name="Lambda scenarios" fill="#123c69">
                <LabelList dataKey="lambda" position="top" formatter={(value: number) => `lambda ${value}`} />
              </Scatter>
            </ComposedChart>
          </ResponsiveContainer>
        ) : (
          <div className="grid h-full place-items-center rounded-lg border border-dashed border-blue-200 text-center text-sm text-slate-500">
            Generate Pareto Curve to visualize profit and fairness trade-off.
          </div>
        )}
      </div>
    </section>
  );
}
