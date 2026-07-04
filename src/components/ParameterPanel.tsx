import { Play, HelpCircle } from "lucide-react";
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
      <h2 className="text-lg font-bold text-blue-950">Optimization Parameters (Θ)</h2>
      <div className="mt-4 grid gap-4">
        <label className="grid gap-2 group">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-700">λ (Trade-off weight): {parameters.lambda.toFixed(2)}</span>
            <div className="cursor-help" title="Low λ favors profit; high λ favors fairness (small skill gaps)">
              <HelpCircle size={14} className="text-slate-400" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Profit ←</span>
            <span className="flex-1"></span>
            <span>→ Fairness</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="2" 
            step="0.01" 
            value={parameters.lambda} 
            onChange={(event) => update("lambda", Number(event.target.value))}
            className="accent-blue-800"
          />
        </label>

        <label className="grid gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-700">Δmax (Max skill gap): {parameters.maxSkillGap.toFixed(1)}</span>
            <div className="cursor-help" title="Hard constraint: reject pairs with skill gap > Δmax. Controls match fairness.">
              <HelpCircle size={14} className="text-slate-400" />
            </div>
          </div>
          <input 
            type="range" 
            min="0" 
            max="10" 
            step="0.5" 
            value={parameters.maxSkillGap} 
            onChange={(event) => update("maxSkillGap", Number(event.target.value))}
            className="accent-blue-800"
          />
        </label>

        <label className="grid gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-700">fm (Matching fee)</span>
            <div className="cursor-help" title="Fixed fee per match added to total profit. Represents administrative cost.">
              <HelpCircle size={14} className="text-slate-400" />
            </div>
          </div>
          <input 
            className="rounded-lg border border-blue-200 px-3 py-2 text-sm" 
            type="number" 
            min="0" 
            step="10000" 
            value={parameters.matchingFee} 
            onChange={(event) => update("matchingFee", Number(event.target.value))}
          />
        </label>
      </div>

      <div className="mt-4 space-y-2">
        <div className="rounded-lg bg-blue-50 border border-blue-100 px-3 py-2 text-xs font-bold text-blue-900">
          <div className="flex items-start gap-2">
            <HelpCircle size={13} className="flex-shrink-0 mt-0.5" />
            <div>
              <strong>Edge Score Formula:</strong><br />
              score = f(c*,s*) + fm − λ × Δᵢⱼ × 100,000
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <button 
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-800 px-4 py-3 font-black text-white hover:bg-blue-900 active:bg-blue-950 transition-colors" 
          onClick={onRun}
        >
          <Play size={18} /> Run Optimization (SP1–SP5)
        </button>
      </div>
    </section>
  );
}
