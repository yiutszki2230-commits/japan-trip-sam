const PEOPLE = ['A','B','C','D','E'];
const CITIES = ['大阪','名古屋','河口湖','東京'];
const CITY_EMOJI = {大阪:'🍜', 名古屋:'🏯', 河口湖:'🗻', 東京:'🌃'};
const STORAGE = {
  apiUrl: localStorage.getItem('trip_api_url') || '',
  accessCode: localStorage.getItem('trip_access_code') || '',
  startDate: localStorage.getItem('trip_start_date') || '2026-08-01',
  person: localStorage.getItem('trip_person') || 'A'
};

let state = {
  config:{tripTitle:'日本10日旅行', startDate:STORAGE.startDate, people:PEOPLE},
  places:[
    {id:'demo-p1',city:'大阪',name:'道頓堀',type:'景點',priority:'必去',person:'A',estCost:0,mapUrl:'https://maps.google.com/?q=Dotonbori Osaka',note:'晚上去比較有氣氛。',votes:'A,B'},
    {id:'demo-p2',city:'河口湖',name:'富士山景觀位',type:'景點',priority:'必去',person:'B',estCost:0,mapUrl:'',note:'天氣好先排。',votes:'B'}
  ],
  stays:[
    {id:'demo-s1',nights:'Day 1-3',city:'大阪',name:'大阪住宿候選',checkIn:'2026-08-01',checkOut:'2026-08-04',address:'Namba / Shinsaibashi',price:120000,payer:'A',status:'待確認',mapUrl:'',note:'近地鐵站優先。'}
  ],
  itinerary:[
    {id:'demo-i1',day:1,period:'下午',title:'抵達日本 + 入住',type:'交通',location:'大阪',transport:'機場 → 市區',cost:3000,mapUrl:'',note:'第一日不要排太密。'},
    {id:'demo-i2',day:1,period:'晚上',title:'道頓堀晚餐',type:'餐廳',location:'道頓堀',transport:'步行/地鐵',cost:4000,mapUrl:'https://maps.google.com/?q=Dotonbori Osaka',note:'可以當歡迎晚餐。'}
  ],
  expenses:[
    {id:'demo-e1',item:'大阪酒店預算',category:'住宿',amount:120000,payer:'A',splitCount:5,note:'示範項目'}
  ]
};
let selectedCity = '大阪';
let selectedDay = 1;
let budgetChart;

document.addEventListener('DOMContentLoaded', init);

function init(){
  bindNav(); bindModals(); bindForms(); hydrateSettings();
  loadRemoteData();
}

async function loadRemoteData(){
  if(!STORAGE.apiUrl){ renderAll(); return; }
  try{
    const data = await apiGet();
    if(data && data.ok){
      state = normalizeState(data.data);
      showToast('已同步 Google Sheet');
    }
  }catch(err){
    console.warn(err);
    showToast('暫時用本機示範資料');
  }
  renderAll();
}

function normalizeState(data){
  return {
    config: {...state.config, ...(data.config||{})},
    places: data.places || [],
    stays: data.stays || [],
    itinerary: data.itinerary || [],
    expenses: data.expenses || []
  };
}

