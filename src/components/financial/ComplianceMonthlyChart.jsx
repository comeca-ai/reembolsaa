import React from "react";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { ShieldCheck } from "lucide-react";

/**
 * @param {{ active?: boolean; payload?: Array<{ dataKey: string; fill: string; name: string; value: number }>; label?: string }} props
 */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-popover border border-border rounded-xl px-4 py-3 text-sm shadow-xl">
      <p className="font-medium text-foreground mb-2">{label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-2 text-xs">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: p.fill }} />
          <span className="text-muted-foreground">{p.name}:</span>
          <span className="font-mono text-foreground">{p.value}%</span>
        </div>
      ))}
    </div>
  );
};

export default function ComplianceMonthlyChart({ data }) {
  const latest = data[data.length - 1];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.25 }}
      className="bg-card border border-border rounded-xl overflow-hidden"
    >
      <div className="px-5 py-4 border-b border-border flex items-start justify-between">
        <div>
          <h3 className="font-heading text-foreground text-base">Conformidade mensal</h3>
          <p className="text-muted-foreground text-xs mt-0.5">Distribuição de status por mês (%)</p>
        </div>
        <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-lg">
          <ShieldCheck className="w-3.5 h-3.5 text-primary" />
          <span className="font-mono text-sm font-semibold text-primary">{latest.conforme}%</span>
          <span className="text-muted-foreground text-[11px]">conformes</span>
        </div>
      </div>

      <div className="px-5 py-5 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barSize={20} barGap={3} stackOffset="expand">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11, fontFamily: "var(--font-body)" }}
              axisLine={false} tickLine={false}
            />
            <YAxis
              tickFormatter={(v) => `${v}%`}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11, fontFamily: "var(--font-mono)" }}
              axisLine={false} tickLine={false} width={32}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--secondary))" }} />
            <Legend
              wrapperStyle={{ fontSize: 11, fontFamily: "var(--font-body)", color: "hsl(var(--muted-foreground))" }}
            />
            <Bar dataKey="conforme"  name="Conforme"  fill="hsl(var(--primary))"     radius={[4, 4, 0, 0]} />
            <Bar dataKey="excecao"   name="Exceção"   fill="hsl(var(--warning))"      radius={[4, 4, 0, 0]} />
            <Bar dataKey="reprovado" name="Reprovado" fill="hsl(var(--destructive))"  radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}