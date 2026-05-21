import React from "react";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const fmt = (v) => `R$ ${v.toLocaleString("pt-BR")}`;
  return (
    <div className="bg-popover border border-border rounded-xl px-4 py-3 text-sm shadow-xl">
      <p className="font-medium text-foreground mb-2">{label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-2 text-xs">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: p.fill }} />
          <span className="text-muted-foreground">{p.name}:</span>
          <span className="font-mono text-foreground">{fmt(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

export default function BudgetByCostCenter({ data }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="bg-card border border-border rounded-xl overflow-hidden"
    >
      <div className="px-5 py-4 border-b border-border">
        <h3 className="font-heading text-foreground text-base">Orçamento por centro de custo</h3>
        <p className="text-muted-foreground text-xs mt-0.5">Executado vs. disponível por área (R$)</p>
      </div>

      <div className="px-5 py-5">
        {/* Progress bars */}
        <div className="space-y-4 mb-6">
          {data.map((row) => {
            const pct = Math.min((row.spent / row.budget) * 100, 100);
            const pendingPct = Math.min(((row.spent + row.pending) / row.budget) * 100, 100);
            const isOver = row.spent > row.budget * 0.9;
            return (
              <div key={row.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-foreground text-sm font-medium">{row.name}</span>
                  <div className="flex items-center gap-3">
                    <span className={`font-mono text-xs ${isOver ? "text-destructive" : "text-muted-foreground"}`}>
                      R$ {row.spent.toLocaleString("pt-BR")} / R$ {row.budget.toLocaleString("pt-BR")}
                    </span>
                    <span className={`text-xs font-mono font-semibold ${isOver ? "text-destructive" : "text-primary"}`}>
                      {pct.toFixed(0)}%
                    </span>
                  </div>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  {/* pending layer */}
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pendingPct}%`, background: "hsl(var(--warning) / 0.35)" }}
                  />
                </div>
                <div className="h-2 -mt-2 bg-transparent rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${pct}%`,
                      background: isOver ? "hsl(var(--destructive))" : "hsl(var(--primary))",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bar chart */}
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barSize={16} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10, fontFamily: "var(--font-body)" }}
                axisLine={false} tickLine={false}
                interval={0}
                angle={-25}
                textAnchor="end"
                height={40}
              />
              <YAxis
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10, fontFamily: "var(--font-mono)" }}
                axisLine={false} tickLine={false} width={36}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--secondary))" }} />
              <Legend
                wrapperStyle={{ fontSize: 11, fontFamily: "var(--font-body)", color: "hsl(var(--muted-foreground))" }}
              />
              <Bar dataKey="spent"   name="Executado"  fill="hsl(var(--primary))"     radius={[4, 4, 0, 0]} />
              <Bar dataKey="pending" name="Pendente"   fill="hsl(var(--warning) / 0.6)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="budget"  name="Orçamento"  fill="hsl(var(--border))"       radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}