import React from "react";
import { CheckCircle2, XCircle, AlertTriangle, Plus, ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ViolationChat from "@/components/expense/ViolationChat";

const CONFIG = {
  approved: {
    icon:  CheckCircle2,
    color: "text-primary",
    bg:    "bg-primary/10",
    border:"border-primary/20",
    label: "Aprovada automaticamente",
    desc:  "Esta despesa está dentro da política da empresa.",
  },
  review: {
    icon:  Clock,
    color: "text-warning",
    bg:    "bg-warning/10",
    border:"border-warning/30",
    label: "Em análise de violação",
    desc:  "Esta despesa foi sinalizada e está aguardando revisão do gestor. Adicione informações adicionais abaixo.",
  },
  rejected: {
    icon:  XCircle,
    color: "text-destructive",
    bg:    "bg-destructive/10",
    border:"border-destructive/20",
    label: "Fora da política",
    desc:  "Esta despesa viola regras da política vigente.",
  },
};

export default function ComplianceVerdict({ verdict, onNew }) {
  const { status = "review", reason, flags = [], suggestions = [], formData, imageUrl } = verdict;
  const cfg = CONFIG[status] || CONFIG.review;
  const Icon = cfg.icon;

  return (
    <div className="space-y-5">
      {/* Verdict card */}
      <motion.div
        initial={{ scale: 0.97, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`bg-card border ${cfg.border} rounded-2xl p-6 space-y-4`}
      >
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-xl ${cfg.bg} flex items-center justify-center shrink-0`}>
            <Icon className={`w-6 h-6 ${cfg.color}`} />
          </div>
          <div>
            <h2 className={`font-heading text-xl ${cfg.color}`}>{cfg.label}</h2>
            <p className="text-muted-foreground text-sm mt-0.5">{cfg.desc}</p>
          </div>
        </div>

        {reason && (
          <div className="bg-secondary/50 rounded-xl px-4 py-3">
            <p className="text-sm text-foreground leading-relaxed">{reason}</p>
          </div>
        )}

        {flags.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Pontos de atenção</p>
            {flags.map((flag, i) => (
              <div key={i} className="flex items-start gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-warning mt-0.5 shrink-0" />
                <p className="text-sm text-foreground">{flag}</p>
              </div>
            ))}
          </div>
        )}

        {suggestions.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Sugestões</p>
            {suggestions.map((s, i) => (
              <div key={i} className="flex items-start gap-2">
                <ArrowRight className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                <p className="text-sm text-foreground">{s}</p>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Violation chat — only for review status */}
      {status === "review" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <ViolationChat expenseId={`exp-${Date.now()}`} />
        </motion.div>
      )}

      {/* Summary */}
      <div className="bg-card border border-border rounded-xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <SummaryItem label="Fornecedor" value={formData?.vendor || "—"} />
        <SummaryItem label="Valor" value={formData?.amount ? `R$ ${Number(formData.amount).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` : "—"} mono />
        <SummaryItem label="Categoria" value={formData?.category || "—"} />
        <SummaryItem label="Data" value={formData?.date || "—"} mono />
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-1">
        <Button onClick={onNew} variant="outline" className="gap-2 flex-1">
          <Plus className="w-4 h-4" />
          Novo lançamento
        </Button>
        <Link to="/" className="flex-1">
          <Button className="w-full gap-2">
            Ver no Dashboard
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

function SummaryItem({ label, value, mono }) {
  return (
    <div className="space-y-0.5">
      <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</p>
      <p className={`text-sm text-foreground font-medium truncate ${mono ? "font-mono" : ""}`}>{value}</p>
    </div>
  );
}