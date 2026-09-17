import React from "react";
import { FileSpreadsheet, Download, Calendar, CheckCircle2, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Reports: React.FC = () => {
  return (
    <div className="p-6 md:p-8 space-y-8 animate-fade-up">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs mb-1">
            <FileSpreadsheet className="h-4 w-4" /> Weekly Audit Telemetry
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Executive Code Quality Reports</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Automated PDF & CSV summaries sent to CTOs & Tech Leads.</p>
        </div>

        <Button className="bg-emerald-600 text-xs gap-2">
          <Download className="h-4 w-4" /> Export Latest PDF Report
        </Button>
      </div>

      <div className="glass rounded-2xl p-6 border border-white/10 space-y-4">
        <h3 className="text-sm font-semibold text-white">Historical Weekly Summaries</h3>
        <div className="space-y-3">
          {[
            { week: "Week 29 (July 18 - July 24, 2026)", score: "92 / 100", smellCount: "3 Critical", status: "Generated" },
            { week: "Week 28 (July 11 - July 17, 2026)", score: "89 / 100", smellCount: "5 Critical", status: "Archived" },
            { week: "Week 27 (July 04 - July 10, 2026)", score: "85 / 100", smellCount: "8 Critical", status: "Archived" },
          ].map((r, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-between text-xs font-mono">
              <div>
                <div className="font-bold text-white">{r.week}</div>
                <div className="text-muted-foreground mt-0.5">Health: {r.score} • Smells: {r.smellCount}</div>
              </div>
              <Button size="sm" variant="outline" className="text-xs">Download PDF</Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
