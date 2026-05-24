import { describe, it, expect } from 'vitest';
import { normalizarTelefone, telefoneValido, mesmosUltimos11 } from '@/lib/telefone';

describe('normalizarTelefone', () => {
  it('remove parênteses, hífen, espaços e sinal de +', () => {
    expect(normalizarTelefone('+55 (11) 95468-6897')).toBe('5511954686897');
    expect(normalizarTelefone('(11) 95468-6897')).toBe('11954686897');
  });

  it('mantém apenas dígitos quando já vem só com dígitos', () => {
    expect(normalizarTelefone('5511954686897')).toBe('5511954686897');
  });

  it('retorna "" para null, undefined e string vazia', () => {
    expect(normalizarTelefone(null)).toBe('');
    expect(normalizarTelefone(undefined)).toBe('');
    expect(normalizarTelefone('')).toBe('');
  });

  it('retorna "" quando não há nenhum dígito', () => {
    expect(normalizarTelefone('abc')).toBe('');
    expect(normalizarTelefone('()- +')).toBe('');
  });
});

describe('telefoneValido', () => {
  it('13 dígitos (DDI + DDD + celular com 9) é válido', () => {
    expect(telefoneValido('5511954686897')).toBe(true);
  });

  it('12 dígitos (DDI + DDD + número sem o 9) é válido', () => {
    expect(telefoneValido('551195468689')).toBe(true);
  });

  it('11 dígitos (sem DDI) é inválido', () => {
    expect(telefoneValido('11954686897')).toBe(false);
  });

  it('texto sem dígitos é inválido', () => {
    expect(telefoneValido('abc')).toBe(false);
  });

  it('máscara sem DDI normaliza para 11 dígitos e é inválido', () => {
    expect(telefoneValido('(11) 95468-6897')).toBe(false);
  });

  it('null/undefined/"" são inválidos', () => {
    expect(telefoneValido(null)).toBe(false);
    expect(telefoneValido(undefined)).toBe(false);
    expect(telefoneValido('')).toBe(false);
  });
});

describe('mesmosUltimos11', () => {
  it('mesmo número com e sem DDI batem pelos últimos 11', () => {
    expect(mesmosUltimos11('5511954686897', '11954686897')).toBe(true);
  });

  it('números diferentes não batem', () => {
    expect(mesmosUltimos11('5511954686897', '5511999999999')).toBe(false);
  });

  it('máscara vs só dígitos batem quando os últimos 11 coincidem', () => {
    expect(mesmosUltimos11('+55 (11) 95468-6897', '11954686897')).toBe(true);
    expect(mesmosUltimos11('(11) 95468-6897', '5511954686897')).toBe(true);
  });

  it('máscaras de números distintos não batem', () => {
    expect(mesmosUltimos11('(11) 95468-6897', '(11) 90000-0000')).toBe(false);
  });
});
