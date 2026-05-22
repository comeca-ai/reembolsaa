import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send, Plus, Trash2 } from "lucide-react";
import { ROLE_LABELS, DEPARTMENT_OPTIONS } from "@/lib/mocks/mockData";

const ROLE_OPTIONS = Object.entries(ROLE_LABELS);

const emptyInvite = () => ({ id: Date.now(), email: "", role: "employee", department: "" });

export default function InviteModal({ open, onClose, onInvite }) {
  const [invites, setInvites] = useState([emptyInvite()]);

  const update = (id, field, value) =>
    setInvites((prev) => prev.map((i) => (i.id === id ? { ...i, [field]: value } : i)));

  const addRow = () => setInvites((prev) => [...prev, emptyInvite()]);

  const removeRow = (id) =>
    setInvites((prev) => (prev.length > 1 ? prev.filter((i) => i.id !== id) : prev));

  const handleSubmit = () => {
    const valid = invites.filter((i) => i.email.trim());
    if (!valid.length) return;
    onInvite(valid);
    setInvites([emptyInvite()]);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-heading text-lg">Convidar colaboradores</DialogTitle>
          <p className="text-muted-foreground text-sm mt-1">
            Os convidados receberão um e-mail para criar a conta e acessar o sistema.
          </p>
        </DialogHeader>

        <div className="space-y-3 py-2 max-h-[55vh] overflow-y-auto pr-1">
          {invites.map((invite) => (
            <div key={invite.id} className="grid grid-cols-[1fr_auto_auto] gap-2 items-start">
              <div className="space-y-1.5">
                <Input
                  className="bg-secondary border-border text-sm"
                  placeholder="email@empresa.com.br"
                  type="email"
                  value={invite.email}
                  onChange={(e) => update(invite.id, "email", e.target.value)}
                />
                <div className="grid grid-cols-2 gap-2">
                  <Select value={invite.role} onValueChange={(v) => update(invite.id, "role", v)}>
                    <SelectTrigger className="bg-secondary border-border text-xs h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {ROLE_OPTIONS.map(([val, lbl]) => (
                        <SelectItem key={val} value={val} className="text-xs">{lbl}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={invite.department} onValueChange={(v) => update(invite.id, "department", v)}>
                    <SelectTrigger className="bg-secondary border-border text-xs h-8">
                      <SelectValue placeholder="Departamento" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {DEPARTMENT_OPTIONS.map((d) => (
                        <SelectItem key={d} value={d} className="text-xs">{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 mt-1"
                onClick={() => removeRow(invite.id)}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          ))}
        </div>

        <button
          onClick={addRow}
          className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors py-1"
        >
          <Plus className="w-3.5 h-3.5" />
          Adicionar outro
        </button>

        <DialogFooter className="gap-2 pt-2">
          <Button variant="ghost" onClick={onClose} className="text-muted-foreground text-sm">
            Cancelar
          </Button>
          <Button onClick={handleSubmit} className="gap-2 font-semibold text-sm">
            <Send className="w-4 h-4" />
            Enviar convites
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}