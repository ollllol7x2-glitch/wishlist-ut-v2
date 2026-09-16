'use strict';

const products = [
  {id:'p01',store:'슬로우앤드',name:'[오늘드림🚚] made. 썸머 빈티지 데님롱스커트',price:35820,discount:27,category:'스커트',image:'p01-ivory-skirt.png',tags:['최저가도전','자체제작'],rating:'4.8',reviews:'753'},
  {id:'p02',store:'베니토',name:'그레이 골지 반팔 니트',price:20520,discount:23,category:'상의',image:'p02-grey-knit.png',tags:['쇼핑몰위크','무료배송'],rating:'4.8',reviews:'5,277'},
  {id:'p03',store:'베니토',name:'크림 와이드 슬랙스',price:33760,discount:32,category:'바지',image:'p03-cream-slacks.png',tags:['쇼핑몰위크','무료배송'],rating:'4.7',reviews:'6,748'},
  {id:'p04',store:'어텐',name:'그레이 밴딩 쇼츠',price:18900,discount:15,category:'바지',image:'p04-grey-shorts.png',tags:['무료배송']},
  {id:'p05',store:'밀크코코아',name:'다크블루 와이드 데님',price:42000,discount:20,category:'바지',image:'p05-darkblue-denim.png',tags:['무료배송']},
  {id:'p06',store:'빼뽕언니',name:'딥블루 부츠컷 데님',price:26500,discount:10,category:'바지',image:'p06-bootcut-denim.png',tags:['무료배송']}
];

const oldProducts = [
  {id:'p07',store:'데무어',name:'핀턱 와이드 슬랙스',price:16020,discount:19,category:'바지',image:'p07-black-slacks.webp',tags:['무료배송'],age:'6개월 전'},
  {id:'p08',store:'리얼코코',name:'스트라이프 루즈핏 셔츠',price:17820,discount:31,category:'상의',image:'p08-stripe-shirt.webp',tags:['무료배송'],age:'5개월 전'},
  {id:'p09',store:'몰렌테',name:'슬림 셔링 보트넥 티',price:28400,discount:24,category:'상의',image:'p09-burgundy-top.webp',tags:['무료배송'],age:'8개월 전'},
  {id:'p10',store:'아워모먼트',name:'브이넥 블루 니트',price:24600,discount:18,category:'상의',image:'p10-blue-knit.webp',tags:['무료배송'],age:'6개월 전'},
  {id:'p11',store:'아워모먼트',name:'썸머 브이넥 가디건',price:25200,discount:20,category:'아우터',image:'p11-navy-cardigan.webp',tags:['무료배송'],age:'7개월 전'},
  {id:'p12',store:'오디너리',name:'버건디 루즈핏 셔츠',price:32300,discount:15,category:'상의',image:'p12-burgundy-shirt.webp',tags:['무료배송'],age:'9개월 전'}
];

const extraProducts = [
  {id:'x07',store:'메리어라운드',name:'플라워 자카드 미디 스커트',price:29920,oldPrice:42800,discount:30,category:'스커트',image:'extra-7.webp',tags:['무료배송'],rating:'4.8',reviews:'324'},
  {id:'x08',store:'아멜리',name:'레이스 슬림 가디건',price:22930,oldPrice:35800,discount:36,category:'아우터',image:'extra-8.webp',tags:['무료배송'],rating:'4.7',reviews:'188'},
  {id:'x09',store:'논로컬',name:'브러시 와이드 데님',price:39800,oldPrice:56800,discount:30,category:'바지',image:'extra-9.webp',tags:['무료배송'],rating:'4.9',reviews:'512'},
  {id:'x10',store:'논로컬',name:'에어 쿨링 후드 집업',price:31810,oldPrice:53900,discount:41,category:'아우터',image:'extra-10.webp',tags:['무료배송'],rating:'4.8',reviews:'291'},
  {id:'x11',store:'베니토',name:'러플 브이넥 슬리브리스',price:18810,oldPrice:31900,discount:41,category:'상의',image:'extra-11.webp',tags:['쇼핑몰위크','무료배송'],rating:'4.6',reviews:'95'},
  {id:'x12',store:'파인땡큐',name:'베이지 와이드 코튼 팬츠',price:32900,oldPrice:47000,discount:30,category:'바지',image:'extra-12.webp',tags:['무료배송'],rating:'4.8',reviews:'406'}
];

const homeAnchorProducts = [
  {id:'p13',store:'슬로우앤드',name:'made. 레스 자카드 플라워 스커트',shortName:'플라워 스커트',price:35200,discount:41,category:'스커트',image:'extra-7.webp',tags:['무료배송'],rating:'4.9',reviews:'29'}
];

const t1AnchorProduct = {
  id:'p15',store:'디어먼트',name:'[가을니트][MADE] 에버 탄탄 소프트 브이넥 니트 가디건',shortName:'흰색 브이넥 니트 가디건',
  price:25190,discount:44,category:'상의',image:'p15-dearment-vneck-cardigan.webp',tags:['직진배송','자체제작'],rating:'4.8',reviews:'631'
};

const t1TargetProduct = {
  id:'p16',store:'메리어라운드',name:'[ofm] 소르베 린넨 브이넥 니트',shortName:'파란색 브이넥 니트',
  price:23760,discount:40,category:'상의',image:'p16-merryaround-vneck-knit.webp',tags:['쇼핑몰위크','무료배송'],rating:'4.8',reviews:'2,961'
};

const walletProduct = {
  id:'p14',store:'슬로우앤드',name:'[무료배송/NEW COLOR!] #LENTO. minimal card wallet (소가죽) - 6 color',
  price:23050,oldPrice:34900,discount:34,category:'가방',image:'p14-white-card-wallet.webp',
  tags:['쇼핑몰위크','무료배송'],rating:'4.9',reviews:'1,398'
};

const catalogProducts = [...products,...oldProducts,...extraProducts,...homeAnchorProducts,t1AnchorProduct,t1TargetProduct,walletProduct];
/* 공통 찜 목록은 기존 서비스와 같은 비교 기반으로 사용한다. */
const wishlistBaseProducts = [
  products[0],extraProducts[1],products[1],t1AnchorProduct,
  extraProducts[2],extraProducts[3],extraProducts[5],
  extraProducts[4],homeAnchorProducts[0],products[2],t1TargetProduct,
  products[3],products[4],products[5],
  oldProducts[0],oldProducts[1],oldProducts[2],
  oldProducts[3],oldProducts[4],oldProducts[5],walletProduct
];
const wishlistFillerPool = wishlistBaseProducts.filter(product=>!['p01','p10','p11','p14','p15','p16'].includes(product.id));
const wishlistFillers = Array.from({length:54},(_,index)=>{
  const base=wishlistFillerPool[index%wishlistFillerPool.length];
  const round=Math.floor(index/wishlistFillerPool.length)+2;
  return {...base,sourceId:base.id,id:`f${String(index+1).padStart(2,'0')}`,name:`${base.name} · ${round}컬러`,visualVariant:(index%5)+1};
});
const wishlistTarget=t1TargetProduct;
const wishlistWithoutTarget=wishlistBaseProducts.filter(product=>product.id!==wishlistTarget.id);
/* 실제 표준 계정과 맞춰 T1 목표 상품은 약 2회 스크롤 구간(11번째)에 둔다. */
const wishlistProducts = [
  ...wishlistWithoutTarget.slice(0,10),
  wishlistTarget,
  ...wishlistWithoutTarget.slice(10),
  ...wishlistFillers
];
const allProducts = [...catalogProducts,...wishlistFillers];
/* T2: 다른 후보 열람은 허용하되 카드지갑 p14에서만 자동 완료한다. */
const t2CandidateIds = new Set(['p14']);
const state = {route:'wishlist',previousRoute:'wishlist',searchScope:'folder',searchQuery:'니트',notificationFilter:'전체',cleanupResult:null,cleanupApplied:false,archiveVariant:'E3',archiveReturnVariant:'E3',selectedEdit:new Set(),selectedArchive:new Set(),restoredArchive:new Set(),homeBasisId:'p15',utCandidate:''};
const appQuery = new URLSearchParams(location.search);
const boardEmbedMode = appQuery.get('embed');
const utMode = appQuery.get('ut')==='1';
const utTask = (appQuery.get('task')||'').toLowerCase();
const utCondition = appQuery.get('condition')||'';
const utParticipant = appQuery.get('participant')||'';

