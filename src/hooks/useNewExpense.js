import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CATEGORIAS, createDespesa, listPoliticas, extrairRecibo, uploadComprovante } from "@/api/despesas";
import { analisarDespesa } from "@/api/politica";
import { validarChaveFiscal } from "@/lib/nf-chave";
import { useAuth } from "@/lib/AuthContext";

const today = () => new Date().toISOString().slice(0, 10);

const emptyForm = (profile) => ({
  colaborador: profile?.nome || "",
  centro_custo: "",
  categoria: "Alimentação",
  valor_brl: "",
  data: today(),
  observacao: "",
});

/**
 * Concentra toda a lógica de dados da tela "Nova despesa":
 * carrega as políticas, roda OCR + agente de análise no comprovante, calcula o
 * veredito ao vivo e persiste a despesa. A página só consome o estado/handlers.
 */
export function useNewExpense() {
  const navigate = useNavigate();
  const { empresa, user, profile } = useAuth();
  const queryClient = useQueryClient();

  const { data: politicas = [] } = useQuery({ queryKey: ["politicas"], queryFn: listPoliticas });

  const [form, setForm] = useState(() => emptyForm(profile));
  const [receipt, setReceipt] = useState(null);
  const [preview, setPreview] = useState(null);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [ocr, setOcr] = useState(null);             // resposta do OCR (itens)
  const [conformidade, setConformidade] = useState(null); // veredito do agente de análise
  const [ocrStage, setOcrStage] = useState("");     // "lendo" | "analisando" | ""

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  // Veredito derivado (numérico + restrições da política via IA).
  const polCat = politicas.find((p) => p.categoria === form.categoria);
  const limite = polCat ? (polCat.diario_brl ?? polCat.por_noite_brl ?? polCat.teto_mes_brl) : null;
  const valorNum = Number(form.valor_brl) || 0;
  const acima = limite != null && valorNum > Number(limite);
  const bloqueado = conformidade?.status === "revisar";
  // Selo fiscal (offline) entra no veredito do preview — espelha o createDespesa,
  // pra não mostrar "aprovação automática" e a despesa cair em pendente.
  const seloFiscal = validarChaveFiscal(ocr?.chave_acesso, ocr?.cnpj);
  const nfSuspeita = seloFiscal.selo === "suspeita";
  const motivosIA = [...(conformidade?.motivos || []), ...(nfSuspeita ? ["Comprovante com chave fiscal suspeita/inválida"] : [])];
  const precisaRevisar = acima || bloqueado || nfSuspeita;

  const handleReceipt = async (file) => {
    if (!file) return;
    setError("");
    setConformidade(null);
    setReceipt(file);
    if (file.type.startsWith("image/")) setPreview(URL.createObjectURL(file));
    setOcrLoading(true);
    try {
      // 1) OCR — extrai os campos e itens do comprovante
      setOcrStage("lendo");
      const d = await extrairRecibo(file);
      setOcr(d);
      setForm((f) => ({
        ...f,
        valor_brl: d.valor_brl != null ? String(d.valor_brl) : f.valor_brl,
        data: d.data || f.data,
        categoria: CATEGORIAS.includes(d.categoria) ? d.categoria : f.categoria,
        observacao: [d.descricao, d.fornecedor].filter(Boolean).join(" — ") || f.observacao,
      }));
      // 2) Agente de análise de política — decide aprovar/revisar com raciocínio
      setOcrStage("analisando");
      const verdict = await analisarDespesa({
        despesa: d,
        politicaTexto: empresa?.politica_texto,
        politicas,
      });
      setConformidade(verdict);
    } catch (err) {
      setError(err?.message || "Não consegui ler o comprovante. Preencha manualmente.");
    } finally {
      setOcrLoading(false);
      setOcrStage("");
    }
  };

  const mutation = useMutation({
    mutationFn: async () => {
      let comprovante = null;
      if (receipt) {
        try { comprovante = await uploadComprovante(receipt, empresa.id); } catch (_) { /* segue sem anexo */ }
      }
      return createDespesa({
        empresaId: empresa?.id,
        userId: user?.id,
        colaborador: form.colaborador.trim() || profile?.nome || "Colaborador",
        centro_custo: form.centro_custo.trim(),
        categoria: form.categoria,
        valor_brl: Number(form.valor_brl),
        data: form.data,
        observacao: form.observacao.trim(),
        comprovante,
        // Chave de acesso + CNPJ lidos pelo OCR alimentam o selo de autenticidade fiscal.
        chave: ocr?.chave_acesso,
        cnpj: ocr?.cnpj,
        politicas,
        bloqueado,
        motivos: motivosIA,
      });
    },
    onSuccess: (row) => {
      queryClient.invalidateQueries({ queryKey: ["despesas"] });
      setResult(row);
    },
    onError: (e) => setError(e?.message || "Erro ao salvar despesa"),
  });

  const submit = (e) => {
    e.preventDefault();
    setError("");
    if (!form.valor_brl || valorNum <= 0) return setError("Informe um valor válido.");
    if (!form.data) return setError("Informe a data.");
    mutation.mutate();
  };

  const reset = () => {
    setResult(null);
    setReceipt(null);
    setPreview(null);
    setOcr(null);
    setConformidade(null);
    setError("");
    setForm(emptyForm(profile));
  };

  const clearReceipt = () => {
    setReceipt(null);
    setPreview(null);
  };

  return {
    // estado do formulário
    form, set,
    // comprovante / OCR
    receipt, preview, ocr, ocrLoading, ocrStage,
    handleReceipt, clearReceipt,
    // veredito derivado
    politicas, limite, valorNum, acima, bloqueado, motivosIA, precisaRevisar, conformidade,
    // submit / resultado
    error, result, isSaving: mutation.isPending, submit, reset,
    // navegação
    navigate,
  };
}
