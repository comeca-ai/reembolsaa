import React, { useState } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--warning))",
  "hsl(var(--chart-4))",
  "hsl(var(--destructive))",
];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="bg-popover border border-border rounded-xl px-4 py-3 text-sm shadow-xl">
      <p className="font-medium text-foreground">{d.name}</p>
      <p className="font-mono text-foreground mt-1">R$ {d.value.toLocaleString("pt-BR")}</p>
      <p className="text-muted-foreground text-xs">{d.payload.pct}% do total</p>
    </div>
  );
};

export default function PaymentStatusDonut({ data }) {
  const [active, setActive] = useState(null);
  const total = data.reduce((s, d) => s + d.value, 0);
  const enriched = data.map((d) => ({ ...d, pct: ((d.value / total) * 100).toFixed(1) }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="bg-card border border-border rounded-xl overflow-hidden"
    >
      <div className="px-5 py-4 border-b border-border">
        <h3 className="font-heading text-foreground text-base">Status de pagamento</h3>
        <p className="text-muted-foreground text-xs mt-0.5">Distribuição do volume total (R$)</p>
      </div>

      <div className="px-5 py-5 flex flex-col lg:flex-row items-center gap-6">
        {/* Donut */}
        <div className="relative w-44 h-44 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={enriched}
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={76}
                paddingAngle={3}
                dataKey="value"
                onMouseEnter={(_, i) => setActive(i)}
                onMouseLeave={() => setActive(null)}
              >
                {enriched.map((_, i) => (
                  <Cell
                    key={i}
                    fill={COLORS[i % COLORS.length]}
                    opacity={active === null || active === i ? 1 : 0.35}
                    stroke="none"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {/* center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="font-mono text-xs text-muted-foreground">Total</span>
            <span className="font-mono text-sm font-semibold text-foreground leading-tight">
              R$ {(total / 1000).toFixed(0)}k
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-3 flex-1 min-w-0">
          {enriched.map((d, i) => (
            <div
              key={d.name}
              className={`flex items-center justify-between gap-3 transition-opacity ${
                active !== null && active !== i ? "opacity-40" : "opacity-100"
              }`}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                <span className="text-sm text-foreground truncate">{d.name}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="font-mono text-xs text-foreground">R$ {d.value.toLocaleString("pt-BR")}</span>
                <span className="font-mono text-[11px] text-muted-foreground w-10 text-right">{d.pct}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}