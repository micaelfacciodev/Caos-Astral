# Integrar L4/L5 nas Edge Functions — instruções manuais

## Por que isto não é um patch automático

`compute-natal-chart`, `compute-daily-window` e `compute-synastry` não
estão neste repositório (confirmado em `claude.md`: só existe
`supabase/migrations/`, o código das functions vive só no Dashboard do
Supabase). Além disso, o Dashboard não resolve import de arquivo externo
dentro da mesma function — a tentativa de usar `_shared/lilith.ts` via
import quebrou o deploy duas vezes ("Module not found"). Por isso o
método real, documentado e já em uso pra Quíron e Exílio, é: código
**embutido diretamente em cada `index.ts`**, colado à mão.

Este arquivo é o equivalente, pra L4/L5, do que `lilith.ts` já é pra
Exílio: a fonte de referência única e legível pra copiar dali. Sem
acesso ao código-fonte atual das três functions, não dá pra gerar um
diff exato — o bloco abaixo é pra colar no ponto onde Quíron/Exílio já
são calculados e empurrados pro array de pontos (mesmo padrão que
`claude.md` descreve pra integração deles).

## O bloco a colar (idêntico nas 3 functions, TypeScript/Deno)

Colar perto de onde a longitude da Lua já é calculada — L4/L5 dependem
só dela, nenhuma chamada nova ao `astronomy-engine`:

```ts
// L4 e L5 (Trojanos Terra-Lua / Nuvens de Kordylewski) — ver l4l5.ts
// no repo pra explicação completa do método. Não têm mecânica orbital
// própria: são sempre ±60° da longitude da Lua no instante (Lagrange,
// 1772). `moonLongitude` abaixo deve ser a MESMA variável que a
// function já usa pra plotar o corpo Lua — não recalcular do zero.
function norm360L4L5(x: number): number {
  return ((x % 360) + 360) % 360;
}
const l4Longitude = norm360L4L5(moonLongitude + 60);
const l5Longitude = norm360L4L5(moonLongitude - 60);
```

Depois, empurrar pro mesmo array/estrutura que recebe os outros pontos
(o formato exato depende do que `chart.planetas` espera hoje — em
`compute-natal-chart`, pelo que `kit.html` consome, cada item precisa
minimamente de `{ chave, longitude, retrogrado, casa }`; `l4`/`l5`
sempre `retrogrado: false`, já que "seguem" a Lua e não têm
movimento próprio pra atrasar):

```ts
pontos.push({ chave: 'l4', longitude: l4Longitude, retrogrado: false, casa: calcularCasa(l4Longitude) /* mesma função já usada pros outros pontos */ });
pontos.push({ chave: 'l5', longitude: l5Longitude, retrogrado: false, casa: calcularCasa(l5Longitude) });
```

Ajustar nome da variável (`pontos`, `planetas`, o que for) e o nome da
função de casa pro que já existe em cada function — não tenho o
arquivo real pra confirmar esses nomes.

## Onde colar em cada function

- **`compute-natal-chart`**: junto de onde Quíron/Exílio entram no
  array retornado como `chart.planetas`. Sem isso, `kit.html` nunca
  vai ter `l4`/`l5` pra desenhar (já preparado do lado do front, ver
  `PLANET_GLYPHS`/`PLANET_ORDER` atualizados neste patch).
- **`compute-daily-window`**: junto de onde o trânsito de Exílio entra
  no cálculo de aspectos contra o natal — mesma lógica, L4/L5
  natais recebem trânsito como qualquer outro ponto.
- **`compute-synastry`**: junto de onde Exílio entra nos aspectos
  cruzados e no ponto médio de O Terceiro.

## Pré-requisito

Rodar `supabase/migrations/0014_l4_l5_planetas.sql` (linhas `l4`/`l5`
em `planets`) **antes** de deployar as três functions — sem isso,
qualquer lookup de rótulo por chave volta `undefined`, mesmo problema
documentado em `claude.md` pra Exílio quando a `0009` ainda não tinha
rodado.

## Validação sugerida

Mesma recomendação que ficou pendente pra Exílio (`claude.md`, seção
5): antes de considerar isso pronto, pegar 2-3 datas de nascimento
reais, calcular a longitude da Lua ali (astro.com ou qualquer
efeméride), somar/subtrair 60° manualmente, e comparar com o que a
function devolve. Como L4/L5 aqui são derivação aritmética direta da
Lua (não uma órbita própria resolvida), o erro esperado é
essencialmente zero — qualquer divergência maior que segundos de arco
indica bug na variável `moonLongitude` usada (ex: pegando a Lua errada,
ou uma Lua já rotacionada/deslocada por engano).
