# Palette Presets

> 15 paletas curadas, organizadas por mood/domínio. **Todas em `oklch`**, prontas pra colar em `src/styles.css`. Não misture cores de paletas diferentes — cada uma é tunada pra funcionar junto.

Pra cada paleta: copie o bloco `:root` (e `.dark` quando existir). Pareamento tipográfico sugerido no final de cada uma.

---

## Dark & sofisticada

### 1. Midnight Indigo — tech, SaaS premium

```css
:root {
  --background: oklch(0.13 0.025 270);
  --foreground: oklch(0.96 0.005 270);

  --card: oklch(0.17 0.025 270);
  --card-foreground: oklch(0.96 0.005 270);

  --primary: oklch(0.58 0.21 268);            /* indigo saturado */
  --primary-foreground: oklch(0.99 0 0);

  --secondary: oklch(0.22 0.025 270);
  --secondary-foreground: oklch(0.96 0.005 270);

  --muted: oklch(0.22 0.025 270);
  --muted-foreground: oklch(0.65 0.015 270);

  --accent: oklch(0.32 0.07 270);
  --accent-foreground: oklch(0.96 0.005 270);

  --destructive: oklch(0.6 0.22 25);
  --destructive-foreground: oklch(0.99 0 0);

  --border: oklch(0.25 0.025 270);
  --input: oklch(0.25 0.025 270);
  --ring: oklch(0.58 0.21 268);

  --radius: 0.5rem;
}
```
**Tipografia**: Geist display + Geist Sans body + Geist Mono.

### 2. Charcoal & Ember — bold, design-forward

```css
:root {
  --background: oklch(0.18 0.003 60);
  --foreground: oklch(0.96 0.005 60);

  --card: oklch(0.22 0.003 60);
  --card-foreground: oklch(0.96 0.005 60);

  --primary: oklch(0.65 0.18 35);             /* ember / laranja-tijolo */
  --primary-foreground: oklch(0.15 0.003 60);

  --secondary: oklch(0.27 0.003 60);
  --secondary-foreground: oklch(0.96 0.005 60);

  --muted: oklch(0.27 0.003 60);
  --muted-foreground: oklch(0.65 0.005 60);

  --accent: oklch(0.32 0.04 35);
  --accent-foreground: oklch(0.96 0.005 60);

  --destructive: oklch(0.6 0.22 25);
  --destructive-foreground: oklch(0.99 0 0);

  --border: oklch(0.3 0.003 60);
  --input: oklch(0.3 0.003 60);
  --ring: oklch(0.65 0.18 35);

  --radius: 0.5rem;
}
```
**Tipografia**: Space Grotesk display + Inter Tight body.

### 3. Noir & Gold — luxury, editorial

```css
:root {
  --background: oklch(0.1 0.003 80);
  --foreground: oklch(0.95 0.008 80);

  --card: oklch(0.14 0.003 80);
  --card-foreground: oklch(0.95 0.008 80);

  --primary: oklch(0.78 0.13 85);             /* dourado quente */
  --primary-foreground: oklch(0.1 0.003 80);

  --secondary: oklch(0.2 0.003 80);
  --secondary-foreground: oklch(0.95 0.008 80);

  --muted: oklch(0.2 0.003 80);
  --muted-foreground: oklch(0.65 0.01 80);

  --accent: oklch(0.32 0.05 80);
  --accent-foreground: oklch(0.95 0.008 80);

  --destructive: oklch(0.58 0.22 25);
  --destructive-foreground: oklch(0.99 0 0);

  --border: oklch(0.22 0.003 80);
  --input: oklch(0.22 0.003 80);
  --ring: oklch(0.78 0.13 85);

  --radius: 0.25rem;                          /* radius sutil pra dar elegância */
}
```
**Tipografia**: Fraunces display + Inter Tight body. Considere `tracking-wider` em labels.

### 4. Dark Tech — `#0E0E0D` + lime `#C8F55A`

Personalidade: SaaS moderno opinativo, dev tool com cara. Identidade do `saas-starter`.

