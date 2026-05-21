import React from "react";
import { Users, UserCheck, Clock, UserMinus } from "lucide-react";
import { motion } from "framer-motion";

export default function UsersStatsBar({ users }) {
  const total   = users.length;
  const active  = users.filter((u) => u.status === "active").length;
  const pending = users.filter((u) => u.status === "pending").length;
  const inactive = users.filter((u) => u.status === "inactive").length;

  const stats = [
    { label: "Total",    value: total,    icon: Users,      color: "text-foreground" },
    { label: "Ativos",   value: active,   icon: UserCheck,  color: "text-primary" },
    { label: "Pendentes",value: pending,  icon: Clock,      color: "text-warning" },
    { label: "Inativos", value: inactive, icon: UserMinus,  color: "text-muted-foreground" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      {stats.map(({ label, value, icon: Icon, color }, i) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.05 }}
          className="bg-card border border-border rounded-xl px-4 py-3 flex items-center gap-3"
        >
          <Icon className={`w-4 h-4 shrink-0 ${color}`} />
          <div>
            <p className={`font-mono text-xl font-semibold leading-none ${color}`}>{value}</p>
            <p className="text-muted-foreground text-xs mt-1">{label}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}