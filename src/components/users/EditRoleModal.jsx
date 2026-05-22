import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, CheckCircle2, User } from "lucide-react";
import { DEPARTMENT_OPTIONS } from "@/lib/mocks/mockData";
import UserAvatar from "./UserAvatar";

const ROLES = [
  {
    value: "admin",
    label: "Administrador",
    icon: Shield,
    color: "text-primary",
    bg: "bg-primary/10 border-primary/30",
    desc: "Acesso total: gerencia usuários, política, relatórios e financeiro.",
  },
  {
    value: "approver",
    label: "Aprovador",
    icon: CheckCircle2,
    color: "text-warning",
    bg: "bg-warning/10 border-warning/30",
    desc: "Visualiza e aprova despesas enviadas pelos colaboradores.",
  },
  {
    value: "employee",
    label: "Colaborador",
    icon: User,
    color: "text-muted-foreground",
    bg: "bg-secondary border-border",
    desc: "Envia despesas para aprovação e acompanha o próprio histórico.",
  },
];

export default function EditRoleModal({ open, user, onClose, onSave }) {
  const [role, setRole] = useState(user?.role ?? "employee");
  const [department, setDepartment] = useState(user?.department ?? "");

  React.useEffect(() => {
    if (user) {
      setRole(user.role);
      setDepartment(user.department ?? "");
    }
  }, [user]);

  const handleSave = () => {
    onSave({ ...user, role, department });
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
              {ROLES.map(({ value, label, icon: Icon, color, bg, desc }) => (
                <button
                  key={value}
                  onClick={() => setRole(value)}
                  className={`w-full flex items-start gap-3 p-3 rounded-lg border text-left transition-all ${
                    role === value ? bg : "border-border bg-secondary/40 hover:bg-secondary"
                  }`}
                >
                  <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${role === value ? color : "text-muted-foreground"}`} />
                  <div>
                    <p className={`text-sm font-medium ${role === value ? color : "text-foreground"}`}>{label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-xs text-muted-foreground uppercase tracking-wider">Departamento</Label>
            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger className="mt-1.5 bg-secondary border-border">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {DEPARTMENT_OPTIONS.map((d) => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
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