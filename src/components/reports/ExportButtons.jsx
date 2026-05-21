import React, { useState } from "react";
import { Download, FileText, Table2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

function buildCSV(collaborators, categories, departments) {
  const rows = [
    ["Relatório de Despesas — Reembolsaaí"],
    [],
    ["--- Por Colaborador ---"],
    ["Colaborador", "Departamento", "Total (R$)", "Lançamentos", "Aprovado (R$)", "Pendente (R$)", "Rejeitado (R$)"],
    ...collaborators.map((r) => [r.name, r.department, r.total, r.count, r.approved, r.pending, r.rejected]),
    [],
    ["--- Por Categoria ---"],
    ["Categoria", "Total (R$)", "Lançamentos"],
    ...categories.map((r) => [r.name, r.value, r.count]),
    [],
    ["--- Por Departamento ---"],
    ["Departamento", "Total (R$)", "Aprovado (R$)", "Rejeitado (R$)", "Pendente (R$)"],
    ...departments.map((r) => [r.department, r.total, r.approved, r.rejected, r.pending]),
  ];
  return rows.map((r) => r.join(";")).join("\n");
}

export default function ExportButtons({ collaborators, categories, departments }) {
  const [loadingCsv, setLoadingCsv] = useState(false);
  const [loadingPdf, setLoadingPdf] = useState(false);

  const handleCSV = () => {
    setLoadingCsv(true);
    setTimeout(() => {
      const csv = buildCSV(collaborators, categories, departments);
      const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `relatorio_despesas_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      setLoadingCsv(false);
    }, 600);
  };

  const handlePDF = async () => {
    setLoadingPdf(true);
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

    const primary = [200, 245, 90];
    const dark = [20, 19, 17];
    const muted = [120, 118, 110];
    const borderColor = [40, 38, 32];

    let y = 18;

    // Header
    doc.setFillColor(...dark);
    doc.rect(0, 0, 210, 35, "F");
    doc.setFillColor(...primary);
    doc.roundedRect(12, 10, 14, 14, 3, 3, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...dark);
    doc.text("R$", 19, 19);
    doc.setTextColor(240, 238, 230);
    doc.setFontSize(16);
    doc.text("Reembolsaaí — Relatório de Despesas", 30, 20);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...muted);
    doc.text(`Exportado em ${new Date().toLocaleDateString("pt-BR")}`, 30, 27);

    y = 46;

    // Section: Collaborators
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...dark);
    doc.text("Volume por Colaborador", 14, y);
    y += 6;

    // Table header
    doc.setFillColor(30, 28, 24);
    doc.rect(14, y, 182, 7, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(200, 245, 90);
    doc.text("Colaborador", 16, y + 4.5);
    doc.text("Depto.", 70, y + 4.5);
    doc.text("Total", 110, y + 4.5);
    doc.text("Lançamentos", 136, y + 4.5);
    doc.text("Aprovado", 166, y + 4.5);
    y += 7;

    collaborators.forEach((r, i) => {
      if (i % 2 === 0) {
        doc.setFillColor(26, 24, 20);
        doc.rect(14, y, 182, 7, "F");
      }
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(...dark);
      doc.text(r.name, 16, y + 4.5);
      doc.text(r.department, 70, y + 4.5);
      doc.text(`R$ ${Number(r.total).toLocaleString("pt-BR")}`, 110, y + 4.5);
      doc.text(String(r.count), 142, y + 4.5);
      doc.text(`R$ ${Number(r.approved).toLocaleString("pt-BR")}`, 166, y + 4.5);
      y += 7;
    });

    y += 10;

    // Section: Categories
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...dark);
    doc.text("Volume por Categoria", 14, y);
    y += 6;

    doc.setFillColor(30, 28, 24);
    doc.rect(14, y, 182, 7, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(200, 245, 90);
    doc.text("Categoria", 16, y + 4.5);
    doc.text("Total (R$)", 110, y + 4.5);
    doc.text("Lançamentos", 156, y + 4.5);
    y += 7;

    categories.forEach((r, i) => {
      if (i % 2 === 0) {
        doc.setFillColor(26, 24, 20);
        doc.rect(14, y, 182, 7, "F");
      }
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(...dark);
      doc.text(r.name, 16, y + 4.5);
      doc.text(`R$ ${Number(r.value).toLocaleString("pt-BR")}`, 110, y + 4.5);
      doc.text(String(r.count), 162, y + 4.5);
      y += 7;
    });

    doc.save(`relatorio_despesas_${new Date().toISOString().slice(0, 10)}.pdf`);
    setLoadingPdf(false);
  };

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={handleCSV} disabled={loadingCsv} className="gap-2 text-xs">
        {loadingCsv ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Table2 className="w-3.5 h-3.5" />}
        Exportar CSV
      </Button>
      <Button variant="outline" size="sm" onClick={handlePDF} disabled={loadingPdf} className="gap-2 text-xs">
        {loadingPdf ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileText className="w-3.5 h-3.5" />}
        Exportar PDF
      </Button>
    </div>
  );
}