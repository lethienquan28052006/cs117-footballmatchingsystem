import { Database, Shuffle } from "lucide-react";
import { scenarioLabels, scenarioParameters } from "../algorithms/scenarioGenerator";
import type { InputConfig, Parameters, ScenarioName } from "../types";

type Props = {
  config: InputConfig;
  setConfig: (config: InputConfig) => void;
  setParameters: (parameters: Parameters) => void;
  parameters: Parameters;
  onGenerate: () => void;
};

const teamOptions = [20, 40, 60, 80, 100] as const;
const courtOptions = [2, 3, 4, 5] as const;
const scenarioOptions = Object.keys(scenarioLabels) as ScenarioName[];

export function InputConfigPanel({ config, setConfig, parameters, setParameters, onGenerate }: Props) {
  const update = <K extends keyof InputConfig>(key: K, value: InputConfig[K]) => {
    const next = { ...config, [key]: value };
    setConfig(next);
    if (key === "scenario") {
      setParameters({ ...parameters, ...scenarioParameters(value as ScenarioName) });
    }
  };

  return (
    <section className="panel p-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-blue-950">Input Configuration</h2>
        <Database size={20} className="text-emerald-700" />
      </div>
      <div className="mt-4 grid grid-cols-[repeat(auto-fit,minmax(170px,1fr))] gap-4">
        <label className="grid min-w-0 gap-2">
          <span className="text-sm font-semibold text-slate-700">Number of teams</span>
          <select className="w-full min-w-0 rounded-lg border border-blue-200 px-3 py-2" value={config.teamCount} onChange={(event) => update("teamCount", Number(event.target.value) as InputConfig["teamCount"])}>
            {teamOptions.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
        <label className="grid min-w-0 gap-2">
          <span className="text-sm font-semibold text-slate-700">Number of courts</span>
          <select className="w-full min-w-0 rounded-lg border border-blue-200 px-3 py-2" value={config.courtCount} onChange={(event) => update("courtCount", Number(event.target.value) as InputConfig["courtCount"])}>
            {courtOptions.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
        <label className="grid min-w-0 gap-2">
          <span className="text-sm font-semibold text-slate-700">Scheduling period</span>
          <select className="w-full min-w-0 rounded-lg border border-blue-200 px-3 py-2" value={config.period} onChange={(event) => update("period", event.target.value as InputConfig["period"])}>
            <option value="day">One Day, 6 slots</option>
            <option value="week">One Week, 42 slots</option>
          </select>
        </label>
        <label className="grid min-w-0 gap-2">
          <span className="text-sm font-semibold text-slate-700">Scenario</span>
          <select className="w-full min-w-0 rounded-lg border border-blue-200 px-3 py-2" value={config.scenario} onChange={(event) => update("scenario", event.target.value as ScenarioName)}>
            {scenarioOptions.map((value) => (
              <option key={value} value={value}>
                {scenarioLabels[value]}
              </option>
            ))}
          </select>
        </label>
      </div>
      <button className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-3 font-black text-white hover:bg-emerald-800" onClick={onGenerate}>
        <Shuffle size={18} /> Generate Dataset
      </button>
    </section>
  );
}
