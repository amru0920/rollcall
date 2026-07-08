/* ===== KONFIGURASI ===== */
const SUPABASE_URL  = "https://tnrrzlnrypofsqslngyg.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRucnJ6bG5yeXBvZnNxc2xuZ3lnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM0NTMzMDcsImV4cCI6MjA5OTAyOTMwN30.0dMF-YRx81jMou87g_FoM2-pacwTDP8RJcWQN6JvIrU";
const FN_URL        = `${SUPABASE_URL}/functions/v1/admin-teachers`;
/* ======================= */

const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON);
const $=s=>document.querySelector(s);
const esc=s=>(s??'').toString().replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove('show'),3200);}

const cache={students:[]};
const classesFromStudents=()=>[...new Set(cache.students.map(s=>s.kelas).filter(Boolean))].sort();

async function loadStudents(){
  const {data,error}=await sb.from('students').select('*').order('name');
  if(error)throw error;
  cache.students=data;
  // groups dibuang — rollcall tak pakai kumpulan
  cache.groupSize={};
}
const isGroup=()=>false;
const groupBadge=()=>'';
function classOptGroups(){
  return '<optgroup label="Kelas">'+classesFromStudents().map(c=>`<option value="${esc(c)}">${esc(c)}</option>`).join('')+'</optgroup>';
}