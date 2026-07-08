// Edge Function: admin-teachers  (cipta / reset / padam akaun ketua)
// Deploy: Supabase > Edge Functions > admin-teachers  (Verify JWT: OFF)
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const DOMAIN = "@kehadiran.local";
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (o: unknown, s = 200) =>
  new Response(JSON.stringify(o), { status: s, headers: { ...cors, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  try {
    const url = Deno.env.get("SUPABASE_URL")!;
    const anon = Deno.env.get("SUPABASE_ANON_KEY")!;
    const service = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const authHeader = req.headers.get("Authorization") || "";

    // 1) Sahkan pemanggil = admin
    const caller = createClient(url, anon, { global: { headers: { Authorization: authHeader } } });
    const { data: { user } } = await caller.auth.getUser();
    if (!user) return json({ error: "Sesi tamat, log masuk semula" }, 401);
    const callerIc = (user.email || "").split("@")[0];

    const admin = createClient(url, service);
    const { data: me } = await admin.from("teachers").select("is_admin").eq("ic", callerIc).maybeSingle();
    if (!me || !me.is_admin) return json({ error: "Tiada akses admin" }, 403);

    const body = await req.json();
    const action = body.action;
    const ic = (body.ic || "").replace(/\D/g, "");
    if (action !== "list" && ic.length < 4) return json({ error: "No. KP tidak sah" }, 400);
    const pw = ic.slice(-4);
    const email = ic + DOMAIN;

    const findUser = async () => {
      const { data } = await admin.auth.admin.listUsers();
      return data.users.find((u) => u.email === email) || null;
    };

    if (action === "create") {
      const { error: ce } = await admin.auth.admin.createUser({ email, password: pw, email_confirm: true });
      if (ce && !String(ce.message).toLowerCase().includes("already")) return json({ error: ce.message }, 400);
      const { error: te } = await admin.from("teachers")
        .upsert({ ic, name: body.name || ic, class_name: body.class_name || null, password_set: false }, { onConflict: "ic" });
      if (te) return json({ error: te.message }, 400);
      return json({ ok: true, default_password: pw });
    }
    if (action === "reset") {
      const u = await findUser();
      if (u) await admin.auth.admin.updateUserById(u.id, { password: pw });
      await admin.from("teachers").update({ password_set: false }).eq("ic", ic);
      return json({ ok: true, default_password: pw });
    }
    if (action === "delete") {
      const u = await findUser();
      if (u) await admin.auth.admin.deleteUser(u.id);
      await admin.from("teachers").delete().eq("ic", ic);
      return json({ ok: true });
    }
    return json({ error: "Aksi tidak dikenali" }, 400);
  } catch (e) {
    return json({ error: String((e as Error).message || e) }, 500);
  }
});
