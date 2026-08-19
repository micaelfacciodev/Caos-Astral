// l4l5.ts
// Pontos L4 e L5 (Trojanos) do sistema Terra-Lua — onde ficam as Nuvens de
// Kordylewski. Ver enciclopedia_simbolos, slug "pontos-l4-l5".
//
// MÉTODO: diferente de Quíron (elementos keplerianos próprios) ou da
// Lilith verdadeira (apogeu osculador, precisa de vetor de excentricidade),
// L4 e L5 NÃO têm mecânica orbital própria. Por definição (Lagrange, 1772),
// são os dois vértices que fecham um triângulo equilátero com os dois
// corpos primários — aqui, Terra e Lua. Isso significa que a posição deles
// é sempre exatamente ±60° da longitude eclíptica geocêntrica da Lua no
// instante dado, nada mais que isso. Não precisa resolver Kepler, não tem
// excentricidade, não tem período próprio (eles "seguem" a Lua).
//
// L4 leva a convenção de "adiantado" (+60°, na direção do movimento da
// Lua) e L5 de "atrasado" (-60°) — mesma convenção usada pros Trojanos de
// Júpiter (campo grego/campo troiano) e pelos artigos de referência sobre
// as Nuvens de Kordylewski (Slíz-Balogh et al. 2019).
//
// APROXIMAÇÃO ACEITA: a posição exata das nuvens de poeira reais oscila
// (libração) em torno desses pontos por causa da perturbação solar — não
// ficam cravadas exatamente em 60°. Pra uso astrológico (posição simbólica,
// não rastreamento de poeira cósmica de verdade), a aproximação de 60°
// exatos é suficiente e é a mesma simplificação que a literatura de
// divulgação usa. Documentar aqui caso um dia alguém queira refinar com
// o modelo de libração completo (não trivial, ver Slíz-Balogh 2019).
//
// LOCAL NO REPO: raiz (./l4l5.ts), igual a lilith.ts — NÃO em
// supabase/functions/_shared/, apesar do que o glossário e comentários
// mais antigos sugerem. Isso espelha de propósito onde lilith.ts REALMENTE
// está hoje (raiz), não onde a documentação diz que devia estar — os dois
// arquivos já divergiam do caminho "oficial" antes desta mudança, ver
// claude.md linhas ~190-210: a tentativa de import via _shared/lilith.ts
// quebrou o deploy 2x ("Module not found") porque o editor de Edge
// Function do Dashboard do Supabase não resolve import de arquivo externo
// dentro da mesma function. Por isso o código real do lado do servidor
// vive INLINE, copiado e colado dentro de cada index.ts (compute-natal-
// chart, compute-daily-window, compute-synastry) — não como import deste
// arquivo. Este arquivo aqui é a fonte de referência única/legível pra
// copiar dali, igual lilith.ts já funciona hoje. Ver claude.md pra
// instruções de onde colar em cada function.
export interface L4L5Result {
  /** Longitude eclíptica de L4 (grau 0-360), 60° adiantado da Lua. */
  l4: number;
  /** Longitude eclíptica de L5 (grau 0-360), 60° atrasado da Lua. */
  l5: number;
}

const norm360 = (x: number) => ((x % 360) + 360) % 360;

/**
 * Calcula L4 e L5 a partir da longitude eclíptica geocêntrica da Lua.
 *
 * @param moonLongitude Longitude eclíptica da Lua (0-360) — o mesmo valor
 *   que a function já calcula pra plotar a Lua no mapa, não é uma nova
 *   chamada astronômica, é derivado do dado que o motor já tem.
 */
export function computeL4L5(moonLongitude: number): L4L5Result {
  return {
    l4: norm360(moonLongitude + 60),
    l5: norm360(moonLongitude - 60),
  };
}
