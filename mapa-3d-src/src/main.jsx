import React from 'react';
import ReactDOM from 'react-dom/client';
import NatalTorus3D from './components/NatalTorus3D.jsx';
import Legend from './components/Legend.jsx';
import { chartExemplo } from './chartExemplo.js';

// Ponte com o motor real: kit.html (a página onde o chart já é
// calculado hoje pro SVG 2D) grava o mesmo objeto em sessionStorage
// antes de linkar pra essa página, chave 'caosAstralChart'.
// sessionStorage é por aba, mesma origem, então sobrevive à
// navegação normal de um clique em link (não abrir em aba nova).
function lerChartReal() {
  if (window.__CAOS_CHART__) return window.__CAOS_CHART__;
  try {
    const raw = sessionStorage.getItem('caosAstralChart');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('não consegui ler o chart de sessionStorage:', e);
  }
  return null;
}

const chart = lerChartReal() ?? chartExemplo;
const usandoExemplo = chart === chartExemplo;

if (usandoExemplo) {
  const aviso = document.createElement('div');
  aviso.textContent = 'mapa de exemplo — sem dado real conectado';
  aviso.style.cssText =
    'position:fixed;top:10px;left:10px;color:#c14a3c;font:12px monospace;' +
    'background:rgba(0,0,0,.6);padding:4px 8px;z-index:10;pointer-events:none;';
  document.body.appendChild(aviso);
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <NatalTorus3D chart={chart} />
      <Legend />
    </div>
  </React.StrictMode>
);
