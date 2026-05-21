import React from "react";
import { Calendar, ChevronDown } from "lucide-react";

const PERIODS = [
  { label: "Este mês",        value: "this_month" },
  { label: "Mês anterior",    value: "last_month" },
  { label: "Últimos 3 meses", value: "last_3_months" },
  { label: "Este ano",        value: "this_year" },
];

const DEPARTMENTS = ["Todos", "Obras", "Comercial", "Financeiro", "Administrativo", "TI", "RH"];

export default function ReportFilters({ period, department, onPeriodChange, onDepartmentChange }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Period selector */}
      <div className="relative">
        <select
          value={period}
          onChange={(e) => onPeriodChange(e.target.value)}
          className="appearance-none bg-card border border-border rounded-xl pl-9 pr-8 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/40 cursor-pointer"
        >
          {PERIODS.map((p) => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>
        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
      </div>

      {/* Department filter */}
      <div className="relative">
        <select
          value={department}
          onChange={(e) => onDepartmentChange(e.target.value)}
          className="appearance-none bg-card border border-border rounded-xl px-4 pr-8 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/40 cursor-pointer"
        >
          {DEPARTMENTS.map((d) => (
            <option key={d} value={d}>{d === "Todos" ? "Todos os departamentos" : d}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
      </div>
    </div>
  );
}