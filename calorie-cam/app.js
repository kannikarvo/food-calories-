const icons={home:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 10.8 12 3l9 7.8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/></svg>',calendar:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18"/></svg>',chart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 20V10m6 10V4m6 16v-7m5 7H2"/></svg>',user:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 21c.6-4 3.2-6 8-6s7.4 2 8 6"/></svg>',target:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3"/></svg>',camera:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 7h3l1.5-2h7L17 7h3a1 1 0 0 1 1 1v11H3V8a1 1 0 0 1 1-1z"/><circle cx="12" cy="13" r="4"/></svg>'};
document.querySelectorAll('[data-icon]').forEach(el=>el.innerHTML=icons[el.dataset.icon]||'');

const starterMeals=[
 {id:1,type:'Breakfast',time:'8:12 AM',name:'Avocado toast & egg',foods:['Sourdough toast','Avocado','Poached egg'],calories:386,protein:19,carbs:39,fat:18,image:'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=300&q=80'},
 {id:2,type:'Lunch',time:'12:46 PM',name:'Grilled chicken bowl',foods:['Chicken breast','Brown rice','Mixed greens'],calories:452,protein:29,carbs:53,fat:13,image:'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=300&q=80'}
];
let goal=Number(localStorage.getItem('platefulGoal'))||1850;
let meals=JSON.parse(localStorage.getItem('platefulMeals')||'null')||starterMeals;
let currentImage='';
let detected=[{name:'Grilled chicken breast',portion:'140 g',calories:231,protein:43,carbs:0,fat:5},{name:'Roasted sweet potato',portion:'1 cup',calories:180,protein:4,carbs:41,fat:0},{name:'Mixed green salad',portion:'1.5 cups',calories:84,protein:2,carbs:9,fat:5}];

const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
const date=new Date();
$('#dateLabel').textContent=date.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'});

function save(){localStorage.setItem('platefulMeals',JSON.stringify(meals));localStorage.setItem('platefulGoal',goal)}
function totals(){return meals.reduce((a,m)=>({calories:a.calories+m.calories,protein:a.protein+(m.protein||0),carbs:a.carbs+(m.carbs||0),fat:a.fat+(m.fat||0)}),{calories:0,protein:0,carbs:0,fat:0})}
function mealHTML(m){return `<article class="meal-card" data-id="${m.id}"><img class="meal-photo" src="${m.image}" alt="${m.name}"><div class="meal-meta"><small>${m.type} · ${m.time}</small><h3>${m.name}</h3><div class="food-tags">${m.foods.slice(0,3).map(f=>`<span>${f}</span>`).join('')}</div></div><div class="meal-nutrition"><strong>${m.calories} kcal</strong><small>${m.protein}g P · ${m.carbs}g C · ${m.fat}g F</small></div></article>`}
function render(){
 const t=totals(),pct=Math.min(t.calories/goal*100,100),remaining=Math.max(goal-t.calories,0);
 $('#remainingCount').textContent=remaining.toLocaleString();$('#consumedCount').innerHTML=`${t.calories.toLocaleString()} <small>kcal consumed</small>`;$('#goalCopy').textContent=`of your ${goal.toLocaleString()} kcal daily goal`;$('#goalProgress').style.width=pct+'%';$('#calorieRing').style.setProperty('--progress',pct+'%');
 $('#proteinCount').textContent=t.protein+'g';$('#carbCount').textContent=t.carbs+'g';$('#fatCount').textContent=t.fat+'g';
 $('#mealList').innerHTML=meals.map(mealHTML).join('');$('#emptyState').classList.toggle('hidden',meals.length>0);
 const groups={Today:meals,'Yesterday':starterMeals.slice().reverse()};$('#historyList').innerHTML=Object.entries(groups).map(([day,list])=>`<section class="history-day"><h3>${day}</h3><div class="meal-list">${list.map(mealHTML).join('')}</div></section>`).join('');
}
render();

const week=[1620,1890,1710,1840,1540,1760,()=>totals().calories],days=['M','T','W','T','F','S','Today'];
$('#weekChart').innerHTML=week.map((v,i)=>{v=typeof v==='function'?v():v;return `<div class="bar-wrap"><div class="bar ${i===6?'today':''}" style="height:${Math.max(v/2200*100,8)}%" title="${v} kcal"></div><small>${days[i]}</small></div>`}).join('');

function switchView(name){$$('.view').forEach(v=>v.classList.toggle('active',v.id===name+'View'));$$('[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===name));window.scrollTo({top:0,behavior:'smooth'})}
$$('[data-view]').forEach(b=>b.addEventListener('click',()=>switchView(b.dataset.view)));

function openModal(){resetModal();$('#mealModal').classList.add('open');$('#mealModal').setAttribute('aria-hidden','false');document.body.style.overflow='hidden'}
function closeModal(){$('#mealModal').classList.remove('open');$('#mealModal').setAttribute('aria-hidden','true');document.body.style.overflow=''}
function resetModal(){$$('.modal-step').forEach(s=>s.classList.remove('active'));$('#captureStep').classList.add('active');$('#photoInput').value=''}
$('#addMealBtn').addEventListener('click',openModal);$$('.add-trigger').forEach(b=>b.addEventListener('click',openModal));$$('[data-close]').forEach(b=>b.addEventListener('click',closeModal));$('#mealModal').addEventListener('click',e=>{if(e.target.id==='mealModal')closeModal()});

$('#photoInput').addEventListener('change',e=>{const f=e.target.files[0];if(!f)return;const reader=new FileReader();reader.onload=ev=>{currentImage=ev.target.result;$('#previewImage').src=currentImage;$('#reviewImage').src=currentImage;$('#captureStep').classList.remove('active');$('#analyzeStep').classList.add('active');setTimeout(()=>{$('#analyzeStep').classList.remove('active');$('#reviewStep').classList.add('active');renderFoods()},2200)};reader.readAsDataURL(f)});
function renderFoods(){
 $('#detectedFoods').innerHTML=detected.map((f,i)=>`<div class="food-row"><div class="food-name">${f.name}<small>${f.portion}</small></div><input type="number" min="0" value="${f.calories}" data-index="${i}" aria-label="Calories for ${f.name}"><button class="remove-food" data-remove="${i}" aria-label="Remove">×</button></div>`).join('');
 $$('#detectedFoods input').forEach(i=>i.addEventListener('input',e=>{detected[+e.target.dataset.index].calories=+e.target.value;updateEstimate()}));$$('[data-remove]').forEach(b=>b.addEventListener('click',()=>{detected.splice(+b.dataset.remove,1);renderFoods()}));updateEstimate();
}
function updateEstimate(){$('#estimateTotal').textContent=detected.reduce((s,f)=>s+Number(f.calories),0)+' kcal'}
$('#addFoodBtn').addEventListener('click',()=>{const name=prompt('What food item did we miss?');if(name){detected.push({name,portion:'1 serving',calories:100,protein:3,carbs:12,fat:4});renderFoods()}});
$('#saveMealBtn').addEventListener('click',()=>{const type=$('#mealType').value,calories=detected.reduce((s,f)=>s+Number(f.calories),0);meals.push({id:Date.now(),type,time:new Date().toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'}),name:detected.slice(0,2).map(f=>f.name.split(' ').slice(-2).join(' ')).join(' & ')||'Custom meal',foods:detected.map(f=>f.name),calories,protein:detected.reduce((s,f)=>s+(f.protein||0),0),carbs:detected.reduce((s,f)=>s+(f.carbs||0),0),fat:detected.reduce((s,f)=>s+(f.fat||0),0),image:currentImage});save();render();closeModal();$('#toast').classList.add('show');setTimeout(()=>$('#toast').classList.remove('show'),3200)});
$('#goalBtn').addEventListener('click',()=>{const next=prompt('Set your daily calorie goal:',goal);if(next&&Number(next)>0){goal=Number(next);save();render()}});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});
