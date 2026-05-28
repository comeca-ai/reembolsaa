# Anti-Slop

> O arquivo mais importante desta skill. "AI-generated UI" tem padrões reconhecíveis — e a forma mais rápida de fugir é **nomear cada um** e ter **uma substituição** pronta.

Estrutura: ❌ **padrão de slop** → **em vez disso, faça**. Quando precisa de mais que uma linha, vem parágrafo.

---

## 1. Layout & estrutura

**❌ Hero centralizado com headline + sub + 2 CTAs lado a lado ("Get Started" / "Learn More")**
→ Headline alinhada à esquerda ocupando 60-70% da largura, sub-texto curto (máx 2 linhas), **UM** CTA confiante. Se acha que precisa de 2, está com medo de comprometer com o primário. Peça visual ao lado (imagem, código, demo embedada) é opcional, não obrigatório.

**❌ Grid de 3 features com ícone + heading bold + 2 linhas de body, três vezes**
→ Lista de 2-4 features com **número** à frente (01, 02, 03...) em tipo grande, sem ícone. OU 2 features grandes com mais respiro e descrição mais funda. OU tabela comparativa.

**❌ Strip "Trusted by" / "As seen in" com 5 logos cinza**
→ Cortar. Se for genuinamente impressionante, faz **uma** linha em alto contraste (branco-em-preto), nomes em texto editorial, ou cite UM cliente com testimonial real (nome, cargo, foto). 1 quote real > 8 logos.

**❌ Seção de testimonials com 3 cards: avatar + quote + nome + role**
→ Um testimonial dominante, ocupando uma seção inteira, com a quote em tipografia grande e o atributo discreto. Ou uma sequência editorial de quotes com transição entre elas.

**❌ FAQ accordion no final porque "toda landing tem"**
→ Cortar se você não tem 5+ perguntas que efetivamente importam. Se tem, considere lista aberta (não accordion) ou seção dedicada a "objeções comuns" em tom editorial.

**❌ Footer com 4 colunas (Product / Company / Resources / Legal)**
→ Footer de 1 linha com 3-5 links essenciais + copyright + social. OU footer-statement: uma frase tipo manifesto + link único pro contato. Link pra blog vazio é pior que ausência.

**❌ Nav sticky com logo esquerda, 4 links centro, "Sign Up" direita**
→ Decida o que importa. Nav minimalista (logo + 1-2 links + 1 ação) ou nav editorial (logo + tipografia, sem ação na nav). "Sign up" repetido em nav e hero é redundante.

**❌ "Como funciona" em 3 passos numerados horizontais com ícones**
→ Texto editorial em 2-3 parágrafos contando a jornada como narrativa. OU demo / GIF do produto fazendo a coisa. OU diagrama único bem desenhado.

**❌ Pricing com 3 cards (Free / Pro / Enterprise), o do meio destacado em azul**
→ 2 planos se forem 2. Tabela tipográfica sem "cards". "Fale com a gente" pra Enterprise quando preço varia. Destaque o plano recomendado por tipografia/espaço, não por borda azul.

---

## 2. Copy

A maior parte do slop de copy é fórmula sem alma. Compromisso com voz mata cada um desses padrões.

**❌ Headlines "Build faster. Ship better." (duas palavras + duas palavras)**
→ Frase com sujeito, verbo e consequência real. "Reembolso corporativo que fecha em 48h em vez de duas semanas" > "Faster reimbursement. Better compliance."

**❌ "The all-in-one platform for [thing]"**
→ Diga o que o produto **faz** especificamente, com substantivos concretos. "Conecta sua corretora, classifica notas fiscais e exporta pra IRPF" > "All-in-one tax platform".

**❌ "Get started" / "Learn more" / "Try it free" como únicos CTAs**
→ Verbo + benefício específico. "Ver demo em 90 segundos" > "Learn more". "Subir minha primeira nota" > "Get started". CTA é promessa, não placeholder.

**❌ "Loved by 10,000+ teams" sem provar**
→ Cortar números sem fonte. Se tem provas reais, mostre: nome de empresas, número de NPS aferido, métrica de produto.

**❌ Feature headings genéricas: "Powerful", "Flexible", "Intuitive", "Seamless", "Robust"**
→ Headings descritivas: "Importa NF-e direto do email" > "Powerful imports". "Funciona com qualquer ERP" > "Flexible integrations".

**❌ "AI-powered" como diferencial**
→ Mostre o output, não a etiqueta. "Resume sua semana em 3 frases" > "AI-powered weekly digest". Em 2025+, IA é commodity; não é argumento.

**❌ Emoji em headlines (🚀 Launch faster!)**
→ Tipografia faz o trabalho de tom. Símbolo custom se quiser elemento visual. Em UI interna (toast, badge) emoji pode estar OK em contexto — landing não.

---

## 3. Cor & visual

**❌ Gradiente roxo-rosa em fundo branco**
→ Fundo sólido (preto, off-white quente, dark warm) + UM acento saturado em pontos específicos. Se quiser gradient, use mesh com cores **incomuns** (verde-musgo + tijolo, oklch valores baixos) ou gradient sutil entre tons da mesma família.

**❌ Gradiente azul-ciano em fundo navy escuro**
→ Mesma resposta. Se for "dark tech", paleta sólida com UM acento ácido (lime, verde-elétrico) bate gradient cliché.

**❌ Glassmorphism em todo card**
→ Cortar. Se for genuinamente a direção, use UMA vez (overlay de hero, dropdown), nunca como padrão em cards. Background opaco sólido é quase sempre melhor.

