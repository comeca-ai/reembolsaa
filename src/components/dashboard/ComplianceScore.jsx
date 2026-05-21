import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

export default function ComplianceScore({ score }) {
  const radius = 54;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (score / 100) * circ;
  const color = score >= 80 ? "#C8F55A" : score >= 60 ? "#F2C14A" : "#FF7065";

  return (
    <div className="bg-card border border-border rounded-xl p-5 flex flex-col items-center justify-center gap-2 min-h-[168px]">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
          <circle cx="64" cy="64" r={radius} fill="none" stroke="#2A2A27" strokeWidth="10" />
          <motion.circle
            cx="64" cy="64" r={radius}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-2xl font-semibold" style={{ color }}>{score}</span>
          <span className="text-muted-foreground text-[11px] uppercase tracking-wider">score</span>
        </div>
      </div>
      <div className="text-center">
        <div className="flex items-center gap-1.5 justify-center">
          <ShieldCheck className="w-3.5 h-3.5 text-primary" />
          <span className="text-foreground text-sm font-medium">Compliance</span>
        </div>
        <p className="text-muted-foreground text-xs mt-0.5">Últimos 30 dias</p>
      </div>
    </div>
  );
}