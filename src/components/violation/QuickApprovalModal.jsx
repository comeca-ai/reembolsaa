import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle2, Building2, MessageSquare, DollarSign, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const COST_CENTERS = [
  { value: "CC-001", label: "CC-001 — Tecnologia" },
  { value: "CC-002", label: "CC-002 — Comercial" },
  { value: "CC-003", label: "CC-003 — Operações" },
  { value: "CC-004", label: "CC-004 — Marketing" },
  { value: "CC-005", label: "CC-005 — Financeiro" },
  { value: "CC-006", label: "CC-006 — Recursos Humanos" },
  { value: "CC-007", label: "CC-007 — Diretoria" },
];

export default function QuickApprovalModal({ open, onClose, alert }) {
  const [comment, setComment] = useState("");
  const [costCenter, setCostCenter] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  if (!alert) return null;

  const handleConfirm = () => {
    if (!comment.trim()) {
      toast.error("Adicione um comentário antes de aprovar.");
      return;
    }
    setConfirmed(true);
    setTimeout(() => {
      toast.success(`Despesa de ${alert.employee} aprovada com sucesso.`);
      onClose();
      setConfirmed(false);
      setComment("");
      setCostCenter("");
    }, 1200);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border text-foreground max-w-lg w-full">
        <DialogHeader>
          <DialogTitle className="font-heading text-lg flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-primary" />
            Aprovação Definitiva
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Revise os dados abaixo e confirme a aprovação desta despesa.
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {confirmed ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-10 gap-3"
            >
              <div className="w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7 text-primary" />
              </div>
              <p className="text-foreground font-medium text-sm">Aprovando despesa…</p>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-5 pt-1"
            >
              {/* Expense summary */}
              <div className="bg-secondary/40 border border-border rounded-lg p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-xs">Colaborador</span>
                  <span className="text-foreground text-sm font-medium">{alert.employee}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-xs">Categoria</span>
                  <Badge variant="outline" className="text-[11px] border-border text-muted-foreground">
                    {alert.category}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-xs">Departamento</span>
                  <span className="text-foreground text-sm">{alert.department}</span>
                </div>
                <div className="flex items-center justify-between border-t border-border/60 pt-2.5">
                  <span className="text-muted-foreground text-xs flex items-center gap-1">
                    <DollarSign className="w-3 h-3" />
                    Valor solicitado
                  </span>
                  <span className="text-foreground font-mono font-semibold text-sm">
                    R$ {alert.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                {alert.limit && (
                  <div className="flex items-center gap-1.5 bg-destructive/8 border border-destructive/20 rounded px-3 py-2">
                    <AlertTriangle className="w-3 h-3 text-destructive shrink-0" />
                    <span className="text-destructive text-xs">
                      {Math.round(((alert.amount - alert.limit) / alert.limit) * 100)}% acima do limite de R${" "}
                      {alert.limit.toLocaleString("pt-BR")}
                    </span>
                  </div>
                )}
              </div>

              {/* Cost center selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" />
                  Centro de custo
                  <span className="text-muted-foreground/60">(opcional — alterar se necessário)</span>
                </label>
                <Select value={costCenter} onValueChange={setCostCenter}>
                  <SelectTrigger className="bg-secondary/40 border-border text-sm">
                    <SelectValue placeholder="Manter centro de custo atual" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {COST_CENTERS.map((cc) => (
                      <SelectItem key={cc.value} value={cc.value} className="text-sm">
                        {cc.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Comment */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5" />
                  Comentário do gestor
                  <span className="text-destructive/70">*</span>
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Ex: Despesa verificada e aprovada. Justificativa aceita pelo departamento."
                  rows={3}
                  className="w-full bg-secondary/40 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 resize-none focus:outline-none focus:ring-1 focus:ring-ring transition-colors"
                />
                <p className="text-[11px] text-muted-foreground text-right">{comment.length}/300</p>
              </div>

              {/* Actions */}
              <div className="flex gap-2.5 pt-1">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 border-border text-muted-foreground text-sm"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleConfirm}
                  disabled={!comment.trim()}
                  className="flex-1 text-sm"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Confirmar aprovação
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}