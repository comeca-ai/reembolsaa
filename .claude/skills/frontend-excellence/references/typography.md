# Tipografia

> Tipografia é a decisão de design de maior alavancagem. Tipo genérico = design genérico, não importa quão bom seja o resto.

## A regra zero

**Inter sozinho não é direção tipográfica.** É o fallback elegante que todos usam. Se for usar Inter, pareie com algo que dê personalidade. Mesmo vale pra Geist, Manrope, DM Sans, Poppins, Roboto — todos viraram default por bons motivos, e por isso mesmo não diferenciam.

## Pareie com intenção — 5 padrões que funcionam

Um par é um **display** (headlines, números heroicos, peças com presença) + um **body** (UI, parágrafos, labels). Os 5 padrões abaixo cobrem 95% dos projetos:

### 1. Serif display + sans body
**Vibe**: editorial, confiável, premium. Carrega herança e gravitas.
**Use pra**: marca de luxo, publicação, jornalismo, advocacy, brand site sério.
**Pares**: Fraunces + Inter Tight · Instrument Serif + Inter · Cormorant + Karla · GT Sectra + IBM Plex Sans · DM Serif Display + Fira Sans

### 2. Geometric/grotesque display + humanist body
**Vibe**: moderno, técnico, confiante. Limpo sem ser frio.
**Use pra**: SaaS produto, dev tool, fintech, dashboard sério.
**Pares**: Space Grotesk + DM Sans · Sora + Manrope · Outfit + Figtree · Söhne + Söhne Buch · Geist + Geist Sans

### 3. Heavy condensed display + neutral body
**Vibe**: jornalístico, ativista, esportivo. Manchete que ataca.
**Use pra**: notícia, manifesto, marca com tom forte.
**Pares**: Archivo Black + Hind · Bebas Neue + Barlow · Anton + Work Sans

### 4. Mono display + sans body
**Vibe**: indie tech, dev-coded, raw, terminal.
**Use pra**: dev tool, produto cripto/security, marca técnica com personalidade.
**Pares**: JetBrains Mono + Work Sans · Space Mono + Rubik · IBM Plex Mono + IBM Plex Sans · Berkeley Mono + Inter

### 5. Uma única sans muito distintiva
**Vibe**: depende totalmente da fonte; sempre minimalista.
**Use pra**: projeto onde a fonte é a marca.
**Funciona com**: Söhne, Neue Haas Grotesk, General Sans, Inter Display. **Não funciona com** Inter / Geist / Manrope — virou commodity.
**Aviso**: 80% dos projetos não conseguem entregar isso bem. Quando dá certo, é potente. Quando não, parece que faltou direção.

**Match domínio ↔ par.** Escritório de advocacia em JetBrains Mono é errado. Dev tool em Cormorant é errado. O par precisa rimar com o que a marca defende.

## Mapeamento por direção da skill

Se você já escolheu uma direção (ver `SKILL.md`):

| Direção | Display | Body | Mono |
|---------|---------|------|------|
| Editorial / premium | Fraunces, Söhne Buch, GT Sectra | Inter Tight, IBM Plex Sans | JetBrains Mono |
| Brutalist / raw | Space Grotesk, Neue Haas Grotesk, IBM Plex Mono *como display* | IBM Plex Sans | IBM Plex Mono |
| Minimal suíço | Neue Haas Grotesk, Inter Display | Inter, Söhne | Berkeley Mono |
| Dark tech | Geist, Söhne | Geist Sans, Inter Tight | Geist Mono, JetBrains Mono |
| Dim warm (Linear-ish) | Inter Display + tracking apertado | Inter | JetBrains Mono |

Default da skill se sem direção definida: **Fraunces (display) + Inter Tight (body) + JetBrains Mono**.

## Escala

Escala modular (1.125, 1.2, 1.25, 1.333, 1.5x). Não use no máximo 5-6 tamanhos por tela. Hero de landing **costuma querer ser grande de verdade** — 72-120px em desktop não é exagero. `text-4xl` no hero quase sempre subentrega.

Sugestão (perfect fourth, 1.333x), em rem:

```
12 — micro (legal text, badges, labels minúsculos)
14 — body small (UI, captions)
16 — body (base — também use 15 se o body for presente)
20 — body large / subhead
28 — h3
40 — h2
64 — h1
96+ — display (hero, números heroicos)
```

Em Tailwind v4, expor via `@theme`:
```css
@theme {
  --text-display: 6rem;
  --text-h1: 4rem;
  --text-h2: 2.5rem;
  --text-h3: 1.75rem;
  --text-body-lg: 1.25rem;
  --text-body: 1rem;
  --text-body-sm: 0.875rem;
  --text-micro: 0.75rem;
}
```

Use `text-display`, `text-h1` etc. Nunca `text-[64px]`.

## Line-height

Inversamente proporcional ao tamanho:

- Display 64px+ → `leading-[0.95]` ou `leading-[1.05]` (apertado)
- H1-H2 → `leading-tight` (`1.25`)
- H3 → `leading-snug` (`1.375`)
- Body → `leading-relaxed` (`1.625`) pra prosa, `leading-normal` (`1.5`) pra UI
- Micro/labels → `leading-tight`

Erro clássico: hero de 64px com `leading-normal`. Fica frouxo, sem peso.

## Tracking

- Display / hero → `tracking-tight` (-0.02em) ou `tracking-tighter` (-0.04em). Tipos grandes parecem mais soltos do que são; apertar compensa.
- Body → `tracking-normal` (0).
- All-caps labels / eyebrow → `tracking-wider` (+0.05em) ou `tracking-widest` (+0.1em). Caixa alta sem espacejar fica empilhada.
- Números tabulares → `tabular-nums` (`font-feature-settings: 'tnum'`). Sem isso, alinhamento quebra.

## Pesos

Geralmente dois pesos bastam: um pesado (700/800) pra ênfase, um regular (400) pra body. Usar 5 pesos diferentes lê como indecisão. Pra botões em sans modernas, `font-medium` (500) costuma bater melhor que `font-semibold` (600).

## Font features (não esquecer)

```css
body {
  font-feature-settings: "ss01", "cv11";  /* depende da fonte */
  font-variant-numeric: tabular-nums;       /* se a UI tem números */
}
```

Em Inter: `cv11` ativa o `a` de um andar (mais elegante). Em Geist: `ss01` ativa o `g` grotesque. Cada fonte boa tem features — leia a spec antes de usar.

## Casos especiais

- **Números heroicos** (métricas de dashboard, preços): display font, `text-6xl+`, `tabular-nums`, `tracking-tighter`. Considere monospace se precisa "bater" alinhado.
- **Código inline**: `font-mono text-[0.9em]` (90% do body em volta) pra não ficar maior que o texto.
- **Eyebrow / pre-headline**: `text-micro tracking-widest uppercase text-muted-foreground`.

## Hierarquia em uma tela (landing)

Regra prática:

- Eyebrow (`text-micro tracking-widest uppercase text-muted-foreground`) — opcional, contexto
- Headline (`text-h1` ou `text-display`, display font, `tracking-tight`, `leading-[1.05]`)
- Sub-headline (`text-body-lg leading-relaxed text-muted-foreground`) — máximo 2 linhas
- Corpo, se houver (`text-body leading-relaxed`)

Nunca 3 níveis de "quase-mesmo-tamanho" disputando atenção. Saltos grandes.

## O teste do "sem cor"

Tira a cor da tela mentalmente. Você ainda consegue dizer onde olhar primeiro? Se sim, a tipografia tá fazendo o trabalho. Se a página colapsa em "parede de texto parecido", tipografia está fraca.
