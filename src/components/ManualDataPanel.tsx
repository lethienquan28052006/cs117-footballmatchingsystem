import { BadgeDollarSign, MapPinned, UserPlus } from "lucide-react";

type Props = {
  onAddTeam: () => void;
  onAddCourt: () => void;
  onAddFee: () => void;
};

export function ManualDataPanel({ onAddTeam, onAddCourt, onAddFee }: Props) {
  const actions = [
    { label: "Add Team", icon: UserPlus, onClick: onAddTeam },
    { label: "Add Court", icon: MapPinned, onClick: onAddCourt },
    { label: "Add Fee", icon: BadgeDollarSign, onClick: onAddFee },
  ];

  return (
    <section className="panel p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-bold text-blue-950">Manual Data Entry</h2>
          <p className="text-sm text-slate-500">Add teams, courts, or court-slot fees to the active dataset.</p>
        </div>
        <div className="grid gap-2 sm:grid-cols-3">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <button key={action.label} className="inline-flex items-center justify-center gap-2 rounded-lg border border-blue-200 px-4 py-2.5 text-sm font-black text-blue-900 hover:bg-blue-50" onClick={action.onClick}>
                <Icon size={17} /> {action.label}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
