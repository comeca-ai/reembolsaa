import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CheckCircle2, ArrowRight, Sparkles, Shield, Zap, FileText,
  MessageCircle, BarChart3, GitBranch, Clock, TrendingUp,
  ChevronDown, Star, Building2, Users, DollarSign, AlertTriangle
} from "lucide-react";

// ─── DATA ──────────────────────────────────────────────────────────────────────

const DIFERENCIAIS = [
  {
    icon: MessageCircle,
    badge: "🇧🇷 Inédito no Brasil",
    highlight: true,
    title: "WhatsApp Zero-Login",
    desc: "Funcionário envia foto do comprovante pelo WhatsApp. Sem app, sem cadastro, sem fricção. A IA cuida do resto.",
  },
  {
    icon: FileText,
    badge: "🇧🇷 Inédito no Brasil",
    highlight: true,
    title: "Validação NF-e via SEFAZ",
    desc: "Chave da nota fiscal verificada em tempo real na base da Receita Federal. Zero fraude de comprovante.",
  },
  {
    icon: Sparkles,
    badge: "🇧🇷 Inédito no Brasil",
    highlight: true,
    title: "Agente IA de Compliance",
    desc: "IA lê sua política em PDF e gera regras estruturadas automaticamente. Aplica em cada despesa, em tempo real.",
  },
  {
    icon: GitBranch,
    badge: "Diferencial",
    highlight: false,
    title: "Política como Código",
    desc: "Regras versionadas, auditáveis e editáveis. Toda mudança de política é rastreada — quem alterou, quando e por quê.",
  },
  {
    icon: Clock,
    badge: "Diferencial",
    highlight: false,
    title: "Aprovação em segundos",
    desc: "Despesas dentro da política são aprovadas automaticamente. Gestor só vê o que realmente precisa de atenção.",
  },
  {
    icon: BarChart3,
    badge: "Diferencial",
    highlight: false,
    title: "Dashboard de compliance em tempo real",
    desc: "Score de conformidade, violações por categoria, evolução histórica. Visão completa para o CFO.",
  },
  {
    icon: Building2,
    badge: "Enterprise",
    highlight: false,
    title: "Multi-tenant com RLS",
    desc: "Isolamento total entre empresas. Dados de um cliente jamais visíveis para outro — arquitetura Supabase Row-Level Security.",
  },
  {
    icon: TrendingUp,
    badge: "Diferencial",
    highlight: false,
    title: "Relatórios prontos para auditoria",
    desc: "Exportação com trilha completa: quem submeteu, qual regra foi aplicada, quem aprovou. Pronto para auditores.",
  },
];

const STEPS = [
  { n: "01", title: "Suba sua política", desc: "PDF da política de reembolso da empresa. A IA lê e converte em regras estruturadas automaticamente." },
  { n: "02", title: "Funcionário envia comprovante", desc: "Pelo WhatsApp ou app web. Foto da nota, cupom ou boleto — sem formulário manual." },
  { n: "03", title: "IA verifica em tempo real", desc: "Valor, categoria, fornecedor e nota fiscal validada na SEFAZ. Veredito automático em segundos." },
  { n: "04", title: "Gestor só aprova exceções", desc: "O que está dentro da política é aprovado automaticamente. Foco só no que importa." },
];

const PLANS = [
  {
    name: "Starter",
    price: "R$ 29",
    period: "/mês",
    desc: "Para equipes pequenas começarem com compliance.",
    features: ["Até 5 usuários", "100 despesas/mês", "Política ativa", "Dashboard básico", "Suporte por e-mail"],
    cta: "Começar grátis",
    highlight: false,
  },
  {
    name: "Growth",
    price: "R$ 49",
    period: "/mês por usuário",
    desc: "Para empresas que levam compliance a sério.",
    features: ["Usuários ilimitados", "Despesas ilimitadas", "WhatsApp Zero-Login", "Validação NF-e SEFAZ", "Agente IA de Compliance", "Dashboard completo", "Relatórios de auditoria"],
    cta: "Começar grátis",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Sob consulta",
    period: "",
    desc: "Para grandes corporações com necessidades específicas.",
    features: ["Tudo do Growth", "SSO / SAML", "SLA dedicado", "Multi-CNPJ", "Integrações ERP", "Onboarding guiado"],
    cta: "Falar com vendas",
    highlight: false,
  },
];

