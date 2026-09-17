import React from "react";
import { Network, Layers, GitBranch, ShieldAlert, Cpu, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DependencyProps {
  onNavigate: (path: string) => void;
}

export const DependencyGraph: React.FC<DependencyProps> = ({ onNavigate }) => {
  return (
    <div className="p-6 md:p-8 space-y-8 animate-fade-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-violet-400 font-mono text-xs mb-1">
            <Network className="h-4 w-4" /> Architectural Coupling Visualizer
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Codebase Dependency Graph</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Map of cross-module coupling and ripple-effect blast radius.</p>
        </div>

        <Button onClick={() => onNavigate("/refactoring")} className="bg-violet-600 text-xs">
          Decouple via AI Refactoring
        </Button>
      </div>

      {/* Visual Graph Mock Representation */}
      <div className="glass rounded-2xl p-8 border border-white/10 relative min-h-[420px] flex items-center justify-center overflow-hidden bg-slate-950/60">
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: "radial-gradient(#4f46e5 1px, transparent 1px)", backgroundSize: "24px 24px" }} />

        {/* Graph Nodes */}
        <div className="relative w-full max-w-2xl h-80 flex items-center justify-center">
          {/* Central High Risk Node */}
          <div className="absolute z-20 p-5 rounded-2xl bg-rose-950/80 border-2 border-rose-500 shadow-2xl text-center space-y-1 animate-pulse">
            <div className="text-xs font-mono font-bold text-white">PaymentService.ts</div>
            <div className="text-[10px] text-rose-300 font-mono">Hub Risk: 94% • 14 Edges</div>
          </div>

          {/* Connected Dependent Nodes */}
          <div className="absolute top-4 left-8 p-3 rounded-xl bg-slate-900 border border-violet-500/40 text-center">
            <div className="text-xs font-medium text-white">BillingManager.py</div>
            <div className="text-[10px] text-muted-foreground font-mono">Edge: 0.88</div>
          </div>

          <div className="absolute top-4 right-8 p-3 rounded-xl bg-slate-900 border border-violet-500/40 text-center">
            <div className="text-xs font-medium text-white">OrderController.java</div>
            <div className="text-[10px] text-muted-foreground font-mono">Edge: 0.81</div>
          </div>

          <div className="absolute bottom-4 left-12 p-3 rounded-xl bg-slate-900 border border-slate-700 text-center">
            <div className="text-xs font-medium text-white">UserStore.ts</div>
            <div className="text-[10px] text-muted-foreground font-mono">Edge: 0.42</div>
          </div>

          <div className="absolute bottom-4 right-12 p-3 rounded-xl bg-slate-900 border border-slate-700 text-center">
            <div className="text-xs font-medium text-white">AuthMiddleware.go</div>
            <div className="text-[10px] text-muted-foreground font-mono">Edge: 0.65</div>
          </div>
        </div>
      </div>
    </div>
  );
};
