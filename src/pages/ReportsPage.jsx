import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";
import {
  EXPENSE_BY_CATEGORY_MONTHLY,
  EXPENSE_BY_DEPARTMENT_MONTHLY,
  EXPENSE_BY_COLLABORATOR,
  CATEGORY_TOTALS,
  REPORT_KPIS,
} from "@/lib/mocks/reportsMockData";
import { VOLUME_BY_DEPARTMENT } from "@/lib/mocks/dashboardMockData";
import ReportKpiRow from "@/components/reports/ReportKpiRow";
import CategoryLineChart from "@/components/reports/CategoryLineChart";
import DepartmentAreaChart from "@/components/reports/DepartmentAreaChart";
import CollaboratorTable from "@/components/reports/CollaboratorTable";
import CategoryDonut from "@/components/reports/CategoryDonut";
import ReportFilters from "@/components/reports/ReportFilters";
import ExportButtons from "@/components/reports/ExportButtons";

export default function ReportsPage() {
  const [period, setPeriod] = useState("this_month");
  const [department, setDepartment] = useState("Todos");

  // Filter collaborator data by department
  const filteredCollaborators = useMemo(() => {
    if (department === "Todos") return EXPENSE_BY_COLLABORATOR;
    return EXPENSE_BY_COLLABORATOR.filter((c) => c.department === department);
  }, [department]);

  // Filter chart data — for demo we just use full dataset;
  // in prod these would be real queries driven by period + department
  const categoryData = EXPENSE_BY_CATEGORY_MONTHLY;
  const departmentData = EXPENSE_BY_DEPARTMENT_MONTHLY;

  const periodLabel = {
    this_month:    "Maio/2026",
    last_month:    "Abril/2026",
    last_3_months: "Mar – Mai/2026",
    this_year:     "2026",
  }[period];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12 space-y-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="font-heading text-foreground text-2xl md:text-3xl">Relatórios</h1>
                <p className="text-muted-foreground text-sm">Período: {periodLabel}</p>
              </div>
            </div>
            <ExportButtons
              collaborators={filteredCollaborators}
              categories={CATEGORY_TOTALS}
              departments={VOLUME_BY_DEPARTMENT}
            />
          </div>

          {/* Filters */}
          <div className="mt-5">
            <ReportFilters
              period={period}
              department={department}
              onPeriodChange={setPeriod}
              onDepartmentChange={setDepartment}
            />
          </div>
        </motion.div>

        {/* KPIs */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <ReportKpiRow kpis={REPORT_KPIS} />
        </motion.div>

        {/* Charts row 1 */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-5"
        >
          <div className="lg:col-span-2">
            <CategoryLineChart data={categoryData} />
          </div>
          <CategoryDonut data={CATEGORY_TOTALS} />
        </motion.div>

        {/* Charts row 2 */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <DepartmentAreaChart data={departmentData} />
        </motion.div>

        {/* Collaborator table */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <CollaboratorTable data={filteredCollaborators} />
        </motion.div>

      </div>
    </div>
  );
}