import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Clock, Filter, Search, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { VIOLATION_ALERTS, VIOLATION_TYPE_LABELS } from "@/lib/dashboardMockData";
import { MOCK_INVOICES } from "@/lib/violationDetailMock";
import { EXTRACTED_RULES } from "@/lib/mockData";
import ApprovalCard from "@/components/approval/ApprovalCard";
import ApprovalModal from "@/components/approval/ApprovalModal";
import PolicyDrawer from "@/components/approval/PolicyDrawer";

const STATUS_TABS = [
  { key: "pending", label: "Pendentes", count: null },
  { key: "approved", label: "Aprovadas", count: null },
  { key: "rejected", label: "Recusadas", count: null },
];

export default function ApprovalPage() {
  const [decisions, setDecisions] = useState({}); // { [id]: "approved" | "rejected" }
  const [activeTab, setActiveTab] = useState("pending");
  const [search, setSearch] = useState("");
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [policyOpen, setPolicyOpen] = useState(false);

  const filteredAlerts = VIOLATION_ALERTS.filter((a) => {
    const decision = decisions[a.id];
    const matchesTab =
      activeTab === "pending" ? !decision :
      activeTab === "approved" ? decision === "approved" :
      decision === "rejected";
    const matchesSearch =
      !search ||
      a.employee.toLowerCase().includes(search.toLowerCase()) ||
      a.category.toLowerCase().includes(search.toLowerCase()) ||
      a.department.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const counts = {
    pending: VIOLATION_ALERTS.filter((a) => !decisions[a.id]).length,
    approved: VIOLATION_ALERTS.filter((a) => decisions[a.id] === "approved").length,
    rejected: VIOLATION_ALERTS.filter((a) => decisions[a.id] === "rejected").length,
  };

  const handleDecision = (id, decision, justification) => {
    setDecisions((prev) => ({ ...prev, [id]: decision }));
    setSelectedAlert(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 md:py-12">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="font-heading text-foreground text-2xl md:text-3xl">Aprovações</h1>
                <p className="text-muted-foreground text-sm mt-0.5">
                  {counts.pending} solicitações aguardando sua análise
                </p>
              </div>
            </div>
            <button
              onClick={() => setPolicyOpen(true)}
              className="inline-flex items-center gap-2 text-sm border border-border rounded-lg px-4 py-2 text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all"
            >
              <span>📄</span>
              Ver política de despesas
            </button>
          </div>
        </motion.div>

        {/* Tabs + Search */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex gap-1 bg-secondary rounded-lg p-1">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  activeTab === tab.key
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
                <span className={`text-[11px] px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.key ? "bg-primary/15 text-primary" : "bg-border text-muted-foreground"
                }`}>
                  {counts[tab.key]}
                </span>
              </button>
            ))}
          </div>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por colaborador, categoria ou departamento..."
              className="w-full bg-card border border-border rounded-lg pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40"
            />
          </div>
        </div>

        {/* Cards */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredAlerts.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16 text-muted-foreground"
              >
                <Clock className="w-8 h-8 mx-auto mb-3 opacity-40" />
                <p className="text-sm">
                  {activeTab === "pending" ? "Nenhuma solicitação pendente." : "Nenhum registro encontrado."}
                </p>
              </motion.div>
            ) : (
              filteredAlerts.map((alert) => (
                <ApprovalCard
                  key={alert.id}
                  alert={alert}
                  invoice={MOCK_INVOICES[alert.id]}
                  decision={decisions[alert.id]}
                  onReview={() => setSelectedAlert(alert)}
                />
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Approval Modal */}
      <AnimatePresence>
        {selectedAlert && (
          <ApprovalModal
            alert={selectedAlert}
            invoice={MOCK_INVOICES[selectedAlert.id]}
            onDecision={handleDecision}
            onClose={() => setSelectedAlert(null)}
          />
        )}
      </AnimatePresence>

      {/* Policy Drawer */}
      <PolicyDrawer
        open={policyOpen}
        onClose={() => setPolicyOpen(false)}
        rules={EXTRACTED_RULES}
      />
    </div>
  );
}