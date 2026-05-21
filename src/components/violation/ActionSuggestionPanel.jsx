import React, { useState } from "react";
import { Lightbulb, BookOpen, CheckSquare, AlertTriangle, FileX, ShieldOff, Copy, ChevronRight, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { toast } from "sonner";

const ICON_MAP = {
  AlertTriangle, FileX, ShieldOff, Copy,
};

export default function ActionSuggestionPanel({ suggestion, alert }) {
  const [checkedSteps, setCheckedSteps] = useState([]);
  const [resolved, setResolved] = useState(false);
  const [rejected, setRejected] = useState(false);

  if (!suggestion) return null;

  const Icon = ICON_MAP[suggestion.icon] ?? Lightbulb;
  const allChecked = checkedSteps.length === suggestion.steps.length;

  const toggleStep = (i) => {
    setCheckedSteps((prev) =>
      prev.includes(i) ? prev.filter((s) => s !== i) : [...prev, i]
    );
  };

  const handleApproveException = () => {
    setResolved(true);
    toast.success("Exceção aprovada e registrada no histórico.");
  };

  const handleReject = () => {
    setRejected(true);
    toast.error("Despesa rejeitada. Colaborador será notificado.");
  };

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border">
        <div className="flex items-center gap-2.5">
          <Lightbulb className="w-4 h-4 text-primary" />
          <h3 className="font-heading text-foreground text-base">Sugestão de Ação</h3>
        </div>
        <p className="text-muted-foreground text-xs mt-1">
          Baseado na política vigente da empresa
        </p>
      </div>

      <div className="p-5 space-y-5">
        {/* Suggestion title */}
        <div className={`rounded-lg p-4 border flex items-start gap-3 ${
          resolved ? "border-primary/30 bg-primary/5" :
          rejected ? "border-destructive/30 bg-destructive/5" :
          "border-warning/20 bg-warning/5"
        }`}>
          <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center ${
            resolved ? "bg-primary/15" :
            rejected ? "bg-destructive/15" :
            "bg-warning/15"
          }`}>
            {resolved ? <CheckCircle2 className="w-4 h-4 text-primary" /> :
             rejected ? <XCircle className="w-4 h-4 text-destructive" /> :
             <Icon className="w-4 h-4 text-warning" />}
          </div>
          <div>
            <p className={`text-sm font-medium ${
              resolved ? "text-primary" :
              rejected ? "text-destructive" :
              "text-foreground"
            }`}>
              {resolved ? "Exceção aprovada e registrada" :
               rejected ? "Despesa rejeitada" :
               suggestion.title}
            </p>
            {!resolved && !rejected && (
              <p className="text-muted-foreground text-xs mt-0.5">
                Marque cada passo ao concluir para registrar o tratamento.
              </p>
            )}
          </div>
        </div>

        {/* Step checklist */}
        {!resolved && !rejected && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Passos recomendados
            </p>
            {suggestion.steps.map((step, i) => {
              const done = checkedSteps.includes(i);
              return (
                <motion.button
                  key={i}
                  onClick={() => toggleStep(i)}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.05 }}
                  className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-lg border text-left transition-all ${
                    done
                      ? "border-primary/20 bg-primary/5"
                      : "border-border hover:border-muted-foreground/30 bg-secondary/30"
                  }`}
                >
                  <div className={`w-5 h-5 rounded border-2 shrink-0 flex items-center justify-center mt-0.5 transition-colors ${
                    done ? "border-primary bg-primary" : "border-border"
                  }`}>
                    {done && <CheckSquare className="w-3 h-3 text-primary-foreground" />}
                  </div>
                  <span className={`text-xs leading-relaxed ${done ? "text-muted-foreground line-through" : "text-foreground"}`}>
                    {step}
                  </span>
                </motion.button>
              );
            })}
          </div>
        )}

        {/* Policy reference */}
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-secondary/40 border border-border/60">
          <BookOpen className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <span className="text-xs text-muted-foreground">{suggestion.policyRef}</span>
        </div>

        {/* Actions */}
        {!resolved && !rejected && (
          <div className="flex flex-col sm:flex-row gap-2 pt-1">
            <Button
              onClick={handleReject}
              variant="outline"
              className="flex-1 border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive text-xs"
            >
              <XCircle className="w-3.5 h-3.5" />
              Rejeitar despesa
            </Button>
            {suggestion.canApproveException && (
              <Button
                onClick={handleApproveException}
                className="flex-1 text-xs"
                disabled={!allChecked}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                {allChecked ? "Aprovar exceção" : `Conclua ${suggestion.steps.length - checkedSteps.length} passo(s)`}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}