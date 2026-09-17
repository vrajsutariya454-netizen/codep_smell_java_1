import React from "react";
import { Settings as SettingsIcon, Key, Bell, Shield, GitBranch, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Settings: React.FC = () => {
  return (
    <div className="p-6 md:p-8 space-y-8 animate-fade-up max-w-4xl">
      <div>
        <div className="flex items-center gap-2 text-violet-400 font-mono text-xs mb-1">
          <SettingsIcon className="h-4 w-4" /> System Settings
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Workspace & Integration Settings</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Configure GitHub OAuth tokens, webhook alerts, and ML retrain frequency.</p>
      </div>

      <div className="glass rounded-2xl p-6 border border-white/10 space-y-6">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <GitBranch className="h-4 w-4 text-violet-400" /> VCS Integrations
        </h3>
        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900 border border-white/5 text-xs font-mono">
          <div>
            <div className="text-white font-bold">GitHub Organization Connection</div>
            <div className="text-muted-foreground mt-0.5">Status: Connected to @acme-corp (Access to 42 repos)</div>
          </div>
          <Button size="sm" variant="outline" className="text-xs">Re-authenticate</Button>
        </div>
      </div>
    </div>
  );
};

export const Profile: React.FC = () => {
  return (
    <div className="p-6 md:p-8 space-y-8 animate-fade-up max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Developer Profile</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Manage your user profile & Pro plan tier.</p>
      </div>

      <div className="glass rounded-2xl p-6 border border-white/10 space-y-4">
        <div className="flex items-center gap-4">
          <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="Profile" className="w-16 h-16 rounded-xl object-cover ring-2 ring-violet-500" />
          <div>
            <h2 className="text-lg font-bold text-white">Alex Developer</h2>
            <p className="text-xs text-muted-foreground font-mono">alex@acme.com • Principal Engineer</p>
            <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-violet-500/20 text-violet-300 border border-violet-500/30">
              Pro Plan Unlimited
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
