# Jornada do Usuario no Reembolsaaí

## 1. Objetivo deste documento

Este documento explica por que a jornada do usuario e critica para o Reembolsaaí e o que ela precisa garantir para cada perfil que usa o produto.

O ponto principal e simples:

o Reembolsaaí nao e apenas um sistema com telas; ele e um fluxo operacional entre pessoas, politica, aprovacao, auditoria e dados da empresa.

Se a jornada do usuario nao estiver bem definida, o sistema pode ate "funcionar", mas nao gera confianca, nao escala e nao resolve o problema real do cliente.

## 2. Por que a jornada do usuario e importante

A jornada do usuario e importante porque ela define:

- como cada pessoa entra no sistema
- o que ela precisa entender
- o que ela precisa fazer
- o que o sistema precisa responder
- o que acontece depois de cada acao

Sem essa definicao, o produto corre alguns riscos graves:

- a empresa nao entende como implantar o sistema
- o colaborador acha dificil enviar a despesa
- o aprovador nao confia na sinalizacao
- o administrador nao consegue operar o tenant
- o financeiro nao enxerga consistencia
- a politica vira apenas um PDF guardado
- o dashboard passa a mostrar numeros sem contexto

Em um SaaS como o Reembolsaaí, a jornada nao e detalhe de UX. Ela e parte do modelo de negocio.

## 3. O que a jornada precisa entregar

Uma boa jornada do usuario precisa entregar cinco coisas:

### 3.1 Clareza

O usuario precisa entender:

- onde ele esta
- o que o sistema espera dele
- o que vai acontecer em seguida
- por que aquela decisao foi tomada

### 3.2 Baixo atrito

O sistema precisa reduzir trabalho manual.

Exemplos:

- colaborador nao deve preencher tudo na mao se o OCR pode sugerir
- aprovador nao deve investigar no escuro
- administrador nao deve configurar a empresa em dez telas desconectadas

### 3.3 Confianca

Cada usuario precisa sentir que o sistema e confiavel.

Isso exige:

- tenant correto
- politica correta
- status corretos
- historico correto
- mensagens coerentes

### 3.4 Rastreabilidade

Tudo que impacta dinheiro ou compliance precisa deixar rastro.

O sistema deve permitir responder:

- quem enviou
- por qual canal
- para qual empresa
- qual politica foi aplicada
- quem aprovou ou reprovou
- quando isso aconteceu

### 3.5 Continuidade

A jornada nao pode quebrar entre uma etapa e outra.

Exemplo:

- o convite precisa aparecer como pendente
- o aceite precisa ligar o usuario a empresa correta
- o WhatsApp precisa encontrar o colaborador certo
- a despesa criada precisa aparecer na fila certa
- a aprovacao precisa refletir no dashboard

## 4. Quem sao os usuarios e o que cada um precisa

## 4.1 Colaborador

O colaborador quer resolver uma tarefa rapida:

- enviar uma despesa
- saber se foi aceita
- acompanhar o status

Ele nao quer:

- entender arquitetura
- aprender regra complexa do sistema
- preencher burocracia desnecessaria

Para o colaborador, a jornada precisa ser:

- simples
- rapida
- explicativa
- previsivel

Se ele usa WhatsApp, melhor ainda:

- o numero dele precisa estar cadastrado
- o sistema precisa reconhecer quem ele e
- a despesa precisa cair na empresa certa

## 4.2 Aprovador

O aprovador nao quer "navegar no sistema"; ele quer tomar decisao com seguranca.

Para isso, a jornada dele precisa mostrar:

- qual despesa esta pendente
- por que ela foi sinalizada
- qual regra da politica foi afetada
- qual comprovante foi anexado
- qual o historico daquela decisao

Se o aprovador nao entende o contexto, ele aprova errado ou trava a operacao.

## 4.3 Administrador

O administrador e quem viabiliza a operacao do tenant.

Ele precisa conseguir:

- criar a empresa
- subir a politica
- revisar as regras extraidas
- convidar a equipe
- cadastrar ou corrigir WhatsApp dos colaboradores
- manter a base consistente

A jornada do admin e uma jornada de implantacao e de manutencao.

Se ela for confusa, o sistema nao entra em operacao com qualidade.

## 4.4 Financeiro

O financeiro precisa de previsibilidade, historico e consistencia.

Ele quer responder:

- o que foi aprovado
- o que esta pendente
- o que foi pago
- por que determinada despesa foi aceita ou reprovada

Para ele, a jornada precisa conectar operacao e auditoria.

## 5. Jornada ideal por etapa

## 5.1 Entrada da empresa no sistema

Etapa:

- cadastro
- criacao da empresa
- onboarding inicial

O que a jornada precisa garantir:

