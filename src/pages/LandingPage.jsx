import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  CircleAlert,
  FileCheck2,
  MessageCircle,
  Receipt,
  ShieldCheck,
  Sparkles,
  Users,
  WalletCards,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/AuthContext";

const PAINS = [
  "Planilhas, e-mails e comprovantes espalhados em vários canais.",
  "Gestores gastando tempo aprovando despesa repetitiva sem contexto.",
  "Política em PDF que não vira regra operacional no dia a dia.",
];

const BENEFITS = [
  {
    icon: MessageCircle,
    title: "Entrada por WhatsApp ou web",
    text: "O colaborador envia a despesa no canal mais natural, sem virar especialista em sistema.",
  },
  {
    icon: Sparkles,
    title: "IA antes da fila humana",
    text: "Extração, classificação e leitura inicial acontecem antes do aprovador perder tempo.",
  },
  {
    icon: ShieldCheck,
    title: "Política aplicada com consistência",
    text: "A empresa transforma o PDF em critério operacional e reduz decisão improvisada.",
  },
  {
    icon: FileCheck2,
    title: "Auditoria pronta",
    text: "Canal, comprovante, regra aplicada e decisão ficam no mesmo histórico.",
  },
];

const STEPS = [
  {
    number: "01",
    title: "Cadastre a empresa",
    text: "O administrador entra, cria o tenant e inicia o setup do fluxo.",
  },
  {
    number: "02",
    title: "Suba a política",
    text: "A IA organiza o PDF em regras revisáveis antes de ativar.",
  },
  {
    number: "03",
    title: "Receba despesas",
    text: "Web e WhatsApp entram no mesmo motor de classificação e aprovação.",
  },
  {
    number: "04",
    title: "Aprove o que importa",
    text: "A fila humana fica focada nas exceções e não no volume inteiro.",
  },
];

const METRICS = [
  { value: "3 min", label: "para um colaborador enviar a despesa" },
  { value: "1 fluxo", label: "para onboarding, política, envio e aprovação" },
  { value: "0 caos", label: "quando a política deixa de ser PDF solto" },
  { value: "100%", label: "de rastreabilidade entre comprovante e decisão" },
];

const PLANS = [
  {
    name: "Starter",
    price: "R$ 29",
    period: "/mês",
    desc: "Para times que querem sair da planilha sem aumentar operação.",
    items: ["Até 5 usuários", "100 despesas por mês", "1 política ativa", "Painel operacional"],
  },
  {
    name: "Growth",
    price: "R$ 49",
    period: "/mês por usuário",
    desc: "Para quem quer automação de verdade e fila de aprovação mais enxuta.",
    items: ["Usuários ilimitados", "WhatsApp no fluxo", "Dashboard completo", "Histórico de auditoria"],
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Sob consulta",
    period: "",
    desc: "Para operações maiores com estrutura, governança e integrações.",
    items: ["SSO", "Multi-CNPJ", "SLA dedicado", "Onboarding assistido"],
  },
];

const FAQS = [
  {
    q: "O colaborador precisa instalar app?",
    a: "Não. Ele pode usar o WhatsApp que já tem no celular ou o portal web da empresa.",
  },
  {
    q: "A IA aprova tudo sozinha?",
    a: "Não. Ela reduz trabalho repetitivo e organiza contexto. A decisão humana continua nos casos fora da regra.",
  },
  {
    q: "A política pode ser revisada antes de valer?",
    a: "Sim. A IA estrutura as regras e o admin revisa antes de ativar a versão.",
  },
  {
    q: "Isso serve para auditoria?",
    a: "Sim. Cada despesa carrega comprovante, canal, leitura, regra aplicada e histórico de decisão.",
  },
];

