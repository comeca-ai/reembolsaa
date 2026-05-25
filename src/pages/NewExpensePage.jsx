import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2, CheckCircle2, PlusCircle, Upload, ImagePlus, X, Wand2, AlertTriangle, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CATEGORIAS } from "@/api/despesas";
import { useNewExpense } from "@/hooks/useNewExpense";
import NfSeloBadge from "@/components/NfSeloBadge";

const brl = (v) => `R$ ${Number(v || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

export default function NewExpensePage() {
  const {
    form, set,
    receipt, preview, ocr, ocrLoading, ocrStage, handleReceipt, clearReceipt,
    limite, valorNum, acima, motivosIA, precisaRevisar, conformidade,
    error, result, isSaving, submit, reset, navigate,
  } = useNewExpense();

  // ---------- Resultado (veredito) ----------
  if (result) {
    const aprovada = !result._acima && !result._bloqueado;
    const motivosResult = [
      ...(result._acima ? [`Acima da política (excesso de ${brl(result.policy_excesso_brl)})`] : []),
      ...((result._motivos || [])),
    ];
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-card border border-border rounded-2xl p-8 text-center space-y-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto ${aprovada ? "bg-primary/10" : "bg-warning/10"}`}>
            {aprovada ? <CheckCircle2 className="w-7 h-7 text-primary" /> : <Clock className="w-7 h-7 text-warning" />}
          </div>
          <div>
            <h1 className="font-heading text-2xl text-foreground mb-1">
              {aprovada ? "Aprovada automaticamente" : "Enviada para análise"}
            </h1>
            <p className="text-muted-foreground text-sm">
              {aprovada
                ? "A despesa está dentro da política e foi aprovada na hora."
                : "A despesa precisa de análise antes do reembolso."}
            </p>
          </div>
          {!aprovada && motivosResult.length > 0 && (
            <ul className="text-left text-sm bg-warning/5 border border-warning/20 rounded-xl p-3 space-y-1">
              {motivosResult.map((m, i) => (
                <li key={i} className="flex items-start gap-2 text-foreground">
                  <AlertTriangle className="w-3.5 h-3.5 text-warning shrink-0 mt-0.5" /> <span>{m}</span>
                </li>
              ))}
            </ul>
          )}
          <div className="bg-secondary/40 rounded-xl p-4 text-left text-sm space-y-1">
            <div className="flex justify-between"><span className="text-muted-foreground">Valor</span><span className="font-mono text-foreground">{brl(result.valor_brl)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Categoria</span><span className="text-foreground">{result.categoria}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Status</span><span className="text-foreground">{aprovada ? "Aprovada" : "Pendente"}</span></div>
            <div className="flex justify-between items-center"><span className="text-muted-foreground">Comprovante fiscal</span><NfSeloBadge selo={result.nf_selo} /></div>
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1" onClick={reset}>
              Nova despesa
            </Button>
            <Button className="flex-1" onClick={() => navigate(aprovada ? "/dashboard" : "/aprovacoes")}>
              {aprovada ? "Ir ao dashboard" : "Ver aprovações"}
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Link>

        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <PlusCircle className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-heading text-foreground text-2xl md:text-3xl">Nova despesa</h1>
              <p className="text-muted-foreground text-sm mt-0.5">Suba a foto do comprovante — a IA preenche os campos.</p>
            </div>
          </div>
        </motion.div>

        {/* Receipt dropzone */}
        <div className="mb-6">
          <input id="receipt-file" type="file" accept="image/*,.pdf" className="hidden"
            onChange={(e) => e.target.files?.[0] && handleReceipt(e.target.files[0])} />
          {!receipt ? (
            <div
              onClick={() => document.getElementById("receipt-file").click()}
              className="border-2 border-dashed border-border rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-primary/50 hover:bg-secondary/30 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <ImagePlus className="w-6 h-6 text-primary" />
              </div>
              <div className="text-center">
                <p className="text-foreground text-sm font-medium">Subir foto do comprovante</p>
                <p className="text-muted-foreground text-xs mt-0.5">JPG, PNG ou PDF · a IA lê e preenche</p>
              </div>
            </div>
          ) : (
            <div className="border border-border rounded-2xl p-4 flex items-center gap-4">
              {preview ? (
                <img src={preview} alt="comprovante" className="w-16 h-16 rounded-lg object-cover border border-border" />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-secondary flex items-center justify-center"><Upload className="w-6 h-6 text-muted-foreground" /></div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-foreground text-sm font-medium truncate">{receipt.name}</p>
                {ocrLoading ? (
                  <p className="text-primary text-xs flex items-center gap-1.5 mt-1">
                    <Wand2 className="w-3.5 h-3.5 animate-pulse" />
                    {ocrStage === "analisando" ? "Agente analisando contra a política…" : "Lendo comprovante (OCR)…"}
                  </p>
                ) : (
                  <p className="text-muted-foreground text-xs mt-1">Campos preenchidos — confira abaixo.</p>
                )}
              </div>
              <button onClick={clearReceipt} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
            </div>
          )}
        </div>

        <form onSubmit={submit} className="bg-card border border-border rounded-2xl p-6 md:p-8 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="colaborador">Colaborador</Label>
              <Input id="colaborador" value={form.colaborador} onChange={(e) => set("colaborador", e.target.value)} placeholder="Seu nome" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="centro">Centro de custo</Label>
              <Input id="centro" value={form.centro_custo} onChange={(e) => set("centro_custo", e.target.value)} placeholder="Ex.: Comercial" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Categoria</Label>
              <Select value={form.categoria} onValueChange={(v) => set("categoria", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIAS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
              {limite != null && <p className="text-[11px] text-muted-foreground">Limite da política: {brl(limite)}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="valor">Valor (R$)</Label>
              <Input id="valor" type="number" step="0.01" min="0" value={form.valor_brl} onChange={(e) => set("valor_brl", e.target.value)} placeholder="0,00" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="data">Data</Label>
            <Input id="data" type="date" value={form.data} onChange={(e) => set("data", e.target.value)} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="obs">Observação</Label>
            <textarea id="obs" value={form.observacao} onChange={(e) => set("observacao", e.target.value)} rows={2}
              placeholder="Detalhes do gasto..." className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/40" />
          </div>

          {/* Veredito ao vivo (numérico + restrições da política via IA) */}
          {(valorNum > 0 || ocr) && (
            precisaRevisar ? (
              <div className="flex items-start gap-2.5 text-sm bg-warning/5 border border-warning/20 rounded-lg p-3">
                <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                <div>
                  <p className="text-warning font-medium">Fora da política — irá para análise</p>
                  <ul className="text-muted-foreground text-xs mt-1 space-y-0.5 list-disc list-inside">
                    {acima && <li>Excesso de {brl(valorNum - Number(limite))} sobre o limite de {brl(limite)}.</li>}
                    {motivosIA.map((m, i) => <li key={i}>{m}</li>)}
                  </ul>
                  {conformidade?.raciocinio && <p className="text-muted-foreground text-[11px] mt-1.5 italic">🧠 {conformidade.raciocinio}</p>}
                </div>
              </div>
            ) : (ocr || (valorNum > 0 && limite != null)) ? (
              <div className="flex items-start gap-2.5 text-sm bg-primary/5 border border-primary/20 rounded-lg p-3">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-primary font-medium">Dentro da política — aprovação automática</p>
                  <p className="text-muted-foreground text-xs mt-0.5">{limite != null ? `Dentro do limite de ${brl(limite)} para ${form.categoria}.` : "Sem violações identificadas."}</p>
                  {conformidade?.raciocinio && <p className="text-muted-foreground text-[11px] mt-1.5 italic">🧠 {conformidade.raciocinio}</p>}
                </div>
              </div>
            ) : null
          )}

          {/* Itens lidos do comprovante */}
          {ocr?.itens?.length > 0 && (
            <div className="border border-border rounded-lg p-3">
              <p className="text-[11px] text-muted-foreground mb-1.5">Itens identificados no comprovante</p>
              <ul className="text-sm text-foreground space-y-0.5">
                {ocr.itens.map((it, i) => (
                  <li key={i} className="flex justify-between"><span>{it.nome}</span>{it.valor != null && <span className="font-mono text-muted-foreground">{brl(it.valor)}</span>}</li>
                ))}
              </ul>
            </div>
          )}

          {error && <p className="text-destructive text-sm">{error}</p>}

          <Button type="submit" disabled={isSaving || ocrLoading} className="w-full h-11 text-base">
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCircle2 className="w-4 h-4" /> Lançar despesa</>}
          </Button>
        </form>
      </div>
    </div>
  );
}
