import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signIn(form.email.trim(), form.password);
      // RequireEmpresa guard sends to /comecar if the user has no empresa yet.
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err?.message || "Não foi possível entrar.";
      setError(
        /invalid login credentials/i.test(msg)
          ? "E-mail ou senha incorretos."
          : /email not confirmed/i.test(msg)
          ? "Confirme seu e-mail antes de entrar."
          : msg
      );
    } finally {
      setLoading(false);
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
        <div>
          <h1 className="font-heading text-2xl text-foreground mb-1">Entrar</h1>
          <p className="text-muted-foreground text-sm">Acesse o painel da sua empresa.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="voce@empresa.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          {error && <p className="text-destructive text-sm">{error}</p>}

          <Button type="submit" disabled={loading} className="w-full h-11 text-base">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Entrar <ArrowRight className="w-4 h-4" /></>}
          </Button>
        </form>

        <p className="text-center text-xs text-muted-foreground">
          Não tem conta?{" "}
          <Link to="/cadastro" className="text-primary hover:underline">Criar conta</Link>
        </p>
      </motion.div>
    </div>
  );
}
