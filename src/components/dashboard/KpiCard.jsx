import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";

export default function KpiCard({ label, value, unit, delta, index, format = "number", icon: Icon, iconColor }) {
  const positive = delta >= 0;
  // Some KPIs are "good" when negative (e.g. violations, processing time)
  const invertedKpis = ["Alertas de violação", "Tempo médio de análise", "Aguardando revisão"];
  const isGood = invertedKpis.includes(label) ? !positive : positive;

  const formatted =
    format === "currency"
      ? `R$ ${value.toLocaleString("pt-BR")}`
      : format === "percent"
        ? `${value.toLocaleString("pt-BR", { minimumFractionDigits: 1 })}%`
        : value.toLocaleString("pt-BR");

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      className="bg-card border border-border rounded-xl px-5 py-4 flex flex-col gap-3 hover:border-muted-foreground/30 transition-colors"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground font-medium">{label}</span>
        {Icon && (
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${iconColor ?? "bg-secondary"}`}>
            <Icon className="w-3.5 h-3.5 text-muted-foreground" />
          </div>
        )}
      </div>

      <div>
        <p className="font-mono text-2xl font-semibold text-foreground leading-none">
          {format === "currency" ? (
            <>
              <span className="text-sm text-muted-foreground mr-1">R$</span>
              {value.toLocaleString("pt-BR")}
            </>
          ) : format === "percent" ? (
            <>{value.toLocaleString("pt-BR", { minimumFractionDigits: 1 })}<span className="text-sm text-muted-foreground ml-0.5">%</span></>
          ) : (
            value.toLocaleString("pt-BR")
          )}
        </p>
        <p className="text-[11px] text-muted-foreground mt-1">{unit}</p>
      </div>

      <div className={`flex items-center gap-1 text-[11px] font-medium ${isGood ? "text-primary" : "text-destructive"}`}>
        {positive
          ? <TrendingUp className="w-3 h-3" />
          : <TrendingDown className="w-3 h-3" />
        }
        <span>{positive ? "+" : ""}{delta}{format === "percent" ? "pp" : ""} vs. mês anterior</span>
      </div>
    </motion.div>
  );
}