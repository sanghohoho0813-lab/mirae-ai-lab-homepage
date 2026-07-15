// 사업자정보 — 텍스트 전용. 사업자등록증 이미지/QR 보기 기능 없음(민감정보 비노출).
import LegalPageLayout, { LegalTable } from '../../components/legal/LegalPageLayout'
import { businessInfo } from '../../config/businessInfo'

export default function BusinessInfoPage() {
  const b = businessInfo

  const rows: React.ReactNode[][] = [
    ['상호', `${b.companyName} (${b.brandName})`],
    ['서비스명', `${b.serviceName} (${b.serviceNameEn})`],
    ['대표자', b.representative],
    ['사업자등록번호', b.businessNumber],
    ['업태', b.businessCategory],
    ['종목', b.businessItem],
    ['사업장 주소', b.address],
    ['고객 문의', <a href={`mailto:${b.contactEmail}`}>{b.contactEmail}</a>],
  ]
  if (b.contactPhone) rows.push(['전화', b.contactPhone])
  if (b.mailOrderSalesNumber) rows.push(['통신판매업 신고번호', b.mailOrderSalesNumber])

  return (
    <LegalPageLayout
      docTitle="사업자정보"
      numbered={false}
      intro={
        <p>
          {b.serviceName}(미래경영지원센터)를 운영하는 사업자의 기본 정보입니다. 정확한 정보 확인이 필요하시면 아래 이메일로
          문의해 주세요.
        </p>
      }
    >
      <div className="mt-6">
        <LegalTable head={['항목', '내용']} rows={rows} />
      </div>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-[0.95rem] leading-relaxed text-slate-600">
        <p className="font-bold text-slate-800">안내</p>
        <ul className="mt-2 list-disc space-y-1.5 pl-5">
          <li>고객 상담·문의는 이메일(<a href={`mailto:${b.contactEmail}`} className="text-blue-700 underline underline-offset-2">{b.contactEmail}</a>)로 접수해 주시면 순차적으로 안내드립니다.</li>
          <li>결제·환불 관련 문의는 <a href="/refund-policy" className="text-blue-700 underline underline-offset-2">환불·취소 정책</a>을, 개인정보 관련 문의는 <a href="/privacy" className="text-blue-700 underline underline-offset-2">개인정보처리방침</a>을 함께 참고해 주세요.</li>
          <li>본 페이지의 정보는 사업자 등록 사항 변경 시 갱신됩니다.</li>
        </ul>
      </div>
    </LegalPageLayout>
  )
}
