import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Loader2, Building2, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/AuthContext";

const STEPS = [
  { number: "1", label: "Criar empresa", active: true },
  { number: "2", label: "Subir política", active: false },
  { number: "3", label: "Começar a usar", active: false },
];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { profile, hasEmpresa, createEmpresa, signOut } = useAuth();
  const [nome, setNome] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Quem já pertence a uma empresa não precisa deste passo.
  if (hasEmpresa) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!nome.trim()) {
      setError("Informe o nome da empresa.");
      return;
    }
    setLoading(true);
    try {
      await createEmpresa(nome.trim());
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err?.message || "Não foi possível criar a empresa.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-accent/20 flex flex-col">
      {/* Header simples */}
      <header className="px-6 py-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-heading text-sm font-bold">R$</span>
          </div>
          <span className="font-heading text-foreground text-base">Reembolsaaí</span>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-lg"
        >
          {/* Progresso */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {STEPS.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className={`flex flex-col items-center ${index < STEPS.length - 1 ? 'flex-1' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                      step.active 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-secondary text-muted-foreground'
                    }`}>
                      {step.active ? step.number : <CheckCircle2 className="w-4 h-4" />}
                    </div>
                    <span className={`text-xs mt-1.5 ${step.active ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {step.label}
                    </span>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div className="w-16 md:w-24 h-px bg-border mx-2 mt-[-14px]" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Card principal */}
          <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm">
            <div className="text-center mb-6">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <Building2 className="w-7 h-7 text-primary" />
              </div>
              <h1 className="font-heading text-2xl text-foreground mb-2">
                Crie sua empresa
              </h1>
              <p className="text-muted-foreground text-sm">
                Olá, <span className="text-foreground font-medium">{profile?.nome?.split(' ')[0] || "bem-vindo"}</span>! 
                Vamos configurar seu ambiente em 3 passos rápidos.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="empresa" className="text-foreground">
                  Nome da empresa
                </Label>
                <Input
                  id="empresa"
                  placeholder="Ex: Acme Brasil Ltda"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  autoFocus
                  className="h-12 text-base"
                />
                <p className="text-xs text-muted-foreground">
                  Esse nome aparecerá nos relatórios e comprovantes
                </p>
              </div>

              {error && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <Button 
                type="submit" 
                disabled={loading} 
                className="w-full h-12 text-base rounded-xl shadow-sm"
                size="lg"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Criar empresa e continuar
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </form>

            {/* Dica de segurança */}
            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex items-start gap-3 text-sm text-muted-foreground">
                <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <p>
                  Seus dados ficam isolados em um ambiente seguro. 
                  Cada empresa tem seu próprio espaço protegido.
                </p>
              </div>
            </div>
          </div>

          {/* Sair */}
          <button
            onClick={() => signOut()}
            className="w-full text-center text-sm text-muted-foreground hover:text-foreground mt-6 py-2"
          >
            Sair da conta
          </button>
        </motion.div>
      </div>
    </div>
  );
}
