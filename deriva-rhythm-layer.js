/* ============================================================
   CAMADA "RITMO" — loops de áudio reais (atabaque, cítara, deep
   techno etc) somados ao motor de síntese existente do Deriva.

   Onde encaixar: dentro da IIFE do motor de áudio, ao lado das
   outras camadas (textura, ícaro). Usa o mesmo masterBus, então
   os efeitos visuais reativos ao som (audioMult) já reagem a ela
   automaticamente, sem nenhuma mudança no motor visual.
   ============================================================ */

// ---- catálogo de loops disponíveis: troque as URLs pelos seus arquivos ----
// coloque os arquivos em assets/audio/ e referencie por caminho relativo
const RHYTHM_TRACKS = {
  atabaque:  { label: 'Atabaque',      url: 'assets/audio/atabaque-loop.mp3' },
  citara:    { label: 'Cítara',        url: 'assets/audio/citara-loop.mp3' },
  flauta:    { label: 'Flauta',        url: 'assets/audio/flauta-loop.mp3' },
  metais:    { label: 'Metais',        url: 'assets/audio/metais-loop.mp3' },
  deeptechno:{ label: 'Deep Techno',   url: 'assets/audio/deep-techno-loop.mp3' }
};

// estado próprio da camada de ritmo (mescla com o objeto `state` já existente)
Object.assign(state, {
  rhythmOn: false,
  rhythmTrack: 'atabaque',
  rhythmVolume: 35,
  rhythmCrossfade: true,      // alterna entre 2 faixas lentamente pra evitar loop óbvio
  rhythmCrossfadeSeconds: 40  // duração de cada troca
});

// nós de áudio da camada de ritmo (populados em buildGraph)
let rhythmBuffers = {};        // cache: track id -> AudioBuffer decodado
let rhythmGainMain, rhythmGainAlt; // dois gains, pra crossfade suave entre duas fontes
let rhythmSourceMain = null, rhythmSourceAlt = null;
let rhythmCrossfadeTimer = null;

// carrega e decodifica um loop (uma vez, cacheado)
async function loadRhythmBuffer(trackId){
  if (rhythmBuffers[trackId]) return rhythmBuffers[trackId];
  const track = RHYTHM_TRACKS[trackId];
  if (!track) return null;
  const res = await fetch(track.url);
  const arrayBuf = await res.arrayBuffer();
  const buf = await ctx.decodeAudioData(arrayBuf);
  rhythmBuffers[trackId] = buf;
  return buf;
}

// cria e inicia uma BufferSource em loop, ligada a um gain próprio
function startRhythmSource(buffer, gainNode, startGain){
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  src.loop = true;
  gainNode.gain.value = startGain;
  src.connect(gainNode).connect(masterBus);
  src.start();
  return src;
}

// liga a camada de ritmo com a faixa escolhida
async function applyRhythmOn(on){
  state.rhythmOn = on;
  if (!ctx) return;

  if (!on){
    if (rhythmSourceMain){ rhythmGainMain.gain.setTargetAtTime(0, ctx.currentTime, 1.2); }
    if (rhythmSourceAlt){ rhythmGainAlt.gain.setTargetAtTime(0, ctx.currentTime, 1.2); }
    if (rhythmCrossfadeTimer){ clearTimeout(rhythmCrossfadeTimer); rhythmCrossfadeTimer = null; }
    return;
  }

  if (!rhythmGainMain){
    rhythmGainMain = ctx.createGain(); rhythmGainMain.gain.value = 0;
    rhythmGainAlt  = ctx.createGain(); rhythmGainAlt.gain.value = 0;
  }

  const buf = await loadRhythmBuffer(state.rhythmTrack);
  if (!buf) return;

  if (rhythmSourceMain) { try { rhythmSourceMain.stop(); } catch(e){} }
  rhythmSourceMain = startRhythmSource(buf, rhythmGainMain, 0);
  rhythmGainMain.gain.setTargetAtTime(state.rhythmVolume/100 * 0.5, ctx.currentTime, 1.5);

  if (state.rhythmCrossfade) scheduleRhythmCrossfade();
}

// troca lenta entre a faixa atual e outra aleatória do catálogo, evitando repetição óbvia de loop curto
function scheduleRhythmCrossfade(){
  if (rhythmCrossfadeTimer) clearTimeout(rhythmCrossfadeTimer);
  rhythmCrossfadeTimer = setTimeout(async () => {
    if (!state.rhythmOn || !state.rhythmCrossfade) return;
    const ids = Object.keys(RHYTHM_TRACKS).filter(id => id !== state.rhythmTrack);
    const nextId = ids[Math.floor(Math.random() * ids.length)];
    const buf = await loadRhythmBuffer(nextId);
    if (!buf) return;

    // a fonte "alt" entra enquanto a "main" desce; depois trocam de papel
    if (rhythmSourceAlt) { try { rhythmSourceAlt.stop(); } catch(e){} }
    rhythmSourceAlt = startRhythmSource(buf, rhythmGainAlt, 0);
    const target = state.rhythmVolume/100 * 0.5;
    rhythmGainAlt.gain.setTargetAtTime(target, ctx.currentTime, 6);
    rhythmGainMain.gain.setTargetAtTime(0, ctx.currentTime, 6);

    setTimeout(() => {
      // main assume o papel de alt (troca de referência, sem cortar o áudio)
      if (rhythmSourceMain) { try { rhythmSourceMain.stop(); } catch(e){} }
      [rhythmSourceMain, rhythmSourceAlt] = [rhythmSourceAlt, rhythmSourceMain];
      [rhythmGainMain, rhythmGainAlt] = [rhythmGainAlt, rhythmGainMain];
      state.rhythmTrack = nextId;
      scheduleRhythmCrossfade();
    }, 7000); // pequena folga após o crossfade audível

  }, state.rhythmCrossfadeSeconds * 1000);
}

