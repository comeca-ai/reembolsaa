import React, { useState, useRef, useEffect } from "react";
import { Upload, Loader2, Wand2, FileText, Inbox } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/lib/AuthContext";
import { listPoliticas } from "@/api/despesas";
import { extrairPolitica, salvarPoliticas } from "@/api/politica";
import ExtractedRulesModal from "@/components/policy/ExtractedRulesModal";

const CAT_EMOJI = {
  "Alimentação": "🍽️", "Transporte": "🚗", "Hospedagem": "🏨", "KM": "🛣️", "Outros": "📦",
};
const brl = (v) => (v == null ? "—" : `R$ ${Number(v).toLocaleString("pt-BR")}`);

// Conteúdo da política como aba de Configurações (sem layout de página próprio).
// Toda a funcionalidade (upload + extração por IA + modal de revisão) preservada,
// inclusive a abertura do modal a partir do state do onboarding (location.state).
export default function PolicyTab() {
  const { empresa, refreshProfile } = useAuth();
  const queryClient = useQueryClient();
  const location = useLocation();
  const navigate = useNavigate();
  const fileRef = useRef();

  const { data: politicas = [], isLoading } = useQuery({ queryKey: ["politicas"], queryFn: listPoliticas });

  const [modalOpen, setModalOpen] = useState(false);
  const [modalRules, setModalRules] = useState([]);
  const [resumo, setResumo] = useState("");
  const [policyTexto, setPolicyTexto] = useState("");
  const [validacao, setValidacao] = useState(null);
  const [extracting, setExtracting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Veio do onboarding com regras já extraídas? Abre o modal pra revisar/salvar.
  useEffect(() => {
    const st = location.state;
    if (st?.pendingRules?.length) {
      setModalRules(st.pendingRules);
      setResumo(st.resumo || "");
      setPolicyTexto(st.politicaTexto || "");
      setValidacao(st.validacao || null);
      setModalOpen(true);
      navigate(location.pathname, { replace: true, state: {} }); // limpa o state
    }
  }, [location.state]);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (fileRef.current) fileRef.current.value = "";
    if (!file) return;
    setError("");
    setExtracting(true);
    try {
      const safeName = file.name.replace(/[^\w.\-]+/g, "_");
      const path = `${empresa.id}/${Date.now()}-${safeName}`;
      await supabase.storage.from("politicas").upload(path, file, { upsert: false });
      await supabase.from("empresa").update({ politica_documento: path }).eq("id", empresa.id);

      const { rules, resumo: r, politica_texto, validacao: val } = await extrairPolitica(file, empresa);
      setValidacao(val || null);
      if (!rules.length) {
        setError(val?.avisos?.[0] || "Não consegui extrair regras automaticamente deste PDF. Confira se é a política de reembolso da sua empresa.");
        return;
      }
      setModalRules(rules);
      setResumo(r);
      setPolicyTexto(politica_texto || "");
      setModalOpen(true);
    } catch (err) {
      setError(err?.message || "Falha ao ler a política.");
    } finally {
      setExtracting(false);
    }
  };

  const updateModalRule = (idx, field, value) => {
    const isText = field === "restricoes" || field === "observacao";
    setModalRules((prev) => prev.map((r, i) => (i === idx ? { ...r, [field]: isText ? value : (value === "" ? null : Number(value)) } : r)));
  };

  const handleSaveRules = async () => {
    setSaving(true);
    setError("");
    try {
      await salvarPoliticas(empresa.id, modalRules, policyTexto);
      await queryClient.invalidateQueries({ queryKey: ["politicas"] });
      await refreshProfile(); // atualiza empresa.politica_texto no contexto
      setModalOpen(false);
    } catch (err) {
      setError(err?.message || "Erro ao salvar as regras.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho da seção + ação de subir política */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="font-heading text-foreground text-lg">Política de reembolso</h2>
          <p className="text-muted-foreground text-sm mt-0.5">Limites por categoria que regem a aprovação das despesas.</p>
        </div>
        <input ref={fileRef} type="file" accept=".pdf" className="hidden" onChange={handleFile} />
        <button
          onClick={() => fileRef.current?.click()}
          disabled={extracting}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-60"
        >
          {extracting ? <><Loader2 className="w-4 h-4 animate-spin" /> Lendo política…</> : <><Upload className="w-4 h-4" /> Subir política (PDF)</>}
        </button>
      </div>

      {error && <p className="text-destructive text-sm">{error}</p>}

      {/* Rules */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground"><Loader2 className="w-6 h-6 animate-spin" /></div>
      ) : politicas.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border rounded-2xl">
          <Inbox className="w-10 h-10 mx-auto mb-4 text-muted-foreground/50" />
          <h3 className="font-heading text-foreground text-lg mb-1">Nenhuma regra ainda</h3>
          <p className="text-muted-foreground text-sm mb-5">Suba o PDF da política — a IA extrai os limites por categoria automaticamente.</p>
          <button onClick={() => fileRef.current?.click()} className="inline-flex items-center gap-2 text-primary text-sm font-medium hover:underline">
            <Wand2 className="w-4 h-4" /> Ler política com IA
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {politicas.slice().sort((a, b) => a.categoria.localeCompare(b.categoria)).map((p) => (
            <div key={p.categoria} className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">{CAT_EMOJI[p.categoria] || "📋"}</span>
                <h3 className="font-heading text-foreground text-base">{p.categoria}</h3>
              </div>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Limite diário</span><span className="font-mono text-foreground">{brl(p.diario_brl)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Por noite</span><span className="font-mono text-foreground">{brl(p.por_noite_brl)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Teto mensal</span><span className="font-mono text-foreground">{brl(p.teto_mes_brl)}</span></div>
              </div>
              {p.documento && <p className="text-[11px] text-muted-foreground mt-3 pt-3 border-t border-border leading-relaxed">{p.documento}</p>}
              {p.restricoes && (
                <p className="text-[11px] text-warning mt-2 leading-relaxed">
                  <span className="font-semibold">Restrições:</span> {p.restricoes}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {empresa?.politica_documento && (
        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5" /> Documento da política armazenado de forma isolada por empresa.
        </p>
      )}

      <ExtractedRulesModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        rules={modalRules}
        resumo={resumo}
        validacao={validacao}
        onChange={updateModalRule}
        onSave={handleSaveRules}
        saving={saving}
        error={error}
      />
    </div>
  );
}
