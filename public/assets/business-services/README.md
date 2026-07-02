# /business-services 비주얼 이미지 폴더

이 폴더에 실제 사진/스크린샷을 넣으면, CSS mockup 대신 실제 이미지가 표시됩니다.

## 사용 방법
`src/pages/BusinessServicesPage.tsx` 의 `packages` 배열에서 해당 패키지에
`imageSrc` 를 지정하세요. 경로는 `/assets/business-services/파일명` 형식입니다.
(Vite 는 `public/` 를 사이트 루트로 서빙합니다.)

예:
```ts
{
  id: 'fund-diagnosis',
  ...
  imageSrc: '/assets/business-services/fund-diagnosis.png',
}
```

## 권장 파일명 (패키지 id 기준)
- fund-diagnosis.png   — 정책자금 가능성 진단
- gov-plan.png         — 정부지원사업 사업계획 전략
- venture-story.png    — 벤처인증 스토리 설계
- web-mvp.png          — 홈페이지 + MVP 제작
- lab-cert.png         — 연구소·기업인증 로드맵
- full.png             — 정책자금·벤처인증 풀패키지
- hero.png             — 히어로 큰 비주얼 (BusinessServiceVisual type="hero" 자리)

## 권장 비율
- 카드 썸네일: 16:9 (예 1280x720)
- 히어로: 4:3 (예 1200x900)

imageSrc 가 없으면 visualType 기반 mockup 이 자동으로 표시되므로,
이미지가 없어도 레이아웃은 깨지지 않습니다.
