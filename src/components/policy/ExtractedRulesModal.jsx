import React from "react";
import { Sparkles, Loader2, AlertTriangle } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const CAT_EMOJI = {
  "Alimentação": "🍽️",
  "Transporte": "🚗",
  "Hospedagem": "🏨",
  "KM": "🛣️",
  "Outros": "📦",
};

export default function ExtractedRulesModal({ open, onClose, rules = [], resumo, validacao, onChange, onSave, saving, error }) {
  const avisos = validacao?.avisos || [];
  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            Regras extraídas da política
          </DialogTitle>
          <DialogDescription>
            {resumo || "Revise os limites por categoria identificados pela IA e ajuste se necessário antes de ativar."}
          </DialogDescription>
        </DialogHeader>

        {avisos.length > 0 && (
          <div className="rounded-xl border border-warning/40 bg-warning/10 p-3 flex gap-2.5">
            <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
            <div className="space-y-1">
              {avisos.map((a, i) => (
                <p key={i} className="text-xs text-foreground leading-relaxed">{a}</p>
              ))}
              <p className="text-[11px] text-muted-foreground">Você ainda pode salvar — confirme se é a política correta da sua empresa.</p>
            </div>
          </div>
        )}

        <div className="space-y-3 overflow-y-auto pr-1 -mr-1 py-1">
          {rules.length === 0 ? (
            <p className="text-muted-foreground text-sm py-6 text-center">Nenhuma regra para exibir.</p>
          ) : (
            rules.map((r, i) => (
              <div key={r.categoria} className="border border-border rounded-xl p-3.5">
                <div className="flex items-center gap-2 mb-2.5">
                  <span className="text-base">{CAT_EMOJI[r.categoria] || "📋"}</span>
                  <span className="text-foreground text-sm font-medium">{r.categoria}</span>
                </div>
                <div className="grid grid-cols-3 gap-2.5">
                  <label className="text-[11px] text-muted-foreground">
                    Diário (R$)
                    <Input type="number" min="0" value={r.diario_brl ?? ""} onChange={(e) => onChange(i, "diario_brl", e.target.value)} className="h-9 mt-1" placeholder="—" />
                  </label>
                  <label className="text-[11px] text-muted-foreground">
                    Por noite (R$)
                    <Input type="number" min="0" value={r.por_noite_brl ?? ""} onChange={(e) => onChange(i, "por_noite_brl", e.target.value)} className="h-9 mt-1" placeholder="—" />
                  </label>
                  <label className="text-[11px] text-muted-foreground">
                    Teto mês (R$)
                    <Input type="number" min="0" value={r.teto_mes_brl ?? ""} onChange={(e) => onChange(i, "teto_mes_brl", e.target.value)} className="h-9 mt-1" placeholder="—" />
                  </label>
                </div>
                {r.observacao && <p className="text-[11px] text-muted-foreground mt-2.5 leading-relaxed">{r.observacao}</p>}
                <label className="block text-[11px] text-muted-foreground mt-2.5">
                  Restrições / proibições
                  <textarea
                    value={r.restricoes ?? ""}
                    onChange={(e) => onChange(i, "restricoes", e.target.value)}
                    rows={2}
                    placeholder="Ex.: não reembolsa bebida alcoólica; exige nota fiscal"
                    className="w-full mt-1 bg-background border border-border rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-primary/40"
                  />
                </label>
              </div>
            ))
          )}
        </div>

        {error && <p className="text-destructive text-sm">{error}</p>}

        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" onClick={onClose} disabled={saving}>Cancelar</Button>
          <Button onClick={onSave} disabled={saving || rules.length === 0}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Salvar e ativar regras"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
