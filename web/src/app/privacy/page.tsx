import type { Metadata } from "next";

export const metadata: Metadata = { title: "개인정보처리방침" };

const ul = { display: "grid", gap: 6, paddingLeft: 18, listStyle: "disc" } as const;

export default function Privacy() {
  return (
    <main className="container">
      <article className="section" style={{ maxWidth: 720 }}>
        <p className="eyebrow">개인정보처리방침</p>
        <h1 className="h1" style={{ marginTop: 8 }}>필요한 최소한만 받습니다</h1>
        <div className="prose" style={{ marginTop: 24, whiteSpace: "normal", display: "grid", gap: 16 }}>
          <p>Sidex(이하 서비스)는 이용자의 개인정보를 중요하게 생각하며, 필요한 최소한만 받습니다. 이 방침은 서비스가 어떤 정보를 어떻게 다루는지를 설명합니다.</p>
          <h2 className="h3">1. 수집하는 개인정보</h2>
          <h3 className="label">가. 로그인할 때 제공자에게서 받는 것</h3>
          <ul style={ul}>
            <li>Google, 카카오, 네이버 계정의 이름, 이메일, 프로필 사진 주소, 제공자 계정 식별자</li>
          </ul>
          <p>비밀번호는 받지도 저장하지도 않습니다. 인증은 제공자가 처리합니다.</p>
          <h3 className="label">나. 서비스를 쓰면서 이용자가 직접 입력하는 것</h3>
          <ul style={ul}>
            <li>빌더 프로필: 표시 이름, 소개, 외부 링크, 프로필 사진</li>
            <li>등록한 프로덕트: 이름, 주소, 소개, 설명, 카테고리, 단계, 스택, 도구, 제작 기간, 팀 인원, 스크린샷</li>
            <li>활동 기록: 리뷰(별점, 좋은 점, 아쉬운 점, 항목별 점수), 논평, 답글</li>
          </ul>
          <p>이 항목들은 서비스의 성격상 다른 방문자에게 공개됩니다. 이메일은 공개되지 않습니다. 공개를 원하지 않는 내용은 입력하지 마세요.</p>
          <h3 className="label">다. 자동으로 쌓이는 것</h3>
          <ul style={ul}>
            <li>접속 일시, 방문한 페이지 등 호스팅 사업자의 요청 기록</li>
            <li>로그인 상태 유지를 위한 세션 쿠키</li>
            <li>등록된 프로덕트 주소의 공개 CSS를 읽어 잰 팔레트와 서체(개인정보가 아닌 사이트 정보)</li>
          </ul>
          <h2 className="h3">2. 수집한 정보를 쓰는 곳</h2>
          <ul style={ul}>
            <li>회원 식별과 로그인 유지</li>
            <li>프로덕트 등록·공개와 랭킹 집계</li>
            <li>리뷰·논평 운영과 작성자 표시</li>
            <li>오용·중복 등록 확인 등 서비스 유지</li>
          </ul>
          <p>위 목적 외에는 쓰지 않으며, 목적이 바뀔 때는 사전에 알리고 동의를 받습니다.</p>
          <h2 className="h3">3. 보관 기간과 파기</h2>
          <ul style={ul}>
            <li>회원 정보는 탈퇴할 때까지 보관하고, 탈퇴 시 지체 없이 파기합니다.</li>
            <li>이용자가 올린 프로덕트·리뷰·논평은 이용자가 지우거나 탈퇴할 때까지 남습니다.</li>
            <li>법령이 보관을 요구하는 경우에는 그 기간 동안 별도 보관한 뒤 파기합니다.</li>
          </ul>
          <h2 className="h3">4. 제3자 제공과 처리위탁</h2>
          <p>서비스는 수집한 개인정보를 제3자에게 제공하지 않습니다. 다만 서비스 운영에 필요한 범위에서 아래 업무를 위탁합니다.</p>
          <ul style={ul}>
            <li>Vercel Inc.: 웹사이트 호스팅, 이미지 저장(Vercel Blob)</li>
            <li>Neon Inc.: 데이터베이스 저장</li>
            <li>Google, 카카오, 네이버: 로그인 인증</li>
          </ul>
          <p>위탁받는 곳이 바뀌면 이 방침을 고쳐 알립니다.</p>
          <h2 className="h3">5. 이용자의 권리</h2>
          <ul style={ul}>
            <li>열람·정정: 프로필 페이지의 프로필 관리에서 직접 고칠 수 있습니다.</li>
            <li>삭제와 탈퇴: 운영 계정 프로필(@sidex)의 프로덕트에 논평으로 요청하면 지체 없이 처리합니다.</li>
          </ul>
          <h2 className="h3">6. 안전 조치</h2>
          <ul style={ul}>
            <li>사이트 전 구간을 HTTPS로 암호화해 주고받습니다.</li>
            <li>글쓰기·수정은 로그인 세션으로만 처리합니다.</li>
            <li>비밀번호를 저장하지 않으므로 비밀번호 유출이 일어날 수 없습니다.</li>
          </ul>
          <h2 className="h3">7. 14세 미만 아동</h2>
          <p>서비스는 만 14세 미만 아동의 이용을 받지 않습니다.</p>
          <h2 className="h3">8. 문의</h2>
          <p>개인정보 처리에 관한 문의는 운영 계정 프로필(@sidex)의 프로덕트에 논평으로 남겨 주세요.</p>
          <h2 className="h3">9. 개정</h2>
          <p>이 방침은 2026년 9월 15일부터 적용됩니다. 내용이 바뀔 때는 서비스 화면에 미리 공지합니다.</p>
        </div>
      </article>
    </main>
  );
}
