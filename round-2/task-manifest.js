'use strict';
window.UT_TASKS = {
 t1: {id:'T1',title:'홈에서 다시 만나기',prompt:'살 게 없는데 심심해서 앱을 열었어요. 홈에서 오늘 볼 만한 걸 하나 골라 주세요.',highlight:'오늘 볼 만한 걸 하나',end:'상품을 하나 고르면 진행자가 종료합니다. 최대 60초입니다.',metric:'선택 상품의 출처 · 홈 찜 영역 노출 · 영역 이해',manualEnd:true,maxSeconds:60,conditions:{after:{start:'home'}}},
 t2p: {id:'T2′',title:'찜 안에서 다시 마주하기',prompt:'찜 목록에 들어가서, 오늘 다시 볼 만한 상품을 하나 골라 주세요.',highlight:'오늘 다시 볼 만한 상품을 하나',end:'상품을 하나 고르면 진행자가 종료합니다. 최대 60초입니다.',metric:'다시 살펴볼 상품에서 선택 · 시트 열림 · 영역 이해',manualEnd:true,maxSeconds:60,conditions:{after:{start:'wishlist'}}},
 t3: {id:'T3',title:'찜 상품 20개 이상 정리하기',prompt:'찜 상품이 너무 많아 목록을 정리하려고 합니다. 현재 찜 목록에서 제외하고 싶은 상품을 20개 이상 정리해 주세요.',highlight:'20개 이상',end:'20개 이상을 정리하면 종료합니다. 최대 3분입니다.',metric:'제안 이용 · 편집 삭제 · 정리 결과 이해',maxSeconds:180,conditions:{after:{start:'wishlist',targetCount:20}}},
 t4: {id:'T4',title:'정리한 상품 복원하기',prompt:'이번에는 ‘핀턱 와이드 슬랙스’가 정리된 상태에서 시작합니다. 이 상품을 다시 찜 목록에서 볼 수 있게 해 주세요.',highlight:'핀턱 와이드 슬랙스',end:'대상 상품을 찜 목록으로 되돌리면 종료합니다. 최대 3분입니다.',metric:'도움 없는 복원 · 정리한 상품 진입 · 복원 이해',maxSeconds:180,conditions:{after:{start:'wishlist-after-cleanup',targetId:'p07',targetName:'핀턱 와이드 슬랙스'}}}
};
