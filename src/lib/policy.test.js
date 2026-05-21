import { describe, it, expect } from 'vitest';
import { CATEGORIAS, limiteCategoria, avaliarLimite } from '@/lib/policy';

describe('CATEGORIAS', () => {
  it('tem as 5 categorias válidas do schema', () => {
    expect(CATEGORIAS).toEqual(['Alimentação', 'Transporte', 'Hospedagem', 'KM', 'Outros']);
  });
});

describe('limiteCategoria', () => {
  it('retorna null quando não há política', () => {
    expect(limiteCategoria(null)).toBeNull();
    expect(limiteCategoria(undefined)).toBeNull();
  });
  it('prioriza diário > por noite > teto mensal', () => {
    expect(limiteCategoria({ diario_brl: 80, por_noite_brl: 300, teto_mes_brl: 1500 })).toBe(80);
    expect(limiteCategoria({ por_noite_brl: 300, teto_mes_brl: 5000 })).toBe(300);
    expect(limiteCategoria({ teto_mes_brl: 1000 })).toBe(1000);
  });
  it('retorna null quando a política não tem limites', () => {
    expect(limiteCategoria({ diario_brl: null, por_noite_brl: null, teto_mes_brl: null })).toBeNull();
  });
});

describe('avaliarLimite', () => {
  const politicas = [
    { categoria: 'Alimentação', diario_brl: 80, teto_mes_brl: 1500 },
    { categoria: 'Hospedagem', por_noite_brl: 300 },
    { categoria: 'Outros', diario_brl: null, por_noite_brl: null, teto_mes_brl: null },
  ];

  it('dentro do limite -> acima=false, excesso=null', () => {
    expect(avaliarLimite({ categoria: 'Alimentação', valor_brl: 50, politicas }))
      .toEqual({ limite: 80, acima: false, excesso: null });
  });

  it('acima do limite -> acima=true, excesso correto (arredondado)', () => {
    expect(avaliarLimite({ categoria: 'Alimentação', valor_brl: 156, politicas }))
      .toEqual({ limite: 80, acima: true, excesso: 76 });
    expect(avaliarLimite({ categoria: 'Hospedagem', valor_brl: 350.5, politicas }))
      .toEqual({ limite: 300, acima: true, excesso: 50.5 });
  });

  it('exatamente no limite NÃO é considerado acima (estrito)', () => {
    expect(avaliarLimite({ categoria: 'Alimentação', valor_brl: 80, politicas }).acima).toBe(false);
  });

  it('categoria sem política -> limite null, nunca acima', () => {
    expect(avaliarLimite({ categoria: 'Transporte', valor_brl: 9999, politicas }))
      .toEqual({ limite: null, acima: false, excesso: null });
    expect(avaliarLimite({ categoria: 'Outros', valor_brl: 9999, politicas }))
      .toEqual({ limite: null, acima: false, excesso: null });
  });

  it('valor inválido não quebra nem marca acima', () => {
    expect(avaliarLimite({ categoria: 'Alimentação', valor_brl: 'abc', politicas }).acima).toBe(false);
    expect(avaliarLimite({ categoria: 'Alimentação', valor_brl: null, politicas }).acima).toBe(false);
  });

  it('lida com politicas vazias/ausentes', () => {
    expect(avaliarLimite({ categoria: 'Alimentação', valor_brl: 50 }))
      .toEqual({ limite: null, acima: false, excesso: null });
    expect(avaliarLimite({ categoria: 'Alimentação', valor_brl: 50, politicas: [] }).acima).toBe(false);
  });
});
