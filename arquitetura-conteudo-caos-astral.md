# Caos Astral, Arquitetura de Conteúdo e Crescimento

Como o site cresce além do produto (kit, janela, retorno etc.) sem virar catálogo raso, mantendo a mesma disciplina aplicada ao resto do sistema: cada peça nova precisa devolver agência, e precisa citar proveniência com honestidade, nunca apagar autoria.

---

## Mapa do site (visão geral de navegação)

```
Caos Astral
├── / (landing)
├── /manifesto                    → já escrito
├── /intento                      → visão pessoal, o "porquê" por trás de tudo
├── /ritual-de-entrada             → onboarding, antes do Kit
├── /kit                          → produto: mapa individual
├── /retorno                      → produto: mapa do ano
├── /ressonancia                  → produto: sinastria + O Terceiro
├── /ancora                       → produto: âncora de intenção
├── /deriva                       → produto: diário/laboratório fenomenológico
├── /oraculo                      → produto: I Ching (rotulado como tradição separada)
├── /raizes                       → seção de história e proveniência
│   ├── /raizes/magia-do-caos
│   ├── /raizes/astrologia
│   ├── /raizes/i-ching
│   ├── /raizes/cena-do-grau       (antiga /raizes/simbolos-sabianos, ver nota abaixo)
│   └── /raizes/berilo-faccio      → biografia do pai, proveniência real (ver seção 1)
├── /enciclopedia                 → verbetes por pergunta fundamental, não por tradição (nova, alta prioridade)
├── /diario                       → diário privado do usuário (logado)
├── /blog                         → textos, ensaios, artigos
├── /planos                       → pricing
└── /admin-*                      → hub de admin (símbolos, I Ching), uso interno, fora do fluxo de usuário
```

> Nota de nomenclatura: "cena do grau" é o sistema autoral do produto, criado
> para não colidir com o mapeamento grau-a-grau de Marc Edmund Jones (1953)
> e Dane Rudhyar (1936), que continua protegido por direito autoral. Não usar
> "símbolo(s) sabiano(s)" em nenhuma copy pública, regra já fixada no
> `CLAUDE.md`, seção 3.

---

## 1. `/intento`, visão pessoal (nova página, separada do manifesto)

O manifesto responde "o que é Caos Astral, filosoficamente". Falta uma página que responda outra pergunta, mais pessoal: **por que você, especificamente, está fazendo isso.** Não é redundante com o manifesto, é a diferença entre doutrina e biografia. Alguém cético de "manifesto de app" pode confiar numa história pessoal de um jeito que não confia em texto filosófico genérico.

**Conteúdo sugerido:**
- O pai professor de astrologia, a proveniência real
- O incômodo com o senso comum da astrologia como milagre/desculpa
- A recusa consciente de servidores/entidades emprestadas
- **Intento** entra aqui com força, espaço pra desenvolver a ideia de Castaneda: o que "intento" quer dizer, por que aponta pra algo real mesmo com origem controversa, e como vira prática (não crença) dentro do produto

Se algum dia houver entrevista, citação, viralização, essa é a página que resolve "quem é a pessoa por trás disso".

> **Decidido (29/07): sem anonimato.** Nome e cara reais, herança do pai
> citada abertamente (nome completo, "Estudos Astrológicos"). `/intento` e
> `/raizes/berilo-faccio` liberadas pra edição normal, não é mais preciso
> checar com o autor antes de mexer em conteúdo biográfico nessas páginas.

---

## 2. `/raizes`, história e proveniência

Cumpre duas funções: **honestidade intelectual** (nada foi inventado do zero fingindo originalidade) e **diferenciação de marketing** (exige pesquisa real, não só copy bonito).

### `/raizes/magia-do-caos`
- Origem do termo, Peter Carroll e a Illuminates of Thanateros; Austin Osman Spare como precursor do sigilo-sem-entidade décadas antes
- Crença como ferramenta descartável, não verdade fixa
- Onde Caos Astral diverge do estereótipo popular (sem servidores/entidades emprestadas)

### `/raizes/astrologia`
- Origem babilônica, sistematização helenística, os ramos do campo (ocidental tropical, o que o produto usa)
- Por que a escolha pela leitura tática em vez da preditiva, astrologia sempre teve as duas vertentes

### `/raizes/i-ching`
- Tradução de James Legge (1882), domínio público, crédito explícito
- Contexto: sistema chinês antigo, cosmologia própria (Tao, yin/yang), tradição separada, tratada com o mesmo respeito de proveniência, sem fingir que nasceu dentro do sistema Caos Astral

