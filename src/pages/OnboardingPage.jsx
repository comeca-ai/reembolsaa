import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Upload, FileText, CheckCircle2, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { base44 } from "@/api/base44Client";

const STEPS = ["Cadastro", "Política de Reembolso"];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  // Step 1 state
  const [form, setForm] = useState({ name: "", company: "", email: "", password: "" });

  // Step 2 state
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleCadastro = (e) => {
    e.preventDefault();
    setStep(1);
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  };

  const handleFileInput = (e) => {
    if (e.target.files[0]) setFile(e.target.files[0]);
  };

  const handleFinish = async () => {
    if (!file) {
      navigate("/dashboard");
      return;
    }
    setUploading(true);
    try {
      await base44.integrations.Core.UploadFile({ file });
    } catch (_) {}
    setUploading(false);
    navigate("/politica");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12">
      {/* Logo */}
      <div className="flex items-center gap-2.5 mb-10">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-heading text-sm font-bold">R$</span>
        </div>
        <span className="font-heading text-foreground text-base">Reembolsaaí</span>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-3 mb-10">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                i < step ? "bg-primary text-primary-foreground" :
                i === step ? "bg-primary text-primary-foreground ring-4 ring-primary/20" :
                "bg-secondary text-muted-foreground"
              }`}>
                {i < step ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`text-sm ${i === step ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`w-10 h-px ${i < step ? "bg-primary" : "bg-border"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Card */}
      <div className="w-full max-w-md">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.25 }}
              className="bg-card border border-border rounded-2xl p-8 space-y-6"
            >
              <div>
                <h1 className="font-heading text-2xl text-foreground mb-1">Crie sua conta</h1>
                <p className="text-muted-foreground text-sm">14 dias grátis. Sem cartão de crédito.</p>
              </div>

              <form onSubmit={handleCadastro} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Nome</Label>
                    <Input id="name" placeholder="João Silva" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="company">Empresa</Label>
                    <Input id="company" placeholder="Acme Ltda" required value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">E-mail corporativo</Label>
                  <Input id="email" type="email" placeholder="joao@empresa.com" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="password">Senha</Label>
                  <Input id="password" type="password" placeholder="Mínimo 8 caracteres" required minLength={8} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                </div>
                <Button type="submit" className="w-full h-11 text-base mt-2">
                  Continuar
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </form>

              <p className="text-center text-xs text-muted-foreground">
                Já tem conta?{" "}
                <button onClick={() => navigate("/dashboard")} className="text-primary hover:underline">
                  Entrar
                </button>
              </p>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.25 }}
              className="bg-card border border-border rounded-2xl p-8 space-y-6"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-primary text-xs font-medium">IA vai ler e estruturar automaticamente</span>
                </div>
                <h1 className="font-heading text-2xl text-foreground mb-1">Suba sua política</h1>
                <p className="text-muted-foreground text-sm">
                  PDF da política de reembolso da empresa. A IA converte em regras em segundos.
                </p>
              </div>

              {/* Dropzone */}
              <div
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleFileDrop}
                onClick={() => document.getElementById("policy-file").click()}
                className={`relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${
                  dragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-secondary/30"
                }`}
              >
                <input id="policy-file" type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleFileInput} />
                {file ? (
                  <>
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-center">
                      <p className="text-foreground text-sm font-medium truncate max-w-[220px]">{file.name}</p>
                      <p className="text-muted-foreground text-xs mt-0.5">{(file.size / 1024).toFixed(0)} KB</p>
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); setFile(null); }}
                      className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
                    >
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
                      <p className="text-muted-foreground text-xs mt-0.5">ou clique para selecionar · PDF, DOC</p>
                    </div>
                  </>
                )}
              </div>

              <div className="space-y-3">
                <Button onClick={handleFinish} disabled={uploading} className="w-full h-11 text-base">
                  {uploading ? "Enviando..." : file ? "Continuar para o dashboard" : "Pular por agora"}
                  {!uploading && <ArrowRight className="w-4 h-4" />}
                </Button>
                {!file && (
                  <p className="text-center text-xs text-muted-foreground">
                    Você pode subir a política depois em <span className="text-foreground font-medium">Configurações → Política</span>
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}