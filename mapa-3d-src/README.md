# Caos Astral 3D — micro-app

Mapa natal em toro 3D. Projeto separado do site principal (que continua
HTML estático sem bundler), pensado pra ser buildado uma vez e a pasta
`dist/` inteira ser copiada como subpasta estática dentro do
Caos-Astral, por exemplo em `/mapa-3d/`.

## Rodar local (dev, com dados de exemplo)

Sem conta em lugar nenhum, é tudo local:

```bash
npm install
npm run dev
```

Abre em `http://localhost:5173`, com o `chartExemplo.js` (não é dado
real, é só pra ver a cena funcionando).

## Buildar pra produção

```bash
npm run build
```

Gera `dist/index.html` + `dist/assets/*.js` com caminhos relativos.
Essa pasta `dist/` é o produto final: copia ela inteira pro repo do
Caos-Astral como `/mapa-3d/` e funciona direto no GitHub Pages, sem
servidor, sem configuração de rota.

## Como conectar com dados reais

O componente espera exatamente o mesmo shape de `chart` que
`buildWheelSVG(chart)` já usa em `kit.html`:

```js
chart.planetas   // [{ chave, longitude, retrogrado }, ...]
chart.aspectos   // [{ planeta_a, planeta_b, aspecto }, ...]
chart.ascendente // longitude do ASC
chart.meio_ceu   // longitude do MC (opcional)
```

Na página que vai hospedar o mapa 3D (`mapa-3d.html`, por exemplo),
depois de calcular o `chart` do jeito que o site já faz hoje pro SVG
2D, seta a variável global ANTES do bundle rodar:

```html
<script>
  window.__CAOS_CHART__ = chart; // o mesmo objeto que já alimenta o SVG
</script>
<script type="module" src="./mapa-3d/assets/index-XXXX.js"></script>
```

Sem isso, o bundle cai no chart de exemplo, só pra não quebrar.

## Pendências de design, ainda não decididas

- `flow` em `l4l5Distortion.js`: hoje só planetas com aspecto EXATO
  com L4/L5 se deslocam no eixo do tubo, o resto fica sempre no
  equador. Alternativa: flow contínuo por distância angular, campo
  inteiro se deforma em gradiente. Ver conversa sobre isso antes de
  fechar.
- Rótulo oficial de L4/L5 no glossário (`Sofia`/`Saklas` ainda não
  está fechado como termo oficial de produto).
- Bundle está em ~1.1MB (317KB gzip). Se isso pesar demais em conexão
  ruim, dá pra cortar com code-splitting ou trocar `drei` por menos
  dependência (ele traz bastante coisa que não é usada aqui, só
  `Text`, `Line` e `OrbitControls`).
