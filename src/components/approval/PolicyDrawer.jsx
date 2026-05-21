import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Shield, DollarSign } from "lucide-react";
import { LIMIT_UNIT_LABELS } from "@/lib/mockData";

export default function PolicyDrawer({ open, onClose, rules }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-background/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-card border-l border-border flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h2 className="font-heading text-foreground text-base">Política de despesas</h2>
                  <p className="text-muted-foreground text-xs">Versão ativa · {rules.length} regras</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-lg hover:bg-secondary"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-3">
              {rules.map((rule) => (
                <div key={rule.id} className="bg-secondary/40 border border-border rounded-xl p-4 space-y-2.5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-medium text-foreground text-sm">{rule.category}</span>
                    {rule.limit_amount ? (
                      <div className="flex items-center gap-1 bg-primary/10 px-2.5 py-1 rounded-full">
                        <DollarSign className="w-3 h-3 text-primary" />
                        <span className="text-primary text-xs font-mono font-semibold">
                          R$ {rule.limit_amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                          {LIMIT_UNIT_LABELS[rule.limit_unit] || ""}
                        </span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-xs bg-secondary px-2 py-0.5 rounded-full">Sem teto</span>
                    )}
                  </div>
                  {rule.conditions && (
                    <p className="text-muted-foreground text-xs leading-relaxed">{rule.conditions}</p>
                  )}
                  {rule.required_docs && (
                    <div className="flex items-start gap-1.5">
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wide shrink-0 mt-0.5">Docs:</span>
                      <span className="text-xs text-foreground">{rule.required_docs}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}