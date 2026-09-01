'use strict';

window.UT_TASKS = {
  t1: {
    id: 'T1',
    title: '이전에 찜한 상품 다시 찾기',
    prompt: '전에 찜해 둔 슬로우앤드의 흰색 롱스커트를 다시 보고 싶습니다. 해당 상품을 찾아 현재 가격을 확인해 주세요.',
    highlight: '슬로우앤드의 흰색 롱스커트',
    end: '과업 조건에 맞는 대상 상품의 상세 화면을 확인하면 종료합니다.',
    kpi: 'K1 찜 재방문율',
    conditions: {
      before: {
        start: 'before-home',
        targetId: 'p01',
        targetName: '슬로우앤드 흰색 롱스커트',
        screens: ['기존 홈', '기존 찜 긴 목록', '대상 상품 상세']
      },
      after: {
        start: 'home',
        targetId: 'p01',
        targetName: '슬로우앤드 흰색 롱스커트',
        screens: ['C1 홈 기준 상품 선택', '기준 상품과 함께 노출되는 연관 찜 상품', '대상 상품 상세']
      }
    }
  },
  t2: {
    id: 'T2',
    title: '찜 안에서 매몰된 상품 재검토하기',
    prompt: '예전에 찜해 둔 은색 로고가 있는 흰색 카드지갑을 다시 보고 싶습니다. 해당 상품을 찾아 현재 가격과 상세 정보를 확인해 주세요.',
    highlight: '은색 로고가 있는 흰색 카드지갑',
    end: '과업 조건에 맞는 대상 상품의 상세 화면을 확인하면 종료합니다.',
    kpi: 'K2 매몰 구간 재검토율',
    conditions: {
      before: {
        start: 'before-wishlist',
        targetId: 'p14',
        targetName: '은색 로고가 있는 흰색 카드지갑',
        screens: ['기존 찜 428개 긴 목록', '목록 하단의 대상 상품', '대상 상품 상세']
      },
      after: {
        start: 'wishlist',
        targetId: 'p14',
        targetName: '은색 로고가 있는 흰색 카드지갑',
        screens: ['A1 찜 기본', 'D1 다시 살펴볼 상품', 'A3 찜 내 검색 선택 경로', '대상 상품 상세']
      }
    }
  },
  t3: {
    id: 'T3',
    title: '찜 상품 20개 정리하기',
    prompt: '찜 상품이 너무 많아 목록을 정리하려고 합니다. 현재 찜 목록에서 제외하고 싶은 상품 20개를 정리해 주세요.',
    highlight: '제외하고 싶은 상품 20개',
    end: '기존안은 상품 20개를 선택해 삭제 버튼을 누르면, 개선안은 20개 이상이 포함된 제안에서 정리하기를 누르면 종료합니다.',
    kpi: 'K3 찜 목록 관리 이탈률',
    conditions: {
      before: {
        start: 'before-wishlist',
        targetCount: 20,
        screens: ['기존 찜 기본', '기존 편집 진입', '20개 다중 선택', '삭제 버튼 활성 상태']
      },
      after: {
        start: 'wishlist',
        targetCount: 20,
        screens: ['A1 찜 기본', 'E3b 숨긴 상품 빈 상태와 정리 진입', 'G3a 정리 제안', 'G3c 정리 완료']
      }
    }
  },
  t4: {
    id: 'T4',
    title: '정리한 상품 복원하기',
    prompt: '방금 정리한 상품 중 ‘핀턱 와이드 슬랙스’를 다시 찜 목록에서 볼 수 있게 해 주세요.',
    highlight: '핀턱 와이드 슬랙스',
    end: '핀턱 와이드 슬랙스의 복원 동작을 실행하면 종료합니다.',
    kpi: 'K3 보조 지표 · 정리 기능 안전성',
    conditions: {
      after: {
        start: 'wishlist-after-cleanup',
        targetId: 'p07',
        targetName: '핀턱 와이드 슬랙스',
        screens: ['정리 후 A1 찜 기본', 'E3e 숨긴 상품 42개', 'E3c 숨긴 상품 편집', '복원 완료 토스트']
      }
    }
  }
};
