import React from "react";
import { History, CheckCircle2, XCircle, Clock, Flag } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { motion } from "framer-motion";
import UserAvatar from "@/components/users/UserAvatar";

const STATUS_CONFIG = {
  approved: {
    icon: CheckCircle2,
    color: "text-primary",
    bg: "bg-primary/10",
    label: "Aprovado",
  },
  rejected: {
    icon: XCircle,
    color: "text-destructive",
    bg: "bg-destructive/10",
    label: "Rejeitado",
  },
  flagged: {
    icon: Flag,
    color: "text-warning",
    bg: "bg-warning/10",
    label: "Sinalizado",
  },
  pending: {
    icon: Clock,
    color: "text-muted-foreground",
    bg: "bg-secondary",
    label: "Pendente",
  },
};

export default function ApprovalHistoryPanel({ history, category }) {
  const approvedCount = history.filter((h) => h.status === "approved").length;
  const rejectedCount = history.filter((h) => h.status === "rejected").length;
  const approvalRate = history.length > 0 ? Math.round((approvedCount / history.length) * 100) : 0;

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <History className="w-4 h-4 text-primary" />
            <h3 className="font-heading text-foreground text-base">Histórico da Categoria</h3>
          </div>
          <span className="text-xs text-muted-foreground font-mono bg-secondary px-2 py-0.5 rounded-md">
            {category}
          </span>
        </div>
        <p className="text-muted-foreground text-xs mt-1">
          Últimas aprovações nesta categoria
        </p>
      </div>

      {/* Stats bar */}
      <div className="px-5 py-3 border-b border-border/60 grid grid-cols-3 gap-2">
        <div className="text-center">
          <p className="text-foreground font-mono font-semibold text-lg">{history.length}</p>
          <p className="text-muted-foreground text-[10px]">Total</p>
        </div>
        <div className="text-center border-x border-border/60">
          <p className="text-primary font-mono font-semibold text-lg">{approvedCount}</p>
          <p className="text-muted-foreground text-[10px]">Aprovados</p>
        </div>
        <div className="text-center">
          <p className="text-destructive font-mono font-semibold text-lg">{rejectedCount}</p>
          <p className="text-muted-foreground text-[10px]">Rejeitados</p>
        </div>
      </div>

      {/* Rate bar */}
      <div className="px-5 py-3 border-b border-border/60">
        <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1.5">
          <span>Taxa de aprovação</span>
          <span className="font-mono text-foreground">{approvalRate}%</span>
        </div>
        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-700"
            style={{ width: `${approvalRate}%` }}
          />
        </div>
      </div>

      {/* History items */}
      <div className="divide-y divide-border/50 max-h-72 overflow-y-auto">
        {history.map((item, i) => {
          const cfg = STATUS_CONFIG[item.status] ?? STATUS_CONFIG.pending;
          const Icon = cfg.icon;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: i * 0.04 }}
              className="px-5 py-3 flex items-start gap-3"
            >
              <div className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center mt-0.5 ${cfg.bg}`}>
                <Icon className={`w-3.5 h-3.5 ${cfg.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-foreground text-xs font-medium">{item.employee}</span>
                  <span className={`text-[10px] font-medium ${cfg.color}`}>{cfg.label}</span>
                </div>
                <p className="text-muted-foreground text-[11px] leading-relaxed mt-0.5">{item.note}</p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-muted-foreground font-mono text-[11px]">
                  {format(new Date(item.date), "dd/MM/yy", { locale: ptBR })}
                </p>
                <p className="text-foreground font-mono text-[11px] font-medium">
                  R$ {item.amount.toLocaleString("pt-BR")}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}