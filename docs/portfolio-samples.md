# 홈 포트폴리오 캐러셀 — MVP 레퍼런스 10개

미래AI랩이 직접 기획·개발한 샘플 서비스 10개를 홈 화면(`/business-services`)의
`#portfolio` 섹션에서 좌우로 넘겨 보여준다.

## 미리보기 이미지 생성 방식

각 사이트의 **실제 첫 화면을 캡처**해 `/public/portfolio/` 에 저장했다.
외부 URL을 그대로 불러오지 않으므로 배포 후에도 이미지가 깨지지 않는다.

- 캡처 환경: Chromium 1440×900, DPR 2
- 저장 규격: `<slug>.webp` 1440×900 (q86), `<slug>-sm.webp` 720×450 (q80)
- 10장 합계 약 773KB

> 이 컨테이너의 Chromium 은 외부망을 직접 열지 못해, 로컬 중계 서버(curl 경유)를
> 띄워 캡처했다. 사이트가 개편되면 같은 방식으로 다시 캡처해 교체하면 된다.

## 상품 매핑

| slug | 서비스 | 분류 | 링크 |
| --- | --- | --- | --- |
| pawbeauty | PawBeauty | 반려동물 미용 예약 | https://sample-animalbeauty-booking-mvp.vercel.app/ |
| expertmatch | ExpertMatch | 전문가 상담 매칭 | https://sample-expertmatch-mvp.vercel.app/ |
| localmom | 로컬맘 | 산지직송 신선식품 커머스 | https://sample-localmat-commerce-mvp.vercel.app/ |
| eduplaza | EduPlaza | 온라인 학습 플랫폼 | https://sample4-eduplaza-learning-mvp.vercel.app/ |
| insightai | InsightAI | AI 데이터 분석 SaaS | https://sample5-insight-ai-analytics-mvp.vercel.app/ |
| rescuewalk | RescueWalk | 유기견 산책 매칭 | https://sample6-rescuewalk-matching-mvp.vercel.app/ |
| cafefocus | CafeFocus | 작업하기 좋은 카페 지도 | https://sample7-cafefocus-map-mvp-loz4.vercel.app/ |
| scamshield | ScamShield | AI 사기문자 판독 | https://sample8-scamshield-ai-mvp.vercel.app/ |
| freshfridge | FreshFridge | 냉장고 식재료 관리 | https://sample9-freshfridge-food-mvp.vercel.app/ |
| stylecheck | StyleCheck AI | 코디 점검 AI | https://sample10-stylecheck-ai-mvp.vercel.app/ |

미분류 이미지 없음 — 10개 사이트 전부 캡처·연결 완료.

## 표기 원칙

- 고객사 실적이 아니라 **자체 제작 레퍼런스 데모**라는 문구를 섹션 하단에 항상 노출한다.
- 링크는 `target="_blank" rel="noopener noreferrer"` 로 새 창에서 연다.
- 사이트를 추가·교체할 때는 `src/data/portfolioSamples.ts` 한 곳만 고치면 된다.
