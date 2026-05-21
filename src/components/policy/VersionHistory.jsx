import React from "react";
import { Clock, FileText, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { motion } from "framer-motion";

const STATUS_STYLES = {
  draft: { label: "rascunho", className: "border-warning/30 text-warning bg-warning/5" },
  active: { label: "ativa", className: "border-primary/30 text-primary bg-primary/5" },
  archived: { label: "arquivada", className: "border-border text-muted-foreground bg-secondary" },
};

export default function VersionHistory({ versions }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.1 }}
    >
      <div className="border border-border rounded-xl bg-card overflow-hidden">
        <div className="p-5 border-b border-border">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <h3 className="font-heading text-foreground text-base">Histórico de versões</h3>
          </div>
          <p className="text-muted-foreground text-xs mt-1">
            Despesas antigas continuam medidas pela versão que valia na época.
          </p>
        </div>

        <div className="divide-y divide-border">
          {versions.map((v) => {
            const style = STATUS_STYLES[v.status] || STATUS_STYLES.archived;
            return (
              <div key={v.id} className="px-5 py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-foreground text-sm font-medium">
                        Versão {v.version}
                      </span>
                      <Badge variant="outline" className={`text-[10px] font-mono ${style.className}`}>
                        {style.label}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground">
                      <span className="font-mono truncate">{v.file_name}</span>
                      <span className="hidden sm:inline">·</span>
                      <span className="hidden sm:flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {v.uploaded_by}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-xs text-muted-foreground font-mono">
                    {format(new Date(v.created_at), "dd MMM yyyy", { locale: ptBR })}
                  </p>
                  <p className="text-[11px] text-muted-foreground/60 mt-0.5">
                    {v.rules_count} regras
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}