```css
:root {
  --background: oklch(0.16 0.005 100);        /* #0E0E0D quase */
  --foreground: oklch(0.96 0.005 100);

  --card: oklch(0.2 0.005 100);
  --card-foreground: oklch(0.96 0.005 100);

  --primary: oklch(0.92 0.21 122);            /* lime #C8F55A */
  --primary-foreground: oklch(0.16 0.005 100);

  --secondary: oklch(0.24 0.005 100);
  --secondary-foreground: oklch(0.96 0.005 100);

  --muted: oklch(0.24 0.005 100);
  --muted-foreground: oklch(0.65 0.005 100);

  --accent: oklch(0.28 0.005 100);
  --accent-foreground: oklch(0.96 0.005 100);

  --destructive: oklch(0.62 0.24 25);
  --destructive-foreground: oklch(0.96 0.005 100);

  --border: oklch(0.26 0.005 100);
  --input: oklch(0.26 0.005 100);
  --ring: oklch(0.92 0.21 122);

  --radius: 0.5rem;
}
```
**Tipografia**: Fraunces display + IBM Plex Sans body + JetBrains Mono.

### 5. Dim Warm — Linear-ish

Personalidade: dark refinado, baixa saturação, ferramenta séria pra usar 8h/dia.

```css
:root {
  --background: oklch(0.21 0.013 264);
  --foreground: oklch(0.92 0.005 264);

  --card: oklch(0.24 0.013 264);
  --card-foreground: oklch(0.92 0.005 264);

  --primary: oklch(0.74 0.13 264);            /* indigo dessaturado */
  --primary-foreground: oklch(0.21 0.013 264);

  --secondary: oklch(0.27 0.013 264);
  --secondary-foreground: oklch(0.92 0.005 264);

  --muted: oklch(0.27 0.013 264);
  --muted-foreground: oklch(0.62 0.008 264);

  --accent: oklch(0.3 0.013 264);
  --accent-foreground: oklch(0.92 0.005 264);

  --destructive: oklch(0.6 0.18 20);
  --destructive-foreground: oklch(0.92 0.005 264);

  --border: oklch(0.29 0.013 264);
  --input: oklch(0.29 0.013 264);
  --ring: oklch(0.74 0.13 264);

  --radius: 0.5rem;
}
```
**Tipografia**: Inter Display + Inter + JetBrains Mono. `tracking-tight` em headlines.

---

## Light & clean

### 6. Paper & Ink — Swiss, editorial

```css
:root {
  --background: oklch(0.96 0.008 80);         /* off-white levemente bege */
  --foreground: oklch(0.13 0.005 60);

  --card: oklch(0.99 0.005 80);
  --card-foreground: oklch(0.13 0.005 60);

  --primary: oklch(0.13 0.005 60);            /* tinta preta como acento principal */
  --primary-foreground: oklch(0.96 0.008 80);

  --secondary: oklch(0.92 0.012 80);
  --secondary-foreground: oklch(0.13 0.005 60);

  --muted: oklch(0.92 0.012 80);
  --muted-foreground: oklch(0.5 0.01 60);

  --accent: oklch(0.85 0.012 80);
  --accent-foreground: oklch(0.13 0.005 60);

  --destructive: oklch(0.5 0.2 25);
  --destructive-foreground: oklch(0.96 0.008 80);

  --border: oklch(0.86 0.015 80);
  --input: oklch(0.86 0.015 80);
  --ring: oklch(0.13 0.005 60);

  --radius: 0;                                /* zero radius — máxima editorial */
}
```
**Tipografia**: Fraunces display + Inter Tight body. Funciona muito bem com `rounded-none`.

### 7. Cloud White — airy SaaS

```css
:root {
  --background: oklch(0.99 0 0);
  --foreground: oklch(0.15 0.02 265);

  --card: oklch(1 0 0);
  --card-foreground: oklch(0.15 0.02 265);

  --primary: oklch(0.55 0.22 264);            /* azul saturado */
  --primary-foreground: oklch(0.99 0 0);

  --secondary: oklch(0.96 0.005 265);
  --secondary-foreground: oklch(0.15 0.02 265);

  --muted: oklch(0.96 0.005 265);
  --muted-foreground: oklch(0.5 0.01 265);

  --accent: oklch(0.94 0.008 265);
  --accent-foreground: oklch(0.15 0.02 265);

  --destructive: oklch(0.58 0.24 25);
  --destructive-foreground: oklch(0.99 0 0);

  --border: oklch(0.92 0.005 265);
  --input: oklch(0.92 0.005 265);
  --ring: oklch(0.55 0.22 264);

  --radius: 0.5rem;
}
```
**Tipografia**: Inter Display + Inter + JetBrains Mono.

