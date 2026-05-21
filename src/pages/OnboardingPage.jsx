import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Loader2, Building2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/AuthContext";

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
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12">
      <div className="flex items-center gap-2.5 mb-10">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-heading text-sm font-bold">R$</span>
        </div>
        <span className="font-heading text-foreground text-base">Reembolsaaí</span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-md bg-card border border-border rounded-2xl p-8 space-y-6"
      >
        <div>
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
            <Building2 className="w-6 h-6 text-primary" />
          </div>
          <h1 className="font-heading text-2xl text-foreground mb-1">Crie sua empresa</h1>
          <p className="text-muted-foreground text-sm">
            Olá, {profile?.nome || "bem-vindo"}! Dê um nome à sua empresa para começar.
            Você será o administrador e poderá convidar a equipe depois.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="empresa">Nome da empresa</Label>
            <Input
              id="empresa"
              placeholder="Acme Ltda"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              autoFocus
            />
          </div>

          {error && <p className="text-destructive text-sm">{error}</p>}

          <Button type="submit" disabled={loading} className="w-full h-11 text-base">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Criar empresa e entrar <ArrowRight className="w-4 h-4" /></>}
          </Button>
        </form>

        <div className="flex items-center gap-2 text-xs text-muted-foreground border-t border-border pt-4">
          <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
          <span>Cada empresa tem dados isolados por Row-Level Security no Supabase.</span>
        </div>

        <button
          onClick={() => signOut()}
          className="w-full text-center text-xs text-muted-foreground hover:text-foreground"
        >
          Sair
        </button>
      </motion.div>
    </div>
  );
}
