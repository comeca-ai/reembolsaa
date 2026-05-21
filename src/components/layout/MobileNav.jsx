import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Shield, Users } from "lucide-react";

const NAV_ITEMS = [
  { path: "/", label: "Política", icon: Shield },
  { path: "/usuarios", label: "Usuários", icon: Users },
];

export default function MobileNav() {
  const { pathname } = useLocation();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border px-4 pb-safe">
      <div className="flex">
        {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
          const isActive = pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}