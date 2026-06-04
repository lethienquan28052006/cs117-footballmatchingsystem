import { Trophy } from "lucide-react";

export function Header() {
  return (
    <header className="overflow-hidden rounded-lg bg-blue-900 text-white shadow-sport">
      <div className="relative px-6 py-8 sm:px-8">
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(90deg,rgba(255,255,255,.25)_1px,transparent_1px),linear-gradient(rgba(255,255,255,.25)_1px,transparent_1px)] [background-size:32px_32px]" />
        <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-yellow-300 px-3 py-1 text-sm font-bold text-blue-950">
              <Trophy size={16} />
              CS117 Computational Thinking Demo
            </div>
            <h1 className="max-w-4xl text-3xl font-black leading-tight sm:text-5xl">Football Matching & Scheduling Optimization</h1>
            <p className="mt-4 max-w-3xl text-base text-blue-50 sm:text-lg">
              Optimize football team matchmaking and field scheduling by balancing profit, fairness, and slot utilization.
            </p>
          </div>
          <div className="grid h-24 w-24 place-items-center rounded-full border-4 border-yellow-300 bg-white shadow-lg">
            <div className="h-14 w-14 rounded-full border-4 border-blue-900 bg-yellow-300 shadow-inner" />
          </div>
        </div>
      </div>
    </header>
  );
}
