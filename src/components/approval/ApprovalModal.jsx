import React, { useState } from "react";
import { motion } from "framer-motion";
import { X, CheckCircle2, XCircle, AlertTriangle, FileX, ShieldOff, Copy, ExternalLink, FileText } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { VIOLATION_TYPE_LABELS } from "@/lib/dashboardMockData";

const TYPE_ICONS = {
  over_limit:   AlertTriangle,
  missing_docs: FileX,
  no_approval:  ShieldOff,
  duplicate:    Copy,
};

export default function ApprovalModal({ alert, invoice, onDecision, onClose }) {
  const [justification, setJustification] = useState("");
  const [action, setAction] = useState(null); // "approve" | "reject"
  const [error, setError] = useState("");

  const Icon = TYPE_ICONS[alert.type] ?? AlertTriangle;

  const handleSubmit = () => {
    if (!justification.trim()) {
      setError("Por favor, adicione uma justificativa antes de confirmar.");
      return;
    }
    onDecision(alert.id, action === "approve" ? "approved" : "rejected", justification);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 8 }}
        className="relative bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-card z-10">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              alert.severity === "high" ? "bg-destructive/10" :
              alert.severity === "medium" ? "bg-warning/10" : "bg-secondary"
            }`}>
              <Icon className={`w-4 h-4 ${
                alert.severity === "high" ? "text-destructive" :
                alert.severity === "medium" ? "text-warning" : "text-muted-foreground"
              }`} />
            </div>
            <div>
              <h2 className="font-heading text-foreground text-lg leading-none">{alert.employee}</h2>
              <p className="text-muted-foreground text-xs mt-0.5">{VIOLATION_TYPE_LABELS[alert.type]} · {alert.category}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-lg hover:bg-secondary">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Expense details */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Valor", value: `R$ ${alert.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`, mono: true },
              { label: "Data",  value: format(new Date(alert.date), "dd/MM/yyyy", { locale: ptBR }), mono: true },
              { label: "Depto", value: alert.department },
              { label: "Categoria", value: alert.category },
            ].map(({ label, value, mono }) => (
              <div key={label} className="bg-secondary/50 rounded-lg px-3 py-2.5">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">{label}</p>
                <p className={`text-sm text-foreground font-medium ${mono ? "font-mono" : ""}`}>{value}</p>
              </div>
            ))}
          </div>

          {alert.limit && (
            <div className="bg-destructive/8 border border-destructive/20 rounded-lg px-4 py-3 text-sm text-destructive">
              ⚠ Valor {Math.round(((alert.amount - alert.limit) / alert.limit) * 100)}% acima do limite da política (R$ {alert.limit.toLocaleString("pt-BR")})
            </div>
          )}

          {/* Invoice / attachment */}
          {invoice?.imageUrl ? (
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Comprovante anexado</p>
              <div className="relative rounded-xl overflow-hidden border border-border group">
                <img
                  src={invoice.imageUrl}
                  alt="Comprovante"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <a
                    href={invoice.imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-2 text-sm font-medium text-foreground"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Abrir em nova aba
                  </a>
                </div>
                {invoice.issuedBy && (
                  <div className="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm px-4 py-2">
                    <p className="text-xs text-foreground font-medium">{invoice.issuedBy}</p>
                    <p className="text-[11px] text-muted-foreground">{invoice.fileName}</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="border border-dashed border-border rounded-xl p-6 text-center">
              <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-40" />
              <p className="text-sm text-muted-foreground">Nenhum comprovante anexado</p>
            </div>
          )}

          {/* Description */}
          <div className="bg-secondary/40 rounded-lg px-4 py-3">
            <p className="text-xs text-muted-foreground mb-1">Descrição da ocorrência</p>
            <p className="text-sm text-foreground">{alert.description}</p>
          </div>

          {/* Decision buttons */}
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3">Decisão</p>
            <div className="flex gap-3">
              <button
                onClick={() => { setAction("approve"); setError(""); }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                  action === "approve"
                    ? "bg-primary/10 border-primary/40 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                Aprovar
              </button>
              <button
                onClick={() => { setAction("reject"); setError(""); }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                  action === "reject"
                    ? "bg-destructive/10 border-destructive/30 text-destructive"
                    : "border-border text-muted-foreground hover:border-destructive/20 hover:text-foreground"
                }`}
              >
                <XCircle className="w-4 h-4" />
                Recusar
              </button>
            </div>
          </div>

          {/* Justification */}
          {action && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-2">
                Justificativa {action === "reject" ? "(obrigatória para recusa)" : "(obrigatória)"}
              </label>
              <textarea
                value={justification}
                onChange={(e) => { setJustification(e.target.value); setError(""); }}
                placeholder={
                  action === "approve"
                    ? "Ex: Despesa justificada pelo contexto do projeto, aprovada como exceção..."
                    : "Ex: Valor acima do limite sem aprovação prévia, solicitar reenvio com documentação adequada..."
                }
                rows={3}
                className="w-full bg-secondary/40 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 resize-none"
              />
              {error && <p className="text-destructive text-xs mt-1.5">{error}</p>}
            </motion.div>
          )}

          {/* Submit */}
          {action && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={handleSubmit}
              className={`w-full py-3 rounded-xl text-sm font-semibold transition-all hover:scale-[1.01] ${
                action === "approve"
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-destructive text-destructive-foreground hover:bg-destructive/90"
              }`}
            >
              {action === "approve" ? "✓ Confirmar aprovação" : "✗ Confirmar recusa"}
            </motion.button>
          )}
        </div>
      </motion.div>
    </div>
  );
}