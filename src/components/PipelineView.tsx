import { CheckCircle2, Circle } from "lucide-react";

type PipelineStep = "SP1" | "SP2" | "SP3" | "SP4" | "SP5";

type Props = {
  activeStep: PipelineStep | null;
  completedSteps: Set<PipelineStep>;
};

const stepLabels: Record<PipelineStep, string> = {
  SP1: "Data Prep",
  SP2: "Build Graph",
  SP3: "Optimization",
  SP4: "Assignment",
  SP5: "Evaluation",
};

export function PipelineView({ activeStep, completedSteps }: Props) {
  const steps: PipelineStep[] = ["SP1", "SP2", "SP3", "SP4", "SP5"];

  return (
    <section className="panel p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Optimization Pipeline (SP1–SP5)</h2>
        {activeStep && <span className="text-xs font-semibold text-blue-700 animate-pulse">Running...</span>}
      </div>
      
      <div className="flex items-center justify-between gap-1 overflow-x-auto md:gap-3">
        {steps.map((step, index) => {
          const isActive = step === activeStep;
          const isCompleted = completedSteps.has(step);

          return (
            <div key={step} className="flex flex-col items-center gap-2 min-w-max">
              <div className="flex items-center gap-1">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full font-bold text-sm transition-all ${
                    isActive
                      ? "animate-pulse bg-blue-600 text-white shadow-lg scale-110"
                      : isCompleted
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {isCompleted ? <CheckCircle2 size={22} /> : <Circle size={18} />}
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-0.5 w-4 md:w-6 transition-colors ${isCompleted || isActive ? "bg-emerald-300" : "bg-slate-200"}`} />
                )}
              </div>
              <div className="text-center">
                <p className="text-xs font-bold text-slate-800">{step}</p>
                <p className="text-xs text-slate-500">{stepLabels[step]}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
