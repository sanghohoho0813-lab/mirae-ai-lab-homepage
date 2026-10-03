// 스팸 차단용 함정 칸 — 사람에게는 보이지 않고(화면 밖·읽기 프로그램에서 숨김·탭으로 가지 않음) 자동 입력 봇만 채운다.
// 이 칸(name="website")이 채워져 오면 서버(/api/inquiry)는 메일을 보내지 않고 성공처럼 답한다.
export default function HoneypotField() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute -left-[9999px] h-px w-px overflow-hidden opacity-0">
      <label>
        웹사이트(비워 두세요)
        <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
      </label>
    </div>
  )
}
