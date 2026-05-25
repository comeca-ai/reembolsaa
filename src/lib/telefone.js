// Helpers de telefone — PUROS, sem dependências (testáveis).
// Convenção: telefone é guardado/comparado como SÓ DÍGITOS.
// Celular BR no padrão internacional tem ~13 dígitos: DDI(55) + DDD(2) + número(9).

// Remove tudo que não for dígito. Aceita null/undefined (vira string vazia).
export function normalizarTelefone(v) {
  return String(v || "").replace(/\D/g, "");
}

// Considera válido quando, normalizado, tem 12–13 dígitos (DDI + DDD + número;
// 12 = fixo/celular sem o 9, 13 = celular com o 9).
export function telefoneValido(v) {
  const d = normalizarTelefone(v);
  return d.length >= 12 && d.length <= 13;
}

// Compara dois telefones pelos últimos 11 dígitos (DDD + número), tolerando a
// ausência ou diferença de DDI entre eles.
export function mesmosUltimos11(a, b) {
  return normalizarTelefone(a).slice(-11) === normalizarTelefone(b).slice(-11);
}

// Garante o DDI 55 quando o usuário digita só DDD + número (10–11 dígitos, jeito
// que o brasileiro escreve). Já tendo DDI, ou fora desse padrão, devolve como está.
// Use na ESCRITA (UI) para gravar sempre no padrão com DDI: 55 + DDD + número.
export function garantirDDI(v) {
  const d = normalizarTelefone(v);
  if (d.length === 10 || d.length === 11) return `55${d}`;
  return d;
}

// `true` quando o erro do Supabase é violação do índice único de telefone
// (mesmo número em outra conta — 1 WhatsApp roteia p/ 1 empresa só).
export function isTelefoneDuplicado(error) {
  return error?.code === "23505" || /uq_profiles_telefone_ult11/.test(error?.message || "");
}

// Traduz erros de salvamento de telefone em mensagem amigável (nunca expõe erro
// cru do Postgres ao usuário).
export function mensagemErroTelefone(error, fallback = "Não foi possível salvar seu WhatsApp.") {
  if (!error) return null;
  if (isTelefoneDuplicado(error)) {
    return "Este WhatsApp já está vinculado a outra conta. Use outro número ou fale com o suporte.";
  }
  return error.message || fallback;
}

// Escape do gate de WhatsApp: quando o usuário NÃO consegue salvar o número
// (já em uso em outra conta), ele pode entrar mesmo assim — marcamos só para a
// sessão atual, para não trancá-lo fora do app.
export const PHONE_GATE_SKIP_KEY = "reembolsaa-skip-phone-gate";
export function phoneGateSkipped() {
  try { return sessionStorage.getItem(PHONE_GATE_SKIP_KEY) === "1"; } catch { return false; }
}
export function skipPhoneGate() {
  try { sessionStorage.setItem(PHONE_GATE_SKIP_KEY, "1"); } catch { /* sessão indisponível — ok */ }
}
