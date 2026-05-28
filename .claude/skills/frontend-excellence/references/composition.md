# Composição

> Composição é o que separa "uma página" de "um design". É a decisão sobre onde o peso vai, como o olho se move, e o que ganha o direito de respirar.

## Escolha uma postura

Todo layout tem uma postura. Escolha deliberadamente:

| Postura | Quando usa | Característica |
|---------|-----------|----------------|
| **Espaço negativo generoso** | Editorial, marca premium, lançamento, manifesto | Poucos elementos, tipo grande, muito ar. Cada elemento precisa ganhar seu lugar. |
| **Densidade controlada** | Dashboards, ferramentas pro, dev tools, magazine | Muita informação, mas hierarquizada com grid rigoroso e contraste claro |
| **Tensão assimétrica** | Brutalist, portfolio, marca criativa | Elementos sobrepostos, fora do grid, desequilíbrio intencional |

Não entregue layout no meio do caminho dessas três. "Hero centralizado + 3 cards abaixo" é **ausência de postura**.

## Hierarquia é uma pilha, não uma lista

Toda tela tem **UM** ponto focal primário. Depois **UM** secundário. Depois conteúdo de apoio. Se três coisas estão competindo por "mais importante", nenhuma é.

Ferramentas pra construir hierarquia (use 2-3, não todas):

- **Contraste de tamanho** (display gigante vs body pequeno)
- **Contraste de cor** (um acento saturado num campo neutro)
- **Posição** (top-left ganha em layouts LTR)
- **Isolamento por espaço** (a mais poderosa — cerca o foco com vazio)
- **Peso tipográfico** (um elemento bold num campo regular)

Erro clássico: usar as 5 ao mesmo tempo em vários elementos. Resultado: nada se destaca. Escolha 1-2 elementos pra receberem essas ferramentas; o resto recua.

## Grids existem pra serem quebrados — intencionalmente

Use grid como substrato. Depois quebre em 1-2 lugares pra dar ênfase: hero que sangra pra fora da coluna, número que sobrepõe duas células, headline que pende na margem. Quebrar o grid em tudo é caos; nunca quebrar é tédio corporativo.

Tailwind tem `grid-cols-12` mas isso não é lei. `grid-cols-[1fr_2fr_1fr]` ou `grid-cols-[2fr_1fr]` (7-5 em vez de 6-6) costumam ser mais expressivos.

## Espaço negativo

Espaço não é "o que sobrou". É **conteúdo invisível** que define ritmo.

- **Margem entre seções** ≠ margem dentro de seção. Use escala dramaticamente diferente (ex: 4rem dentro, 12rem entre).
- **Padding lateral de hero** deveria ser maior do que você acha. Tente o dobro do default.
- **Largura útil de prosa**: 60-75 caracteres. Não jogue parágrafo em 1200px de largura.
- **Vertical de seção em landing**: 96-160px desktop, 64-96px mobile. `py-12` default do Tailwind faz tudo parecer template.

Teste: aperte os olhos. O layout ainda tem ritmo? Se virou uma mancha cinza uniforme, falta espaço.

## Escala de spacing

Pegue uma escala e mantenha. Comum: base 4px com escala não-linear (4, 8, 12, 16, 24, 32, 48, 64, 96, 128). Nunca arbitrário como `mt-[37px]`. Se a escala não tem o que você precisa, a escala está errada.

## Ritmo vertical

Sequência de espaçamentos entre blocos cria ritmo. Algumas escalas que funcionam:

- **Major third (1.25x)**: ritmo sutil — `1rem, 1.25rem, 1.56rem, 1.95rem...`
- **Perfect fourth (1.333x)**: confortável — `1rem, 1.33rem, 1.78rem, 2.37rem...`
- **Golden ratio (1.618x)**: dramático — `1rem, 1.618rem, 2.618rem, 4.236rem...`

Use uma escala consistente — não misture `gap-3` com `gap-5` com `gap-7` na mesma tela.

## Onde o olho pousa

Construa pensando em **3 elementos focais no máximo**:

1. Primary focal point (o que vende a página em 1 segundo)
2. Secondary (o que ancora a próxima ação)
3. Tertiary (o que dá contexto/credibilidade)

O resto é estrutura. Cards "de apoio" não devem competir.

## Padrões anti-template

| Default tentador | Substitua por |
|------------------|---------------|
| Hero centralizado com headline + sub + 2 CTAs | Headline alinhada à esquerda, sub-texto curto, 1 CTA, peça visual à direita ou abaixo |
| Grid de 3 features com ícone + título + 2 linhas | Lista de 2-4 features com tipo grande, número à frente, sem ícone |
| "Trusted by" com logos cinza centralizados | Cortar. Se essencial, fazer 1 linha em alto contraste com nomes em texto |
| Footer com 4 colunas (Product / Company / Resources / Legal) | 2 colunas ou 1 linha com poucos links essenciais |
| "Como funciona" em 3 passos numerados horizontais | Texto editorial com 2-3 parágrafos, ou step grande único com diagrama real |
| Todos os blocos centralizados ("center-everything") | Left-align como default; centralizar só o hero ou copy curto |
| 3 colunas iguais | 1 grande + 2 pequenas, ou colunas assimétricas (7-5) |
| Card-grid em tudo | Nem todo conteúdo quer ser card. Lista, parágrafo ou tabela comparativa comunica melhor às vezes |

## Quando duvidar

Cobre metade da tela com a mão e veja se o que sobra ainda comunica. Se sim, a outra metade pode estar inflada. Cobre 2/3 e veja se ainda funciona. Esta é a regra do "subtraia agressivamente" na prática.
