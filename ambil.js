/* ===== AMBIL KEHADIRAN (Rollcall) =====
   absent[id] = 'Lewat' | 'Tidak Hadir'  (tiada dalam map = Hadir) */
const current={kelas:null,date:null,subjek:'',roster:[],absent:{}};

async function loadCurrent(){
  current.kelas=$('#kelas').value||null;
  current.date=$('#tarikh').value;
  current.subjek='';
  current.absent={};
  if(!current.kelas){current.roster=[];renderRoster();$('#save-info').textContent='';return;}
  current.roster=rosterFor(current.kelas);
  try{
    const s=await DB.getSession(current.kelas,current.date,'');
    if(s){ (s.absentees||[]).forEach(a=>current.absent[a.student_id]=a.reason); }
    $('#save-info').textContent=s?'✏️ Mod edit — rekod dimuatkan, ubah & simpan semula':'Belum disimpan';
    $('#save-info').style.color='';
    $('#btn-simpan').textContent=s?'Kemaskini Rekod':'Simpan Rekod';
  }catch(e){toast('Ralat memuat: '+e.message);}
  renderRoster();
}

function renderRoster(){
  $('#roster').innerHTML=current.roster.map((s,i)=>{
    const v=current.absent[s.id];            // undefined = Hadir
    const st=v==='Lewat'?'lewat':(v==='Tidak Hadir'?'absent':'');
    const badge=v==='Lewat'?'<span class="status lewat">Lewat</span>'
      :v==='Tidak Hadir'?'<span class="status no">Tidak Hadir</span>'
      :'<span class="status yes">✓ Hadir</span>';
    return `<div class="student ${st}" data-id="${s.id}">
      <div class="srow" data-act="toggle"><span class="num">${i+1}.</span>
        <span class="who"><span class="name">${esc(s.name)}</span><br><span class="meta">${esc(s.nokp)} · ${esc(s.kelas||'')}</span></span>
        ${badge}</div>
      ${v!==undefined?`<div class="reasons">
        <button class="chip ${v==='Lewat'?'on':''}" data-act="reason" data-r="Lewat">Lewat</button>
        <button class="chip ${v==='Tidak Hadir'?'on':''}" data-act="reason" data-r="Tidak Hadir">Tidak Hadir</button>
      </div>`:''}</div>`;
  }).join('')||'<div class="empty"><strong>Tiada pelajar</strong>Kelas ini belum ada pelajar.</div>';
  let lewat=0,tidak=0;Object.values(current.absent).forEach(v=>{if(v==='Lewat')lewat++;else tidak++;});
  const total=current.roster.length;
  $('#stat-jumlah').textContent=total;
  $('#stat-lewat').textContent=lewat;
  $('#stat-tidak').textContent=tidak;
  $('#stat-hadir').textContent=total-lewat-tidak;
}

$('#roster').addEventListener('click',e=>{
  const b=e.target.closest('[data-act]');if(!b)return;
  const id=e.target.closest('.student').dataset.id;
  if(b.dataset.act==='toggle'){
    const v=current.absent[id];
    if(v===undefined)current.absent[id]='Lewat';           // Hadir -> Lewat
    else if(v==='Lewat')current.absent[id]='Tidak Hadir';  // Lewat -> Tidak Hadir
    else delete current.absent[id];                        // Tidak Hadir -> Hadir
    renderRoster();
  }
  if(b.dataset.act==='reason'){current.absent[id]=b.dataset.r;renderRoster();}
});
$('#kelas').addEventListener('change',loadCurrent);
$('#tarikh').addEventListener('change',loadCurrent);

$('#btn-simpan').onclick=async()=>{
  if(!current.kelas){toast('Tiada kelas');return;}
  $('#btn-simpan').disabled=true;
  try{
    const now=new Date();
    const masa=String(now.getHours()).padStart(2,'0')+':'+String(now.getMinutes()).padStart(2,'0'); // auto masa
    await DB.saveSession(current.kelas,current.date,'',state.teacher?.ic||null,masa,
      Object.entries(current.absent).map(([student_id,reason])=>({student_id,reason})));
    $('#save-info').textContent='Disimpan ✓ · '+masa;$('#btn-simpan').textContent='Kemaskini Rekod';toast('Rekod disimpan ✓');
  }catch(e){toast('Ralat simpan: '+e.message);}
  $('#btn-simpan').disabled=false;
};
