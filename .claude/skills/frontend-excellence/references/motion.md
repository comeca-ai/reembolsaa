# Motion

> Motion é multiplicador num design bom e lupa num design ruim. O default deve ser **menos** do que você acha.

## Princípio

Animação serve a UM destes 4 propósitos:

1. **Feedback** — confirmar que ação foi recebida (botão press, toast aparecendo, validação).
2. **Continuidade** — preservar contexto entre estados (modal abrindo do botão clicado, item da lista expandindo, page transition).
3. **Hierarquia temporal** — direcionar atenção em sequência (não tudo de uma vez na carga).
4. **Personalidade** — um movimento característico que diferencia a marca (raro; precisa ser sutil).

Se a animação não está fazendo um dos 4, **corte**.

## As regras

1. **Motion precisa significar algo.** Revelar hierarquia, comunicar mudança de estado, guiar atenção. Decoração sem significado é ruído.

2. **Um momento de assinatura > dez microinterações.** Um hero reveal confiante, um hover que parece vivo, uma transição de página com peso. Não anime cada seção no scroll — vira ruído e parece genérico.

3. **Easing importa mais que duração.** Linear quase nunca está certo. Default seguro: `cubic-bezier(0.22, 1, 0.36, 1)` ("expo-out") — rápido no começo, desacelera com elegância. Bom pra entrada de praticamente qualquer elemento.

4. **`prefers-reduced-motion`** sempre respeitado. Acessibilidade real, não decorativa.

## Durações de referência

| Tipo | Duração |
|------|---------|
| Hover de cor | 100-150ms |
| Botão press / tap feedback | 80-120ms |
| Modal / drawer entrada | 200-300ms |
| Modal / drawer saída | 120-200ms |
| Page transition | 400-700ms |
| Hero reveal único | 600-1200ms (pode ser mais se for um momento real) |
| Loading skeleton pulse | 1200-1800ms |

Acima de 500ms pra microinteração: o usuário começa a esperar. Abaixo de 80ms: nem nota.

## Curvas (cubic-bezier)

- **`cubic-bezier(0.22, 1, 0.36, 1)`** — expo-out, default seguro pra entrada.
- **`cubic-bezier(0.4, 0, 0.2, 1)`** — Material standard, bom pra UI transitions.
- **`ease-out`** — rápido no começo, desacelera. Bom pra entrada.
- **`ease-in`** — acelera ao sair. Coerente com "indo embora".
- **`linear`** — só pra loops infinitos (spinner).
- **Spring** (via Framer): `stiffness: 300, damping: 30` é ponto de partida sóbrio. Use com parcimônia.

## Que tecnologia usar

- **CSS transitions / `@keyframes`** — hover, pequenos reveals, loading. Mais barato, mais performante. Resolve 80% dos casos.
- **Framer Motion** quando precisa de: layout animation (`layoutId`), spring physics, orquestração com `AnimatePresence`, variants compostos.
- **GSAP** só quando precisa de timeline-based choreography ou scroll-driven sequencing que Framer não expressa bem. Raro.

Não importe Framer Motion pra fazer um fade que `transition-opacity` resolve.

## Padrões a EVITAR

- **Fade-in-on-scroll em toda seção** (o "AOS library" look) — sinal #1 de "AI-generated".
- **Bouncy spring em controles de UI** — botão que balança é brinquedo, não ferramenta.
- **Hover scale 1.05 em todo card** — todo mundo faz, vira ruído.
- **Gradient animado infinito de fundo** — distrai do conteúdo.
- **Contador animado de números no scroll** — atrasa leitura do número real.
- **Parallax em tudo** — um foco com parallax pode ser legal; cinco é caos.
- **Letter-by-letter reveal em body copy** — OK em hero, nunca em parágrafo.
- **Scroll-jacking** (forçar velocidade ou direção do scroll) — hostil.

## Implementação

**Tailwind puro** dá conta de 80% dos casos:
```html
<button class="transition-colors duration-150 ease-out hover:bg-primary/90 active:scale-[0.98]">
```

Variável CSS com easing customizado:
```css
:root {
  --transition-smooth: 200ms cubic-bezier(0.22, 1, 0.36, 1);
}

.my-element {
  transition: opacity var(--transition-smooth), transform var(--transition-smooth);
}
```

`prefers-reduced-motion`:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## O teste de corte

Depois de pronto, **desligue toda animação**. O design ainda comunica hierarquia e intenção? Deveria. Motion enhances, não load-bearing.

Se a página perde sentido sem animação, o design está apoiado em motion porque a composição não está fazendo o trabalho.
