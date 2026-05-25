import React, { useEffect, useState } from "react";
import { Building2, Save, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/AuthContext";
import { atualizarEmpresa } from "@/api/empresa";

// Mapa form (UI) -> coluna (banco).
const empresaToForm = (e) => ({
  name: e?.nome || "",
  cnpj: e?.cnpj || "",
  email: e?.email_financeiro || "",
  currency: e?.moeda || "BRL",
});

export default function CompanySettings() {
  const { empresa, isAdmin, refreshProfile } = useAuth();
  const [form, setForm] = useState(() => empresaToForm(empresa));
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Sincroniza o form quando a empresa carrega/muda no contexto.
  useEffect(() => {
    if (empresa) setForm(empresaToForm(empresa));
  }, [empresa?.id, empresa?.nome, empresa?.cnpj, empresa?.email_financeiro, empresa?.moeda]);

  const handleSave = async () => {
    setError("");
    if (!form.name.trim()) return setError("A razão social é obrigatória.");
    setSaving(true);
    try {
      await atualizarEmpresa(empresa.id, {
        nome: form.name.trim(),
        cnpj: form.cnpj.trim(),
        email_financeiro: form.email.trim(),
        moeda: form.currency,
      });
      await refreshProfile(); // atualiza nome na sidebar e no resto do app
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err?.message || "Não foi possível salvar os dados da empresa.");
    } finally {
      setSaving(false);
    }
  };

  const field = (label, key, placeholder, type = "text") => (
    <div className="space-y-1.5">
      <label className="text-xs text-muted-foreground font-medium">{label}</label>
      <input
        type={type}
        value={form[key]}
        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
        placeholder={placeholder}
        disabled={!isAdmin}
        className="w-full bg-secondary/40 border border-border rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 disabled:opacity-60"
      />
    </div>
  );

  return (
    <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
          <Building2 className="text-primary" style={{ width: 18, height: 18 }} />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">Dados da empresa</p>
          <p className="text-xs text-muted-foreground">Informações gerais utilizadas nos relatórios e e-mails</p>
        </div>
      </div>

      {!empresa && <p className="text-sm text-muted-foreground">Carregando dados da empresa…</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {field("Razão social", "name", "Nome da empresa")}
        {field("CNPJ", "cnpj", "00.000.000/0001-00")}
        {field("E-mail financeiro", "email", "financeiro@empresa.com.br", "email")}
        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground font-medium">Moeda padrão</label>
          <select
            value={form.currency}
            onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value }))}
            disabled={!isAdmin}
            className="w-full bg-secondary/40 border border-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/40 appearance-none disabled:opacity-60"
          >
            <option value="BRL">BRL — Real Brasileiro</option>
            <option value="USD">USD — Dólar Americano</option>
            <option value="EUR">EUR — Euro</option>
          </select>
        </div>
      </div>

      {error && <p className="text-destructive text-sm">{error}</p>}
      {!isAdmin && <p className="text-xs text-muted-foreground">Apenas administradores podem editar os dados da empresa.</p>}

      <div className="flex justify-end pt-1">
        <Button onClick={handleSave} size="sm" disabled={!isAdmin || saving || !empresa} className="gap-2 min-w-[120px]">
          {saving ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Salvando…</>
            : saved ? <><Check className="w-3.5 h-3.5" /> Salvo!</>
            : <><Save className="w-3.5 h-3.5" /> Salvar</>}
        </Button>
      </div>
    </div>
  );
}
