import React, { useState, useMemo } from "react";
import { Users, UserPlus, Search, X, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ROLE_LABELS } from "@/lib/roles";
import { listProfiles, convidarUsuarios, atualizarPapel, removerUsuario } from "@/api/usuarios";
import UsersStatsBar from "@/components/users/UsersStatsBar";
import UsersTable from "@/components/users/UsersTable";
import InviteModal from "@/components/users/InviteModal";
import EditRoleModal from "@/components/users/EditRoleModal";
import ImportUsersModal from "@/components/users/ImportUsersModal";

const STATUS_OPTIONS = [
  { value: "all",      label: "Todos os status" },
  { value: "active",   label: "Ativos" },
  { value: "pending",  label: "Convite pendente" },
  { value: "inactive", label: "Inativos" },
];

const ROLE_OPTIONS = [
  { value: "all",      label: "Todos os papéis" },
  ...Object.entries(ROLE_LABELS).map(([v, l]) => ({ value: v, label: l })),
];

const initials = (s) => (s || "?").trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();

// Mapeia um profile do Supabase para a forma que a tabela de usuários espera.
function toUser(p) {
  return {
    id: p.id,
    name: p.nome || (p.email ? p.email.split("@")[0] : "Usuário"),
    email: p.email,
    role: p.role || "colaborador",
    status: "active",      // sem coluna de status no banco ainda — v1 mostra todos ativos
    department: "",        // sem coluna de departamento no banco ainda
    avatar: initials(p.nome || p.email),
    invited_at: p.created_at,
    joined_at: p.created_at,
    last_expense: null,
    expenses_count: 0,
  };
}

export default function UsersPage() {
  const queryClient = useQueryClient();
  const { data: profiles = [], isLoading } = useQuery({ queryKey: ["profiles"], queryFn: listProfiles });
  const users = useMemo(() => profiles.map(toUser), [profiles]);
  const refetch = () => queryClient.invalidateQueries({ queryKey: ["profiles"] });
  const inviteRedirect = `${window.location.origin}/aceitar-convite`;

  const [search, setSearch]             = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterRole, setFilterRole]     = useState("all");
  const [inviteOpen, setInviteOpen]     = useState(false);
  const [importOpen, setImportOpen]     = useState(false);
  const [editUser, setEditUser]         = useState(null);

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        !search ||
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        (u.department ?? "").toLowerCase().includes(search.toLowerCase());
      const matchStatus = filterStatus === "all" || u.status === filterStatus;
      const matchRole   = filterRole === "all" || u.role === filterRole;
      return matchSearch && matchStatus && matchRole;
    });
  }, [users, search, filterStatus, filterRole]);

  const hasFilters = search || filterStatus !== "all" || filterRole !== "all";

  const clearFilters = () => {
    setSearch("");
    setFilterStatus("all");
    setFilterRole("all");
  };

  const reportInvites = (res, successMsg) => {
    if (res.sent > 0) toast.success(successMsg(res.sent));
    (res.results || []).filter((r) => !r.ok).forEach((f) => toast.error(`${f.email}: ${f.error}`));
  };

  const handleInvite = async (invites) => {
    try {
      const res = await convidarUsuarios(invites.map((i) => ({ email: i.email, role: i.role })), inviteRedirect);
      reportInvites(res, (n) => `${n} convite${n > 1 ? "s" : ""} enviado${n > 1 ? "s" : ""}!`);
      refetch();
    } catch (e) { toast.error(e?.message || "Erro ao enviar convites"); }
  };

  const handleEdit = (user) => setEditUser(user);

  const handleSaveEdit = async (updated) => {
    try {
      await atualizarPapel(updated.id, updated.role);
      toast.success("Acesso atualizado.");
      refetch();
    } catch (e) { toast.error(e?.message || "Erro ao atualizar acesso"); }
  };

  const handleRemove = async (id) => {
    try {
      await removerUsuario(id);
      toast.success("Usuário removido.");
      refetch();
    } catch (e) { toast.error(e?.message || "Erro ao remover usuário"); }
  };

  const handleResendInvite = async (user) => {
    try {
      const res = await convidarUsuarios([{ email: user.email, role: user.role }], inviteRedirect);
      if (res.sent > 0) toast.success(`Convite reenviado para ${user.email}.`);
      else toast.error(res.results?.[0]?.error || "Não foi possível reenviar.");
    } catch (e) { toast.error(e?.message || "Erro ao reenviar convite"); }
  };

  const handleImport = async (rows) => {
    // Importação = convite em massa; o papel vem do CSV.
    try {
      const res = await convidarUsuarios(rows.map((r) => ({ email: r.email, role: r.papel })), inviteRedirect);
      reportInvites(res, (n) => `${n} convite${n > 1 ? "s" : ""} enviado${n > 1 ? "s" : ""}!`);
      refetch();
    } catch (e) { toast.error(e?.message || "Erro ao importar"); }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">

        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <h1 className="font-heading text-foreground text-2xl md:text-3xl">
                  Usuários
                </h1>
              </div>
              <p className="text-muted-foreground text-sm md:text-base max-w-2xl ml-[52px]">
                Gerencie quem tem acesso ao Reembolsaaí, seus papéis e departamentos.
              </p>
            </div>

            <div className="flex gap-2 shrink-0 mt-1">
              <Button
                variant="outline"
                onClick={() => setImportOpen(true)}
                className="font-semibold text-sm gap-2"
              >
                <Upload className="w-4 h-4" />
                <span className="hidden sm:inline">Importar CSV</span>
              </Button>
              <Button
                onClick={() => setInviteOpen(true)}
                className="font-semibold text-sm gap-2"
              >
                <UserPlus className="w-4 h-4" />
                <span className="hidden sm:inline">Convidar</span>
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <UsersStatsBar users={users} />

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="flex flex-col sm:flex-row gap-2.5 mb-4"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              className="pl-9 bg-card border-border text-sm"
              placeholder="Buscar por nome, e-mail ou departamento…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex gap-2 shrink-0">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="bg-card border-border text-sm w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {STATUS_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value} className="text-sm">{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="bg-card border-border text-sm w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {ROLE_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value} className="text-sm">{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {hasFilters && (
              <Button
                variant="ghost"
                size="icon"
                onClick={clearFilters}
                className="shrink-0 text-muted-foreground hover:text-foreground"
                title="Limpar filtros"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </motion.div>

        {/* Result count */}
        {hasFilters && (
          <p className="text-xs text-muted-foreground mb-3">
            {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
          </p>
        )}

        {/* Table / empty state */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : filtered.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <UsersTable
              users={filtered}
              onEdit={handleEdit}
              onRemove={handleRemove}
              onResendInvite={handleResendInvite}
            />
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-foreground font-medium mb-1">Nenhum usuário encontrado</p>
            <p className="text-muted-foreground text-sm mb-5">
              {hasFilters ? "Tente ajustar os filtros." : "Convide o primeiro colaborador para começar."}
            </p>
            {!hasFilters && (
              <Button onClick={() => setInviteOpen(true)} className="gap-2 font-semibold text-sm">
                <UserPlus className="w-4 h-4" />
                Convidar colaborador
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <InviteModal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        onInvite={handleInvite}
      />
      <ImportUsersModal
        open={importOpen}
        onClose={() => setImportOpen(false)}
        onImport={handleImport}
      />
      <EditRoleModal
        open={!!editUser}
        user={editUser}
        onClose={() => setEditUser(null)}
        onSave={handleSaveEdit}
      />
    </div>
  );
}