### 8. Warm Sand — welcoming, approachable

```css
:root {
  --background: oklch(0.97 0.015 75);
  --foreground: oklch(0.25 0.025 55);

  --card: oklch(0.99 0.008 75);
  --card-foreground: oklch(0.25 0.025 55);

  --primary: oklch(0.5 0.08 55);              /* marrom-tabaco */
  --primary-foreground: oklch(0.97 0.015 75);

  --secondary: oklch(0.92 0.018 75);
  --secondary-foreground: oklch(0.25 0.025 55);

  --muted: oklch(0.92 0.018 75);
  --muted-foreground: oklch(0.5 0.02 55);

  --accent: oklch(0.83 0.05 75);              /* areia mais quente */
  --accent-foreground: oklch(0.25 0.025 55);

  --destructive: oklch(0.55 0.2 25);
  --destructive-foreground: oklch(0.97 0.015 75);

  --border: oklch(0.87 0.018 75);
  --input: oklch(0.87 0.018 75);
  --ring: oklch(0.5 0.08 55);

  --radius: 0.5rem;
}
```
**Tipografia**: Fraunces display + Karla body, ou serif clássica + sans humanista.

---

## Earthy & natural

### 9. Terracotta & Sage — wellness, slow living

```css
:root {
  --background: oklch(0.96 0.012 75);
  --foreground: oklch(0.25 0.03 40);

  --card: oklch(0.98 0.008 75);
  --card-foreground: oklch(0.25 0.03 40);

  --primary: oklch(0.55 0.13 35);             /* terracota */
  --primary-foreground: oklch(0.96 0.012 75);

  --secondary: oklch(0.68 0.07 145);          /* sage */
  --secondary-foreground: oklch(0.18 0.02 145);

  --muted: oklch(0.91 0.015 75);
  --muted-foreground: oklch(0.5 0.02 50);

  --accent: oklch(0.82 0.05 75);
  --accent-foreground: oklch(0.25 0.03 40);

  --destructive: oklch(0.5 0.2 25);
  --destructive-foreground: oklch(0.96 0.012 75);

  --border: oklch(0.86 0.018 75);
  --input: oklch(0.86 0.018 75);
  --ring: oklch(0.55 0.13 35);

  --radius: 0.625rem;                         /* radius levemente mais soft */
}
```
**Tipografia**: Cormorant display + Karla body.

### 10. Forest & Moss — outdoors, sustentabilidade

```css
:root {
  --background: oklch(0.95 0.008 145);
  --foreground: oklch(0.2 0.03 145);

  --card: oklch(0.98 0.005 145);
  --card-foreground: oklch(0.2 0.03 145);

  --primary: oklch(0.38 0.08 145);            /* verde-floresta */
  --primary-foreground: oklch(0.95 0.008 145);

  --secondary: oklch(0.78 0.06 130);
  --secondary-foreground: oklch(0.2 0.03 145);

  --muted: oklch(0.9 0.01 145);
  --muted-foreground: oklch(0.48 0.02 145);

  --accent: oklch(0.83 0.04 145);
  --accent-foreground: oklch(0.2 0.03 145);

  --destructive: oklch(0.55 0.2 25);
  --destructive-foreground: oklch(0.95 0.008 145);

  --border: oklch(0.85 0.015 145);
  --input: oklch(0.85 0.015 145);
  --ring: oklch(0.38 0.08 145);

  --radius: 0.5rem;
}

.dark {
  --background: oklch(0.18 0.025 145);
  --foreground: oklch(0.92 0.005 145);
  --card: oklch(0.22 0.025 145);
  --card-foreground: oklch(0.92 0.005 145);
  --primary: oklch(0.7 0.1 145);
  --primary-foreground: oklch(0.18 0.025 145);
  --secondary: oklch(0.26 0.025 145);
  --secondary-foreground: oklch(0.92 0.005 145);
  --muted: oklch(0.26 0.025 145);
  --muted-foreground: oklch(0.65 0.01 145);
  --accent: oklch(0.3 0.04 145);
  --accent-foreground: oklch(0.92 0.005 145);
  --border: oklch(0.28 0.025 145);
  --input: oklch(0.28 0.025 145);
  --ring: oklch(0.7 0.1 145);
}
```
**Tipografia**: Söhne Buch display + Inter body.

