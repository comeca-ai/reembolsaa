import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LIMIT_UNIT_LABELS } from "@/lib/mockData";
import { motion } from "framer-motion";

export default function RuleCard({ rule, index, readOnly, onEdit, onDelete }) {
  const hasLimit = rule.limit_amount !== null && rule.limit_unit !== "none";
  const unitLabel = LIMIT_UNIT_LABELS[rule.limit_unit] || "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      className="group bg-card border border-border rounded-xl p-5 hover:border-muted-foreground/30 transition-all duration-200"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <h4 className="text-foreground font-semibold text-sm leading-tight">
          {rule.category || "Sem categoria"}
        </h4>
        {!readOnly && (
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-secondary"
              onClick={() => onEdit(rule)}
            >
              <Pencil className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              onClick={() => onDelete(rule.id)}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        )}
      </div>

      {/* Limit */}
      <div className="mb-4">
        {hasLimit ? (
          <div className="flex items-baseline gap-1.5">
            <span className="text-foreground font-mono text-xl font-semibold">
              R$&nbsp;{rule.limit_amount % 1 === 0
                ? rule.limit_amount.toLocaleString("pt-BR")
                : rule.limit_amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </span>
            <span className="text-muted-foreground text-xs font-mono">{unitLabel}</span>
          </div>
        ) : (
          <Badge variant="outline" className="text-xs font-mono border-primary/30 text-primary bg-primary/5">
            sem teto
          </Badge>
        )}
      </div>

      {/* Conditions */}
      <div className="space-y-3">
        <div>
          <p className="text-muted-foreground text-[11px] uppercase tracking-wider mb-1 font-medium">
            Condições
          </p>
          <p className="text-foreground/80 text-sm leading-relaxed">
            {rule.conditions || "—"}
          </p>
        </div>

        <div>
          <p className="text-muted-foreground text-[11px] uppercase tracking-wider mb-1 font-medium">
            Documentos exigidos
          </p>
          <p className="text-foreground/80 text-sm">
            {rule.required_docs || "—"}
          </p>
        </div>
      </div>
    </motion.div>
  );
}