import React, { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { CHART_COLORS } from "@/lib/mocks/dashboardMockData";

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-card border border-border rounded-lg px-3 py-2.5 shadow-xl text-xs">
      <p className="text-foreground font-semibold mb-1">{d.name}</p>
      <p className="text-muted-foreground">
        R$ <span className="text-foreground font-mono">{d.value.toLocaleString("pt-BR")}</span>
      </p>
      <p className="text-muted-foreground">
        <span className="text-foreground font-mono">{d.count}</span> lançamentos
      </p>
    </div>
  );
};

const CustomLegend = ({ data, activeIndex, onHover }) => (
  <div className="flex flex-col gap-1.5 text-xs max-h-48 overflow-y-auto pr-1">
    {data.map((entry, i) => (
      <button
        key={entry.name}
        onMouseEnter={() => onHover(i)}
        onMouseLeave={() => onHover(null)}
        className={`flex items-center gap-2 text-left transition-opacity ${
          activeIndex !== null && activeIndex !== i ? "opacity-40" : "opacity-100"
        }`}
      >
        <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
        <span className="text-muted-foreground flex-1 truncate">{entry.name}</span>
        <span className="font-mono text-foreground shrink-0">
          R$ {(entry.value / 1000).toFixed(1)}k
        </span>
      </button>
    ))}
  </div>
);

export default function ExpensesByCategory({ data }) {
  const [activeIndex, setActiveIndex] = useState(null);
  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="bg-card border border-border rounded-xl p-5"
    >
      <div className="mb-4">
        <h3 className="font-heading text-foreground text-base">Despesas por categoria</h3>
        <p className="text-muted-foreground text-xs mt-0.5">Distribuição do volume total este mês</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 items-center">
        <div className="relative w-full max-w-[200px] shrink-0">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={2}
                dataKey="value"
                onMouseEnter={(_, i) => setActiveIndex(i)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                {data.map((_, i) => (
                  <Cell
                    key={i}
                    fill={CHART_COLORS[i % CHART_COLORS.length]}
                    opacity={activeIndex === null || activeIndex === i ? 1 : 0.35}
                    stroke="transparent"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p className="font-mono text-sm font-semibold text-foreground leading-none">
              R$ {(total / 1000).toFixed(0)}k
            </p>
            <p className="text-[10px] text-muted-foreground mt-1">total</p>
          </div>
        </div>

        <div className="flex-1 w-full">
          <CustomLegend data={data} activeIndex={activeIndex} onHover={setActiveIndex} />
        </div>
      </div>
    </motion.div>
  );
}