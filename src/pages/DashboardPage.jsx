import React from "react";
import { LayoutDashboard, Receipt, CheckCircle2, Clock, XCircle, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import {
  EXPENSE_BY_CATEGORY,
  REIMBURSEMENT_BY_DEPT,
  MONTHLY_VOLUME,
  POLICY_VIOLATIONS,
  COMPLIANCE_SCORE,
  KPI_SUMMARY,
} from "@/lib/dashboardMockData";

import KpiCard from "@/components/dashboard/KpiCard";
import ComplianceScore from "@/components/dashboard/ComplianceScore";
import CategoryChart from "@/components/dashboard/CategoryChart";
import DeptChart from "@/components/dashboard/DeptChart";
import MonthlyTrendChart from "@/components/dashboard/MonthlyTrendChart";
import ViolationsTable from "@/components/dashboard/ViolationsTable";

const formatBRL = (v) =>
  `R$ ${v >= 1000 ? (v / 1000).toFixed(0) + "k" : v.toLocaleString("pt-BR")}`;

const KPIS = [
  {
    label: "Total submetido",
    value: formatBRL(KPI_SUMMARY.total_amount),
    sub: `${KPI_SUMMARY.total_submitted} despesas`,
    icon: Receipt,
    accent: "bg-primary/10",
  },
  {
    label: "Aprovadas",
    value: KPI_SUMMARY.total_approved,
    sub: `${Math.round((KPI_SUMMARY.total_approved / KPI_SUMMARY.total_submitted) * 100)}% do total`,
    icon: CheckCircle2,
    accent: "bg-primary/10",
  },
  {
    label: "Pendentes de revisão",
    value: KPI_SUMMARY.total_pending,
    sub: "aguardando gestor",
    icon: Clock,
    accent: "bg-warning/10",
  },
  {
    label: "Violações em aberto",
    value: KPI_SUMMARY.violations_open,
    sub: `${KPI_SUMMARY.violations_30d} nos últimos 30 dias`,
    icon: AlertTriangle,
    accent: "bg-destructive/10",
  },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12 space-y-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-primary" />
            </div>
            <h1 className="font-heading text-foreground text-2xl md:text-3xl">
              Dashboard de Compliance
            </h1>
          </div>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl ml-[52px]">
            Visão consolidada de reembolsos, aderência à política e alertas de violação.
          </p>
        </motion.div>

        {/* KPIs + compliance score */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3">
          {KPIS.map((kpi, i) => (
            <div key={kpi.label} className="xl:col-span-1">
              <KpiCard {...kpi} index={i} />
            </div>
          ))}
          <div className="sm:col-span-2 xl:col-span-1">
            <ComplianceScore score={COMPLIANCE_SCORE} />
          </div>
        </div>

        {/* Monthly trend */}
        <MonthlyTrendChart data={MONTHLY_VOLUME} />

        {/* Category + Dept charts */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <CategoryChart data={EXPENSE_BY_CATEGORY} />
          <DeptChart data={REIMBURSEMENT_BY_DEPT} />
        </div>

        {/* Violations table */}
        <ViolationsTable violations={POLICY_VIOLATIONS} />

      </div>
    </div>
  );
}