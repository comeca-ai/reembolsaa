import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Loader2, ShieldCheck, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/lib/AuthContext";

// Tela de aceite do convite: o link do e-mail cria uma sessão (detectSessionInUrl),
// e aqui o convidado define a senha. O profile já vem ligado à empresa/papel pelo
// trigger handle_new_user (a partir da invitation).
export default function AceitarConvitePage() {
  const navigate = useNavigate();
  const { session, user, loading, refreshProfile } = useAuth();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // O AppRoutes já exibe o loader enquanto a sessão do link é processada.
  if (loading) return null;

  // Sem sessão = link inválido ou expirado.
  if (!session) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-card border border-border rounded-2xl p-8 space-y-4 text-center">
          <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6 text-warning" />
          </div>
          <h1 className="font-heading text-2xl text-foreground">Convite inválido ou expirado</h1>
          <p className="text-muted-foreground text-sm">
            Peça ao administrador para reenviar o convite, ou entre se você já tem conta.
          </p>
          <Button onClick={() => navigate("/login")} className="w-full h-11">Ir para o login</Button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password.length < 8) return setError("A senha precisa de ao menos 8 caracteres.");
    if (password !== confirm) return setError("As senhas não conferem.");
    setSaving(true);
    try {
      const { error: upErr } = await supabase.auth.updateUser({ password });
      if (upErr) throw upErr;
      await refreshProfile();
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err?.message || "Não foi possível definir a senha.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12">
      <Link to="/" className="flex items-center gap-2.5 mb-10">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-heading text-sm font-bold">R$</span>
        </div>
        <span className="font-heading text-foreground text-base">Reembolsaaí</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-md bg-card border border-border rounded-2xl p-8 space-y-6"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="font-heading text-2xl text-foreground leading-tight">Bem-vindo!</h1>
            <p className="text-muted-foreground text-sm">
              Defina uma senha para acessar {user?.email ? <strong className="text-foreground">{user.email}</strong> : "sua conta"}.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="password">Nova senha</Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              placeholder="Mínimo 8 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="confirm">Confirmar senha</Label>
            <Input
              id="confirm"
              type="password"
              autoComplete="new-password"
              placeholder="Repita a senha"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>

          {error && <p className="text-destructive text-sm">{error}</p>}

          <Button type="submit" disabled={saving} className="w-full h-11 text-base">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Definir senha e entrar <ArrowRight className="w-4 h-4" /></>}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
