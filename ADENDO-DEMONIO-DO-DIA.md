# ADENDO: demônio do dia

Registro de 20/09/2026. Segue a regra do `claude.md`: nenhuma mudança de schema sem registro prévio, e termo fora do glossário só entra em produção depois de decisão do fundador.

## 1. O que entra

| Arquivo | Onde vai | Fase | Depende de banco |
|---|---|---|---|
| `demonio-do-dia.html` | raiz | 1 | não |
| `demonios-joao.json` | `assets/` | 1 | não |
| `corpo-vesalius.webp` | `assets/` | 1 | não |
| `0017_demonio_checkins.sql` | `supabase/migrations/`, só quando a fase 2 for aprovada | 2 | sim |

A integração GitHub com Supabase aplica sozinha tudo que entra em `supabase/migrations/` na `main`. Por isso a 0017 ficou fora do commit da fase 1 e só entra no repo quando a fase 2 for aprovada.

A fase 1 é pública, sem login e sem tabela. O cálculo roda no navegador com `astronomy-engine@2.1.19`, a mesma versão de `ceu-agora.js`. Usa a posição geocêntrica do Sol (`GeoVector` + `Ecliptic`, nunca `EclipticLongitude`) e a da Lua para Sofia e Saklas (±60°).

## 2. O produto em uma frase

O Apócrifo de João nomeia um poder para cada parte do corpo, 72 entradas na tradução usada. O Caos Astral associa cada entrada a uma faixa de 5° da eclíptica, e o demônio do dia é o da faixa onde o Sol está. A correspondência é decisão de design, não consta no texto.

Separação de fontes (espinha epistemológica do site), marcada na própria página:
- **Do texto:** nome e parte do corpo.
- **Calculado:** longitude do Sol, da Lua, de Sofia e de Saklas, e o elemento de cada uma.
- **Autoral:** gatilho de cada entrada e regra de irritabilidade.

## 3. Propostas para o glossário (todas `pendente`)

| Termo | Definição proposta | Observação |
|---|---|---|
| **Demônio do dia** | Entrada da lista do Apócrifo de João cuja faixa de 5° contém o Sol | Termo novo. Não codar como oficial antes de fechar |
| **Gatilho** | Frase autoral por entrada: onde a atenção tende a se prender quando aquela parte do corpo está em foco | Sempre "gatilho a observar", nunca previsão |
| **Ondas de hoje** | Gráfico hora a hora do tema de Saklas (atrito) e de Sofia (abertura) | Regra de irritabilidade v0, autoral e provisória |

O glossário marca L4/L5 como `pendente, nome de marca em aberto`. A página expõe "Sofia" e "Saklas", como o widget Céu agora já faz. Registrar a decisão sobre o nome antes de ampliar o uso.

A página não usa "janela" para Sofia. "Janela" continua sendo só trânsito do dia.

## 4. Decisões que dependem do fundador

1. Fechar o termo "demônio do dia" no glossário.
2. Fechar Sofia e Saklas como nomes exibidos em UI.
3. Link no menu. Feito em 20/09: item "Demônio do dia" no grupo Ferramentas de `assets/site-chrome.js`, depois de Oráculo. O menu canônico passou de 12 para 13 itens. Se o nome mudar no glossário, mudar só o `NAV_GROUPS`.
4. Revisar os 72 gatilhos e a regra v0 de irritabilidade (Fogo alta, Terra e Ar médias, Água baixa). Atenção ao tom das entradas 55 e 56.
5. Direitos da tradução. A página traz só nomes e partes do corpo, sem reproduzir o texto. Para trazer trechos, é preciso licença do tradutor ou tradução própria a partir do copta.
6. Conferir na sinopse Waldstein e Wisse as entradas 17, 19 (nomes perdidos), 20, 21, 53, 54, 59 (leituras incertas) e 72 (sem parte). Os nomes variam entre os manuscritos BG, II, III e IV.
7. Figura. A página usa uma gravura de Vesalius (De humani corporis fabrica, 1543) no lugar da silhueta, convertida em traço claro sobre fundo transparente (`assets/corpo-vesalius.webp`, 174 KB). A gravura é de domínio público, mas vale confirmar a procedência do arquivo original enviado. As 72 posições dos pontos foram calibradas a olho sobre a imagem e precisam de revisão anatômica, principalmente as de órgãos internos (coração, fígado, baço, rins), que só estão indicadas por região.
8. Goécia. A página tem um parágrafo que distingue a lista do Apócrifo da Ars Goetia (outra lista de 72 nomes) e explica que a divisão em faixas de 5° é a mesma que ocultistas dos séculos XIX e XX aplicaram aos espíritos da Goécia e aos 72 anjos do Shem ha-Mephorash. Conferir essa afirmação sobre a tradição posterior antes de ampliar o texto.

