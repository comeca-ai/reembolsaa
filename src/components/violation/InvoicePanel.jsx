import React, { useState } from "react";
import { FileX, ZoomIn, ZoomOut, ExternalLink, Receipt } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { motion } from "framer-motion";

export default function InvoicePanel({ invoice, alert }) {
  const [zoomed, setZoomed] = useState(false);
  const missing = !invoice?.id;

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Receipt className="w-4 h-4 text-primary" />
          <h3 className="font-heading text-foreground text-base">Nota Fiscal</h3>
        </div>
        {!missing && (
          <span className="text-xs font-mono text-muted-foreground">{invoice.id}</span>
        )}
      </div>

      {missing ? (
        /* Missing document state */
        <div className="flex flex-col items-center justify-center py-14 gap-4 text-center px-6">
          <div className="w-14 h-14 rounded-2xl bg-destructive/10 flex items-center justify-center">
            <FileX className="w-6 h-6 text-destructive" />
          </div>
          <div>
            <p className="text-foreground font-medium text-sm">Documento não anexado</p>
            <p className="text-muted-foreground text-xs mt-1 max-w-xs">
              O colaborador não enviou a nota fiscal ou recibo para esta despesa.
              O reembolso está bloqueado até o envio.
            </p>
          </div>
          <div className="bg-destructive/8 border border-destructive/20 rounded-lg px-4 py-3 w-full max-w-xs">
            <p className="text-destructive text-xs font-medium">Ação necessária</p>
            <p className="text-muted-foreground text-xs mt-0.5">
              Notificar {alert.employee} para envio em até 5 dias úteis.
            </p>
          </div>
        </div>
      ) : (
        <div className="p-5 space-y-4">
          {/* Invoice image */}
          <div
            className={`relative rounded-lg overflow-hidden border border-border bg-secondary/30 cursor-pointer transition-all ${zoomed ? "h-96" : "h-48"}`}
            onClick={() => setZoomed((z) => !z)}
          >
            <img
              src={invoice.imageUrl}
              alt="Nota fiscal"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              {zoomed
                ? <ZoomOut className="w-6 h-6 text-white" />
                : <ZoomIn className="w-6 h-6 text-white" />
              }
            </div>
            <div className="absolute top-2 right-2">
              <span className="text-[10px] bg-black/60 text-white px-2 py-0.5 rounded font-mono">
                {zoomed ? "Clique para reduzir" : "Clique para ampliar"}
              </span>
            </div>
          </div>

          {/* Invoice meta */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <p className="text-muted-foreground mb-0.5">Fornecedor</p>
              <p className="text-foreground font-medium">{invoice.issuedBy}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-0.5">Data de emissão</p>
              <p className="text-foreground font-mono">
                {format(new Date(invoice.issuedDate), "dd/MM/yyyy", { locale: ptBR })}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground mb-0.5">Arquivo</p>
              <p className="text-foreground truncate font-mono text-[11px]">{invoice.fileName}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-0.5">Valor total</p>
              <p className="text-foreground font-mono font-semibold">
                R$ {invoice.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          {/* Items */}
          {invoice.items.length > 0 && (
            <div className="border border-border rounded-lg overflow-hidden">
              <div className="grid grid-cols-[1fr_auto_auto] text-[10px] font-medium text-muted-foreground uppercase tracking-wide px-3 py-2 bg-secondary/40 border-b border-border">
                <span>Descrição</span>
                <span className="text-right pr-6">Qtd.</span>
                <span className="text-right">Total</span>
              </div>
              {invoice.items.map((item, i) => (
                <div key={i} className="grid grid-cols-[1fr_auto_auto] text-xs px-3 py-2.5 border-b border-border/50 last:border-0">
                  <span className="text-foreground">{item.desc}</span>
                  <span className="text-muted-foreground text-right pr-6 font-mono">{item.qty}x</span>
                  <span className="text-foreground font-mono">
                    R$ {item.total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}