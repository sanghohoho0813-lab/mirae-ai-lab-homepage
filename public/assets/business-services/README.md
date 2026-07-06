# /business-services 상품 썸네일 이미지 폴더

이 폴더에 아래 **정확한 파일명**으로 이미지를 넣으면, 각 상품 카드·상세페이지 썸네일이
실제 이미지로 자동 표시됩니다. (Vite 는 `public/` 를 사이트 루트로 서빙하므로
경로는 `/assets/business-services/파일명` 입니다.)

파일이 없거나 로드에 실패하면 CSS 배너로 자동 폴백되어 **깨진 이미지는 나오지 않습니다.**
파일을 이 폴더에 추가(커밋/푸시)하기만 하면 그대로 반영됩니다. 코드 수정 불필요.

## 상품 ↔ 파일명 매칭 (코드에 이미 연결됨)
| # | 상품 | 파일명 | slug |
| --- | --- | --- | --- |
| 1 | 정책자금 컨설팅 | `funding-consulting.png` | `funding-consulting` |
| 2 | 고용지원금 패키지 | `employment-subsidy.png` | `employment-subsidy` |
| 3 | 벤처인증 패키지(혁신성장형) | `venture-innovation.png` | `venture-innovation` |
| 4 | 벤처인증 패키지(투자유형) | `venture-investment.png` | `venture-investment` |
| 5 | 반응형 홈페이지 제작 | `responsive-homepage.png` | `responsive-homepage` |
| 6 | AI 기반 회사 운영시스템 구축 | `ai-ax-system.png` | `ai-ax-system` |
| 7 | 기업부설연구소 설립 | `rnd-center.png` | `rnd-center` |
| 8 | ISO 인증 패키지 | `iso-certification.png` | `iso-certification` |
| 9 | 메인비즈 인증 | `mainbiz-certification.png` | `mainbiz-certification` |
| 10 | 이노비즈 인증 | `innobiz-certification.png` | `innobiz-certification` |
| 11 | 성장 로드맵 풀패키지 (대표 상품) | `growth-roadmap-package.png` | `growth-roadmap-package` |

## 권장 사양
- 비율: **1:1(정사각형)** — 카드/상세 썸네일이 `aspect-square` + `object-cover` 라 정사각형이 가장 깔끔합니다.
- 크기: 1000×1000 이상 권장(PNG/JPG/WebP).
- 이미지에 이미 상품 문구가 포함되어 있으므로 코드에서 썸네일 위 텍스트 오버레이는 넣지 않습니다.
