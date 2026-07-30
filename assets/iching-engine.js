const TRIGRAMS = {
  qian:{symbol:'☰', nome:'Céu',      code:'111'},
  kun: {symbol:'☷', nome:'Terra',    code:'000'},
  zhen:{symbol:'☳', nome:'Trovão',   code:'100'},
  kan: {symbol:'☵', nome:'Água',     code:'010'},
  gen: {symbol:'☶', nome:'Montanha', code:'001'},
  xun: {symbol:'☴', nome:'Vento',    code:'011'},
  li:  {symbol:'☲', nome:'Fogo',     code:'101'},
  dui: {symbol:'☱', nome:'Lago',     code:'110'},
};

const HEXAGRAMS = [
{n:1,u:'qian',l:'qian',py:'Qian',pt:'O Criativo',t:'Força pura e ininterrupta. Momento de iniciativa, liderança e ação alinhada com um propósito elevado. O céu gira sem cansar-se, persista com integridade e a energia criativa encontrará seu caminho.'},
{n:2,u:'kun',l:'kun',py:'Kun',pt:'O Receptivo',t:'Terra que sustenta tudo. Tempo de receptividade, paciência e devoção ao invés de iniciativa própria. O sucesso vem de seguir, apoiar e nutrir, não de forçar. Ceda espaço para que as coisas amadureçam.'},
{n:3,u:'kan',l:'zhen',py:'Zhun',pt:'Dificuldade Inicial',t:'Como um broto rompendo a terra dura, o começo é confuso e cheio de obstáculos. Não avance sozinho: busque aliados e organize-se antes de agir. A dificuldade presente é sinal de crescimento, não de fracasso.'},
{n:4,u:'gen',l:'kan',py:'Meng',pt:'Loucura Juvenil',t:'Inexperiência diante do desconhecido. É hora de aprender com humildade, aceitar orientação e não fingir saber o que ainda não se sabe. A pergunta sincera abre a porta ao entendimento.'},
{n:5,u:'kan',l:'qian',py:'Xu',pt:'A Espera',t:'O perigo está adiante, mas ainda não é hora de agir. Espere com serenidade e confiança, preparando-se internamente. A paciência nutrida evita o desgaste de uma ação prematura.'},
{n:6,u:'qian',l:'kan',py:'Song',pt:'O Conflito',t:'Tensão entre vontades opostas. Evite levar a disputa até o fim; buscar um meio-termo ou recuar a tempo poupa forças maiores. Vitórias por confronto direto raramente duram.'},
{n:7,u:'kun',l:'kan',py:'Shi',pt:'O Exército',t:'Disciplina coletiva a serviço de um objetivo justo. Um bom líder organiza, não domina; a força só é legítima quando serve ao bem comum e é conduzida com clareza de regras.'},
{n:8,u:'kan',l:'kun',py:'Bi',pt:'Solidariedade',t:'União verdadeira em torno de um centro comum. É tempo de estreitar laços e buscar aliados por afinidade genuína, não por conveniência. Quem chega tarde à união perde a oportunidade.'},
{n:9,u:'xun',l:'qian',py:'Xiao Chu',pt:'Pequeno Domínio',t:'Força contida por circunstâncias momentâneas, como vento que ainda não vira tempestade. Pequenos ajustes e gentileza acumulam efeito; não é hora de grandes empreitadas, mas de refinamento paciente.'},
{n:10,u:'qian',l:'dui',py:'Lu',pt:'O Andar (Conduta)',t:'Caminhar sobre a cauda do tigre sem ser mordido: trata-se de conduta cuidadosa diante de uma força maior. Cortesia, cautela e respeito às hierarquias evitam o perigo.'},
{n:11,u:'kun',l:'qian',py:'Tai',pt:'Paz',t:'Céu e terra em comunhão: prosperidade, harmonia e fluxo livre entre as partes. É tempo favorável para empreender e compartilhar; use a abundância para fortalecer os vínculos, não para acomodar-se.'},
{n:12,u:'qian',l:'kun',py:'Pi',pt:'Estagnação',t:'Céu e terra se afastam: comunicação bloqueada, estagnação social ou pessoal. Não é tempo de grandes ações públicas; recolha-se, cultive a integridade interior e aguarde a virada do ciclo.'},
{n:13,u:'qian',l:'li',py:'Tong Ren',pt:'Companheirismo',t:'Comunhão entre pessoas com um propósito compartilhado e claro, sem panelinhas nem interesses ocultos. Comunidades verdadeiras se formam à luz do dia, com franqueza.'},
{n:14,u:'li',l:'qian',py:'Da You',pt:'Grande Posse',t:'Abundância de recursos, talento ou reconhecimento sob a luz clara do bom caráter. O sucesso pede humildade e generosidade para não se corromper em excesso ou arrogância.'},
{n:15,u:'kun',l:'gen',py:'Qian',pt:'Modéstia',t:'A montanha escondida sob a terra: força real que não precisa se exibir. A modéstia verdadeira, e não a falsa humildade, atrai apoio natural e sustenta o sucesso duradouro.'},
{n:16,u:'zhen',l:'kun',py:'Yu',pt:'Entusiasmo',t:'Movimento que nasce em harmonia com o momento certo, como um trovão que desperta a terra. Entusiasmo genuíno mobiliza pessoas; mas é preciso preparar-se antes de agir para não se dispersar.'},
{n:17,u:'dui',l:'zhen',py:'Sui',pt:'Seguir',t:'Adaptar-se com discernimento às mudanças do momento, sabendo quando liderar e quando seguir. Seguir com sinceridade quem merece confiança traz proveito mútuo.'},
{n:18,u:'gen',l:'xun',py:'Gu',pt:'Trabalho no Corrompido',t:'Algo foi negligenciado e começou a apodrecer, um projeto, uma relação, um hábito. É preciso coragem para reconhecer o dano e paciência para restaurá-lo pela raiz, não apenas na superfície.'},
{n:19,u:'kun',l:'dui',py:'Lin',pt:'Aproximação',t:'Uma influência positiva se aproxima e cresce. É tempo de agir com generosidade e ensinar pelo exemplo, sabendo que toda maré, mesmo favorável, também um dia recua.'},
{n:20,u:'xun',l:'kun',py:'Guan',pt:'Contemplação',t:'Observar antes de agir, como quem sobe a um mirante para ver com clareza. Um líder que se observa a si mesmo com honestidade se torna modelo para os outros sem precisar impor nada.'},
{n:21,u:'li',l:'zhen',py:'Shi He',pt:'Morder e Partir',t:'Há um obstáculo concreto, uma injustiça, um mal-entendido, um impedimento, que precisa ser mordido e partido com firmeza e clareza, não ignorado ou evitado.'},
{n:22,u:'gen',l:'li',py:'Bi',pt:'Graça',t:'Beleza e forma que adornam o conteúdo, mas não o substituem. Cuide da aparência e da elegância nas relações, sem deixar que o ornamento esconda a falta de substância.'},
{n:23,u:'gen',l:'kun',py:'Bo',pt:'Ruptura',t:'Uma estrutura está sendo corroída de baixo para cima, como uma cama cujos pés apodrecem. Não é hora de resistir de frente; recolha-se, preserve o essencial e espere o ciclo se completar.'},
{n:24,u:'kun',l:'zhen',py:'Fu',pt:'Retorno',t:'Depois do declínio, uma nova força começa a retornar, discreta como o primeiro traço yang sob cinco linhas yin. É tempo de recomeçar com simplicidade, sem forçar o ritmo do renascimento.'},
{n:25,u:'qian',l:'zhen',py:'Wu Wang',pt:'Inocência',t:'Agir em sintonia espontânea com o que é correto, sem cálculo nem segunda intenção. Resultados forçados ou manipulados fracassam; a ação genuína e desinteressada é a que floresce.'},
{n:26,u:'gen',l:'qian',py:'Da Chu',pt:'Grande Domínio',t:'Grande força interior contida e disciplinada, como a montanha que guarda o céu. Estudar, acumular experiência e conter os impulsos antes de agir gera um poder duradouro.'},
{n:27,u:'gen',l:'zhen',py:'Yi',pt:'Nutrição',t:'Cuidado com o que se alimenta, literal e figurativamente: palavras, pensamentos, relações. Observe de onde vem seu sustento e o que você oferece aos outros para nutrir-se mutuamente.'},
{n:28,u:'dui',l:'xun',py:'Da Guo',pt:'Grande Excesso',t:'A viga central está sobrecarregada e prestes a ceder: uma situação extraordinária pede medidas extraordinárias, mas com cautela para não colapsar sob o próprio peso.'},
{n:29,u:'kan',l:'kan',py:'Kan',pt:'O Abismal',t:'Perigo repetido, como água que corre sem parar através dos desfiladeiros. A saída não é evitar o abismo, mas atravessá-lo com constância interior, confiando no próprio curso.'},
{n:30,u:'li',l:'li',py:'Li',pt:'O Que se Agarra (Fogo)',t:'A chama precisa de algo a que se agarrar para brilhar, assim como a clareza depende daquilo a que nos dedicamos. Persista com luminosidade e discernimento, evitando o excesso que consome.'},
{n:31,u:'dui',l:'gen',py:'Xian',pt:'Influência',t:'Atração mútua e espontânea, como o lago sobre a montanha. As relações verdadeiras começam por uma sensibilidade recíproca e desinteressada, não por conquista ou insistência.'},
{n:32,u:'zhen',l:'xun',py:'Heng',pt:'Duração',t:'O que perdura não é o que fica parado, mas o que se renova constantemente dentro de um padrão constante, como o trovão e o vento, sempre em movimento, sempre reconhecíveis.'},
{n:33,u:'qian',l:'gen',py:'Dun',pt:'Retirada',t:'Quando as forças contrárias avançam, recuar a tempo com dignidade é sabedoria, não derrota. Preserve energia e princípios retirando-se antes que a situação se torne insustentável.'},
{n:34,u:'zhen',l:'qian',py:'Da Zhuang',pt:'Grande Poder',t:'Força considerável à disposição, mas o poder verdadeiro se mede pelo controle que se tem sobre ele. Use a força apenas de acordo com o que é correto, não pelo simples prazer de exercê-la.'},
{n:35,u:'li',l:'kun',py:'Jin',pt:'Progresso',t:'Avanço rápido e visível, como o sol nascendo sobre a terra. É tempo de reconhecimento e expansão; avance com clareza, mas sem perder a humildade que sustenta o crescimento.'},
{n:36,u:'kun',l:'li',py:'Ming Yi',pt:'Obscurecimento da Luz',t:'A luz está ferida ou oculta por circunstâncias adversas, talvez seja preciso esconder o brilho próprio por um tempo para atravessar um período hostil sem se expor desnecessariamente.'},
{n:37,u:'xun',l:'li',py:'Jia Ren',pt:'A Família',t:'A ordem começa em casa: papéis claros, respeito mútuo e comunicação sincera entre os que convivem próximos formam a base de qualquer ordem maior.'},
{n:38,u:'li',l:'dui',py:'Kui',pt:'Oposição',t:'Duas forças se afastam mesmo compartilhando um mesmo campo. Nas pequenas diferenças ainda há espaço para entendimento; aceite a diversidade sem forçar uma unidade que não existe.'},
{n:39,u:'kan',l:'gen',py:'Jian',pt:'Obstrução',t:'Um obstáculo genuíno bloqueia o caminho à frente. Não adianta insistir de frente; busque um caminho lateral, peça ajuda e use a pausa para se preparar melhor.'},
{n:40,u:'zhen',l:'kan',py:'Jie',pt:'Libertação',t:'A tensão finalmente se rompe e o alívio chega. É hora de perdoar, soltar antigos fardos e agir rapidamente para consolidar a liberdade recém-conquistada antes que novas tensões se acumulem.'},
{n:41,u:'gen',l:'dui',py:'Sun',pt:'Diminuição',t:'Reduzir o que é excessivo embaixo para fortalecer o que é essencial em cima, como poupar hoje para investir no que realmente importa. A simplicidade voluntária tem seu próprio ganho.'},
{n:42,u:'xun',l:'zhen',py:'Yi',pt:'Aumento',t:'Um momento favorável em que o que está acima se dispõe a beneficiar o que está abaixo. Aproveite a maré de apoio para agir com generosidade e iniciativa construtiva.'},
{n:43,u:'dui',l:'qian',py:'Guai',pt:'Ruptura Decidida',t:'Uma última resistência precisa ser superada com determinação, mas sem violência ou arrogância, a firmeza justa, exposta com clareza a todos, prevalece sobre o confronto bruto.'},
{n:44,u:'qian',l:'xun',py:'Gou',pt:'Vir ao Encontro',t:'Um encontro inesperado ou uma influência sutil se insinua. É preciso discernimento para saber se acolher esse encontro fortalece ou corrói a integridade da situação.'},
{n:45,u:'dui',l:'kun',py:'Cui',pt:'Reunião',t:'Pessoas se reúnem em torno de um propósito ou uma liderança comum, como água se acumulando num lago. É tempo de organizar essa energia coletiva com clareza e prevenção contra o imprevisto.'},
{n:46,u:'kun',l:'xun',py:'Sheng',pt:'Ascensão',t:'Crescimento gradual e constante, como uma árvore que sobe da terra sem pressa. O esforço sustentado, passo a passo, é o que realmente eleva, não o salto repentino.'},
{n:47,u:'dui',l:'kan',py:'Kun',pt:'Opressão',t:'Um período de esgotamento ou escassez em que os recursos parecem faltar. A dignidade interior e a serenidade diante da adversidade preservam a força para quando as circunstâncias mudarem.'},
{n:48,u:'kan',l:'xun',py:'Jing',pt:'O Poço',t:'Uma fonte de sustento profunda e constante, disponível a todos que sabem alcançá-la, mas de nada serve o poço se o balde não desce fundo o suficiente ou se quebra no caminho.'},
{n:49,u:'dui',l:'li',py:'Ge',pt:'Revolução',t:'Uma mudança profunda e necessária, como a troca das estações. Só se justifica quando o momento está maduro e conduzida com clareza de propósito, não por impulso ou vaidade.'},
{n:50,u:'li',l:'xun',py:'Ding',pt:'O Caldeirão',t:'Transformação através da preparação cuidadosa, como alimentos cozidos ao fogo lento. É tempo de refinar, nutrir a comunidade e consolidar aquilo que foi construído com cuidado.'},
{n:51,u:'zhen',l:'zhen',py:'Zhen',pt:'O Despertar',t:'Um choque súbito sacode a rotina, como um trovão. O susto inicial é passageiro; quem mantém a serenidade interior mesmo abalado sai fortalecido e mais desperto.'},
{n:52,u:'gen',l:'gen',py:'Gen',pt:'Imobilidade',t:'Parar no momento certo, como a montanha que não se move. A quietude verdadeira não é ausência de vida, mas o ponto de repouso a partir do qual toda ação clara se origina.'},
{n:53,u:'xun',l:'gen',py:'Jian',pt:'Desenvolvimento Gradual',t:'Como uma árvore que cresce devagar até dar frutos sólidos, o progresso duradouro se constrói passo a passo, respeitando o tempo natural de cada etapa.'},
{n:54,u:'zhen',l:'dui',py:'Gui Mei',pt:'A Jovem Noiva',t:'Entrar numa situação em posição subordinada ou irregular exige cautela redobrada e consciência do próprio lugar, para que o que começa desigual não termine em prejuízo.'},
{n:55,u:'zhen',l:'li',py:'Feng',pt:'Abundância',t:'Um momento de plenitude e clareza, como o sol ao meio-dia. É breve por natureza, aproveite a fartura presente com discernimento, sabendo que todo apogeu já contém o declínio.'},
{n:56,u:'li',l:'gen',py:'Lu',pt:'O Viajante',t:'Em terreno alheio, sem raízes fixas, a prudência e a cortesia substituem a força. O viajante que se comporta com modéstia e adaptabilidade encontra acolhida onde quer que vá.'},
{n:57,u:'xun',l:'xun',py:'Xun',pt:'O Suave (Vento)',t:'Influenciar suavemente e de modo repetido, como o vento que penetra sem confrontar. A persistência gentil e a clareza de intenção movem obstáculos que a força direta não moveria.'},
{n:58,u:'dui',l:'dui',py:'Dui',pt:'O Alegre (Lago)',t:'Alegria compartilhada que se multiplica no encontro sincero com os outros. O contentamento verdadeiro nutre e fortalece os vínculos, mas se corrompe quando vira busca vazia de agrado.'},
{n:59,u:'xun',l:'kan',py:'Huan',pt:'Dispersão',t:'Dissolver rigidezes e divisões acumuladas, como o vento que dispersa a névoa sobre a água. É tempo de reunir o que estava fragmentado através de um propósito comum e generoso.'},
{n:60,u:'kan',l:'dui',py:'Jie',pt:'Limitação',t:'Todo rio precisa de margens para seguir seu curso. Limites bem colocados, não excessivos, não ausentes, são o que dá forma e sustentabilidade a qualquer empreitada.'},
{n:61,u:'xun',l:'dui',py:'Zhong Fu',pt:'Verdade Interior',t:'Uma sinceridade que vem do centro do ser e alcança até os que estão distantes, como quem confia mesmo sem certezas externas. A verdade interior, e não a persuasão, é o que realmente comove.'},
{n:62,u:'zhen',l:'gen',py:'Xiao Guo',pt:'Pequeno Excesso',t:'Atenção aos detalhes pequenos e imediatos, sem tentar voos grandes neste momento. Um leve exagero no cuidado, mais modéstia, mais economia, é apropriado agora.'},
{n:63,u:'kan',l:'li',py:'Ji Ji',pt:'Depois da Conclusão',t:'Tudo parece resolvido e em ordem, mas é justamente aqui que o descuido se instala. A conclusão bem-sucedida pede vigilância contínua, pois o equilíbrio alcançado tende a se desfazer se for negligenciado.'},
{n:64,u:'li',l:'kan',py:'Wei Ji',pt:'Antes da Conclusão',t:'Quase lá, mas ainda não: a travessia não terminou. É preciso cautela redobrada exatamente quando o objetivo parece próximo, para não estragar no último passo o que foi conquistado com cuidado.'},
];

