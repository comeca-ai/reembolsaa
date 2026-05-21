import React, { useState, useEffect } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const STEPS = [
  "Lendo o comprovante…",
  "Identificando fornecedor e valor…",
  "Classificando categoria…",
  "Verificando data e itens…",
  "Finalizando extração…",
];

export default function ExtractingState() {
  const [stepIndex, setStepIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex(prev => (prev + 1) % STEPS.length);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-card border border-border rounded-2xl p-12 flex flex-col items-center gap-6">
      <div className="relative">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Sparkles className="w-7 h-7 text-primary" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-card rounded-full flex items-center justify-center">
          <Loader2 className="w-4 h-4 text-primary animate-spin" />
        </div>
      </div>

      <div className="text-center space-y-2">
        <p className="text-foreground font-medium">A IA está lendo seu comprovante</p>
        <motion.p
          key={stepIndex}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-muted-foreground text-sm"
        >
          {STEPS[stepIndex]}
        </motion.p>
      </div>

      <div className="flex gap-1">
        {STEPS.map((_, i) => (
          <motion.div
            key={i}
            className="h-1 rounded-full bg-primary/30"
            animate={{ opacity: i <= stepIndex ? 1 : 0.3, width: i === stepIndex ? 24 : 8 }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>
    </div>
  );
}