import React from "react";
import { Cpu, CheckCircle2, Award, Zap, BarChart2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ModelsProps {
  onNavigate: (path: string) => void;
}

export const MLModelComparison: React.FC<ModelsProps> = ({ onNavigate }) => {
  const models = [
    { name: "XGBoost Classifier (Current)", roc: "0.96", f1: "0.92", precision: "0.94", recall: "0.91", latency: "14ms", status: "Active Deployed", bg: "border-violet-500/50 bg-violet-950/20" },
    { name: "LightGBM Gradient Boost", roc: "0.94", f1: "0.89", precision: "0.91", recall: "0.88", latency: "9ms", status: "Challenger", bg: "border-white/10 bg-slate-900/60" },
    { name: "Random Forest Ensemble", roc: "0.91", f1: "0.86", precision: "0.88", recall: "0.84", latency: "22ms", status: "Baseline", bg: "border-white/10 bg-slate-900/60" },
    { name: "Deep Code BERT Transformer", roc: "0.95", f1: "0.93", precision: "0.92", recall: "0.94", latency: "180ms", status: "High Latency", bg: "border-white/10 bg-slate-900/60" },
  ];

  return (
    <div className="p-6 md:p-8 space-y-8 animate-fade-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs mb-1">
            <Cpu className="h-4 w-4" /> Machine Learning Model Evaluation Matrix
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">ML Model Performance Comparison</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Trained on 40,000 historical commits across GitHub, GitLab & Bitbucket repos.</p>
        </div>

        <Button className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs gap-2">
          <Zap className="h-4 w-4" /> Retrain All Models
        </Button>
      </div>

      {/* Model Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {models.map((m, idx) => (
          <div key={idx} className={`glass rounded-2xl p-5 border ${m.bg} flex flex-col justify-between space-y-4`}>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                  m.status.includes("Active") ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-slate-800 text-slate-300"
                }`}>
                  {m.status}
                </span>
                <span className="text-[10px] text-muted-foreground font-mono">{m.latency}</span>
              </div>
              <h3 className="text-sm font-bold text-white">{m.name}</h3>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center font-mono">
              <div className="p-2 rounded-lg bg-slate-950/60 border border-white/5">
                <div className="text-[10px] text-muted-foreground">ROC-AUC</div>
                <div className="text-base font-bold text-violet-400">{m.roc}</div>
              </div>
              <div className="p-2 rounded-lg bg-slate-950/60 border border-white/5">
                <div className="text-[10px] text-muted-foreground">F1 Score</div>
                <div className="text-base font-bold text-indigo-400">{m.f1}</div>
              </div>
              <div className="p-2 rounded-lg bg-slate-950/60 border border-white/5">
                <div className="text-[10px] text-muted-foreground">Precision</div>
                <div className="text-base font-bold text-emerald-400">{m.precision}</div>
              </div>
              <div className="p-2 rounded-lg bg-slate-950/60 border border-white/5">
                <div className="text-[10px] text-muted-foreground">Recall</div>
                <div className="text-base font-bold text-amber-400">{m.recall}</div>
              </div>
            </div>

            <Button size="sm" variant={m.status.includes("Active") ? "default" : "outline"} className="w-full text-xs">
              {m.status.includes("Active") ? "Currently Serving" : "Select as Primary"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
