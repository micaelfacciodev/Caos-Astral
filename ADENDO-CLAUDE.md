# ADENDO CLAUDE.md — Sincronização pós-auditoria (Front ↔ Engine ↔ I Ching)

Cole este bloco no topo do CLAUDE.md existente, ou substitua as seções
correspondentes (1, 4, 7) pelo conteúdo abaixo. Motivo: auditoria do repo
encontrou deriva de vocabulário entre o front (já alinhado com o glossário
oficial) e o CLAUDE.md do engine (ainda usando termos antigos ou inventando
sinônimos não aprovados).

---

## Correção 1 — Vocabulário oficial (substituir a tabela da seção 1)

A tabela de vocabulário atual tem três problemas: usa "sigilo" (deveria
ser **âncora de intenção**, decidido há várias sessões), inventa sinônimos
não aprovados ("tensão de eixo", "corrente leve", "fusão"), e não lista
Retorno, O Terceiro, Território de ofício e Cena do grau, que já existem
no glossário oficial.

**Tabela corrigida — usar exatamente estes termos, sem variação:**

| Termo tradicional | Termo Caos Astral |
|---|---|
| Signo solar | **núcleo** |
| Signo lunar | **fome** |
| Ascendente | **máscara** |
| Aspecto tenso (quadratura/oposição) | **fricção** |
| Aspecto harmônico (trígono/sextil) | **corrente** |
| Conjunção | *(sem termo próprio ainda — tratar como caso especial de fricção/corrente conforme os planetas envolvidos, não usar "fusão")* |
| Trânsito do dia | **janela** |
| Trânsito semanal/mensal/anual | **janela estendida** |
| Casa astrológica | **território** |
| Recorte vocacional/carreira (casa 6/10) | **território de ofício** |
| Retrogradação | **eco** |
| Quíron | **cicatriz** |
| Revolução solar (mapa do ano) | **retorno** |
| Compatibilidade / sinastria | **câmara de ressonância** |
| Mapa composto (pontos médios, duas pessoas) | **o terceiro** |
| Interpretação autoral por grau exato (1º–30º) | **cena do grau** — NUNCA "símbolo sabiano" ou "sabian" em qualquer lugar |
| Sigilo / símbolo de intenção | **âncora de intenção** — NUNCA "sigilo" em código, schema ou UI |

Se surgir necessidade de um termo novo, ele **não entra em uso** até ser
adicionado ao `glossario-caos-astral.md` primeiro. Nenhum agente cria
sinônimo próprio, mesmo que pareça mais preciso.

---

## Correção 2 — Renomear tabela e referências de sigilo (seção 4)

`sigil_journal` deve ser renomeada. Sugestão: `intent_anchors`.

Isso implica:
- Migration de rename (ou nova tabela + migração de dado, se já houver
  linhas em produção).
- Atualizar toda referência a "sigilo"/"sigil" no texto do CLAUDE.md,
  nomes de coluna, comentários de código e Edge Functions.
- A ferramenta de geração do símbolo em si continua externa ao Supabase
  (como já documentado) — só o nome do armazenamento muda.

---

## Correção 3 — Renomear tabela de graus (seção 4)

`graus_simbolicos` deve virar **`cenas_grau`** (ou equivalente), para
bater com o nome fechado no glossário (**Cena do grau**, não "Símbolos
Sabianos" nem "graus simbólicos" genérico). Campos internos (`signo`,
`grau`, `decanato`, `tempero`, `imagem`, `leitura`, `versao`) continuam
os mesmos — é renomeação de tabela, não de schema interno.

Confirmar que a pasta `graus-caos-astral/` no repo (fonte dos JSONs) já
segue essa nomenclatura nos textos gerados — o nome do diretório em si
pode ficar como está, o que importa é a tabela final no Supabase e
qualquer rótulo exposto ao usuário.

---

## Correção 4 — Tabelas pendentes: Retorno e O Terceiro

O schema atual cobre `natal_charts` (kit) e `synastry_readings` (câmara
de ressonância), mas não tem cobertura explícita para:

- **Retorno** (revolução solar): precisa de tabela própria ou de lógica
  de recálculo anual dentro de uma tabela existente — uma linha por
  usuário por ano, recalculada automaticamente na data em que o núcleo
  natal é recruzado. Sugestão de nome: `solar_returns`
  (`user_id`, `ano`, `data_exata`, `planetas` jsonb, `aspectos` jsonb,
  RLS privado).
- **O Terceiro** (mapa composto): diferente de sinastria — usa pontos
  médios entre dois mapas, não sobreposição direta. Precisa de Edge
  Function própria e, provavelmente, uma tabela própria ou campo
  adicional dentro de `synastry_readings` (ex: coluna `composite_chart`
  jsonb). Decidir com o time se cabe na mesma tabela ou merece tabela
  própria antes de implementar.

Ambas ainda **não têm Edge Function**. Adicionar à lista de pendências
da seção 7.

---

## Correção 5 — Oráculo (I Ching): decisão de identidade visual

Decisão tomada: **por ora, o Oráculo mantém identidade visual própria**
(paleta papel/tinta/cinábrio, serifada), deliberadamente diferente do
resto do site. Foco atual é funcionalidade, não padronização visual —
isso fica para uma fase posterior de unificação de layout (já listada
como pendência na seção 7 do CLAUDE.md original).

Ação imediata de organização de arquivos:
- **Duas páginas de história do I Ching foram fundidas em uma só**:
  `origens-do-iching.html` (linha do tempo, lendas, métodos de consulta,
  citação do "Homem Superior" — conteúdo do agente de I Ching) +
  `raizes-i-ching.html` (moldura editorial: por que o vocabulário do
  Oráculo não se mistura com o do kit — conteúdo do front). O arquivo
  fundido usa o nome `raizes-i-ching.html` e a identidade visual
  papel/cinábrio. **Apagar `origens-do-iching.html` do repo** — está
  substituído.
- `oraculo.html` (versão antiga, dentro do design system escuro do
  site, estática) fica obsoleta agora que `i-ching.html` é a versão
  funcional real. Avaliar se `oraculo.html` deve virar um simples
  redirecionamento/link para `i-ching.html`, ou ser removida — decisão
  do time, não urgente.
- `raizes.html` (hub de Raízes) deve linkar para `raizes-i-ching.html`
  (já corrigido do lado do front) — conferir se o link aponta pro
  arquivo certo depois da fusão.

---

## Correção 6 — Limpeza de arquivo obsoleto

Apagar `caos-astral-landing.html` (versão single-file antiga da
landing). `index.html` + `assets/style.css` são a fonte de verdade
atual — dois arquivos de landing coexistindo é fonte de confusão sobre
qual é o real.

---

## Resumo de ações (checklist pra quem for aplicar)

- [ ] Substituir tabela de vocabulário na seção 1 do CLAUDE.md
- [ ] Renomear `sigil_journal` → `intent_anchors` (+ migration)
- [ ] Renomear `graus_simbolicos` → `cenas_grau` (+ migration)
- [ ] Criar tabela/lógica para `solar_returns` (Retorno)
- [ ] Decidir e implementar armazenamento de O Terceiro (tabela própria
      ou coluna em `synastry_readings`)
- [ ] Apagar `origens-do-iching.html` (substituído pela versão fundida
      de `raizes-i-ching.html`)
- [ ] Decidir destino de `oraculo.html` (redirecionar ou remover)
- [ ] Apagar `caos-astral-landing.html`
- [ ] Adicionar Edge Functions pendentes (sinastria já estava
      pendente; agora também Retorno e O Terceiro) à seção 7