function applyRhythmVolume(v){
  state.rhythmVolume = v;
  if (!ctx) return;
  const target = state.rhythmOn ? v/100 * 0.5 : 0;
  if (rhythmGainMain) rhythmGainMain.gain.setTargetAtTime(target, ctx.currentTime, 0.4);
}

/* ============================================================
   HTML do painel — inserir dentro de .audio-panel, como uma
   nova .a-group-title, no mesmo padrão das seções existentes
   ============================================================ */
const RHYTHM_PANEL_HTML = `
<div class="a-group-title">Ritmo (loops)</div>
<div class="a-row" style="grid-column:1 / -1;">
  <div class="pulse-on-row">
    <div class="mini-toggle" id="rhythmToggle" data-on="0">desligado</div>
    <span class="mono" style="font-size:10.5px; color:var(--stone);">atabaque, cítara, flauta, metais ou deep techno, por baixo do resto</span>
  </div>
</div>
<div class="a-row">
  <label>Volume <span class="val mono" id="valRhythmVol">35%</span></label>
  <input type="range" id="rhythmVol" min="0" max="100" value="35" step="1">
</div>
<div class="a-row" style="grid-column:1 / -1;">
  <label>Faixa</label>
  <div class="shape-toggles" id="rhythmTrackToggles"></div>
</div>
<div class="a-row" style="grid-column:1 / -1;">
  <div class="pulse-on-row">
    <div class="mini-toggle active" id="rhythmCrossfadeToggle" data-on="1">alternância automática: ligada</div>
  </div>
</div>
`;

/* ============================================================
   Listeners — colar perto dos outros addEventListener do motor
   ============================================================ */
function wireRhythmControls(){
  const $ = id => document.getElementById(id);

  const rhythmToggle = $('rhythmToggle');
  rhythmToggle.addEventListener('click', () => {
    const on = rhythmToggle.dataset.on !== '1';
    rhythmToggle.dataset.on = on ? '1' : '0';
    rhythmToggle.textContent = on ? 'ligado' : 'desligado';
    rhythmToggle.classList.toggle('active', on);
    applyRhythmOn(on);
  });

  $('rhythmVol').addEventListener('input', e => {
    const v = parseFloat(e.target.value);
    $('valRhythmVol').textContent = v + '%';
    applyRhythmVolume(v);
  });

  const trackWrap = $('rhythmTrackToggles');
  Object.entries(RHYTHM_TRACKS).forEach(([id, t], i) => {
    const btn = document.createElement('div');
    btn.className = 'shape-btn rhythm-track-btn' + (i === 0 ? ' active' : '');
    btn.textContent = t.label;
    btn.dataset.track = id;
    btn.addEventListener('click', async () => {
      document.querySelectorAll('.rhythm-track-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.rhythmTrack = id;
      if (state.rhythmOn) await applyRhythmOn(true); // relança já na faixa escolhida
    });
    trackWrap.appendChild(btn);
  });

  const crossfadeToggle = $('rhythmCrossfadeToggle');
  crossfadeToggle.addEventListener('click', () => {
    const on = crossfadeToggle.dataset.on !== '1';
    crossfadeToggle.dataset.on = on ? '1' : '0';
    crossfadeToggle.textContent = 'alternância automática: ' + (on ? 'ligada' : 'desligada');
    crossfadeToggle.classList.toggle('active', on);
    state.rhythmCrossfade = on;
    if (on && state.rhythmOn) scheduleRhythmCrossfade();
    else if (rhythmCrossfadeTimer) { clearTimeout(rhythmCrossfadeTimer); rhythmCrossfadeTimer = null; }
  });
}

/* ============================================================
   No teardown() existente do motor, adicionar:

   if (rhythmSourceMain) { try { rhythmSourceMain.stop(); } catch(e){} }
   if (rhythmSourceAlt)  { try { rhythmSourceAlt.stop(); } catch(e){} }
   if (rhythmCrossfadeTimer) clearTimeout(rhythmCrossfadeTimer);
   rhythmSourceMain = null; rhythmSourceAlt = null; rhythmCrossfadeTimer = null;

   E no buildGraph(), no final, chamar wireRhythmControls() uma
   única vez fora do buildGraph (no load da página), já que os
   elementos do painel já existem no HTML estático.
   ============================================================ */