if(boardEmbedMode){
  document.documentElement.classList.add('board-embed',`board-embed-${boardEmbedMode}`);
}
if(utMode)document.documentElement.classList.add('ut-mode');

const totals = {'전체':428,'아우터':54,'상의':126,'원피스':38,'바지':94,'스커트':47,'슈즈':32};
const productGrid = document.querySelector('#product-grid');
const productCount = document.querySelector('#product-count');
const categoryTabs = [...document.querySelectorAll('[data-category]')];
const wishlistView = document.querySelector('#wishlist-view');
const routeScreen = document.querySelector('#route-screen');
const content = document.querySelector('#content');
const bottomNav = document.querySelector('.bottom-nav');
const overlayRoot = document.querySelector('#overlay-root');
const reviewLabel = document.querySelector('.review-label');

function reportBoardHeight(){
  if(!boardEmbedMode || window.parent===window)return;
  window.requestAnimationFrame(()=>{
    const device=document.querySelector('.device');
    const height=boardEmbedMode==='sheet' ? 852 : Math.max(
        852,
        Math.ceil(device.scrollHeight),
        Math.ceil(document.body.scrollHeight),
        Math.ceil(document.documentElement.scrollHeight)
      );
    window.parent.postMessage({type:'wishlist-prototype-height',screen:location.hash.slice(1),height},'*');
  });
}

function formatPrice(value){
  return new Intl.NumberFormat('ko-KR').format(value);
}

function productCard(product,options={}){
  const rating = product.rating
    ? `<span class="rating"><img class="review-icon" src="assets/icons/icon-review-light.png" alt="">${product.rating}(${product.reviews})</span>`
    : '<span class="rating is-empty"><img class="review-icon" src="assets/icons/icon-review-light.png" alt="">후기 없음</span>';

  const selectable = options.selectable;
  const selected = state.selectedEdit.has(product.id);
  return `<article class="product-card${selectable ? ' is-selectable' : ''}${selected ? ' is-selected' : ''}">
    <button class="product-main" type="button" data-action="${selectable ? 'toggle-edit' : 'open-detail'}" data-product-id="${product.id}"${!selectable&&t2CandidateIds.has(product.id)?' data-ut-candidate="t2"':''} aria-label="${product.store} ${product.name}, ${formatPrice(product.price)}원">
      <span class="product-photo-wrap">
        <img class="product-photo${product.visualVariant?` is-variant-${product.visualVariant}`:''}" src="assets/products/${product.image}" width="390" height="467" alt="${product.name}" loading="eager">
        ${product.age ? `<span class="age-badge">${product.age}</span>` : ''}
        ${selectable ? `<span class="select-indicator" aria-hidden="true">${selected ? '✓' : ''}</span>` : ''}
      </span>
      <span class="product-info">
        <span class="store-name">${product.store}</span>
        <span class="product-name" title="${product.name}">${product.name}</span>
        <span class="price"><span class="discount">${product.discount}%</span><span>${formatPrice(product.price)}</span></span>
        <span class="tags">${product.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</span>
        ${rating}
      </span>
    </button>
    ${selectable ? '' : `<button class="similar-button" type="button" aria-label="${product.name} 비슷한 상품">
      <img class="icon asset-icon" src="assets/icons/icon-lens-bold.svg" alt="">
      <span>비슷한 상품</span>
    </button>`}
  </article>`;
}

function renderProducts(category='전체'){
  const archivedIds=new Set(oldProducts.map(product=>product.id));
  const activeProducts=state.cleanupApplied
    ? wishlistProducts.filter(product=>!(archivedIds.has(product.id)||archivedIds.has(product.sourceId))||state.restoredArchive.has(product.id))
    : wishlistProducts;
  const visible=category==='전체'?activeProducts:activeProducts.filter(product=>product.category===category);
  const cleanedTotal=400+state.restoredArchive.size;
  productCount.textContent=`상품 ${state.cleanupApplied&&category==='전체'?cleanedTotal:totals[category]}`;
  const hiddenChip=document.querySelector('.hidden-collection-chip');
  if(hiddenChip){
    const hiddenCount=state.cleanupApplied?Math.max(0,42-state.restoredArchive.size):14;
    hiddenChip.setAttribute('aria-label',`숨긴 상품 ${hiddenCount}개 보기`);
    const label=hiddenChip.querySelector('span:last-child');
    if(label)label.textContent=`숨긴 상품 ${hiddenCount}`;
  }
  productGrid.innerHTML=visible.length
    ? visible.map(productCard).join('')
    : '<p class="empty">해당 카테고리에 담은 상품이 없어요.</p>';
}

categoryTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    categoryTabs.forEach(item => item.setAttribute('aria-selected','false'));
    tab.setAttribute('aria-selected','true');
    renderProducts(tab.dataset.category);
  });
});

function icon(src,className=''){ return `<img class="asset-icon ${className}" src="assets/icons/${src}" alt="">`; }
function getProduct(id){ return allProducts.find(product=>product.id===id) || products[0]; }
function oldPrice(product){ return product.oldPrice || Math.round(product.price/(1-product.discount/100)); }

function screenHeader(title,action=''){
  return `<header class="screen-header"><button type="button" class="back-button" data-action="go-back" aria-label="뒤로">${icon('icon-arrow-left-regular.svg')}</button><h1>${title}</h1>${action || '<span class="header-spacer"></span>'}</header>`;
}

/* Feature spec v2.2 and After v25 screen contracts. */
const searchItems = [
  {product:oldProducts[4],folder:'스타일링',badge:'직진',interest:'★4.8 · 관심 3.4천',utCandidate:'t2'},
  {product:oldProducts[3],folder:'기본 폴더',badge:'직진',interest:'★4.7 · 관심 2.1천',utCandidate:'t2'},
  {product:products[1],folder:'겨울옷',badge:'매일직진',interest:'★4.8 · 관심 7.1천',utCandidate:'t2'},
  {product:oldProducts[2],folder:'기본 폴더',badge:'단독',interest:'★4.6 · 관심 890',utCandidate:'t2'}
];
const allSearchItems = [searchItems[0],searchItems[1],searchItems[2],searchItems[3]];
const t2SearchItems = [
  {product:walletProduct,folder:'기본 폴더',badge:'직진',interest:'★4.9 · 관심 1,398',utCandidate:'t2'}
];

function v24SearchCard(item,{folder=true}={}){
  const p=item.product;
  return `<button class="v24-search-card" type="button" data-action="open-detail" data-product-id="${p.id}"${item.utCandidate?` data-ut-candidate="${item.utCandidate}"`:''}>
    <span class="v24-search-photo"><img src="assets/products/${p.image}" alt="${p.name}"><i>${item.badge}</i><b>♥</b>${folder?`<em>${item.folder}</em>`:''}</span>
    <span class="v24-search-copy"><b>${p.store}</b><em>${p.name}</em><strong><i>${p.discount}%</i> ${formatPrice(p.price)}</strong><small>${item.interest}</small></span>
  </button>`;
}

function v24MiniCard(p,options={}){
  const settings=typeof options==='boolean'?{small:options}:options;
  const rating=p.rating?`★ ${p.rating}(${p.reviews})`:'★ 4.8(133)';
  return `<button class="v24-mini-card${settings.small?' is-small':''}${settings.basis?' is-basis':''}" type="button" data-action="open-detail" data-product-id="${p.id}"${settings.utCandidate?` data-ut-candidate="${settings.utCandidate}"`:''}>
    <span class="v24-mini-photo"><img src="assets/products/${p.image}" alt="${p.name}">${settings.basis?'<i>관심상품</i>':''}<img class="mini-heart" src="assets/icons/heart-on.png" alt=""></span>
    <span class="v24-mini-copy"><b>${p.store}</b><em>${p.name}</em><strong><i>${p.discount}%</i> ${formatPrice(p.price)}</strong><small class="mini-tag">${p.tags?.[0]||'무료배송'}</small><small class="mini-rating">${rating}</small></span>
  </button>`;
}

