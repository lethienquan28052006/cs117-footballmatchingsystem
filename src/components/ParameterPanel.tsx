import { Play } from "lucide-react";
import type { Parameters } from "../types";

type Props = {
  parameters: Parameters;
  setParameters: (parameters: Parameters) => void;
  onRun: () => void;
};

export function ParameterPanel({ parameters, setParameters, onRun }: Props) {
  const update = <K extends keyof Parameters>(key: K, value: Parameters[K]) => setParameters({ ...parameters, [key]: value });

  return (
    <section className="panel p-4">
      <h2 className="text-lg font-bold text-blue-950">Optimization Parameters</h2>
      <div className="mt-4 grid gap-4">
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-slate-700">Alpha penalty: {parameters.lambda.toFixed(2)}</span>
          <input type="range" min="0" max="2" step="0.01" value={parameters.lambda} onChange={(event) => update("lambda", Number(event.target.value))} />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-slate-700">Max Skill Gap: {parameters.maxSkillGap.toFixed(1)}</span>
          <input type="range" min="0" max="10" step="0.5" value={parameters.maxSkillGap} onChange={(event) => update("maxSkillGap", Number(event.target.value))} />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-slate-700">Matching Fee per Match</span>
          <input className="rounded-lg border border-blue-200 px-3 py-2" type="number" min="0" step="10000" value={parameters.matchingFee} onChange={(event) => update("matchingFee", Number(event.target.value))} />
        </label>
      </div>
      <div className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-800">
        Profit = Rental Fee + Matching Fee
      </div>
      <div className="mt-2 rounded-lg bg-blue-50 px-3 py-2 text-sm font-bold text-blue-900">
        Score = Profit - Alpha x Skill Gap x 100,000
      </div>
      <div className="mt-5">
        <button className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-800 px-4 py-3 font-black text-white hover:bg-blue-900" onClick={onRun}>
          <Play size={18} /> Run Optimization
        </button>
      </div>
    </section>
  );
}
