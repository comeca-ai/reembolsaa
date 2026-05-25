import { describe, it, expect } from "vitest";
import { decodificarChave, dvChaveAcesso, validarChaveFiscal } from "./nf-chave";

// Monta uma chave de 44 díg válida: 43 díg + dígito verificador calculado.
const CNPJ = "04914390000166";
const chave43 = "42" + "2408" + CNPJ + "65" + "001" + "000050294" + "1" + "12345678";
const dv = dvChaveAcesso(chave43);
const chaveOk = chave43 + String(dv);

describe("nf-chave", () => {
  it("monta uma base de 43 dígitos", () => {
    expect(chave43).toHaveLength(43);
    expect(chaveOk).toHaveLength(44);
  });

  it("decodifica os campos embutidos", () => {
    const d = decodificarChave(chaveOk);
    expect(d.cnpj).toBe(CNPJ);
    expect(d.modelo).toBe("65");
    expect(d.uf).toBe("42");
  });

  it("o dígito verificador é determinístico e estável", () => {
    expect(String(dvChaveAcesso(chaveOk))).toBe(chaveOk.slice(43, 44));
  });

  it("chave válida + CNPJ do cupom confere → valida", () => {
    const r = validarChaveFiscal(chaveOk, "04.914.390/0001-66");
    expect(r.selo).toBe("valida");
    expect(r.modelo).toBe("65");
  });

  it("chave válida sem CNPJ pra comparar → valida (DV ok)", () => {
    expect(validarChaveFiscal(chaveOk, null).selo).toBe("valida");
  });

  it("CNPJ do cupom diferente do da chave → suspeita", () => {
    expect(validarChaveFiscal(chaveOk, "11.111.111/1111-11").selo).toBe("suspeita");
  });

  it("dígito verificador errado → suspeita", () => {
    const dvErrado = String((dv + 1) % 10);
    expect(validarChaveFiscal(chave43 + dvErrado, "04914390000166").selo).toBe("suspeita");
  });

  it("sem chave → nao_verificavel", () => {
    expect(validarChaveFiscal("", "04914390000166").selo).toBe("nao_verificavel");
    expect(validarChaveFiscal(null, null).selo).toBe("nao_verificavel");
  });

  it("chave com tamanho errado → suspeita", () => {
    expect(validarChaveFiscal("123456", null).selo).toBe("suspeita");
  });

  it("aceita chave com máscara/espaços (só dígitos contam)", () => {
    const comEspacos = chaveOk.replace(/(.{4})/g, "$1 ");
    expect(validarChaveFiscal(comEspacos, "04914390000166").selo).toBe("valida");
  });
});
