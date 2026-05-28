# Component Patterns

> Como estender shadcn/ui (ou qualquer lib) sem brigar com ela, e como construir componentes novos que cabem no design system.

## Regra

`className` override é OK pra **ajuste de layout naquela instância** (`mt-8`, `w-full`, `max-w-md`). Não é OK pra **mudar a personalidade visual** (`bg-...`, `text-...`, `border-...`, `rounded-...`).

Se está sobrescrevendo cor/borda/radius/padding/tipo, **crie uma variant**.

## Estenda via variants, não overrides

shadcn componentes usam CVA. Quando os variants default não combinam com a direção, **adicione novos variants**. Não override com className em cada call site.

```tsx
// ❌ Errado — override em todo lugar
<Button className="bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-xl hover:shadow-2xl">
  Get started
</Button>

// ✅ Certo — adicione variant uma vez, use em todo lugar
// em button.tsx:
const buttonVariants = cva(
  "inline-flex items-center justify-center transition-colors focus-visible:ring-2",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        outline: "border border-input bg-background hover:bg-accent",
        hero: "bg-[image:var(--gradient-hero)] text-primary-foreground shadow-[var(--shadow-elegant)] hover:shadow-[var(--shadow-hero)] transition-[box-shadow,transform] hover:-translate-y-0.5",
        brutalist: "bg-foreground text-background border-2 border-foreground shadow-sharp hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all",
        editorial: "bg-transparent text-foreground underline underline-offset-4 decoration-1 hover:decoration-2",
      },
      size: {
        default: "h-10 px-4 text-sm",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-6 text-base",
        xl: "h-14 px-8 text-lg",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

<Button variant="hero">Get started</Button>
```

## Nomeie variants semanticamente

Variant names descrevem **papel**, não **aparência**:

- ✅ `hero`, `subtle`, `destructive`, `ghost`, `link`, `brutalist`, `editorial`
- ❌ `bigRedButton`, `gradient1`, `withShadow`, `blueButton`

Assim o variant sobrevive a redesign — só os estilos dentro dele mudam.

## Composição > configuração

Pra UI complexa, construa componentes pequenos e focados e componha. Não faça um componente com 15 props:

```tsx
// ❌ Errado — props explodindo
<Card
  title="..."
  subtitle="..."
  image="..."
  imagePosition="left"
  badge="..."
  badgeColor="amber"
  cta="..."
  ctaVariant="hero"
  footerText="..."
/>

// ✅ Certo — composição clara
<Card>
  <Card.Media src="..." />
  <Card.Badge>New</Card.Badge>
  <Card.Title>...</Card.Title>
  <Card.Body>...</Card.Body>
  <Card.Footer>
    <Button variant="hero">Action</Button>
  </Card.Footer>
</Card>
```

A primeira forma vira impossível de manter. A segunda escala.

## Slots e `asChild`

Padrão Radix/shadcn: `asChild` permite trocar o elemento HTML mantendo o estilo. Ótimo pra botão que deveria ser link sem perder visual:

```tsx
<Button asChild variant="default">
  <Link href="/pricing">Ver planos</Link>
</Button>
```

Não duplique estilos entre `<Button>` e `<a className="...">`.

## Quando shadcn não cabe — antes de fazer custom

1. **Olhe primitives Radix direto** (`@radix-ui/react-*`). shadcn é Radix + estilo; você pode usar Radix puro e estilizar diferente.
2. **Veja se é variant novo** vs. componente novo. 80% das vezes é variant.
3. **Compor com Slot do Radix** se precisa "envelopar" um existente com lógica/estilo extra.
4. Só depois, componente novo do zero.

## Quando abandonar o componente da lib inteiro

Se você está sobrescrevendo 80% de um componente shadcn, **construa um custom**. A lib é ponto de partida, não restrição. Um componente bespoke que cabe na direção bate um default torturado pra caber.

Sinais de que é hora de abandonar:
- 3+ variants seus + 5+ className overrides por uso.
- Você está sobrescrevendo o markup interno do componente.
- A semântica não bate (você precisa de algo que não é botão, mas usa Button por preguiça).

## Estado via `data-*`, não classes condicionais

Use `data-*` para estado, não cn() com booleano:

```tsx
// ❌ Ruim
<div className={cn("p-4", isActive && "bg-primary text-primary-foreground")}>

// ✅ Bom
<div 
  data-state={isActive ? "active" : "inactive"}
  className="p-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
>
```

Vantagens:
- Estado visível no DOM (debug fácil).
- Tailwind v4 lida com `data-*` selectors nativamente.
- Animações CSS baseadas em estado ficam triviais.

## `cn()` helper

shadcn vem com `cn()` (clsx + tailwind-merge). Use **sempre** que combinar variant com overrides:

```tsx
function Button({ className, variant, size, ...props }) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
```

Isso garante que `<Button className="bg-red-500" />` consegue sobrescrever a cor do variant sem conflito de specificity (tailwind-merge resolve).

## Organização de arquivos

- `src/components/ui/` — primitivos (button, input, dialog). Estilo de biblioteca.
- `src/components/<feature>/` — componentes específicos compostos.
- Um componente por arquivo. Co-localize variants e types no mesmo arquivo, a menos que sejam compartilhados.

## Checklist antes de fazer override

Antes de escrever `className="bg-... border-... rounded-..."`:

- [ ] Esse visual aparece em mais de um lugar? → variant.
- [ ] Esse visual é uma "personalidade" da marca (brutalist, editorial)? → variant.
- [ ] É só ajuste de tamanho/posição naquela instância? → OK, className.
- [ ] É exceção real one-off? → OK, className. Documente o motivo.

## O teste "tema diferente"

Um componente bem construído sobrevive a uma troca completa de design system (tokens diferentes) sem mudança de código. Se ele quebra quando você troca cores, está vazando valor literal em algum lugar.
