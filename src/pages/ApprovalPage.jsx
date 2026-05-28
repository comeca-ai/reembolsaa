import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Clock, Search, Loader2, AlertTriangle, DollarSign, MessageCircle, Globe, Filter, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { listDespesas, decidirDespesa, STATUS_LABELS } from "@/api/despesas";
import { useAuth } from "@/lib/AuthContext";
import NfSeloBadge from "@/components/NfSeloBadge";

const STATUS_TABS = [
  { key: "pending", label: "Pendentes", icon: Clock },
  { key: "approved", label: "Aprovadas", icon: CheckCircle2 },
  { key: "rejected", label: "Recusadas", icon: XCircle },
];

const tabOf = (status) =>
  status === "pendente" ? "pending" :
  status === "reprovada" ? "rejected" : "approved";

const CHANNEL_META = {
  whatsapp: { label: "WhatsApp", Icon: MessageCircle, cls: "bg-[#25D366]/10 text-[#25D366] border-[#25D366]/25" },
  web:      { label: "Web",      Icon: Globe,         cls: "bg-secondary text-muted-foreground border-border" },
};
const channelMeta = (canal) => CHANNEL_META[canal] ?? CHANNEL_META.web;

export default function ApprovalPage() {
  const { empresa, profile } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("pending");
  const [search, setSearch] = useState("");
  const [rejectingId, setRejectingId] = useState(null);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  const { data: despesas = [], isLoading } = useQuery({
    queryKey: ["despesas"],
    queryFn: listDespesas,
  });

  const mutation = useMutation({
    mutationFn: ({ id, decisao, comentario }) =>
      decidirDespesa({
        empresaId: empresa?.id,
        id,
        decisao,
        comentario,
        ator: profile?.nome || profile?.email,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["despesas"] });
      setRejectingId(null);
      setComment("");
      setError("");
    },
    onError: (e) => setError(e?.message || "Erro ao registrar decisão"),
  });

  const counts = {
    pending: despesas.filter((d) => d.status === "pendente").length,
    approved: despesas.filter((d) => ["aprovada-n1", "paga"].includes(d.status)).length,
    rejected: despesas.filter((d) => d.status === "reprovada").length,
  };

  const filtered = despesas.filter((d) => {
    if (tabOf(d.status) !== activeTab) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (d.colaborador || "").toLowerCase().includes(q) ||
      (d.categoria || "").toLowerCase().includes(q) ||
      (d.centro_custo || "").toLowerCase().includes(q)
    );
  });

  // Calcular métricas rápidas
  const valorTotalPendente = despesas
    .filter((d) => d.status === "pendente")
    .reduce((sum, d) => sum + Number(d.valor_brl || 0), 0);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-6 md:py-10">

        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -8 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="mb-6"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="font-heading text-foreground text-xl md:text-2xl">Aprovações</h1>
                <p className="text-muted-foreground text-sm">
                  {counts.pending > 0 ? (
                    <span className="text-warning font-medium">{counts.pending} aguardando análise</span>
                  ) : (
                    "Tudo em ordem ✓"
                  )}
                </p>
              </div>
            </div>
            
            {/* Card de resumo */}
            {counts.pending > 0 && (
              <div className="flex items-center gap-3 bg-warning/10 border border-warning/20 rounded-xl px-4 py-2">
                <div className="w-8 h-8 rounded-full bg-warning/20 flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-warning" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total pendente</p>
                  <p className="font-mono font-semibold text-foreground">
                    R$ {valorTotalPendente.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Tabs + Search */}
        <motion.div 
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row gap-3 mb-6"
        >
          <div className="flex gap-1 bg-secondary rounded-xl p-1">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.key 
                    ? "bg-card text-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                <span className={`text-[11px] px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.key ? "bg-primary/15 text-primary" : "bg-border text-muted-foreground"
                }`}>
                  {counts[tab.key]}
                </span>
              </button>
            ))}
          </div>
          
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar colaborador, categoria..."
              className="w-full bg-card border border-border rounded-xl pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </motion.div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-3 text-sm text-destructive mb-4">
            {error}
          </div>
        )}

        {/* Lista */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filtered.length === 0 ? (
                <motion.div 
                  key="empty" 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="text-center py-16 text-muted-foreground"
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-secondary flex items-center justify-center">
                    <Filter className="w-8 h-8 opacity-40" />
                  </div>
                  <p className="text-foreground font-medium">
                    {activeTab === "pending" ? "Nenhuma despesa pendente" : "Nenhum registro nesta aba"}
                  </p>
                  <p className="text-sm mt-1">
                    {activeTab === "pending" ? "Tudo aprovado! 🎉" : "Tente mudar o filtro"}
                  </p>
                </motion.div>
              ) : (
                filtered.map((d, index) => {
                  const acima = d.policy_kind === "acima";
                  const canal = channelMeta(d.canal);
                  const isRejecting = rejectingId === d.id;
                  
                  return (
                    <motion.div
                      key={d.id}
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-card border border-border rounded-xl p-4 md:p-5 hover:border-primary/20 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        {/* Ícone de status */}
                        <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center ${
                          acima ? "bg-destructive/10" : "bg-primary/10"
                        }`}>
                          {acima ? (
                            <AlertTriangle className="w-5 h-5 text-destructive" />
                          ) : (
                            <DollarSign className="w-5 h-5 text-primary" />
                          )}
                        </div>

                        {/* Conteúdo */}
                        <div className="flex-1 min-w-0">
                          {/* Linha 1: Colaborador + badges */}
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="font-medium text-foreground">{d.colaborador}</span>
                            <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full border ${canal.cls}`}>
                              <canal.Icon className="w-3 h-3" />
                              {canal.label}
                            </span>
                            {acima ? (
                              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full border bg-destructive/10 text-destructive border-destructive/20">
                                Acima da política
                              </span>
                            ) : (
                              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full border bg-primary/10 text-primary border-primary/20">
                                Dentro da política
                              </span>
                            )}
                            {activeTab !== "pending" && (
                              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border">
                                {STATUS_LABELS[d.status]}
                              </span>
                            )}
                            <NfSeloBadge selo={d.nf_selo} />
                          </div>

                          {/* Linha 2: Detalhes */}
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                            <span className="font-mono font-semibold text-foreground">
                              R$ {Number(d.valor_brl).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                            </span>
                            {acima && d.policy_excesso_brl != null && (
                              <span className="text-destructive text-xs">
                                Excesso: R$ {Number(d.policy_excesso_brl).toLocaleString("pt-BR")}
                              </span>
                            )}
                            <span className="text-muted-foreground text-xs">
                              {d.categoria} · {d.centro_custo}
                            </span>
                            {d.data && (
                              <span className="text-muted-foreground text-xs">
                                {format(new Date(d.data), "dd/MM/yyyy", { locale: ptBR })}
                              </span>
                            )}
                          </div>

                          {/* Observação */}
                          {d.observacao && (
                            <p className="text-muted-foreground text-xs mt-2 line-clamp-2">
                              "{d.observacao}"
                            </p>
                          )}

                          {/* Motivo de recusa */}
                          {isRejecting && (
                            <motion.div 
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              className="mt-3 space-y-2"
                            >
                              <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Motivo da recusa (obrigatório)"
                                rows={2}
                                className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-destructive/20 focus:border-destructive resize-none"
                              />
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  disabled={mutation.isPending || !comment.trim()}
                                  onClick={() => mutation.mutate({ id: d.id, decisao: "reprovar", comentario: comment })}
                                >
                                  Confirmar recusa
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => { setRejectingId(null); setComment(""); setError(""); }}
                                >
                                  Cancelar
                                </Button>
                              </div>
                            </motion.div>
                          )}
                        </div>

                        {/* Ações */}
                        {d.status === "pendente" && !isRejecting && (
                          <div className="flex flex-col gap-2 shrink-0">
                            <Button
                              size="sm"
                              disabled={mutation.isPending}
                              onClick={() => mutation.mutate({ id: d.id, decisao: "aprovar" })}
                              className="h-9 px-3"
                            >
                              <CheckCircle2 className="w-4 h-4 mr-1.5" />
                              Aprovar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => { setRejectingId(d.id); setComment(""); setError(""); }}
                              className="h-9 px-3 border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
                            >
                              <XCircle className="w-4 h-4 mr-1.5" />
                              Recusar
                            </Button>
                          </div>
                        )}
                        
                        {d.status === "aprovada-n1" && (
                          <Button
                            size="sm"
                            disabled={mutation.isPending}
                            onClick={() => mutation.mutate({ id: d.id, decisao: "pagar" })}
                          >
                            <TrendingUp className="w-4 h-4 mr-1.5" />
                            Marcar paga
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
