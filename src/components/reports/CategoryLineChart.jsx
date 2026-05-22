import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { CHART_COLORS } from "@/lib/mocks/dashboardMockData";

const CATEGORIES = ["Alimentação", "Transporte", "Hospedagem", "Representação", "Combustível"];

const BRL = (v) => `R$ ${Number(v).toLocaleString("pt-BR", { minimumFractionDigits: 0 })}`;

export default function CategoryLineChart({ data }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
      <div>
        <p className="text-sm font-medium text-foreground">Volume por Categoria</p>
        <p className="text-xs text-muted-foreground">Evolução diária no período selecionado</p>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="day" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
          <YAxis tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
          <Tooltip
            contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
            formatter={(v, name) => [BRL(v), name]}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          {CATEGORIES.map((cat, i) => (
            <Line key={cat} type="monotone" dataKey={cat} stroke={CHART_COLORS[i]} strokeWidth={2} dot={false} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}