# AX SHOWCASE v2 이미지 매니페스트 (사진 85~110)

출처: Google Drive 폴더 `미래에이아이랩 프론트 디자인 사진들`
(폴더 ID `19_82WXXvK99q29txzNrKfGjLFfflTSaJ`, owner sanghohoho0813@gmail.com)
원본은 열람·복사만 함 — 삭제/이름변경/덮어쓰기/이동 없음. 런타임 핫링크 없음(프로젝트 내부 WebP만 사용).

## ⚠️ 번호↔내용 매핑 원칙 (중요)

스펙 문서의 "사진 번호 → 업종/유형" 매핑이 실제 파일 내용과 **체계적으로 어긋나** 있었습니다.
각 이미지에는 브랜드명이 화면에 직접 렌더링되어 있어(SiteFlow/StorePulse/CareFlow/ClassPilot/GarageOS/StayDeck/LeaseFlow/FieldCare),
**실제 화면 브랜드 기준**으로 매핑했습니다(그래야 각 업종 카드에 올바른 브랜드 화면이 들어감).
실제 파일은 `85·86 보조` + `8개 업종 × [PC·모바일·쇼케이스]`(87~110)의 깔끔한 규칙을 따릅니다.

예) 스펙: "105=FieldCare 대표" → 실제 `사진 105`는 **LeaseFlow PC 관리화면**.
따라서 Hero의 의도(FieldCare/LeaseFlow/GarageOS 쇼케이스)는 실제 파일 **110 / 107 / 101**로 실현했습니다.

## 저장 경로

`public/ax-showcase-v2/photo-<NNN>-<slug>.webp` (full, 최대 장변 1600px, q88)
`public/ax-showcase-v2/photo-<NNN>-<slug>-sm.webp` (썸네일, 가로 960 / 세로 520, q82)

원본 합계 ≈ 35.5MB(PNG) → 최적화 후 full+sm 합계 ≈ 3.9MB(WebP).

## 전체 매핑표

| 사진 | 실제 브랜드·업종 | 화면 유형 | 방향 | 원본px | 사용 위치 | 파일 slug |
|---:|---|---|---|---|---|---|
| 85 | 건설 현장관리(범용) | 보조 | 가로 1672×941 | 문제→AX(건설 보조) | construction-admin |
| 86 | 예약·고객관리(CRM) | 보조/전환컷 | 가로 1672×941 | 문제→AX(예약·서비스 보조) | reservation-transform |
| 87 | SiteFlow 건설·현장 | 관리자 PC | 가로 1672×941 | 업종:SiteFlow PC | siteflow-pc |
| 88 | SiteFlow 건설·현장 | 모바일 | 세로 941×1672 | 업종:SiteFlow 모바일 | siteflow-mobile |
| 89 | SiteFlow 건설·현장 | 쇼케이스 | 가로 1672×941 | 업종:SiteFlow 대표 | siteflow-showcase |
| 90 | StorePulse 외식·프랜차이즈 | 관리자 PC | 가로 1672×941 | 업종:StorePulse PC | storepulse-pc |
| 91 | StorePulse 외식·프랜차이즈 | 모바일 | 세로 941×1672 | 업종:StorePulse 모바일 | storepulse-mobile |
| 92 | StorePulse 외식·프랜차이즈 | 쇼케이스 | 가로 1672×941 | 업종:StorePulse 대표 | storepulse-showcase |
| 93 | CareFlow 병원·의원 | 관리자 PC | 가로 1672×941 | 업종:CareFlow PC | careflow-pc |
| 94 | CareFlow 병원·의원 | 모바일 | 세로 941×1672 | 업종:CareFlow 모바일 | careflow-mobile |
| 95 | CareFlow 병원·의원 | 쇼케이스 | 가로 1672×941 | 업종:CareFlow 대표 | careflow-showcase |
| 96 | ClassPilot 학원·교육 | 관리자 PC | 가로 1672×941 | 업종:ClassPilot PC | classpilot-pc |
| 97 | ClassPilot 학원·교육 | 모바일 | 세로 941×1672 | 업종:ClassPilot 모바일 | classpilot-mobile |
| 98 | ClassPilot 학원·교육 | 쇼케이스 | 가로 1672×941 | 업종:ClassPilot 대표 | classpilot-showcase |
| 99 | GarageOS 자동차정비 | 관리자 PC | 가로 1672×941 | 업종:GarageOS PC | garageos-pc |
| 100 | GarageOS 자동차정비 | 모바일 | 세로 941×1672 | 업종:GarageOS 모바일 | garageos-mobile |
| 101 | GarageOS 자동차정비 | 쇼케이스 | 가로 1672×941 | **Hero #3** + 업종:GarageOS 대표 | garageos-showcase |
| 102 | StayDeck 숙박·호텔 | 관리자 PC | 가로 1672×941 | 업종:StayDeck PC | staydeck-pc |
| 103 | StayDeck 숙박·호텔 | 모바일 | 세로 941×1672 | 업종:StayDeck 모바일 | staydeck-mobile |
| 104 | StayDeck 숙박·호텔 | 쇼케이스 | 가로 1672×941 | 업종:StayDeck 대표 | staydeck-showcase |
| 105 | LeaseFlow 임대·건물관리 | 관리자 PC | 가로 1672×941 | 업종:LeaseFlow PC | leaseflow-pc |
| 106 | LeaseFlow 임대·건물관리 | 모바일 | 세로 941×1672 | 업종:LeaseFlow 모바일 | leaseflow-mobile |
| 107 | LeaseFlow 임대·건물관리 | 쇼케이스 | 가로 1672×941 | **Hero #2** + 업종:LeaseFlow 대표 | leaseflow-showcase |
| 108 | FieldCare 시설관리 | 관리자 PC | 가로 1672×941 | 업종:FieldCare PC | fieldcare-pc |
| 109 | FieldCare 시설관리 | 모바일 | 세로 864×1821 | **모바일 Hero** + 업종:FieldCare 모바일 | fieldcare-mobile |
| 110 | FieldCare 시설관리 | 쇼케이스 | 가로 1672×941 | **Hero #1(대표)** + 업종:FieldCare 대표 | fieldcare-showcase |

