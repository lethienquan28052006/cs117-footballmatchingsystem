import { ChevronDown, ChevronUp, Info, X } from "lucide-react";
import { useState } from "react";

type Props = {
  onClose?: () => void;
};

export function OnboardingBanner({ onClose }: Props) {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) return null;

  const toggleExpand = () => setIsOpen(!isOpen);

  return (
    <div className="bg-blue-50 border-b border-blue-200 p-4">
      <div className="max-w-[1540px] mx-auto">
        <div className="flex items-start gap-3">
          <Info className="text-blue-700 flex-shrink-0 mt-0.5" size={20} />
          <div className="flex-grow">
            <h3 className="font-bold text-blue-950 mb-1">What is this problem?</h3>
            <p className="text-sm text-blue-800 leading-relaxed">
              We match football teams of similar skill level to play against each other on available courts and time slots, 
              balancing the venue owner's <strong>profit</strong> against match <strong>fairness</strong> (small skill gap).
            </p>
            
            {isOpen && (
              <div className="mt-3 space-y-2 text-sm text-blue-800 bg-white rounded-lg p-3 border border-blue-100">
                <div>
                  <span className="font-semibold">λ (Lambda, trade-off weight):</span> 
                  <br /> Slide left for higher profit, right for fairer matches. Higher λ penalizes skill mismatches.
                </div>
                <div>
                  <span className="font-semibold">Δmax (Maximum skill gap):</span> 
                  <br /> A hard limit—pairs with gap &gt; Δmax are rejected entirely. Controls match quality.
                </div>
                <div>
                  <span className="font-semibold">fm (Matching fee):</span> 
                  <br /> Fixed fee per match, added to total profit. Represents administrative cost.
                </div>
              </div>
            )}
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={toggleExpand}
              className="p-1 hover:bg-blue-100 rounded-lg transition-colors"
              aria-label={isOpen ? "Collapse" : "Expand"}
            >
              {isOpen ? <ChevronUp size={18} className="text-blue-700" /> : <ChevronDown size={18} className="text-blue-700" />}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-blue-100 rounded-lg transition-colors"
              aria-label="Close"
            >
              <X size={18} className="text-blue-700" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
