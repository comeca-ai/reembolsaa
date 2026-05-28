import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { ArrowRight, Loader2, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/AuthContext";

const LOGIN_POINTS = [
  "Acesse a fila de aprovações da sua empresa.",
  "Continue o onboarding se sua empresa ainda não terminou a configuração.",
  "Mantenha o histórico de política, despesas e auditoria no mesmo painel.",
];

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signIn(form.email.trim(), form.password);
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
    <div className="min-h-screen bg-gradient-to-b from-accent/30 via-background to-background px-4 py-12">
      <div className="mx-auto grid min-h-[calc(100vh-6rem)] max-w-6xl gap-10 lg:grid-cols-[1fr_440px] lg:items-center">
        <section className="max-w-2xl">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <Receipt className="h-4 w-4" />
            </div>
            <div>
              <p className="font-heading text-base text-foreground">Reembolsaaí</p>
              <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Controle de despesas</p>
            </div>
          </Link>

          <h1 className="mt-10 font-heading text-4xl leading-tight text-foreground md:text-5xl">
            Retome a operação de despesas da sua empresa.
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-8 text-muted-foreground">
            Entre para continuar de onde parou: gestão de despesas, política aplicada com compliance e o canal de WhatsApp num fluxo só.
          </p>

          <div className="mt-8 space-y-3">
            {LOGIN_POINTS.map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-2xl border border-border bg-card px-4 py-4 shadow-sm">
                <div className="mt-1 h-2.5 w-2.5 rounded-full bg-primary" />
                <p className="text-sm leading-7 text-foreground">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-border bg-card p-8 shadow-sm">
          <Link to="/" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            ← Voltar
          </Link>

          <div className="mt-6">
            <h2 className="font-heading text-3xl text-foreground">Entrar</h2>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              Use seu e-mail corporativo para acessar o painel e retomar o fluxo da empresa.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="voce@empresa.com"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                required
                className="h-11 bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                required
                className="h-11 bg-background"
              />
            </div>

            {error ? <p className="text-sm text-destructive">{error}</p> : null}

            <Button type="submit" disabled={loading} className="h-11 w-full">
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Entrar
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Ainda não tem conta?{" "}
            <Link to="/cadastro" className="font-medium text-primary hover:underline">
              Criar conta
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}
