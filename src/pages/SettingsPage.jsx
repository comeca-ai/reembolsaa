import React, { useState } from "react";
import { motion } from "framer-motion";
import { Settings, Layers, Briefcase, Building2 } from "lucide-react";
import TagManager from "@/components/settings/TagManager";
import CompanySettings from "@/components/settings/CompanySettings";

// ─── Initial tag data ──────────────────────────────────────────────
const INITIAL_SECTORS = [
  { id: "s-1", label: "Obras" },
  { id: "s-2", label: "Comercial" },
  { id: "s-3", label: "Financeiro" },
  { id: "s-4", label: "Administrativo" },
  { id: "s-5", label: "TI" },
  { id: "s-6", label: "RH" },
  { id: "s-7", label: "Jurídico" },
  { id: "s-8", label: "Marketing" },
];

const INITIAL_ROLES = [
  { id: "r-1", label: "Administrador" },
  { id: "r-2", label: "Gestor" },
  { id: "r-3", label: "Colaborador" },
  { id: "r-4", label: "Estagiário" },
  { id: "r-5", label: "Analista" },
  { id: "r-6", label: "Coordenador" },
  { id: "r-7", label: "Diretor" },
];

const TABS = [
  { id: "tags",    label: "Tags e Categorias", icon: Layers },
  { id: "company", label: "Empresa",           icon: Building2 },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("tags");
  const [sectors, setSectors] = useState(INITIAL_SECTORS);
  const [roles, setRoles] = useState(INITIAL_ROLES);

  // ── Sector handlers ──────────────────────────────────────────────
  const addSector = (label) =>
    setSectors((prev) => [...prev, { id: `s-${Date.now()}`, label }]);
  const removeSector = (id) =>
    setSectors((prev) => prev.filter((s) => s.id !== id));
  const renameSector = (id, label) =>
    setSectors((prev) => prev.map((s) => (s.id === id ? { ...s, label } : s)));

  // ── Role handlers ────────────────────────────────────────────────
  const addRole = (label) =>
    setRoles((prev) => [...prev, { id: `r-${Date.now()}`, label }]);
  const removeRole = (id) =>
    setRoles((prev) => prev.filter((r) => r.id !== id));
  const renameRole = (id, label) =>
    setRoles((prev) => prev.map((r) => (r.id === id ? { ...r, label } : r)));

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-12 space-y-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Settings className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-heading text-foreground text-2xl md:text-3xl">Configurações</h1>
              <p className="text-muted-foreground text-sm">Gerencie setores, cargos e dados da empresa</p>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 bg-secondary/40 border border-border rounded-xl p-1 w-fit">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === id
                  ? "bg-card text-foreground shadow-sm border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <motion.div key={activeTab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
          {activeTab === "tags" && (
            <div className="space-y-5">
              <TagManager
                title="Setores"
                description="Departamentos e áreas da empresa usados no cadastro de colaboradores e relatórios"
                icon={Layers}
                color="primary"
                tags={sectors}
                onAdd={addSector}
                onRemove={removeSector}
                onRename={renameSector}
              />
              <TagManager
                title="Cargos"
                description="Funções e perfis de acesso atribuídos aos colaboradores"
                icon={Briefcase}
                color="warning"
                tags={roles}
                onAdd={addRole}
                onRemove={removeRole}
                onRename={renameRole}
              />
            </div>
          )}

          {activeTab === "company" && <CompanySettings />}
        </motion.div>

      </div>
    </div>
  );
}