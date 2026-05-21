import React from "react";
import { motion } from "framer-motion";

export default function KpiCard({ label, value, sub, icon: Icon, accent, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-card border border-border rounded-xl px-5 py-4 flex items-center gap-4"
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${accent ?? "bg-secondary"}`}>
        <Icon className={`w-4.5 h-4.5 ${accent ? "text-primary-foreground" : "text-muted-foreground"}`} style={{ width: 18, height: 18 }} />
      </div>
      <div className="min-w-0">
        <p className="font-mono text-xl font-semibold text-foreground leading-tight">{value}</p>
        <p className="text-muted-foreground text-xs mt-0.5 truncate">{label}</p>
        {sub && <p className="text-xs mt-0.5" style={{ color: "#9A9A93" }}>{sub}</p>}
      </div>
    </motion.div>
  );
}