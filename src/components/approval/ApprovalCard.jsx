import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, FileX, ShieldOff, Copy, CheckCircle2, XCircle, ChevronRight, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { VIOLATION_TYPE_LABELS } from "@/lib/dashboardMockData";

const TYPE_ICONS = {
  over_limit:   AlertTriangle,
  missing_docs: FileX,
  no_approval:  ShieldOff,
  duplicate:    Copy,
};

const SEVERITY_COLORS = {
  high:   { bg: "bg-destructive/10", text: "text-destructive", border: "border-destructive/20" },
  medium: { bg: "bg-warning/10",     text: "text-warning",     border: "border-warning/20" },
  low:    { bg: "bg-secondary",      text: "text-muted-foreground", border: "border-border" },
};

export default function ApprovalCard({ alert, invoice, decision, onReview }) {
  const Icon = TYPE_ICONS[alert.type] ?? AlertTriangle;
  const sev = SEVERITY_COLORS[alert.severity];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className={`bg-card border rounded-xl p-4 md:p-5 transition-all ${
        decision === "approved" ? "border-primary/30 opacity-70" :
        decision === "rejected" ? "border-destructive/20 opacity-60" :
        "border-border hover:border-border/80"
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center ${sev.bg}`}>
          <Icon className={`w-4 h-4 ${sev.text}`} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="font-medium text-foreground text-sm">{alert.employee}</span>
            <span className="text-muted-foreground text-xs">·</span>
            <span className="text-muted-foreground text-xs">{alert.department}</span>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${sev.bg} ${sev.text} ${sev.border}`}>
              {VIOLATION_TYPE_LABELS[alert.type]}
            </span>
            {decision && (
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                decision === "approved"
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "bg-destructive/10 text-destructive border border-destructive/20"
              }`}>
                {decision === "approved" ? "✓ Aprovada" : "✗ Recusada"}
              </span>
            )}
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">{alert.description}</p>
          <div className="flex flex-wrap items-center gap-4 mt-2.5">
            <div className="flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="font-mono text-sm text-foreground font-semibold">
                R$ {alert.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </span>
              {alert.limit && (
                <span className="text-muted-foreground text-xs">
                  (limite R$ {alert.limit.toLocaleString("pt-BR")})
                </span>
              )}
            </div>
            <span className="text-muted-foreground text-xs">
              {format(new Date(alert.date), "dd/MM/yyyy", { locale: ptBR })}
            </span>
            <span className="text-muted-foreground text-xs">{alert.category}</span>
          </div>
        </div>

        {/* Action */}
        {!decision ? (
          <button
            onClick={onReview}
            className="shrink-0 flex items-center gap-1.5 bg-primary text-primary-foreground text-xs font-medium px-3 py-2 rounded-lg hover:bg-primary/90 transition-all hover:scale-105"
          >
            Analisar
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
            decision === "approved" ? "bg-primary/10" : "bg-destructive/10"
          }`}>
            {decision === "approved"
              ? <CheckCircle2 className="w-4 h-4 text-primary" />
              : <XCircle className="w-4 h-4 text-destructive" />
            }
          </div>
        )}
      </div>
    </motion.div>
  );
}