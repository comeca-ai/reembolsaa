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
