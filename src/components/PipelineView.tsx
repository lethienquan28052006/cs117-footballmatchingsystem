import { CheckCircle2, Circle } from "lucide-react";

const steps = ["Start", "Input", "Build Graph", "Calculate Score", "Filter Edges", "Greedy", "Local Search", "Schedule", "Evaluation"];

type Props = {
  completedSteps: string[];
};

export function PipelineView({ completedSteps }: Props) {
  const completed = new Set(completedSteps);

  return (
    <section className="panel p-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-blue-950">Pipeline</h2>
        <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold text-yellow-800">{completedSteps.length ? "Executed" : "Ready"}</span>
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-3 lg:grid-cols-9">
        {steps.map((step, index) => {
          const isDone = completed.has(step);
          return (
            <div key={step} className={`rounded-lg border p-3 ${isDone ? "border-yellow-300 bg-yellow-50 text-blue-950" : "border-blue-100 bg-white text-slate-500"}`}>
              <div className="flex items-center gap-2">
                {isDone ? <CheckCircle2 size={17} className="text-blue-700" /> : <Circle size={17} />}
                <span className="text-xs font-bold">{index + 1}</span>
              </div>
              <div className="mt-2 text-sm font-semibold">{step}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
