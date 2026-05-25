import { useState } from "react";
import { useNavigate, Navigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Loader2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/AuthContext";
import { atualizarTelefone } from "@/api/usuarios";
import {
  telefoneValido,
  garantirDDI,
  isTelefoneDuplicado,
  mensagemErroTelefone,
  skipPhoneGate,
} from "@/lib/telefone";

// Gate de perfil: usuários (legados) que entraram sem WhatsApp salvo precisam
// informá-lo antes de usar o app, porque é a chave de roteamento das despesas
// recebidas por WhatsApp. Cadastros/aceites novos já capturam o número.
export default function CompletarPerfilPage() {
  const navigate = useNavigate();
  const { user, needsPhone, refreshProfile } = useAuth();
  const [telefone, setTelefone] = useState("");
  const [error, setError] = useState("");
  const [conflito, setConflito] = useState(false);
  const [saving, setSaving] = useState(false);

  // Quem já tem telefone não tem o que completar aqui.
  if (!needsPhone) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setConflito(false);
    const tel = garantirDDI(telefone);
    if (!telefoneValido(tel)) {
      return setError("Informe seu WhatsApp com DDD — ex.: (11) 95468-6897.");
    }
    setSaving(true);
    try {
      const { error: telErr } = await atualizarTelefone(user.id, tel);
      if (telErr) {
        setError(mensagemErroTelefone(telErr));
        // Número já em outra conta: oferece entrar mesmo assim, sem trancar.
        if (isTelefoneDuplicado(telErr)) setConflito(true);
        return;
      }
      await refreshProfile();
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(mensagemErroTelefone(err));
    } finally {
      setSaving(false);
    }
  };

  // Escape: entra no app sem salvar (só esta conta fica sem roteamento por WhatsApp).
  const entrarMesmoAssim = () => {
    skipPhoneGate();
    navigate("/dashboard", { replace: true });
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
            <MessageCircle className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="font-heading text-2xl text-foreground leading-tight">Falta só seu WhatsApp</h1>
            <p className="text-muted-foreground text-sm">
              É por ele que o Reembolsaaí reconhece as despesas que você enviar.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="telefone">Seu WhatsApp</Label>
            <Input
              id="telefone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="(11) 95468-6897"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              autoFocus
            />
          </div>

          {error && <p className="text-destructive text-sm">{error}</p>}

          <Button type="submit" disabled={saving} className="w-full h-11 text-base">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Salvar e continuar <ArrowRight className="w-4 h-4" /></>}
          </Button>

          {conflito && (
            <button
              type="button"
              onClick={entrarMesmoAssim}
              className="w-full text-center text-sm text-muted-foreground hover:text-foreground underline underline-offset-4"
            >
              Esse número não é meu nesta conta — entrar mesmo assim
            </button>
          )}
        </form>
      </motion.div>
    </div>
  );
}
