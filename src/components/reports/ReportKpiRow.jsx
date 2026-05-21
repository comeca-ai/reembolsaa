import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function ReportKpiRow({ kpis }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {Object.values(kpis).map((kpi) => (
        <div key={kpi.label} className="bg-card border border-border rounded-xl px-5 py-4 space-y-1.5">
          <p className="text-xs text-muted-foreground">{kpi.label}</p>
          <div className="flex items-end gap-2">
            {kpi.unit === "R$" ? (
              <p className="font-heading text-2xl text-foreground">
                R$ {Number(kpi.value).toLocaleString("pt-BR", { minimumFractionDigits: 0 })}
              </p>
            ) : (
              <p className="font-heading text-2xl text-foreground">
                {typeof kpi.value === "number" ? kpi.value.toLocaleString("pt-BR") : kpi.value}
                {kpi.unit && kpi.unit !== "R$" && kpi.unit !== "" && (
                  <span className="text-sm text-muted-foreground font-body ml-1">{kpi.unit}</span>
                )}
              </p>
            )}
          </div>
          {kpi.delta !== null && kpi.delta !== undefined && (
            <div className={`flex items-center gap-1 text-xs ${kpi.delta >= 0 ? "text-primary" : "text-destructive"}`}>
              {kpi.delta >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              <span>{kpi.delta >= 0 ? "+" : ""}{kpi.delta}% vs mês anterior</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}