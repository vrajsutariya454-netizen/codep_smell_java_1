import React from "react";
import { BrainCircuit, Info, Sparkles, Sliders, ArrowUpRight, CheckCircle2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShapProps {
  onNavigate: (path: string) => void;
}

export const ShapExplainability: React.FC<ShapProps> = ({ onNavigate }) => {
  return (
    <div className="p-6 md:p-8 space-y-8 animate-fade-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-violet-400 font-mono text-xs mb-1">
            <BrainCircuit className="h-4 w-4" /> Explainable AI (XAI) Telemetry
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">SHAP Feature Attribution Breakdown</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Analyzing exact feature weights pushing <span className="text-rose-400 font-mono font-semibold">PaymentService.ts</span> to 94% risk.</p>
        </div>

        <Button 
          onClick={() => onNavigate("/refactoring")}
          className="bg-violet-600 hover:bg-violet-500 text-white text-xs gap-2 shadow-lg shadow-violet-600/30"
        >
          <Sparkles className="h-4 w-4" /> Auto-Fix via AI Refactoring
        </Button>
      </div>

      {/* Target File Overview Card */}
      <div className="glass rounded-2xl p-6 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="text-xs text-muted-foreground font-mono">Target File</span>
          <h2 className="text-lg font-bold text-white">src/services/payment/PaymentService.ts</h2>
          <p className="text-xs text-muted-foreground">482 lines • 24 functions • Last modified by @alex 2 hours ago</p>
        </div>

        <div className="flex items-center gap-4 bg-slate-900/80 p-4 rounded-xl border border-white/5">
          <div className="text-center px-3 border-r border-white/10">
            <div className="text-[10px] text-muted-foreground uppercase font-mono">Base Probability</div>
            <div className="text-lg font-bold text-white font-mono">0.12</div>
          </div>
          <div className="text-center px-3 border-r border-white/10">
            <div className="text-[10px] text-muted-foreground uppercase font-mono">SHAP Delta</div>
            <div className="text-lg font-bold text-rose-400 font-mono">+0.82</div>
          </div>
          <div className="text-center px-3">
            <div className="text-[10px] text-muted-foreground uppercase font-mono">Final Risk</div>
            <div className="text-lg font-bold text-rose-400 font-mono">0.94 (94%)</div>
          </div>
        </div>
      </div>

      {/* SHAP Waterfall Feature Bar Chart */}
      <div className="glass rounded-2xl p-6 border border-white/10 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Sliders className="h-4 w-4 text-violet-400" /> Feature Value vs SHAP Contribution Bar Plot
          </h3>
          <span className="text-xs text-muted-foreground font-mono">XGBoost TreeExplainer</span>
        </div>

        <div className="space-y-4">
          {[
            { feature: "Code Churn (14d)", value: "1,240 lines changed", impact: "+0.42", percent: 85, type: "negative", desc: "Excessive edits in short period high bug predictor" },
            { feature: "Cyclomatic Complexity", value: "32 (Threshold: 15)", impact: "+0.28", percent: 65, type: "negative", desc: "Nested conditionals increase execution branches" },
            { feature: "Bus Factor (Single Owner)", value: "1 contributor (92% commits)", impact: "+0.15", percent: 45, type: "negative", desc: "Lack of peer review code diversity" },
            { feature: "Coupled Files Count", value: "14 dependent modules", impact: "+0.09", percent: 25, type: "negative", desc: "High architectural coupling ratio" },
            { feature: "Unit Test Coverage", value: "88% branch coverage", impact: "-0.12", percent: 30, type: "positive", desc: "High test coverage decreases risk impact" },
          ].map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-white">{item.feature}</span>
                  <span className="ml-3 text-[11px] font-mono text-muted-foreground">Val: {item.value}</span>
                </div>
                <span className={`text-xs font-mono font-bold ${
                  item.type === "negative" ? "text-rose-400" : "text-emerald-400"
                }`}>
                  {item.impact} SHAP
                </span>
              </div>

              <div className="h-2.5 bg-slate-950 rounded-full overflow-hidden flex">
                <div 
                  className={`h-full rounded-full ${
                    item.type === "negative" 
                      ? "bg-gradient-to-r from-violet-500 to-rose-500" 
                      : "bg-gradient-to-r from-emerald-600 to-emerald-400"
                  }`} 
                  style={{ width: `${item.percent}%` }} 
                />
              </div>
              <div className="text-[11px] text-muted-foreground">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
