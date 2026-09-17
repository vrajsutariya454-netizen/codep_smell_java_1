import React, { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { AuthPage } from "@/pages/AuthPage";
import { LandingPage } from "@/pages/LandingPage";
import { Dashboard } from "@/pages/Dashboard";
import { RiskHeatmap } from "@/pages/RiskHeatmap";
import { ShapExplainability } from "@/pages/ShapExplainability";
import { MLModelComparison } from "@/pages/MLModelComparison";
import { DependencyGraph } from "@/pages/DependencyGraph";
import { RiskTimeline } from "@/pages/RiskTimeline";
import { AIRefactoring } from "@/pages/AIRefactoring";
import { Reports } from "@/pages/Reports";
import { Repositories } from "@/pages/Repositories";
import { Settings, Profile } from "@/pages/SettingsAndProfile";

export function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    // Check if user has a token
    const token = localStorage.getItem("token");
    const path = window.location.pathname;

    // Handle OAuth callback
    if (path === "/auth/callback") {
      const params = new URLSearchParams(window.location.search);
      const tokenFromUrl = params.get("token");
      if (tokenFromUrl) {
        localStorage.setItem("token", tokenFromUrl);
        window.history.replaceState({}, document.title, "/");
        return "/dashboard";
      }
    }

    return token ? "/dashboard" : "/auth";
  });

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Full-bleed views (Landing & Auth)
  if (currentPath === "/") {
    return <LandingPage onNavigate={handleNavigate} />;
  }

  if (currentPath === "/auth") {
    return <AuthPage onNavigate={handleNavigate} />;
  }

  // Dashboard & SaaS workspace layout with Sidebar + Header
  return (
    <div className="min-h-screen bg-slate-950 text-foreground flex flex-row font-sans">
      <Sidebar currentPath={currentPath} onNavigate={handleNavigate} />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <Header currentPath={currentPath} onNavigate={handleNavigate} />
        
        <main className="flex-1 pb-16">
          {currentPath === "/dashboard" && <Dashboard onNavigate={handleNavigate} />}
          {currentPath === "/repositories" && <Repositories onNavigate={handleNavigate} />}
          {currentPath === "/heatmap" && <RiskHeatmap onNavigate={handleNavigate} />}
          {currentPath === "/shap" && <ShapExplainability onNavigate={handleNavigate} />}
          {currentPath === "/models" && <MLModelComparison onNavigate={handleNavigate} />}
          {currentPath === "/dependencies" && <DependencyGraph onNavigate={handleNavigate} />}
          {currentPath === "/timeline" && <RiskTimeline />}
          {currentPath === "/refactoring" && <AIRefactoring />}
          {currentPath === "/reports" && <Reports />}
          {currentPath === "/settings" && <Settings />}
          {currentPath === "/profile" && <Profile />}
        </main>
      </div>
    </div>
  );
}

export default App;