function homeBasisCircle(p){
  const selected=state.homeBasisId===p.id;
  return `<button class="home-basis-circle${selected?' is-selected':''}" type="button" data-action="select-home-basis" data-product-id="${p.id}" aria-pressed="${selected}" aria-label="${p.name} 기준으로 보기"><img src="assets/products/${p.image}" alt=""></button>`;
}

function homeRelatedProducts(){
  const groups={
    p15:[t1AnchorProduct,t1TargetProduct,products[1],oldProducts[4]],
    p13:[homeAnchorProducts[0],products[0],products[2],extraProducts[5]],
    p08:[oldProducts[1],products[0],oldProducts[2],extraProducts[1]],
    p02:[products[1],oldProducts[3],oldProducts[4],extraProducts[1]],
    p01:[products[0],extraProducts[0],extraProducts[4],oldProducts[2]],
    p03:[products[2],oldProducts[0],products[4],extraProducts[5]],
    p10:[oldProducts[3],products[1],oldProducts[4],extraProducts[1]]
  };
  return groups[state.homeBasisId]||groups.p15;
}

function v24SelectCard(p,index,{archive=false,selectable=true}={}){
  const folders=['기본 폴더','겨울옷','스타일링'];
  const selected=selectable && (archive ? state.selectedArchive.has(p.id) : state.selectedEdit.has(p.id));
  const rating=p.rating||['4.7','4.8','4.8','4.9','4.7','4.8'][index%6];
  const reviews=p.reviews||['6,775','2,686','741','70','745','133'][index%6];
  return `<button class="v24-select-card${selected?' is-selected':''}${selectable?'':' is-view-only'}" type="button" data-action="${selectable?(archive?'toggle-archive':'toggle-edit'):'open-detail'}" data-product-id="${p.id}">
    <span><img src="assets/products/${p.image}" alt="${p.name}">${selectable?`<i>${selected?'✓':''}</i>`:''}${archive?`<em>${folders[index%3]}</em>`:''}</span>
    <b>${p.store}</b><small class="v24-select-name">${p.name}</small><strong><i>${p.discount}%</i> ${formatPrice(p.price)}</strong>
    <small class="v24-select-tags">${(p.tags||['무료배송']).slice(0,2).map(tag=>`<span>${tag}</span>`).join('')}</small>
    <small class="v24-select-rating">★ ${rating}(${reviews})</small>
  </button>`;
}

function homeTemplate(){
  const basisProducts=[t1AnchorProduct,homeAnchorProducts[0],products[1],products[0],products[2]];
  const basis=getProduct(state.homeBasisId);
  const related=homeRelatedProducts();
  return `<div class="screen-view v24-home">
    <header class="home-header"><img src="assets/zigzag-text-logo.png" alt="지그재그"><div><button aria-label="전체 상품 검색" data-action="open-search" data-search-scope="all">${icon('icon-search-bold.svg')}</button><button aria-label="장바구니" data-route="cart">${icon('icon-shoppingbag-bold.svg')}</button></div></header>
    <nav class="v24-home-tabs"><span>라룸</span><b>홈</b><span>착한구두</span><span>랭킹</span><span>셀렉티드</span><span>브랜드</span><span>뷰티</span></nav>
    <div class="v24-main-banner"><img src="assets/products/p08-stripe-shirt.webp" alt="얼리어텀 스타일 기획전"><span><small>EARLY AUTUMN</small><b>지금 필요한<br>가을 스타일</b><em>최대 68%</em></span><div class="v24-hero-controls"><i><b></b></i><button type="button" data-action="out-of-scope">전체보기 ›</button></div></div>
    <div class="v24-home-shortcuts" aria-label="홈 바로가기">
      <button type="button" data-action="out-of-scope"><img src="assets/products/extra-8.webp" alt=""><span>쇼핑몰위크</span></button>
      <button type="button" data-action="out-of-scope"><img src="assets/products/p09-burgundy-top.webp" alt=""><span>OOTD</span></button>
      <button type="button" data-action="out-of-scope"><img src="assets/products/extra-9.webp" alt=""><span>주말직진</span></button>
      <button type="button" data-action="out-of-scope"><img src="assets/icons/icon-truck-regular.svg" alt=""><span>직진은 내일도착</span></button>
      <button type="button" data-action="out-of-scope"><img src="assets/products/p02-grey-knit.png" alt=""><span>30% 쿠폰</span></button>
      <button type="button" data-action="out-of-scope"><img src="assets/products/extra-11.webp" alt=""><span>SPA</span></button>
      <button type="button" data-action="out-of-scope"><img src="assets/products/p10-blue-knit.webp" alt=""><span>라이프위크</span></button>
    </div>
    <section class="v24-home-revisit"><header><h2>찜한 상품, 아직 보고 계신가요</h2><button data-route="wishlist">더보기 ›</button></header>
      <h3>최근 찜한 상품</h3>
      <div class="home-basis-rail" aria-label="연관 상품의 기준이 되는 최근 찜 상품">${basisProducts.map(homeBasisCircle).join('')}</div>
      <div class="v24-related-block"><h3>‘${basis.shortName||basis.name}’과 같이 볼 상품</h3><p>기준 상품의 카테고리와 스타일을 따라 골랐어요</p><div class="v24-horizontal-products is-related-row">${related.map((p,i)=>v24MiniCard(p,{small:true,basis:i===0})).join('')}</div></div>
    </section>
    <section class="v24-existing"><header><h2>김선옥님의 취향에 맞춘 상품</h2><small>Sponsored</small></header><div class="v24-home-feed-filters"><b>전체</b><span>주말직진</span><span>뷰티위크</span><span>스커트</span></div><div>${wishlistBaseProducts.slice(0,9).map(p=>v24MiniCard(p)).join('')}</div></section>
  </div>`;
}

