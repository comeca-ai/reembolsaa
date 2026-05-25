import React from "react";
import { ShieldCheck, ShieldQuestion, ShieldAlert } from "lucide-react";
import { SELO_LABEL } from "@/lib/nf-chave";

// Selo de autenticidade fiscal: cor + ícone + label a partir do selo gravado na
// despesa (nf_selo). null/indefinido cai em "nao_verificavel" (cupom antigo/recibo).
const SELO_META = {
  valida:          { Icon: ShieldCheck,    cls: "bg-green-500/10 text-green-600 border-green-500/20" },
  nao_verificavel: { Icon: ShieldQuestion, cls: "bg-secondary text-muted-foreground border-border" },
  suspeita:        { Icon: ShieldAlert,    cls: "bg-destructive/10 text-destructive border-destructive/20" },
};

export default function NfSeloBadge({ selo }) {
  const key = selo === "valida" || selo === "suspeita" ? selo : "nao_verificavel";
  const { Icon, cls } = SELO_META[key];
  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${cls}`}
      title={SELO_LABEL[key]}
    >
      <Icon className="w-3 h-3" /> {SELO_LABEL[key]}
    </span>
  );
}