const BIN_TO_HEX = {};
HEXAGRAMS.forEach(h=>{
  const bin = TRIGRAMS[h.l].code + TRIGRAMS[h.u].code; // bottom(lower)+top(upper), each already bottom-to-top
  BIN_TO_HEX[bin] = h;
});

function getHexagram(binStr){
  return BIN_TO_HEX[binStr] || null;
}

// ---- casting logic ----
function tossCoin(){
  return Math.random() < 0.5 ? 3 : 2; // 3 = yang face, 2 = yin face
}
function tossLine(){
  const coins = [tossCoin(), tossCoin(), tossCoin()];
  const sum = coins[0]+coins[1]+coins[2];
  return {coins, sum}; // 6,7,8,9
}
function lineIsYang(sum){ return sum===7 || sum===9; }
function lineIsMoving(sum){ return sum===6 || sum===9; }

const stage = document.getElementById('stage');
const hexcol = document.getElementById('hexcol');
const primaryInfo = document.getElementById('primaryInfo');
const afterCast = document.getElementById('afterCast');
const castBtn = document.getElementById('castBtn');
const resetRow = document.getElementById('resetRow');
const resetBtn = document.getElementById('resetBtn');
const questionEl = document.getElementById('question');
const coinLabel = document.getElementById('coinLabel');
const coinRow = document.getElementById('coinRow');
const coinLabels = document.getElementById('coinLabels');
const coinSum = document.getElementById('coinSum');
const coinRotations = [0, 0, 0];
const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function delay(ms){ return new Promise(r=>setTimeout(r, ms)); }