function bindNav(){
  document.querySelectorAll('.nav-btn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
      document.getElementById(btn.dataset.page).classList.add('active');
      if(btn.dataset.page==='money') renderBudgetChart();
    });
  });
}
function bindModals(){
  document.getElementById('setupBtn').onclick=()=>document.getElementById('setupModal').showModal();
  document.querySelectorAll('[data-open-modal]').forEach(btn=>{
    btn.onclick=()=>document.getElementById(btn.dataset.openModal).showModal();
  });
  document.getElementById('saveSetupBtn').onclick=()=>{
    const apiUrl = document.getElementById('apiUrlInput').value.trim();
    const accessCode = document.getElementById('accessCodeInput').value.trim();
    const startDate = document.getElementById('startDateInput').value || STORAGE.startDate;
    const person = document.getElementById('personInput').value;
    localStorage.setItem('trip_api_url', apiUrl);
    localStorage.setItem('trip_access_code', accessCode);
    localStorage.setItem('trip_start_date', startDate);
    localStorage.setItem('trip_person', person);
    showToast('設定已儲存，請重新整理');
  }
}
function hydrateSettings(){
  document.getElementById('apiUrlInput').value = STORAGE.apiUrl;
  document.getElementById('accessCodeInput').value = STORAGE.accessCode;
  document.getElementById('startDateInput').value = STORAGE.startDate;
  document.getElementById('personInput').value = STORAGE.person;
  document.querySelector('#placeForm [name="person"]').value = STORAGE.person;
}
function bindForms(){
  document.getElementById('placeForm').addEventListener('submit', async e=>{
    e.preventDefault(); const item = formData(e.target);
    await mutate('addPlace', item, ()=>state.places.push({...item,id:uid(),votes:item.person}));
    e.target.reset(); document.getElementById('placeModal').close(); renderAll();
  });
  document.getElementById('stayForm').addEventListener('submit', async e=>{
    e.preventDefault(); const item = formData(e.target);
    await mutate('addStay', item, ()=>state.stays.push({...item,id:uid()}));
    e.target.reset(); document.getElementById('stayModal').close(); renderAll();
  });
  document.getElementById('itineraryForm').addEventListener('submit', async e=>{
    e.preventDefault(); const item = formData(e.target); item.day=Number(item.day);
    await mutate('addItinerary', item, ()=>state.itinerary.push({...item,id:uid()}));
    e.target.reset(); document.getElementById('itineraryModal').close(); renderAll();
  });
  document.getElementById('expenseForm').addEventListener('submit', async e=>{
    e.preventDefault(); const item=formData(e.target); item.amount=Number(item.amount); item.splitCount=Number(item.splitCount||5);
    const isEdit=Boolean(item.id);
    await mutate(isEdit?'updateExpense':'addExpense', item, ()=>{
      if(isEdit){ const i=state.expenses.findIndex(x=>x.id===item.id); if(i>-1) state.expenses[i]=item; }
      else state.expenses.push({...item,id:uid()});
    });
    e.target.reset(); document.getElementById('expenseModal').close(); renderAll();
  });
}