const FAQS = [
  { q: "Preciso instalar alguma coisa?", a: "Não. O Reembolsaaí é 100% web. Funcionários usam WhatsApp (que já têm no celular) ou acessam pelo navegador." },
  { q: "Como funciona a validação de NF-e?", a: "O sistema extrai a chave de acesso da nota fiscal e consulta em tempo real a API da SEFAZ. Se a nota não existir ou estiver cancelada, a despesa é sinalizada automaticamente." },
  { q: "O que acontece com políticas complexas?", a: "Nossa IA lê o PDF e gera as regras estruturadas. Você revisa, edita e ativa. Tudo versionado — você pode voltar a qualquer versão anterior." },
  { q: "Tem contrato de fidelidade?", a: "Não. Planos mensais sem fidelidade. Cancele quando quiser." },
  { q: "Como é feito o isolamento entre empresas?", a: "Usamos Row-Level Security no banco de dados. Os dados de cada empresa são isolados no nível do banco — não é só filtro de aplicação." },
];

// ─── COMPONENT ─────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-body overflow-x-hidden">
      <Navbar />
      <Hero />
      <SocialProof />
      <Problem />
      <HowItWorks />
      <Diferenciais />
      <Pricing />
      <FaqSection />
      <FinalCta />
      <Footer />
    </div>
  );
}

// ─── NAVBAR ────────────────────────────────────────────────────────────────────

function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-heading text-xs font-bold">R$</span>
          </div>
          <span className="font-heading text-foreground text-sm">Reembolsaaí</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          <a href="#como-funciona" className="hover:text-foreground transition-colors">Como funciona</a>
          <a href="#diferenciais" className="hover:text-foreground transition-colors">Diferenciais</a>
          <a href="#precos" className="hover:text-foreground transition-colors">Preços</a>
        </nav>
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden md:block">
            Entrar
          </Link>
          <Link to="/dashboard" className="bg-primary text-primary-foreground text-sm font-medium px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
            Começar grátis
          </Link>
        </div>
      </div>
    </header>
  );
}

// ─── HERO ──────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="text-primary text-xs font-medium">IA que lê sua política e a aplica automaticamente</span>
          </div>
          <h1 className="font-heading text-4xl md:text-6xl text-foreground leading-tight">
            Reembolsos corporativos<br />
            <span className="text-primary">sem dor de cabeça</span>
          </h1>
          <p className="mt-6 text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Funcionário tira foto do comprovante no WhatsApp. A IA verifica, valida na SEFAZ e aplica a política em segundos. Gestor só aprova exceções.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link to="/dashboard" className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-medium px-6 py-3 rounded-xl hover:bg-primary/90 transition-all hover:scale-105 text-base">
            Começar grátis
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a href="#como-funciona" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm transition-colors">
            Ver como funciona
            <ChevronDown className="w-4 h-4" />
          </a>
        </motion.div>

        {/* Mock verdict card */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="max-w-md mx-auto"
        >
          <div className="bg-card border border-border rounded-2xl p-5 text-left space-y-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Agente IA · Reembolsaaí</p>
                <p className="text-sm font-medium text-foreground">Veredito de compliance</p>
              </div>
              <div className="ml-auto flex items-center gap-1.5 bg-primary/10 px-2.5 py-1 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                <span className="text-primary text-xs font-semibold">Aprovada</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Fornecedor", value: "Restaurante Central" },
                { label: "Valor", value: "R$ 74,50", mono: true },
                { label: "Categoria", value: "Alimentação" },
                { label: "NF-e SEFAZ", value: "✓ Validada" },
              ].map(({ label, value, mono }) => (
                <div key={label} className="bg-secondary/50 rounded-lg px-3 py-2">
                  <p className="text-[10px] text-muted-foreground">{label}</p>
                  <p className={`text-sm text-foreground font-medium ${mono ? "font-mono" : ""}`}>{value}</p>
                </div>
              ))}
            </div>
            <div className="bg-primary/8 border border-primary/20 rounded-lg px-3 py-2.5">
              <p className="text-xs text-primary">
                ✓ Dentro do limite de R$ 80/refeição · Nota fiscal válida · Aprovado automaticamente
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── SOCIAL PROOF ──────────────────────────────────────────────────────────────

