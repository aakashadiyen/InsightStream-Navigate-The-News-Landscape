const NEWS_API_KEY = '';
const loadMoreBtn = document.getElementById('loadMore');
const searchInput = document.getElementById('searchInput');
const categorySelect = document.getElementById('categorySelect');
const subscribeBtn = document.getElementById('subscribeBtn');
const modal = document.getElementById('modal');
const modalClose = document.getElementById('modalClose');
const subSave = document.getElementById('subSave');
const subEmail = document.getElementById('subEmail');
const subMsg = document.getElementById('subMsg');


async function fetchNews({page=1,q='',category=''}={}){
try {
if(!NEWS_API_KEY) return [];
const response = await fetch(`https://newsapi.org/v2/top-headlines?apiKey=${NEWS_API_KEY}&page=${page}&pageSize=${PAGE_SIZE}&q=${q}&country=in${category?`&category=${category}`:''}`);
const data = await response.json();
return data.articles || [];
} catch (err) {
console.error(err);
return [];
}
}


function renderArticles(items){
grid.innerHTML = '';
items.forEach(a => {
const card = document.createElement('div');
card.className = 'card';
const thumb = a.urlToImage ? `<div style="height:160px;background-image:url(${a.urlToImage});background-size:cover;background-position:center;border-radius:8px"></div>` : '';
const favBtn = `<button class='mutebtn' onclick='toggleFav("${a.url}",this)'>${favorites.has(a.url)?"Unfavorite":"Favorite"}</button>`;
card.innerHTML = `${thumb}<div>${a.title}</div><p>${a.description||''}</p><button class='btn' onclick='window.open("${a.url}","_blank")'>Read</button>${favBtn}`;
grid.appendChild(card);
});
}


function toggleFav(url, btn){
if(favorites.has(url)) favorites.delete(url);
else favorites.add(url);
localStorage.setItem('insight_favs', JSON.stringify(Array.from(favorites)));
btn.textContent = favorites.has(url)?"Unfavorite":"Favorite";
}


async function loadPage(){
const items = await fetchNews({page:currentPage,q:searchInput.value,category:categorySelect.value});
renderArticles(items);
}


loadMoreBtn.addEventListener('click',()=>{currentPage++;loadPage();});
searchInput.addEventListener('input',()=>{currentPage=1;loadPage();});
categorySelect.addEventListener('change',()=>{currentPage=1;loadPage();});
subscribeBtn.addEventListener('click',()=>{modal.style.display='flex'});
modalClose.addEventListener('click',()=>{modal.style.display='none'});
subSave.addEventListener('click',()=>{
const email=subEmail.value.trim();
if(!email){subMsg.textContent='Enter valid email';return;}
fetch('/subscribe',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email})})
.then(r=>r.json()).then(d=>{subMsg.textContent=d.message;});
});


window.onload=loadPage;