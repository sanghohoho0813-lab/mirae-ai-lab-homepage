# /business-services 상품 썸네일 이미지 폴더

이 폴더에 아래 **정확한 파일명**으로 6장을 넣으면, 각 상품 카드·상세페이지 썸네일이
실제 이미지로 자동 교체됩니다. (Vite 는 `public/` 를 사이트 루트로 서빙하므로
경로는 `/assets/business-services/파일명` 입니다.)

파일이 없거나 로드에 실패하면 CSS 배너로 자동 폴백되어 **깨진 이미지는 나오지 않습니다.**
즉, 파일을 이 폴더에 추가(커밋/푸시)하기만 하면 그대로 반영됩니다. 코드 수정 불필요.

## 상품 ↔ 파일명 매칭 (코드에 이미 연결됨)
| 상품 | 파일명 |
| --- | --- |
| 정책자금 가능성 진단 패키지 | `package-funding-diagnosis.png` |
| 벤처인증 스토리 설계 패키지 | `package-venture-story.png` |
| 홈페이지 + MVP 제작 패키지 | `package-homepage-mvp.png` |
| 정부지원사업 사업계획 전략 패키지 | `package-government-plan.png` |
| 연구소·기업인증 로드맵 패키지 | `package-rnd-cert-roadmap.png` |
| 정책자금·벤처인증 풀패키지 | `package-full-growth-roadmap.png` |

## 권장 사양
- 비율: **1:1(정사각형)** — 카드/상세 썸네일이 `aspect-square` + `object-cover` 라 정사각형이 가장 깔끔합니다.
- 크기: 1000×1000 이상 권장(PNG/JPG/WebP).

## 히어로(선택)
`hero.png` 를 넣고 코드에서 히어로 비주얼에 연결하면 히어로에도 실제 이미지를 쓸 수 있습니다.
(현재 히어로는 텍스트형 프로모션 배너라 별도 이미지 없이 동작합니다.)
