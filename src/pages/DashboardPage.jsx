import React from "react";
import { LayoutDashboard, Loader2, Inbox, PlusCircle, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import { listDespesas } from "@/api/despesas";
import { computeDashboard } from "@/lib/dashboard-compute";
import { Button } from "@/components/ui/button";

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

// Animação stagger para os elementos
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  const { data: despesas = [], isLoading } = useQuery({
    queryKey: ["despesas"],
    queryFn: listDespesas,
  });

  const { kpis, byCategory, byDepartment, trend, alerts } = computeDashboard(despesas);
  const isEmpty = !isLoading && despesas.length === 0;
  const hasPending = alerts.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-10 space-y-6">

        {/* Header com CTA */}
        <motion.div 
          initial={{ opacity: 0, y: -8 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <LayoutDashboard className="w-4 h-4 text-primary" />
              </div>
              <h1 className="font-heading text-foreground text-xl md:text-2xl">Dashboard</h1>
            </div>
            <p className="text-muted-foreground text-sm ml-12">
              Visão geral das despesas e compliance da empresa
            </p>
          </div>
          
          <Button asChild className="h-10 rounded-full px-5 shadow-sm">
            <Link to="/nova-despesa">
              <PlusCircle className="w-4 h-4 mr-2" />
              Nova despesa
            </Link>
          </Button>
        </motion.div>

        {/* Alerta de ações pendentes */}
        {hasPending && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-warning/10 border border-warning/20 rounded-xl p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-warning/20 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="font-medium text-foreground">{alerts.length} {alerts.length === 1 ? 'despesa precisa' : 'despesas precisam'} de atenção</p>
                <p className="text-sm text-muted-foreground">Despesas fora da política aguardando análise</p>
              </div>
            </div>
            <Button asChild variant="outline" size="sm" className="rounded-full">
              <Link to="/aprovacoes">Ver aprovações</Link>
            </Button>
          </motion.div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-24 text-muted-foreground">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : isEmpty ? (
          /* Empty State melhorado */
          <motion.div 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 md:py-24"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Inbox className="w-10 h-10 text-primary/60" />
            </div>
            <h3 className="font-heading text-foreground text-xl mb-2">Comece com sua primeira despesa</h3>
            <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6">
              Seu dashboard está pronto! Lance uma despesa para ver os indicadores de compliance e análises.
            </p>
            <Button asChild size="lg" className="h-12 rounded-full px-8 shadow-lg shadow-primary/20">
              <Link to="/nova-despesa">
                <PlusCircle className="w-5 h-5 mr-2" />
                Lançar primeira despesa
              </Link>
            </Button>
            
            {/* Dicas rápidas */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
              {[
                { icon: CheckCircle2, text: "Envie por WhatsApp ou web" },
                { icon: TrendingUp, text: "A IA preenche automaticamente" },
                { icon: CheckCircle2, text: "Aprovação em segundos" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground justify-center">
                  <item.icon className="w-4 h-4 text-primary" />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-6"
          >
            {/* KPI row */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
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
            </motion.div>

            {/* Charts row 1 */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {byCategory.length > 0 && <ExpensesByCategory data={byCategory} />}
              {trend.length > 0 && <ComplianceTrend data={trend} />}
            </motion.div>

            {/* Charts row 2 */}
            {byDepartment.length > 0 && (
              <motion.div variants={itemVariants}>
                <VolumeByDepartment data={byDepartment} />
              </motion.div>
            )}

            {/* Violation alerts */}
            {alerts.length > 0 && (
              <motion.div variants={itemVariants}>
                <ViolationAlerts alerts={alerts} />
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
