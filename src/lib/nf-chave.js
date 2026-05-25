// Validação OFFLINE da chave de acesso de NF-e (modelo 55) / NFC-e (modelo 65).
//
// NÃO consulta a SEFAZ. Valida o FORMATO (44 dígitos), o DÍGITO VERIFICADOR
// (módulo 11) e decodifica UF/CNPJ/modelo. Cruza o CNPJ embutido na chave com o
// CNPJ lido do cupom. Isso pega: chave fabricada/digitada errada, cupom adulterado
// e cupom antigo/recibo sem chave (= não verificável).
//
// ⚠️ A MESMA lógica é replicada nas Edge Functions Deno
// (supabase/functions/extrair-despesa e supabase/functions/whatsapp-ingest),
// que não importam de src/lib. Ao mudar aqui, atualize lá também.

export function soDigitos(v) {
  return String(v || "").replace(/\D/g, "");
}

// Estrutura da chave (44 díg): cUF(2) AAMM(4) CNPJ(14) mod(2) serie(3) nNF(9) tpEmis(1) cNF(8) cDV(1).
export function decodificarChave(chaveRaw) {
  const d = soDigitos(chaveRaw);
  if (d.length !== 44) return null;
  return {
    uf: d.slice(0, 2),
    aamm: d.slice(2, 6),
    cnpj: d.slice(6, 20),
    modelo: d.slice(20, 22),
    serie: d.slice(22, 25),
    numero: d.slice(25, 34),
    dv: d.slice(43, 44),
  };
}

// Dígito verificador (módulo 11) sobre os 43 primeiros dígitos. Peso 2..9 cíclico, da direita.
export function dvChaveAcesso(chave43) {
  const d = soDigitos(chave43).slice(0, 43);
  let peso = 2;
  let soma = 0;
  for (let i = d.length - 1; i >= 0; i--) {
    soma += parseInt(d[i], 10) * peso;
    peso = peso === 9 ? 2 : peso + 1;
  }
  const resto = soma % 11;
  return resto <= 1 ? 0 : 11 - resto;
}

export const SELO_LABEL = {
  valida: "Chave fiscal válida",
  nao_verificavel: "Não verificável",
  suspeita: "Suspeita",
};

// Selo de autenticidade a partir da chave + CNPJ lido do cupom.
// Retorna { selo, chave, modelo, motivo }. selo ∈ valida | nao_verificavel | suspeita.
export function validarChaveFiscal(chaveRaw, cnpjCupomRaw) {
  const chave = soDigitos(chaveRaw);
  if (!chave) {
    return { selo: "nao_verificavel", chave: null, modelo: null, motivo: "Sem chave de acesso (cupom antigo ou recibo)." };
  }
  if (chave.length !== 44) {
    return { selo: "suspeita", chave, modelo: null, motivo: "Chave não tem 44 dígitos." };
  }
  const dec = decodificarChave(chave);
  if (String(dvChaveAcesso(chave)) !== dec.dv) {
    return { selo: "suspeita", chave, modelo: dec.modelo, motivo: "Dígito verificador inválido." };
  }
  const cnpjCupom = soDigitos(cnpjCupomRaw);
  if (cnpjCupom.length === 14 && cnpjCupom !== dec.cnpj) {
    return { selo: "suspeita", chave, modelo: dec.modelo, motivo: "CNPJ da chave difere do CNPJ do cupom." };
  }
  return {
    selo: "valida",
    chave,
    modelo: dec.modelo,
    motivo: cnpjCupom.length === 14 ? "Chave válida e CNPJ confere." : "Chave válida (dígito verificador OK).",
  };
}