### 11. Burnt Sienna — artisan, handmade

```css
:root {
  --background: oklch(0.95 0.018 60);
  --foreground: oklch(0.22 0.05 40);

  --card: oklch(0.97 0.012 60);
  --card-foreground: oklch(0.22 0.05 40);

  --primary: oklch(0.45 0.13 40);             /* sienna queimado */
  --primary-foreground: oklch(0.95 0.018 60);

  --secondary: oklch(0.65 0.13 60);           /* ocre */
  --secondary-foreground: oklch(0.18 0.04 40);

  --muted: oklch(0.9 0.02 60);
  --muted-foreground: oklch(0.45 0.025 50);

  --accent: oklch(0.78 0.08 60);
  --accent-foreground: oklch(0.22 0.05 40);

  --destructive: oklch(0.5 0.2 25);
  --destructive-foreground: oklch(0.95 0.018 60);

  --border: oklch(0.85 0.02 60);
  --input: oklch(0.85 0.02 60);
  --ring: oklch(0.45 0.13 40);

  --radius: 0.5rem;
}
```
**Tipografia**: GT Sectra display + IBM Plex Sans body.

---

## Cool & professional

### 12. Ocean Deep — finance, healthcare

```css
:root {
  --background: oklch(0.99 0.003 230);
  --foreground: oklch(0.18 0.05 230);

  --card: oklch(1 0 0);
  --card-foreground: oklch(0.18 0.05 230);

  --primary: oklch(0.42 0.1 225);             /* azul-marinho */
  --primary-foreground: oklch(0.99 0.003 230);

  --secondary: oklch(0.65 0.08 200);          /* azul-piscina */
  --secondary-foreground: oklch(0.15 0.04 230);

  --muted: oklch(0.95 0.008 230);
  --muted-foreground: oklch(0.5 0.02 230);

  --accent: oklch(0.92 0.015 230);
  --accent-foreground: oklch(0.18 0.05 230);

  --destructive: oklch(0.58 0.24 25);
  --destructive-foreground: oklch(0.99 0.003 230);

  --border: oklch(0.9 0.01 230);
  --input: oklch(0.9 0.01 230);
  --ring: oklch(0.42 0.1 225);

  --radius: 0.375rem;
}
```
**Tipografia**: Söhne display + Söhne Buch body. Inter como alternativa.

### 13. Slate & Steel — modern enterprise

```css
:root {
  --background: oklch(0.99 0 0);
  --foreground: oklch(0.2 0.01 250);

  --card: oklch(1 0 0);
  --card-foreground: oklch(0.2 0.01 250);

  --primary: oklch(0.32 0.02 250);            /* slate escuro */
  --primary-foreground: oklch(0.99 0 0);

  --secondary: oklch(0.62 0.018 250);
  --secondary-foreground: oklch(0.99 0 0);

  --muted: oklch(0.95 0.005 250);
  --muted-foreground: oklch(0.5 0.012 250);

  --accent: oklch(0.93 0.008 250);
  --accent-foreground: oklch(0.2 0.01 250);

  --destructive: oklch(0.58 0.24 25);
  --destructive-foreground: oklch(0.99 0 0);

  --border: oklch(0.91 0.005 250);
  --input: oklch(0.91 0.005 250);
  --ring: oklch(0.32 0.02 250);

  --radius: 0.375rem;
}
```
**Tipografia**: Inter Display + Inter. Funciona com Helvetica/Neue Haas Grotesk se disponível.

---

## Bold & energetic

### 14. Brutalist Pop — neo-brutalist, indie

Personalidade: confrontador, opinativo, alta voltagem. Radius 0, shadows duras, acento ácido.