## Hero 이미지 우선순위 (실제 파일)

1. `110` FieldCare 쇼케이스 — 데스크톱 메인(대표, PC+모바일 함께, 관리자↔현장 연결)
2. `107` LeaseFlow 쇼케이스 — 전환 탭 #2
3. `101` GarageOS 쇼케이스 — 전환 탭 #3 (어둡고 고급 Enterprise 인상)
- 모바일 Hero: `109` FieldCare 모바일(세로, 판독 가능한 단일 화면)

## 이미지 반복(≤2회) 검증

- `101`,`107`,`110`,`109` = Hero + 해당 업종 = 각 2회
- 나머지(85·86, 87~106의 PC/모바일/쇼케이스) = 각 1회
- 기존 사진 1~84(public/ax-showcase)는 그대로 보존 — v2와 충돌 없음

## 원본 Google Drive 파일 ID (참조용, 무변경)

85:1k-qHKcKRnRyRtCDg-L0C5LW6NJgYzKhf · 86:1yZhbqDYgC46DPWWWOvAVCHYnCFLtFO2l · 87:1PWgJEmVaCVP5Ce97j8eaeM6ecxTeJigg
88:1AAMxqVR_2QGuczsYUY7XURMlm649hrL- · 89:1rHT3FuyfJtBk09-lA3zmYU_pYmQIcZ_j · 90:1yEgx3kb3WgZmh81FIu70NwTGicrfv6im
91:1tfrv6QR19TQU5kLqP_-GGYke-xpaykVg · 92:145ecdWte0_HRvfvBBI8OjGxJMBT04vBZ · 93:172Zzv1KdGqbEB843qGQzWLcmeQIRqHto
94:1kyLgZtbfjyfGtTkLkmjJ6uLbmJnfA9fU · 95:1DppocJBvqILe-Ei6WGqgf7H3rLFGYLZr · 96:15jmpKfj7PsXn8fyF929WibXITX-mkBs-
97:1gW8zZcArl0xdKQ9IsJVRyd4LfwWSMa1s · 98:1G5zIh-RkqXP94sWe8JODeWN0GfwWWM43 · 99:1Ft7wLu5g1Eanxi-cFbpwnesXoQQpH1sw
100:1NInZJyIL3lVd2f919YCfTOFFbM1ibFSM · 101:1tEgg8x-SV7NF_Mw5qWucz0NUKhATfy88 · 102:1ZGgKrkcDXqtK-gp24jFpYqKyfN_TKSKp
103:1L8xDsoN19uFCUMcG7uBE18nNcN6CMe7i · 104:1J-bLD3ttrgU8w_L_qk_NsYIwzaFlQOeb · 105:1wo_j3nPE7caLkUxFcDhkRcru2fSjYaOu
106:18Gq0z9odnU0CkzXvKluZNm4-SlHZnyd6 · 107:12iQWdVM-vYOnpLSwcCCNayhUi_OVL2b7 · 108:1SjJZBtr8Wr6WxXqbcmHcIB5YQP_GKMaT
109:1fqc7XK8GXpC2-En7j7VjS2Nhyv-4nTb- · 110:1v1nwqVIWsRK87w8JT_GErD78BLGDDoEW
