import React, { useState } from "react";
import { AlertTriangle, FileX, ShieldOff, Copy, ChevronRight, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { VIOLATION_TYPE_LABELS } from "@/lib/dashboardMockData";
import UserAvatar from "@/components/users/UserAvatar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const TYPE_ICONS = {
  over_limit:   AlertTriangle,
  missing_docs: FileX,
  no_approval:  ShieldOff,
  duplicate:    Copy,
};

const SEVERITY_STYLES = {
  high:   { badge: "border-destructive/30 text-destructive bg-destructive/8", dot: "bg-destructive" },
  medium: { badge: "border-warning/30 text-warning bg-warning/8",             dot: "bg-warning" },
  low:    { badge: "border-border text-muted-foreground bg-secondary",         dot: "bg-muted-foreground" },
};

const SEVERITY_LABELS = { high: "Alta", medium: "Média", low: "Baixa" };

const FILTER_OPTIONS = [
  { value: "all",          label: "Todos" },
  { value: "over_limit",   label: VIOLATION_TYPE_LABELS.over_limit },
  { value: "missing_docs", label: VIOLATION_TYPE_LABELS.missing_docs },
  { value: "no_approval",  label: VIOLATION_TYPE_LABELS.no_approval },
  { value: "duplicate",    label: VIOLATION_TYPE_LABELS.duplicate },
];

export default function ViolationAlerts({ alerts }) {
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? alerts : alerts.filter((a) => a.type === filter);
  const highCount = alerts.filter((a) => a.severity === "high").length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.25 }}
      className="bg-card border border-border rounded-xl overflow-hidden"
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <h3 className="font-heading text-foreground text-base">Alertas de violação</h3>
            {highCount > 0 && (
              <Badge variant="outline" className="border-destructive/30 text-destructive bg-destructive/8 text-[11px] font-mono">
                {highCount} alta prioridade
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground text-xs mt-0.5">
            {alerts.length} ocorrências este mês — revisão necessária
          </p>
        </div>

        {/* Type filter pills */}
        <div className="flex gap-1 flex-wrap">
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                filter === opt.value
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="divide-y divide-border/60">
        <AnimatePresence mode="popLayout">
          {filtered.map((alert, i) => {
            const Icon = TYPE_ICONS[alert.type] ?? AlertTriangle;
            const sev = SEVERITY_STYLES[alert.severity];
            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.2, delay: i * 0.03 }}
                className="px-5 py-3.5 flex items-start gap-4 hover:bg-secondary/20 transition-colors group cursor-pointer"
              >
                {/* Icon */}
                <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center mt-0.5 ${
                  alert.severity === "high" ? "bg-destructive/10" :
                  alert.severity === "medium" ? "bg-warning/10" : "bg-secondary"
                }`}>
                  <Icon className={`w-3.5 h-3.5 ${
                    alert.severity === "high" ? "text-destructive" :
                    alert.severity === "medium" ? "text-warning" : "text-muted-foreground"
                  }`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-0.5">
                    <span className="text-foreground text-sm font-medium">{alert.employee}</span>
                    <span className="text-muted-foreground text-xs">·</span>
                    <span className="text-muted-foreground text-xs">{alert.department}</span>
                    <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${sev.badge}`}>
                      {VIOLATION_TYPE_LABELS[alert.type]}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-xs leading-relaxed truncate">
                    {alert.description}
                    {alert.amount && (
                      <span className="text-foreground font-mono ml-1">
                        — R$ {alert.amount.toLocaleString("pt-BR")}
                      </span>
                    )}
                  </p>
                </div>

                {/* Right */}
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <div className="flex items-center gap-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${sev.dot}`} />
                    <span className={`text-[11px] font-medium ${
                      alert.severity === "high" ? "text-destructive" :
                      alert.severity === "medium" ? "text-warning" : "text-muted-foreground"
                    }`}>{SEVERITY_LABELS[alert.severity]}</span>
                  </div>
                  <span className="text-[11px] text-muted-foreground font-mono">
                    {format(new Date(alert.date), "dd/MM", { locale: ptBR })}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-border bg-secondary/30">
        <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
          Ver todos os alertas
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </motion.div>
  );
}