function searchTemplate(){
  const query=state.searchQuery;
  const normalizedQuery=query.trim().toLowerCase();
  const hasQuery=normalizedQuery.length>0;
  const scoped=state.searchScope==='folder';
  const isEmpty=scoped && query.trim()==='트렌치';
  const walletSearchText=`${walletProduct.store} ${walletProduct.name} 흰색 화이트 은색 로고 카드지갑 카드 지갑 월렛 렌토 lento 가방`.toLowerCase();
  const walletMatches=hasQuery&&normalizedQuery.split(/\s+/).every(term=>walletSearchText.includes(term));
  const t1SearchText=`${t1TargetProduct.store} ${t1TargetProduct.name} 파란색 블루 브이넥 니트 상의`.toLowerCase();
  const t1TargetMatches=hasQuery&&normalizedQuery.split(/\s+/).every(term=>t1SearchText.includes(term));
  const t1SearchItems=[{product:t1TargetProduct,badge:'직진',interest:'★4.8 · 관심 2,961'}];
  const resultItems=utTask==='t2'
    ? (walletMatches?t2SearchItems:[])
    : (utTask==='t1'&&!scoped
      ? (t1TargetMatches?t1SearchItems:[])
      : (hasQuery?(scoped?searchItems:allSearchItems):[]));
  const resultCount=['t1','t2'].includes(utTask)?resultItems.length:(scoped?'7':'1,204');
  const initialSearch=`<div class="v24-section-line"></div><section class="v24-keywords"><header><h2>최근 검색어</h2><button>전체 삭제</button></header><div class="v24-recent-words"><span>카고 스커트 ✕</span><span>니트 ✕</span><span>자라 ✕</span></div></section><div class="v24-section-line"></div><section class="v24-keywords"><header><h2>인기 검색어</h2><small>오전 4:00 업데이트</small></header><ol><li>스트라이프 <i>▲</i></li><li>셔츠 <em>▼</em></li><li>나시 <em>▼</em></li><li>부츠컷 <b>-</b></li><li>얼리어텀 <i>▲</i></li><li>트레이닝 <i>▲</i></li></ol></section>${scoped?'<p class="v24-search-guide">찜한 상품 안에서만 검색해요.</p>':''}`;
  const noResult=`<div class="v24-section-line"></div><div class="v24-search-empty"><span>?</span><h2>검색 결과가 없어요</h2><p>다른 검색어를 입력해 보세요.</p></div>`;
  return `<div class="screen-view v24-search${isEmpty?' is-empty-result':''}">
    <div class="v24-search-head"><button type="button" data-action="go-back" aria-label="뒤로">‹</button><label>${scoped?'<button class="scope-token" type="button" data-action="remove-search-scope">찜 내 검색 <span>✕</span></button>':''}<input id="wishlist-search-input" value="${query}" placeholder="${scoped?'검색어 입력':'상품 또는 스토어 검색'}" aria-label="검색어">${!scoped&&hasQuery?'<button type="button" data-action="clear-search" aria-label="검색어 지우기">✕</button>':''}<button class="search-submit" type="button" data-action="submit-search" aria-label="검색">${icon('icon-search-bold.svg')}</button></label></div>
    ${!hasQuery?initialSearch:isEmpty?`<div class="v24-section-line"></div><section class="v24-keywords"><header><h2>최근 검색어</h2><button>전체 삭제</button></header><div class="v24-recent-words"><span>카고 스커트 ✕</span><span>니트 ✕</span><span>자라 ✕</span></div></section><div class="v24-section-line"></div><section class="v24-keywords"><header><h2>인기 검색어</h2><small>오전 4:00 업데이트</small></header><ol><li>스트라이프 <i>▲</i></li><li>셔츠 <em>▼</em></li><li>나시 <em>▼</em></li><li>부츠컷 <b>-</b></li><li>얼리어텀 <i>▲</i></li><li>트레이닝 <i>▲</i></li></ol></section><div class="v24-section-line"></div><div class="v24-search-empty"><span>?</span><h2>'겨울옷' 폴더에 '트렌치'가 없어요</h2><p>다른 폴더를 선택하거나<br>전체 상품에서 찾아보세요</p></div>`:resultItems.length===0?noResult:`${scoped?'<div class="v24-folder-choices"><b>전체</b><span>기본 폴더</span><span>겨울옷</span><span>스타일링</span></div><div class="v24-section-line"></div>':''}<div class="v24-result-tools"><span>검색결과 <b>${resultCount}개</b></span><button>신상품순 ▾</button></div><div class="v24-search-grid">${resultItems.map(item=>v24SearchCard(item,{folder:scoped})).join('')}</div>`}
  </div>`;
}

function priceTemplate(){
  const rows=[{p:products[0],name:'얼리어텀 톤톤 웰메이드 롱 스커트',was:35820,now:34620,drop:1200,rating:'4.8(741)'},{p:extraProducts[0],name:'레스 자카드 플라워 미디 스커트',was:39600,now:38280,drop:1320,rating:'4.8(324)'}];
  return `<div class="screen-view v24-price">
    <header class="v24-wishlist-head"><h1>찜</h1><div><button data-action="open-search">${icon('icon-search-bold.svg')}</button><button data-route="cart">${icon('icon-shoppingbag-bold.svg')}</button></div></header>
    <div class="v24-price-chips"><b>↓% 가격 하락</b><i></i><span>기본 폴더</span><span>상의만</span><button data-route="archive"><svg class="icon" aria-hidden="true"><use href="#icon-folder"/></svg></button></div><div class="v24-section-line"></div>
    <div class="v24-price-count"><span>상품 4</span><i>i</i></div>
    <div class="v24-price-list">${rows.map(row=>`<article class="price-drop-card"><span class="price-drop-photo"><img src="assets/products/${row.p.image}" alt="${row.name}"><i>가격 하락</i></span><div><b>${row.p.store}</b><em>${row.name}</em><small class="price-before">찜했을 때 <s>${formatPrice(row.was)}</s></small><strong>${formatPrice(row.now)} <i>▼${formatPrice(row.drop)}원</i></strong><span class="price-card-meta"><small>무료배송</small><small>★ ${row.rating}</small></span><button data-action="add-cart">${icon('icon-shoppingbag-bold.svg')}<span>담기</span></button></div></article>`).join('')}</div>
    <section class="v24-price-revisit"><header><div><h2>다시 살펴볼 상품</h2><small>지금 계절에 맞는 것만 골랐어요</small></div><button data-action="open-revisit">전체보기 ›</button></header><div>${[products[1],products[3],extraProducts[4],oldProducts[3]].map(p=>v24MiniCard(p,true)).join('')}</div></section>
  </div>`;
}

const notifications=[
  {tone:'price',kind:'가격 하락',time:'3시간 전',title:'찜한 상품 4개의 가격이 내려갔어요',body:'최대 6,180원▼ 내려간 상품을 지금 확인해보세요.',action:'price',image:products[0]},
  {tone:'benefit',kind:'혜택 / 이벤트',time:'10시간 전',title:'최근 스타일링 보신 OOO님! 관심가지실 할인 소식',body:'찜한 스타일과 어울리는 상품이 할인 중이에요.',action:'',image:extraProducts[1]},
  {tone:'revisit',kind:'다시보기',time:'2일 전',title:'다시 살펴볼 상품이 있어요',body:'최근 관심 가졌던 상품 5개를 모아봤어요.',action:'revisit',image:products[1]},
  {tone:'restock',kind:'재입고',time:'4일 전',title:'찜한 상품이 재입고됐어요',body:'골지 홀터넥 슬리브리스 상품을 다시 구매할 수 있어요.',action:'restock',image:extraProducts[4]},
  {tone:'interest',kind:'관심 상품',time:'5일 전',title:'찜한 상품, 다시 확인해보세요',body:'고민했던 상품이 품절되기 전에 확인해보세요.',action:'detail',image:oldProducts[3]}
];

function v24NoticeCard(n){
  const glyph={price:'↓%',benefit:'',revisit:'▤',restock:'↻',interest:'○'}[n.tone];
  return `<button class="notification-card service-alert is-${n.tone}" data-action="open-notification" data-notification="${n.action}">
    <span class="notice-glyph is-${n.tone}">${glyph}</span>
    <span class="notification-copy"><span class="notification-meta"><b>${n.kind}</b><time>${n.time}</time></span><strong>${n.title}</strong><em>${n.body}</em></span>
    <img class="notification-thumb" src="assets/products/${n.image.image}" alt="">
  </button>`;
}

function notificationsTemplate(){
  const filtered=state.notificationFilter==='전체'?notifications:state.notificationFilter==='찜한 혜택'?notifications.filter(n=>n.tone!=='benefit'):notifications.filter(n=>n.tone==='benefit');
  const today=filtered.filter(n=>['price','benefit'].includes(n.tone));
  const previous=filtered.filter(n=>!['price','benefit'].includes(n.tone));
  return `<div class="screen-view v24-notifications">${screenHeader('알림','<button class="v24-settings-action" aria-label="알림 설정"><span aria-hidden="true">⚙︎</span></button>')}
    <div class="v24-notice-counters"><span><span class="counter-icon is-order">${icon('icon-truck-regular.svg')}</span><em>주문/배송</em><b>0건</b></span><span><span class="counter-icon is-community">${icon('icon-review-regular.svg')}</span><em>커뮤니티</em><b>0건</b></span><span><span class="counter-icon is-inquiry">!</span><em>문의</em><b>0건</b></span></div>
    <section class="personal-alerts after-notification-feed"><p class="v24-marketing-label">개인화·마케팅 알림</p>
      <div class="filter-chips">${['전체','혜택/이벤트','찜한 혜택'].map(label=>`<button class="${state.notificationFilter===label?'is-active':''}" data-action="notification-filter" data-filter="${label}">${label}${label==='찜한 혜택'?'<i></i>':''}</button>`).join('')}</div>
      ${today.length?`<p class="notification-section-label">오늘 받은 알림</p><div class="notification-list">${today.map(v24NoticeCard).join('')}</div>`:''}
      ${previous.length?`<p class="notification-section-label previous-label">이전 알림</p><div class="notification-list">${previous.map(v24NoticeCard).join('')}</div>`:''}
    </section>
  </div>`;
}