## 5. Fase 2: check-in e clima coletivo

Fluxo: o check-in vem antes do card (registro cego), depois o demônio do dia e as ondas, e à noite um fechamento opcional.

Texto para colar em `claude.md`, seção 4, quando a fase 2 for aprovada:

```
### demonio_checkins (0017, fase 2, ainda NÃO aplicada)
- Dado de usuário, RLS privada por auth.uid(), chave `user_id`.
- Colunas: dia, momento ('antes'|'noite'), valencia e ativacao (0 a 10),
  viu_demonio_antes, entra_no_coletivo (opt-in, padrão false),
  regiao_demonio_n (1 a 72), intencao (privada, até 500 caracteres),
  demonio_n, sol_lon, lua_lon, aviso_fez_sentido, diario_id.
- unique (user_id, dia, momento): upsert por dia e momento.
- Insert exige profiles.consentimento_sensivel_aceito_em (0010).
- anon sem nenhum acesso. Coletivo só via demonio_clima_coletivo(date):
  security definer, só registros cegos com opt-in, média e desvio só com
  pelo menos 20 registros, abaixo disso apenas a contagem.
- sol_lon e lua_lon vêm do cliente e não são auditados. O cruzamento com
  o céu deve recalcular por dia no servidor.
```

Antes de aplicar a 0017:
- Atualizar `privacidade.html`. Hoje ela diz que o conteúdo do Diário não é usado para nada além de exibi-lo. O check-in é outra tabela e tem uso agregado opcional, e a página precisa descrever isso: dado sensível, opt-in por registro, mínimo de 20, sem linha individual.
- Incluir na tela de check-in aviso de que o app não substitui atendimento, com o CVV (188) sempre visível, e alerta para sintomas físicos como dor no peito e falta de ar. O objetivo é evitar que sintoma vire "leitura".
- Evitar, na copy, "memória falsa" e qualquer personificação que sugira entidade externa vigiando a pessoa.

## 6. Como foi testado

- Página em jsdom com `astronomy-engine` real. Em 20/09/2026 o Sol fica a 27,7° de Virgem, faixa de 175° a 180°, e o demônio do dia é o 36 (Barias, quadril direito). Nas viradas de março a faixa fecha em 72 e recomeça em 1. Toque na figura, botões e "Voltar ao de hoje" funcionam.
- Sofia e Saklas em 20/09/2026 ficam em Água o dia todo, coerente com a Lua em Capricórnio.
- SQL da 0017 validado com o parser do PostgreSQL, sem erros. Não foi executado no Supabase.
- O visual não foi conferido em navegador real. Vale abrir em celular e no desktop antes de publicar.

## 7. Ordem sugerida

1. Subir `demonios-joao.json` e `demonio-do-dia.html` e abrir a página.
2. Fechar termos no glossário e registrar este adendo no `claude.md`.
3. Revisar gatilhos e conferir os nomes na sinopse.
4. Atualizar `privacidade.html`, depois aplicar a 0017 e montar a tela de check-in.
5. Personalização com o mapa natal e clima coletivo, quando houver 20 registros por dia.