function coinGlyph(v){ return v===3 ? '陽 (cara)' : '陰 (coroa)'; }

function flipCoinTo(innerEl, index, isCara){
  const currentMod = ((coinRotations[index] % 360) + 360) % 360;
  const targetMod = isCara ? 0 : 180;
  const diff = ((targetMod - currentMod) + 360) % 360;
  const extraSpins = prefersReducedMotion ? 0 : 720;
  coinRotations[index] += extraSpins + diff;
  innerEl.style.transition = prefersReducedMotion ? 'none' : 'transform 0.75s cubic-bezier(.3,.05,.15,1)';
  innerEl.style.transform = `rotateY(${coinRotations[index]}deg)`;
}

const LINE_NAMES = ['primeira','segunda','terceira','quarta','quinta','sexta'];

async function castLine(index, totalLines){
  const coinEls = Array.from(coinRow.querySelectorAll('.coin'));
  const innerEls = coinEls.map(c=>c.querySelector('.coin-inner'));
  const labelEls = Array.from(coinLabels.querySelectorAll('div'));

  // reset to resting (dimmed) state
  coinEls.forEach(c=>{ c.classList.add('resting'); });
  labelEls.forEach(l=>{ l.textContent = ''; });
  coinSum.innerHTML = '&nbsp;';

  // concentration pause before the toss
  coinLabel.textContent = `Linha ${index+1} de ${totalLines}, concentre-se na pergunta`;
  coinLabel.classList.add('focusing');
  await delay(950);
  coinLabel.classList.remove('focusing');
  coinLabel.textContent = `Lançando a ${LINE_NAMES[index]} linha...`;

  // toss the three coins with a staggered flip
  const {coins, sum} = tossLine();
  for(let i=0;i<3;i++){
    coinEls[i].classList.remove('resting');
    flipCoinTo(innerEls[i], i, coins[i] === 3);
    await delay(240);
  }
  await delay(600); // let the last coin's flip animation finish settling

  coinEls.forEach((c,i)=>{ labelEls[i].textContent = coinGlyph(coins[i]); });

  const yang = lineIsYang(sum);
  const moving = lineIsMoving(sum);
  coinSum.innerHTML = `soma <strong>${sum}</strong>, ${yang ? 'yang':'yin'}${moving ? ' (linha em movimento)' : ''}`;

  await delay(700); // time to read the result before it joins the hexagram

  // build the line in the hexagram column
  const row = document.createElement('div');
  row.className = `line-row ${yang ? 'yang':'yin'}`;
  row.innerHTML = `<div class="line-bar" id="bar-${index}"></div>`;
  hexcol.appendChild(row);
  const bar = document.getElementById(`bar-${index}`);
  if(yang){
    const seg = document.createElement('div');
    seg.className = 'bar-seg';
    bar.appendChild(seg);
  } else {
    const seg1 = document.createElement('div'); seg1.className='bar-seg';
    const seg2 = document.createElement('div'); seg2.className='bar-seg';
    bar.appendChild(seg1); bar.appendChild(seg2);
  }
  if(moving){
    const mark = document.createElement('div');
    mark.className = 'moving-mark';
    bar.appendChild(mark);
  }

  await delay(650); // contemplation pause before the next line begins
  return { yang, moving, sum };
}

