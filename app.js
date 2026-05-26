const $ = (q, root = document) => root.querySelector(q);
const $$ = (q, root = document) => Array.from(root.querySelectorAll(q));

const STORE = {
  settings: 'jpPlanner_settings_v2',
  wishes: 'jpPlanner_wishes_v2',
  dayEdits: 'jpPlanner_dayEdits_v3',
  photo: 'jpPlanner_photo_v2'
};

const trip = {
  title: 'Japan Route Remix',
  start: '2026-07-24',
  end: '2026-08-02',
  route: [
    ['大阪', '24/7–26/7'], ['名古屋', '26/7–28/7'], ['河口湖', '28/7–30/7'], ['千葉船橋', '30/7–2/8'], ['東京市區', '31/7']
  ],
  days: [
    {day:1,date:'24/7',city:'大阪',stay:'大阪西成區 松 1-chōme-9-19',route:'抵達關西機場 → 取車 → 入住大阪 Airbnb',focus:'19:40 降落後出關取車，直接開車到民宿；安頓後可到附近 24 小時「玉出超市」買日本蜜瓜、零食和飲品，或去附近吃深夜拉麵。',timeline:[['晚上','抵達關西機場','19:40 降落，出關、取行李、取車。'],['晚上','前往大阪住宿','開車到西成區民宿，先安頓行李。'],['深夜','補給 / 宵夜','玉出超市、便利店、拉麵作為輕鬆收尾。']],wants:['玉出超市','深夜拉麵','便利店補給']},
    {day:2,date:'25/7',city:'大阪',stay:'大阪西成區 松 1-chōme-9-19',route:'勝尾寺 → 萬博紀念公園 → Lalaport EXPOCITY → 天下茶屋/阿倍野晚餐',focus:'上午去勝尾寺拍攝達摩不倒翁；下午到萬博紀念公園看太陽之塔及搭摩天輪，在 Lalaport EXPOCITY 逛街；晚上回民宿附近吃串炸或大阪燒。',timeline:[['上午','勝尾寺','拍達摩不倒翁，建議預留足夠拍照時間。'],['下午','萬博紀念公園','太陽之塔、園區散步。'],['下午','Lalaport EXPOCITY','Shopping、摩天輪、休息補給。'],['晚上','天下茶屋 / 阿倍野晚餐','串炸、大阪燒、居酒屋候選。']],wants:['勝尾寺','萬博紀念公園','Lalaport EXPOCITY','天下茶屋美食','阿倍野晚餐']},
    {day:3,date:'26/7',city:'大阪 → 琵琶湖 → 名古屋',stay:'名古屋 中村區大正町 2-31',route:'大阪 Check-out → 琵琶湖一帶打卡 → 入住名古屋',focus:'上午收拾行李 Check-out，開車往滋賀縣；下午到白鬚神社看湖中鳥居，再去 La Collina 吃年輪蛋糕兼拍照；晚上到名古屋 Check-in，晚餐可去名古屋站附近「世界之山」吃手羽先。',timeline:[['上午','大阪 Check-out','收拾行李、檢查民宿、開車出發。'],['下午','白鬚神社','湖中鳥居打卡，注意停車及安全。'],['下午','La Collina','年輪蛋糕、甜點、建築打卡。'],['晚上','名古屋 Check-in','入住後到名古屋站附近覓食。']],wants:['白鬚神社','La Collina','世界之山手羽先','名古屋站商圈']},
    {day:4,date:'27/7',city:'名古屋',stay:'名古屋 中村區大正町 2-31',route:'犬山城下町 → 榮商圈 → Oasis 21 夜景',focus:'上午到國寶犬山城與城下町；下午回市區，把車停在榮商圈，逛 Oasis 21；晚上可吃矢場炸豬排或名古屋鰻魚飯。',timeline:[['上午','犬山城下町','城下町散步、犬山城外觀/入場。'],['下午','榮商圈','購物、咖啡、街區散步。'],['晚上','Oasis 21','夜景與拍照，晚餐在市區解決。']],wants:['犬山城下町','榮商圈','Oasis 21','矢場炸豬排','名古屋鰻魚飯']},
    {day:5,date:'28/7',city:'名古屋 → 河口湖',stay:'河口湖 Royal Hotel Kawaguchiko',route:'名古屋出發 → ぬくもりの森 → 御殿場 Premium Outlets → 河口湖酒店',focus:'上午由名古屋出發，先停靜岡「溫暖之森」；下午到御殿場 Premium Outlets Shopping；晚上入住河口湖 Royal Hotel，浸溫泉並可在酒店或附近吃饌飪。',timeline:[['上午','名古屋出發','長途車程日，早點出發會比較舒服。'],['中午','ぬくもりの森','童話風建築、輕食、拍照。'],['下午','御殿場 Premium Outlets','Shopping，可望富士山。'],['晚上','Royal Hotel Kawaguchiko','入住、溫泉、河口湖附近晚餐。']],wants:['ぬくもりの森','御殿場 Premium Outlets','河口湖溫泉','酒店晚餐']},
    {day:6,date:'29/7',city:'河口湖',stay:'河口湖 Royal Hotel Kawaguchiko',route:'新倉山淺間公園 → 大石公園 → 日川時計店 → MaxValu 晚餐',focus:'全日走富士五湖經典打卡位；晚上如酒店不包餐，可到 MaxValu 買和牛、生果、刺身、壽司和清酒，帶回房間享用。',timeline:[['上午','新倉山淺間公園','富士山 + 五重塔經典角度，注意樓梯。'],['下午','大石公園','湖景、花田、富士山視野。'],['下午','日川時計店','街景打卡位，注意不要阻礙交通。'],['晚上','MaxValu 採購','和牛、生果、刺身、壽司、清酒。']],wants:['新倉山淺間公園','大石公園','日川時計店','富士五湖拍照','MaxValu']},
    {day:7,date:'30/7',city:'河口湖 → 千葉船橋',stay:'千葉船橋市 三山 2-chōme-16-6',route:'忍野八海 → 鎌倉/江之島海岸線 → 入住千葉',focus:'上午先到忍野八海，再由富士山一帶出發；下午沿湘南海岸開車，必停鎌倉高校前拍江之電平交道；傍晚經灣岸線前往千葉船橋入住。',timeline:[['上午','忍野八海','清水池、商店街、富士山視野。'],['下午','鎌倉 / 江之島海岸線','湘南海邊開車與打卡。'],['下午','鎌倉高校前','江之電平交道，留意人流和交通。'],['晚上','千葉船橋 Check-in','經灣岸線入住，先補給休息。']],wants:['忍野八海','鎌倉高校前','江之島海岸線','灣岸線夜景']},
    {day:8,date:'31/7',city:'東京市區',stay:'千葉船橋市 三山 2-chōme-16-6',route:'東京市區電車遊',focus:'車留在民宿，全家坐電車進東京；白天去原宿竹下通、表參道、澀谷；晚上到東京都廳觀景台看夜景，再坐車回船橋。',timeline:[['上午','電車進東京','不用開車進市區，減少泊車壓力。'],['白天','原宿 / 表參道 / 澀谷','逛街、甜品、打卡。'],['晚上','東京都廳觀景台','免費夜景候選，之後返回船橋。']],wants:['原宿竹下通','表參道','澀谷','東京都廳觀景台']},
    {day:9,date:'1/8',city:'千葉船橋',stay:'千葉船橋市 三山 2-chōme-16-6',route:'LaLaport TOKYO-BAY → Giga DAISO → 船橋晚餐',focus:'全天留在船橋 Shopping；第一站 LaLaport TOKYO-BAY，第二站全日本最大的 DAISO；晚上在當地居酒屋或和牛燒肉店吃晚餐，整理戰利品。',timeline:[['上午','LaLaport TOKYO-BAY','大型商場，適合集中購物。'],['下午','Giga DAISO','大型百円店，買手信與生活小物。'],['晚上','船橋晚餐','居酒屋或和牛燒肉，整理戰利品。']],wants:['LaLaport TOKYO-BAY','Giga DAISO','船橋居酒屋','和牛燒肉']},
    {day:10,date:'2/8',city:'千葉 → 機場 → 香港',stay:'無住宿',route:'千葉 → 機場還車 → 香港',focus:'上午整理行李與戰利品；下午開車前往成田或羽田機場還車，然後推行李登機回港，結束行程。',timeline:[['上午','整理行李','戰利品分類、檢查房間、預留重量。'],['下午','機場還車','前往機場，預留還車與安檢時間。'],['晚上','回香港','完成10日旅程。']],wants:['機場還車','行李整理','最後手信']}
  ],
  stays: [
    {id:'osaka',city:'大阪',dates:'24/7 - 26/7',name:'大阪西成區民宿',address:'大阪西成區 松 1-chōme-9-19',phone:'未提供（民宿 / Airbnb）',booking:'Airbnb',facilities:['鄰近花園町 / 天下茶屋生活圈','附近 24 小時玉出超市','可作深夜補給點','生活機能佳','廚房/洗衣資料待確認'],photos:['🏮','🍜','🛒'],tone:'bg-osaka',note:'Day 1–2 使用，主要功能是落機後安頓與大阪市區/近郊行程。'},
    {id:'nagoya',city:'名古屋',dates:'26/7 - 28/7',name:'名古屋中村區住宿',address:'名古屋 中村區大正町 2-31',phone:'未提供（住宅 / 民宿）',booking:'待補充（民宿平台 / 朋友資料）',facilities:['靠近名古屋站商圈方向','適合作為中部中轉點','住宅區相對安靜','停車/洗衣資料待確認'],photos:['🏯','🍗','🌃'],tone:'bg-nagoya',note:'Day 3–4 使用，連接琵琶湖、犬山城、名古屋市區。'},
    {id:'kawaguchi',city:'河口湖',dates:'28/7 - 30/7',name:'Royal Hotel Kawaguchiko',address:'6713-22 Funatsu, Fujikawaguchiko, Minamitsuru District, Yamanashi 401-0301, Japan',phone:'+81 555-73-2228',booking:'Trip.com / 酒店官網',facilities:['天然溫泉','室內浴池','庭園露天風呂','便利店 / 自助入住系統','日式房間 / 榻榻米','近河口湖'],photos:['🗻','♨️','🌊'],tone:'bg-fuji',note:'Day 5–6 使用，富士五湖打卡與溫泉休息核心住宿。'},
    {id:'chiba',city:'千葉船橋',dates:'30/7 - 2/8',name:'千葉船橋市住宿',address:'千葉船橋市 三山 2-chōme-16-6',phone:'未提供（民宿 / 固定住宿）',booking:'待補充（民宿平台 / 朋友資料）',facilities:['適合最後購物與整理行李','往東京可用電車','前往機場還車較方便','附近生活機能待確認'],photos:['🛍️','🚃','✈️'],tone:'bg-chiba',note:'Day 7–9 使用，東京市區電車遊、船橋 Shopping、最後還車前基地。'}
  ]
};


