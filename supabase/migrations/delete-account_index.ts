// supabase/functions/delete-account/index.ts
//
// EXCEÇÃO DELIBERADA à regra geral "Edge Functions de usuário nunca usam
// service_role" (CLAUDE.md, seção 8, histórico de decisões). Apagar o
// próprio usuário de `auth.users` só é possível via Admin API, que exige
// service_role — não tem como fazer isso com RLS/JWT comum.
//
// A exceção é estritamente controlada: o service_role NUNCA recebe um
// user_id vindo do corpo da requisição. O único id usado é resolvido a
// partir do JWT de quem está chamando (via um client separado, com a
// anon key, chamando auth.getUser()). Ou seja: dá pra apagar a própria
// conta, nunca a de outro usuário, mesmo que alguém tente forjar um
// user_id no payload.
//
// Atende LGPD art. 18, VI (direito de eliminação).

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Sem sessão." }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Client "chamador": só serve pra resolver QUEM está pedindo a
    // exclusão, direto do próprio token JWT — nunca de um parâmetro
    // enviado no corpo da requisição.
    const callerClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userError } = await callerClient.auth.getUser();

    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Sessão inválida ou expirada." }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Client admin: só instanciado aqui dentro, só usado com o id já
    // resolvido acima (user.id), nunca com qualquer id vindo de fora.
    const adminClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    // Cascade confirmado em produção (30/07) via pg_constraint: todas as
    // tabelas de usuário (profiles, natal_charts, daily_readings,
    // intent_anchors, diario_gnose, solar_returns, iching_readings) têm
    // "on delete cascade" pra auth.users. synastry_readings tem duas FKs:
    // uma cascade (dono da leitura), uma set null (parceiro referenciado)
    // — comportamento correto por design, não precisa de tratamento
    // manual aqui. deleteUser abaixo é suficiente sozinho.
    const { error: deleteError } = await adminClient.auth.admin.deleteUser(user.id);

    if (deleteError) {
      return new Response(JSON.stringify({ error: deleteError.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
