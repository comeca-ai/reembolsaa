import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2, CheckCircle2, PlusCircle, Upload, ImagePlus, X, Wand2, AlertTriangle, Clock, Sparkles, TrendingUp, Wallet } from "lucide-react";
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
      <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md"
        >
          {/* Card de sucesso */}
          <div className={`rounded-2xl p-8 text-center space-y-5 ${
            aprovada 
              ? "bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-primary/20" 
              : "bg-gradient-to-br from-warning/10 via-warning/5 to-background border border-warning/20"
          }`}>
            {/* Ícone animado */}
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto ${
                aprovada ? "bg-primary/20" : "bg-warning/20"
              }`}
            >
              {aprovada ? (
                <CheckCircle2 className="w-10 h-10 text-primary" />
              ) : (
                <Clock className="w-10 h-10 text-warning" />
              )}
            </motion.div>
            
            {/* Título */}
            <div>
              <h1 className="font-heading text-2xl text-foreground mb-2">
                {aprovada ? "✨ Despesa aprovada!" : "⏳ Enviada para análise"}
              </h1>
              <p className="text-muted-foreground text-sm">
                {aprovada
                  ? "Está dentro da política e foi aprovada automaticamente."
                  : "Precisa de revisão humana antes do reembolso."}
              </p>
            </div>

            {/* Resumo */}
            <div className="bg-card/80 rounded-xl p-4 text-left space-y-2 border border-border">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Valor</span>
                <span className="font-mono font-semibold text-foreground">{brl(result.valor_brl)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Categoria</span>
                <span className="text-foreground">{result.categoria}</span>
              </div>
              <div className="flex justify-between text-sm items-center">
                <span className="text-muted-foreground">Status</span>
                <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                  aprovada 
                    ? "bg-primary/10 text-primary" 
                    : "bg-warning/10 text-warning"
                }`}>
                  {aprovada ? "Aprovada" : "Em análise"}
                </span>
              </div>
              <div className="flex justify-between text-sm items-center pt-2 border-t border-border">
                <span className="text-muted-foreground">Comprovante</span>
                <NfSeloBadge selo={result.nf_selo} />
              </div>
            </div>

            {/* Motivos se houver */}
            {!aprovada && motivosResult.length > 0 && (
              <div className="text-left">
                <p className="text-sm text-foreground font-medium mb-2">Motivos:</p>
                <ul className="space-y-1.5">
                  {motivosResult.map((m, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* CTAs */}
            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1 h-12 rounded-xl" onClick={reset}>
                <PlusCircle className="w-4 h-4 mr-2" />
                Nova despesa
              </Button>
              <Button 
                className="flex-1 h-12 rounded-xl shadow-sm" 
                onClick={() => navigate(aprovada ? "/dashboard" : "/aprovacoes")}
              >
                {aprovada ? (
                  <><TrendingUp className="w-4 h-4 mr-2" /> Ver dashboard</>
                ) : (
                  <><Clock className="w-4 h-4 mr-2" /> Ver aprovações</>
                )}
              </Button>
            </div>
          </div>

          {/* Dica */}
          {aprovada && (
            <p className="text-center text-sm text-muted-foreground mt-4">
              💡 <span className="text-foreground">Dica:</span> Despesas dentro da política são aprovadas em até 2 minutos
            </p>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 md:px-8 py-6 md:py-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -8 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="mb-6"
        >
          <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="w-4 h-4" /> Voltar
          </Link>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-heading text-foreground text-xl md:text-2xl">Nova despesa</h1>
              <p className="text-muted-foreground text-sm">Envie o comprovante e a IA preenche o resto</p>
            </div>
          </div>
        </motion.div>

        {/* Upload de comprovante */}
        <motion.div 
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <input id="receipt-file" type="file" accept="image/*,.pdf" className="hidden"
            onChange={(e) => e.target.files?.[0] && handleReceipt(e.target.files[0])} />
          
          {!receipt ? (
            <div
              onClick={() => document.getElementById("receipt-file").click()}
              className="border-2 border-dashed border-border rounded-2xl p-8 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all group"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ImagePlus className="w-8 h-8 text-primary" />
              </div>
              <div className="text-center">
                <p className="text-foreground font-medium">Clique para subir o comprovante</p>
                <p className="text-muted-foreground text-xs mt-1">JPG, PNG ou PDF · A IA extrai os dados automaticamente</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary px-3 py-1.5 rounded-full">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Preenchimento automático com IA</span>
              </div>
            </div>
          ) : (
            <div className="border border-border rounded-2xl p-4 flex items-center gap-4 bg-card">
              {preview ? (
                <img src={preview} alt="comprovante" className="w-16 h-16 rounded-xl object-cover border border-border" />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-secondary flex items-center justify-center">
                  <Upload className="w-6 h-6 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-foreground font-medium truncate">{receipt.name}</p>
                {ocrLoading ? (
                  <p className="text-primary text-xs flex items-center gap-1.5 mt-1">
                    <Wand2 className="w-3.5 h-3.5 animate-pulse" />
                    {ocrStage === "analisando" ? "IA analisando contra a política…" : "Lendo comprovante…"}
                  </p>
                ) : (
                  <p className="text-muted-foreground text-xs mt-1">✓ Campos preenchidos — confira abaixo</p>
                )}
              </div>
              <button onClick={clearReceipt} className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </motion.div>

        {/* Formulário */}
        <motion.form 
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={submit} 
          className="bg-card border border-border rounded-2xl p-6 space-y-5"
        >
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
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIAS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
              {limite != null && (
                <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-primary" />
                  Limite da política: {brl(limite)}
                </p>
              )}
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
            <Label htmlFor="obs">Observação (opcional)</Label>
            <textarea 
              id="obs" 
              value={form.observacao} 
              onChange={(e) => set("observacao", e.target.value)} 
              rows={2}
              placeholder="Detalhes do gasto..." 
              className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none" 
            />
          </div>

          {/* Veredito ao vivo */}
          {(valorNum > 0 || ocr) && (
            precisaRevisar ? (
              <div className="flex items-start gap-3 text-sm bg-warning/5 border border-warning/20 rounded-xl p-4">
                <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
                <div>
                  <p className="text-warning font-medium">Fora da política — irá para análise</p>
                  <ul className="text-muted-foreground text-xs mt-1.5 space-y-0.5 list-disc list-inside">
                    {acima && <li>Excesso de {brl(valorNum - Number(limite))} sobre o limite de {brl(limite)}.</li>}
                    {motivosIA.map((m, i) => <li key={i}>{m}</li>)}
                  </ul>
                  {conformidade?.raciocinio && (
                    <p className="text-muted-foreground text-[11px] mt-2 italic border-t border-warning/10 pt-2">
                      🤖 "{conformidade.raciocinio}"
                    </p>
                  )}
                </div>
              </div>
            ) : (ocr || (valorNum > 0 && limite != null)) ? (
              <div className="flex items-start gap-3 text-sm bg-primary/5 border border-primary/20 rounded-xl p-4">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-primary font-medium">Dentro da política — aprovação automática</p>
                  <p className="text-muted-foreground text-xs mt-1">
                    {limite != null ? `Dentro do limite de ${brl(limite)} para ${form.categoria}.` : "Sem violações identificadas."}
                  </p>
                  {conformidade?.raciocinio && (
                    <p className="text-muted-foreground text-[11px] mt-2 italic border-t border-primary/10 pt-2">
                      🤖 "{conformidade.raciocinio}"
                    </p>
                  )}
                </div>
              </div>
            ) : null
          )}

          {/* Itens lidos do comprovante */}
          {ocr?.itens?.length > 0 && (
            <div className="border border-border rounded-xl p-4 bg-secondary/30">
              <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Itens identificados no comprovante
              </p>
              <ul className="text-sm space-y-1">
                {ocr.itens.map((it, i) => (
                  <li key={i} className="flex justify-between py-1 border-b border-border/50 last:border-0">
                    <span className="text-foreground">{it.nome}</span>
                    {it.valor != null && <span className="font-mono text-muted-foreground">{brl(it.valor)}</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <Button 
            type="submit" 
            disabled={isSaving || ocrLoading} 
            className="w-full h-12 text-base rounded-xl shadow-sm"
            size="lg"
          >
            {isSaving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Lançar despesa
              </>
            )}
          </Button>
        </motion.form>
      </div>
    </div>
  );
}
