import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, AlertTriangle, FileX, ShieldOff, Copy, Calendar, Building2, DollarSign, Tag, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { VIOLATION_ALERTS, VIOLATION_TYPE_LABELS } from "@/lib/dashboardMockData";
import { MOCK_INVOICES, APPROVAL_HISTORY_BY_CATEGORY, ACTION_SUGGESTIONS } from "@/lib/violationDetailMock";

import InvoicePanel from "@/components/violation/InvoicePanel";
import ApprovalHistoryPanel from "@/components/violation/ApprovalHistoryPanel";
import ActionSuggestionPanel from "@/components/violation/ActionSuggestionPanel";
import QuickApprovalModal from "@/components/violation/QuickApprovalModal";

const TYPE_ICONS = {
  over_limit:   AlertTriangle,
  missing_docs: FileX,
  no_approval:  ShieldOff,
  duplicate:    Copy,
};

const SEVERITY_STYLES = {
  high:   { badge: "border-destructive/30 text-destructive bg-destructive/8", dot: "bg-destructive", label: "Alta" },
  medium: { badge: "border-warning/30 text-warning bg-warning/8",             dot: "bg-warning",     label: "Média" },
  low:    { badge: "border-border text-muted-foreground bg-secondary",         dot: "bg-muted-foreground", label: "Baixa" },
};

export default function ViolationDetailPage() {
  const { id } = useParams();

  const [approvalModalOpen, setApprovalModalOpen] = useState(false);

  const alert = VIOLATION_ALERTS.find((v) => v.id === id);

  if (!alert) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Alerta não encontrado.</p>
        <Link to="/" className="text-primary text-sm hover:underline">← Voltar ao Dashboard</Link>
      </div>
    );
  }

  const TypeIcon = TYPE_ICONS[alert.type] ?? AlertTriangle;
  const sev = SEVERITY_STYLES[alert.severity];
  const invoice = MOCK_INVOICES[alert.id];
  const history = APPROVAL_HISTORY_BY_CATEGORY[alert.category] ?? [];
  const suggestion = ACTION_SUGGESTIONS[alert.type];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12 space-y-7">

        {/* Back + breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Dashboard
          </Link>

          {/* Alert header card */}
          <div className="bg-card border border-border rounded-xl p-5 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              {/* Icon */}
              <div className={`w-12 h-12 rounded-xl shrink-0 flex items-center justify-center ${
                alert.severity === "high" ? "bg-destructive/10" :
                alert.severity === "medium" ? "bg-warning/10" : "bg-secondary"
              }`}>
                <TypeIcon className={`w-5 h-5 ${
                  alert.severity === "high" ? "text-destructive" :
                  alert.severity === "medium" ? "text-warning" : "text-muted-foreground"
                }`} />
              </div>

              {/* Main info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="font-heading text-foreground text-xl md:text-2xl">
                    {alert.employee}
                  </h1>
                  <Badge variant="outline" className={`text-[11px] ${sev.badge}`}>
                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 inline-block ${sev.dot}`} />
                    {sev.label} prioridade
                  </Badge>
                  <Badge variant="outline" className="text-[11px] text-muted-foreground border-border">
                    {VIOLATION_TYPE_LABELS[alert.type]}
                  </Badge>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {alert.description}
                </p>

                {/* Meta grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                  <MetaItem icon={Building2} label="Departamento" value={alert.department} />
                  <MetaItem icon={Tag}       label="Categoria"    value={alert.category} />
                  <MetaItem icon={DollarSign} label="Valor"
                    value={`R$ ${alert.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
                    mono
                  />
                  <MetaItem icon={Calendar}  label="Data"
                    value={format(new Date(alert.date), "dd/MM/yyyy", { locale: ptBR })}
                    mono
                  />
                </div>

                {alert.limit && (
                  <div className="mt-3 inline-flex items-center gap-2 bg-destructive/8 border border-destructive/20 rounded-lg px-3 py-1.5">
                    <span className="text-xs text-muted-foreground">Limite da política:</span>
                    <span className="text-xs font-mono font-semibold text-destructive">
                      R$ {alert.limit.toLocaleString("pt-BR")}
                    </span>
                    <span className="text-xs text-destructive font-medium">
                      (+{Math.round(((alert.amount - alert.limit) / alert.limit) * 100)}% acima)
                    </span>
                  </div>
                )}
              </div>

              {/* Alert ID + Approve button */}
              <div className="flex flex-col items-end gap-2 shrink-0 self-start">
                <span className="text-[11px] font-mono text-muted-foreground bg-secondary px-2 py-1 rounded-md">
                  #{alert.id}
                </span>
                <Button
                  size="sm"
                  className="text-xs"
                  onClick={() => setApprovalModalOpen(true)}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Aprovar despesa
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Three panels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
          >
            <InvoicePanel invoice={invoice} alert={alert} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.18 }}
          >
            <ApprovalHistoryPanel history={history} category={alert.category} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.26 }}
          >
            <ActionSuggestionPanel suggestion={suggestion} alert={alert} />
          </motion.div>
        </div>

      </div>

      <QuickApprovalModal
        open={approvalModalOpen}
        onClose={() => setApprovalModalOpen(false)}
        alert={alert}
      />
    </div>
  );
}

function MetaItem({ icon: Icon, label, value, mono = false }) {
  return (
    <div className="bg-secondary/40 rounded-lg px-3 py-2.5">
      <div className="flex items-center gap-1.5 mb-0.5">
        <Icon className="w-3 h-3 text-muted-foreground" />
        <span className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</span>
      </div>
      <p className={`text-foreground text-sm font-medium truncate ${mono ? "font-mono" : ""}`}>{value}</p>
    </div>
  );
}