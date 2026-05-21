import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Upload, ImagePlus, Loader2, CheckCircle2, XCircle, AlertTriangle, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";

import ReceiptDropzone from "@/components/expense/ReceiptDropzone";
import ExtractingState from "@/components/expense/ExtractingState";
import ExpenseReviewForm from "@/components/expense/ExpenseReviewForm";
import ComplianceVerdict from "@/components/expense/ComplianceVerdict";

// States: IDLE → EXTRACTING → REVIEW → VERDICT
export default function NewExpensePage() {
  const [stage, setStage] = useState("IDLE");
  const [imageUrl, setImageUrl] = useState(null);
  const [extracted, setExtracted] = useState(null);
  const [verdict, setVerdict] = useState(null);

  const handleImageUploaded = async (file) => {
    setStage("EXTRACTING");

    // Upload the file
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setImageUrl(file_url);

    // AI extraction
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Você é um assistente de reembolso corporativo. Analise esta imagem de comprovante/nota fiscal e extraia os dados estruturados.
      
      Extraia:
      - vendor: nome do estabelecimento/fornecedor
      - date: data no formato YYYY-MM-DD
      - amount: valor total em reais (número, sem símbolo)
      - category: categoria mais provável (Alimentação, Hospedagem, Transporte, Combustível, Material de escritório, Treinamento, Software, Representação, Eventos, Outros)
      - description: breve descrição do que foi comprado
      - items: array de itens se visíveis (cada item: name, value)
      
      Se algum campo não estiver legível, retorne null para ele.`,
      file_urls: [file_url],
      response_json_schema: {
        type: "object",
        properties: {
          vendor: { type: "string" },
          date: { type: "string" },
          amount: { type: "number" },
          category: { type: "string" },
          description: { type: "string" },
          items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                value: { type: "number" }
              }
            }
          }
        }
      }
    });

    setExtracted(result);
    setStage("REVIEW");
  };

  const handleSubmit = async (formData) => {
    setStage("VERDICT");

    // AI compliance check against policy rules
    const check = await base44.integrations.Core.InvokeLLM({
      prompt: `Você é um auditor de compliance de reembolsos corporativos. Avalie se esta despesa está em conformidade com a política da empresa.

Despesa submetida:
- Categoria: ${formData.category}
- Valor: R$ ${formData.amount}
- Fornecedor: ${formData.vendor}
- Data: ${formData.date}
- Descrição: ${formData.description}

Regras da política vigente:
- Alimentação: R$ 80/refeição, dias úteis, nota fiscal obrigatória
- Hospedagem: R$ 450/diária, capitais, pré-aprovação acima de 3 diárias
- Transporte: R$ 200/dia, app ou táxi, trajeto justificado
- Combustível: R$ 1,20/km, veículo próprio, rota validada
- Material de escritório: sem teto, nota fiscal obrigatória
- Treinamento: sem teto, aprovação do gestor acima de R$ 2.000
- Software: sem teto, aprovação de TI obrigatória
- Representação: R$ 300/evento, lista de convidados obrigatória
- Outros: requer justificativa detalhada

Retorne sua avaliação.`,
      response_json_schema: {
        type: "object",
        properties: {
          status: { type: "string", enum: ["approved", "review", "rejected"] },
          score: { type: "number" },
          reason: { type: "string" },
          flags: { type: "array", items: { type: "string" } },
          suggestions: { type: "array", items: { type: "string" } }
        }
      }
    });

    setVerdict({ ...check, formData, imageUrl });
  };

  const handleReset = () => {
    setStage("IDLE");
    setImageUrl(null);
    setExtracted(null);
    setVerdict(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-8 md:py-12 space-y-7">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-heading text-foreground text-2xl md:text-3xl">Lançar despesa</h1>
              <p className="text-muted-foreground text-sm mt-1">Suba o comprovante — a IA extrai os dados automaticamente.</p>
            </div>
            {stage !== "IDLE" && (
              <Button variant="ghost" size="sm" onClick={handleReset} className="text-muted-foreground gap-2">
                <RefreshCw className="w-4 h-4" />
                Novo lançamento
              </Button>
            )}
          </div>
        </motion.div>

        {/* Step indicator */}
        <StepIndicator stage={stage} />

        {/* Content */}
        <AnimatePresence mode="wait">
          {stage === "IDLE" && (
            <motion.div key="idle" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
              <ReceiptDropzone onImageUploaded={handleImageUploaded} />
            </motion.div>
          )}

          {stage === "EXTRACTING" && (
            <motion.div key="extracting" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
              <ExtractingState />
            </motion.div>
          )}

          {stage === "REVIEW" && (
            <motion.div key="review" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
              <ExpenseReviewForm
                extracted={extracted}
                imageUrl={imageUrl}
                onSubmit={handleSubmit}
                onBack={handleReset}
              />
            </motion.div>
          )}

          {stage === "VERDICT" && verdict && (
            <motion.div key="verdict" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
              <ComplianceVerdict verdict={verdict} onNew={handleReset} />
            </motion.div>
          )}

          {stage === "VERDICT" && !verdict && (
            <motion.div key="checking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-4 py-20">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <p className="text-muted-foreground text-sm">Verificando compliance…</p>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

function StepIndicator({ stage }) {
  const steps = [
    { key: "IDLE",       label: "Comprovante" },
    { key: "EXTRACTING", label: "Extração IA" },
    { key: "REVIEW",     label: "Revisão" },
    { key: "VERDICT",    label: "Veredito" },
  ];
  const current = steps.findIndex(s => s.key === stage);

  return (
    <div className="flex items-center gap-0">
      {steps.map((step, i) => (
        <React.Fragment key={step.key}>
          <div className="flex flex-col items-center gap-1">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-semibold transition-all ${
              i < current ? "bg-primary text-primary-foreground" :
              i === current ? "bg-primary/20 text-primary border border-primary" :
              "bg-secondary text-muted-foreground"
            }`}>
              {i < current ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
            </div>
            <span className={`text-[10px] ${i === current ? "text-primary" : "text-muted-foreground"}`}>{step.label}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={`flex-1 h-px mx-1 mb-4 ${i < current ? "bg-primary/40" : "bg-border"}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}