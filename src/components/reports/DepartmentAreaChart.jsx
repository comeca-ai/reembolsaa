import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { CHART_COLORS } from "@/lib/mocks/dashboardMockData";

const DEPARTMENTS = ["Obras", "Comercial", "Financeiro", "Administrativo", "TI", "RH"];

export default function DepartmentAreaChart({ data }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
      <div>
        <p className="text-sm font-medium text-foreground">Volume por Departamento</p>
        <p className="text-xs text-muted-foreground">Distribuição diária por área no período</p>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="day" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
          <YAxis tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
          <Tooltip
            contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
            formatter={(v, name) => [`R$ ${Number(v).toLocaleString("pt-BR")}`, name]}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          {DEPARTMENTS.map((dept, i) => (
            <Area key={dept} type="monotone" dataKey={dept} stackId="1" stroke={CHART_COLORS[i]} fill={CHART_COLORS[i]} fillOpacity={0.35} strokeWidth={1.5} />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}