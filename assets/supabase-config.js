/**
 * Configuração central do Supabase — Caos Astral
 *
 * Fonte única da URL do projeto e da chave publicável (anon key).
 * Antes desse arquivo existir, esses dois valores estavam
 * hardcoded em ~15 arquivos diferentes (todas as páginas admin,
 * kit, dashboard, oráculo, deriva, ritual-de-entrada, etc). Se a
 * chave precisar ser rotacionada, troque só aqui.
 *
 * A chave abaixo é a chave PUBLICÁVEL (sb_publishable_*), pensada
 * para rodar no navegador e protegida por Row Level Security no
 * banco — não é segredo, mas duplicá-la em dezenas de lugares é
 * anti-padrão de manutenção (e foi apontado no diagnóstico do repo).
 *
 * Carregue este script ANTES de qualquer outro que use
 * window.CAOS_SUPABASE_URL / window.CAOS_SUPABASE_KEY (inclui
 * site-chrome.js, flash-decor.js e os blocos inline de cada página).
 */
window.CAOS_SUPABASE_URL = 'https://pibwwyqjrsdwnzsiremx.supabase.co';
window.CAOS_SUPABASE_KEY = 'sb_publishable_kPxQ9BGs68o9lich7qWTKw_W83iNPgs';
