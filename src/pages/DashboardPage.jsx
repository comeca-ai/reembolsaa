import React from "react";
import { LayoutDashboard } from "lucide-react";
import { motion } from "framer-motion";
import {
  KPI_DATA,
  EXPENSES_BY_CATEGORY,
  VOLUME_BY_DEPARTMENT,
  COMPLIANCE_TREND,
  VIOLATION_ALERTS,
} from "@/lib/dashboardMockData";

import KpiCard from "@/components/dashboard/KpiCard";
import ExpensesByCategory from "@/components/dashboard/ExpensesByCategory";
import VolumeByDepartment from "@/components/dashboard/VolumeByDepartment";
import ComplianceTrend from "@/components/dashboard/ComplianceTrend";
import ViolationAlerts from "@/components/dashboard/ViolationAlerts";

const KPI_CONFIGS = [
  { key: "total_submitted", format: "number",   icon: null },
  { key: "total_amount",    format: "currency",  icon: null },
  { key: "approved_rate",   format: "percent",   icon: null },
  { key: "violations",      format: "number",    icon: null },
  { key: "avg_processing",  format: "number",    icon: null },
  { key: "pending_review",  format: "number",    icon: null },
];

export default function DashboardPage() {
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
              <LayoutDashboard className="w-5 h-5 text-primary" />
            </div>
            <h1 className="font-heading text-foreground text-2xl md:text-3xl">
              Dashboard de Compliance
            </h1>
          </div>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl ml-[52px]">
            Visão em tempo real do score de compliance, distribuição de despesas e alertas de violação de política.
          </p>
        </motion.div>

        {/* KPI row */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          {KPI_CONFIGS.map(({ key, format }, i) => {
            const kpi = KPI_DATA[key];
            return (
              <KpiCard
                key={key}
                label={kpi.label}
                value={kpi.value}
                unit={kpi.unit}
                delta={kpi.delta}
                format={format}
                index={i}
              />
            );
          })}
        </div>

        {/* Charts row 1: Category donut + Compliance trend */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <ExpensesByCategory data={EXPENSES_BY_CATEGORY} />
          <ComplianceTrend data={COMPLIANCE_TREND} />
        </div>

        {/* Charts row 2: Volume by department (full width) */}
        <VolumeByDepartment data={VOLUME_BY_DEPARTMENT} />

        {/* Violation alerts (full width) */}
        <ViolationAlerts alerts={VIOLATION_ALERTS} />

      </div>
    </div>
  );
}