import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Upload, CheckCircle2, AlertCircle, FileText, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const CSV_TEMPLATE = `nome,email,cargo,setor,papel
Mariana Costa,mariana@empresa.com.br,Analista,Financeiro,employee
Carlos Almeida,carlos@empresa.com.br,Gestor,Obras,manager`;

const REQUIRED_COLS = ["nome", "email", "cargo", "setor", "papel"];
const VALID_ROLES = ["admin", "manager", "employee"];

function parseCSV(text) {
  const lines = text.trim().split("\n").map((l) => l.trim()).filter(Boolean);
  if (lines.length < 2) return { rows: [], error: "Arquivo vazio ou sem dados." };

  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
  const missing = REQUIRED_COLS.filter((c) => !headers.includes(c));
  if (missing.length) return { rows: [], error: `Colunas faltando: ${missing.join(", ")}` };

  const rows = [];
  const errors = [];

  lines.slice(1).forEach((line, i) => {
    const vals = line.split(",").map((v) => v.trim());
    const obj = Object.fromEntries(headers.map((h, idx) => [h, vals[idx] ?? ""]));

    if (!obj.email || !obj.email.includes("@")) {
      errors.push(`Linha ${i + 2}: e-mail inválido ("${obj.email}")`);
      return;
    }
    if (!VALID_ROLES.includes(obj.papel)) {
      errors.push(`Linha ${i + 2}: papel inválido ("${obj.papel}"). Use: admin, manager ou employee`);
      return;
    }
    rows.push(obj);
  });

  return { rows, errors };
}

export default function ImportUsersModal({ open, onClose, onImport }) {
  const [step, setStep] = useState("upload"); // upload | preview | done
  const [rows, setRows] = useState([]);
  const [parseErrors, setParseErrors] = useState([]);
  const [fileName, setFileName] = useState("");
  const inputRef = useRef();

  const handleFile = (file) => {
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const { rows: parsed, errors, error } = parseCSV(e.target.result);
      if (error) { setParseErrors([error]); setRows([]); }
      else { setParseErrors(errors ?? []); setRows(parsed); }
      setStep("preview");
    };
    reader.readAsText(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
  };

  const handleImport = () => {
    onImport(rows);
    setStep("done");
  };

  const handleClose = () => {
    setStep("upload");
    setRows([]);
    setParseErrors([]);
    setFileName("");
    onClose();
  };

  const downloadTemplate = () => {
    const blob = new Blob([CSV_TEMPLATE], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "template_usuarios.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-card border border-border rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="w-4 h-4 text-primary" />
            </div>
            <p className="font-medium text-foreground text-sm">Importar usuários em massa</p>
          </div>
          <button onClick={handleClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* STEP: upload */}
          {step === "upload" && (
            <>
              {/* Download template */}
              <div className="flex items-center justify-between bg-secondary/40 border border-border rounded-xl px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-foreground">Template CSV</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Baixe e preencha com os dados dos colaboradores</p>
                </div>
                <Button variant="outline" size="sm" onClick={downloadTemplate} className="gap-2 shrink-0">
                  <Download className="w-3.5 h-3.5" />
                  Baixar
                </Button>
              </div>

              {/* Drop zone */}
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => inputRef.current?.click()}
                className="border-2 border-dashed border-border hover:border-primary/40 rounded-xl p-10 text-center cursor-pointer transition-colors group"
              >
                <Upload className="w-8 h-8 text-muted-foreground group-hover:text-primary mx-auto mb-3 transition-colors" />
                <p className="text-sm text-foreground font-medium">Arraste o arquivo CSV aqui</p>
                <p className="text-xs text-muted-foreground mt-1">ou clique para selecionar</p>
                <input ref={inputRef} type="file" accept=".csv" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
              </div>

              {/* Columns hint */}
              <p className="text-xs text-muted-foreground text-center">
                Colunas obrigatórias: <span className="font-mono text-foreground">nome, email, cargo, setor, papel</span>
              </p>
            </>
          )}

          {/* STEP: preview */}
          {step === "preview" && (
            <>
              <div className="flex items-center gap-2 text-sm">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground truncate">{fileName}</span>
              </div>

              {/* Errors */}
              {parseErrors.length > 0 && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-3 space-y-1">
                  <p className="text-xs font-medium text-destructive flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" /> {parseErrors.length} linha{parseErrors.length > 1 ? "s" : ""} com erro (serão ignoradas)
                  </p>
                  {parseErrors.map((e, i) => (
                    <p key={i} className="text-xs text-destructive/80 pl-5">{e}</p>
                  ))}
                </div>
              )}

              {/* Preview table */}
              {rows.length > 0 ? (
                <div className="border border-border rounded-xl overflow-hidden">
                  <div className="max-h-52 overflow-y-auto">
                    <table className="w-full text-xs">
                      <thead className="bg-secondary/60 sticky top-0">
                        <tr>
                          {["Nome", "E-mail", "Cargo", "Setor", "Papel"].map((h) => (
                            <th key={h} className="text-left px-3 py-2 text-muted-foreground font-medium">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map((r, i) => (
                          <tr key={i} className="border-t border-border">
                            <td className="px-3 py-2 text-foreground">{r.nome}</td>
                            <td className="px-3 py-2 text-muted-foreground">{r.email}</td>
                            <td className="px-3 py-2 text-muted-foreground">{r.cargo}</td>
                            <td className="px-3 py-2 text-muted-foreground">{r.setor}</td>
                            <td className="px-3 py-2">
                              <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded font-medium">{r.papel}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-sm text-muted-foreground">
                  Nenhuma linha válida encontrada.
                </div>
              )}

              <div className="flex gap-2 pt-1">
                <Button variant="outline" size="sm" onClick={() => setStep("upload")} className="flex-1">
                  Voltar
                </Button>
                <Button size="sm" onClick={handleImport} disabled={rows.length === 0} className="flex-1 gap-2">
                  <Upload className="w-3.5 h-3.5" />
                  Importar {rows.length} usuário{rows.length !== 1 ? "s" : ""}
                </Button>
              </div>
            </>
          )}

          {/* STEP: done */}
          {step === "done" && (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">{rows.length} usuário{rows.length !== 1 ? "s" : ""} importado{rows.length !== 1 ? "s" : ""}!</p>
                <p className="text-muted-foreground text-sm mt-1">Os convites serão enviados por e-mail.</p>
              </div>
              <Button size="sm" onClick={handleClose} className="w-full">Fechar</Button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}