async function mutate(action, payload, localFallback){
  if(STORAGE.apiUrl){
    try{
      const res = await apiPost(action, payload);
      if(!res.ok) throw new Error(res.error || 'API error');
      if(res.data) state = normalizeState(res.data);
      showToast('已同步'); return;
    }catch(err){ console.warn(err); showToast('同步失敗，先暫存在本機畫面'); }
  }
  localFallback();
}
function formData(form){ return Object.fromEntries(new FormData(form).entries()); }
function uid(){ return 'id-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2,7); }
async function apiGet(){
  const url = new URL(STORAGE.apiUrl); url.searchParams.set('code', STORAGE.accessCode);
  const res = await fetch(url.toString()); return res.json();
}
async function apiPost(action,payload){
  const res = await fetch(STORAGE.apiUrl + '?code=' + encodeURIComponent(STORAGE.accessCode), {
    method:'POST',
    headers:{'Content-Type':'text/plain;charset=utf-8'},
    body:JSON.stringify({action,payload})
  });
  return res.json();
}

function renderAll(){
  renderHome(); renderCities(); renderPlaces(); renderStays(); renderItinerary(); renderExpenses(); renderBudgetChart();
}
function renderHome(){
  document.getElementById('tripTitle').textContent = state.config.tripTitle || '日本10日旅行';
  const start = new Date(state.config.startDate || STORAGE.startDate);
  const end = new Date(start); end.setDate(start.getDate()+9);
  document.getElementById('tripDates').textContent = `${dateText(start)} - ${dateText(end)}｜5人旅行`;
  const today = new Date(); today.setHours(0,0,0,0); start.setHours(0,0,0,0);
  const diff = Math.ceil((start - today)/(1000*60*60*24));
  document.getElementById('daysLeft').textContent = diff > 0 ? diff : (diff === 0 ? 0 : 'GO');
  document.getElementById('countdownText').textContent = diff > 0 ? `距離出發還有 ${diff} 日` : diff === 0 ? '今日出發！' : '旅程已開始/完成';
  const planned = new Set(state.itinerary.map(x=>Number(x.day))).size;
  const total = state.expenses.reduce((s,x)=>s+Number(x.amount||0),0);
  document.getElementById('plannedDays').textContent = `${planned}/10`;
  document.getElementById('placeCount').textContent = state.places.length;
  document.getElementById('totalBudget').textContent = yen(total);
  document.getElementById('perPersonBudget').textContent = yen(Math.round(total/5));
}
function renderCities(){
  const wrap=document.getElementById('cityTabs');
  wrap.innerHTML=CITIES.map(city=>`<button class="chip ${city===selectedCity?'active':''}" data-city="${city}">${CITY_EMOJI[city]} ${city}</button>`).join('');
  wrap.querySelectorAll('.chip').forEach(btn=>btn.onclick=()=>{selectedCity=btn.dataset.city; renderCities(); renderPlaces();});
}
function renderPlaces(){
  const list=document.getElementById('placeList');
  const items=state.places.filter(x=>x.city===selectedCity);
  list.innerHTML = items.length ? items.map(placeCard).join('') : `<div class="item-card"><p class="muted">暫時未有 ${selectedCity} 想去地方。按「＋ 加地點」新增。</p></div>`;
  list.querySelectorAll('[data-vote]').forEach(btn=>btn.onclick=()=>toggleVote(btn.dataset.vote));
  list.querySelectorAll('[data-delete-place]').forEach(btn=>btn.onclick=()=>deletePlace(btn.dataset.deletePlace));
}
function placeCard(x){
  const votes = splitVotes(x.votes);
  return `<article class="item-card">
    <div class="item-top"><div><h3>${escapeHtml(x.name)}</h3><p class="muted">${x.note?escapeHtml(x.note):'未有備註'}</p></div><strong>${votes.length}票</strong></div>
    <div class="tag-row"><span class="tag hot">${x.city}</span><span class="tag pink">${x.priority}</span><span class="tag">${x.type}</span><span class="tag green">新增：${x.person}</span></div>
    <p class="muted">支持：${votes.join('、') || '未有人投票'}｜預算：${yen(Number(x.estCost||0))}</p>
    <div class="card-actions"><button class="small-btn" data-vote="${x.id}">我想去/取消</button>${x.mapUrl?`<a class="small-btn" target="_blank" href="${x.mapUrl}">地圖</a>`:''}<button class="small-btn" data-delete-place="${x.id}">刪除</button></div>
  </article>`;
}
async function toggleVote(id){
  await mutate('togglePlaceVote',{id,person:STORAGE.person},()=>{
    const x=state.places.find(p=>p.id===id); if(!x) return;
    const votes=splitVotes(x.votes); const i=votes.indexOf(STORAGE.person); i>-1?votes.splice(i,1):votes.push(STORAGE.person); x.votes=votes.join(',');
  }); renderAll();
}
async function deletePlace(id){ if(!confirm('確定刪除這個地點？')) return; await mutate('deletePlace',{id},()=>state.places=state.places.filter(x=>x.id!==id)); renderAll(); }
function splitVotes(v){ return String(v||'').split(',').map(s=>s.trim()).filter(Boolean); }

function renderStays(){
  const list=document.getElementById('stayList');
  list.innerHTML = state.stays.length ? state.stays.map(x=>`<article class="item-card"><div class="item-top"><div><h3>${escapeHtml(x.name)}</h3><p class="muted">${x.nights}｜${x.city}</p></div><span class="tag green">${x.status}</span></div><div class="tag-row"><span class="tag">入住 ${x.checkIn||'-'}</span><span class="tag">退房 ${x.checkOut||'-'}</span><span class="tag hot">付款：${x.payer}</span></div><p>${escapeHtml(x.address||'未填地址')}</p><p class="muted">總價：${yen(Number(x.price||0))}｜每人：${yen(Math.round(Number(x.price||0)/5))}</p>${x.note?`<p class="muted">${escapeHtml(x.note)}</p>`:''}${x.mapUrl?`<div class="card-actions"><a class="small-btn" target="_blank" href="${x.mapUrl}">地圖</a></div>`:''}</article>`).join('') : `<div class="item-card"><p class="muted">暫時未有住宿資料。</p></div>`;
}
function renderItinerary(){
  const start = new Date(state.config.startDate || STORAGE.startDate);
  const today = new Date(); today.setHours(0,0,0,0);
  document.getElementById('dayList').innerHTML = Array.from({length:10},(_,i)=>{
    const d=new Date(start); d.setDate(start.getDate()+i); d.setHours(0,0,0,0);
    const day=i+1; const count=state.itinerary.filter(x=>Number(x.day)===day).length;
    const cls=d<today?'done':(d.getTime()===today.getTime()?'today':'');
    return `<button class="day-card ${cls}" data-day="${day}"><div><strong>Day ${day}</strong><p class="muted">${dateText(d)}｜${count}個安排</p></div><span>›</span></button>`;
  }).join('');
  document.querySelectorAll('[data-day]').forEach(btn=>btn.onclick=()=>{selectedDay=Number(btn.dataset.day); renderDayDetail();});
  renderDayDetail();
}
function renderDayDetail(){
  const box=document.getElementById('dayDetail'); box.classList.remove('hidden');
  const items=state.itinerary.filter(x=>Number(x.day)===selectedDay);
  const density = items.length>=6?'爆滿':items.length>=3?'正常':'輕鬆';
  box.innerHTML = `<h3>Day ${selectedDay} 詳情 <span class="tag ${density==='爆滿'?'hot':'green'}">密度：${density}</span></h3>` +
    (items.length?items.map(x=>`<article class="item-card"><div class="item-top"><div><h3>${x.period}｜${escapeHtml(x.title)}</h3><p class="muted">${x.type}｜${escapeHtml(x.location||'')}</p></div><span class="tag">${yen(Number(x.cost||0))}</span></div><p>交通：${escapeHtml(x.transport||'未填')}</p>${x.note?`<p class="muted">${escapeHtml(x.note)}</p>`:''}${x.mapUrl?`<div class="card-actions"><a class="small-btn" target="_blank" href="${x.mapUrl}">地圖</a></div>`:''}</article>`).join(''):`<p class="muted">這日暫時未有行程。</p>`);
}
function renderExpenses(){
  const list=document.getElementById('expenseList');
  list.innerHTML = state.expenses.length ? state.expenses.map(x=>`<div class="item-card"><div class="item-top"><div><h3>${escapeHtml(x.item)}</h3><p class="muted">${x.category}｜付款：${x.payer}｜${x.splitCount||5}人分</p></div><strong>${yen(Number(x.amount||0))}</strong></div>${x.note?`<p class="muted">${escapeHtml(x.note)}</p>`:''}<div class="card-actions"><button class="small-btn" data-edit-expense="${x.id}">修改</button><button class="small-btn" data-delete-expense="${x.id}">刪除</button></div></div>`).join('') : '<p class="muted">未有支出。</p>';
  list.querySelectorAll('[data-delete-expense]').forEach(btn=>btn.onclick=()=>deleteExpense(btn.dataset.deleteExpense));
  list.querySelectorAll('[data-edit-expense]').forEach(btn=>btn.onclick=()=>editExpense(btn.dataset.editExpense));
}
function editExpense(id){
  const x=state.expenses.find(e=>e.id===id); if(!x) return;
  const form=document.getElementById('expenseForm');
  ['id','item','category','amount','payer','splitCount','note'].forEach(k=>form.elements[k].value=x[k]||'');
  document.getElementById('expenseModal').showModal();
}
async function deleteExpense(id){ if(!confirm('確定刪除支出？')) return; await mutate('deleteExpense',{id},()=>state.expenses=state.expenses.filter(x=>x.id!==id)); renderAll(); }
function renderBudgetChart(){
  const el=document.getElementById('budgetChart'); if(!el) return;
  const groups={}; state.expenses.forEach(x=>groups[x.category]=(groups[x.category]||0)+Number(x.amount||0));
  const labels=Object.keys(groups); const data=Object.values(groups);
  if(budgetChart) budgetChart.destroy();
  budgetChart=new Chart(el,{type:'pie',data:{labels,datasets:[{data}]},options:{responsive:true,plugins:{legend:{position:'bottom'}}}});
}
function dateText(d){ return d.toLocaleDateString('zh-HK',{month:'short',day:'numeric'}); }
function yen(n){ return '¥' + Number(n||0).toLocaleString('ja-JP'); }
function escapeHtml(str){ return String(str||'').replace(/[&<>"]/g,s=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[s])); }
function showToast(msg){ const t=document.getElementById('toast'); t.textContent=msg; t.classList.remove('hidden'); clearTimeout(showToast.timer); showToast.timer=setTimeout(()=>t.classList.add('hidden'),1800); }
