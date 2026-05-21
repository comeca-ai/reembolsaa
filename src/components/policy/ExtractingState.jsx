import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Brain } from "lucide-react";

export default function ExtractingState({ fileName, onComplete }) {
  useEffect(() => {
    const timer = setTimeout(() => onComplete(), 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex items-center justify-center py-16 md:py-24"
    >
      <div className="w-full max-w-md text-center">
        <div className="relative mx-auto w-20 h-20 mb-8">
          {/* Pulsing rings */}
          <motion.div
            className="absolute inset-0 rounded-2xl border-2 border-primary/30"
            animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute inset-0 rounded-2xl border-2 border-primary/20"
            animate={{ scale: [1, 1.6, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
          />
          {/* Center icon */}
          <div className="absolute inset-0 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Brain className="w-8 h-8 text-primary" />
          </div>
        </div>

        <h3 className="text-foreground font-heading text-xl mb-2">
          A IA está lendo sua política…
        </h3>
        <p className="text-muted-foreground text-sm max-w-xs mx-auto">
          Extraindo regras de <span className="text-foreground font-medium">{fileName}</span>.
          Isso leva apenas alguns segundos.
        </p>

        {/* Scan animation dots */}
        <div className="flex justify-center gap-1.5 mt-8">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-primary"
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}