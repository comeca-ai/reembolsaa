import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Shield, Users, ChevronRight } from "lucide-react";
import { CURRENT_USER } from "@/lib/mockData";

const NAV_ITEMS = [
  { path: "/",         label: "Dashboard", icon: LayoutDashboard },
  { path: "/politica", label: "Política",  icon: Shield },
  { path: "/usuarios", label: "Usuários",  icon: Users },
];

export default function Sidebar() {
  const { pathname } = useLocation();

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
        {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
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
      <div className="px-3 py-4 border-t border-border">
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
            <span className="text-primary font-mono text-xs font-semibold">{CURRENT_USER.avatar}</span>
          </div>
          <div className="min-w-0">
            <p className="text-foreground text-xs font-medium truncate">{CURRENT_USER.name}</p>
            <p className="text-muted-foreground text-[11px] truncate">{CURRENT_USER.email}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}