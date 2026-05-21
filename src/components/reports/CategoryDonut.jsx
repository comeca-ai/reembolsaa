import React, { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Sector } from "recharts";
import { CHART_COLORS } from "@/lib/dashboardMockData";

const BRL = (v) => `R$ ${Number(v).toLocaleString("pt-BR", { minimumFractionDigits: 0 })}`;

const renderActiveShape = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent } = props;
  return (
    <g>
      <text x={cx} y={cy - 10} textAnchor="middle" className="fill-foreground" style={{ fill: "hsl(var(--foreground))", fontSize: 15, fontWeight: 600 }}>
        {payload.name}
      </text>
      <text x={cx} y={cy + 12} textAnchor="middle" style={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}>
        {BRL(payload.value)}
      </text>
      <text x={cx} y={cy + 30} textAnchor="middle" style={{ fill: "hsl(var(--primary))", fontSize: 11 }}>
        {(percent * 100).toFixed(1)}%
      </text>
      <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius + 6} startAngle={startAngle} endAngle={endAngle} fill={fill} />
    </g>
  );
};

export default function CategoryDonut({ data }) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
      <div>
        <p className="text-sm font-medium text-foreground">Distribuição por Categoria</p>
        <p className="text-xs text-muted-foreground">Participação de cada categoria no total</p>
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <ResponsiveContainer width={220} height={220}>
          <PieChart>
            <Pie
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={90}
              dataKey="value"
              onMouseEnter={(_, index) => setActiveIndex(index)}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="flex-1 space-y-2 w-full">
          {data.map((item, i) => (
            <button
              key={item.name}
              onMouseEnter={() => setActiveIndex(i)}
              className="flex items-center gap-2.5 w-full hover:bg-secondary/40 rounded-lg px-2 py-1.5 transition-colors text-left"
            >
              <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} />
              <span className="flex-1 text-xs text-foreground truncate">{item.name}</span>
              <span className="text-xs font-mono text-muted-foreground">{BRL(item.value)}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}