import React, { useState } from "react";
import { GitBranch, Flame, ShieldAlert, FileCode, Search, Filter, AlertTriangle, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeatmapProps {
  onNavigate: (path: string) => void;
}

export const RiskHeatmap: React.FC<HeatmapProps> = ({ onNavigate }) => {
  const [filter, setFilter] = useState("all");

  const files = [
    { name: "PaymentService.ts", path: "src/services/payment/PaymentService.ts", risk: 94, category: "High Risk", churn: "1,240 lines", complexity: 32, smell: "God Class & High Churn" },
    { name: "BillingManager.py", path: "backend/billing/BillingManager.py", risk: 88, category: "High Risk", churn: "980 lines", complexity: 28, smell: "Cyclomatic Complexity" },
    { name: "OrderController.java", path: "app/controllers/OrderController.java", risk: 81, category: "High Risk", churn: "850 lines", complexity: 24, smell: "Feature Envy" },
    { name: "AuthMiddleware.go", path: "pkg/auth/AuthMiddleware.go", risk: 68, category: "Medium Risk", churn: "320 lines", complexity: 16, smell: "Missing Error Handling" },
    { name: "UserStore.ts", path: "src/stores/UserStore.ts", risk: 62, category: "Medium Risk", churn: "410 lines", complexity: 14, smell: "Duplicate Code" },
    { name: "DatabaseConnector.cpp", path: "src/db/DatabaseConnector.cpp", risk: 58, category: "Medium Risk", churn: "290 lines", complexity: 12, smell: "Long Method" },
    { name: "NotificationEngine.rs", path: "crates/notify/engine.rs", risk: 42, category: "Low Risk", churn: "180 lines", complexity: 8, smell: "Minor Smell" },
    { name: "CartUtils.js", path: "src/utils/CartUtils.js", risk: 35, category: "Low Risk", churn: "95 lines", complexity: 6, smell: "Clean" },
    { name: "Logger.py", path: "utils/logger.py", risk: 18, category: "Low Risk", churn: "45 lines", complexity: 3, smell: "Clean" },
    { name: "ConfigLoader.go", path: "config/loader.go", risk: 12, category: "Low Risk", churn: "30 lines", complexity: 2, smell: "Clean" },
    { name: "MetricsCollector.ts", path: "src/telemetry/MetricsCollector.ts", risk: 24, category: "Low Risk", churn: "88 lines", complexity: 5, smell: "Clean" },
    { name: "CacheService.rs", path: "crates/cache/src/lib.rs", risk: 29, category: "Low Risk", churn: "110 lines", complexity: 7, smell: "Clean" },
  ];

  const filteredFiles = files.filter(f => {
    if (filter === "high") return f.risk >= 80;
    if (filter === "medium") return f.risk >= 50 && f.risk < 80;
    if (filter === "low") return f.risk < 50;
    return true;
  });

  return (
    <div className="p-6 md:p-8 space-y-6 animate-fade-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-rose-400 font-mono text-xs mb-1">
            <Flame className="h-4 w-4" /> Predictive Hotspot Matrix
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Codebase Risk Heatmap</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Visualizing file-level vulnerability clusters across 1,420 source files.</p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-xl border border-border">
          {["all", "high", "medium", "low"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono capitalize transition-all ${
                filter === f
                  ? "bg-violet-600 text-white font-semibold shadow-md"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}
            >
              {f} Risk
            </button>
          ))}
        </div>
      </div>

      {/* Heatmap Visual Tile Grid */}
      <div className="glass rounded-2xl p-6 border border-white/10 space-y-4">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <Flame className="h-4 w-4 text-rose-400" /> Hotspot Grid Density (Color Intensity = Risk Score)
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {filteredFiles.map((file, idx) => {
            const isHigh = file.risk >= 80;
            const isMed = file.risk >= 50 && file.risk < 80;
            return (
              <div
                key={idx}
                onClick={() => onNavigate("/shap")}
                className={`p-4 rounded-xl border transition-all cursor-pointer hover:scale-[1.03] flex flex-col justify-between h-32 relative overflow-hidden ${
                  isHigh
                    ? "bg-rose-950/40 border-rose-500/40 hover:border-rose-400 shadow-lg shadow-rose-950/50"
                    : isMed
                    ? "bg-amber-950/30 border-amber-500/30 hover:border-amber-400"
                    : "bg-slate-900/60 border-slate-800 hover:border-slate-600"
                }`}
              >
                {isHigh && (
                  <div className="absolute top-0 right-0 w-12 h-12 bg-rose-500/10 rounded-bl-full pointer-events-none" />
                )}

                <div>
                  <div className="text-xs font-semibold text-white truncate">{file.name}</div>
                  <div className="text-[10px] text-muted-foreground truncate mt-0.5 font-mono">{file.path}</div>
                </div>

                <div className="flex items-end justify-between mt-2">
                  <span className={`text-lg font-bold font-mono ${
                    isHigh ? "text-rose-400" : isMed ? "text-amber-400" : "text-emerald-400"
                  }`}>
                    {file.risk}%
                  </span>
                  <span className="text-[10px] text-muted-foreground font-mono">CC: {file.complexity}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Heatmap Table */}
      <div className="glass rounded-2xl p-6 border border-white/10 space-y-4">
        <h3 className="text-sm font-semibold text-white">File Vulnerability Audit Table</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-white/10 text-muted-foreground uppercase text-[10px]">
                <th className="pb-3 px-3">File Path</th>
                <th className="pb-3 px-3">Risk Score</th>
                <th className="pb-3 px-3">Primary Smell</th>
                <th className="pb-3 px-3">14d Code Churn</th>
                <th className="pb-3 px-3">Complexity</th>
                <th className="pb-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredFiles.map((file, idx) => (
                <tr key={idx} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-3 font-semibold text-white flex items-center gap-2">
                    <FileCode className="h-4 w-4 text-violet-400" />
                    {file.path}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold ${
                      file.risk >= 80 ? "bg-rose-500/20 text-rose-300 border border-rose-500/30" :
                      file.risk >= 50 ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" :
                      "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    }`}>
                      {file.risk}%
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-300">{file.smell}</td>
                  <td className="py-3 px-3 text-muted-foreground">{file.churn}</td>
                  <td className="py-3 px-3 text-muted-foreground">{file.complexity}</td>
                  <td className="py-3 px-3 text-right">
                    <Button 
                      size="sm" 
                      onClick={() => onNavigate("/refactoring")}
                      className="h-7 text-[11px] bg-violet-600/20 hover:bg-violet-600 text-violet-300 hover:text-white border border-violet-500/30"
                    >
                      Refactor AI
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
