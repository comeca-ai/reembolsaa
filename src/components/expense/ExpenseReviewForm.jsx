import React, { useState } from "react";
import { Sparkles, Edit3, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

const CATEGORIES = [
  "Alimentação", "Hospedagem", "Transporte", "Combustível",
  "Material de escritório", "Treinamento", "Software",
  "Representação", "Eventos", "Outros"
];

export default function ExpenseReviewForm({ extracted, imageUrl, onSubmit, onBack }) {
  const [form, setForm] = useState({
    vendor:      extracted?.vendor      || "",
    date:        extracted?.date        || "",
    amount:      extracted?.amount      || "",
    category:    extracted?.category    || "Outros",
    description: extracted?.description || "",
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="space-y-5">
      {/* AI badge */}
      <div className="flex items-center gap-2 bg-primary/8 border border-primary/20 rounded-xl px-4 py-3">
        <Sparkles className="w-4 h-4 text-primary shrink-0" />
        <p className="text-sm text-primary">
          A IA preencheu os campos abaixo. Revise e ajuste se necessário antes de enviar.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Image preview */}
        {imageUrl && (
          <div className="md:col-span-2 bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-4 py-2.5 border-b border-border flex items-center gap-2">
              <Edit3 className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Comprovante enviado</span>
            </div>
            <img
              src={imageUrl}
              alt="Comprovante"
              className="w-full max-h-64 object-contain bg-secondary/20 p-4"
            />
          </div>
        )}

        {/* Form fields */}
        <Field label="Fornecedor" required>
          <input
            value={form.vendor}
            onChange={e => set("vendor", e.target.value)}
            placeholder="Nome do estabelecimento"
            className="input-field"
          />
        </Field>

        <Field label="Data" required>
          <input
            type="date"
            value={form.date}
            onChange={e => set("date", e.target.value)}
            className="input-field"
          />
        </Field>

        <Field label="Valor (R$)" required>
          <input
            type="number"
            step="0.01"
            value={form.amount}
            onChange={e => set("amount", e.target.value)}
            placeholder="0,00"
            className="input-field font-mono"
          />
        </Field>

        <Field label="Categoria" required>
          <select
            value={form.category}
            onChange={e => set("category", e.target.value)}
            className="input-field"
          >
            {CATEGORIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </Field>

        <div className="md:col-span-2">
          <Field label="Descrição">
            <textarea
              value={form.description}
              onChange={e => set("description", e.target.value)}
              placeholder="Descreva brevemente a despesa…"
              rows={3}
              className="input-field resize-none"
            />
          </Field>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between pt-2">
        <Button variant="ghost" onClick={onBack} className="text-muted-foreground">
          ← Cancelar
        </Button>
        <Button onClick={handleSubmit} className="gap-2">
          <Send className="w-4 h-4" />
          Verificar compliance
        </Button>
      </div>

      <style>{`
        .input-field {
          width: 100%;
          background: hsl(var(--secondary));
          border: 1px solid hsl(var(--border));
          border-radius: 10px;
          padding: 10px 14px;
          color: hsl(var(--foreground));
          font-size: 14px;
          outline: none;
          transition: border-color 0.15s;
          font-family: inherit;
        }
        .input-field:focus {
          border-color: hsl(var(--primary));
        }
        .input-field option {
          background: hsl(var(--card));
        }
      `}</style>
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs text-muted-foreground uppercase tracking-wide">
        {label}{required && <span className="text-primary ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}