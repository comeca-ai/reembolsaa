import React from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine
} from "recharts";
import { motion } from "framer-motion";

/**
 * @param {{ active?: boolean; payload?: Array<{ value: number }>; label?: string }} props
 */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const score = payload[0].value;
  const color = score >= 80 ? "#C8F55A" : score >= 70 ? "#F2C14A" : "#FF7065";
  return (
    <div className="bg-card border border-border rounded-lg px-3 py-2.5 shadow-xl text-xs">
      <p className="text-muted-foreground mb-1">{label}</p>
      <p className="font-mono font-semibold" style={{ color }}>
        {score}<span className="text-muted-foreground font-normal"> / 100</span>
      </p>
    </div>
  );
};

export default function ComplianceTrend({ data }) {
  const latest = data[data.length - 1]?.score ?? 0;
  const color = latest >= 80 ? "#C8F55A" : latest >= 70 ? "#F2C14A" : "#FF7065";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="bg-card border border-border rounded-xl p-5"
    >
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="font-heading text-foreground text-base">Score de compliance</h3>
          <p className="text-muted-foreground text-xs mt-0.5">Evolução nos últimos 6 meses</p>
        </div>
        <div className="text-right">
          <p className="font-mono text-3xl font-semibold leading-none" style={{ color }}>{latest}</p>
          <p className="text-muted-foreground text-[11px] mt-1">pontos</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={160}>
        <AreaChart data={data} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.2} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="hsl(40 4% 16%)" strokeDasharray="4 4" />
          <XAxis
            dataKey="month"
            tick={{ fill: "#9A9A93", fontSize: 11, fontFamily: "var(--font-body)" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[50, 100]}
            tick={{ fill: "#9A9A93", fontSize: 10, fontFamily: "var(--font-mono)" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(255,255,255,0.08)" }} />
          <ReferenceLine y={80} stroke="#C8F55A" strokeDasharray="4 4" strokeOpacity={0.3} />
          <Area
            type="monotone"
            dataKey="score"
            stroke={color}
            strokeWidth={2}
            fill="url(#scoreGrad)"
            dot={{ r: 3, fill: color, stroke: "transparent" }}
            activeDot={{ r: 5, fill: color }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}