- empresa correta criada no tenant correto
- admin vinculado a propria empresa
- sem ambiguidade sobre "em qual empresa estou"
- clareza de proximo passo

Se isso falhar:

- todo o resto nasce torto

## 5.2 Configuracao da politica

Etapa:

- upload do PDF
- OCR/IA le politica
- sistema extrai regras
- admin revisa e salva

O que a jornada precisa garantir:

- o documento da politica e o da empresa certa
- o sistema deixa claro que as regras ainda precisam de revisao
- o admin entende o que esta sendo ativado
- a politica deixa de ser so um anexo e passa a ser regra operacional

Se isso falhar:

- a empresa perde confianca no core do produto

## 5.3 Configuracao da equipe

Etapa:

- convite
- aceite
- papel
- WhatsApp do colaborador

O que a jornada precisa garantir:

- convite nao some
- usuario entra na empresa certa
- papel correto e aplicado
- WhatsApp cadastrado e visivel
- equipe operacionalmente pronta

Se isso falhar:

- o tenant fica incoerente
- a operacao por WhatsApp quebra

## 5.4 Envio da despesa

Etapa:

- colaborador envia via web ou WhatsApp

O que a jornada precisa garantir:

- sistema identifica o colaborador
- sistema identifica a empresa
- OCR le o comprovante
- dados sao sugeridos corretamente
- politica e aplicada
- status final fica claro

Se isso falhar:

- a principal promessa do produto falha

## 5.5 Revisao e aprovacao

Etapa:

- fila de pendencias
- analise
- decisao

O que a jornada precisa garantir:

- a fila mostra so o que precisa decisao
- o motivo da sinalizacao e claro
- o aprovador entende o impacto da decisao
- a trilha e registrada

Se isso falhar:

- a automacao perde legitimidade

## 5.6 Fechamento operacional

Etapa:

- pagamento
- auditoria
- dashboard

O que a jornada precisa garantir:

- status final coerente
- numeros batendo com os dados
- leitura operacional confiavel
- visao de compliance consistente

Se isso falhar:

- o sistema vira "mais uma tela", e nao ferramenta de gestao

## 6. O que precisa existir na interface por causa da jornada

A jornada do usuario exige que a interface tenha:

- estados claros de vazio, erro, carregamento e sucesso
- mensagens que expliquem o que aconteceu
- indicacao clara da empresa ativa
- visibilidade de convite pendente
- visibilidade do WhatsApp do colaborador
- indicacao de canal da despesa
- motivo da revisao
- status operacional coerente
- dados consistentes entre tela e banco

Nao basta ter a funcionalidade no backend se a jornada visual quebra a compreensao do usuario.

## 7. O que precisa existir no backend por causa da jornada

A jornada do usuario tambem exige consistencia no backend.

Precisa existir:

- tenant real por `empresa_id`
- regras por empresa
- convite persistido
- aceite de convite consistente
- lookup por `profiles.telefone`
- trilha de auditoria
- integracao entre OCR, politica e despesa
- dashboard alimentado por dados reais

Sem isso, a jornada visual vira ilusao.

## 8. Matriz: o que cada perfil precisa sentir

| Perfil | O que precisa sentir |
|---|---|
| Colaborador | "Enviar despesa aqui e facil e seguro" |
| Aprovador | "Eu sei exatamente por que estou aprovando ou recusando" |
| Administrador | "Minha empresa esta configurada corretamente e minha equipe esta pronta para operar" |
| Financeiro | "Eu confio no status, no historico e nos numeros" |

## 9. Sinais de uma jornada ruim

Alguns sinais mostram que a jornada ainda nao esta boa:

- a empresa exibida na UI nao bate com a sessao real
- convites somem
- usuario nao sabe se a despesa foi enviada, aprovada ou travada
- WhatsApp nao encontra o colaborador certo
- aprovador nao entende a razao da pendencia
- dashboard fala uma coisa e a query calcula outra
- politica esta salva, mas nao esta operacionalizada

## 10. Criterio de qualidade da jornada

A jornada do usuario no Reembolsaaí so pode ser considerada boa quando:

- a empresa consegue implantar sem suporte tecnico constante
- o colaborador envia despesa com pouco atrito
- o aprovador decide com contexto suficiente
- o admin entende e controla a operacao
- o financeiro confia nos dados
- a politica e aplicada com consistencia
- o WhatsApp funciona como canal real e seguro

## 11. Conclusao

No Reembolsaaí, jornada do usuario nao e perfumaria.

Ela e o elo entre:

- o tenant da empresa
- a politica em PDF
- a automacao por OCR/IA
- o envio da despesa
- a decisao do aprovador
- a leitura do financeiro
- a confianca no produto

Se essa jornada for boa, o sistema vira operacao confiavel.

Se essa jornada for ruim, o produto vira um conjunto de telas com risco operacional.
