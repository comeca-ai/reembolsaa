import React, { useState } from "react";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Sector
} from "recharts";
import { motion } from "framer-motion";

const COLORS = [
  "#C8F55A", "#F2C14A", "#FF7065", "#60A5FA", "#A78BFA",
  "#34D399", "#FB923C", "#F472B6", "#38BDF8", "#4ADE80",
];

const formatBRL = (v) =>
  v >= 1000 ? `R$\u00A0${(v / 1000).toFixed(0)}k` : `R$\u00A0${v}`;

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-[#1E1E1C] border border-[#2A2A27] rounded-lg px-3 py-2 text-xs shadow-xl">
      <p className="text-[#F1F1EE] font-medium mb-0.5">{d.category}</p>
      <p className="text-[#9A9A93]">Total: <span className="text-[#C8F55A] font-mono">
        R$ {d.total.toLocaleString("pt-BR")}
      </span></p>
      <p className="text-[#9A9A93]">{d.count} despesas</p>
    </div>
  );
};

const renderActiveShape = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  return (
    <g>
      <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius + 6}
        startAngle={startAngle} endAngle={endAngle} fill={fill} />
    </g>
  );
};

export default function CategoryChart({ data }) {
  const [activeIndex, setActiveIndex] = useState(null);
  const top6 = data.slice(0, 6);
  const otherTotal = data.slice(6).reduce((s, d) => s + d.total, 0);
  const chartData = otherTotal > 0
    ? [...top6, { category: "Outros", total: otherTotal, count: 0 }]
    : top6;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="bg-card border border-border rounded-xl p-5"
    >
      <h3 className="font-heading text-foreground text-base mb-1">Distribuição por categoria</h3>
      <p className="text-muted-foreground text-xs mb-5">Volume financeiro total no período</p>

      <div className="flex flex-col lg:flex-row gap-6 items-center">
        <div className="w-full lg:w-[220px] h-[220px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%" cy="50%"
                innerRadius={62} outerRadius={90}
                dataKey="total"
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                onMouseEnter={(_, i) => setActiveIndex(i)}
                onMouseLeave={() => setActiveIndex(null)}
                strokeWidth={0}
              >
                {chartData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} opacity={activeIndex === null || activeIndex === i ? 1 : 0.45} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-y-2.5 gap-x-4 w-full">
          {chartData.map((d, i) => (
            <div key={d.category} className="flex items-center gap-2.5 min-w-0">
              <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
              <span className="text-muted-foreground text-xs truncate flex-1">{d.category}</span>
              <span className="font-mono text-xs text-foreground shrink-0">{formatBRL(d.total)}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}