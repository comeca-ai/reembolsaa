import React, { useState } from "react";
import { AlertTriangle, FileX, Ban, ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const SEVERITY = {
  high:   { label: "Alta",   className: "border-destructive/40 text-destructive bg-destructive/8" },
  medium: { label: "Média",  className: "border-warning/40 text-warning bg-warning/8" },
  low:    { label: "Baixa",  className: "border-border text-muted-foreground bg-secondary" },
};

const TYPE_ICON = {
  above_limit:  AlertTriangle,
  missing_docs: FileX,
  no_approval:  Ban,
};

const TYPE_LABEL = {
  above_limit:  "Acima do limite",
  missing_docs: "Doc. ausente",
  no_approval:  "Sem aprovação",
};

const INITIAL_SHOW = 5;

export default function ViolationsTable({ violations }) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? violations : violations.slice(0, INITIAL_SHOW);

  const highCount   = violations.filter((v) => v.severity === "high").length;
  const mediumCount = violations.filter((v) => v.severity === "medium").length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.25 }}
      className="bg-card border border-border rounded-xl overflow-hidden"
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-heading text-foreground text-base">Alertas de violação de política</h3>
          <p className="text-muted-foreground text-xs mt-0.5">Despesas que violam as regras da política ativa</p>
        </div>
        <div className="flex gap-2 shrink-0">
          {highCount > 0 && (
            <Badge variant="outline" className="border-destructive/40 text-destructive bg-destructive/8 font-mono text-xs">
              {highCount} alta{highCount > 1 ? "s" : ""}
            </Badge>
          )}
          {mediumCount > 0 && (
            <Badge variant="outline" className="border-warning/40 text-warning bg-warning/8 font-mono text-xs">
              {mediumCount} média{mediumCount > 1 ? "s" : ""}
            </Badge>
          )}
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/40">
              <th className="text-left px-5 py-2.5 text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Colaborador</th>
              <th className="text-left px-4 py-2.5 text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Categoria</th>
              <th className="text-left px-4 py-2.5 text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Tipo</th>
              <th className="text-left px-4 py-2.5 text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Valor</th>
              <th className="text-left px-4 py-2.5 text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Descrição</th>
              <th className="text-left px-4 py-2.5 text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Severidade</th>
              <th className="text-left px-4 py-2.5 text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Data</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {visible.map((v, i) => {
                const sev = SEVERITY[v.severity];
                const Icon = TYPE_ICON[v.type] ?? AlertTriangle;
                return (
                  <motion.tr
                    key={v.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15, delay: i * 0.02 }}
                    className="border-b border-border/50 hover:bg-secondary/20 transition-colors"
                  >
                    <td className="px-5 py-3">
                      <p className="text-foreground font-medium text-sm">{v.employee}</p>
                      <p className="text-muted-foreground text-xs">{v.department}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-muted-foreground text-sm">{v.category}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Icon className="w-3.5 h-3.5 shrink-0" />
                        {TYPE_LABEL[v.type]}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-sm text-foreground">
                        R$ {v.amount.toLocaleString("pt-BR")}
                      </span>
                      {v.limit && (
                        <p className="text-muted-foreground text-[11px] font-mono">
                          limite R$ {v.limit}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3 max-w-[220px]">
                      <span className="text-muted-foreground text-xs">{v.description}</span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={`text-[11px] font-medium ${sev.className}`}>
                        {sev.label}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-muted-foreground text-xs font-mono">
                        {format(new Date(v.date), "dd/MM/yy", { locale: ptBR })}
                      </span>
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden divide-y divide-border">
        {visible.map((v) => {
          const sev = SEVERITY[v.severity];
          const Icon = TYPE_ICON[v.type] ?? AlertTriangle;
          return (
            <div key={v.id} className="px-4 py-3.5 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-foreground text-sm font-medium">{v.employee}</p>
                  <p className="text-muted-foreground text-xs">{v.department} · {v.category}</p>
                </div>
                <Badge variant="outline" className={`text-[11px] shrink-0 ${sev.className}`}>{sev.label}</Badge>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Icon className="w-3.5 h-3.5" />
                  {TYPE_LABEL[v.type]}
                </div>
                <span className="font-mono text-sm text-foreground">R$ {v.amount.toLocaleString("pt-BR")}</span>
              </div>
              <p className="text-muted-foreground text-xs">{v.description}</p>
            </div>
          );
        })}
      </div>

      {/* Show more */}
      {violations.length > INITIAL_SHOW && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full flex items-center justify-center gap-1.5 py-3 text-xs text-muted-foreground hover:text-foreground transition-colors border-t border-border"
        >
          {showAll ? <><ChevronUp className="w-3.5 h-3.5" /> Mostrar menos</> : <><ChevronDown className="w-3.5 h-3.5" /> Ver todos ({violations.length})</>}
        </button>
      )}
    </motion.div>
  );
}