function archiveTemplate(){
  const variant=state.archiveVariant||'E3';
  const archiveItems=[...oldProducts.slice(0,5),extraProducts[0]].filter(product=>!state.restoredArchive.has(product.id));
  const isEmpty=variant==='E3a'||variant==='E3b';
  const hasCandidates=['E3','E3b'].includes(variant);
  const editing=variant==='E3c';
  const completed=variant==='E3e';
  const followsCompleted=completed||(editing&&state.archiveReturnVariant==='E3e');
  const count=followsCompleted?Math.max(0,42-state.restoredArchive.size):isEmpty?0:Math.max(0,14-state.restoredArchive.size);
  const headerAction=editing?'<button class="v25-head-action" data-action="finish-archive-edit">완료</button>':isEmpty?'': '<button class="v25-head-action" data-action="start-archive-edit">편집</button>';
  const banner=hasCandidates?`<button class="v25-hidden-banner" data-route="cleanup"><span class="hidden-eye-icon" aria-hidden="true"></span><span><b>오래 담아둔 상품이 28개 있어요</b><small>잠시 숨겨두고 필요할 때 다시 꺼내보세요</small></span><strong>정리하기</strong></button>`:'';
  const resultNote=completed?`<div class="v25-hidden-result"><b>28개 상품을 정리했어요.</b><span>찜 400개 · 숨긴 상품 ${count}개</span><small>30일 안에 원래 폴더로 되돌릴 수 있어요.</small></div>`:'';
  const empty=`<section class="v25-hidden-empty"><span class="hidden-eye-icon is-large" aria-hidden="true"></span><h2>${hasCandidates?'아직 숨긴 상품이 없어요':'숨긴 상품이 없어요'}</h2><p>${hasCandidates?'오래 담아둔 상품 28개를 한 번에 숨기고 30일 안에 되돌릴 수 있어요.':'상품을 숨기면 30일 동안 여기서 확인하고 원래 폴더로 되돌릴 수 있어요.'}</p></section>`;
  const selectedCount=state.selectedArchive.size;
  return `<div class="screen-view v24-archive v25-hidden-screen"><header class="v24-centered-head"><button data-action="go-back" aria-label="뒤로">‹</button><h1>숨긴 상품 <button data-action="archive-info" aria-label="숨긴 상품 안내">i</button></h1>${headerAction||'<span></span>'}</header>${banner}${resultNote}<div class="v24-archive-tools"><span>숨긴 상품 ${count}개${editing?` · ${selectedCount}개 선택`:''}</span>${editing?'<button data-action="select-all-archive">전체선택</button>':isEmpty?'':'<button>최신순 ▾</button>'}</div>${isEmpty?empty:`<div class="v24-select-grid">${archiveItems.map((p,i)=>v24SelectCard(p,i,{archive:true,selectable:editing})).join('')}</div>${!editing&&!completed?'<p class="v25-hidden-note">숨긴 상품은 찜 검색에서 제외되며 원래 폴더 정보는 유지돼요.</p>':''}`}${editing?`<div class="v24-archive-actions"><button data-action="delete-archive" ${selectedCount?'':'disabled'}>완전 삭제</button><button data-action="restore-selected" ${selectedCount?'':'disabled'}>목록으로 되돌리기</button></div>`:''}</div>`;
}

function cleanupBackdropTemplate(){
  const archiveItems=[...oldProducts.slice(0,5),extraProducts[0]];
  return `<div class="v24-cleanup-backdrop"><div class="v24-archive v25-hidden-screen">
    <header class="v24-centered-head"><button aria-label="뒤로">‹</button><h1>숨긴 상품 <button aria-label="숨긴 상품 안내">i</button></h1><button class="v25-head-action">편집</button></header>
    <div class="v25-hidden-banner"><span class="hidden-eye-icon" aria-hidden="true"></span><span><b>오래 담아둔 상품이 28개 있어요</b><small>잠시 숨겨두고 필요할 때 다시 꺼내보세요</small></span><strong>정리하기</strong></div>
    <div class="v24-archive-tools"><span>숨긴 상품 14개</span><button>최신순 ▾</button></div>
    <div class="v24-select-grid">${archiveItems.map((p,i)=>v24SelectCard(p,i,{archive:true,selectable:false})).join('')}</div>
  </div></div><div class="v24-cleanup-scrim"></div>`;
}

function cleanupTemplate(){
  const result=state.cleanupResult;
  const inner=!result?`<h2>오래 담아둔 상품이<br>28개 있어요</h2><small>모든 폴더 기준</small><div class="v24-cleanup-chips"><span>기본 폴더 12개</span><span>겨울옷 9개</span><span>스타일링 7개</span></div><p>정리하면 숨긴 상품에서 30일간 확인하고 다시 되돌릴 수 있어요.</p><div class="v24-cleanup-buttons"><button data-action="cleanup-choice" data-choice="keep">다음에</button><button data-action="cleanup-choice" data-choice="clean">정리하기</button></div>`:result==='keep'?`<i class="v24-result-check">✓</i><h2>28개 상품은 그대로 유지돼요</h2><p>직접 정리하려면 숨긴 상품에서<br>‘정리하기’를 눌러보세요.</p><button class="v24-outline-confirm" data-route="wishlist">확인</button>`:`<i class="v24-result-check is-dark">✓</i><h2>28개 상품을 정리했어요</h2><p>정리한 상품은 <b>숨긴 상품</b>에서<br>30일간 확인하고 되돌릴 수 있어요.<br><small>찜 400개 · 숨긴 상품 42개</small></p><div class="v24-cleanup-buttons"><button data-route="wishlist">확인</button><button data-action="open-archive-after-cleanup">숨긴 상품 보기</button></div>`;
  return `<div class="screen-view v24-sheet-page">${cleanupBackdropTemplate()}<section class="v24-cleanup-sheet ${result?'is-result':''}"><div class="sheet-handle"></div>${inner}</section></div>`;
}

function editTemplate(){
  const editItems=[products[2],oldProducts[1],products[0],oldProducts[0],oldProducts[2],oldProducts[3]];
  return `<div class="screen-view v24-edit"><header class="v24-centered-head"><span></span><h1>상품 선택</h1><button class="v24-pink-done" data-route="wishlist">완료</button></header><div class="v24-edit-tools"><span>기본 폴더 › 전체 (429)</span><button>품절상품 전체삭제</button></div><div class="v24-select-grid">${editItems.map((p,i)=>v24SelectCard(p,i)).join('')}</div><div class="v24-edit-actions"><button disabled><i>⇧</i>맨위로</button><button disabled><i>□</i>폴더이동</button><button disabled><i>×</i>삭제</button></div></div>`;
}

function cartRecentRow(p,index){
  const folders=['기본 폴더','스타일링','겨울옷'];
  const ages=['오늘','2일 전','5일 전'];
  const drops=[1200,0,0];
  return `<article class="v24-cart-row">
    <span><img src="assets/products/${p.image}" alt="${p.name}"><b>${folders[index]}</b><i>${ages[index]}</i></span>
    <div><b>${p.store}</b><em>${p.name}</em><strong>${formatPrice(p.price)}원${drops[index]?` <i>(▼${formatPrice(drops[index])}원)</i>`:''}</strong></div>
    <button data-action="add-cart">${icon('icon-shoppingbag-bold.svg')} 담기</button>
  </article>`;
}

