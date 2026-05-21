import React from "react";
import { motion } from "framer-motion";

const FORMAT = {
  currency: (v) => `R$ ${v.toLocaleString("pt-BR")}`,
  percent:  (v) => `${v}%`,
  number:   (v) => v.toLocaleString("pt-BR"),
};

export default function FinancialKpiCard({ label, value, unit, format = "currency", index = 0, accent = false }) {
  const fmt = format === "currency" ? FORMAT.currency :
              format === "percent"  ? FORMAT.percent  : FORMAT.number;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      className="bg-card border border-border rounded-xl px-5 py-4 flex flex-col gap-1.5"
    >
      <span className="text-muted-foreground text-xs font-body">{label}</span>
      <span className={`font-mono text-2xl font-semibold leading-none ${accent ? "text-primary" : "text-foreground"}`}>
        {fmt(value)}
      </span>
      {unit && <span className="text-muted-foreground text-[11px]">{unit}</span>}
    </motion.div>
  );
}