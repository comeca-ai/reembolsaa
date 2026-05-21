import React, { useRef, useState } from "react";
import { ImagePlus, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ReceiptDropzone({ onImageUploaded }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/") && file.type !== "application/pdf") return;
    onImageUploaded(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`
        relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-200
        flex flex-col items-center justify-center gap-5 py-20 px-8
        ${dragging
          ? "border-primary bg-primary/5"
          : "border-border bg-card hover:border-primary/40 hover:bg-secondary/30"
        }
      `}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*,application/pdf"
        className="hidden"
        onChange={(e) => handleFile(e.target.files[0])}
      />

      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${
        dragging ? "bg-primary/20" : "bg-secondary"
      }`}>
        <ImagePlus className={`w-7 h-7 ${dragging ? "text-primary" : "text-muted-foreground"}`} />
      </div>

      <div className="text-center space-y-1.5">
        <p className="text-foreground font-medium text-base">
          {dragging ? "Solte aqui!" : "Suba o comprovante"}
        </p>
        <p className="text-muted-foreground text-sm">
          Arraste e solte ou clique para selecionar
        </p>
        <p className="text-muted-foreground text-xs">
          JPG, PNG, WEBP ou PDF • A IA extrai os dados automaticamente
        </p>
      </div>

      <Button
        onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
        className="gap-2"
      >
        <Upload className="w-4 h-4" />
        Escolher arquivo
      </Button>
    </div>
  );
}