import React from "react";

const BRL = (v) => `R$ ${Number(v).toLocaleString("pt-BR", { minimumFractionDigits: 0 })}`;

export default function CollaboratorTable({ data }) {
  const max = Math.max(...data.map((d) => d.total));

  return (
    <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
      <div>
        <p className="text-sm font-medium text-foreground">Volume por Colaborador</p>
        <p className="text-xs text-muted-foreground">Total lançado no período selecionado</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-xs text-muted-foreground font-medium pb-3 pr-4">Colaborador</th>
              <th className="text-left text-xs text-muted-foreground font-medium pb-3 pr-4 hidden md:table-cell">Departamento</th>
              <th className="text-right text-xs text-muted-foreground font-medium pb-3 pr-4">Total</th>
              <th className="text-right text-xs text-muted-foreground font-medium pb-3 hidden sm:table-cell">Lançamentos</th>
              <th className="text-left text-xs text-muted-foreground font-medium pb-3 pl-4 w-32 hidden lg:table-cell">Barra</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.map((row) => (
              <tr key={row.name} className="hover:bg-secondary/30 transition-colors">
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-primary font-mono text-[10px] font-bold">
                        {row.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </span>
                    </div>
                    <span className="text-foreground font-medium truncate max-w-[120px]">{row.name}</span>
                  </div>
                </td>
                <td className="py-3 pr-4 hidden md:table-cell">
                  <span className="text-muted-foreground text-xs">{row.department}</span>
                </td>
                <td className="py-3 pr-4 text-right font-mono text-foreground font-medium">{BRL(row.total)}</td>
                <td className="py-3 text-right text-muted-foreground hidden sm:table-cell">{row.count}</td>
                <td className="py-3 pl-4 hidden lg:table-cell">
                  <div className="h-1.5 bg-secondary rounded-full w-32 overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${(row.total / max) * 100}%` }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}