function cartTemplate(){
  return `<div class="screen-view v24-cart">${screenHeader('장바구니')}
    <section class="v24-cart-empty"><div>${icon('icon-shoppingbag-bold.svg')}</div><h2>장바구니에 담긴 상품이 없어요</h2><p>원하는 상품을 담아보세요</p><button data-route="wishlist">상품 보러 가기</button></section>
    <div class="v24-section-line"></div>
    <section class="v24-cart-recent"><header><h2>최근 찜한 상품</h2><button data-route="wishlist">더보기 ›</button></header><div class="v25-cart-list">${[oldProducts[0],oldProducts[2],oldProducts[1]].map(cartRecentRow).join('')}</div></section>
  </div>`;
}

function detailTemplate(){
  const p=getProduct(state.productId);
  const restored=state.previousRoute==='archive';
  return `<div class="screen-view v24-product-detail">
    <header class="detail-header"><button data-action="go-back" aria-label="뒤로">‹</button><div><button aria-label="검색">${icon('icon-search-bold.svg')}</button><button aria-label="장바구니">${icon('icon-shoppingbag-bold.svg')}</button></div></header>
    <div class="detail-photo"><img src="assets/products/${p.image}" alt="${p.name}"><button aria-label="이미지 찜하기"><img src="assets/icons/heart-on.png" alt=""></button><span>1 / 4</span></div>
    <section class="detail-copy"><header><b>${p.store}</b><button>스토어 ›</button></header><h1>${p.name}</h1><p class="detail-price"><i>${p.discount}%</i> ${formatPrice(p.price)}원</p><div class="detail-meta"><span>${p.tags?.[0]||'무료배송'}</span><span>★ ${p.rating||'4.8'}(${p.reviews||'95'})</span></div></section>
    <div class="detail-delivery"><b>배송 정보</b><span>오늘 주문 시 9월 1일 출고 예정</span></div>
    ${restored?'<div class="detail-toast" role="status">상품을 찜 목록으로 다시 옮겼어요</div>':''}
    <div class="detail-actions"><button aria-label="찜한 상품"><img src="assets/icons/heart-on.png" alt=""></button><button>구매하기</button></div>
  </div>`;
}

function lockscreenTemplate(){
  return `<div class="screen-view v24-lockscreen"><div class="lock-status"><span>통신사</span><span>▮▮ ⌾ 82</span></div><div class="lock-time"><small>8월 26일 (수)</small><strong>09:14</strong></div><div class="lock-spacer"></div><div class="v24-push-card"><span class="push-logo">Z</span><span><b>지그재그 <time>40분 전</time></b><strong>(광고) 얼리어텀 15% 쿠폰 도착</strong><em>지금 쓸 수 있는 쿠폰을 확인해보세요.</em></span></div><button class="v24-push-card is-restock" data-action="open-restock" data-context="active"><span class="push-logo">Z</span><span><b>지그재그 <time>방금 전</time></b><strong>(광고) 찜한 상품이 재입고됐어요</strong><em>스타일링 니트 가디건 상품이 다시 구매 가능해요. 지금 확인해보세요.</em><small>수신거부: MY &gt; 설정</small></span></button></div>`;
}

function renderRoute(){
  const templates={home:homeTemplate,search:searchTemplate,price:priceTemplate,notifications:notificationsTemplate,archive:archiveTemplate,cleanup:cleanupTemplate,edit:editTemplate,cart:cartTemplate,lockscreen:lockscreenTemplate,detail:detailTemplate};
  routeScreen.innerHTML=(templates[state.route]||homeTemplate)();
}

function updateReviewLabel(label){
  const labels={wishlist:'A1 · 찜 기본 폴더',home:'C1 · 홈 재방문 유도',search:'A3/A3b/A4 · 찜 내 검색',price:'B2 · 가격 하락 + 맥락 추천',notifications:'C2 · 알림 통합 피드',archive:`${state.archiveVariant} · 숨긴 상품`,cleanup:'G3a/G3b/G3c · 오래 담아둔 상품 정리',edit:'E0 · 상품 선택',cart:'F2 · 빈 장바구니',lockscreen:'G1p · 재입고 푸시',detail:`상품 상세 · ${getProduct(state.productId).name}`};
  reviewLabel.textContent=label||labels[state.route]||'찜 UX 개선';
}

function reportUTRoute(){
  if(!utMode||window.parent===window)return;
  window.parent.postMessage({
    type:'wishlist-ut-route',
    participant:utParticipant,
    task:utTask,
    condition:utCondition,
    route:reviewLabel.textContent,
    path:location.hash
  },'*');
}

function reportUTCompletion(){
  if(!utMode||window.parent===window)return;
  if(utTask==='t3'&&state.route==='cleanup'&&state.cleanupResult==='clean'){
    window.parent.postMessage({
      type:'wishlist-ut-complete',
      participant:utParticipant,
      task:utTask,
      condition:utCondition,
      itemCount:28,
      route:reviewLabel.textContent,
      screen:'cleanup-complete'
    },'*');
    return;
  }
  if(utTask==='t4'&&state.route==='archive'&&state.restoredArchive.has('p07')){
    window.parent.postMessage({
      type:'wishlist-ut-complete',
      participant:utParticipant,
      task:utTask,
      condition:utCondition,
      productId:'p07',
      route:reviewLabel.textContent,
      screen:'archive-restored'
    },'*');
    return;
  }
  if(state.route!=='detail')return;
  const conditionKey=utCondition==='before-live'?'before':'after';
  const condition=window.UT_TASKS?.[utTask]?.conditions?.[conditionKey];
  const targetId=condition?.targetId;
  const candidateIds=condition?.candidateIds||[];
  const qualifies=(targetId&&state.productId===targetId)
    ||(state.utCandidate===utTask&&candidateIds.includes(state.productId));
  if(qualifies){
    window.parent.postMessage({
      type:'wishlist-ut-complete',
      participant:utParticipant,
      task:utTask,
      condition:utCondition,
      productId:state.productId,
      route:reviewLabel.textContent,
      screen:'detail'
    },'*');
  }
}

function updateBottomNav(){
  const navRoute=state.route==='home'?'home':state.route==='notifications'?'notifications':['wishlist','price','cart','search','archive','cleanup','edit'].includes(state.route)?'wishlist':'';
  bottomNav.hidden=['lockscreen','cleanup','edit','archive','search','notifications','detail'].includes(state.route);
  bottomNav.querySelectorAll('[data-route]').forEach(button=>{
    const active=button.dataset.route===navRoute;
    button.classList.toggle('is-current',active);
    if(active) button.setAttribute('aria-current','page'); else button.removeAttribute('aria-current');
    button.classList.toggle('has-dot',['home','cart'].includes(state.route)&&button.dataset.route==='wishlist');
  });
  const wishlistIcon=bottomNav.querySelector('[data-route="wishlist"] img');
  if(wishlistIcon)wishlistIcon.src=`assets/icons/${navRoute==='wishlist'?'icon-heart-solid.svg':'icon-heart-regular.svg'}`;
  const homeIcon=bottomNav.querySelector('[data-route="home"] img');
  if(homeIcon)homeIcon.src=`assets/icons/${navRoute==='home'?'icon-home-solid.svg':'icon-home-bold.svg'}`;
}

function showRoute(route,options={}){
  if(state.route!==route) state.previousRoute=state.route;
  state.route=route;
  if(options.productId) state.productId=options.productId;
  const isWishlist=route==='wishlist';
  wishlistView.hidden=!isWishlist;
  routeScreen.hidden=isWishlist;
  if(!isWishlist) renderRoute();
  updateBottomNav();
  updateReviewLabel();
  content.scrollTo({top:0,behavior:'instant'});
  reportBoardHeight();
  reportUTRoute();
  window.setTimeout(reportUTCompletion,60);
}

function closeOverlay(){ overlayRoot.innerHTML=''; updateReviewLabel(); }
function showToast(message){ overlayRoot.innerHTML=`<div class="toast" role="status">${message}</div>`; window.setTimeout(()=>{if(overlayRoot.querySelector('.toast'))closeOverlay();},2200); }

