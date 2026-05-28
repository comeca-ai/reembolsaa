import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Clock, Search, Loader2, AlertTriangle, DollarSign, MessageCircle, Globe } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listDespesas, decidirDespesa, STATUS_LABELS } from "@/api/despesas";
import { useAuth } from "@/lib/AuthContext";
import NfSeloBadge from "@/components/NfSeloBadge";

const STATUS_TABS = [
  { key: "pending", label: "Pendentes" },
  { key: "approved", label: "Aprovadas" },
  { key: "rejected", label: "Recusadas" },
];

const tabOf = (status) =>
  status === "pendente" ? "pending" :
  status === "reprovada" ? "rejected" : "approved";

// Origem da despesa (como o colaborador a enviou). O fallback é "web" porque toda
// despesa lançada pelo app vem do formulário; o webhook do WhatsApp grava "whatsapp".
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
    /** @type {(args: { id: string; decisao: string; comentario?: string }) => Promise<any>} */
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

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 md:py-12">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-heading text-foreground text-2xl md:text-3xl">Aprovações</h1>
              <p className="text-muted-foreground text-sm mt-0.5">
                {counts.pending} {counts.pending === 1 ? "solicitação aguardando" : "solicitações aguardando"} sua análise
              </p>
            </div>
          </div>
        </motion.div>

        {/* Tabs + Search */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex gap-1 bg-secondary rounded-lg p-1">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  activeTab === tab.key ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
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
              placeholder="Buscar por colaborador, categoria ou centro de custo..."
              className="w-full bg-card border border-border rounded-lg pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40"
            />
          </div>
        </div>

        {error && <p className="text-destructive text-sm mb-4">{error}</p>}

        {/* Cards */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filtered.length === 0 ? (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 text-muted-foreground">
                  <Clock className="w-8 h-8 mx-auto mb-3 opacity-40" />
                  <p className="text-sm">
                    {activeTab === "pending" ? "Nenhuma despesa pendente." : "Nenhum registro nesta aba."}
                  </p>
                </motion.div>
              ) : (
                filtered.map((d) => {
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
                      className="bg-card border border-border rounded-xl p-4 md:p-5"
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center ${acima ? "bg-destructive/10" : "bg-secondary"}`}>
                          {acima ? <AlertTriangle className="w-4 h-4 text-destructive" /> : <DollarSign className="w-4 h-4 text-muted-foreground" />}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="font-medium text-foreground text-sm">{d.colaborador}</span>
                            <span
                              className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${canal.cls}`}
                              title={`Enviada via ${canal.label}`}
                            >
                              <canal.Icon className="w-3 h-3" /> {canal.label}
                            </span>
                            <span className="text-muted-foreground text-xs">·</span>
                            <span className="text-muted-foreground text-xs">{d.centro_custo}</span>
                            <span className="text-muted-foreground text-xs">·</span>
                            <span className="text-muted-foreground text-xs">{d.categoria}</span>
                            {acima ? (
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border bg-destructive/10 text-destructive border-destructive/20">
                                Acima da política
                              </span>
                            ) : (
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border bg-primary/10 text-primary border-primary/20">
                                Dentro da política
                              </span>
                            )}
                            {activeTab !== "pending" && (
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border">
                                {STATUS_LABELS[d.status]}
                              </span>
                            )}
                            <NfSeloBadge selo={d.nf_selo} />
                          </div>
                          <div className="flex flex-wrap items-center gap-4 mt-2">
                            <span className="font-mono text-sm text-foreground font-semibold">
                              R$ {Number(d.valor_brl).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                            </span>
                            {acima && d.policy_excesso_brl != null && (
                              <span className="text-destructive text-xs">excesso R$ {Number(d.policy_excesso_brl).toLocaleString("pt-BR")}</span>
                            )}
                            {d.data && (
                              <span className="text-muted-foreground text-xs">{format(new Date(d.data), "dd/MM/yyyy", { locale: ptBR })}</span>
                            )}
                          </div>
                          {d.observacao && <p className="text-muted-foreground text-xs mt-2">{d.observacao}</p>}

                          {/* Reject reason */}
                          {isRejecting && (
                            <div className="mt-3 space-y-2">
                              <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Motivo da recusa (obrigatório)"
                                rows={2}
                                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-destructive/50"
                              />
                              <div className="flex gap-2">
                                <button
                                  disabled={mutation.isPending}
                                  onClick={() => mutation.mutate({ id: d.id, decisao: "reprovar", comentario: comment })}
                                  className="bg-destructive text-destructive-foreground text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-destructive/90 disabled:opacity-50"
                                >
                                  Confirmar recusa
                                </button>
                                <button
                                  onClick={() => { setRejectingId(null); setComment(""); setError(""); }}
                                  className="text-xs text-muted-foreground px-3 py-1.5 rounded-lg hover:text-foreground"
                                >
                                  Cancelar
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        {d.status === "pendente" && !isRejecting && (
                          <div className="flex flex-col gap-2 shrink-0">
                            <button
                              disabled={mutation.isPending}
                              onClick={() => mutation.mutate({ id: d.id, decisao: "aprovar" })}
                              className="flex items-center gap-1.5 bg-primary text-primary-foreground text-xs font-medium px-3 py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" /> Aprovar
                            </button>
                            <button
                              onClick={() => { setRejectingId(d.id); setComment(""); setError(""); }}
                              className="flex items-center gap-1.5 border border-border text-xs font-medium px-3 py-2 rounded-lg text-muted-foreground hover:text-destructive hover:border-destructive/40"
                            >
                              <XCircle className="w-3.5 h-3.5" /> Recusar
                            </button>
                          </div>
                        )}
                        {d.status === "aprovada-n1" && (
                          <button
                            disabled={mutation.isPending}
                            onClick={() => mutation.mutate({ id: d.id, decisao: "pagar" })}
                            className="shrink-0 flex items-center gap-1.5 bg-primary text-primary-foreground text-xs font-medium px-3 py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50"
                          >
                            Marcar como paga
                          </button>
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
