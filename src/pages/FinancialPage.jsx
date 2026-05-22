import React from "react";
import { TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import {
  BUDGET_BY_COST_CENTER,
  PROCESSING_TIME_BY_MONTH,
  COMPLIANCE_BY_MONTH,
  PAYMENT_STATUS_DONUT,
  FINANCIAL_KPIS,
} from "@/lib/mocks/financialMockData";

import FinancialKpiCard from "@/components/financial/FinancialKpiCard";
import BudgetByCostCenter from "@/components/financial/BudgetByCostCenter";
import ProcessingTimeChart from "@/components/financial/ProcessingTimeChart";
import ComplianceMonthlyChart from "@/components/financial/ComplianceMonthlyChart";
import PaymentStatusDonut from "@/components/financial/PaymentStatusDonut";

const KPI_CONFIGS = [
  { key: "total_budget",     format: "currency", accent: false },
  { key: "total_spent",      format: "currency", accent: false },
  { key: "budget_used_pct",  format: "percent",  accent: false },
  { key: "awaiting_payment", format: "currency", accent: false },
  { key: "avg_processing",   format: "number",   accent: false },
  { key: "compliance_rate",  format: "percent",  accent: true  },
];

export default function FinancialPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12 space-y-8">

        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <h1 className="font-heading text-foreground text-2xl md:text-3xl">
              Visão Financeira
            </h1>
          </div>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl ml-[52px]">
            Consumo orçamentário por centro de custo, tempo de processamento de reembolsos e indicadores de conformidade mensal.
          </p>
        </motion.div>

        {/* KPI row */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          {KPI_CONFIGS.map(({ key, format, accent }, i) => {
            const kpi = FINANCIAL_KPIS[key];
            return (
              <FinancialKpiCard
                key={key}
                label={kpi.label}
                value={kpi.value}
                unit={kpi.unit}
                format={format}
                accent={accent}
                index={i}
              />
            );
          })}
        </div>

        {/* Budget by cost center (full width) */}
        <BudgetByCostCenter data={BUDGET_BY_COST_CENTER} />

        {/* Processing time + Payment donut */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <ProcessingTimeChart data={PROCESSING_TIME_BY_MONTH} />
          <PaymentStatusDonut data={PAYMENT_STATUS_DONUT} />
        </div>

        {/* Compliance monthly (full width) */}
        <ComplianceMonthlyChart data={COMPLIANCE_BY_MONTH} />

      </div>
    </div>
  );
}