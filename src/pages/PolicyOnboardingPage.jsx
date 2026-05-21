import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Upload, FileText, X, Sparkles, Loader2, ShieldCheck, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { extrairPolitica } from "@/api/politica";

export default function PolicyOnboardingPage() {
  const navigate = useNavigate();
  const { empresa, profile, refreshProfile } = useAuth();
  const primeiroNome = (profile?.nome || "").trim().split(/\s+/)[0];

  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [stage, setStage] = useState("idle"); // idle | extracting
  const [error, setError] = useState("");

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) setFile(f);
  };

  const concluirOnboarding = async (documentoPath) => {
    await supabase
      .from("empresa")
      .update({ onboarding_done: true, ...(documentoPath ? { politica_documento: documentoPath } : {}) })
      .eq("id", empresa.id);
    await refreshProfile();
  };

  // Sobe o PDF, lê com IA e leva para /politica com as regras (revisão no modal de lá).
  const handleAnalyze = async () => {
    setError("");
    setBusy(true);
    setStage("extracting");
    try {
      const safeName = file.name.replace(/[^\w.\-]+/g, "_");
      const path = `${empresa.id}/${Date.now()}-${safeName}`;
      const { error: stErr } = await supabase.storage.from("politicas").upload(path, file, { upsert: false });
      if (stErr) throw stErr;

      const { rules, resumo, politica_texto } = await extrairPolitica(file);
      await concluirOnboarding(path);

      if (rules.length) {
        navigate("/politica", { replace: true, state: { pendingRules: rules, resumo, politicaTexto: politica_texto } });
      } else {
        navigate("/politica", { replace: true });
      }
    } catch (err) {
      setError(err?.message || "Falha ao ler a política.");
      setStage("idle");
      setBusy(false);
    }
  };

  const handleSkip = async () => {
    setError("");
    setBusy(true);
    try {
      await concluirOnboarding(null);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err?.message || "Erro ao continuar.");
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12">
      <div className="flex items-center gap-2.5 mb-8">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-heading text-sm font-bold">R$</span>
        </div>
        <span className="font-heading text-foreground text-base">Reembolsaaí</span>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-3 mb-8 text-xs">
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">✓</div>
          Empresa
        </div>
        <div className="w-8 h-px bg-primary" />
        <div className="flex items-center gap-2 text-foreground font-medium">
          <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground ring-4 ring-primary/20 flex items-center justify-center">2</div>
          Política
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-md bg-card border border-border rounded-2xl p-8 space-y-6"
      >
        {stage === "extracting" ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
              <Wand2 className="w-6 h-6 text-primary animate-pulse" />
            </div>
            <h1 className="font-heading text-xl text-foreground">Lendo sua política com IA…</h1>
            <p className="text-muted-foreground text-sm">Extraindo os limites por categoria. Leva alguns segundos.</p>
            <Loader2 className="w-5 h-5 animate-spin mx-auto text-muted-foreground" />
          </div>
        ) : (
          <>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-primary text-xs font-semibold">Quase lá{primeiroNome ? `, ${primeiroNome}` : ""}</span>
              </div>
              <h1 className="font-heading text-2xl text-foreground mb-2">Suba a política de reembolso</h1>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Envie o PDF da política de despesas{empresa?.nome ? ` da ${empresa.nome}` : ""}. A IA lê o documento e extrai os limites por categoria — você revisa e confirma na tela de Políticas.
              </p>
            </div>

            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              onClick={() => document.getElementById("policy-file").click()}
              className={`relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${
                dragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-secondary/30"
              }`}
            >
              <input id="policy-file" type="file" accept=".pdf" className="hidden" onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])} />
              {file ? (
                <>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="text-foreground text-sm font-medium truncate max-w-[220px]">{file.name}</p>
                    <p className="text-muted-foreground text-xs mt-0.5">{(file.size / 1024).toFixed(0)} KB</p>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); setFile(null); }} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground">
                    <X className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                    <Upload className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div className="text-center">
                    <p className="text-foreground text-sm font-medium">Arraste o PDF aqui</p>
                    <p className="text-muted-foreground text-xs mt-0.5">ou clique para selecionar · PDF</p>
                  </div>
                </>
              )}
            </div>

            {error && <p className="text-destructive text-sm">{error}</p>}

            <div className="space-y-2">
              <Button onClick={file ? handleAnalyze : handleSkip} disabled={busy} className="w-full h-11 text-base">
                {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : file ? <><Wand2 className="w-4 h-4" /> Ler política com IA</> : <>Ir para o dashboard <ArrowRight className="w-4 h-4" /></>}
              </Button>
              {file && (
                <button onClick={handleSkip} disabled={busy} className="w-full text-center text-xs text-muted-foreground hover:text-foreground">
                  Pular por enquanto
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground border-t border-border pt-4">
              <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
              <span>Arquivo isolado por empresa via Storage com Row-Level Security.</span>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
