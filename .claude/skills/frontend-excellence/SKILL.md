---
name: frontend-excellence
description: Build frontend UIs with taste — design system rigor, bold visual direction, anti-slop discipline. Use this skill whenever the user is creating, redesigning, or polishing a UI, landing page, dashboard, component, artifact, or any web interface — even when they don't explicitly ask for "design quality" (phrases like "make a landing for X", "redesign this page", "build the dashboard", "componente shadcn", "deixa bonito", "tira cara de IA", "polish this", "redesenha", "tirar slop"). Trigger especially when the work involves choosing colors, typography, spacing, layout direction, or shadcn/Tailwind components. Don't trigger for backend logic, data modeling, or bug fixes unrelated to visual output.
---

# Frontend Excellence

Frontend que "funciona" é o piso. Esta skill é sobre tudo acima disso. O modelo já sabe sintaxe React/CSS — o que falta é taste, hierarquia e disciplina pra subtrair.

Stack-alvo padrão: **Tailwind v4 + shadcn/ui + React**. As regras valem em qualquer stack — os exemplos assumem esta.

## Core (aplicar em TODA tarefa de UI)

1. **Comprometa-se com uma direção antes de codar.** Brutalista, editorial, minimal suíço, dark tech, dim warm, maximalista, retrô-futurista — escolha UMA e execute com convicção. Se você não consegue nomear a direção em 3 palavras, ainda não tem uma. Sem hedge, sem "moderno e limpo" (isso não é direção, é ausência).

2. **Tokens semânticos, nunca cores literais.** `bg-primary`, `text-foreground`, `border-border` — nunca `bg-white`, `bg-zinc-900`, `text-[#0f172a]`, `bg-blue-500` em componentes. Toda cor vive em `src/styles.css` como `oklch`. Detalhes em `references/design-system.md`.

3. **Variants > className overrides.** Se está escrevendo `className="bg-white text-black border-white hover:bg-zinc-100"`, pare. Crie um `variant` no componente via CVA. Detalhes em `references/component-patterns.md`.

4. **Tipografia não-default.** Inter, Poppins, Roboto sozinhos são "AI default". Use só com justificativa. Pareie display + body com intenção, configure `tracking`, `leading` e `font-feature-settings`. Detalhes em `references/typography.md`.

5. **Composição carrega o peso.** Assimetria, espaço negativo generoso OU densidade controlada — escolha UMA postura. "Hero centralizado + grid de 3 cards + footer" é ausência de postura. Detalhes em `references/composition.md`.

6. **Subtraia agressivamente.** Se a direção escolhida não tem, você não adiciona. Sem "Trusted by" automático, sem dois CTAs no hero, sem ícone genérico ao lado de toda heading, sem fade-in em tudo. Lista completa em `references/anti-slop.md`.

7. **Motion serve à visão, não decora.** Um momento de animação bem timed > dez microinterações em tudo. Se removeu toda animação e o design ainda funciona, a animação está fazendo o papel certo. Detalhes em `references/motion.md`.

8. **Imagens reais, nunca cinza placeholder.** Gere imagem com propósito, use screenshot real do produto, ou trate ausência de imagem como decisão (espaço negativo + tipografia heroica). Stock photo de pessoa sorrindo em escritório é slop.

## Workflow ao receber uma tarefa de UI

1. **Declarar direção visual** em 1 frase antes de codar. Ex: "Brutalista editorial: tipo pesada, paleta b/w + acento elétrico, grid quebrado, zero animação decorativa." Sem isso, você vai produzir slop.
2. **Escolher paleta** de `assets/palette-presets.md` (ou justificar uma nova).
3. **Definir tokens** em `src/styles.css` antes do primeiro componente.
4. **Construir começando pelo elemento de maior peso visual** (hero, métrica principal, headline) — não pelo header.
5. **Subtrair** ao final. Olhar o resultado e perguntar: "o que daqui é decoração defensiva?" Cortar.

## Quando aprofundar

| Situação | Leia |
|----------|------|
| Definindo paleta, tokens ou setup de Tailwind v4 | `references/design-system.md` |
| Layout não está "respirando" ou parece template | `references/composition.md` |
| Escolhendo fontes ou ajustando hierarquia tipográfica | `references/typography.md` |
| Adicionando animação ou microinteração | `references/motion.md` |
| Resultado parece genérico, "AI-generated" ou template | `references/anti-slop.md` |
| Componente shadcn precisa variar ou compor diferente | `references/component-patterns.md` |
| Precisa de uma paleta pronta | `assets/palette-presets.md` |

## Self-check antes de declarar pronto

Antes de entregar, responda essas 6 perguntas. Se alguma resposta estiver errada, volte e corrige — "funciona" não é "pronto":

- [ ] Consigo nomear a direção de design em 3 palavras? Se não, é genérico.
- [ ] Tem alguma cor hardcoded em componente (`bg-zinc-900`, `text-[#...]`)? Se sim, mover pra token.
- [ ] Há um duplo CTA "Get started" / "Learn more" que eu não preciso? Cortar um.
- [ ] Cada seção tem ícone + heading + parágrafo? Esse é padrão de slop.
- [ ] A tipografia está fazendo trabalho real, ou só "legível"?
- [ ] Se eu remover todas as animações, o design ainda se sustenta? Deveria.

## Sinais de que algo está errado

- Mais de 2 `className` inline com cores literais → pare, vai pra tokens.
- Hero com dois botões lado a lado ("Get started" + "Learn more") → ler `anti-slop.md`.
- `motion.div` em mais de 30% dos elementos → ler `motion.md`.
- Página inteira é cinza-claro com cards brancos → você não escolheu direção. Volta pro passo 1.
- `rounded-lg` em tudo sem pensar → radius é decisão, não default.

## O que esta skill NÃO faz

- Não escreve lógica de backend, data fetching ou state management complexo.
- Não decide arquitetura de pastas do projeto.
- Não substitui designer para projetos onde a marca precisa ser desenhada do zero (usar como guardrail, não como direção criativa).