export default function LandingPage() {
  const { isAuthenticated, hasEmpresa } = useAuth();
  const ctaHref = isAuthenticated ? (hasEmpresa ? "/dashboard" : "/comecar") : "/cadastro";
  const ctaLabel = isAuthenticated ? "Abrir painel" : "Começar grátis";

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-b from-accent/30 via-background to-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <Receipt className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="truncate font-heading text-sm text-foreground sm:text-base">Reembolsaaí</p>
              <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">expense control</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
            <a href="#como-funciona" className="transition-colors hover:text-foreground">Como funciona</a>
            <a href="#beneficios" className="transition-colors hover:text-foreground">Benefícios</a>
            <a href="#precos" className="transition-colors hover:text-foreground">Preços</a>
          </nav>

          <div className="flex items-center gap-2">
            {!isAuthenticated ? (
              <Button asChild variant="ghost" size="sm">
                <Link to="/login">Entrar</Link>
              </Button>
            ) : null}
            <Button asChild size="sm" className="rounded-full px-4 sm:px-5">
              <Link to={ctaHref}>{ctaLabel}</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="px-4 pb-12 pt-12 sm:px-6 md:pb-16 md:pt-20">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="max-w-2xl">
            <h1 className="font-heading text-4xl leading-[0.96] text-foreground sm:text-5xl md:text-7xl">
              Reembolso corporativo que parece simples para quem envia e sério para quem aprova.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8 md:text-xl">
              O colaborador envia o comprovante por WhatsApp ou web. O Reembolsaaí organiza, aplica a política, entrega contexto e deixa a equipe focada no que realmente exige decisão.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="h-12 w-full rounded-full px-6 sm:w-auto">
                <Link to={ctaHref}>
                  {ctaLabel}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 w-full rounded-full bg-card px-6 sm:w-auto">
                <a href="#como-funciona">Ver demonstração do fluxo</a>
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap gap-2.5 text-sm text-muted-foreground">
              {["WhatsApp + Web", "Política + IA", "Auditoria pronta"].map((item) => (
                <div key={item} className="rounded-full border border-border bg-card px-3 py-2 shadow-sm sm:px-4">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-6 top-10 hidden h-24 w-24 rounded-full bg-primary/15 blur-3xl md:block" />
            <div className="absolute -right-8 bottom-6 hidden h-24 w-24 rounded-full bg-accent blur-3xl md:block" />

            <div className="relative rounded-[2rem] border border-border bg-card p-4 shadow-sm backdrop-blur sm:p-5">
              <div className="rounded-[1.6rem] border border-border bg-background/80 p-4 sm:p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Despesa recebida</p>
                    <p className="mt-2 text-lg font-semibold text-foreground">Almoço com cliente</p>
                  </div>
                  <div className="w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    Dentro da política
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {[
                    ["Canal", "WhatsApp"],
                    ["Valor", "R$ 87,40"],
                    ["Categoria", "Alimentação"],
                    ["Resultado", "Aprovação automática"],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-2xl border border-border bg-card px-4 py-3">
                      <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
                      <p className="mt-1 text-sm font-medium text-foreground">{value}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-2xl border border-border bg-accent/50 px-4 py-4">
                  <p className="text-sm font-medium text-foreground">A IA já fez a parte repetitiva.</p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    Extração, leitura inicial, política aplicada e histórico prontos antes de qualquer aprovador tocar na fila.
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {[
                  { label: "Fila humana", value: "Só exceções" },
                  { label: "Governança", value: "Tenant isolado" },
                  { label: "Financeiro", value: "Saída rastreável" },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-border bg-card px-4 py-4">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{item.label}</p>
                    <p className="mt-2 text-sm font-medium text-foreground">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-6 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 md:grid-cols-4">
          {METRICS.map((item) => (
            <div key={item.label} className="rounded-[1.75rem] border border-border bg-card p-6 shadow-sm">
              <p className="font-heading text-4xl text-foreground">{item.value}</p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-14">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">O problema hoje</p>
            <h2 className="mt-3 font-heading text-4xl leading-tight text-foreground md:text-5xl">
              Reembolso não trava por falta de tela. Trava por falta de fluxo.
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-8 text-muted-foreground">
              A maior dor não é capturar o comprovante. É fazer política, aprovação, auditoria e financeiro conversarem sem espalhar trabalho manual pela empresa.
            </p>
          </div>

          <div className="grid gap-4">
            {PAINS.map((item) => (
              <div key={item} className="flex gap-4 rounded-[1.75rem] border border-border bg-card p-6 shadow-sm">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
                  <CircleAlert className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-base leading-7 text-foreground">{item}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="beneficios" className="border-y border-border bg-card/30 px-6 py-14">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Benefícios</p>
            <h2 className="mt-3 font-heading text-4xl text-foreground md:text-5xl">
              Um produto para vender simplicidade sem perder controle.
            </h2>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {BENEFITS.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-[2rem] border border-border bg-card p-7 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-heading text-2xl text-foreground">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="como-funciona" className="px-6 py-14">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Como funciona</p>
            <h2 className="mt-3 font-heading text-4xl text-foreground md:text-5xl">
              Uma jornada simples para gerar confiança e venda.
            </h2>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-4">
            {STEPS.map((step) => (
              <div key={step.number} className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  {step.number}
                </div>
                <h3 className="mt-5 font-heading text-2xl text-foreground">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-14">
        <div className="mx-auto grid max-w-6xl gap-8 rounded-[2.25rem] border border-border bg-card p-8 shadow-sm md:grid-cols-[0.95fr_1.05fr] md:p-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">Por que converte</p>
            <h2 className="mt-3 font-heading text-4xl text-foreground md:text-5xl">
              A promessa é clara: menos atrito para o colaborador, mais critério para a empresa.
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { icon: Users, title: "Colaborador", text: "Envia rápido e entende o status." },
              { icon: ShieldCheck, title: "Aprovador", text: "Recebe contexto antes de decidir." },
              { icon: WalletCards, title: "Financeiro", text: "Enxerga saída e trilha no mesmo fluxo." },
              { icon: BarChart3, title: "Admin", text: "Liga empresa, política e equipe sem improviso." },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-[1.75rem] border border-border bg-background p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-heading text-xl text-foreground">{title}</h3>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="precos" className="border-y border-border bg-card/30 px-6 py-14">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Preços</p>
            <h2 className="mt-3 font-heading text-4xl text-foreground md:text-5xl">
              Planos claros para vender sem fricção.
            </h2>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-[2rem] border p-7 shadow-sm ${
                  plan.featured
                    ? "border-primary bg-accent/40 ring-1 ring-primary/20"
                    : "border-border bg-card"
                }`}
              >
                <p className="font-heading text-2xl text-foreground">{plan.name}</p>
                <p className="mt-4 text-4xl font-semibold text-foreground">
                  {plan.price}
                  <span className="ml-1 text-base font-normal text-muted-foreground">{plan.period}</span>
                </p>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{plan.desc}</p>
                <ul className="mt-6 space-y-3 text-sm text-foreground">
                  {plan.items.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  className={`mt-8 w-full rounded-full ${
                    plan.featured
                      ? ""
                      : "bg-foreground text-background hover:bg-foreground/90"
                  }`}
                >
                  <Link to="/cadastro">Começar</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-14">
        <div className="mx-auto max-w-5xl">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">FAQ</p>
            <h2 className="mt-3 font-heading text-4xl text-foreground md:text-5xl">
              Perguntas que aparecem antes da venda.
            </h2>
          </div>

          <div className="mt-10 grid gap-4">
            {FAQS.map((faq) => (
              <div key={faq.q} className="rounded-[1.75rem] border border-border bg-card p-6 shadow-sm">
                <h3 className="font-heading text-2xl text-foreground">{faq.q}</h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-16 pt-4">
        <div className="mx-auto max-w-5xl rounded-[2.5rem] border border-border bg-card p-8 text-center shadow-sm md:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Pronto para testar</p>
          <h2 className="mt-4 font-heading text-4xl text-foreground md:text-5xl">
            Coloque sua política para trabalhar e reduza a fila de reembolso da empresa.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
            Comece com onboarding simples, receba despesas no canal certo e deixe as exceções chegarem com contexto.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-12 rounded-full px-6">
              <Link to={ctaHref}>
                {ctaLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            {!isAuthenticated ? (
              <Button asChild size="lg" variant="outline" className="h-12 rounded-full bg-background px-6">
                <Link to="/login">Entrar</Link>
              </Button>
            ) : null}
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-background/80">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-8 text-sm text-muted-foreground md:flex-row">
          <div className="flex items-center gap-2">
            <Receipt className="h-4 w-4" />
            <span>© {new Date().getFullYear()} Reembolsaaí</span>
          </div>
          <div className="flex gap-6">
            <Link to="/login" className="transition-colors hover:text-foreground">Entrar</Link>
            <Link to="/cadastro" className="transition-colors hover:text-foreground">Criar conta</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