const defaultSettings = {person:'A'};
let lastRouteKey = '';

const missionDeck = [
  {tag:'便利店任務', text:'每人買一款未試過的便利店飲品，全員盲飲投票。', hint:'適合夜晚回住宿前做，便宜又有氣氛。'},
  {tag:'美食任務', text:'今日找一間不用排長隊但看起來很地道的小店。', hint:'規則：不要只看網紅店，看到本地人多也可以試。'},
  {tag:'拍照任務', text:'拍一張「全員像電影海報」的合照。', hint:'可以在車站、夜景、商場外牆完成。'},
  {tag:'手信任務', text:'每人用 HK$50 內買一件最有日本感的小手信。', hint:'最後晚上一起展示，選出最有創意的一件。'},
  {tag:'扭蛋任務', text:'找一部扭蛋機，每人抽一次，最奇怪的贏。', hint:'商場、車站、景點附近通常都有。'},
  {tag:'宵夜任務', text:'用最少步行距離，找到今晚最舒服的宵夜。', hint:'拉麵、便利店、居酒屋、超市刺身都算。'},
  {tag:'車歌任務', text:'每人負責一首車歌，今日車程輪流播放。', hint:'長途車程日特別適合。'},
  {tag:'觀察任務', text:'找一個香港沒有、但日本很常見的小細節。', hint:'例如停車場、便利店、廁所、販賣機。'},
  {tag:'打卡任務', text:'用同一個姿勢，在三個不同地點拍照。', hint:'之後可以拼成一張很蠢但好笑的圖。'},
  {tag:'超市任務', text:'今晚超市每人選一款「看不懂但想試」的食物。', hint:'適合 MaxValu、玉出、便利店。'},
  {tag:'天氣任務', text:'如果今日見到富士山，全員即刻拍一張證明照。', hint:'富士山不一定日日見到，見到就要把握。'},
  {tag:'購物任務', text:'今日只准買一件「真正會用」的東西。', hint:'避免爆買後行李太重。'},
  {tag:'友情任務', text:'每人偷偷幫另一個人拍一張自然照。', hint:'不用擺 pose，越自然越好。'},
  {tag:'餐廳任務', text:'今日晚餐要有一樣大家都未食過的菜式。', hint:'名古屋手羽先、鰻魚飯、串炸都可以。'},
  {tag:'路線任務', text:'今日找一段最漂亮的車窗風景。', hint:'車上也可以成為旅程回憶。'},
  {tag:'零食任務', text:'每人選一款零食，晚上開零食評分會。', hint:'評分：味道、包裝、回購意欲。'},
  {tag:'省錢任務', text:'今日找一個免費但值得停留的地方。', hint:'公園、夜景、商場天台、湖邊都可以。'},
  {tag:'語言任務', text:'今日每人學一句日文實用句。', hint:'例如結帳、問路、謝謝、打擾了。'},
  {tag:'旅行感任務', text:'拍一張「這就是日本」的照片。', hint:'不用名勝，小街、燈牌、電車也可以。'},
  {tag:'甜品任務', text:'今日一定要找一款甜品或雪糕。', hint:'便利店雪糕也可以當完成。'},
  {tag:'戰利品任務', text:'今晚回住宿後，每人展示今日最滿意的一件事。', hint:'可以是買到的東西，也可以是拍到的照片。'},
  {tag:'路人感任務', text:'今日用 10 分鐘像本地人一樣慢慢行一段街。', hint:'不要趕行程，只觀察。'},
  {tag:'搞笑任務', text:'每人拍一張「最不似旅遊照」的照片。', hint:'例如便利店門口、停車場、奇怪招牌。'},
  {tag:'飲品任務', text:'找一部販賣機，每人選一款飲品。', hint:'熱飲、限定口味、怪味都可以。'},
  {tag:'整理任務', text:'今晚睡前花 5 分鐘整理明日要帶的東西。', hint:'尤其是車匙、護照、充電線、行動電源。'},
  {tag:'小挑戰', text:'今日不看評分，憑直覺選一間店。', hint:'只限小食或飲品，降低踩雷成本。'},
  {tag:'回憶任務', text:'每人錄一段 10 秒今日感想。', hint:'不用拍樣，拍景配聲音也可以。'},
  {tag:'夜景任務', text:'今晚找一個不用花錢的夜景位。', hint:'天橋、觀景台、商場外、湖邊都可以。'},
  {tag:'交通任務', text:'今日記低一個下次再來也會用的交通技巧。', hint:'例如泊車位、轉車方法、走捷徑。'},
  {tag:'早餐任務', text:'明天早餐由一個人負責提案。', hint:'輪流做旅行小隊長。'}
];