function SocialProof() {
  return (
    <section className="py-12 border-y border-border bg-card/40">
      <div className="max-w-5xl mx-auto px-6">
        <p className="text-center text-xs text-muted-foreground uppercase tracking-widest mb-8">
          Por que o mercado precisa disso agora
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: "99%", label: "das empresas BR gerenciam reembolsos em planilha" },
            { value: "0",   label: "soluções com WhatsApp zero-login no mercado" },
            { value: "3×",  label: "mais rápido que fluxos de aprovação manuais" },
            { value: "R$0", label: "fraude com validação NF-e em tempo real" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center space-y-1">
              <p className="font-heading text-3xl md:text-4xl text-primary">{value}</p>
              <p className="text-muted-foreground text-xs leading-relaxed">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── PROBLEM ───────────────────────────────────────────────────────────────────

function Problem() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-primary text-sm font-medium mb-3">O problema</p>
          <h2 className="font-heading text-3xl md:text-4xl text-foreground">
            Gestão de reembolsos hoje é um pesadelo
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: AlertTriangle, title: "Fraudes passam despercebidas", desc: "Notas duplicadas, comprovantes falsos e despesas acima do limite são aprovados manualmente por gestores sobrecarregados." },
            { icon: Clock, title: "Processo lento e burocrático", desc: "Semanas entre o lançamento e o reembolso. Funcionário insatisfeito. Financeiro sem visibilidade em tempo real." },
            { icon: FileText, title: "Política que ninguém lê", desc: "PDF de 40 páginas no Google Drive. Ninguém sabe os limites. Cada gestor aprova de um jeito." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-card border border-border rounded-xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                <Icon className="w-5 h-5 text-destructive" />
              </div>
              <h3 className="font-medium text-foreground">{title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── HOW IT WORKS ──────────────────────────────────────────────────────────────

function HowItWorks() {
  return (
    <section id="como-funciona" className="py-20 px-6 bg-card/30">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-primary text-sm font-medium mb-3">Como funciona</p>
          <h2 className="font-heading text-3xl md:text-4xl text-foreground">
            De comprovante a reembolso em segundos
          </h2>
        </div>
        <div className="space-y-4">
          {STEPS.map(({ n, title, desc }, i) => (
            <motion.div
              key={n}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-5 bg-card border border-border rounded-xl p-6"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <span className="font-mono text-primary text-sm font-bold">{n}</span>
              </div>
              <div>
                <h3 className="font-medium text-foreground mb-1">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── DIFERENCIAIS ──────────────────────────────────────────────────────────────

function Diferenciais() {
  return (
    <section id="diferenciais" className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-primary text-sm font-medium mb-3">Diferenciais</p>
          <h2 className="font-heading text-3xl md:text-4xl text-foreground">
            O que nenhuma outra solução tem
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
            Três funcionalidades inéditas no Brasil. Cinco diferenciais que colocam o Reembolsaaí em outra categoria.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {DIFERENCIAIS.map(({ icon: Icon, badge, highlight, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className={`rounded-xl p-6 space-y-4 border transition-all hover:-translate-y-0.5 ${
                highlight
                  ? "bg-primary/5 border-primary/30 hover:border-primary/50"
                  : "bg-card border-border hover:border-border/80"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  highlight ? "bg-primary/15" : "bg-secondary"
                }`}>
                  <Icon className={`w-5 h-5 ${highlight ? "text-primary" : "text-muted-foreground"}`} />
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                  highlight
                    ? "text-primary border-primary/30 bg-primary/10"
                    : "text-muted-foreground border-border bg-secondary"
                }`}>
                  {badge}
                </span>
              </div>
              <div>
                <h3 className="font-medium text-foreground mb-1.5">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── PRICING ───────────────────────────────────────────────────────────────────

function Pricing() {
  return (
    <section id="precos" className="py-20 px-6 bg-card/30">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-primary text-sm font-medium mb-3">Preços</p>
          <h2 className="font-heading text-3xl md:text-4xl text-foreground">
            Simples, sem surpresas
          </h2>
          <p className="text-muted-foreground mt-3">14 dias grátis. Sem cartão de crédito.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {PLANS.map(({ name, price, period, desc, features, cta, highlight }) => (
            <div
              key={name}
              className={`rounded-2xl p-7 space-y-6 border relative ${
                highlight
                  ? "bg-primary/5 border-primary/30"
                  : "bg-card border-border"
              }`}
            >
              {highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                    Mais popular
                  </span>
                </div>
              )}
              <div>
                <p className="text-muted-foreground text-sm mb-2">{name}</p>
                <div className="flex items-end gap-1">
                  <span className="font-heading text-3xl text-foreground">{price}</span>
                  {period && <span className="text-muted-foreground text-sm mb-1">{period}</span>}
                </div>
                <p className="text-muted-foreground text-xs mt-2">{desc}</p>
              </div>
              <ul className="space-y-2.5">
                {features.map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span className="text-foreground">{f}</span>
                  </li>
                ))}
              </ul>
              <Link to="/dashboard" className={`block text-center py-2.5 rounded-xl text-sm font-medium transition-all hover:scale-105 ${
                highlight
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "border border-border text-foreground hover:bg-secondary"
              }`}>
                {cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FAQ ───────────────────────────────────────────────────────────────────────

function FaqSection() {
  const [open, setOpen] = useState(null);
  return (
    <section className="py-20 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-primary text-sm font-medium mb-3">FAQ</p>
          <h2 className="font-heading text-3xl text-foreground">Perguntas frequentes</h2>
        </div>
        <div className="space-y-3">
          {FAQS.map(({ q, a }, i) => (
            <div key={i} className="bg-card border border-border rounded-xl overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span className="text-foreground text-sm font-medium">{q}</span>
                <ChevronDown className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`} />
              </button>
              {open === i && (
                <div className="px-5 pb-4">
                  <p className="text-muted-foreground text-sm leading-relaxed">{a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FINAL CTA ─────────────────────────────────────────────────────────────────

function FinalCta() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
          <Sparkles className="w-8 h-8 text-primary" />
        </div>
        <h2 className="font-heading text-3xl md:text-5xl text-foreground leading-tight">
          Pronto para <span className="text-primary">compliance automático</span>?
        </h2>
        <p className="text-muted-foreground text-lg">
          14 dias grátis. Sem cartão. Sem burocracia.
        </p>
        <Link to="/dashboard" className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-medium px-8 py-4 rounded-xl hover:bg-primary/90 transition-all hover:scale-105 text-base">
          Começar grátis agora
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </section>
  );
}

// ─── FOOTER ────────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="border-t border-border py-10 px-6">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-heading text-[10px] font-bold">R$</span>
          </div>
          <span className="font-heading text-foreground text-sm">Reembolsaaí</span>
        </div>
        <p className="text-muted-foreground text-xs">
          © 2026 Reembolsaaí. Todos os direitos reservados.
        </p>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <a href="#" className="hover:text-foreground transition-colors">Privacidade</a>
          <a href="#" className="hover:text-foreground transition-colors">Termos</a>
          <a href="#" className="hover:text-foreground transition-colors">Contato</a>
        </div>
      </div>
    </footer>
  );
}