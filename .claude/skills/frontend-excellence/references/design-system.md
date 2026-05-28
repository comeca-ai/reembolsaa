# Design System

> Tokens semânticos em CSS, consumidos via Tailwind. Cor literal em `className` é code smell. O design system não é paperwork — é a única fonte de verdade que torna a UI consistente e o código refatorável.

## A regra inegociável

**Componentes nunca contêm cor, gradiente, sombra ou radius literal.** Eles referenciam tokens semânticos. Se o token que você precisa não existe, **adicione ao sistema primeiro**, depois use.

```tsx
// ❌ Errado
<button className="bg-[#0f172a] text-white hover:bg-[#1e293b] shadow-lg">

// ❌ Errado (cor de Tailwind é literal também)
<button className="bg-slate-900 text-white hover:bg-slate-800">

// ✅ Certo — token-driven, themeable, refatorável
<Button variant="hero">
```

## As 3 camadas de tokens

Tokens organizam por nível de abstração. Componentes consomem **só** a camada 2.

### 1. Primitivos (raros, internos)

Valores brutos em oklch. **Nunca usados diretamente em componentes.** Existem apenas como base para semânticos quando você precisa referenciar a mesma cor em múltiplos tokens.

```css
--brand-900: oklch(0.18 0.04 265);
--brand-500: oklch(0.55 0.22 264);
```

### 2. Semânticos (o que o componente consome)

Descrevem o **papel** da cor, não sua aparência. Esses são os únicos que aparecem em `className`.

```css
--background    --foreground
--card          --card-foreground
--primary       --primary-foreground
--secondary     --secondary-foreground
--muted         --muted-foreground
--accent        --accent-foreground
--destructive   --destructive-foreground
--border        --input        --ring
--popover       --popover-foreground
```

### 3. Composite tokens (derivados)

Gradientes, sombras e transições construídos a partir dos semânticos. Permitem trocar um detalhe da personalidade visual em um lugar só.

```css
--gradient-hero: linear-gradient(135deg, var(--primary), var(--accent));
--gradient-subtle: linear-gradient(180deg, transparent, var(--muted));

--shadow-elegant: 0 20px 50px -20px oklch(from var(--primary) l c h / 0.35);
--shadow-sharp: 6px 6px 0 0 var(--foreground);              /* brutalist */
--shadow-soft: 0 8px 30px -10px oklch(0 0 0 / 0.15);        /* editorial */

--transition-smooth: 200ms cubic-bezier(0.22, 1, 0.36, 1);
--transition-snap: 100ms cubic-bezier(0.4, 0, 0.2, 1);
```

Por que ter essa camada explícita: trocar a "personalidade visual" do projeto entre brutalista e suave fica em UM lugar só. Componente que usa `var(--shadow-elegant)` não muda quando a sombra muda.

## Setup Tailwind v4 + shadcn

`src/styles.css`:

```css
@import "tailwindcss";

@theme {
  --font-display: "Fraunces", serif;
  --font-sans: "Inter Tight", system-ui, sans-serif;
  --font-mono: "JetBrains Mono", monospace;

  --radius: 0.5rem;
}

:root {
  /* Semânticos — sempre oklch */
  --background: oklch(0.99 0 0);
  --foreground: oklch(0.15 0 0);

  --card: oklch(0.99 0 0);
  --card-foreground: oklch(0.15 0 0);

  --primary: oklch(0.55 0.22 264);
  --primary-foreground: oklch(0.99 0 0);

  --secondary: oklch(0.96 0 0);
  --secondary-foreground: oklch(0.2 0 0);

  --muted: oklch(0.96 0 0);
  --muted-foreground: oklch(0.5 0 0);

  --accent: oklch(0.94 0 0);
  --accent-foreground: oklch(0.2 0 0);

  --destructive: oklch(0.6 0.2 25);
  --destructive-foreground: oklch(0.99 0 0);

  --border: oklch(0.92 0 0);
  --input: oklch(0.92 0 0);
  --ring: oklch(0.55 0.22 264);

  /* Composites */
  --gradient-hero: linear-gradient(135deg, var(--primary), var(--accent));
  --shadow-elegant: 0 20px 50px -20px oklch(from var(--primary) l c h / 0.35);
  --transition-smooth: 200ms cubic-bezier(0.22, 1, 0.36, 1);
}

.dark {
  --background: oklch(0.12 0.005 240);
  --foreground: oklch(0.96 0 0);
  /* ... resto do tema dark */
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
}
```

Com isso, `bg-primary`, `text-muted-foreground`, `border-border` funcionam nativamente. shadcn instala em cima sem fricção.

## Por que oklch e não HSL/HEX

- **Lightness perceptualmente uniforme**: `oklch(0.6 ...)` parece igualmente claro independente do hue. Em HSL, amarelo a 50% parece muito mais claro que azul a 50%.
- **Gradientes limpos**: interpolar em oklch evita aquele cinza esquisito no meio do gradiente.
- **Controle de saturação previsível**: chroma é um eixo separado, não acoplado a lightness.
- **`oklch(from var(--x) l c h / 0.35)`**: criar variações de um token semântico fica trivial.

Regra dura: nunca HEX em token semântico. Converter na hora de definir (oklch.com serve).

## Regras duras

- **Zero `bg-zinc-900` / `text-gray-500` em componentes.** Se aparecer, é refactor.
- **Hover/focus também via token**: `hover:bg-primary/90`, não `hover:bg-blue-600`.
- **Opacidade via slash**: `bg-primary/10` em vez de criar 8 tokens "primary fadeado".
- **Dark mode é decisão de tokens, não de `className`**: nunca `dark:bg-zinc-900` espalhado. O token muda, o componente continua igual.

## Spacing e radius

Tailwind já tem escala boa (`p-4`, `p-6`, `p-8`...). NÃO crie tokens de spacing customizados a menos que o projeto exija ritmo específico (8pt grid, baseline grid editorial).

Radius via `--radius` no `:root`. Trocar a "personalidade" do projeto entre brutalista (`--radius: 0`) e suave (`--radius: 1rem`) deve ser uma variável só.

## Dark mode

Todo token semântico tem versão light E dark. Teste ambos antes de entregar. Contraste WCAG AA em ambos. **Não entregue dark mode que é só "light invertido"** — superfícies, sombras e saturação do acento geralmente precisam de tratamento diferente. Saturação alta no dark vibra demais; reduzir chroma é regra.

## Adicionando ao sistema, não em volta dele

Quando precisar de um tratamento novo:

1. **Nomeie semanticamente**: `--surface-elevated`, não `--gray-2`.
2. **Adicione o token** no arquivo de sistema.
3. **Registre** no `@theme inline` se for cor consumida por Tailwind.
4. **Use via class ou variant** — nunca inline.

Se você está prestes a escrever `bg-[#...]`, o sistema está faltando um token. Adicione o token em vez de escapar do sistema.

## O teste do "tema diferente"

Um componente bem feito sobrevive a uma troca completa de tokens (marca diferente) sem mudança de código. Se ele quebra quando você troca cores, está vazando valor literal em algum lugar.
