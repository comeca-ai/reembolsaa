import React, { useState } from "react";
import { Plus, ShieldCheck, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AnimatePresence, motion } from "framer-motion";
import RuleCard from "./RuleCard";
import RuleEditModal from "./RuleEditModal";
import { createEmptyRule } from "@/lib/mockData";

export default function ReviewState({ rules, setRules, fileName, version, onActivate }) {
  const [editingRule, setEditingRule] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleEdit = (rule) => {
    setEditingRule(rule);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditingRule(createEmptyRule());
    setModalOpen(true);
  };

  const handleSave = (updatedRule) => {
    setRules((prev) => {
      const exists = prev.find((r) => r.id === updatedRule.id);
      if (exists) return prev.map((r) => (r.id === updatedRule.id ? updatedRule : r));
      return [...prev, updatedRule];
    });
  };

  const handleDelete = (id) => {
    setRules((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Banner */}
      <div className="bg-primary/8 border border-primary/20 rounded-xl p-4 md:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-primary mt-0.5 shrink-0" />
          <div>
            <p className="text-foreground text-sm font-medium">
              A IA encontrou {rules.length} regras em{" "}
              <span className="font-mono text-xs">{fileName}</span>.
              Confira e ative.
            </p>
          </div>
        </div>
        <Badge
          variant="outline"
          className="shrink-0 w-fit border-primary/30 text-primary bg-primary/5 font-mono text-xs"
        >
          versão {version} · rascunho
        </Badge>
      </div>

      {/* Rules grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {rules.map((rule, i) => (
            <RuleCard
              key={rule.id}
              rule={rule}
              index={i}
              readOnly={false}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </AnimatePresence>

        {/* Add rule card */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={handleAdd}
          className="border-2 border-dashed border-border rounded-xl p-5 flex flex-col items-center justify-center gap-2 min-h-[180px] hover:border-muted-foreground/40 hover:bg-card/50 transition-all duration-200 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center group-hover:bg-primary/10 transition-colors">
            <Plus className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <span className="text-muted-foreground text-sm font-medium group-hover:text-foreground transition-colors">
            Adicionar regra
          </span>
        </motion.button>
      </div>

      {/* Fixed footer */}
      <div className="sticky bottom-0 -mx-4 md:-mx-8 px-4 md:px-8 py-4 bg-background/90 backdrop-blur-sm border-t border-border">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-warning">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Revise antes de ativar — você é responsável pelas regras</span>
          </div>
          <Button onClick={onActivate} className="font-semibold text-sm px-6 shrink-0">
            Ativar política (versão {version})
          </Button>
        </div>
      </div>

      {/* Edit modal */}
      <RuleEditModal
        open={modalOpen}
        rule={editingRule}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </motion.div>
  );
}