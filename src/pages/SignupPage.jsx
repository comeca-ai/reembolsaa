import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowRight, Loader2, MailCheck, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/AuthContext";
import { atualizarTelefone } from "@/api/usuarios";
import { garantirDDI, normalizarTelefone, telefoneValido } from "@/lib/telefone";

const SIGNUP_POINTS = [
  "O cadastro cria a conta do administrador da empresa.",
  "O WhatsApp salvo aqui vira a chave do seu fluxo operacional.",
  "Depois do cadastro, você segue para onboarding da empresa e política.",
];

function formatTelefoneInput(value) {
  const digits = normalizarTelefone(value).replace(/^55/, "").slice(0, 11);

  if (!digits) return "";
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export default function SignupPage() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [form, setForm] = useState({ nome: "", email: "", password: "", telefone: "" });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [needsConfirm, setNeedsConfirm] = useState(false);

  const validate = () => {
    const nextErrors = {};

    if (!form.nome.trim()) nextErrors.nome = "Nome obrigatório";
    if (!form.email.trim()) nextErrors.email = "E-mail obrigatório";
    if (form.password.length < 8) nextErrors.password = "Mínimo de 8 caracteres";
    if (!telefoneValido(garantirDDI(form.telefone))) {
      nextErrors.telefone = "WhatsApp com DDD, ex: (11) 95468-6897";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!validate()) return;

    setLoading(true);
    try {
      const data = await signUp(form.email.trim(), form.password, form.nome.trim());

      if (data.session) {
        await atualizarTelefone(data.session.user.id, garantirDDI(form.telefone));
        navigate("/comecar", { replace: true });
      } else {
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
      <div className="grid min-h-screen place-items-center bg-gradient-to-b from-accent/30 via-background to-background px-4 py-12">
        <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-accent text-accent-foreground">
            <MailCheck className="h-6 w-6" />
          </div>
          <h1 className="mt-5 font-heading text-3xl text-foreground">Confirme seu e-mail</h1>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            Enviamos um link de confirmação para <strong className="text-foreground">{form.email}</strong>. Depois disso, você já pode entrar e continuar a configuração da empresa.
          </p>
          <Button onClick={() => navigate("/login")} className="mt-8 h-11 w-full">
            Ir para o login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent/30 via-background to-background px-4 py-12">
      <div className="mx-auto grid min-h-[calc(100vh-6rem)] max-w-6xl gap-10 lg:grid-cols-[1fr_460px] lg:items-center">
        <section className="max-w-2xl">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <Receipt className="h-4 w-4" />
            </div>
            <div>
              <p className="font-heading text-base text-foreground">Reembolsaaí</p>
              <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">expense control</p>
            </div>
          </Link>

          <h1 className="mt-10 font-heading text-4xl leading-tight text-foreground md:text-5xl">
            Comece a gerir despesas com compliance e WhatsApp.
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-8 text-muted-foreground">
            Crie a conta da empresa e ative gestão de despesas, política aplicada com compliance e o canal de WhatsApp num fluxo só.
          </p>

          <div className="mt-8 space-y-3">
            {SIGNUP_POINTS.map((item) => (
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
            <h2 className="font-heading text-3xl text-foreground">Criar conta</h2>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              Use seu e-mail corporativo e informe o WhatsApp que vai operar no fluxo de despesas.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="nome" className={errors.nome ? "text-destructive" : ""}>Seu nome</Label>
              <Input
                id="nome"
                autoComplete="name"
                placeholder="João Silva"
                value={form.nome}
                onChange={(event) => setForm({ ...form, nome: event.target.value })}
                className="h-11 bg-background"
              />
              {errors.nome ? <p className="text-xs text-destructive">{errors.nome}</p> : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className={errors.email ? "text-destructive" : ""}>E-mail corporativo</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="voce@empresa.com"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                className="h-11 bg-background"
              />
              {errors.email ? <p className="text-xs text-destructive">{errors.email}</p> : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone" className={errors.telefone ? "text-destructive" : ""}>WhatsApp</Label>
              <Input
                id="telefone"
                autoComplete="tel"
                placeholder="(11) 95468-6897"
                value={form.telefone}
                onChange={(event) => setForm({ ...form, telefone: formatTelefoneInput(event.target.value) })}
                className="h-11 bg-background"
              />
              <p className="text-xs text-muted-foreground">
                Esse número será usado para identificar suas despesas enviadas pelo WhatsApp.
              </p>
              {errors.telefone ? <p className="text-xs text-destructive">{errors.telefone}</p> : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className={errors.password ? "text-destructive" : ""}>Senha</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                placeholder="Mínimo de 8 caracteres"
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                className="h-11 bg-background"
              />
              {errors.password ? <p className="text-xs text-destructive">{errors.password}</p> : null}
            </div>

            {error ? <p className="text-sm text-destructive">{error}</p> : null}

            <Button type="submit" disabled={loading} className="h-11 w-full">
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Criar conta
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Já tem conta?{" "}
            <Link to="/login" className="font-medium text-primary hover:underline">
              Entrar
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}
