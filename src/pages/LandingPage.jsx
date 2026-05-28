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

const SOCIAL_PROOF = {
  headline: "Já usado por times de",
  companies: ["Startups fintech", "Escritórios de advocacia", "Agências de marketing", "Clínicas médicas"],
  stats: [
    { value: "2.000+", label: "despesas processadas" },
    { value: "R$ 1.2M", label: "em reembolsos" },
    { value: "4.9/5", label: "satisfação dos usuários" },
  ],
};

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
  { value: "0 retrabalho", label: "quando a política deixa de ser PDF solto" },
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
              <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Controle de despesas</p>
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

      {/* Hero Section */}
      <section className="relative px-4 pb-12 pt-12 sm:px-6 md:pb-16 md:pt-20">
        {/* Badge de urgência */}
        <div className="mx-auto max-w-6xl mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">Teste grátis por 14 dias</span>
            <span className="text-sm text-muted-foreground">— sem cartão de crédito</span>
          </div>
        </div>

        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="max-w-2xl">
            <h1 className="font-heading text-4xl leading-[1.1] text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
              Acabe com a dor do reembolso na sua empresa
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8 md:text-xl">
              Colaboradores enviam comprovante por WhatsApp. A IA organiza, aplica a política e só pede aprovação quando precisa. <span className="text-foreground font-medium">Menos fila, mais controle.</span>
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="h-14 w-full rounded-full px-8 text-base sm:w-auto shadow-lg shadow-primary/20">
                <Link to={ctaHref}>
                  Começar grátis — 14 dias
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-14 w-full rounded-full bg-card px-6 sm:w-auto">
                <a href="#como-funciona">Ver como funciona</a>
              </Button>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              Setup em 5 minutos · Cancele quando quiser
            </p>

            {/* Trust badges */}
            <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              {["WhatsApp + Web", "IA integrada", "Auditoria pronta", "Suporte humano"].map((item) => (
                <div key={item} className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>{item}</span>
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
                    ✅ Aprovado automaticamente
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {[
                    ["Canal", "WhatsApp"],
                    ["Valor", "R$ 87,40"],
                    ["Categoria", "Alimentação"],
                    ["Tempo total", "2 minutos"],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-2xl border border-border bg-card px-4 py-3">
                      <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
                      <p className="mt-1 text-sm font-medium text-foreground">{value}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-2xl border border-border bg-accent/50 px-4 py-4">
                  <p className="text-sm font-medium text-foreground">🤖 IA já fez o trabalho pesado</p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    Extraiu os dados, leu o comprovante, aplicou a política e arquivou tudo. Nenhum aprovador precisou perder tempo.
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {[
                  { label: "Fila humana", value: "Só exceções" },
                  { label: "Compliance", value: "Automático" },
                  { label: "Auditoria", value: "Sempre pronta" },
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

        {/* Social Proof Stats */}
        <div className="mx-auto max-w-6xl mt-16 pt-8 border-t border-border/50">
          <p className="text-center text-sm text-muted-foreground mb-6">{SOCIAL_PROOF.headline}</p>
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {SOCIAL_PROOF.companies.map((company) => (
              <div key={company} className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground">
                {company}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
            {SOCIAL_PROOF.stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-heading text-2xl md:text-3xl text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
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

      {/* Problem Section */}
      <section className="px-6 py-14">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-destructive">O problema</p>
            <h2 className="mt-3 font-heading text-3xl md:text-4xl lg:text-5xl text-foreground">
              O reembolso não trava por falta de tela.
              <span className="text-muted-foreground"> Trava por falta de fluxo.</span>
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              { 
                icon: CircleAlert, 
                title: "Comprovantes espalhados",
                text: "WhatsApp, email, papel. Ninguém sabe onde está o que falta." 
              },
              { 
                icon: CircleAlert, 
                title: "Aprovação sem contexto",
                text: "Gestores perdem tempo com despesa que poderia ser automática." 
              },
              { 
                icon: CircleAlert, 
                title: "Política no PDF",
                text: "Regras existem no papel mas não no dia a dia da operação." 
              },
            ].map((item) => (
              <div key={item.title} className="rounded-[1.75rem] border border-border bg-card p-6 shadow-sm text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-heading text-lg text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.text}</p>
              </div>
            ))}
          </div>

          {/* CTA no meio da página */}
          <div className="mt-12 text-center">
            <Button asChild size="lg" className="h-14 rounded-full px-8 text-base shadow-lg shadow-primary/20">
              <Link to={ctaHref}>
                Ver como resolvemos isso →
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="beneficios" className="border-y border-border bg-card/30 px-6 py-14">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Benefícios</p>
            <h2 className="mt-3 font-heading text-4xl text-foreground md:text-5xl">
              Simples para quem envia. Rigoroso para quem aprova.
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

      {/* Testimonial Section */}
      <section className="px-6 py-14">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-[2rem] border border-border bg-card p-8 md:p-12 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <span className="text-2xl">💬</span>
            </div>
            <blockquote className="font-heading text-2xl md:text-3xl text-foreground leading-relaxed">
              "Acabamos com a planilha de reembolso em 2 dias. O time de vendas manda pelo WhatsApp e o financeiro só vê o que precisa."
            </blockquote>
            <div className="mt-6">
              <p className="font-medium text-foreground">Ana Paula M.</p>
              <p className="text-sm text-muted-foreground">CFO · Startup fintech · 45 colaboradores</p>
            </div>
            <div className="mt-6 flex items-center justify-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className="text-primary text-xl">★</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it Works - Visual Steps */}
      <section id="como-funciona" className="px-6 py-14 bg-card/30">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Como funciona</p>
            <h2 className="mt-3 font-heading text-3xl md:text-4xl lg:text-5xl text-foreground">
              Do WhatsApp à aprovação em 4 passos
            </h2>
            <p className="mt-4 text-muted-foreground">
              Sem instalar nada. O colaborador usa o WhatsApp que já tem.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { 
                number: "1", 
                title: "Envia", 
                text: "Colaborador manda foto do comprovante no WhatsApp ou web",
                time: "30 segundos"
              },
              { 
                number: "2", 
                title: "Extrai", 
                text: "IA lê dados, classifica categoria e identifica o que é",
                time: "Automático"
              },
              { 
                number: "3", 
                title: "Aplica", 
                text: "Sistema verifica política da empresa e decide o caminho",
                time: "Instantâneo"
              },
              { 
                number: "4", 
                title: "Resolve", 
                text: "Dentro da política = aprovado. Fora = vai para gestor com contexto",
                time: "2 min vs 2 dias"
              },
            ].map((step) => (
              <div key={step.number} className="relative rounded-[1.5rem] border border-border bg-card p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    {step.number}
                  </div>
                  <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                    {step.time}
                  </span>
                </div>
                <h3 className="font-heading text-xl text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.text}</p>
              </div>
            ))}
          </div>

          {/* Resultado destacado */}
          <div className="mt-10 rounded-[1.5rem] border border-primary/20 bg-primary/5 p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="font-heading text-xl text-foreground">Resultado para o gestor</h3>
                <p className="mt-2 text-muted-foreground">
                  Chega só o que realmente precisa de olho humano, com contexto completo para decidir rápido.
                </p>
              </div>
              <Button asChild size="lg" className="h-12 rounded-full px-6 whitespace-nowrap">
                <Link to={ctaHref}>
                  Testar agora →
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-14">
        <div className="mx-auto grid max-w-6xl gap-8 rounded-[2.25rem] border border-border bg-card p-8 shadow-sm md:grid-cols-[0.95fr_1.05fr] md:p-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">Para cada papel</p>
            <h2 className="mt-3 font-heading text-4xl text-foreground md:text-5xl">
              Menos atrito para o colaborador. Mais critério para a empresa.
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

      {/* Pricing Section */}
      <section id="precos" className="border-y border-border bg-card/30 px-6 py-14">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Preços</p>
            <h2 className="mt-3 font-heading text-3xl md:text-4xl lg:text-5xl text-foreground">
              Comece grátis. Escale quando crescer.
            </h2>
            <p className="mt-4 text-muted-foreground">
              14 dias gratuitos em qualquer plano. Cancele quando quiser.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              {
                name: "Starter",
                price: "R$ 29",
                period: "/mês",
                desc: "Para times pequenos que querem sair da planilha.",
                items: ["Até 5 usuários", "100 despesas/mês", "1 política ativa", "Suporte por email"],
              },
              {
                name: "Growth",
                price: "R$ 49",
                period: "/usuário/mês",
                desc: "Para empresas que querem automação de verdade.",
                items: ["Usuários ilimitados", "Despesas ilimitadas", "WhatsApp no fluxo", "Dashboard completo", "Suporte prioritário"],
                featured: true,
                badge: "Mais popular",
              },
              {
                name: "Enterprise",
                price: "Sob consulta",
                period: "",
                desc: "Para operações com governança e múltiplas filiais.",
                items: ["Multi-CNPJ", "SSO e integrações", "SLA dedicado", "Onboarding assistido", "API disponível"],
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-[2rem] border p-7 shadow-sm ${
                  plan.featured
                    ? "border-primary bg-accent/40 ring-1 ring-primary/20"
                    : "border-border bg-card"
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                      {plan.badge}
                    </span>
                  </div>
                )}
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
                  size="lg"
                  className={`mt-8 w-full rounded-full h-12 ${
                    plan.featured
                      ? "shadow-lg shadow-primary/20"
                      : "bg-foreground text-background hover:bg-foreground/90"
                  }`}
                >
                  <Link to="/cadastro">
                    {plan.featured ? "Começar grátis →" : "Escolher plano"}
                  </Link>
                </Button>
              </div>
            ))}
          </div>

          {/* Garantia */}
          <div className="mt-10 text-center">
            <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span>Garantia de 30 dias: não gostou? Devolvemos seu dinheiro. Sem perguntas.</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-6 py-14">
        <div className="mx-auto max-w-5xl">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">FAQ</p>
            <h2 className="mt-3 font-heading text-3xl md:text-4xl text-foreground">
              Dúvidas comuns
            </h2>
          </div>

          <div className="mt-10 grid gap-4">
            {FAQS.map((faq) => (
              <div key={faq.q} className="rounded-[1.5rem] border border-border bg-card p-6">
                <h3 className="font-heading text-lg text-foreground">{faq.q}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="px-6 pb-16 pt-4">
        <div className="mx-auto max-w-5xl rounded-[2.5rem] border border-primary/20 bg-gradient-to-br from-primary/5 to-card p-8 text-center md:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Pronto para testar?</p>
          <h2 className="mt-4 font-heading text-3xl md:text-4xl lg:text-5xl text-foreground">
            Pare de perder tempo com planilha de reembolso.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
            14 dias grátis. Setup em 5 minutos. Cancele quando quiser.
          </p>
          
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-14 rounded-full px-8 text-base shadow-lg shadow-primary/20">
              <Link to={ctaHref}>
                Começar grátis agora →
              </Link>
            </Button>
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            Não precisa de cartão de crédito · Suporte humano no WhatsApp
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background/80">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground">
                <Receipt className="h-4 w-4" />
              </div>
              <div>
                <p className="font-heading text-sm text-foreground">Reembolsaaí</p>
                <p className="text-xs text-muted-foreground">Controle de despesas com IA</p>
              </div>
            </div>
            <div className="flex gap-8 text-sm text-muted-foreground">
              <Link to="/login" className="transition-colors hover:text-foreground">Entrar</Link>
              <Link to="/cadastro" className="transition-colors hover:text-foreground">Criar conta</Link>
              <a href="mailto:contato@reembolsaai.com.br" className="transition-colors hover:text-foreground">Contato</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Reembolsaaí. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
