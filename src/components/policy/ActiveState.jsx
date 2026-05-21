import React from "react";
import { CheckCircle2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import RuleCard from "./RuleCard";

export default function ActiveState({ rules, fileName, version, onNewVersion }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Success banner */}
      <div className="bg-primary/8 border border-primary/20 rounded-xl p-4 md:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
          <div>
            <p className="text-foreground text-sm font-medium">
              Política ativa — todas as despesas seguem estas regras.
            </p>
            <p className="text-muted-foreground text-xs mt-0.5">
              Arquivo: <span className="font-mono">{fileName}</span>
            </p>
          </div>
        </div>
        <Badge
          variant="outline"
          className="shrink-0 w-fit border-primary/30 text-primary bg-primary/5 font-mono text-xs"
        >
          versão {version} · ativa
        </Badge>
      </div>

      {/* Read-only rules grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {rules.map((rule, i) => (
          <RuleCard
            key={rule.id}
            rule={rule}
            index={i}
            readOnly={true}
            onEdit={() => {}}
            onDelete={() => {}}
          />
        ))}
      </div>

      {/* Upload new version */}
      <div className="flex justify-center pt-4">
        <Button
          variant="outline"
          onClick={onNewVersion}
          className="gap-2 font-semibold text-sm border-border hover:bg-secondary"
        >
          <Upload className="w-4 h-4" />
          Subir nova versão
        </Button>
      </div>
    </motion.div>
  );
}