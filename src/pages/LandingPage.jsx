import React, { useState } from "react";
import { ArrowRight, Check, Shield, Zap, Clock, BarChart3, Users, ChevronDown, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function LandingPage() {
  const [email, setEmail] = useState("");

  const handleGetStarted = () => {
    window.location.href = "/comecar";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="font-heading text-xl font-bold text-primary">Reembolsaaí</div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={handleGetStarted} className="text-sm">
              Login
            </Button>
            <Button onClick={handleGetStarted} className="text-sm">
              Começar Grátis
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">Reembolsos em minutos, não em semanas</span>
            </div>

            <h1 className="font-heading text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Reembolsos Inteligentes para Empresas Modernas
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Automatize a aprovação de despesas com IA, elimine retrabalho e recupere tempo do seu time. 
              <span className="block text-primary font-semibold mt-2">Política em PDF → Despesas aprovadas em minutos.</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
              <Button 
                size="lg" 
                onClick={handleGetStarted}
                className="font-semibold text-base gap-2 h-12"
              >
                Comece Grátis <ArrowRight className="w-4 h-4" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="font-semibold text-base gap-2 h-12"
              >
                Assista Demo (2 min)
              </Button>
            </div>

            {/* Social Proof */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 rounded-full bg-primary/30"></div>
                  <div className="w-6 h-6 rounded-full bg-primary/50"></div>
                  <div className="w-6 h-6 rounded-full bg-primary/70"></div>
                </div>
                <span>100+ empresas confiam</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-border"></div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
                <span>4.9/5 no Google</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 md:py-24 px-4 md:px-8 bg-secondary/30">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              Você gasta quanto tempo com reembolsos?
            </h2>
            <p className="text-muted-foreground text-lg">
              A maioria das empresas perde 10+ horas por semana em aprovação manual
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { label: "Sem Reembolsaaí", time: "7 dias", icon: "❌" },
              { label: "Manual + Planilhas", time: "3 dias", icon: "📊" },
              { label: "Com Reembolsaaí", time: "15 minutos", icon: "⚡" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-card border border-border rounded-xl p-6 text-center"
              >
                <div className="text-3xl mb-3">{item.icon}</div>
                <p className="text-muted-foreground text-sm mb-2">{item.label}</p>
                <p className="font-heading text-2xl font-bold text-primary">{item.time}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Benefits */}
      <section className="py-16 md:py-24 px-4 md:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="font-heading text-3xl md:text-4xl font-bold text-foreground text-center mb-16"
          >
            O que você ganha?
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: <Zap className="w-6 h-6 text-primary" />,
                title: "Aprove em Segundos",
                desc: "Política em PDF → IA extrai regras → Despesas são validadas automaticamente",
              },
              {
                icon: <Shield className="w-6 h-6 text-primary" />,
                title: "Zero Não-Conformidades",
                desc: "Cada reembolso é checado contra sua política. Nenhuma despesa sai errada.",
              },
              {
                icon: <Clock className="w-6 h-6 text-primary" />,
                title: "Libera 20h/mês do RH",
                desc: "Seu time financeiro volta a fazer trabalho estratégico, não paperwork.",
              },
              {
                icon: <BarChart3 className="w-6 h-6 text-primary" />,
                title: "Visibilidade Total",
                desc: "Relatórios em tempo real. Saiba exatamente onde o dinheiro está indo.",
              },
            ].map((benefit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="flex gap-4"
              >
                <div className="mt-1">{benefit.icon}</div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground text-sm">{benefit.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 px-4 md:px-8 bg-secondary/30">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="font-heading text-3xl md:text-4xl font-bold text-foreground text-center mb-16"
          >
            Como Funciona
          </motion.h2>

          <div className="space-y-6">
            {[
              { step: "1", title: "Upload da Política", desc: "Suba seu PDF de reembolsos (20 segundos)" },
              { step: "2", title: "IA Extrai Regras", desc: "Nosso modelo identifica categorias, limites e condições" },
              { step: "3", title: "Colaborador Submete", desc: "Foto da nota → Dados extraídos automaticamente" },
              { step: "4", title: "Aprova em 15s", desc: "IA valida contra política. Aprovado ou solicitação de ajuste." },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="flex gap-6 items-start"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center font-heading font-bold text-primary">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof / Stats */}
      <section className="py-16 md:py-24 px-4 md:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: "98%", label: "Precisão da IA" },
              { number: "85%", label: "Redução de Tempo" },
              { number: "40%", label: "Corte de Custos" },
              { number: "1min", label: "Tempo Médio" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.number}</div>
                <p className="text-muted-foreground text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 md:py-24 px-4 md:px-8 bg-secondary/30">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              Quanto Custa?
            </h2>
            <p className="text-muted-foreground text-lg">
              Simples. Por colaborador. Sem contratos, cancele quando quiser.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            {[
              {
                name: "Startup",
                price: "R$ 99",
                period: "/mês",
                users: "até 10 usuários",
                features: ["IA de análise", "Relatórios básicos", "Email support"],
              },
              {
                name: "Enterprise",
                price: "Personalizado",
                period: "/mês",
                users: "ilimitado",
                features: ["Tudo do Startup", "IA avançada + integração", "Prioridade 24/7"],
                highlight: true,
              },
            ].map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
                className={`rounded-xl p-8 border transition-all ${
                  plan.highlight
                    ? "bg-primary/10 border-primary/50 ring-2 ring-primary/20"
                    : "bg-card border-border"
                }`}
              >
                <h3 className="font-heading text-xl font-bold text-foreground mb-2">{plan.name}</h3>
                <p className="text-muted-foreground text-sm mb-4">{plan.users}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground text-sm">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={handleGetStarted}
                  className="w-full"
                  variant={plan.highlight ? "default" : "outline"}
                >
                  Começar Agora
                </Button>
              </motion.div>
            ))}
          </div>

          <p className="text-center text-muted-foreground text-sm mt-8">
            14 dias grátis, sem cartão de crédito. Cancelar a qualquer momento.
          </p>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 md:py-24 px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-12"
        >
          <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
            Já são 6 da tarde e ainda tem reembolso pendente?
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Comece hoje. 14 dias grátis, sem compromisso.
          </p>
          <Button onClick={handleGetStarted} size="lg" className="font-semibold text-base gap-2">
            Começar Grátis <ArrowRight className="w-4 h-4" />
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4 md:px-8 bg-secondary/20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>&copy; 2026 Reembolsaaí. Todos os direitos reservados.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground transition">Privacidade</a>
            <a href="#" className="hover:text-foreground transition">Termos</a>
            <a href="#" className="hover:text-foreground transition">Contato</a>
          </div>
        </div>
      </footer>
    </div>
  );
}