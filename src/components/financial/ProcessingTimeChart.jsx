import React from "react";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";
import { Clock } from "lucide-react";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-popover border border-border rounded-xl px-4 py-3 text-sm shadow-xl">
      <p className="font-medium text-foreground mb-2">{label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-2 text-xs">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: p.fill }} />
          <span className="text-muted-foreground">{p.name}:</span>
          <span className="font-mono text-foreground">{p.value} dias</span>
        </div>
      ))}
    </div>
  );
};

export default function ProcessingTimeChart({ data }) {
  const latest = data[data.length - 1];
  const prev   = data[data.length - 2];
  const delta  = latest.avg_days - prev.avg_days;
  const improved = delta < 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="bg-card border border-border rounded-xl overflow-hidden"
    >
      <div className="px-5 py-4 border-b border-border flex items-start justify-between">
        <div>
          <h3 className="font-heading text-foreground text-base">Tempo de processamento</h3>
          <p className="text-muted-foreground text-xs mt-0.5">Média e P90 de dias até reembolso</p>
        </div>
        <div className="flex items-center gap-2 bg-secondary px-3 py-1.5 rounded-lg">
          <Clock className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="font-mono text-sm font-semibold text-foreground">{latest.avg_days} dias</span>
          <span className={`text-[11px] font-mono ${improved ? "text-primary" : "text-destructive"}`}>
            {improved ? "▼" : "▲"} {Math.abs(delta).toFixed(1)}
          </span>
        </div>
      </div>

      <div className="px-5 py-5 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barSize={20} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11, fontFamily: "var(--font-body)" }}
              axisLine={false} tickLine={false}
            />
            <YAxis
              tickFormatter={(v) => `${v}d`}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11, fontFamily: "var(--font-mono)" }}
              axisLine={false} tickLine={false} width={28} domain={[0, 10]}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--secondary))" }} />
            <ReferenceLine y={3} stroke="hsl(var(--primary) / 0.4)" strokeDasharray="4 4" label={{
              value: "Meta 3d", fill: "hsl(var(--primary))", fontSize: 10, fontFamily: "var(--font-mono)", position: "right"
            }} />
            <Bar dataKey="avg_days" name="Média"  fill="hsl(var(--primary))"     radius={[4, 4, 0, 0]} />
            <Bar dataKey="p90_days" name="P90"    fill="hsl(var(--warning) / 0.5)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="px-5 pb-4 flex gap-4 text-[11px] text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-primary" />Média mensal
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-warning/50" />P90 (90% das despesas)
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-primary/30" />Meta (&lt; 3 dias)
        </div>
      </div>
    </motion.div>
  );
}