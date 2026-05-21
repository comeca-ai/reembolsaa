import React, { useRef, useState } from "react";
import { FileUp, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function EmptyState({ onFileSelected }) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type === "application/pdf") {
      onFileSelected(file);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) onFileSelected(file);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex items-center justify-center py-16 md:py-24"
    >
      <div className="w-full max-w-lg">
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`
            relative cursor-pointer rounded-xl border-2 border-dashed p-10 md:p-14
            transition-all duration-300 text-center group
            ${isDragging
              ? "border-primary bg-primary/5"
              : "border-border hover:border-muted-foreground/40 bg-card"
            }
          `}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="flex flex-col items-center gap-5">
            <div className={`
              w-16 h-16 rounded-2xl flex items-center justify-center
              transition-colors duration-300
              ${isDragging ? "bg-primary/15" : "bg-secondary group-hover:bg-secondary/80"}
            `}>
              <FileUp className={`w-7 h-7 transition-colors ${isDragging ? "text-primary" : "text-muted-foreground"}`} />
            </div>

            <div className="space-y-2">
              <p className="text-foreground font-heading text-lg">
                Comece subindo sua política de reembolso
              </p>
              <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                Arraste e solte o PDF aqui ou clique para selecionar. A IA vai extrair as regras automaticamente.
              </p>
            </div>

            <Button
              className="mt-2 font-semibold text-sm px-6 gap-2"
              onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
            >
              <Upload className="w-4 h-4" />
              Enviar política
            </Button>

            <p className="text-xs text-muted-foreground/60">Aceita apenas PDF</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}