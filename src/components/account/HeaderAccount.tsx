// 비즈니스/상품/진단 페이지 헤더용 계정 컨트롤 묶음.
// 데스크톱: 공통 AccountMenu(로그인 상태 통일) + 햄버거 / 모바일: 햄버거만(내부에 계정 카드).
// 기존 <PublicMenuDrawer variant=…/> 자리에 그대로 교체해 로그인 상태를 전 화면에서 동일하게 노출한다.
import PublicMenuDrawer, { type PublicMenuVariant } from '../PublicMenuDrawer'
import AccountMenu from './AccountMenu'

export default function HeaderAccount({ variant = 'business' }: { variant?: PublicMenuVariant }) {
  return (
    <div className="flex items-center gap-1.5">
      <AccountMenu className="hidden sm:block" />
      <PublicMenuDrawer variant={variant} />
    </div>
  )
}