function showRevisit(){
  const revisit=[oldProducts[4],walletProduct,oldProducts[3],products[1],oldProducts[2]];
  const meta=['스타일링 · 7개월 전 찜','기본 폴더 · 다시 보기 추천','기본 폴더 · 6개월 전 찜','겨울옷 · 5개월 전 찜','기본 폴더 · 8개월 전 찜'];
  overlayRoot.innerHTML=`<div class="overlay-dim" data-action="close-overlay"></div><section class="bottom-sheet revisit-sheet" role="dialog" aria-modal="true" aria-labelledby="revisit-title"><div class="sheet-handle"></div><header><h2 id="revisit-title">지금 다시 살펴볼 상품</h2></header><div class="revisit-list">${revisit.map((p,i)=>`<article><button class="revisit-main" type="button" data-action="open-detail" data-product-id="${p.id}" data-ut-candidate="t2"><img src="assets/products/${p.image}" alt="${p.name}"><span><b>${p.store}</b><strong>${p.name}</strong><small>${meta[i]}</small><em><i>${p.discount}%</i> ${formatPrice(p.price)}원</em></span></button><button class="revisit-cart" type="button" data-action="add-cart">${icon('icon-shoppingbag-bold.svg')}<span>담기</span></button></article>`).join('')}</div></section>`;
  updateReviewLabel('D1 · 다시 살펴볼 상품 바텀시트');
}

function showArchiveInfo(){
  overlayRoot.innerHTML=`<div class="overlay-dim" data-action="close-overlay"></div><section class="info-sheet bottom-sheet" role="dialog" aria-modal="true"><div class="sheet-handle"></div><h2>숨긴 상품</h2><p>모든 폴더에서 숨긴 상품을 한곳에 모아봐요.<br>원래 폴더로 되돌릴 수 있고, 숨긴 날부터 30일이 지나면 자동으로 완전 삭제돼요.</p><button class="sheet-primary" data-action="close-overlay">확인</button></section>`;
  updateReviewLabel('E3i · 숨긴 상품 안내');
}

function showRestock(context){
  const archived=context==='archive';
  const p=archived?extraProducts[4]:oldProducts[3];
  overlayRoot.innerHTML=`<div class="overlay-dim" data-action="close-overlay"></div><section class="restock-sheet bottom-sheet ${archived?'is-archive':''}" role="dialog" aria-modal="true"><div class="sheet-handle"></div><h2>${archived?'정리했던 상품이<br>재입고 되었어요':'찜한 상품이 재입고됐어요'}</h2><div class="restock-product"><img src="assets/products/${p.image}" alt="${archived?'크롭 니트 베스트':'스타일링 니트 가디건'}"><span><b>${p.store}</b><strong>${archived?'크롭 니트 베스트':'스타일링 니트 가디건'}</strong><em><i>${p.discount}%</i> ${formatPrice(p.price)}원</em><small>무료배송</small></span></div>${archived?'<p class="restock-context">숨긴 상품 · 22일 전 정리됨</p>':''}<div class="sheet-actions"><button data-action="close-overlay">닫기</button><button class="primary" data-action="restock-buy" data-product-id="${p.id}" data-archived="${archived}">구매하기</button></div></section>`;
  updateReviewLabel(archived?'G2 · 숨긴 상품 재입고':'G1 · 활성 찜 재입고');
}

document.addEventListener('input',event=>{
  if(event.target.id==='wishlist-search-input'){
    state.searchQuery=event.target.value;
  }
});

document.addEventListener('keydown',event=>{
  if(event.target.id==='wishlist-search-input'&&event.key==='Enter'&&!event.isComposing){
    event.preventDefault();
    renderRoute();
  }
});

document.addEventListener('click',event=>{
  const target=event.target.closest('[data-action],[data-route]');
  if(!target)return;
  if(target.dataset.route){
    closeOverlay();
    state.utCandidate='';
    if(target.dataset.route==='archive')state.archiveVariant=state.cleanupApplied?'E3e':'E3';
    if(target.dataset.route==='cleanup')state.cleanupResult=null;
    showRoute(target.dataset.route);
    return;
  }
  const action=target.dataset.action;
  if(action==='out-of-scope'){showToast('After v25 화면 범위에는 포함되지 않은 메뉴예요');}
  if(action==='open-search'){state.searchScope=target.dataset.searchScope==='all'?'all':'folder';state.searchQuery='';showRoute('search');}
  if(action==='go-back')showRoute(state.previousRoute||'wishlist');
  if(action==='select-home-basis'){state.homeBasisId=target.dataset.productId;renderRoute();updateReviewLabel();reportUTRoute();}
  if(action==='open-detail'){closeOverlay();state.utCandidate=target.dataset.utCandidate||'';showRoute('detail',{productId:target.dataset.productId});}
  if(action==='open-revisit')showRevisit();
  if(action==='close-overlay')closeOverlay();
  if(action==='archive-info')showArchiveInfo();
  if(action==='open-restock')showRestock(target.dataset.context||'active');
  if(action==='restock-buy'){const archived=target.dataset.archived==='true';closeOverlay();showRoute('detail',{productId:target.dataset.productId});if(archived)history.replaceState(null,'','#G2b');}
  if(action==='restore-item')showToast('상품을 기본 폴더로 되돌렸어요');
  if(action==='remove-search-scope'){state.searchScope='all';renderRoute();}
  if(action==='clear-search'){state.searchQuery='';renderRoute();}
  if(action==='submit-search')renderRoute();
  if(action==='search-sample'){state.searchQuery=target.dataset.query;renderRoute();}
  if(action==='notification-filter'){state.notificationFilter=target.dataset.filter;renderRoute();}
  if(action==='open-notification'){
    const kind=target.dataset.notification;
    if(kind==='price')showRoute('price');
    if(kind==='revisit'){showRoute('wishlist');window.setTimeout(showRevisit,50);}
    if(kind==='restock')showRestock('active');
    if(kind==='detail')showToast('상품 상세로 이동하는 연결 지점이에요');
  }
  if(action==='cleanup-choice'){state.cleanupResult=target.dataset.choice;renderRoute();window.setTimeout(reportUTCompletion,60);}
  if(action==='undo-cleanup'){state.cleanupResult=null;renderRoute();}
  if(action==='open-archive-after-cleanup'){state.archiveVariant='E3e';state.selectedArchive.clear();showRoute('archive');}
  if(action==='start-archive-edit'){state.archiveReturnVariant=state.archiveVariant;state.archiveVariant='E3c';state.selectedArchive.clear();renderRoute();updateReviewLabel();}
  if(action==='finish-archive-edit'){state.archiveVariant=state.archiveReturnVariant||'E3';state.selectedArchive.clear();renderRoute();updateReviewLabel();}
  if(action==='toggle-edit'){const id=target.dataset.productId;state.selectedEdit.has(id)?state.selectedEdit.delete(id):state.selectedEdit.add(id);renderRoute();}
  if(action==='select-all'){state.selectedEdit=new Set(products.map(p=>p.id));renderRoute();}
  if(action==='archive-selected'){showToast(`${state.selectedEdit.size}개 상품을 숨긴 상품으로 옮겼어요`);state.selectedEdit.clear();renderRoute();}
  if(action==='move-selected')showToast(`${state.selectedEdit.size}개 상품의 이동할 폴더를 선택해주세요`);
  if(action==='add-cart')showToast('장바구니에 상품을 담았어요');
  if(action==='toggle-archive'){
    const id=target.dataset.productId;
    state.selectedArchive.has(id)?state.selectedArchive.delete(id):state.selectedArchive.add(id);
    renderRoute();
  }
  if(action==='select-all-archive'){
    const visible=[...oldProducts.slice(0,5),extraProducts[0]].filter(product=>!state.restoredArchive.has(product.id));
    state.selectedArchive=new Set(visible.map(product=>product.id));
    renderRoute();
  }
  if(action==='restore-selected'&&state.selectedArchive.size){
    const restoredIds=[...state.selectedArchive];
    const restoredTarget=restoredIds.includes('p07');
    restoredIds.forEach(id=>state.restoredArchive.add(id));
    state.selectedArchive.clear();
    state.archiveVariant=state.archiveReturnVariant||'E3e';
    renderProducts();
    renderRoute();
    showToast(restoredTarget?'핀턱 와이드 슬랙스를 원래 폴더로 되돌렸어요':'선택한 상품을 원래 폴더로 되돌렸어요');
    if(restoredTarget)window.setTimeout(reportUTCompletion,850);
  }
  if(action==='delete-archive')showToast('선택한 상품을 완전 삭제할 수 있어요');
});

