import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from "recharts";
import { motion } from "framer-motion";

const formatBRL = (v) => `R$\u00A0${(v / 1000).toFixed(0)}k`;

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1E1E1C] border border-[#2A2A27] rounded-lg px-3 py-2.5 text-xs shadow-xl min-w-[140px]">
      <p className="text-[#F1F1EE] font-medium mb-2">{label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex justify-between gap-4 mb-0.5">
          <span style={{ color: p.fill }}>{p.name}</span>
          <span className="font-mono text-[#F1F1EE]">R$ {p.value.toLocaleString("pt-BR")}</span>
        </div>
      ))}
    </div>
  );
};

const LEGEND_LABELS = { approved: "Aprovado", pending: "Pendente", rejected: "Recusado" };

const renderLegend = ({ payload }) => (
  <div className="flex gap-4 justify-end pt-1">
    {payload.map((p) => (
      <div key={p.value} className="flex items-center gap-1.5">
        <span className="w-2.5 h-2.5 rounded-sm" style={{ background: p.color }} />
        <span className="text-xs text-muted-foreground">{LEGEND_LABELS[p.value] ?? p.value}</span>
      </div>
    ))}
  </div>
);

export default function DeptChart({ data }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="bg-card border border-border rounded-xl p-5"
    >
      <h3 className="font-heading text-foreground text-base mb-1">Reembolsos por departamento</h3>
      <p className="text-muted-foreground text-xs mb-5">Aprovados, pendentes e recusados (R$)</p>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} barSize={10} barGap={3} barCategoryGap="30%">
          <CartesianGrid vertical={false} stroke="#2A2A27" strokeDasharray="4 4" />
          <XAxis
            dataKey="department"
            tick={{ fill: "#9A9A93", fontSize: 11, fontFamily: "var(--font-body)" }}
            axisLine={false} tickLine={false}
          />
          <YAxis
            tickFormatter={formatBRL}
            tick={{ fill: "#9A9A93", fontSize: 11, fontFamily: "var(--font-mono)" }}
            axisLine={false} tickLine={false} width={54}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
          <Legend content={renderLegend} />
          <Bar dataKey="approved" name="approved" fill="#C8F55A" radius={[4, 4, 0, 0]} />
          <Bar dataKey="pending"  name="pending"  fill="#F2C14A" radius={[4, 4, 0, 0]} />
          <Bar dataKey="rejected" name="rejected" fill="#FF7065" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}