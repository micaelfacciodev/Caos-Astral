# Caos Astral — Front estático

Site multi-página estático (HTML + CSS puro, sem framework/build step).
Feito pra ser fácil de qualquer agente de código plugar dado dinâmico.

## Estrutura
- `assets/style.css` — design system único, compartilhado por todas as páginas. Não duplicar tokens inline.
- `index.html` — landing
- `manifesto.html`, `intento.html` — filosofia
- `kit.html`, `retorno.html`, `ressonancia.html`, `ancora.html` — produto astrológico (motor principal)
- `oraculo.html` — I Ching, propositalmente isolado do vocabulário do kit (ver glossário)
- `raizes.html` + `raizes-*.html` — história/proveniência
- `blog.html` + `blog-eco.html` (exemplo) — conteúdo
- `diario.html` — área privada (requer auth)
- `planos.html` — pricing

## Onde plugar o engine
Toda página de produto tem um comentário `<!-- ENGINE: ... -->` marcando exatamente
onde o dado calculado (Supabase) deve substituir o placeholder estático.
Ver também `glossario-caos-astral.md` e `arquitetura-conteudo-caos-astral.md` no
repositório para nomenclatura oficial e mapa de navegação completo.

## Não fazer
- Não renomear termos do glossário sem atualizar o glossário primeiro.
- Não misturar vocabulário do kit com o do Oráculo (I Ching) — são tradições
  deliberadamente separadas, ver `oraculo.html` e `raizes-i-ching.html`.
