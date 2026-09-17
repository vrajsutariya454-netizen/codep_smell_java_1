import React, { useState } from "react";
import { History, Play, RotateCcw, Calendar, TrendingUp, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const RiskTimeline: React.FC = () => {
  const [sliderVal, setSliderVal] = useState(60);

  return (
    <div className="p-6 md:p-8 space-y-8 animate-fade-up">
      <div>
        <div className="flex items-center gap-2 text-violet-400 font-mono text-xs mb-1">
          <History className="h-4 w-4" /> Code Smell Time Machine
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Predictive Risk Timeline Slider</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Scrub back in time or simulate future commits up to 90 days out.</p>
      </div>

      <div className="glass rounded-2xl p-8 border border-white/10 space-y-6">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-emerald-400">-60 Days (Historic)</span>
          <span className="text-violet-300 font-bold">Today (v2.4)</span>
          <span className="text-rose-400">+30 Days Forecast</span>
        </div>

        <input 
          type="range" 
          min="0" 
          max="100" 
          value={sliderVal} 
          onChange={(e) => setSliderVal(Number(e.target.value))}
          className="w-full h-3 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-violet-500"
        />

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5">
            <div className="text-[11px] text-muted-foreground">Simulated Commit Date</div>
            <div className="text-base font-bold text-white font-mono mt-1">
              {sliderVal > 60 ? `+${sliderVal - 60} Days Future` : `-${60 - sliderVal} Days Past`}
            </div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5">
            <div className="text-[11px] text-muted-foreground">Predicted Health Index</div>
            <div className="text-base font-bold text-emerald-400 font-mono mt-1">{100 - Math.round(sliderVal * 0.3)} / 100</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5">
            <div className="text-[11px] text-muted-foreground">Projected Bug Probability</div>
            <div className="text-base font-bold text-rose-400 font-mono mt-1">{Math.round(sliderVal * 0.65)}%</div>
          </div>
        </div>
      </div>
    </div>
  );
};
