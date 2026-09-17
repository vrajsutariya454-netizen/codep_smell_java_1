import React, { useState } from "react";
import { Wand2, Check, Sparkles, Code2, ArrowRight, ShieldCheck, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export const AIRefactoring: React.FC = () => {
  const [isApplied, setIsApplied] = useState(false);

  return (
    <div className="p-6 md:p-8 space-y-6 animate-fade-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-mono text-xs mb-1">
            <Wand2 className="h-4 w-4" /> AI Refactoring Studio
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Automated Code Smell Remediation</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Remediating God Class & Cyclomatic Complexity in <span className="text-white font-mono">PaymentService.ts</span></p>
        </div>

        <Button 
          onClick={() => setIsApplied(true)}
          disabled={isApplied}
          className="bg-gradient-to-r from-amber-500 to-violet-600 text-white text-xs gap-2 shadow-lg shadow-amber-500/20"
        >
          {isApplied ? <><Check className="h-4 w-4" /> Refactor Applied to Branch</> : <><Sparkles className="h-4 w-4" /> Apply AI Patch to PR</>}
        </Button>
      </div>

      {/* Side-by-side Code Diff Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Original Code with Smell */}
        <div className="glass rounded-2xl p-5 border border-rose-500/30 bg-rose-950/10 space-y-3 font-mono">
          <div className="flex items-center justify-between pb-3 border-b border-rose-500/20 text-xs">
            <span className="text-rose-400 font-bold flex items-center gap-2">Original (High Risk - 94%)</span>
            <span className="text-[10px] text-muted-foreground">PaymentService.ts</span>
          </div>

          <pre className="text-xs text-slate-300 overflow-x-auto leading-relaxed p-3 bg-slate-950/80 rounded-xl">
{`// BAD: God Class & Monolithic Method
export class PaymentService {
  public async processPayment(user: any, amount: number, card: any) {
    if (user && user.id) {
      if (amount > 0) {
        if (card.number && card.cvv && card.exp) {
          // 400 lines of unhandled nested logic
          const res = await fetch('/api/stripe', { body: card });
          return res;
        }
      }
    }
  }
}`}
          </pre>
        </div>

        {/* Right: AI Refactored Clean Code */}
        <div className="glass rounded-2xl p-5 border border-emerald-500/30 bg-emerald-950/10 space-y-3 font-mono">
          <div className="flex items-center justify-between pb-3 border-b border-emerald-500/20 text-xs">
            <span className="text-emerald-400 font-bold flex items-center gap-2">AI Refactored (Risk Reduced to 18%)</span>
            <span className="text-[10px] text-emerald-300">Clean Architecture</span>
          </div>

          <pre className="text-xs text-slate-300 overflow-x-auto leading-relaxed p-3 bg-slate-950/80 rounded-xl">
{`// CLEAN: Single Responsibility & Guard Clauses
export class PaymentService {
  constructor(private readonly gateway: IPaymentGateway) {}

  public async processPayment(dto: PaymentDTO): Promise<Result> {
    this.validatePaymentDTO(dto);
    return await this.gateway.charge(dto);
  }

  private validatePaymentDTO(dto: PaymentDTO) {
    if (!dto.isValid()) throw new InvalidPaymentError();
  }
}`}
          </pre>
        </div>
      </div>
    </div>
  );
};
