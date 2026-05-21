import React from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { motion } from "framer-motion";

const formatBRL = (v) => `R$\u00A0${(v / 1000).toFixed(0)}k`;

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1E1E1C] border border-[#2A2A27] rounded-lg px-3 py-2.5 text-xs shadow-xl">
      <p className="text-[#F1F1EE] font-medium mb-1.5">{label}</p>
      <p className="text-[#9A9A93]">Volume: <span className="font-mono text-[#C8F55A]">R$ {payload[0]?.value?.toLocaleString("pt-BR")}</span></p>
      <p className="text-[#9A9A93]">Violações: <span className="font-mono text-[#FF7065]">{payload[1]?.value ?? 0}</span></p>
    </div>
  );
};

export default function MonthlyTrendChart({ data }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="bg-card border border-border rounded-xl p-5"
    >
      <h3 className="font-heading text-foreground text-base mb-1">Volume mensal</h3>
      <p className="text-muted-foreground text-xs mb-5">Reembolsos submetidos vs. violações detectadas</p>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="gradTotal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#C8F55A" stopOpacity={0.18} />
              <stop offset="95%" stopColor="#C8F55A" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradViol" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#FF7065" stopOpacity={0.18} />
              <stop offset="95%" stopColor="#FF7065" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="#2A2A27" strokeDasharray="4 4" />
          <XAxis
            dataKey="month"
            tick={{ fill: "#9A9A93", fontSize: 11, fontFamily: "var(--font-body)" }}
            axisLine={false} tickLine={false}
          />
          <YAxis
            yAxisId="left"
            tickFormatter={formatBRL}
            tick={{ fill: "#9A9A93", fontSize: 11, fontFamily: "var(--font-mono)" }}
            axisLine={false} tickLine={false} width={54}
          />
          <YAxis yAxisId="right" orientation="right" hide />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#2A2A27", strokeWidth: 1 }} />
          <Area yAxisId="left"  type="monotone" dataKey="total"      stroke="#C8F55A" strokeWidth={2} fill="url(#gradTotal)" dot={false} activeDot={{ r: 4, fill: "#C8F55A" }} />
          <Area yAxisId="right" type="monotone" dataKey="violations" stroke="#FF7065" strokeWidth={2} fill="url(#gradViol)"  dot={false} activeDot={{ r: 4, fill: "#FF7065" }} />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}