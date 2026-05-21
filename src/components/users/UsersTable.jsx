import React, { useState } from "react";
import { Pencil, Trash2, MoreHorizontal, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";
import RoleBadge from "./RoleBadge";
import StatusDot from "./StatusDot";
import UserAvatar from "./UserAvatar";

export default function UsersTable({ users, onEdit, onRemove, onResendInvite }) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="text-left px-5 py-3 text-xs text-muted-foreground font-medium uppercase tracking-wider">Usuário</th>
              <th className="text-left px-4 py-3 text-xs text-muted-foreground font-medium uppercase tracking-wider">Papel</th>
              <th className="text-left px-4 py-3 text-xs text-muted-foreground font-medium uppercase tracking-wider">Departamento</th>
              <th className="text-left px-4 py-3 text-xs text-muted-foreground font-medium uppercase tracking-wider">Status</th>
              <th className="text-left px-4 py-3 text-xs text-muted-foreground font-medium uppercase tracking-wider">Despesas</th>
              <th className="text-left px-4 py-3 text-xs text-muted-foreground font-medium uppercase tracking-wider">Adicionado em</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {users.map((user, i) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.02 }}
                  className="border-b border-border/60 hover:bg-secondary/30 transition-colors group"
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <UserAvatar avatar={user.avatar} name={user.name} />
                      <div>
                        <p className="text-foreground font-medium text-sm">{user.name}</p>
                        <p className="text-muted-foreground text-xs">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <RoleBadge role={user.role} />
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-muted-foreground text-sm">{user.department || "—"}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusDot status={user.status} />
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="font-mono text-sm text-foreground">{user.expenses_count}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-muted-foreground text-xs font-mono">
                      {format(new Date(user.invited_at), "dd/MM/yy", { locale: ptBR })}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(user)}
                        className="h-7 px-2.5 text-xs text-muted-foreground hover:text-foreground gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Pencil className="w-3 h-3" />
                        Editar acesso
                      </Button>
                      <UserActions
                        user={user}
                        onEdit={onEdit}
                        onRemove={onRemove}
                        onResendInvite={onResendInvite}
                      />
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden divide-y divide-border">
        <AnimatePresence mode="popLayout">
          {users.map((user, i) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, delay: i * 0.02 }}
              className="px-4 py-4 flex items-start justify-between gap-3"
            >
              <div className="flex items-start gap-3 min-w-0">
                <UserAvatar avatar={user.avatar} name={user.name} />
                <div className="min-w-0">
                  <p className="text-foreground text-sm font-medium truncate">{user.name}</p>
                  <p className="text-muted-foreground text-xs truncate mb-1.5">{user.email}</p>
                  <div className="flex flex-wrap gap-1.5">
                    <RoleBadge role={user.role} />
                    <StatusDot status={user.status} />
                  </div>
                </div>
              </div>
              <UserActions
                user={user}
                onEdit={onEdit}
                onRemove={onRemove}
                onResendInvite={onResendInvite}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function UserActions({ user, onEdit, onRemove, onResendInvite }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-card border-border w-44">
        <DropdownMenuItem
          className="gap-2 text-sm cursor-pointer"
          onClick={() => onEdit(user)}
        >
          <Pencil className="w-3.5 h-3.5" />
          Editar acesso
        </DropdownMenuItem>
        {user.status === "pending" && (
          <DropdownMenuItem
            className="gap-2 text-sm cursor-pointer"
            onClick={() => onResendInvite(user)}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reenviar convite
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator className="bg-border" />
        <DropdownMenuItem
          className="gap-2 text-sm text-destructive hover:text-destructive cursor-pointer focus:text-destructive focus:bg-destructive/10"
          onClick={() => onRemove(user.id)}
        >
          <Trash2 className="w-3.5 h-3.5" />
          Remover usuário
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}