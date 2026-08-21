// Chart de exemplo, só pra rodar o micro-app isolado (npm run dev)
// sem depender do backend real. Shape idêntico ao que
// buildWheelSVG(chart) já consome em kit.html.
export const chartExemplo = {
  ascendente: 132,
  meio_ceu: 42,
  planetas: [
    { chave: 'sun', longitude: 118, retrogrado: false },
    { chave: 'moon', longitude: 254, retrogrado: false },
    { chave: 'mercury', longitude: 101, retrogrado: true },
    { chave: 'venus', longitude: 95, retrogrado: false },
    { chave: 'mars', longitude: 12, retrogrado: false },
    { chave: 'jupiter', longitude: 340, retrogrado: false },
    { chave: 'saturn', longitude: 305, retrogrado: false },
    { chave: 'uranus', longitude: 210, retrogrado: false },
    { chave: 'neptune', longitude: 288, retrogrado: false },
    { chave: 'pluto', longitude: 275, retrogrado: false },
    { chave: 'chiron', longitude: 60, retrogrado: false },
    { chave: 'exilio', longitude: 190, retrogrado: false },
    { chave: 'l4', longitude: 314, retrogrado: false },
    { chave: 'l5', longitude: 194, retrogrado: false },
  ],
  aspectos: [
    { planeta_a: 'sun', planeta_b: 'l4', aspecto: 'sextile' },
    { planeta_a: 'moon', planeta_b: 'l5', aspecto: 'square' },
    { planeta_a: 'mercury', planeta_b: 'venus', aspecto: 'conjunction' },
    { planeta_a: 'mars', planeta_b: 'saturn', aspecto: 'opposition' },
    { planeta_a: 'jupiter', planeta_b: 'l4', aspecto: 'trine' },
    { planeta_a: 'pluto', planeta_b: 'l5', aspecto: 'conjunction' },
    { planeta_a: 'chiron', planeta_b: 'sun', aspecto: 'trine' },
  ],
};
