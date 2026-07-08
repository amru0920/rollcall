document.querySelectorAll('.tab').forEach(tab=>tab.addEventListener('click',()=>{
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));tab.classList.add('active');
  const k=tab.dataset.tab;
  $('#tab-guru').classList.toggle('hidden',k!=='guru');
  $('#tab-pelajar').classList.toggle('hidden',k!=='pelajar');
  $('#tab-data').classList.toggle('hidden',k!=='data');
  if(k==='guru')renderGuru();if(k==='pelajar')renderPelajar();if(k==='data')renderData();
}));
boot();
