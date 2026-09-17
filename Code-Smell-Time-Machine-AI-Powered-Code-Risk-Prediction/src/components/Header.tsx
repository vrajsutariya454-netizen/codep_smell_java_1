import React from "react";
import { Search, Bell, GitBranch, Sparkles, ChevronRight, ShieldAlert, Cpu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPath, onNavigate }) => {
  const getBreadcrumb = (path: string) => {
    if (path === "/dashboard") return "Dashboard";
    if (path.startsWith("/repositories")) return "Repositories / microsoft-vscode";
    if (path === "/heatmap") return "Analytics / Risk Heatmap";
    if (path === "/shap") return "Analytics / SHAP Explainability";
    if (path === "/models") return "Analytics / ML Model Benchmarks";
    if (path === "/dependencies") return "Architecture / Dependency Graph";
    if (path === "/timeline") return "Time Machine / Historic Risk Timeline";
    if (path === "/refactoring") return "Automation / AI Refactoring Studio";
    if (path === "/reports") return "Reports / Weekly Code Audit";
    if (path === "/settings") return "System / Workspace Settings";
    if (path === "/profile") return "User / Account Profile";
    return "Overview";
  };

  return (
    <header className="h-16 border-b border-border bg-slate-950/60 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Search & Breadcrumbs */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground font-mono">
          <GitBranch className="h-4 w-4 text-violet-400" />
          <span>org:acme</span>
          <ChevronRight className="h-3 w-3 text-slate-600" />
          <span className="text-foreground font-semibold">{getBreadcrumb(currentPath)}</span>
        </div>

        <div className="relative hidden md:flex items-center">
          <Search className="h-4 w-4 absolute left-3 text-muted-foreground" />
          <input 
            type="text"
            placeholder="Search files, smells, models (Cmd + K)..."
            className="h-9 w-72 rounded-xl bg-slate-900/80 border border-border pl-9 pr-4 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
          />
        </div>
      </div>

      {/* Quick stats & Actions */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-mono">
          <Cpu className="h-3.5 w-3.5 text-violet-400 animate-pulse" />
          <span>XGBoost v2.4 Active</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        </div>

        <button className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-xl transition-all">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-slate-950" />
        </button>

        <Button
          size="sm"
          onClick={() => onNavigate("/refactoring")}
          className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/20 text-xs flex items-center gap-1.5"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Run AI Scan</span>
        </Button>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/auth";
          }}
          className="p-2 text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-xl transition-all"
          title="Logout"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
};
