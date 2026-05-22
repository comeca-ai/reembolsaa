import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Shield, CheckCircle2, DollarSign, User } from "lucide-react";
import { ROLES, ROLE_LABELS, ROLE_DESCRIPTIONS, DEFAULT_ROLE } from "@/lib/roles";
import UserAvatar from "./UserAvatar";

// Ícone/cores por papel; rótulo e descrição vêm de lib/roles (fonte única).
const ROLE_META = {
  admin:       { icon: Shield,       color: "text-primary",          bg: "bg-primary/10 border-primary/30" },
  aprovador:   { icon: CheckCircle2, color: "text-warning",          bg: "bg-warning/10 border-warning/30" },
  financeiro:  { icon: DollarSign,   color: "text-chart-4",          bg: "bg-chart-4/10 border-chart-4/30" },
  colaborador: { icon: User,         color: "text-muted-foreground", bg: "bg-secondary border-border" },
};

export default function EditRoleModal({ open, user, onClose, onSave }) {
  const [role, setRole] = useState(user?.role ?? DEFAULT_ROLE);

  React.useEffect(() => {
    if (user) setRole(user.role ?? DEFAULT_ROLE);
  }, [user]);

  const handleSave = () => {
    onSave({ ...user, role });
    onClose();
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-heading text-base">Editar acesso</DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-3 py-3 border-b border-border">
          <UserAvatar avatar={user.avatar} name={user.name} />
          <div>
            <p className="text-foreground text-sm font-medium">{user.name}</p>
            <p className="text-muted-foreground text-xs">{user.email}</p>
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <div>
            <Label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">Nível de acesso</Label>
            <div className="space-y-2">
              {ROLES.map((value) => {
                const { icon: Icon, color, bg } = ROLE_META[value];
                return (
                  <button
                    key={value}
                    onClick={() => setRole(value)}
                    className={`w-full flex items-start gap-3 p-3 rounded-lg border text-left transition-all ${
                      role === value ? bg : "border-border bg-secondary/40 hover:bg-secondary"
                    }`}
                  >
                    <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${role === value ? color : "text-muted-foreground"}`} />
                    <div>
                      <p className={`text-sm font-medium ${role === value ? color : "text-foreground"}`}>{ROLE_LABELS[value]}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{ROLE_DESCRIPTIONS[value]}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 pt-2">
          <Button variant="ghost" onClick={onClose} className="text-muted-foreground text-sm">
            Cancelar
          </Button>
          <Button onClick={handleSave} className="font-semibold text-sm">
            Salvar alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