### `/raizes/cena-do-grau` *(renomeada de `/raizes/simbolos-sabianos`)*
- **Não é o sistema de Jones/Wheeler.** "Cena do grau" é interpretação
  autoral própria do Caos Astral, criada justamente para não reproduzir o
  mapeamento grau-a-grau protegido por direito autoral (Jones, 1953;
  Rudhyar, 1936). Esta página deve deixar essa distinção explícita, não
  apagá-la, citar a existência da tradição de símbolos por grau como
  contexto histórico, sem apresentar a "cena do grau" como sendo a mesma
  coisa com nome trocado.
- A proveniência real e verificável do produto (o material do pai) mora
  na página separada `/raizes/berilo-faccio`, não aqui.

**Padrão de citação pra toda a seção:** nome do autor original, ano, status de domínio público, e frase clara tipo "o texto original está em domínio público; a interpretação abaixo foi adaptada para a voz Caos Astral".

---

## 3. `/enciclopedia`, verbetes por pergunta fundamental

Diferente de `/raizes` (organizada por tradição/proveniência histórica),
a Enciclopédia é organizada por **pergunta filosófica**: o que é um
símbolo, um mapa, uma previsão, um arquétipo, uma prática, uma crença,
consciência, interpretação. Tradições diferentes (astrologia, I Ching,
cena do grau, Deriva) entram como respostas diferentes pra mesma
pergunta, não como categorias separadas.

**Estado atual:** página índice + 8 verbetes criados como stub, cada um
com framing de 2 parágrafos e aviso explícito de "em construção". Alta
prioridade de aprofundamento (ver `CLAUDE.md`).

**Verbetes:**
1. `enciclopedia-simbolo.html`
2. `enciclopedia-mapa.html`
3. `enciclopedia-previsao.html`
4. `enciclopedia-arquetipo.html`
5. `enciclopedia-pratica.html`
6. `enciclopedia-crenca.html`
7. `enciclopedia-consciencia.html`
8. `enciclopedia-interpretacao.html`

Cada verbete novo deve manter o padrão: pergunta no `<h1>`, framing curto
de 1-2 frases no `.sub`, e corpo em `.prose` que cruza tradições sem
tratar nenhuma como dona da resposta certa.

---

## 4. `/blog`

Posts organizados por tag ligada ao vocabulário fechado (#fricção, #eco, #cicatriz, #retorno), não categorias genéricas. Reforça vocabulário a cada navegação e cria trilha de SEO em termos que só o produto usa.

**Primeiros posts sugeridos:**
1. "Por que eco não é sabotagem" (poema + reconsolidação de memória)
2. "O que Quíron tem a ver com curar os outros" (cicatriz, curador ferido, circuito de dor/prazer)
3. "Intento: a diferença entre rezar e alinhar" (Castaneda, sem afirmar que Don Juan existiu)
4. "Por que não tem anjo nem entidade aqui" (a ausência como posição, não lacuna)

---

## 5. `/diario`, diário do usuário (privado, logado)

Já está no escopo técnico ("diário de gnose"). Decisões de produto a fechar antes do código avançar:

- **Estrutura de entrada:** livre ou guiada? Meio-termo recomendado, campo livre, com prompt opcional ligado à janela do dia
- **Ligação com Eco:** histórico datado vira material bruto pra feature de eco, "aqui está o que você escreveu na última vez que teve esse trânsito"
- **Ligação com Retorno:** no aniversário anual, puxar o que a pessoa escreveu um ano atrás, fecha o círculo do poema, dentro do produto, não só na filosofia

---

## Prioridade de construção (frontend)

| Página | Urgência | Por quê |
|---|---|---|
| `/manifesto` | já existe |, |
| `/intento` | já existe | Identidade resolvida (sem anonimato, 29/07), só falta revisão de texto se necessário |
| `/raizes/*` | já existe | Inclui `/raizes/berilo-faccio` e `/raizes/cena-do-grau` (renomeado) |
| `/enciclopedia` | **alta** | 8 verbetes criados como stub (29/07), prioridade é aprofundar conteúdo real, não estrutura |
| `/blog` | média | Motor de SEO de longo prazo; não bloqueia MVP |
| `/diario` | alta (depende do resto do produto) | Já está no escopo técnico; decisão de UX vale fechar antes do agente de código avançar |
