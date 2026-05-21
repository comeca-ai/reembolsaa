import React, { useEffect, useState } from "react";
import { FileText } from "lucide-react";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";

export default function UploadingState({ fileName, onComplete }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => onComplete(), 300);
          return 100;
        }
        return prev + Math.random() * 18 + 5;
      });
    }, 200);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex items-center justify-center py-16 md:py-24"
    >
      <div className="w-full max-w-md bg-card border border-border rounded-xl p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-foreground font-medium text-sm truncate">{fileName}</p>
            <p className="text-muted-foreground text-xs mt-0.5">Enviando arquivo…</p>
          </div>
        </div>

        <Progress value={Math.min(progress, 100)} className="h-2" />

        <p className="text-xs text-muted-foreground mt-3 text-right font-mono">
          {Math.min(Math.round(progress), 100)}%
        </p>
      </div>
    </motion.div>
  );
}