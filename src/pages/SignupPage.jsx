import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Loader2, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/AuthContext";

export default function SignupPage() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [form, setForm] = useState({ nome: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [needsConfirm, setNeedsConfirm] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.nome.trim()) e.nome = "Nome obrigatório";
    if (!form.email.trim()) e.email = "E-mail obrigatório";
    if (form.password.length < 8) e.password = "Mínimo 8 caracteres";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!validate()) return;
    setLoading(true);
    try {
      const data = await signUp(form.email.trim(), form.password, form.nome.trim());
      if (data.session) {
        // Confirmação de e-mail desativada: já está logado.
        // O guard envia para /comecar (criar empresa) ou /dashboard (entrou via convite).
        navigate("/comecar", { replace: true });
      } else {
        // Confirmação de e-mail ativada no Supabase.
        setNeedsConfirm(true);
      }
    } catch (err) {
      const msg = err?.message || "Não foi possível criar a conta.";
      setError(
        /already registered|user already exists/i.test(msg)
          ? "Este e-mail já tem conta. Tente entrar."
          : msg
      );
    } finally {
      setLoading(false);
    }
  };

  if (needsConfirm) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-card border border-border rounded-2xl p-8 space-y-4 text-center">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
            <MailCheck className="w-6 h-6 text-primary" />
          </div>
          <h1 className="font-heading text-2xl text-foreground">Confirme seu e-mail</h1>
          <p className="text-muted-foreground text-sm">
            Enviamos um link de confirmação para <strong>{form.email}</strong>. Após confirmar, faça login.
          </p>
          <Button onClick={() => navigate("/login")} className="w-full h-11">Ir para o login</Button>
        </div>
      </div>
    );
  }

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
        <div>
          <h1 className="font-heading text-2xl text-foreground mb-1">Criar conta</h1>
          <p className="text-muted-foreground text-sm">
            Comece grátis. No próximo passo você cria sua empresa.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="nome" className={errors.nome ? "text-destructive" : ""}>Seu nome</Label>
            <Input
              id="nome"
              placeholder="João Silva"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
            />
            {errors.nome && <p className="text-destructive text-xs">{errors.nome}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email" className={errors.email ? "text-destructive" : ""}>E-mail corporativo</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="joao@empresa.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            {errors.email && <p className="text-destructive text-xs">{errors.email}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password" className={errors.password ? "text-destructive" : ""}>Senha</Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              placeholder="Mínimo 8 caracteres"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            {errors.password && <p className="text-destructive text-xs">{errors.password}</p>}
          </div>

          {error && <p className="text-destructive text-sm">{error}</p>}

          <Button type="submit" disabled={loading} className="w-full h-11 text-base">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Criar conta <ArrowRight className="w-4 h-4" /></>}
          </Button>
        </form>

        <p className="text-center text-xs text-muted-foreground">
          Já tem conta?{" "}
          <Link to="/login" className="text-primary hover:underline">Entrar</Link>
        </p>
      </motion.div>
    </div>
  );
}
