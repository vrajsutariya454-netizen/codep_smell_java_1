import React from "react";
import { Sparkles, ArrowRight, GitBranch, Cpu, ShieldCheck, Wand2, Flame, BrainCircuit, Network, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LandingProps {
  onNavigate: (path: string) => void;
}

export const LandingPage: React.FC<LandingProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-foreground font-sans selection:bg-violet-500/20 selection:text-violet-300 relative overflow-hidden">
      {/* Top Navbar */}
      <nav className="h-20 border-b border-white/10 px-8 flex items-center justify-between sticky top-0 bg-slate-950/80 backdrop-blur-xl z-50">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-500/25">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-lg text-white tracking-tight">Code Smell Time-Machine</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground font-medium">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#shap" className="hover:text-white transition-colors">SHAP Analytics</a>
          <a href="#models" className="hover:text-white transition-colors">ML Benchmark</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => onNavigate("/auth")} className="text-xs">
            Sign In
          </Button>
          <Button 
            onClick={() => onNavigate("/dashboard")}
            className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-semibold shadow-lg shadow-violet-500/25 hover:scale-105 transition-all"
          >
            Launch Dashboard <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-6 max-w-6xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-mono">
          <Sparkles className="h-3.5 w-3.5 text-violet-400" />
          <span>Next-Gen Developer Intelligence & Bug Prediction</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto">
          Predict Code Smells & Bugs <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-indigo-300 to-rose-400">
            Before You Merge PRs
          </span>
        </h1>

        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Trained on 40,000+ historical commit timelines using XGBoost ML & SHAP Explainability. Stop technical debt before it reaches production.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button 
            size="lg" 
            onClick={() => onNavigate("/auth")}
            className="w-full sm:w-auto h-13 px-8 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-base shadow-xl shadow-violet-600/30 hover:scale-105 transition-all"
          >
            Start 14-Day Free Trial
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            onClick={() => onNavigate("/dashboard")}
            className="w-full sm:w-auto h-13 px-8 rounded-xl border-white/10 text-base"
          >
            Explore Live Demo
          </Button>
        </div>

        {/* Hero Interactive App Mockup Preview */}
        <div className="pt-12">
          <div className="glass rounded-3xl p-4 border border-white/10 shadow-2xl shadow-violet-950/40 relative">
            <div className="h-10 bg-slate-900/90 rounded-t-2xl flex items-center px-4 gap-2 border-b border-white/5">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <div className="mx-auto text-[11px] font-mono text-muted-foreground">app.codesmell.io/dashboard/microsoft-vscode</div>
            </div>

            <div className="p-6 bg-slate-950 rounded-b-2xl grid grid-cols-1 md:grid-cols-3 gap-4 text-left font-mono">
              <div className="p-4 rounded-xl bg-slate-900 border border-white/5 space-y-2">
                <div className="text-[10px] text-muted-foreground uppercase">XGBoost ROC-AUC</div>
                <div className="text-2xl font-bold text-violet-400">0.96</div>
                <div className="text-[10px] text-emerald-400">Optimal Accuracy</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-900 border border-white/5 space-y-2">
                <div className="text-[10px] text-muted-foreground uppercase">Future Risk Index</div>
                <div className="text-2xl font-bold text-rose-400">38%</div>
                <div className="text-[10px] text-rose-400">3 High-risk files flagged</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-900 border border-white/5 space-y-2">
                <div className="text-[10px] text-muted-foreground uppercase">AI Refactor Readiness</div>
                <div className="text-2xl font-bold text-emerald-400">Ready</div>
                <div className="text-[10px] text-muted-foreground">1-Click Auto Patch</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