```css
:root {
  --background: oklch(0.99 0 0);              /* off-white quase puro */
  --foreground: oklch(0.05 0 0);              /* preto profundo */

  --card: oklch(0.99 0 0);
  --card-foreground: oklch(0.05 0 0);

  --primary: oklch(0.7 0.28 145);             /* verde elétrico */
  --primary-foreground: oklch(0.05 0 0);

  --secondary: oklch(0.05 0 0);
  --secondary-foreground: oklch(0.99 0 0);

  --muted: oklch(0.95 0 0);
  --muted-foreground: oklch(0.45 0 0);

  --accent: oklch(0.92 0.2 95);               /* amarelo elétrico — segundo acento */
  --accent-foreground: oklch(0.05 0 0);

  --destructive: oklch(0.58 0.24 25);
  --destructive-foreground: oklch(0.99 0 0);

  --border: oklch(0.05 0 0);                  /* bordas pretas, sempre */
  --input: oklch(0.05 0 0);
  --ring: oklch(0.7 0.28 145);

  --radius: 0;                                /* zero radius */
}
```
**Tipografia**: Space Grotesk display + Inter Tight body. Shadows duras: `box-shadow: 6px 6px 0 0 var(--foreground)` em cards/botões.

### 15. Neon Mint — startup, fintech

```css
:root {
  --background: oklch(0.15 0.02 220);
  --foreground: oklch(0.95 0.005 180);

  --card: oklch(0.2 0.02 220);
  --card-foreground: oklch(0.95 0.005 180);

  --primary: oklch(0.85 0.18 165);            /* mint elétrico */
  --primary-foreground: oklch(0.15 0.02 220);

  --secondary: oklch(0.42 0.13 165);          /* mint escuro */
  --secondary-foreground: oklch(0.95 0.005 180);

  --muted: oklch(0.24 0.02 220);
  --muted-foreground: oklch(0.65 0.01 200);

  --accent: oklch(0.28 0.04 200);
  --accent-foreground: oklch(0.95 0.005 180);

  --destructive: oklch(0.62 0.24 25);
  --destructive-foreground: oklch(0.99 0 0);

  --border: oklch(0.26 0.02 220);
  --input: oklch(0.26 0.02 220);
  --ring: oklch(0.85 0.18 165);

  --radius: 0.5rem;
}
```
**Tipografia**: Sora display + Manrope body + JetBrains Mono.

---

## Como escolher

| Briefing | Paleta sugerida |
|----------|----------------|
| "Tech moderno, SaaS premium, IA-flavored" | Midnight Indigo (1) |
| "Marca de design, opinativa, com personalidade" | Charcoal & Ember (2) |
| "Luxo, editorial, fundo profundo" | Noir & Gold (3) |
| "SaaS opinativo, dev tool com cara" | Dark Tech (4) |
| "Dashboard, IDE, app pra usar 8h/dia" | Dim Warm (5) |
| "Editorial, Swiss, manifesto, marca pra durar" | Paper & Ink (6) |
| "SaaS limpo light mode" | Cloud White (7) |
| "Marca acolhedora, hospitalidade, marketplace" | Warm Sand (8) |
| "Wellness, slow living, lifestyle" | Terracotta & Sage (9) |
| "Outdoors, sustentabilidade, agritech" | Forest & Moss (10) |
| "Artesanato, marca handmade, food crafted" | Burnt Sienna (11) |
| "Finance, healthcare, marca séria" | Ocean Deep (12) |
| "Enterprise B2B, ferramenta corporate" | Slate & Steel (13) |
| "Manifesto, lançamento provocador, indie" | Brutalist Pop (14) |
| "Startup fintech / consumer com energia" | Neon Mint (15) |

## Se nenhuma cabe

Crie uma nova seguindo `references/design-system.md` (oklch, semântica, dark mode pareado, composites no final). Não cole HEX — converta antes.

## Sobre dark mode em paletas light

As paletas 6, 7, 8, 12, 13 acima são primariamente light. Pra adicionar dark mode, siga estes ajustes:

- Inverter `--background` e `--foreground`.
- **Reduzir chroma** do `--primary` em ~30% (acentos saturados vibram demais no escuro).
- Aumentar a saturação do `--muted-foreground` levemente (manter legibilidade).
- Testar contraste WCAG AA antes de fechar.
