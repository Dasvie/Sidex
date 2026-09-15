import type { Metadata } from "next";

export const metadata: Metadata = { title: "이용약관" };

export default function Terms() {
  return (
    <main className="container">
      <article className="section" style={{ maxWidth: 720 }}>
        <p className="eyebrow">이용약관</p>
        <h1 className="h1" style={{ marginTop: 8 }}>Sidex를 쓰는 데 필요한 약속</h1>
        <div className="prose" style={{ marginTop: 24, whiteSpace: "normal", display: "grid", gap: 16 }}>
          <p>이 약관은 Sidex(이하 서비스)를 쓰는 데 필요한 약속을 정리한 것입니다. 로그인하면 이 약관에 동의한 것으로 봅니다.</p>
          <h2 className="h3">제1조 목적</h2>
          <p>서비스는 만든 사람이 자신의 프로덕트를 올리고, 다른 사람의 프로덕트를 발견하고, 리뷰와 논평을 남기는 곳입니다. 이 약관은 서비스와 이용자 사이의 권리와 의무를 정합니다.</p>
          <h2 className="h3">제2조 정의</h2>
          <ul style={{ display: "grid", gap: 6, paddingLeft: 18, listStyle: "disc" }}>
            <li>이용자: 서비스를 보거나 쓰는 모든 사람.</li>
            <li>회원: Google, 카카오, 네이버 계정으로 로그인한 이용자.</li>
            <li>프로덕트: 회원이 등록했거나 서비스가 소개하는 제품 또는 아이디어.</li>
            <li>게시물: 프로덕트 정보, 프로필, 리뷰, 논평, 답글, 스크린샷 등 회원이 올린 모든 내용.</li>
          </ul>
          <h2 className="h3">제3조 약관의 효력과 변경</h2>
          <p>이 약관은 서비스 화면에 게시함으로써 효력이 생깁니다. 바꾸어야 할 사정이 생기면 변경 내용과 시행일을 미리 공지합니다. 변경에 동의하지 않으면 탈퇴할 수 있습니다.</p>
          <h2 className="h3">제4조 로그인</h2>
          <ul style={{ display: "grid", gap: 6, paddingLeft: 18, listStyle: "disc" }}>
            <li>별도의 회원가입 절차 없이 Google, 카카오, 네이버 계정으로 로그인합니다. 서비스는 비밀번호를 저장하지 않습니다.</li>
            <li>처음 로그인하면 제공자가 준 이름과 이메일로 빌더 프로필이 만들어집니다. 핸들은 이메일에서 자동으로 정해집니다.</li>
            <li>만 14세 미만은 쓸 수 없습니다.</li>
          </ul>
          <h2 className="h3">제5조 서비스 내용</h2>
          <ul style={{ display: "grid", gap: 6, paddingLeft: 18, listStyle: "disc" }}>
            <li>프로덕트 등록과 공개, 카테고리별 목록과 랭킹</li>
            <li>리뷰(별점과 좋은 점·아쉬운 점), 논평과 답글</li>
            <li>빌더 프로필</li>
          </ul>
          <p>순위는 리뷰와 논평의 수로 정해집니다. 서비스는 무료입니다. 기능은 더해지거나 바뀔 수 있으며, 큰 변경은 미리 알립니다.</p>
          <h2 className="h3">제6조 게시물의 권리</h2>
          <ul style={{ display: "grid", gap: 6, paddingLeft: 18, listStyle: "disc" }}>
            <li>게시물의 저작권은 작성한 회원에게 있습니다. 서비스가 가져가지 않습니다.</li>
            <li>다만 서비스는 게시물을 서비스 안에서 보이고, 목록·검색·랭킹·공유 카드에 드러내기 위해 사용합니다.</li>
            <li>남의 저작물을 권한 없이 올리지 마세요. 그에 따른 책임은 올린 회원에게 있습니다.</li>
          </ul>
          <h2 className="h3">제7조 하지 말아야 할 것</h2>
          <ul style={{ display: "grid", gap: 6, paddingLeft: 18, listStyle: "disc" }}>
            <li>남을 사칭하거나 모욕하는 내용, 차별·혐오 표현</li>
            <li>음란물, 불법 정보, 악성코드로 이어지는 링크</li>
            <li>광고·홍보만을 목적으로 한 반복 등록과 도배</li>
            <li>순위를 올리기 위한 중복 계정, 자작 리뷰, 대가를 주고받는 리뷰</li>
            <li>자동화된 방법으로 서비스에 과도한 부하를 주는 행위</li>
          </ul>
          <h2 className="h3">제8조 게시물의 삭제와 이용 제한</h2>
          <p>제7조를 어긴 게시물은 알림 없이 가릴 수 있으며, 반복될 때는 계정의 이용을 제한할 수 있습니다. 조치에 이의가 있으면 제10조의 방법으로 알려 주세요.</p>
          <h2 className="h3">제9조 서비스의 중단과 면책</h2>
          <ul style={{ display: "grid", gap: 6, paddingLeft: 18, listStyle: "disc" }}>
            <li>점검·장애·호스팅 사정으로 서비스가 멈출 수 있습니다. 미리 알 수 있는 중단은 공지합니다.</li>
            <li>서비스는 무료로 제공되며, 회원이 올린 내용의 정확성과 품질을 보증하지 않습니다.</li>
            <li>등록된 외부 주소의 내용은 해당 사이트의 책임입니다. 방문 전에 확인해 주세요.</li>
            <li>회원 간의 분쟁에 서비스가 개입할 의무는 없습니다.</li>
          </ul>
          <h2 className="h3">제10조 문의와 분쟁</h2>
          <p>서비스에 관한 문의는 운영 계정 프로필(@sidex)의 프로덕트에 논평으로 남겨 주세요. 분쟁은 대한민국 법령을 따릅니다.</p>
          <h2 className="h3">부칙</h2>
          <p>이 약관은 2026년 9월 15일부터 적용됩니다.</p>
        </div>
      </article>
    </main>
  );
}
