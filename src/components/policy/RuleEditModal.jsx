import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const UNIT_OPTIONS = [
  { value: "refeicao", label: "/refeição" },
  { value: "diaria", label: "/diária" },
  { value: "dia", label: "/dia" },
  { value: "km", label: "/km" },
  { value: "none", label: "sem teto" },
];

export default function RuleEditModal({ open, rule, onClose, onSave }) {
  const [form, setForm] = useState({
    category: "",
    limit_amount: "",
    limit_unit: "none",
    conditions: "",
    required_docs: "",
  });

  useEffect(() => {
    if (rule) {
      setForm({
        category: rule.category || "",
        limit_amount: rule.limit_amount !== null ? String(rule.limit_amount) : "",
        limit_unit: rule.limit_unit || "none",
        conditions: rule.conditions || "",
        required_docs: rule.required_docs || "",
      });
    }
  }, [rule]);

  const handleSave = () => {
    onSave({
      ...rule,
      category: form.category,
      limit_amount: form.limit_unit === "none" ? null : parseFloat(form.limit_amount) || null,
      limit_unit: form.limit_unit,
      conditions: form.conditions,
      required_docs: form.required_docs,
    });
    onClose();
  };

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-lg">
            {rule?.category ? "Editar regra" : "Nova regra"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <Label className="text-xs text-muted-foreground uppercase tracking-wider">Categoria</Label>
            <Input
              className="mt-1.5 bg-secondary border-border"
              value={form.category}
              onChange={(e) => update("category", e.target.value)}
              placeholder="Ex.: Alimentação"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground uppercase tracking-wider">Limite</Label>
              <Input
                className="mt-1.5 bg-secondary border-border font-mono"
                type="number"
                step="0.01"
                value={form.limit_amount}
                onChange={(e) => update("limit_amount", e.target.value)}
                placeholder="0,00"
                disabled={form.limit_unit === "none"}
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground uppercase tracking-wider">Unidade</Label>
              <Select value={form.limit_unit} onValueChange={(v) => update("limit_unit", v)}>
                <SelectTrigger className="mt-1.5 bg-secondary border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {UNIT_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label className="text-xs text-muted-foreground uppercase tracking-wider">Condições</Label>
            <Textarea
              className="mt-1.5 bg-secondary border-border min-h-[80px]"
              value={form.conditions}
              onChange={(e) => update("conditions", e.target.value)}
              placeholder="Descreva as condições para aprovação"
            />
          </div>

          <div>
            <Label className="text-xs text-muted-foreground uppercase tracking-wider">Documentos exigidos</Label>
            <Input
              className="mt-1.5 bg-secondary border-border"
              value={form.required_docs}
              onChange={(e) => update("required_docs", e.target.value)}
              placeholder="Ex.: Nota fiscal + recibo"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={onClose} className="text-muted-foreground">
            Cancelar
          </Button>
          <Button onClick={handleSave} className="font-semibold">
            Salvar regra
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}