**❌ "Safety stacking": shadow + border + background tint no mesmo elemento**
→ Escolha UM. Border OU shadow OU background diferenciado. Os três juntos gritam "AI tentando garantir destaque".

**❌ Único acento de cor usado em 5 opacidades diferentes em todo lugar**
→ Acento em pouquíssimos lugares (1-2 por tela). Resto é neutros. Saturação é poder — use com moderação.

**❌ Border-radius default (`rounded-lg`) em todo elemento**
→ Radius é decisão de personalidade. Brutalist/editorial: `rounded-none`. Tech: radius pequeno consistente. Premium/soft: radius grande **só em containers principais**. Nunca misture `rounded-full` em avatar com `rounded-sm` em botão sem motivo claro.

---

## 4. Tipografia

**❌ Inter / Poppins / Roboto / Open Sans como única fonte**
→ Pareie display + body com intenção. Ver `references/typography.md` pros 5 padrões de pareamento.

**❌ All-caps com tracking aberto em TODO botão**
→ All-caps é tom forte; use em labels/eyebrow, não em CTA de hero. Botão em sentence case com peso medium funciona melhor 90% das vezes.

**❌ Headings que são só `font-bold` sem drama de tamanho ou peso**
→ Hierarquia precisa de saltos grandes. H1 de 64px ao lado de H2 de 28px > três níveis em 24/20/16.

**❌ Body em `text-base` (16px) em tudo, sem variação de escala**
→ Body large pra sub-headlines, body small pra meta/captions. Pelo menos 3 tamanhos de "texto não-headline" pra criar ritmo.

---

## 5. Iconografia

**❌ Ícone Lucide ao lado de cada heading porque "fica mais polido"**
→ Cortar. Tipografia carrega heading. Se precisa de marcador visual, use **número** (01, 02) ou letra capital.

**❌ Mesmo estilo de ícone usado pra 30 conceitos diferentes**
→ Se precisa de ícones, use poucos e que **comuniquem** o conceito específico, não decorem.

**❌ Ícones dentro de circulinhos coloridos com tint do background pra cada feature**
→ Padrão de slide PowerPoint 2018. Cortar. Se precisa de ícone, use ele direto, em peso/tamanho adequado.

---

## 6. Motion

**❌ Fade-in-up em toda seção no scroll (o "AOS library" look)**
→ Reveal **uma vez** no primeiro fold se for marca premium. Resto: tudo já visível. Confie no conteúdo.

**❌ Hover scale (1.05) em todo card**
→ Cortar. Se hover precisa de feedback, use mudança de cor (`hover:bg-primary/90`) ou de border. `active:scale-[0.98]` em botão é OK; `hover:scale-105` em card não.

**❌ Spring bouncy em controles de UI**
→ Botão que balança é brinquedo. Usar ease-out controlado, não spring com overshoot.

**❌ Contador animado de números em stats no scroll**
→ Número direto, tipografia gigante, `tabular-nums`. Drama vem da escala, não da animação.

**❌ Parallax blobs flutuantes no hero**
→ Datado desde 2018. Tipografia heroica + espaço negativo > parallax.

**❌ Letter-by-letter reveal em body copy**
→ OK em hero. Nunca em parágrafo — vira cringe.

---

## 7. Imagery

**❌ Stock photo de pessoas diversas sorrindo em frente a laptop**
→ Foto real do time/produto/processo (mesmo que crua). Render 3D ou ilustração custom. Tipografia heroica + nada (espaço negativo > imagem ruim). Screenshot do produto bem composto.

**❌ Blobs gradient 3D abstratos ("Stripe-but-worse")**
→ Cortar. Se precisa de elemento visual no hero, use captura real do produto, peça tipográfica grande, ou ilustração com personalidade (não shape genérico).

**❌ Screenshot de dashboard flutuando em ângulo com shadow**
→ Crop focado na UI que importa, em frame minimal ou sem frame. Se mostrar dispositivo, que seja custom e a serviço da composição (cortado, sobreposto, ângulo intencional).

**❌ Mockup de iPhone com o app dentro flutuando**
→ Mesmo princípio. Crop direto, sem chrome do dispositivo, a não ser que o "ser mobile" seja parte essencial da mensagem.

---

## Diagnóstico rápido

Olhe a página por 5 segundos. Dois testes:

1. **"Seria que essa página parece com outro produto B2B genérico?"** Se sim, você tem slop.
2. **"Parece que copiei Linear/Vercel/Stripe?"** Se sim, também é slop — copiou referência sem traduzir pra marca em questão.

Inspire-se na **decisão** que eles tomaram (densidade, paleta restrita, tipografia opinativa), não na execução literal.

## O teste do "designer respeitado"

Olhe a tela e pergunte: **um designer de um estúdio que você respeita entregaria exatamente isso?** Se a resposta é "é, fine, sei lá" — é slop. Se é "sim, com convicção" — entrega.

## Princípio da substituição

Quando pegar um padrão de slop, **não só delete** — substitua por algo que serve ao mesmo objetivo de forma que combine com a direção. Cortar gera vazio; substituir gera intenção.

- Slop: "Trusted by" → Substituição: uma quote proeminente de um cliente real, com nome e foto real.
- Slop: grid de 3 features → Substituição: 1 feature hero mostrada em detalhe + lista do resto.
- Slop: duplo CTA centralizado → Substituição: CTA único confiante + ação secundária como link de texto embaixo.
