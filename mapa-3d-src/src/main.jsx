import React from 'react';
import ReactDOM from 'react-dom/client';
import NatalTorus3D from './components/NatalTorus3D.jsx';
import { chartExemplo } from './chartExemplo.js';

// Ponte com o motor real: se a página que carrega esse bundle já
// calculou o chart (o mesmo objeto que alimenta buildWheelSVG em
// kit.html), ela só precisa fazer:
//
//   window.__CAOS_CHART__ = chart;
//
// ANTES desse script rodar. Sem isso, cai no chart de exemplo, só
// pra visualização isolada / desenvolvimento.
const chart = window.__CAOS_CHART__ ?? chartExemplo;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <NatalTorus3D chart={chart} />
  </React.StrictMode>
);
