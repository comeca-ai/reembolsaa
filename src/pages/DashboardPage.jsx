import React from "react";
import { LayoutDashboard, Loader2, Inbox } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import { listDespesas } from "@/api/despesas";
import { computeDashboard } from "@/lib/dashboard-compute";

import KpiCard from "@/components/dashboard/KpiCard";
import ExpensesByCategory from "@/components/dashboard/ExpensesByCategory";
import VolumeByDepartment from "@/components/dashboard/VolumeByDepartment";
import ComplianceTrend from "@/components/dashboard/ComplianceTrend";
import ViolationAlerts from "@/components/dashboard/ViolationAlerts";

const KPI_ORDER = [
  "total_submitted",
  "total_amount",
  "approved_rate",
  "violations",
  "pending_review",
  "avg_ticket",
];

export default function DashboardPage() {
  const { data: despesas = [], isLoading } = useQuery({
    queryKey: ["despesas"],
    queryFn: listDespesas,
  });

  const { kpis, byCategory, byDepartment, trend, alerts } = computeDashboard(despesas);
  const isEmpty = !isLoading && despesas.length === 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12 space-y-8">

        {/* Page header */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-primary" />
            </div>
            <h1 className="font-heading text-foreground text-2xl md:text-3xl">Dashboard de Compliance</h1>
          </div>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl ml-[52px]">
            Visão em tempo real do score de compliance, distribuição de despesas e alertas de violação de política.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex items-center justify-center py-24 text-muted-foreground">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : isEmpty ? (
          <div className="text-center py-20 border border-dashed border-border rounded-2xl">
            <Inbox className="w-10 h-10 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="font-heading text-foreground text-lg mb-1">Nenhuma despesa ainda</h3>
            <p className="text-muted-foreground text-sm mb-5">Lance a primeira despesa da sua empresa para ver os indicadores.</p>
            <Link to="/nova-despesa" className="inline-flex items-center gap-2 bg-primary text-primary-foreground text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-primary/90 transition-colors">
              Lançar despesa
            </Link>
          </div>
        ) : (
          <>
            {/* KPI row */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
              {KPI_ORDER.map((key, i) => {
                const kpi = kpis[key];
                return (
                  <KpiCard
                    key={key}
                    label={kpi.label}
                    value={kpi.value}
                    unit={kpi.unit}
                    delta={kpi.delta}
                    format={kpi.format}
                    index={i}
                  />
                );
              })}
            </div>

            {/* Charts row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {byCategory.length > 0 && <ExpensesByCategory data={byCategory} />}
              {trend.length > 0 && <ComplianceTrend data={trend} />}
            </div>

            {/* Charts row 2 */}
            {byDepartment.length > 0 && <VolumeByDepartment data={byDepartment} />}

            {/* Violation alerts */}
            {alerts.length > 0 && <ViolationAlerts alerts={alerts} />}
          </>
        )}
      </div>
    </div>
  );
}
