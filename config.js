const SUPABASE_URL  = "https://tnrrzlnrypofsqslngyg.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRucnJ6bG5yeXBvZnNxc2xuZ3lnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM0NTMzMDcsImV4cCI6MjA5OTAyOTMwN30.0dMF-YRx81jMou87g_FoM2-pacwTDP8RJcWQN6JvIrU";
const ADMIN_EMAIL='admin@kehadiran.local';
const EMAIL_DOMAIN='@kehadiran.local';

const sb=supabase.createClient(SUPABASE_URL,SUPABASE_ANON);
const $=s=>document.querySelector(s);
const esc=s=>(s??'').toString().replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const todayISO=()=>new Date().toISOString().slice(0,10);
const fmtDate=iso=>new Date(iso+'T00:00').toLocaleDateString('ms-MY',{weekday:'short',day:'numeric',month:'short',year:'numeric'});
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove('show'),2600);}

const REASONS=['Ponteng','Sekolah','Dengan Kebenaran'];
const NA='Tidak Berkenaan';
function fmtMasa(t){if(!t)return '';const[a,b]=t.split('-');return b?`${a}–${b}`:a;}