function renderInfo(container, hex, label, colorClass){
  container.className = `info ${colorClass||''}`;
  container.innerHTML = `
    <div class="num">${label ? label + ' · ' : ''}Hexagrama ${hex.n}</div>
    <h2>${hex.pt}</h2>
    <div class="trig">${TRIGRAMS[hex.u].symbol} ${TRIGRAMS[hex.u].nome} sobre ${TRIGRAMS[hex.l].symbol} ${TRIGRAMS[hex.l].nome}, ${hex.py}</div>
    <p class="judgment">${hex.t}</p>
  `;
}

function renderMiniHexagram(lines){
  // lines: array bottom->top of {yang}
  const wrap = document.createElement('div');
  wrap.className = 'hexcol';
  wrap.style.width = '110px';
  lines.forEach(l=>{
    const row = document.createElement('div');
    row.className = `line-row ${l.yang ? 'yang':'yin'}`;
    const bar = document.createElement('div');
    bar.className = 'line-bar';
    if(l.yang){
      const seg = document.createElement('div'); seg.className='bar-seg';
      bar.appendChild(seg);
    } else {
      const s1=document.createElement('div'); s1.className='bar-seg';
      const s2=document.createElement('div'); s2.className='bar-seg';
      bar.appendChild(s1); bar.appendChild(s2);
    }
    row.appendChild(bar);
    wrap.appendChild(row);
  });
  return wrap;
}

