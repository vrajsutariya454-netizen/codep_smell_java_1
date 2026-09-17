import React, { useState } from "react";
import { GitBranch, Plus, Search, CheckCircle2, ShieldAlert, ArrowUpRight, Trash2, Loader2, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReposProps {
  onNavigate: (path: string) => void;
}

export interface RepoItem {
  id: string;
  name: string;
  url: string;
  branch: string;
  health: number;
  risk: number;
  smells: number;
  lastSync: string;
  status: string;
}

export const Repositories: React.FC<ReposProps> = ({ onNavigate }) => {
  const [repos, setRepos] = useState<RepoItem[]>(() => {
    const saved = localStorage.getItem("connected_repos");
    return saved ? JSON.parse(saved) : [];
  });
  
  const [githubUrl, setGithubUrl] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const saveRepos = (newRepos: RepoItem[]) => {
    setRepos(newRepos);
    localStorage.setItem("connected_repos", JSON.stringify(newRepos));
    if (newRepos.length > 0) {
      localStorage.setItem("active_repo", JSON.stringify(newRepos[0]));
    } else {
      localStorage.removeItem("active_repo");
    }
  };

  const handleRemoveRepo = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const filtered = repos.filter((r) => r.id !== id);
    saveRepos(filtered);
  };

  const handleRemoveAll = () => {
    saveRepos([]);
  };

  const handleConnectRepo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!githubUrl.trim()) return;

    setIsConnecting(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8000/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          repo_url: githubUrl.trim(),
          max_commits: 100,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(`Error: ${error.detail || "Failed to analyze repository"}`);
        setIsConnecting(false);
        return;
      }

      const data = await response.json();
      console.log("Backend response:", data);
      console.log("Predictions:", data.predictions);

      let repoName = githubUrl.trim().replace(/^https?:\/\/github\.com\//, "").replace(/\.git$/, "");
      if (!repoName.includes("/")) {
        repoName = `developer/${repoName || "my-repo"}`;
      }

      const avgRisk = data.predictions.length > 0
        ? Math.round((data.predictions.reduce((sum: number, p: any) => sum + p.risk_score, 0) / data.predictions.length) * 100)
        : 0;
      const highRiskCount = data.predictions.filter((p: any) => p.label === "high").length;

      console.log("Calculated avgRisk:", avgRisk);
      console.log("Calculated health:", Math.max(0, Math.min(100, 100 - avgRisk)));

      const newRepo: RepoItem = {
        id: data.repository_id.toString(),
        name: repoName,
        url: githubUrl.startsWith("http") ? githubUrl : `https://github.com/${repoName}`,
        branch: "main",
        health: Math.max(0, Math.min(100, 100 - avgRisk)),
        risk: avgRisk,
        smells: highRiskCount,
        lastSync: "Just now",
        status: "Active",
      };

      const updated = [newRepo, ...repos];
      console.log("Saving repo to localStorage:", newRepo);
      saveRepos(updated);
      console.log("Stored active_repo:", localStorage.getItem("active_repo"));
      setGithubUrl("");
      setShowAddModal(false);
      onNavigate("/dashboard");
    } catch (error) {
      console.error("Error analyzing repository:", error);
      alert("Error analyzing repository. Check console.");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSelectRepo = (repo: RepoItem) => {
    localStorage.setItem("active_repo", JSON.stringify(repo));
    onNavigate("/dashboard");
  };

  return (
    <div className="p-6 md:p-8 space-y-6 animate-fade-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-violet-400 font-mono text-xs mb-1">
            <GitBranch className="h-4 w-4" /> Connected VCS Providers
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Connected Repositories</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Manage live automated ML scans across GitHub repositories.</p>
        </div>

        <div className="flex items-center gap-3">
          {repos.length > 0 && (
            <Button variant="outline" onClick={handleRemoveAll} className="text-xs text-rose-400 hover:text-rose-300 border-rose-500/30 hover:bg-rose-950/30 gap-1.5">
              <Trash2 className="h-3.5 w-3.5" /> Remove All Repos
            </Button>
          )}
          <Button onClick={() => setShowAddModal(true)} className="bg-violet-600 hover:bg-violet-500 text-xs gap-2 shadow-lg shadow-violet-600/30">
            <Plus className="h-4 w-4" /> Add GitHub Repo
          </Button>
        </div>
      </div>

      {showAddModal && (
        <div className="glass rounded-2xl p-6 border border-violet-500/30 bg-slate-900/90 animate-fade-up">
          <form onSubmit={handleConnectRepo} className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-2 text-violet-300 text-sm font-semibold">
              <Link2 className="h-5 w-5" /> Connect New GitHub Repository
            </div>
            <p className="text-xs text-muted-foreground">Enter a public or private GitHub repository URL to analyze code churn, complexity, and coupling metrics.</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="url"
                required
                placeholder="https://github.com/username/repository"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500"
              />
              <Button type="submit" disabled={isConnecting} className="bg-violet-600 hover:bg-violet-500 text-xs px-6 gap-2">
                {isConnecting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Analyzing Repo...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" /> Connect & Sync
                  </>
                )}
              </Button>
              <Button type="button" variant="ghost" onClick={() => setShowAddModal(false)} className="text-xs text-muted-foreground">
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {repos.length === 0 ? (
        <div className="glass rounded-2xl p-12 border border-white/10 text-center space-y-4">
          <div className="p-4 rounded-full bg-violet-600/10 border border-violet-500/20 text-violet-400 w-fit mx-auto">
            <Link2 className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-white">No Repositories Connected</h3>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            All repositories have been cleared. Add a GitHub repository link above to start analyzing code churn, complexity, and bug-prone files.
          </p>
          <Button onClick={() => setShowAddModal(true)} className="bg-violet-600 hover:bg-violet-500 text-xs gap-2 mt-2">
            <Plus className="h-4 w-4" /> Add Your First Repository
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {repos.map((repo) => (
            <div
              key={repo.id}
              onClick={() => handleSelectRepo(repo)}
              className="glass rounded-2xl p-5 border border-white/10 hover:border-violet-500/40 transition-all cursor-pointer space-y-4 relative group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-violet-600/20 text-violet-300 border border-violet-500/30">
                    <GitBranch className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                      {repo.name}
                      <a href={repo.url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="text-muted-foreground hover:text-white">
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>
                    </h3>
                    <p className="text-xs text-muted-foreground font-mono">Branch: {repo.branch} • Synced {repo.lastSync}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {repo.status}
                  </span>
                  <button
                    onClick={(e) => handleRemoveRepo(repo.id, e)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                    title="Remove Repository"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center font-mono">
                <div className="p-2 rounded-lg bg-slate-900 border border-white/5">
                  <div className="text-[10px] text-muted-foreground">Health</div>
                  <div className="text-sm font-bold text-emerald-400">{repo.health}/100</div>
                </div>
                <div className="p-2 rounded-lg bg-slate-900 border border-white/5">
                  <div className="text-[10px] text-muted-foreground">Risk</div>
                  <div className="text-sm font-bold text-rose-400">{repo.risk}%</div>
                </div>
                <div className="p-2 rounded-lg bg-slate-900 border border-white/5">
                  <div className="text-[10px] text-muted-foreground">Smells</div>
                  <div className="text-sm font-bold text-amber-400">{repo.smells}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

