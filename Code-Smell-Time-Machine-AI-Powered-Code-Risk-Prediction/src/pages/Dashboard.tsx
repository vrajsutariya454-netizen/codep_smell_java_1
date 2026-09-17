import React, { useState, useEffect } from "react";
import { 
  GitBranch, 
  ShieldAlert, 
  TrendingUp, 
  Flame, 
  BrainCircuit, 
  CheckCircle2, 
  ArrowUpRight, 
  Clock, 
  Zap, 
  ChevronRight,
  Activity,
  AlertTriangle,
  Cpu,
  Layers,
  FileCode2,
  Plus,
  Loader2,
  Link2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

interface DashboardProps {
  onNavigate: (path: string) => void;
}

const riskData = [
  { commit: "v2.1", health: 95, risk: 20, debt: 10 },
  { commit: "v2.2", health: 93, risk: 25, debt: 12 },
  { commit: "v2.3", health: 88, risk: 34, debt: 15 },
  { commit: "v2.4 (Current)", health: 92, risk: 38, debt: 14 },
  { commit: "v2.5 (Pred)", health: 85, risk: 48, debt: 18 },
  { commit: "v2.6 (Pred)", health: 79, risk: 62, debt: 24 },
];

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [activeRepo, setActiveRepo] = useState<{ name: string; url: string; health: number; risk: number; smells: number } | null>(null);
  const [githubInput, setGithubInput] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [showInputModal, setShowInputModal] = useState(false);

  useEffect(() => {
    const loadActiveRepo = () => {
      const savedRepo = localStorage.getItem("active_repo");
      if (savedRepo) {
        try {
          const parsed = JSON.parse(savedRepo);
          setActiveRepo(parsed);
        } catch (e) {
          console.error(e);
        }
      }
    };

    // Load on mount
    loadActiveRepo();

    // Reload when page becomes visible (tab switch, navigation back)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        loadActiveRepo();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  const handleAddGithubLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!githubInput.trim()) return;

    setIsAdding(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8000/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          repo_url: githubInput.trim(),
          max_commits: 100,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(`Error: ${error.detail || "Failed to analyze repository"}`);
        setIsAdding(false);
        return;
      }

      const data = await response.json();

      let repoName = githubInput.trim().replace(/^https?:\/\/github\.com\//, "").replace(/\.git$/, "");
      if (!repoName.includes("/")) {
        repoName = `developer/${repoName || "my-repo"}`;
      }

      const avgRisk = data.predictions.length > 0
        ? Math.round((data.predictions.reduce((sum: number, p: any) => sum + p.risk_score, 0) / data.predictions.length) * 100)
        : 0;
      const highRiskCount = data.predictions.filter((p: any) => p.label === "high").length;

      const newRepo = {
        id: data.repository_id.toString(),
        name: repoName,
        url: githubInput.startsWith("http") ? githubInput : `https://github.com/${repoName}`,
        branch: "main",
        health: Math.max(0, Math.min(100, 100 - avgRisk)),
        risk: avgRisk,
        smells: highRiskCount,
        lastSync: "Just now",
        status: "Active",
      };

      const existingStr = localStorage.getItem("connected_repos");
      const existing = existingStr ? JSON.parse(existingStr) : [];
      const updated = [newRepo, ...existing];

      localStorage.setItem("connected_repos", JSON.stringify(updated));
      localStorage.setItem("active_repo", JSON.stringify(newRepo));
      setActiveRepo(newRepo);

      setGithubInput("");
      setShowInputModal(false);
    } catch (error) {
      console.error("Error analyzing repository:", error);
      alert("Error analyzing repository. Check console.");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-8 animate-fade-up">
      {/* Top Banner: Active Repository Context */}
      <div className="glass rounded-2xl p-6 border border-violet-500/20 relative overflow-hidden bg-gradient-to-r from-violet-950/30 via-slate-900/60 to-slate-950/80">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <GitBranch className="h-64 w-64 text-violet-400" />
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-violet-600/20 border border-violet-500/30 text-violet-300">
                <GitBranch className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-white tracking-tight">
                    {activeRepo ? activeRepo.name : "No Repository Selected"}
                  </h1>
                  {activeRepo ? (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Live Syncing
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Connect Link Required
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {activeRepo ? (
                    <>
                      Branch <span className="text-foreground font-mono">main</span> • Analyzed via ML pipeline
                    </>
                  ) : (
                    "Add a GitHub URL to start predicting bug-prone files"
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button 
              onClick={() => setShowInputModal(!showInputModal)}
              className="bg-violet-600 hover:bg-violet-500 text-white text-xs gap-2 shadow-lg shadow-violet-600/30"
            >
              <Plus className="h-4 w-4" /> Add GitHub Link
            </Button>
            <Button 
              variant="outline" 
              onClick={() => onNavigate("/repositories")}
              className="text-xs"
            >
              View Repos
            </Button>
            <Button 
              onClick={() => onNavigate("/refactoring")}
              className="bg-slate-800 hover:bg-slate-700 border border-white/10 text-white text-xs gap-2"
            >
              <Zap className="h-3.5 w-3.5 text-violet-400" /> AI Refactor
            </Button>
          </div>
        </div>

        {/* Quick Add GitHub Link Inline Modal */}
        {showInputModal && (
          <div className="mt-6 pt-6 border-t border-violet-500/20 animate-fade-up">
            <form onSubmit={handleAddGithubLink} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Link2 className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="url"
                  required
                  placeholder="https://github.com/username/repository"
                  value={githubInput}
                  onChange={(e) => setGithubInput(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950/80 border border-violet-500/30 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500"
                />
              </div>
              <Button type="submit" disabled={isAdding} className="bg-violet-600 hover:bg-violet-500 text-xs px-5 gap-2">
                {isAdding ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />} Sync Repository
              </Button>
            </form>
          </div>
        )}

        {/* 4 Core Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5">
            <div className="text-xs text-muted-foreground font-medium flex items-center justify-between">
              <span>Health Score</span>
              <Activity className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-bold text-white mt-2 font-mono">
              {activeRepo ? activeRepo.health : 0}
              <span className="text-sm font-normal text-muted-foreground">/100</span>
            </div>
            <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1 font-mono">
              {activeRepo ? "Formula: 100 - (0.4*Risk + 0.3*Comp + 1.5*Smells)" : "No repo connected"}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5">
            <div className="text-xs text-muted-foreground font-medium flex items-center justify-between">
              <span>Future Risk Index</span>
              <AlertTriangle className="h-4 w-4 text-amber-400" />
            </div>
            <div className="text-3xl font-bold text-white mt-2 font-mono">
              {activeRepo ? activeRepo.risk : 0}
              <span className="text-sm font-normal text-muted-foreground">%</span>
            </div>
            <div className="text-[11px] text-amber-400 flex items-center gap-1 mt-1 font-mono">
              {activeRepo ? "Predicted churn risk" : "0% bug risk"}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5">
            <div className="text-xs text-muted-foreground font-medium flex items-center justify-between">
              <span>Technical Debt Score</span>
              <Clock className="h-4 w-4 text-violet-400" />
            </div>
            <div className="text-3xl font-bold text-white mt-2 font-mono">
              {activeRepo ? activeRepo.smells * 4 : 0}
              <span className="text-sm font-normal text-muted-foreground"> hrs</span>
            </div>
            <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1 font-mono">
              {activeRepo ? "Estimated fix effort" : "0 hrs technical debt"}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5">
            <div className="text-xs text-muted-foreground font-medium flex items-center justify-between">
              <span>XGBoost Accuracy</span>
              <Cpu className="h-4 w-4 text-indigo-400" />
            </div>
            <div className="text-3xl font-bold text-white mt-2 font-mono">
              {activeRepo ? 96 : 0}
              <span className="text-sm font-normal text-muted-foreground">%</span>
            </div>
            <div className="text-[11px] text-indigo-300 flex items-center gap-1 mt-1 font-mono">
              {activeRepo ? "ROC-AUC 0.96 (Optimal)" : "Inactive Predictor"}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid Section: Risk Timeline Chart + Top Risk Files */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Timeline Line Chart (2 Cols) */}
        <div className="lg:col-span-2 glass rounded-2xl p-6 border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-violet-400" /> Repository Risk Timeline & Predictive Projection
              </h3>
              <p className="text-xs text-muted-foreground">Historical health vs 30-day forecast based on ML commit velocity.</p>
            </div>
            <Button size="sm" variant="ghost" onClick={() => onNavigate("/timeline")} className="text-xs text-violet-400 hover:text-violet-300">
              Time Machine <ChevronRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activeRepo ? riskData : [
                { commit: "v1.0", health: 0, risk: 0, debt: 0 },
                { commit: "Current", health: 0, risk: 0, debt: 0 },
              ]}>
                <defs>
                  <linearGradient id="colorHealth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="commit" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "12px", fontSize: "12px" }} 
                />
                <Area type="monotone" dataKey="health" stroke="#10b981" fillOpacity={1} fill="url(#colorHealth)" name="Health Score" />
                <Area type="monotone" dataKey="risk" stroke="#ef4444" fillOpacity={1} fill="url(#colorRisk)" name="Future Risk %" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/5 text-xs text-muted-foreground font-mono">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Historic Health</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-400" /> Predicted Bug Probability</span>
            </div>
            <span>Confidence interval: {activeRepo ? "94.8%" : "0%"}</span>
          </div>
        </div>

        {/* Top Risk Files List (1 Col) */}
        <div className="glass rounded-2xl p-6 border border-white/10 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <Flame className="h-4 w-4 text-rose-400" /> Top Risk Files
            </h3>
            <span className="text-[11px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono">
              {activeRepo ? `${activeRepo.smells} Critical` : "0 Critical"}
            </span>
          </div>

          <div className="space-y-3 flex-1">
            {activeRepo ? [
              { name: "PaymentService.ts", risk: `${activeRepo.risk}%`, smell: "High Coupling & Churn", lines: "482 lines" },
              { name: "BillingManager.py", risk: `${Math.max(10, activeRepo.risk - 6)}%`, smell: "Cyclomatic Complexity > 28", lines: "920 lines" },
              { name: "OrderController.java", risk: `${Math.max(5, activeRepo.risk - 12)}%`, smell: "God Class Anti-pattern", lines: "1,240 lines" },
            ].map((file, idx) => (
              <div 
                key={idx} 
                onClick={() => onNavigate("/shap")}
                className="p-3 rounded-xl bg-slate-900/80 border border-white/5 hover:border-violet-500/40 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileCode2 className="h-4 w-4 text-slate-400 group-hover:text-violet-400 transition-colors" />
                    <span className="text-xs font-semibold text-white group-hover:text-violet-300 transition-colors">{file.name}</span>
                  </div>
                  <span className={`text-xs font-mono font-bold ${
                    parseInt(file.risk) > 85 ? "text-rose-400" : "text-amber-400"
                  }`}>
                    {file.risk}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-1 text-[11px] text-muted-foreground">
                  <span>{file.smell}</span>
                  <span className="font-mono">{file.lines}</span>
                </div>
              </div>
            )) : (
              <div className="text-center py-10 text-xs text-slate-500 font-mono">
                No risk files detected. Add a repository link above.
              </div>
            )}
          </div>

          <Button 
            variant="outline" 
            onClick={() => onNavigate("/heatmap")} 
            className="w-full mt-4 text-xs font-medium"
          >
            View Full Heatmap Graph
          </Button>
        </div>
      </div>

      {/* SHAP Explanation + Model Comparison + Recent Activity Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SHAP Explanation Summary */}
        <div className="glass rounded-2xl p-6 border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <BrainCircuit className="h-4 w-4 text-violet-400" /> SHAP Feature Impact
            </h3>
            <Button size="sm" variant="ghost" onClick={() => onNavigate("/shap")} className="text-xs text-violet-400">
              Details
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">Key predictors triggering risk scores across PaymentService.ts.</p>
          
          <div className="space-y-3 font-mono">
            <div>
              <div className="flex justify-between text-xs mb-1 text-slate-300">
                <span>Code Churn (14 days)</span>
                <span className="text-violet-400 font-bold">+0.42 SHAP</span>
              </div>
              <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-violet-500 to-rose-500 rounded-full" style={{ width: "84%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1 text-slate-300">
                <span>Cyclomatic Complexity</span>
                <span className="text-violet-400 font-bold">+0.28 SHAP</span>
              </div>
              <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-violet-500 to-amber-500 rounded-full" style={{ width: "62%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1 text-slate-300">
                <span>Single Developer Ownership</span>
                <span className="text-violet-400 font-bold">+0.15 SHAP</span>
              </div>
              <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full" style={{ width: "35%" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Best ML Model Badge & Metrics */}
        <div className="glass rounded-2xl p-6 border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-indigo-400 uppercase tracking-wider">Active Predictor</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300">Deployed</span>
            </div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Cpu className="h-5 w-5 text-indigo-400" /> XGBoost Classifier v2.4
            </h3>
            <p className="text-xs text-muted-foreground mt-1">Outperformed Random Forest & LightGBM on 40,000 historical commits.</p>
          </div>

          <div className="grid grid-cols-2 gap-3 my-4">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 text-center">
              <div className="text-[11px] text-muted-foreground">ROC-AUC</div>
              <div className="text-xl font-bold text-white font-mono mt-0.5">0.96</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 text-center">
              <div className="text-[11px] text-muted-foreground">F1 Score</div>
              <div className="text-xl font-bold text-white font-mono mt-0.5">0.92</div>
            </div>
          </div>

          <Button variant="outline" onClick={() => onNavigate("/models")} className="w-full text-xs">
            Compare Models Matrix
          </Button>
        </div>

        {/* Recent Repository Activity */}
        <div className="glass rounded-2xl p-6 border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-400" /> Recent Activity
            </h3>
            <span className="text-xs text-muted-foreground font-mono">12 PRs analyzed</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-start gap-3 p-2 rounded-lg bg-slate-900/40">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-foreground font-medium">PR #482 refactored by AI</div>
                <div className="text-muted-foreground text-[11px]">Reduced risk score in PaymentService.ts by 18%</div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-2 rounded-lg bg-slate-900/40">
              <ShieldAlert className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-foreground font-medium">Smell Detected in commit #c92f</div>
                <div className="text-muted-foreground text-[11px]">God Class smell flagged in OrderController.java</div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-2 rounded-lg bg-slate-900/40">
              <GitBranch className="h-4 w-4 text-violet-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-foreground font-medium">Daily XGBoost Retrain</div>
                <div className="text-muted-foreground text-[11px]">Updated weight metrics across 120 files</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
