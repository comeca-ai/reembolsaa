---
name: politica-validacao
description: Como o Reembolsaaí valida, no upload de uma política de reembolso (PDF), se o documento é mesmo uma política de despesas E se pertence àquela empresa (nome/CNPJ). Use ao mexer na extração de política, no aviso de divergência da tela de revisão, ou para estender as regras de match documento↔empresa.
---

# Validação de política ↔ empresa

Garante que o PDF subido seja **mesmo uma política de reembolso** e que seja **daquela empresa** — antes de virar regra de classificação. Sem isso, um PDF errado (contrato, nota, política de outra empresa) contamina toda a aprovação de despesas do tenant.

Comportamento adotado: **avisar e deixar confirmar** (NÃO bloquear). Políticas reais às vezes não trazem CNPJ e nomes variam; bloquear geraria falso positivo travando upload legítimo. O usuário é dono do dado — ele confirma.

## Onde a lógica vive (camadas)
1. **Edge Function** `supabase/functions/extrair-politica/index.ts` (Deno; deployada no Supabase, `verify_jwt: true`). É aqui que a validação roda — o texto completo do PDF (OCR) só existe dentro da função; o que volta pro client é só o resumo.
2. **API client** `src/api/politica.js` → `extrairPolitica(file, empresa)` envia `{ fileBase64, filename, empresa: { nome, cnpj } }` e devolve também `validacao`.
3. **Telas de upload**: `src/pages/PolicyOnboardingPage.jsx` e `src/pages/PolicyPage.jsx` passam `empresa` (do `useAuth`, que já traz `nome` e `cnpj`) e levam `validacao` adiante.
4. **Aviso na revisão**: `src/components/policy/ExtractedRulesModal.jsx` renderiza `validacao.avisos` num banner âmbar; salvar continua habilitado.

## Contrato `validacao` (retorno da função)
```ts
validacao: {
  is_politica_reembolso: boolean,   // é mesmo política de despesas?
  confianca: number,                 // 0..1 (auto-avaliação do LLM)
  empresa_detectada: { nome: string|null, cnpj: string|null }, // o que apareceu no doc
  empresa_match: 'match' | 'mismatch' | 'desconhecida',
  avisos: string[]                   // mensagens pt-BR prontas pra UI
}
```

## Regras de decisão (na função)
- **É política?** combina veredito do LLM com **marcadores concretos** — não confia só no "sim" do modelo (ele super-confirma). Verdadeiro se `(is_pol && confianca>=0.5)` OU há ≥1 valor BRL nas regras OU (há regras E o texto cita reembolso/despesa/diária/limite).
- **Match de empresa:**
  - **CNPJ é autoritativo** quando os dois lados têm 14 dígitos (compare só dígitos — ver [[telefone-br]] para a mesma filosofia de normalização).
  - Sem CNPJ nos dois lados → cai pro **nome**: `normalizarNome` (minúsculo, sem acento, sem sufixo societário Ltda/SA/ME/EPP/EIRELI…, sem pontuação) e `nomesBatem` (substring OU token significativo ≥4 chars compartilhado). "Datarisk" casa "DATARISK TECNOLOGIA LTDA".
  - Não detectou empresa no doc → `desconhecida` (silencioso, sem aviso).
- **CNPJ ausente no cadastro** vira um aviso suave ("Cadastre o CNPJ…"), nunca `mismatch`.

## Ao estender
- Mudou o formato de `validacao`? Atualize os 4 pontos acima juntos (função → client → telas → modal) e **redeploy a função** (`deploy_edge_function`, mantendo `verify_jwt: true`) + redeploy do front.
- A fonte da função **mora no repo** agora (`supabase/functions/extrair-politica/`). Mantenha-a sincronizada com o que está deployado — não edite só no Supabase (problema de "função fantasma" que já existiu aqui).
- Campos para casar empresa estão em `public.empresa`: `nome`, `cnpj`. O `AuthContext` precisa selecioná-los (já seleciona).

## DoD
- `npm run build`, `npm run lint`, `npm test` verdes.
- Subir um PDF que não é política → banner de aviso (e onboarding não conclui no caso sem regras).
- Subir política de outra empresa (nome/CNPJ diferente) → banner de `mismatch`, mas salvar permitido.
- Subir política correta → sem aviso; fluxo normal de revisão/salvar.
- Função redeployada com `verify_jwt: true`; front redeployado.
```
