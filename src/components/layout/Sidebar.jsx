import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, ChevronRight, TrendingUp, PlusCircle, CheckCircle2, BarChart3, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import ThemeToggle from "@/components/ThemeToggle";
import { visibleNavItems } from "@/lib/features";

const initials = (name = "") =>
  name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("") || "·";

const NAV_ITEMS = [
  { path: "/dashboard",    label: "Dashboard",    icon: LayoutDashboard },
  { path: "/nova-despesa", label: "Nova Despesa", icon: PlusCircle },
  { path: "/aprovacoes",   label: "Aprovações",   icon: CheckCircle2 },
  { path: "/relatorios",   label: "Relatórios",   icon: BarChart3 },
  { path: "/financeiro",   label: "Financeiro",   icon: TrendingUp },
  { path: "/configuracoes",label: "Configurações", icon: Settings },
];

export default function Sidebar() {
  const { pathname } = useLocation();
  const { profile, empresa, signOut } = useAuth();

  return (
    <aside className="w-56 shrink-0 hidden md:flex flex-col h-screen sticky top-0 bg-card border-r border-border">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-heading text-xs font-bold">R$</span>
          </div>
          <span className="font-heading text-foreground text-sm">Reembolsaaí</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {visibleNavItems(NAV_ITEMS).map(({ path, label, icon: Icon }) => {
          const isActive = pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 group
                ${isActive
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }
              `}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`} />
              <span className="flex-1">{label}</span>
              {isActive && <ChevronRight className="w-3 h-3 text-primary/60" />}
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="px-3 py-4 border-t border-border space-y-1">
        {empresa?.nome && (
          <p className="px-2 text-[11px] uppercase tracking-wide text-muted-foreground/70 truncate">
            {empresa.nome}
          </p>
        )}
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
            <span className="text-primary font-mono text-xs font-semibold">{initials(profile?.nome)}</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-foreground text-xs font-medium truncate">{profile?.nome || "Usuário"}</p>
            <p className="text-muted-foreground text-[11px] truncate">{profile?.email}</p>
          </div>
          <ThemeToggle />
          <button
            onClick={() => signOut()}
            title="Sair"
            className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-secondary transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}