function openHashState(hash){
  closeOverlay();
  const key=hash.replace('#','');
  if(!key){state.cleanupResult=null;showRoute('cleanup');return;}
  if(key==='A1'){showRoute('wishlist');return;}
  if(key==='A1C'){state.cleanupApplied=true;state.cleanupResult='clean';state.archiveVariant='E3e';renderProducts();showRoute('wishlist');return;}
  if(key==='A3'){state.searchScope='folder';state.searchQuery='니트';showRoute('search');return;}
  if(key==='A3b'){state.searchScope='all';state.searchQuery='니트';showRoute('search');return;}
  if(key==='A4'){state.searchScope='folder';state.searchQuery='트렌치';showRoute('search');return;}
  if(key==='B2'){showRoute('price');return;}
  if(key==='C1'){showRoute('home');return;}
  if(key==='C2'){showRoute('notifications');return;}
  if(key==='D1'){showRoute('wishlist');window.setTimeout(showRevisit,40);return;}
  if(key==='E0'){showRoute('edit');return;}
  if(['E3','E3a','E3b','E3c','E3e'].includes(key)){state.archiveVariant=key;showRoute('archive');return;}
  if(key==='E3i'){state.archiveVariant='E3';showRoute('archive');window.setTimeout(showArchiveInfo,40);return;}
  if(key==='F2'){showRoute('cart');return;}
  if(key==='G1'){showRoute('wishlist');window.setTimeout(()=>showRestock('active'),40);return;}
  if(key==='G1p'){showRoute('lockscreen');return;}
  if(key==='G2'){showRoute('wishlist');window.setTimeout(()=>showRestock('archive'),40);return;}
  if(key==='G2b'){showRoute('detail');return;}
  if(key==='G3a'||key==='G3b'||key==='G3c'){state.cleanupResult=key==='G3b'?'keep':key==='G3c'?'clean':null;showRoute('cleanup');return;}
  showRoute('wishlist');
}

window.addEventListener('hashchange',()=>openHashState(location.hash));
renderProducts();
openHashState(location.hash);

const figmaCaptureStyleProperties=[
  'display','position','inset','top','right','bottom','left','zIndex','float','clear',
  'boxSizing','width','height','minWidth','minHeight','maxWidth','maxHeight','aspectRatio',
  'margin','marginTop','marginRight','marginBottom','marginLeft','padding','paddingTop','paddingRight','paddingBottom','paddingLeft',
  'flex','flexBasis','flexDirection','flexGrow','flexShrink','flexWrap','alignContent','alignItems','alignSelf','justifyContent','justifyItems','justifySelf','order','gap','rowGap','columnGap',
  'grid','gridArea','gridAutoColumns','gridAutoFlow','gridAutoRows','gridColumn','gridColumnEnd','gridColumnGap','gridColumnStart','gridRow','gridRowEnd','gridRowGap','gridRowStart','gridTemplate','gridTemplateAreas','gridTemplateColumns','gridTemplateRows',
  'overflow','overflowX','overflowY','clipPath','visibility','opacity','transform','transformOrigin','filter',
  'border','borderTop','borderRight','borderBottom','borderLeft','borderRadius','outline','outlineOffset','boxShadow',
  'background','backgroundColor','backgroundImage','backgroundPosition','backgroundRepeat','backgroundSize','backgroundClip',
  'color','font','fontFamily','fontSize','fontStyle','fontWeight','fontStretch','lineHeight','letterSpacing','textAlign','textDecoration','textIndent','textOverflow','textTransform','textShadow','whiteSpace','wordBreak','overflowWrap','verticalAlign',
  'listStyle','objectFit','objectPosition','fill','stroke','strokeWidth','WebkitLineClamp','WebkitBoxOrient','WebkitFontSmoothing'
];

function copyFigmaComputedStyle(source,target,pseudo=''){
  const computed=getComputedStyle(source,pseudo||null);
  figmaCaptureStyleProperties.forEach(property=>{
    const value=computed[property];
    if(value!==undefined&&value!=='')target.style[property]=value;
  });
  return computed;
}

function materializeFigmaPseudo(source,target,pseudo,atStart){
  const computed=getComputedStyle(source,pseudo);
  const content=computed.content;
  if(!content||content==='none'||computed.display==='none')return;
  const node=document.createElement('span');
  node.setAttribute('aria-hidden','true');
  node.dataset.figmaPseudo=pseudo;
  copyFigmaComputedStyle(source,node,pseudo);
  if(content!=='""'&&content!=="''")node.textContent=content.replace(/^['"]|['"]$/g,'');
  atStart?target.prepend(node):target.append(node);
}

function inlineFigmaCloneTree(source,target){
  copyFigmaComputedStyle(source,target);
  target.removeAttribute?.('id');
  target.removeAttribute?.('data-action');
  target.removeAttribute?.('data-route');
  target.removeAttribute?.('aria-live');

  if(source.tagName==='IMG'){
    target.src=source.currentSrc||source.src;
    target.removeAttribute('loading');
  }

  if(source.tagName?.toLowerCase()==='svg'){
    const use=source.querySelector(':scope > use');
    if(use){
      const symbol=document.querySelector(use.getAttribute('href')||use.getAttribute('xlink:href'));
      if(symbol){
        target.setAttribute('viewBox',symbol.getAttribute('viewBox')||source.getAttribute('viewBox')||'0 0 24 24');
        target.innerHTML=symbol.innerHTML;
        materializeFigmaPseudo(source,target,'::before',true);
        materializeFigmaPseudo(source,target,'::after',false);
        return;
      }
    }
  }

  const sourceChildren=[...source.children];
  const targetChildren=[...target.children];
  sourceChildren.forEach((child,index)=>inlineFigmaCloneTree(child,targetChildren[index]));
  materializeFigmaPseudo(source,target,'::before',true);
  materializeFigmaPseudo(source,target,'::after',false);
}

async function createFigmaCapturePayload(screen){
  if(document.fonts?.ready)await document.fonts.ready;
  const source=document.querySelector('.device');
  if(!source)return null;
  const clone=source.cloneNode(true);
  inlineFigmaCloneTree(source,clone);
  clone.style.margin='0';
  clone.style.transform='none';
  return {type:'wishlist-figma-capture-response',screen,html:clone.outerHTML,height:Math.ceil(source.getBoundingClientRect().height)};
}

let figmaCapturePayloadPromise=null;

window.addEventListener('message',async event=>{
  if(event.data?.type!=='wishlist-figma-capture-request'||window.parent===window)return;
  try{
    if(!figmaCapturePayloadPromise)figmaCapturePayloadPromise=createFigmaCapturePayload(event.data.screen||location.hash.slice(1));
    const payload=await figmaCapturePayloadPromise;
    if(payload)window.parent.postMessage(payload,'*');
  }catch(error){
    window.parent.postMessage({type:'wishlist-figma-capture-error',screen:event.data.screen||location.hash.slice(1),message:error?.message||String(error)},'*');
  }
});

if(boardEmbedMode){
  const boardDevice=document.querySelector('.device');
  if('ResizeObserver' in window)new ResizeObserver(reportBoardHeight).observe(boardDevice);
  window.addEventListener('load',reportBoardHeight,{once:true});
  document.addEventListener('click',()=>window.setTimeout(reportBoardHeight,80));
  reportBoardHeight();
}