async function runCasting(){
  castBtn.disabled = true;
  hexcol.innerHTML = '';
  afterCast.innerHTML = '';
  primaryInfo.innerHTML = '';
  stage.style.display = 'block';
  resetRow.style.display = 'none';

  const results = [];
  for(let i=0;i<6;i++){
    const r = await castLine(i, 6);
    results.push(r);
  }

  coinLabel.textContent = 'Hexagrama formado';

  const primaryBin = results.map(r=>r.yang?'1':'0').join('');
  const primaryHex = getHexagram(primaryBin);

  if(primaryHex){
    renderInfo(primaryInfo, primaryHex, null, '');
  } else {
    primaryInfo.innerHTML = '<p class="placeholder">Não foi possível identificar o hexagrama.</p>';
  }

  const movingCount = results.filter(r=>r.moving).length;
  let changedHex = null;

  if(movingCount > 0 && primaryHex){
    const changedLines = results.map(r=>{
      if(!r.moving) return {yang:r.yang};
      return {yang: !r.yang}; // moving lines flip
    });
    const changedBin = changedLines.map(l=>l.yang?'1':'0').join('');
    changedHex = getHexagram(changedBin);

    const block = document.createElement('div');
    block.innerHTML = `<hr class="divider"><div class="num" style="color:var(--brass); text-transform:uppercase; letter-spacing:0.06em; font-size:13px; margin-bottom:10px;">Linhas em movimento (${movingCount}), tendência futura</div>`;
    const flexRow = document.createElement('div');
    flexRow.style.display = 'flex';
    flexRow.style.gap = '24px';
    flexRow.appendChild(renderMiniHexagram(changedLines));
    const futureInfo = document.createElement('div');
    if(changedHex){
      renderInfo(futureInfo, changedHex, 'Resultante', 'result-future');
    } else {
      futureInfo.innerHTML = '<p class="placeholder">Não foi possível identificar o hexagrama resultante.</p>';
    }
    flexRow.appendChild(futureInfo);
    block.appendChild(flexRow);
    afterCast.appendChild(block);
  }

  resetRow.style.display = 'block';
  castBtn.disabled = false;

  if(typeof window.onIChingCastComplete === 'function'){
    const movingLinePositions = results
      .map((r,i)=> r.moving ? i+1 : null)
      .filter(v=>v!==null);
    window.onIChingCastComplete({
      question: questionEl.value.trim() || null,
      primaryHexagram: primaryHex ? primaryHex.n : null,
      movingLines: movingLinePositions,
      resultingHexagram: changedHex ? changedHex.n : null
    });
  }
}

castBtn.addEventListener('click', runCasting);
resetBtn.addEventListener('click', ()=>{
  stage.style.display = 'none';
  hexcol.innerHTML = '';
  primaryInfo.innerHTML = '';
  afterCast.innerHTML = '';
  resetRow.style.display = 'none';
  questionEl.value = '';
  questionEl.focus();
});
