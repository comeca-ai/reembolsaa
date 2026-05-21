import React, { useState } from "react";
import { Building2, Save, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const INITIAL = {
  name: "Construtec Brasil Ltda.",
  cnpj: "12.345.678/0001-90",
  email: "financeiro@construtecbr.com.br",
  currency: "BRL",
  fiscal_year_start: "01",
};

export default function CompanySettings() {
  const [form, setForm] = useState(INITIAL);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const field = (label, key, placeholder, type = "text") => (
    <div className="space-y-1.5">
      <label className="text-xs text-muted-foreground font-medium">{label}</label>
      <input
        type={type}
        value={form[key]}
        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
        placeholder={placeholder}
        className="w-full bg-secondary/40 border border-border rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40"
      />
    </div>
  );

  return (
    <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
          <Building2 className="w-4.5 h-4.5 text-primary" style={{ width: 18, height: 18 }} />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">Dados da empresa</p>
          <p className="text-xs text-muted-foreground">Informações gerais utilizadas nos relatórios e e-mails</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {field("Razão social", "name", "Nome da empresa")}
        {field("CNPJ", "cnpj", "00.000.000/0001-00")}
        {field("E-mail financeiro", "email", "financeiro@empresa.com.br", "email")}
        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground font-medium">Moeda padrão</label>
          <select
            value={form.currency}
            onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value }))}
            className="w-full bg-secondary/40 border border-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/40 appearance-none"
          >
            <option value="BRL">BRL — Real Brasileiro</option>
            <option value="USD">USD — Dólar Americano</option>
            <option value="EUR">EUR — Euro</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end pt-1">
        <Button onClick={handleSave} size="sm" className="gap-2 min-w-[120px]">
          {saved ? <><Check className="w-3.5 h-3.5" /> Salvo!</> : <><Save className="w-3.5 h-3.5" /> Salvar</>}
        </Button>
      </div>
    </div>
  );
}