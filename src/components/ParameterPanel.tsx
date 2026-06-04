import { Play } from "lucide-react";
import type { Parameters } from "../types";

type Props = {
  parameters: Parameters;
  setParameters: (parameters: Parameters) => void;
  onRun: () => void;
  onPareto: () => void;
};

export function ParameterPanel({ parameters, setParameters, onRun, onPareto }: Props) {
  const update = <K extends keyof Parameters>(key: K, value: Parameters[K]) => setParameters({ ...parameters, [key]: value });

  return (
    <section className="panel p-4">
      <h2 className="text-lg font-bold text-blue-950">Parameters</h2>
      <div className="mt-4 grid gap-4">
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-slate-700">Lambda skill penalty: {parameters.lambda.toFixed(2)}</span>
          <input type="range" min="0" max="1" step="0.01" value={parameters.lambda} onChange={(event) => update("lambda", Number(event.target.value))} />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-slate-700">Max Skill Gap</span>
          <input className="rounded-lg border border-blue-200 px-3 py-2" type="number" min="0" max="10" step="0.5" value={parameters.maxSkillGap} onChange={(event) => update("maxSkillGap", Number(event.target.value))} />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-slate-700">Matching Fee per Team</span>
          <input className="rounded-lg border border-blue-200 px-3 py-2" type="number" min="0" step="10000" value={parameters.matchingFee} onChange={(event) => update("matchingFee", Number(event.target.value))} />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-slate-700">Algorithm Mode</span>
          <select className="rounded-lg border border-blue-200 px-3 py-2" value={parameters.algorithmMode} onChange={(event) => update("algorithmMode", event.target.value as Parameters["algorithmMode"])}>
            <option value="greedy">Greedy only</option>
            <option value="local">Greedy + Local Search</option>
          </select>
        </label>
      </div>
      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-800 px-4 py-3 font-black text-white hover:bg-blue-900" onClick={onRun}>
          <Play size={18} /> Run Optimization
        </button>
        <button className="rounded-lg bg-yellow-300 px-4 py-3 font-black text-blue-950 hover:bg-yellow-400" onClick={onPareto}>
          Generate Pareto Curve
        </button>
      </div>
    </section>
  );
}
