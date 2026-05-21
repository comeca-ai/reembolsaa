import React from "react";

const STATUS_CONFIG = {
  active:   { dot: "bg-primary",     label: "Ativo" },
  pending:  { dot: "bg-warning",     label: "Convite pendente" },
  inactive: { dot: "bg-muted-foreground", label: "Inativo" },
};

export default function StatusDot({ status }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.inactive;
  return (
    <div className="flex items-center gap-2">
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot}`} />
      <span className="text-sm text-muted-foreground">{cfg.label}</span>
    </div>
  );
}