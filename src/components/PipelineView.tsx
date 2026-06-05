import { CheckCircle2, Circle } from "lucide-react";

const steps = ["Input", "Graph", "Score", "Filter", "Matching", "Scheduling", "Evaluation", "Visualization"];

type Props = {
  completedSteps: string[];
};

export function PipelineView({ completedSteps }: Props) {
  const completed = new Set(completedSteps);

  return (
    <section className="panel p-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-blue-950">Pipeline Visualization</h2>
        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">{completedSteps.length > 1 ? "Executed" : "Ready"}</span>
      </div>
      <div className="mt-4 grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-2">
        {steps.map((step, index) => {
          const isDone = completed.has(step);
          return (
            <div key={step} className={`min-w-0 rounded-lg border p-3 ${isDone ? "border-amber-300 bg-amber-50 text-blue-950" : "border-blue-100 bg-white text-slate-500"}`}>
              <div className="flex items-center gap-2">
                {isDone ? <CheckCircle2 size={17} className="text-emerald-700" /> : <Circle size={17} />}
                <span className="text-xs font-bold">{index + 1}</span>
              </div>
              <div className="mt-2 truncate text-sm font-semibold" title={step}>{step}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
