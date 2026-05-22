import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from "recharts";
import { motion } from "framer-motion";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-lg px-3 py-2.5 shadow-xl text-xs space-y-1.5">
      <p className="text-foreground font-semibold mb-2">{label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: p.fill }} />
            <span className="text-muted-foreground">{p.name}</span>
          </div>
          <span className="font-mono text-foreground">R$ {p.value.toLocaleString("pt-BR")}</span>
        </div>
      ))}
    </div>
  );
};

const formatY = (v) => `R$${(v / 1000).toFixed(0)}k`;

export default function VolumeByDepartment({ data }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="bg-card border border-border rounded-xl p-5"
    >
      <div className="mb-5">
        <h3 className="font-heading text-foreground text-base">Volume por departamento</h3>
        <p className="text-muted-foreground text-xs mt-0.5">Reembolsos aprovados, rejeitados e pendentes (R$)</p>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart
          data={data}
          margin={{ top: 0, right: 0, left: -10, bottom: 0 }}
          barSize={10}
          barGap={2}
          barCategoryGap="30%"
        >
          <CartesianGrid vertical={false} stroke="hsl(40 4% 16%)" strokeDasharray="4 4" />
          <XAxis
            dataKey="department"
            tick={{ fill: "#9A9A93", fontSize: 11, fontFamily: "var(--font-body)" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={formatY}
            tick={{ fill: "#9A9A93", fontSize: 11, fontFamily: "var(--font-mono)" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
          <Legend
            wrapperStyle={{ fontSize: 11, color: "#9A9A93", paddingTop: 12 }}
            formatter={(value) => <span style={{ color: "#9A9A93" }}>{value}</span>}
          />
          <Bar dataKey="approved" name="Aprovado" fill="#C8F55A" radius={[4, 4, 0, 0]} />
          <Bar dataKey="pending"  name="Pendente" fill="#F2C14A" radius={[4, 4, 0, 0]} />
          <Bar dataKey="rejected" name="Rejeitado" fill="#FF7065" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}