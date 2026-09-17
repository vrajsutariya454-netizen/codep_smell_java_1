import React from "react";
import { 
  Sparkles, 
  LayoutDashboard, 
  GitBranch, 
  FileCode, 
  Flame, 
  BrainCircuit, 
  Cpu, 
  Network, 
  History, 
  Wand2, 
  FileSpreadsheet, 
  Settings, 
  User, 
  LogOut,
  ChevronRight,
  ShieldCheck,
  Search,
  Bell
} from "lucide-react";

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPath, onNavigate }) => {
  const menuGroups = [
    {
      title: "Core Platform",
      items: [
        { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
        { label: "Repositories", path: "/repositories", icon: GitBranch, badge: "3 Active" },
        { label: "Repo Details", path: "/repositories/microsoft-vscode", icon: FileCode },
      ]
    },
    {
      title: "Predictive Analytics",
      items: [
        { label: "Risk Heatmap", path: "/heatmap", icon: Flame, badge: "Hot" },
        { label: "SHAP Explainability", path: "/shap", icon: BrainCircuit },
        { label: "ML Models", path: "/models", icon: Cpu },
        { label: "Dependency Graph", path: "/dependencies", icon: Network },
        { label: "Risk Timeline", path: "/timeline", icon: History },
      ]
    },
    {
      title: "Automation & Insights",
      items: [
        { label: "AI Refactoring", path: "/refactoring", icon: Wand2, badge: "AI" },
        { label: "Weekly Reports", path: "/reports", icon: FileSpreadsheet },
      ]
    },
    {
      title: "System",
      items: [
        { label: "Settings", path: "/settings", icon: Settings },
        { label: "Profile", path: "/profile", icon: User },
      ]
    }
  ];

  return (
    <aside className="w-64 border-r border-border bg-slate-950/80 flex flex-col h-screen sticky top-0 backdrop-blur-xl z-30">
      {/* Brand header */}
      <div className="p-5 border-b border-border flex items-center justify-between">
        <button 
          onClick={() => onNavigate("/")} 
          className="flex items-center gap-2.5 group text-left"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-500/25 group-hover:scale-105 transition-transform">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="font-semibold text-sm text-foreground tracking-tight flex items-center gap-1.5">
              CodeSmell <span className="text-[10px] px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-300 font-mono border border-violet-500/30">v2.4</span>
            </div>
            <div className="text-[11px] text-muted-foreground">Time-Machine SaaS</div>
          </div>
        </button>
      </div>

      {/* Navigation menu */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
        {menuGroups.map((group, idx) => (
          <div key={idx} className="space-y-1.5">
            <div className="text-[11px] font-semibold text-muted-foreground/70 uppercase tracking-wider px-3 mb-2">
              {group.title}
            </div>
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path || (item.path !== "/" && currentPath.startsWith(item.path) && item.path !== "/repositories");
              return (
                <button
                  key={item.path}
                  onClick={() => onNavigate(item.path)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-violet-600/15 text-violet-300 border border-violet-500/30 shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-4 w-4 ${isActive ? "text-violet-400" : "text-slate-400"}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                      item.badge === "Hot" 
                        ? "bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse" 
                        : item.badge === "AI"
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        : "bg-slate-800 text-slate-300"
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* User profile footer */}
      <div className="p-4 border-t border-border bg-slate-900/40">
        <div className="flex items-center justify-between p-2 rounded-xl border border-white/5 bg-white/5">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" 
                alt="Avatar" 
                className="w-8 h-8 rounded-lg object-cover ring-1 ring-violet-500/50"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-950" />
            </div>
            <div className="text-left">
              <div className="text-xs font-medium text-foreground">Alex Developer</div>
              <div className="text-[10px] text-muted-foreground font-mono">Pro Plan Active</div>
            </div>
          </div>
          <button 
            onClick={() => onNavigate("/auth")}
            className="text-muted-foreground hover:text-rose-400 transition-colors p-1.5 hover:bg-white/5 rounded-lg"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
