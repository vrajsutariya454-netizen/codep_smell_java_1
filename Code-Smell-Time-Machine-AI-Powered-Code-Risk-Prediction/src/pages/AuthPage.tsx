import React from "react";
import { Sparkles, ArrowLeft, GitBranch, Brain, TrendingUp, ShieldCheck, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AuthPageProps {
  onNavigate: (path: string) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-foreground flex relative overflow-hidden font-sans">
      {/* Background glow overlay */}
      <div 
        className="pointer-events-none fixed inset-0 -z-10 opacity-70" 
        style={{ 
          background: "radial-gradient(circle at 20% 30%, rgba(124, 58, 237, 0.18), transparent 50%), radial-gradient(circle at 80% 70%, rgba(79, 70, 229, 0.15), transparent 50%)" 
        }} 
      />

      {/* Left: form */}
      <div className="flex-1 flex flex-col justify-between p-8 lg:p-12 z-10">
        <div className="flex items-center justify-between">
          <button onClick={() => onNavigate("/")} className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-500/25 group-hover:scale-105 transition-transform">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="font-semibold text-sm tracking-tight text-white">Code Smell Time-Machine</span>
          </button>
          <button onClick={() => onNavigate("/")} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </button>
        </div>

        <div className="mx-auto w-full max-w-md animate-fade-up my-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-mono mb-6">
            <ShieldCheck className="h-3.5 w-3.5" /> Enterprise OAuth Ready
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Welcome back</h1>
          <p className="mt-2 text-muted-foreground text-sm">
            Sign in to analyze your repository and view predictive ML risk metrics.
          </p>

          <div className="mt-8 space-y-3">
            <Button
              onClick={() => window.location.href = "http://localhost:8000/auth/test/login"}
              className="w-full h-12 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 text-base font-semibold transition-all shadow-xl hover:shadow-2xl hover:scale-[1.01]"
            >
              <GitBranch className="h-5 w-5 mr-2.5" /> Test Login (Dev)
            </Button>
            <Button
              onClick={() => window.location.href = "http://localhost:8000/auth/github/login"}
              className="w-full h-12 rounded-xl bg-white text-black hover:bg-white/90 text-base font-semibold transition-all shadow-xl hover:shadow-2xl hover:scale-[1.01]"
            >
              <GitBranch className="h-5 w-5 mr-2.5" /> Continue with GitHub
            </Button>
            <Button 
              variant="outline" 
              onClick={() => onNavigate("/dashboard")}
              className="w-full h-12 rounded-xl bg-white/5 border-border hover:bg-white/10 text-sm font-medium"
            >
              Continue with GitLab
            </Button>
            <Button 
              variant="outline" 
              onClick={() => onNavigate("/dashboard")}
              className="w-full h-12 rounded-xl bg-white/5 border-border hover:bg-white/10 text-sm font-medium"
            >
              Continue with Bitbucket
            </Button>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground uppercase font-mono">Or SSO</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="mt-6">
            <input 
              type="email"
              placeholder="name@company.com"
              className="w-full h-11 px-4 rounded-xl bg-slate-900 border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/50 mb-3"
            />
            <Button 
              onClick={() => onNavigate("/dashboard")}
              className="w-full h-11 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium text-sm"
            >
              Sign in with Work Email
            </Button>
          </div>

          <p className="mt-8 text-xs text-muted-foreground text-center">
            By continuing, you agree to our{" "}
            <a href="#" className="text-violet-400 hover:underline">Terms of Service</a> and{" "}
            <a href="#" className="text-violet-400 hover:underline">Privacy Policy</a>.
          </p>
        </div>

        <div className="text-xs text-muted-foreground flex items-center justify-between border-t border-white/5 pt-4">
          <span>© 2026 Code Smell Time-Machine Inc.</span>
          <span className="font-mono text-[11px]">SOC2 Type II Certified</span>
        </div>
      </div>

      {/* Right: illustration */}
      <div className="hidden lg:flex flex-1 items-center justify-center relative overflow-hidden border-l border-border bg-slate-900/40 p-12">
        <div className="absolute inset-0 opacity-40" style={{ background: "radial-gradient(circle at center, rgba(124, 58, 237, 0.25), transparent 70%)" }} />
        
        <div className="relative w-full max-w-lg space-y-5">
          <div className="mb-6 space-y-2">
            <span className="text-xs font-mono text-violet-400 uppercase tracking-widest">Predictive Intelligence</span>
            <h2 className="text-2xl font-bold text-white">Prevent Code Smells Before They Merge</h2>
            <p className="text-xs text-muted-foreground">Real-time XGBoost ML analytics trained on millions of commit histories.</p>
          </div>

          {[
            { icon: GitBranch, label: "Repository connected", sub: "microsoft/vscode • main branch", status: "Active" },
            { icon: Brain, label: "Model training complete", sub: "XGBoost ML v2.4 • 96% ROC-AUC accuracy", status: "Optimal" },
            { icon: TrendingUp, label: "Prediction ready", sub: "3 high-risk files identified in PaymentService.ts", status: "Alert" },
          ].map((s, i) => {
            const Icon = s.icon;
            return (
              <div 
                key={i} 
                className="glass rounded-2xl p-4 flex items-center gap-4 animate-fade-up border border-white/10 hover:border-violet-500/40 transition-all" 
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-md">
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-white flex items-center gap-2">
                    {s.label}
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                      {s.status}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground truncate mt-0.5">{s.sub}</div>
                </div>
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse-dot" />
              </div>
            );
          })}

          <div className="glass rounded-2xl p-5 border border-white/10 mt-6 bg-violet-950/20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-white flex items-center gap-2">
                <Code2 className="h-4 w-4 text-violet-400" /> SHAP Feature Attribution
              </span>
              <span className="text-[11px] font-mono text-violet-300">Live Telemetry</span>
            </div>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-[11px] text-muted-foreground mb-1">
                  <span>Code Churn (Lines Modified)</span>
                  <span className="text-violet-300 font-mono">88%</span>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full" style={{ width: "88%" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] text-muted-foreground mb-1">
                  <span>Cyclomatic Complexity</span>
                  <span className="text-violet-300 font-mono">72%</span>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full" style={{ width: "72%" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