function load(key, fallback){try{return JSON.parse(localStorage.getItem(key)) ?? fallback}catch{return fallback}}
function save(key, value){localStorage.setItem(key, JSON.stringify(value))}
function settings(){return {...defaultSettings, ...load(STORE.settings,{})}}
function setSettings(next){save(STORE.settings, {...settings(), ...next})}
function escapeHTML(str=''){return String(str).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
function go(route){location.hash = route === 'home' ? '#/' : `#/${route}`}
function todayStatus(index){
  const start = new Date(trip.start+'T00:00:00'); const now = new Date();
  const current = Math.floor((new Date(now.getFullYear(),now.getMonth(),now.getDate()) - start)/86400000)+1;
  if(current === index) return ['今日','status-today'];
  if(current > index) return ['已完成','status-done'];
  return ['未開始','status-upcoming'];
}
function toast(message){const el=document.createElement('div');el.className='toast';el.textContent=message;document.body.appendChild(el);setTimeout(()=>el.remove(),2200)}
function pickMission(exceptText=''){
  let item = missionDeck[Math.floor(Math.random()*missionDeck.length)];
  if(missionDeck.length>1){
    while(item.text===exceptText) item = missionDeck[Math.floor(Math.random()*missionDeck.length)];
  }
  return item;
}

function getDayEdits(){return load(STORE.dayEdits || 'jpPlanner_dayEdits_v3', {})}
function setDayEdits(obj){save(STORE.dayEdits || 'jpPlanner_dayEdits_v3', obj)}
function getDay(n){
  const base = trip.days.find(x=>x.day===Number(n)) || trip.days[0];
  const edit = getDayEdits()[base.day] || {};
  return {...base, ...edit, timeline: edit.timeline || base.timeline, wants: edit.wants || base.wants};
}
function getAllDays(){return trip.days.map(d=>getDay(d.day))}
function timelineToText(timeline){return timeline.map(t=>`${t[0]} | ${t[1]} | ${t[2]}`).join('\n')}
function textToTimeline(text){
  return String(text||'').split('\n').map(line=>line.trim()).filter(Boolean).map(line=>{
    const parts=line.split('|').map(x=>x.trim());
    return [parts[0]||'時間待定', parts[1]||'未命名項目', parts.slice(2).join(' | ')||''];
  });
}
function wantsToText(wants){return (wants||[]).join('\n')}
function textToWants(text){return String(text||'').split(/[\n,，]/).map(x=>x.trim()).filter(Boolean)}

function render(){
  const routeKey = location.hash.replace(/^#\/?/,'') || 'home';
  const [page,arg] = routeKey.split('/');
  $$('.nav-item').forEach(btn=>btn.classList.toggle('active', btn.dataset.route===page || (page==='day' && btn.dataset.route==='itinerary') || (!page && btn.dataset.route==='home')));
  if(page==='itinerary') renderItinerary();
  else if(page==='day') renderDay(Number(arg));
  else if(page==='stays') renderStays();
  else renderHome();
  if(routeKey !== lastRouteKey){
    requestAnimationFrame(()=>window.scrollTo({top:0,left:0,behavior:'instant'}));
    lastRouteKey = routeKey;
  }
}

function renderHome(){
  const firstMission = pickMission();
  $('#app').innerHTML = `
    <section class="hero home-hero">
      <div class="hero-content">
        <div class="kicker">JAPAN ROUTE LAB</div>
        <h1>今日想點玩？</h1>
        <p>把10日行程變成一個旅行遊戲：抽任務、開盲盒、儲印章，再按入每日頁面改行程。</p>
        <div class="hero-actions">
          <button class="secondary-btn" data-route="itinerary">打開10日行程</button>
          <button class="secondary-btn" id="randomDayBtn">行程盲盒</button>
        </div>
      </div>
    </section>

    <section class="section home-grid">
      <button class="mission-card" id="missionCard" type="button">
        <span class="tag" id="missionTag">🎲 ${escapeHTML(firstMission.tag)}</span>
        <h2 id="missionText">${escapeHTML(firstMission.text)}</h2>
        <p id="missionHint">${escapeHTML(firstMission.hint)}</p>
        <small>按這張卡即刻抽新任務，不會重新載入網頁。</small>
      </button>
      <div class="card mini-console">
        <span class="tag">🧭 Quick Play</span>
        <h2>旅行控制台</h2>
        <div class="console-buttons">
          <button class="chip" data-route="itinerary">看行程</button>
          <button class="chip" data-route="stays">看住宿</button>
          <button class="chip" id="surpriseDayBtn">隨機一日</button>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="section-head"><div><h2>旅程印章板</h2></div></div>
      <div class="stamp-board">
        <div class="stamp">🏮<b>深夜補給</b></div>
        <div class="stamp">🏯<b>城下町散步</b></div>
        <div class="stamp">🗻<b>富士山打卡</b></div>
        <div class="stamp">♨️<b>溫泉回血</b></div>
        <div class="stamp">🛍️<b>戰利品日</b></div>
        <div class="stamp">✈️<b>還車回港</b></div>
      </div>
    </section>

    <section class="section">
      <div class="section-head"><div><h2>10日路線拼圖</h2></div></div>
      <div class="day-chip-grid">
        ${getAllDays().map(d=>`<button class="day-chip" data-day="${d.day}"><b>D${d.day}</b><span>${escapeHTML(d.date)}</span><small>${escapeHTML(d.city)}</small></button>`).join('')}
      </div>
    </section>
  `;
  $('#randomDayBtn').onclick = () => go(`day/${Math.ceil(Math.random()*10)}`);
  $('#surpriseDayBtn').onclick = () => go(`day/${Math.ceil(Math.random()*10)}`);
  $('#missionCard').onclick = () => {
    const current = $('#missionText').textContent;
    const next = pickMission(current);
    $('#missionTag').textContent = `🎲 ${next.tag}`;
    $('#missionText').textContent = next.text;
    $('#missionHint').textContent = next.hint;
    $('#missionCard').classList.remove('mission-pop');
    void $('#missionCard').offsetWidth;
    $('#missionCard').classList.add('mission-pop');
  };
  $$('[data-day]').forEach(btn=>btn.onclick=()=>go(`day/${btn.dataset.day}`));
  $$('[data-route]').forEach(btn=>btn.onclick=()=>go(btn.dataset.route));
}

function renderItinerary(){
  $('#app').innerHTML = `
    <section class="section-head"><div><h2>10日行程</h2></div></section>
    <div class="day-list">${getAllDays().map(d=>{const [label, cls]=todayStatus(d.day);return `<button class="day-row ${cls==='status-done'?'done':''}" data-day="${d.day}"><div class="day-num">D${d.day}</div><div><div class="day-title">Day ${d.day}｜${escapeHTML(d.date)}｜${escapeHTML(d.city)}</div><div class="day-summary">${escapeHTML(d.route)}</div></div><span class="status-pill ${cls}">${label}</span></button>`}).join('')}</div>
  `;
  $$('.day-row').forEach(btn=>btn.onclick=()=>go(`day/${btn.dataset.day}`));
}

function renderDay(n){
  const d=getDay(n);
  const [label, cls]=todayStatus(d.day);
  const wishes = getWishes().filter(w=>Number(w.day)===d.day);
  $('#app').innerHTML = `
    <section class="day-detail-hero">
      <button class="back-btn" id="backToDays">← 返回行程</button>
      <h1>Day ${d.day}</h1>
      <p>${escapeHTML(d.date)}｜${escapeHTML(d.city)}</p>
      <div class="day-edit-tools"><span class="status-pill ${cls}">${label}</span><button class="back-btn" id="editDayBtn">✏️ 修改本日</button></div>
    </section>

    <section class="section edit-panel" id="dayEditPanel" hidden>
      <div class="card">
        <h2 style="margin-top:0">修改 Day ${d.day}</h2>
        <form id="dayEditForm" class="form-grid">
          <input name="date" value="${escapeHTML(d.date)}" placeholder="日期，例如 24/7" />
          <input name="city" value="${escapeHTML(d.city)}" placeholder="城市 / 區域" />
          <input name="stay" value="${escapeHTML(d.stay)}" placeholder="住宿" />
          <input name="route" value="${escapeHTML(d.route)}" placeholder="路線摘要" />
          <textarea name="focus" placeholder="重點">${escapeHTML(d.focus)}</textarea>
          <label class="edit-label">今日節奏，每行格式：時間 | 地點/活動 | 備註</label>
          <textarea name="timeline" class="tall-textarea">${escapeHTML(timelineToText(d.timeline))}</textarea>
          <label class="edit-label">今日想去 / 候選，每行一個</label>
          <textarea name="wants">${escapeHTML(wantsToText(d.wants))}</textarea>
          <div class="form-actions">
            <button class="primary-btn">儲存修改</button>
            <button type="button" class="secondary-btn" id="resetDayBtn">還原 Notion 原本內容</button>
          </div>
        </form>
      </div>
    </section>

    <section class="section grid two">
      <div class="card info-table">
        <div class="info-line"><b>住宿</b><span>${escapeHTML(d.stay)}</span></div>
        <div class="info-line"><b>路線</b><span>${escapeHTML(d.route)}</span></div>
        <div class="info-line"><b>重點</b><span>${escapeHTML(d.focus)}</span></div>
      </div>
      <div class="card">
        <h2 style="margin-top:0">今日節奏</h2>
        <div class="timeline">${d.timeline.map(t=>`<div class="timeline-item"><div class="timeline-time">${escapeHTML(t[0])}</div><div class="timeline-card"><h3>${escapeHTML(t[1])}</h3><p>${escapeHTML(t[2])}</p></div></div>`).join('')}</div>
      </div>
    </section>
    <section class="section">
      <div class="section-head"><div><h2>今日想去 / 候選</h2></div></div>
      <div class="chip-row" style="margin-bottom:12px">${d.wants.map(w=>`<span class="chip">📍 ${escapeHTML(w)}</span>`).join('')}</div>
      <div class="wish-list">${wishes.length?wishes.map(wishCard).join(''):'<div class="empty">這一天暫時未有人新增額外想去地方。</div>'}</div>
      <div class="card" style="margin-top:14px">
        <h3 style="margin-top:0">＋ 加入這一天想去的地方</h3>
        <form id="wishForm" class="form-grid">
          <input name="name" placeholder="地方 / 餐廳名稱" required />
          <select name="type"><option>景點</option><option>餐廳</option><option>購物</option><option>交通</option><option>活動</option><option>其他</option></select>
          <select name="priority"><option>必去</option><option>想去</option><option>可去</option></select>
          <textarea name="note" placeholder="備註，例如：最好下午去 / 要預約 / 想拍照"></textarea>
          <button class="primary-btn">新增到 Day ${d.day}</button>
        </form>
      </div>
    </section>
  `;
  $('#backToDays').onclick=()=>go('itinerary');
  $('#editDayBtn').onclick=()=>{$('#dayEditPanel').hidden=!$('#dayEditPanel').hidden; if(!$('#dayEditPanel').hidden) $('#dayEditPanel').scrollIntoView({behavior:'smooth',block:'start'});};
  $('#resetDayBtn').onclick=()=>{const edits=getDayEdits(); delete edits[d.day]; setDayEdits(edits); toast('已還原 Day '+d.day); renderDay(d.day)};
  $('#dayEditForm').onsubmit=(e)=>{
    e.preventDefault();
    const fd=new FormData(e.currentTarget);
    const edits=getDayEdits();
    edits[d.day]={
      date:fd.get('date'), city:fd.get('city'), stay:fd.get('stay'), route:fd.get('route'), focus:fd.get('focus'),
      timeline:textToTimeline(fd.get('timeline')), wants:textToWants(fd.get('wants')), updatedAt:new Date().toISOString()
    };
    setDayEdits(edits); toast('Day '+d.day+' 已修改'); renderDay(d.day);
  };
  $('#wishForm').onsubmit=(e)=>{e.preventDefault();const fd=new FormData(e.currentTarget);addWish({day:d.day,name:fd.get('name'),type:fd.get('type'),priority:fd.get('priority'),note:fd.get('note')});renderDay(d.day);toast('已加入今日想去清單')};
  $$('.vote-wish').forEach(btn=>btn.onclick=()=>{voteWish(btn.dataset.id);renderDay(d.day)});
  $$('.delete-wish').forEach(btn=>btn.onclick=()=>{deleteWish(btn.dataset.id);renderDay(d.day)});
}
function wishCard(w){return `<div class="wish-card"><div class="wish-top"><div><div class="wish-title">${escapeHTML(w.name)}</div><div class="wish-meta">${escapeHTML(w.type)}｜${escapeHTML(w.priority)}｜by ${escapeHTML(w.person)}</div></div><span class="tag">❤️ ${w.votes||0}</span></div>${w.note?`<p class="small-note">${escapeHTML(w.note)}</p>`:''}<div class="chip-row" style="margin-top:10px"><button class="chip vote-wish" data-id="${w.id}">想去 +1</button><button class="chip delete-wish" data-id="${w.id}">刪除</button></div></div>`}
function getWishes(){return load(STORE.wishes,[])}
function addWish(w){const list=getWishes();list.push({...w,id:crypto.randomUUID(),person:settings().person,votes:0,createdAt:new Date().toISOString()});save(STORE.wishes,list)}
function voteWish(id){save(STORE.wishes,getWishes().map(w=>w.id===id?{...w,votes:(w.votes||0)+1}:w));toast('已投票')}
function deleteWish(id){save(STORE.wishes,getWishes().filter(w=>w.id!==id));toast('已刪除')}

function renderStays(){
  $('#app').innerHTML = `
    <section class="section-head"><div><h2>住宿資訊</h2></div></section>
    <div class="grid two">${trip.stays.map(stayCard).join('')}</div>
  `;
  $$('.photo-prev').forEach(btn=>btn.onclick=()=>shiftPhoto(btn.dataset.stay,-1));
  $$('.photo-next').forEach(btn=>btn.onclick=()=>shiftPhoto(btn.dataset.stay,1));
}
function stayCard(s){const photoIndex=getPhotoIndex(s.id);const emoji=s.photos[photoIndex%s.photos.length];return `<article class="card stay-card"><div class="stay-cover ${s.tone}"><div class="photo-layer"><span>${emoji}</span></div><div class="carousel-controls"><button class="photo-prev" data-stay="${s.id}">‹</button><button class="photo-next" data-stay="${s.id}">›</button></div><h2>${escapeHTML(s.city)}</h2><p>${escapeHTML(s.dates)}｜${escapeHTML(s.name)}</p></div><div class="stay-body"><div class="detail-list"><div><b>地址</b><span>${escapeHTML(s.address)}<br><a class="map-link" target="_blank" rel="noreferrer" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s.address)}">打開 Google Maps</a></span></div><div><b>電話</b><span>${escapeHTML(s.phone)}</span></div><div><b>預訂</b><span>${escapeHTML(s.booking)}</span></div><div><b>備註</b><span>${escapeHTML(s.note)}</span></div></div><div><b>設施 / 優點</b><div class="amenities">${s.facilities.map(f=>`<span>${escapeHTML(f)}</span>`).join('')}</div></div></div></article>`}
function getPhotoIndex(id){return (load(STORE.photo,{})[id] || 0)}
function shiftPhoto(id,step){const obj=load(STORE.photo,{});const stay=trip.stays.find(s=>s.id===id);obj[id]=((obj[id]||0)+step+stay.photos.length)%stay.photos.length;save(STORE.photo,obj);renderStays()}

function initSettings(){
  const dialog=$('#settingsDialog');
  $('#settingsBtn').onclick=()=>{const s=settings();$('#personSelect').value=s.person;dialog.showModal()};
  $('#saveSettings').onclick=(e)=>{e.preventDefault();setSettings({person:$('#personSelect').value});dialog.close();toast('設定已儲存');render()};
}
function initNav(){
  $$('[data-route]').forEach(btn=>btn.addEventListener('click',()=>go(btn.dataset.route)));
  addEventListener('hashchange',render);
}
initSettings();initNav();render();
