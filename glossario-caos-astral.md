# Caos Astral, Glossário Oficial

Documento de referência única. Qualquer conta/agente trabalhando no projeto (front, ferramenta principal, agente de I Ching) deve usar exatamente estes termos, não sinônimos, não traduções livres. Se um termo não está aqui, ele não existe oficialmente ainda: debater antes de codar.

**Status:** `fechado` = pode usar em produção · `pendente` = decisão em aberto, não codar ainda · `standby` = aguardando decisão de escopo maior

---

## Vocabulário do mapa individual

| Termo | Substitui | Definição | Status |
|---|---|---|---|
| **Núcleo** | Signo solar | O motor que não se negocia | fechado |
| **Máscara** | Ascendente | A interface que o mundo vê primeiro | fechado |
| **Fome** | Signo lunar | O apetite cru que pede satisfação | fechado |
| **Território** | Casa astrológica | Área de operação (território 7 = vínculos, etc.) | fechado |
| **Exílio** | Lilith Negra (verdadeira/oscilante) | O ponto mais distante, o que foi expulso antes de virar cicatriz | fechado, implementação em `supabase/functions/_shared/lilith.ts`, falta integrar na Edge Function, deployar, e validar contra efeméride de referência (ver `CLAUDE.md` seção 5) |
| **Fricção** | Aspecto tenso (quadratura, oposição) | Atrito que exige decisão consciente, **não é** sinônimo genérico de "energia do trânsito" | fechado |
| **Corrente** | Aspecto harmônico (trígono, sextil) | Fluxo que já existe, fácil de mais até | fechado |
| **Janela** | Trânsito do dia | Abertura temporária, tática, renovada todo dia | fechado |
| **Janela estendida** | Horóscopo semanal/mensal/anual | Agregação de janelas num período maior, mesma lógica, escala maior | fechado |
| **Eco** | Retrogradação | Passado pedindo revisita, não sabotagem | fechado |
| **Cicatriz** | Posição de Quíron | O que sobrou depois que a dor já fez seu trabalho | fechado |
| **Retorno** | Revolução solar | O mapa do ano, núcleo completa uma volta e retorna ao ponto de nascimento | fechado |
| **Marcos** | Trânsitos lentos/pesados (Saturno, Urano, Plutão) | Sinalização de janelas de longo prazo | pendente, aprovado conceitualmente, sem especificação técnica ainda |
| **L4 / L5** | Pontos Trojanos Terra-Lua (Nuvens de Kordylewski) | Par de pontos vazios calculados a ±60° da Lua natal, sem raiz histórica (ver `enciclopedia_simbolos`, slug `pontos-l4-l5`). Cálculo e rótulo técnico cru ("L4"/"L5") já em `planets` (migration 0014), mas SEM rótulo poético Caos Astral ainda, ao contrário de todo outro ponto do sistema (Núcleo, Fome, Exílio etc.) | pendente, mecânica de cálculo fechada, nome de marca em aberto — debater antes de expor em UI de produto além do widget "Céu agora" e do mapa do kit |
| **Território de ofício** | Mapa vocacional/carreira | Recorte do kit focado em território profissional (sem sistema novo) | pendente |
| **Símbolo do grau** | Símbolo Sabiano | Interpretação do grau exato (1°-30°) de um planeta ou cúspide, redigida em voz Caos Astral a partir da base de 1925 (domínio público) | fechado conceitualmente, aguardando redação adaptada dos 360 textos |

## Vocabulário de feature de ação

| Termo | Substitui | Definição | Status |
|---|---|---|---|
| **Âncora de intenção** | Sigilo | Símbolo que fixa uma decisão já tomada, plugado nos dados do kit, sem invocar nada externo | fechado, **atenção:** documentos técnicos antigos ainda podem citar "sigilo"; corrigir em qualquer schema/código existente |
| **Dashboard** | — | O ecossistema do usuário logado. Não é uma tela a mais no menu, é o espaço central pra onde o `ritual-de-entrada` (join/register) leva depois de aberto o Kit. Reúne todos os produtos (Kit, Retorno, Ressonância, Âncora, Deriva, Oráculo) e o Diário como camada que atravessa todos eles | fechado (decisão do fundador, 30/07) |
| **Diário** | Diário de gnose | Registro privado do usuário, de **qualquer experiência** (não só entéogênica, não mais restrito a uso da Âncora). Pode ou não estar ligado a um produto específico (Âncora, Deriva, Oráculo) via `produto_relacionado` opcional | **redefinido (30/07)**, substitui a definição anterior "ligado a práticas de foco/estado alterado no uso da âncora" — decisão do fundador de abrir o escopo pra qualquer experiência dentro do ecossistema do Dashboard |

## Vocabulário relacional

| Termo | Substitui | Definição | Status |
|---|---|---|---|
| **Câmara de ressonância** | Sinastria | Sobreposição de dois kits, onde os dois se tocam, ponto a ponto | fechado |
| **O Terceiro** | Mapa composto | O que nasce do encontro, terceira entidade com kit próprio (pontos médios) | fechado |

## Sistemas externos (tradições não-astrológicas)

| Termo | Tradição de origem | Tratamento | Status |
|---|---|---|---|
| **I Ching / Oráculo** | Chinesa, tradução James Legge (1882, domínio público) | Produto **separado e claramente rotulado**, nunca fundido ao vocabulário do kit. Hexagrama, trigrama e linha mutante mantêm nomenclatura própria da tradição, não traduzir pro vocabulário Caos Astral, mas também não apresentar como se fosse parte do mesmo sistema | standby, decisão de tratamento (rotular como tradição separada vs. traduzir vocabulário) ainda não fechada com o usuário. Agente de I Ching não deve nomear peças do sistema em termos de "núcleo/fricção/corrente" |
| **Tarot, runas, outros oráculos** | Diversas | Fora de escopo, por decisão de posicionamento | rejeitado, não desenvolver |
| **Numerologia** | Sistema próprio (nome/data reduzidos a número) | Fase futura, exigiria vocabulário e motor de cálculo próprios com mesmo rigor dado a Quíron | standby |

## Cosmologia (usada em textos filosóficos/manifesto, não em UI de produto)

| Termo | Tradição de referência | Uso |
|---|---|---|
| **O Eu único / atemporal** | Advaita Vedanta, Hermetismo, Jung (Self), Neoplatonismo | Fundamenta de onde vem a intuição/leitura, citado como padrão transcultural, nunca como sistema fechado emprestado |
| **Intento** *(termo novo, ver nota abaixo)* | Carlos Castaneda / tradição do "homem de conhecimento" | Pendente, ver seção de nota |

**Nota sobre "intento":** você trouxe isso na conversa mais recente como possível pilar adicional da cosmologia. Ainda não está integrado ao manifesto nem ao produto, é candidato a se juntar à seção "de onde vem a leitura", como mais uma tradição que aponta pro mesmo padrão (força impessoal, acessível por disciplina/vontade, não por fé ou entidade). Não usar em código ou copy até decidirmos formalmente incluir.

---

## Regra de ouro pra qualquer conta nova entrando no projeto

Antes de nomear qualquer feature, tabela ou variável: checar esta tabela primeiro. Se o termo não existe aqui, não inventar, perguntar. Isso existe justamente pra evitar o que quase aconteceu com "sigilo" virando nome de tabela enquanto o produto inteiro já tinha migrado pra "âncora de intenção".
