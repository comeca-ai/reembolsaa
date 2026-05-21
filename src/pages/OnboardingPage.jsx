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
  const [errors, setErrors] = useState({});

  // Step 2 state
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleCadastro = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Nome obrigatório";
    if (!form.company.trim()) newErrors.company = "Empresa obrigatória";
    if (!form.email.trim()) newErrors.email = "E-mail obrigatório";
    if (form.password.length < 8) newErrors.password = "Mínimo 8 caracteres";
    
    if (Object.keys(newErrors).length === 0) {
      setErrors({});
      setStep(1);
    } else {
      setErrors(newErrors);
    }
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
                <p className="text-muted-foreground text-sm">Acesso imediato ao dashboard.</p>
              </div>

              <form onSubmit={handleCadastro} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className={errors.name ? "text-destructive" : ""}>Nome</Label>
                    <Input id="name" placeholder="João Silva" value={form.name} onChange={e => { setForm({ ...form, name: e.target.value }); if (errors.name) setErrors({ ...errors, name: "" }); }} className={errors.name ? "border-destructive/50 focus-visible:ring-destructive/30" : ""} />
                    {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="company" className={errors.company ? "text-destructive" : ""}>Empresa</Label>
                    <Input id="company" placeholder="Acme Ltda" value={form.company} onChange={e => { setForm({ ...form, company: e.target.value }); if (errors.company) setErrors({ ...errors, company: "" }); }} className={errors.company ? "border-destructive/50 focus-visible:ring-destructive/30" : ""} />
                    {errors.company && <p className="text-destructive text-xs mt-1">{errors.company}</p>}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email" className={errors.email ? "text-destructive" : ""}>E-mail corporativo</Label>
                  <Input id="email" type="email" placeholder="joao@empresa.com" value={form.email} onChange={e => { setForm({ ...form, email: e.target.value }); if (errors.email) setErrors({ ...errors, email: "" }); }} className={errors.email ? "border-destructive/50 focus-visible:ring-destructive/30" : ""} />
                  {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="password" className={errors.password ? "text-destructive" : ""}>Senha</Label>
                  <Input id="password" type="password" placeholder="Mínimo 8 caracteres" value={form.password} onChange={e => { setForm({ ...form, password: e.target.value }); if (errors.password) setErrors({ ...errors, password: "" }); }} className={errors.password ? "border-destructive/50 focus-visible:ring-destructive/30" : ""} />
                  {errors.password && <p className="text-destructive text-xs mt-1">{errors.password}</p>}
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
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-primary text-xs font-semibold">Próximo passo</span>
                </div>
                <h1 className="font-heading text-2xl text-foreground mb-2">Configure sua política</h1>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Suba o PDF da política de reembolso. Nossa IA lê e transforma em regras automáticas que serão aplicadas a cada despesa.
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
                  {uploading ? "Processando..." : file ? "Processar e continuar" : "Ir para dashboard"}
                  {!uploading && <ArrowRight className="w-4 h-4" />}
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  {file ? (
                    <>Nossa IA analisará a política e criará as regras automaticamente</>
                  ) : (
                    <>Você pode adicionar a política depois no dashboard</>
                  )}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}