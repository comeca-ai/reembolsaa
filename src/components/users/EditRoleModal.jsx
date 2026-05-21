import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ROLE_LABELS, DEPARTMENT_OPTIONS } from "@/lib/mockData";
import UserAvatar from "./UserAvatar";

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
            <Label className="text-xs text-muted-foreground uppercase tracking-wider">Papel</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="mt-1.5 bg-secondary border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {Object.entries(ROLE_LABELS).map(([val, lbl]) => (
                  <SelectItem key={val} value={val}>{lbl}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1.5">
              {role === "admin" && "Acesso total: gerencia usuários, política e aprova todas as despesas."}
              {role === "manager" && "Aprova despesas do seu departamento e visualiza relatórios da equipe."}
              {role === "employee" && "Submete despesas para aprovação e acompanha o próprio histórico."}
            </p>
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