/* ===== NAV (Ambil / Data / Laporan) ===== */
document.querySelectorAll('.tab').forEach(tab=>tab.addEventListener('click',()=>{
  const k=tab.dataset.tab;
  if(k==='adminlink'){ if(state.teacher?.is_admin){ window.location.href='admin.html'; } return; }
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));tab.classList.add('active');
  $('#tab-ambil').classList.toggle('hidden',k!=='ambil');
  $('#tab-data').classList.toggle('hidden',k!=='data');
  $('#tab-laporan').classList.toggle('hidden',k!=='laporan');
  $('#savebar').classList.toggle('hidden',k!=='ambil');
  if(k==='data')renderData();
  if(k==='ambil'){fillKelasDropdown();loadCurrent();}
}));
boot();
