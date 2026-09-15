/* Planning map content. Two trees, each several levels deep:
   FLOW: the eight questions every service plan has to answer. Under each: the topics, under
         those the sub-topics and concrete options, with the questions a reader can hold this
         product against at every level. Compiled from Lean Canvas, Business Model Canvas, Value
         Proposition Canvas, JTBD, Opportunity Solution Tree, PRD conventions (요구사항·기능·정책·
         화면 정의서, IA, 플로우), Kano, RICE, AARRR, HEART, North Star, growth-loop literature,
         SaaS pricing taxonomies, onboarding pattern catalogues, retention playbooks.
   DOMAINS: for each Sidex category, the problem spaces and sub-spaces a product in it touches.
   Labels are editorial (ours), bilingual. Ids are derived from the English label so a maker's
   notes stay attached when wording changes. */
import type { Lang } from "./i18n";

export type Node = { ko: string; en: string; children?: Node[]; q?: [string, string][]; tags?: string[] };
const n = (ko: string, en: string, children?: Node[], q?: [string, string][], tags?: string[]): Node => ({ ko, en, children, q, tags });
const L = (...pairs: [string, string][]) => pairs.map(([ko, en]) => n(ko, en)); // leaf list

export const FLOW: Node[] = [
  // ───────────────────────── 1. 문제 ─────────────────────────
  n("문제", "Problem", [
    n("문제 정의 문장", "Problem statement", undefined, [["'누가, 어떤 상황에서, 무엇 때문에, 무엇을 못 한다'를 한 문장으로", "Who, in what situation, because of what, cannot do what: one sentence"], ["그 문장을 사용자에게 읽어 주면 고개를 끄덕이나", "Does the user nod when you read it to them"]]),
    n("페인 포인트", "Pain point", [
      n("시간 낭비", "Wasted time", L(["반복 작업", "Repetitive work"], ["기다림", "Waiting"], ["찾기·검색", "Finding things"], ["중복 입력", "Double entry"]), [["하루에 몇 분을 잃나", "Minutes lost per day"]]),
      n("돈 낭비", "Wasted money", L(["중복 결제", "Duplicate spend"], ["비싼 대안", "Expensive alternative"], ["기회비용", "Opportunity cost"])),
      n("불안·스트레스", "Anxiety and stress", L(["놓칠까 봐", "Fear of missing"], ["실수 걱정", "Fear of mistakes"], ["통제 상실", "Loss of control"])),
      n("정보 부족", "Missing information", L(["흩어진 정보", "Scattered info"], ["오래된 정보", "Stale info"], ["신뢰 못 할 정보", "Untrusted info"])),
      n("협업 마찰", "Collaboration friction", L(["누가 뭘 하는지 모름", "No visibility"], ["버전 충돌", "Version conflicts"], ["결정 지연", "Slow decisions"])),
      n("접근 장벽", "Access barrier", L(["비용", "Cost"], ["전문 지식", "Expertise"], ["기기·장소", "Device and place"], ["언어", "Language"])),
    ], [["지금 사용자가 참고 있는 불편은 무엇인가", "What are users putting up with today"], ["그 불편이 없어지면 무엇이 달라지나", "What changes if that pain disappears"]]),
    n("현재 대안", "Current alternatives", [
      n("수작업·우회", "Manual workarounds", L(["스프레드시트", "Spreadsheets"], ["메신저·이메일", "Chat and email"], ["메모·종이", "Notes and paper"], ["사람에게 부탁", "Asking someone"])),
      n("기존 제품", "Existing products", L(["범용 도구", "General tools"], ["전문 도구", "Specialist tools"], ["사내 시스템", "Internal systems"])),
      n("아무것도 안 함", "Doing nothing", L(["문제를 참음", "Tolerating it"], ["포기", "Giving up"]), [["아무것도 안 하는 사람이 가장 큰 경쟁자인가", "Is doing nothing the biggest competitor"]]),
      n("전환 비용", "Switching cost", L(["데이터 이전", "Data migration"], ["학습 비용", "Learning cost"], ["팀 설득", "Convincing the team"], ["계약·약정", "Contracts"])),
    ], [["이 프로덕트가 없을 때 사람들은 무엇으로 해결하나", "How do people solve it without this product"]]),
    n("빈도·강도", "Frequency and severity", [
      n("빈도", "Frequency", L(["하루 여러 번", "Several times a day"], ["매주", "Weekly"], ["매달", "Monthly"], ["드물게·중대", "Rare but critical"])),
      n("강도", "Severity", L(["불편", "Annoying"], ["비용 발생", "Costly"], ["일이 막힘", "Blocking"], ["법·안전 문제", "Legal or safety"])),
      n("영향 범위", "Blast radius", L(["개인", "One person"], ["팀", "A team"], ["조직 전체", "Whole organisation"], ["고객까지", "Their customers too"])),
    ], [["문제가 매일 생기나, 분기에 한 번 생기나", "Daily problem or once a quarter"], ["돈·시간·평판 중 무엇을 잃게 하나", "Does it cost money, time or reputation"]]),
    n("근본 원인", "Root cause", [
      n("5 Why", "Five whys", undefined, [["왜를 다섯 번 물었을 때 마지막 답은", "The answer after asking why five times"]]),
      n("원인 분류", "Cause type", L(["사람·습관", "People and habits"], ["도구 부재", "Missing tool"], ["프로세스", "Process"], ["정보 구조", "Information structure"], ["인센티브", "Incentives"])),
    ], [["증상이 아니라 원인은 무엇인가", "What is the cause behind the symptom"]]),
    n("왜 지금", "Why now", [
      n("기술 변화", "Technology shift", L(["AI·LLM", "AI and LLMs"], ["새 플랫폼·API", "New platform or API"], ["비용 하락", "Falling cost"], ["기기 보급", "Device adoption"])),
      n("행동 변화", "Behaviour shift", L(["원격·비동기", "Remote and async"], ["크리에이터 경제", "Creator economy"], ["구독 피로", "Subscription fatigue"], ["1인 창업", "Solo founders"])),
      n("규제·시장 변화", "Regulation and market shift", L(["법 개정", "New law"], ["플랫폼 정책", "Platform policy"], ["경쟁자 퇴장", "Competitor exit"], ["자금 흐름", "Capital flow"])),
    ], [["최근 무엇이 바뀌어 이 문제가 풀 만해졌나", "What changed recently that makes it solvable now"]]),
    n("시장 신호", "Market signal", [
      n("수요 신호", "Demand signals", L(["검색량", "Search volume"], ["커뮤니티 질문", "Community questions"], ["대기자 명단", "Waitlists"], ["직접 만든 해결책", "User-built hacks"])),
      n("공급 신호", "Supply signals", L(["유사 서비스 증가", "More similar products"], ["투자 유입", "Funding"], ["대기업 진입", "Incumbents entering"])),
      n("검증 방법", "Validation methods", L(["인터뷰", "Interviews"], ["랜딩 테스트", "Landing page test"], ["사전 판매", "Pre-sales"], ["컨시어지 MVP", "Concierge MVP"], ["오즈의 마법사", "Wizard of Oz"])),
    ], [["문제가 진짜라는 증거를 몇 개나 가졌나", "How many pieces of evidence say the problem is real"]]),
  ], undefined, ["Lean Canvas", "Opportunity Solution Tree", "5 Whys"]),

  // ───────────────────────── 2. 사용자 ─────────────────────────
  n("사용자", "User", [
    n("타깃 세그먼트", "Target segment", [
      n("분류 축", "Segmentation axes", L(["역할·직군", "Role"], ["회사 규모", "Company size"], ["산업", "Industry"], ["숙련도", "Skill level"], ["지역·언어", "Region and language"], ["기기", "Device"])),
      n("초기 사용자", "Early adopters", L(["가장 절실한 집단", "Most desperate group"], ["도달하기 쉬운 집단", "Easiest to reach"], ["말이 퍼지는 집단", "Most vocal"])),
      n("확장 경로", "Expansion path", L(["인접 세그먼트", "Adjacent segments"], ["팀 → 조직", "Team to org"], ["개인 → 팀", "Individual to team"])),
    ], [["첫 1,000명은 정확히 누구인가", "Who exactly are the first 1,000 users"]]),
    n("페르소나", "Persona", [
      n("프로필", "Profile", L(["목표", "Goals"], ["하루 흐름", "Daily routine"], ["쓰는 도구", "Tools used"], ["좌절 지점", "Frustrations"])),
      n("행동 특성", "Behaviours", L(["의사결정 방식", "How they decide"], ["정보 소스", "Information sources"], ["지불 의향", "Willingness to pay"])),
      n("안티 페르소나", "Anti-persona", undefined, [["일부러 겨냥하지 않는 사용자는", "Who are you deliberately not building for"]]),
    ], [["대표 사용자의 하루는 어떻게 흐르나", "What does the representative user's day look like"], ["이 사람이 쓰는 다른 도구는", "What other tools does this person use"]]),
    n("해야 할 일", "Jobs to be done", [
      n("기능적 일", "Functional job", undefined, [["끝내려는 실질적 과업은", "The practical task to finish"]]),
      n("감정적 일", "Emotional job", undefined, [["어떤 기분이 되고 싶은가", "How do they want to feel"]]),
      n("사회적 일", "Social job", undefined, [["남에게 어떻게 보이고 싶은가", "How do they want to be seen"]]),
      n("일의 단계", "Job steps", L(["정의", "Define"], ["준비", "Prepare"], ["실행", "Execute"], ["확인", "Confirm"], ["수정", "Modify"], ["마무리", "Conclude"])),
      n("고용·해고 요인", "Hire and fire forces", L(["현재의 불만(푸시)", "Push of the situation"], ["새 해결책의 매력(풀)", "Pull of the new"], ["변화 불안", "Anxiety of the new"], ["현재 습관", "Habit of the present"])),
    ], [["사용자가 이 프로덕트를 '고용'해 끝내려는 일은", "What job does the user hire this product to finish"]]),
    n("사용 맥락", "Context of use", [
      n("장소·기기", "Place and device", L(["책상", "Desk"], ["이동 중", "On the move"], ["현장", "In the field"], ["여러 기기 병행", "Multi-device"])),
      n("시간", "Time", L(["짧은 틈", "Short gaps"], ["집중 세션", "Deep sessions"], ["정해진 주기", "Fixed cadence"])),
      n("혼자·함께", "Solo or together", L(["혼자", "Alone"], ["짝", "Pairs"], ["팀", "Team"], ["외부 협업자", "External collaborators"])),
      n("주의 상태", "Attention state", L(["집중", "Focused"], ["멀티태스킹", "Multitasking"], ["급함", "In a hurry"])),
    ], [["어디서, 어떤 기기로, 얼마나 자주 쓰나", "Where, on which device, how often"], ["혼자 쓰나 팀이 같이 쓰나", "Solo use or with a team"]]),
    n("구매자·사용자", "Buyer and user", [
      n("역할", "Roles", L(["사용자", "User"], ["구매 결정자", "Decision maker"], ["예산 승인자", "Budget holder"], ["관리자", "Administrator"], ["반대자", "Blocker"])),
      n("도입 경로", "Adoption path", L(["개인 결제", "Individual purchase"], ["팀 도입", "Team adoption"], ["톱다운 도입", "Top-down rollout"], ["조달·보안 심사", "Procurement and security review"])),
    ], [["돈을 내는 사람과 쓰는 사람이 다른가", "Is the payer different from the user"]]),
    n("접근성", "Accessibility", L(["시각", "Vision"], ["청각", "Hearing"], ["운동", "Motor"], ["인지", "Cognitive"], ["언어·문해", "Language and literacy"], ["저사양 기기·느린 망", "Low-end devices and slow networks"]), [["시력·언어·기기 환경이 다른 사용자도 쓸 수 있나", "Can users with different sight, language or devices use it"]]),
    n("사용자 여정", "User journey", L(["인지", "Awareness"], ["탐색·비교", "Consideration"], ["가입", "Sign-up"], ["첫 사용", "First use"], ["습관", "Habit"], ["추천", "Advocacy"], ["이탈", "Churn"]), [["여정의 어느 단계에서 가장 많이 빠져나가나", "At which stage do most people fall out"], ["각 단계에서 사용자가 느끼는 감정은", "What does the user feel at each stage"]]),
    n("리서치 방법", "Research methods", L(["인터뷰", "Interviews"], ["설문", "Surveys"], ["관찰·섀도잉", "Observation"], ["다이어리 스터디", "Diary study"], ["사용성 테스트", "Usability test"], ["데이터 분석", "Analytics"], ["지원 문의 분석", "Support ticket mining"]), [["지난 한 달 실제 사용자와 몇 번 이야기했나", "How many real users did you talk to last month"]]),
  ], undefined, ["Value Proposition Canvas", "JTBD", "Persona", "Journey map"]),

  // ───────────────────────── 3. 가치 제안 ─────────────────────────
  n("가치", "Value", [
    n("한 줄 가치", "One-line value", [
      n("문장 구조", "Sentence structure", L(["누구를 위한", "For whom"], ["무엇을", "What"], ["어떻게 다르게", "How differently"], ["그래서 얻는 것", "So that"])),
      n("검증", "Testing it", L(["10초 이해 테스트", "Ten-second test"], ["랜딩 페이지 A/B", "Landing A/B"], ["엘리베이터 피치", "Elevator pitch"])),
    ], [["처음 보는 사람이 10초 안에 이해하나", "Does a stranger get it in ten seconds"]]),
    n("차별점", "Differentiation", [
      n("해자 유형", "Moat types", L(["네트워크 효과", "Network effects"], ["데이터 축적", "Data accumulation"], ["전환 비용", "Switching cost"], ["브랜드", "Brand"], ["규모의 경제", "Economies of scale"], ["독점 접근·파트너십", "Exclusive access"], ["실행 속도", "Speed of execution"])),
      n("차별 축", "Differentiation axes", L(["더 빠름", "Faster"], ["더 쌈", "Cheaper"], ["더 쉬움", "Simpler"], ["더 깊음", "Deeper"], ["더 좁게 특화", "Narrower focus"], ["통합", "Integrated"], ["감성·취향", "Taste"])),
    ], [["경쟁자가 쉽게 못 따라 하는 것은", "What can competitors not copy easily"]]),
    n("대안 대비", "Gain over alternatives", [
      n("이득 종류", "Gain types", L(["시간 절약", "Time saved"], ["비용 절감", "Money saved"], ["품질 향상", "Better quality"], ["위험 감소", "Less risk"], ["즐거움", "Delight"], ["지위", "Status"])),
      n("고통 완화", "Pain relievers", L(["실수 방지", "Prevents mistakes"], ["학습 불필요", "No learning curve"], ["자동화", "Automation"], ["한곳에 모음", "One place"])),
    ], [["바꿔 탈 만큼 큰 차이인가", "Is the difference big enough to switch"]]),
    n("포지셔닝", "Positioning", [
      n("시장 프레임", "Market frame", L(["기존 시장", "Existing market"], ["재정의된 시장", "Re-segmented market"], ["새 시장", "New market"])),
      n("비교 대상", "Reference point", L(["직접 경쟁자", "Direct competitor"], ["수작업", "Manual process"], ["다른 범주의 제품", "Different category"])),
      n("포지셔닝 문장", "Positioning statement", undefined, [["'X를 위한, Y와 달리 Z하는'으로 쓰면", "For X, unlike Y, we Z"]]),
    ], [["어떤 시장의 어떤 자리인가", "Which market, which slot"], ["비교 대상으로 무엇을 지목하나", "What do you position against"]]),
    n("하지 않는 것", "What it will not do", L(["뺀 기능", "Features left out"], ["안 겨냥하는 사용자", "Users not served"], ["안 들어가는 시장", "Markets avoided"], ["안 하는 방식", "Approaches rejected"]), [["의도적으로 뺀 기능은", "Which features are left out on purpose"], ["누구를 위한 서비스가 아닌가", "Who is it not for"]]),
    n("메시지 위계", "Message hierarchy", L(["헤드라인", "Headline"], ["서브 카피", "Subcopy"], ["증거", "Proof"], ["행동 요청", "Call to action"], ["반론 처리", "Objection handling"]), [["랜딩 첫 화면의 다섯 줄이 이 순서로 서 있나", "Do the first five lines of the landing page stand in this order"]]),
    n("브랜드 약속", "Brand promise", [
      n("성격", "Personality", L(["정확함", "Precise"], ["따뜻함", "Warm"], ["대담함", "Bold"], ["절제", "Restrained"], ["장난기", "Playful"])),
      n("약속의 증거", "Proof of promise", L(["응답 속도", "Response speed"], ["환불 정책", "Refund policy"], ["투명한 가격", "Transparent pricing"], ["공개 로드맵", "Public roadmap"])),
    ], [["사용자가 기대해도 되는 것은", "What can users always expect"], ["톤·이름·시각 언어가 그 약속과 맞나", "Do tone, name and visuals match the promise"]]),
  ], undefined, ["Value Proposition Canvas", "Positioning statement", "Blue Ocean"]),

  // ───────────────────────── 4. 핵심 기능 ─────────────────────────
  n("기능", "Solution", [
    n("MVP 범위", "MVP scope", [
      n("MVP 유형", "MVP types", L(["랜딩 페이지", "Landing page"], ["컨시어지", "Concierge"], ["오즈의 마법사", "Wizard of Oz"], ["단일 기능", "Single feature"], ["노코드 프로토타입", "No-code prototype"])),
      n("범위 결정", "Scoping", L(["필수", "Must"], ["있으면 좋음", "Should"], ["나중에", "Could"], ["안 함", "Won't"])),
      n("성공 기준", "Success criteria", undefined, [["MVP가 성공했다고 볼 숫자는", "The number that says the MVP worked"]]),
    ], [["가치를 증명하는 최소 기능 셋은", "Smallest feature set that proves the value"]]),
    n("핵심 루프", "Core loop", [
      n("루프 유형", "Loop types", L(["만들기 → 공유 → 반응", "Create, share, react"], ["기록 → 회고 → 계획", "Log, review, plan"], ["검색 → 저장 → 재방문", "Search, save, return"], ["질문 → 답 → 평가", "Ask, answer, rate"], ["거래 → 평가 → 재거래", "Trade, rate, trade again"])),
      n("루프 강화", "Strengthening the loop", L(["즉각 보상", "Immediate reward"], ["진행 표시", "Progress"], ["변동 보상", "Variable reward"], ["투자·축적", "Investment"])),
    ], [["사용자가 반복하는 기본 행동 하나는", "The one action users repeat"]]),
    n("기능 우선순위", "Feature priority", [
      n("Kano", "Kano", L(["당연 기능", "Basic"], ["성능 기능", "Performance"], ["감동 기능", "Delighter"], ["무관심", "Indifferent"], ["역효과", "Reverse"])),
      n("RICE", "RICE", L(["도달", "Reach"], ["영향", "Impact"], ["확신", "Confidence"], ["노력", "Effort"])),
      n("기타 기법", "Other methods", L(["MoSCoW", "MoSCoW"], ["기회 점수", "Opportunity scoring"], ["구매 기능 게임", "Buy a feature"], ["가중 점수표", "Weighted scoring"])),
    ], [["지금 백로그 맨 위 세 개는 왜 그 자리에 있나", "Why are the top three backlog items where they are"]]),
    n("정보 구조", "Information architecture", [
      n("구조 유형", "Structure types", L(["계층형", "Hierarchical"], ["순차형", "Sequential"], ["매트릭스", "Matrix"], ["데이터베이스형", "Database-driven"])),
      n("내비게이션", "Navigation", L(["전역 내비", "Global nav"], ["로컬 내비", "Local nav"], ["빵부스러기", "Breadcrumbs"], ["검색", "Search"], ["필터·정렬", "Filter and sort"], ["탭", "Tabs"])),
      n("레이블링", "Labelling", undefined, [["메뉴 이름이 사용자의 말인가", "Are menu names the user's words"]]),
      n("검증", "Validation", L(["카드 소팅", "Card sorting"], ["트리 테스트", "Tree testing"], ["첫 클릭 테스트", "First-click test"])),
    ], [["첫 화면에서 두 번 안에 닿는 것은", "What is two taps from the first screen"]]),
    n("사용자 흐름", "User flow", [
      n("핵심 흐름", "Key flows", L(["첫 방문", "First visit"], ["가입·로그인", "Sign-up and login"], ["핵심 작업", "Core task"], ["결제", "Checkout"], ["공유·초대", "Share and invite"], ["설정", "Settings"], ["탈퇴", "Leaving"])),
      n("흐름 문서", "Flow documents", L(["서비스 플로우", "Service flow"], ["플로우차트", "Flowchart"], ["화면 정의서", "Screen spec"], ["정책 정의서", "Policy spec"], ["요구사항 정의서", "Requirements"], ["와이어프레임", "Wireframes"])),
      n("이탈 지점", "Drop-off points", L(["가입 폼", "Sign-up form"], ["권한 요청", "Permission prompts"], ["결제 입력", "Payment entry"], ["빈 화면", "Empty screen"], ["느린 로딩", "Slow load"])),
    ], [["진입부터 목표 달성까지 몇 단계인가", "How many steps from entry to goal"]]),
    n("온보딩", "Onboarding", [
      n("패턴", "Patterns", L(["환영 화면", "Welcome"], ["설정 체크리스트", "Setup checklist"], ["제품 투어", "Product tour"], ["핫스팟·툴팁", "Hotspots and tooltips"], ["샘플 데이터", "Sample data"], ["점진적 공개", "Progressive disclosure"], ["가입 미루기", "Deferred sign-up"], ["템플릿 고르기", "Pick a template"], ["가져오기", "Import"])),
      n("빈 상태", "Empty states", L(["무엇이 생길지 설명", "Explain what will appear"], ["행동 하나 제안", "One clear action"], ["예시 보여 주기", "Show an example"])),
      n("활성화 순간", "Activation moment", undefined, [["첫 가치를 느끼기까지 걸리는 시간은", "Time to first value"], ["가입 후 '됐다'고 느끼는 행동은", "The action after sign-up that means it worked"]]),
      n("개인화", "Personalisation", L(["역할별 질문", "Role questions"], ["목표별 경로", "Goal-based paths"], ["동적 첫 화면", "Dynamic first screen"])),
    ], [["가입 후 첫 5분에 사용자가 하는 행동은", "What does the user do in the first five minutes"]]),
    n("엣지 케이스", "Edge cases", [
      n("데이터", "Data", L(["없음", "None"], ["너무 많음", "Too much"], ["너무 김", "Too long"], ["깨진 형식", "Malformed"], ["중복", "Duplicates"])),
      n("상태", "States", L(["로딩", "Loading"], ["오류", "Error"], ["오프라인", "Offline"], ["권한 없음", "No permission"], ["만료", "Expired"], ["동시 편집", "Concurrent edits"])),
      n("사용자", "Users", L(["신규", "New"], ["휴면", "Dormant"], ["탈퇴·삭제", "Deleted"], ["여러 계정", "Multiple accounts"], ["봇·남용", "Bots and abuse"])),
    ], [["데이터가 없을 때, 너무 많을 때, 실패했을 때 화면은", "No data, too much data, failure: what does the screen do"]]),
    n("알림", "Notifications", [
      n("채널", "Channels", L(["인앱", "In-app"], ["이메일", "Email"], ["푸시", "Push"], ["메신저 연동", "Chat integrations"])),
      n("규칙", "Rules", L(["무엇을 알릴지", "What to notify"], ["묶음·다이제스트", "Batching and digests"], ["끄기·빈도 설정", "Opt-out and frequency"], ["조용한 시간", "Quiet hours"])),
    ], [["알림 하나가 사용자의 시간을 뺏을 만큼 가치 있나", "Is each notification worth the user's interruption"], ["알림을 다 끄면 제품이 여전히 쓸모 있나", "Is the product still useful with every notification off"]]),
    n("기능 정의서", "Feature spec", L(["기능 ID", "Feature ID"], ["설명", "Description"], ["입력·출력", "Inputs and outputs"], ["정책·제한", "Rules and limits"], ["예외", "Exceptions"], ["우선순위", "Priority"], ["담당", "Owner"]), [["각 기능의 성공 조건과 예외가 적혀 있나", "Does each feature list its success condition and exceptions"]]),
  ], undefined, ["PRD", "Kano", "RICE", "User story map", "IA"]),

  // ───────────────────────── 5. 경험·디자인 ─────────────────────────
  n("경험", "Experience", [
    n("첫 인상", "First impression", [
      n("히어로", "Hero", L(["한 줄 약속", "One-line promise"], ["증거", "Proof"], ["행동 하나", "One action"], ["실제 화면", "Real screen"])),
      n("신뢰 신호", "Trust signals", L(["실사용 숫자", "Real numbers"], ["고객 로고", "Customer logos"], ["리뷰", "Reviews"], ["보안 표시", "Security marks"])),
      n("속도", "Speed", L(["첫 화면 1초", "First paint under a second"], ["스켈레톤", "Skeletons"], ["낙관적 업데이트", "Optimistic updates"])),
    ], [["아하 모먼트는 어느 화면에서 오나", "On which screen does the aha moment arrive"]]),
    n("정보 위계", "Visual hierarchy", [
      n("도구", "Tools", L(["크기", "Size"], ["굵기", "Weight"], ["여백", "Space"], ["색 대비", "Contrast"], ["정렬", "Alignment"], ["그룹핑", "Grouping"])),
      n("화면당 하나", "One thing per screen", undefined, [["화면마다 가장 중요한 것 하나가 분명한가", "Is the single most important thing clear on every screen"]]),
      n("스캔 패턴", "Scan patterns", L(["F 패턴", "F pattern"], ["Z 패턴", "Z pattern"], ["카드 그리드", "Card grid"], ["표", "Tables"])),
    ], [["눈을 가늘게 뜨고 봐도 위계가 남나", "Does the hierarchy survive a squint"]]),
    n("인터랙션·모션", "Interaction and motion", [
      n("피드백", "Feedback", L(["hover", "Hover"], ["press", "Press"], ["로딩", "Loading"], ["성공", "Success"], ["오류", "Error"], ["비활성", "Disabled"])),
      n("모션 용도", "Motion purpose", L(["상태 변화 설명", "Explain state change"], ["공간 관계", "Spatial relation"], ["주의 유도", "Draw attention"], ["브랜드 성격", "Brand character"])),
      n("모션 원칙", "Motion principles", L(["150~300ms", "150 to 300ms"], ["이징", "Easing"], ["reduced-motion 존중", "Respect reduced motion"], ["장식 금지", "No decoration"])),
      n("마이크로 인터랙션", "Micro-interactions", L(["토글", "Toggles"], ["좋아요", "Likes"], ["드래그", "Drag"], ["스와이프", "Swipe"], ["당겨서 새로고침", "Pull to refresh"])),
    ], [["움직임이 상태 변화를 설명하나, 장식인가", "Does motion explain state or decorate"]]),
    n("디자인 시스템", "Design system", [
      n("토큰", "Tokens", L(["색", "Colour"], ["서체", "Type"], ["간격", "Spacing"], ["모서리", "Radius"], ["그림자", "Elevation"], ["모션", "Motion"])),
      n("컴포넌트", "Components", L(["버튼", "Button"], ["입력", "Input"], ["카드", "Card"], ["칩·배지", "Chip and badge"], ["탭", "Tabs"], ["모달", "Modal"], ["토스트", "Toast"], ["표", "Table"], ["빈 상태", "Empty state"])),
      n("상태", "States", L(["기본", "Default"], ["hover", "Hover"], ["focus", "Focus"], ["active", "Active"], ["disabled", "Disabled"], ["error", "Error"], ["loading", "Loading"])),
      n("문서화", "Documentation", L(["DESIGN.md", "DESIGN.md"], ["사용 규칙", "Usage rules"], ["하지 말 것", "Don'ts"], ["코드 연결", "Code connect"])),
    ], [["색·서체·간격·모서리 토큰이 정해져 있나", "Are colour, type, spacing and radius tokens defined"]]),
    n("콘텐츠와 톤", "Content and tone", [
      n("UX 라이팅", "UX writing", L(["버튼 라벨", "Button labels"], ["오류 문구", "Error copy"], ["빈 상태 문구", "Empty state copy"], ["확인 대화", "Confirmations"], ["알림", "Notifications"])),
      n("톤 축", "Tone axes", L(["격식", "Formality"], ["유머", "Humour"], ["열정", "Enthusiasm"], ["존중", "Respect"])),
      n("용어집", "Glossary", undefined, [["같은 개념을 한 단어로 부르나", "Is each concept called one name everywhere"]]),
    ], [["버튼·오류·빈 상태 문구가 한 목소리인가", "Do buttons, errors and empty states speak in one voice"]]),
    n("접근성", "Accessibility", [
      n("기본 요건", "Basics", L(["대비 4.5:1", "Contrast 4.5:1"], ["포커스 링", "Focus ring"], ["대체 텍스트", "Alt text"], ["시맨틱 마크업", "Semantic markup"], ["44px 타깃", "44px targets"], ["키보드 완주", "Keyboard complete"])),
      n("보조 기술", "Assistive tech", L(["스크린 리더", "Screen readers"], ["확대", "Zoom"], ["음성 제어", "Voice control"], ["스위치", "Switch access"])),
    ], [["키보드만으로 끝까지 갈 수 있나", "Can it be completed with keyboard alone"]]),
    n("감정 곡선", "Emotional arc", L(["기대", "Anticipation"], ["첫 성공", "First win"], ["좌절 지점", "Frustration"], ["회복", "Recovery"], ["성취", "Achievement"], ["떠날 때", "Leaving"]), [["끝났을 때 어떤 기분으로 나가나", "How does the user feel leaving"]]),
    n("정직한 설계", "Honest design", L(["취소·해지가 가입만큼 쉬움", "Cancelling as easy as joining"], ["가격·수수료 선공개", "Prices and fees up front"], ["기본값이 사용자 편", "Defaults favour the user"], ["가짜 긴급·희소 없음", "No fake urgency or scarcity"], ["동의는 명시적으로", "Consent is explicit"]), [["사용자가 뒤늦게 알고 화낼 것이 있나", "Is there anything users would be angry to learn later"]]),
    n("반응형·플랫폼", "Responsive and platform", L(["데스크톱 우선", "Desktop first"], ["모바일 웹", "Mobile web"], ["네이티브 앱", "Native app"], ["브라우저 확장", "Browser extension"], ["CLI·API", "CLI and API"]), [["첫 버전은 어느 화면 크기 하나에 집중하나", "Which one screen size does the first version commit to"]]),
  ], undefined, ["Design system", "Nielsen heuristics", "WCAG", "UX writing"]),

  // ───────────────────────── 6. 비즈니스 ─────────────────────────
  n("비즈니스", "Business", [
    n("수익 모델", "Revenue model", [
      n("구독", "Subscription", L(["정액", "Flat rate"], ["좌석당", "Per seat"], ["활성 사용자당", "Per active user"], ["계층형", "Tiered"], ["기능별", "Feature-based"], ["연간 할인", "Annual discount"])),
      n("사용량 기반", "Usage-based", L(["API 호출", "API calls"], ["토큰·크레딧", "Tokens and credits"], ["저장 용량", "Storage"], ["선불 크레딧", "Prepaid credits"], ["성과 기반", "Outcome-based"])),
      n("프리미엄", "Freemium", L(["기능 제한", "Feature limits"], ["사용량 제한", "Usage caps"], ["좌석 제한", "Seat limits"], ["워터마크", "Watermark"]), [["무료에서 유료로 넘어가는 순간은", "The moment free becomes paid"]]),
      n("거래·중개", "Transaction and marketplace", L(["거래 수수료", "Take rate"], ["리스팅 비용", "Listing fees"], ["결제 수수료", "Payment fees"], ["에스크로", "Escrow"])),
      n("광고", "Advertising", L(["디스플레이", "Display"], ["스폰서 콘텐츠", "Sponsored content"], ["뉴스레터 광고", "Newsletter ads"], ["잡 보드", "Job board"])),
      n("라이선스·API", "Licensing and API", L(["API 요금", "API pricing"], ["화이트라벨", "White label"], ["데이터 판매", "Data licensing"], ["오픈코어", "Open core"])),
      n("일회성·기타", "One-time and other", L(["일회성 구매", "One-time purchase"], ["평생 라이선스", "Lifetime deal"], ["후원·팁", "Donations and tips"], ["굿즈", "Merch"], ["교육·컨설팅", "Training and consulting"])),
      n("하이브리드", "Hybrid", undefined, [["둘 이상을 섞는다면 어떤 조합인가", "If mixing models, which combination"]]),
    ], [["누가 언제 무엇에 돈을 내나", "Who pays, when, for what"]]),
    n("가격 정책", "Pricing", [
      n("가격 기준", "Pricing basis", L(["가치 기반", "Value-based"], ["원가 기반", "Cost-plus"], ["경쟁 기반", "Competitor-based"], ["침투 가격", "Penetration"], ["프리미엄 가격", "Premium"])),
      n("가격 축", "Value metric", L(["좌석", "Seats"], ["사용량", "Usage"], ["기능", "Features"], ["프로젝트 수", "Projects"], ["고객 수", "Customers"])),
      n("가격 페이지", "Pricing page", L(["3단 구성", "Three tiers"], ["추천 표시", "Recommended tier"], ["월·연 토글", "Monthly and yearly"], ["FAQ", "FAQ"], ["엔터프라이즈 문의", "Enterprise contact"])),
      n("실험", "Pricing experiments", L(["반 웨스텐도르프 설문", "Van Westendorp"], ["A/B", "A/B"], ["앵커링", "Anchoring"], ["할인 정책", "Discount policy"])),
    ], [["가치 기반인가 원가 기반인가", "Value-based or cost-based"], ["첫 유료 고객이 낸 금액은", "What did the first paying customer pay"]]),
    n("비용 구조", "Cost structure", [
      n("고정비", "Fixed costs", L(["인건비", "People"], ["도구·구독", "Tools"], ["사무실", "Office"])),
      n("변동비", "Variable costs", L(["서버·인프라", "Infrastructure"], ["AI 모델 호출", "Model calls"], ["결제 수수료", "Payment fees"], ["고객 지원", "Support"], ["획득 비용", "Acquisition"])),
      n("손익분기", "Break-even", undefined, [["몇 명이 내면 비용을 덮나", "How many payers cover the costs"]]),
    ], [["사용자 1명이 늘 때 드는 비용은", "Cost of one more user"]]),
    n("단위 경제", "Unit economics", L(["CAC", "CAC"], ["LTV", "LTV"], ["LTV/CAC", "LTV to CAC"], ["회수 기간", "Payback period"], ["매출총이익", "Gross margin"], ["ARPU", "ARPU"], ["해지율", "Churn"]), [["획득 비용(CAC)과 생애 가치(LTV)의 비율은", "CAC to LTV ratio"]]),
    n("시장 규모", "Market size", [
      n("TAM/SAM/SOM", "TAM, SAM, SOM", undefined, [["전체·접근 가능·확보 가능 시장은", "Total, serviceable, obtainable"]]),
      n("계산 방식", "Method", L(["하향식", "Top-down"], ["상향식", "Bottom-up"], ["비교법", "Comparables"])),
    ], [["상향식으로 세면 몇 명 × 얼마인가", "Bottom-up: how many × how much"]]),
    n("경쟁 구도", "Competition", [
      n("경쟁자 유형", "Competitor types", L(["직접", "Direct"], ["간접", "Indirect"], ["대체재", "Substitutes"], ["잠재적 진입자", "Potential entrants"])),
      n("분석 도구", "Analysis tools", L(["기능 비교표", "Feature matrix"], ["포지셔닝 맵", "Positioning map"], ["SWOT", "SWOT"], ["5 Forces", "Five forces"])),
      n("대응", "Response", L(["정면 승부", "Head-on"], ["틈새", "Niche"], ["보완·연동", "Complement"], ["가격", "Price"])),
    ], [["그들이 못 하는 것을 우리는 왜 할 수 있나", "Why can we do what they cannot"]]),
    n("파트너·채널", "Partners and channels", L(["플랫폼·앱스토어", "Platforms and app stores"], ["연동 파트너", "Integration partners"], ["리셀러·에이전시", "Resellers and agencies"], ["커뮤니티·크리에이터", "Communities and creators"], ["공급자", "Suppliers"]), [["플랫폼 의존이 리스크인가", "Is platform dependence a risk"]]),
    n("법인·자금", "Company and funding", L(["개인·법인", "Sole or company"], ["부트스트랩", "Bootstrapped"], ["투자 유치", "Fundraising"], ["지원사업·공모전", "Grants and contests"], ["지분·팀", "Equity and team"]), [["18개월을 버틸 돈은 어디서 오나", "Where does eighteen months of runway come from"]]),
  ], undefined, ["Business Model Canvas", "Lean Canvas", "Unit economics", "SaaS pricing"]),

  // ───────────────────────── 7. 성장 ─────────────────────────
  n("성장", "Growth", [
    n("획득", "Acquisition", [
      n("검색·SEO", "Search and SEO", L(["키워드", "Keywords"], ["프로그래매틱 페이지", "Programmatic pages"], ["기술 SEO", "Technical SEO"], ["AI 검색 노출", "AI search visibility"])),
      n("콘텐츠", "Content", L(["블로그", "Blog"], ["뉴스레터", "Newsletter"], ["영상", "Video"], ["무료 도구", "Free tools"], ["템플릿", "Templates"], ["오픈소스", "Open source"])),
      n("커뮤니티·소셜", "Community and social", L(["X·스레드", "X and Threads"], ["디스코드·슬랙", "Discord and Slack"], ["레딧·포럼", "Reddit and forums"], ["링크드인", "LinkedIn"], ["유튜브", "YouTube"])),
      n("런칭 채널", "Launch channels", L(["Product Hunt", "Product Hunt"], ["Hacker News", "Hacker News"], ["디스콰이엇·Sidex", "Disquiet and Sidex"], ["언론", "Press"])),
      n("유료", "Paid", L(["검색 광고", "Search ads"], ["소셜 광고", "Social ads"], ["스폰서십", "Sponsorships"], ["인플루언서", "Influencers"])),
      n("프로덕트 주도", "Product-led", L(["무료 플랜", "Free plan"], ["초대", "Invites"], ["공유 산출물", "Shared outputs"], ["임베드·배지", "Embeds and badges"])),
      n("파트너·세일즈", "Partners and sales", L(["연동 마켓플레이스", "Integration marketplaces"], ["아웃바운드", "Outbound"], ["추천 파트너", "Referral partners"])),
    ], [["첫 사용자는 어느 채널에서 오나", "Which channel brings the first users"]]),
    n("활성화", "Activation", [
      n("활성화 지표", "Activation metric", undefined, [["'됐다'를 뜻하는 행동과 도달률은", "The action that means it worked, and the share reaching it"]]),
      n("마찰 제거", "Removing friction", L(["가입 단계 줄이기", "Fewer sign-up steps"], ["소셜 로그인", "Social login"], ["가입 미루기", "Deferred sign-up"], ["기본값 채우기", "Smart defaults"], ["가져오기", "Import"])),
      n("가치 앞당기기", "Faster value", L(["샘플 데이터", "Sample data"], ["템플릿", "Templates"], ["AI 초안", "AI drafts"], ["즉시 결과", "Instant result"])),
    ], [["가입한 사람 중 몇 %가 '됐다'까지 가나", "What share of sign-ups reach the moment it worked"]]),
    n("리텐션", "Retention", [
      n("습관 루프", "Habit loop", L(["트리거", "Trigger"], ["행동", "Action"], ["보상", "Reward"], ["투자", "Investment"])),
      n("돌아올 이유", "Reasons to return", L(["새 콘텐츠", "New content"], ["남의 반응", "Others' responses"], ["쌓인 기록", "Accumulated data"], ["정기 리포트", "Periodic reports"], ["할 일 남음", "Unfinished work"])),
      n("메시징", "Messaging", L(["이메일", "Email"], ["푸시", "Push"], ["인앱", "In-app"], ["다이제스트", "Digest"], ["휴면 재유입", "Win-back"])),
      n("측정", "Measurement", L(["D1/D7/D30", "D1, D7, D30"], ["코호트 곡선", "Cohort curves"], ["평탄화 지점", "Where it flattens"], ["이탈 신호", "Churn signals"])),
    ], [["돌아올 이유가 제품 안에 있나, 알림뿐인가", "Is the reason to return inside the product or only notifications"]]),
    n("추천", "Referral", [
      n("루프 유형", "Loop types", L(["초대", "Invitations"], ["공유 산출물", "Shared outputs"], ["협업 필요", "Needs collaborators"], ["공개 프로필", "Public profiles"], ["임베드", "Embeds"], ["추천 보상", "Referral rewards"])),
      n("계수", "Coefficients", L(["K 계수", "K factor"], ["초대율", "Invite rate"], ["수락률", "Accept rate"], ["주기", "Cycle time"])),
    ], [["공유하면 보내는 쪽과 받는 쪽 모두 이득이 있나", "Does sharing reward both sender and receiver"]]),
    n("수익화 지표", "Revenue metrics", L(["전환율", "Conversion"], ["ARPU", "ARPU"], ["MRR·ARR", "MRR and ARR"], ["확장 매출", "Expansion"], ["해지·다운그레이드", "Churn and downgrade"], ["순매출 유지율", "Net revenue retention"]), [["업그레이드를 부르는 순간은", "What moment triggers an upgrade"]]),
    n("북극성 지표", "North star metric", [
      n("후보", "Candidates", L(["주간 활성 팀", "Weekly active teams"], ["완료된 작업 수", "Tasks completed"], ["게시된 산출물", "Published outputs"], ["거래액", "Transaction volume"], ["재방문 사용자", "Returning users"])),
      n("입력 지표", "Input metrics", undefined, [["그 숫자를 움직이는 입력 지표는", "Which input metrics move it"]]),
      n("HEART", "HEART", L(["행복", "Happiness"], ["참여", "Engagement"], ["채택", "Adoption"], ["유지", "Retention"], ["과제 성공", "Task success"])),
    ], [["가치 전달을 가장 잘 대표하는 숫자 하나는", "The one number that best represents delivered value"]]),
    n("실험", "Experiments", [
      n("가설 쓰기", "Hypothesis", undefined, [["'우리는 X를 믿는다. Y를 하면 Z가 될 것이다'", "We believe X; if we do Y, Z will happen"]]),
      n("방법", "Methods", L(["A/B 테스트", "A/B test"], ["가짜 문 테스트", "Fake door"], ["설문", "Survey"], ["인터뷰", "Interview"], ["코호트 비교", "Cohort comparison"])),
      n("판단", "Decision", L(["성공 기준", "Success criterion"], ["표본 크기", "Sample size"], ["기간", "Duration"], ["중단 규칙", "Stop rule"])),
    ], [["가장 위험한 가정은 무엇이고 어떻게 검증하나", "Riskiest assumption and how to test it"]]),
    n("계측", "Instrumentation", [
      n("이벤트 설계", "Event design", L(["핵심 행동 5개", "Five core actions"], ["이름 규칙", "Naming rules"], ["속성", "Properties"])),
      n("도구", "Tools", L(["제품 분석", "Product analytics"], ["세션 리플레이", "Session replay"], ["대시보드", "Dashboards"])),
      n("개인정보", "Privacy", L(["동의", "Consent"], ["익명화", "Anonymisation"], ["보관 기간", "Retention"])),
    ], [["북극성 지표를 지금 당장 숫자로 볼 수 있나", "Can you see the north star metric as a number right now"], ["퍼널의 각 단계가 이벤트로 잡히나", "Is every funnel step an event"]]),
    n("출시 계획", "Go-to-market", [
      n("출시 전", "Before launch", L(["대기자 명단", "Waitlist"], ["베타 사용자", "Beta users"], ["랜딩·데모", "Landing and demo"], ["에셋 준비", "Assets"])),
      n("출시일", "Launch day", L(["발표 채널", "Announcement channels"], ["응답 계획", "Response plan"], ["장애 대비", "Incident readiness"])),
      n("출시 후", "After launch", L(["첫 2주 목표", "First two weeks"], ["피드백 수집", "Feedback intake"], ["회고", "Retro"])),
    ], [["어디에 먼저 알리나 (커뮤니티·프레스·런칭 사이트)", "Where to announce first: community, press, launch sites"], ["출시 뒤 첫 2주의 목표는", "Goal for the first two weeks after launch"]]),
  ], undefined, ["AARRR", "HEART", "North Star", "Growth loops", "Hooked"]),

  // ───────────────────────── 8. 시스템·운영 ─────────────────────────
  n("시스템", "System", [
    n("기술 스택", "Tech stack", [
      n("프론트엔드", "Frontend", L(["프레임워크", "Framework"], ["스타일링", "Styling"], ["상태 관리", "State"], ["빌드·배포", "Build and deploy"])),
      n("백엔드", "Backend", L(["런타임", "Runtime"], ["API 스타일", "API style"], ["백그라운드 작업", "Background jobs"], ["캐시", "Cache"])),
      n("선택 기준", "Choosing", L(["팀 숙련도", "Team fluency"], ["생태계", "Ecosystem"], ["비용", "Cost"], ["채용", "Hiring"], ["락인 위험", "Lock-in"])),
    ], [["팀이 가장 빨리 만드는 도구를 골랐나", "Did the team pick what it ships fastest with"], ["3년 뒤에도 유지 가능한가", "Maintainable three years out"]]),
    n("데이터 모델", "Data model", [
      n("핵심 객체", "Core objects", undefined, [["핵심 객체와 관계는", "Core objects and relations"]]),
      n("규칙", "Rules", L(["소유권", "Ownership"], ["유일성", "Uniqueness"], ["이력·감사", "History and audit"], ["소프트 삭제", "Soft delete"], ["보존 기간", "Retention"])),
      n("저장소", "Storage", L(["관계형", "Relational"], ["문서형", "Document"], ["검색 인덱스", "Search index"], ["파일·미디어", "Files and media"], ["벡터", "Vectors"])),
    ], [["삭제·수정·이력은 어떻게 다루나", "Delete, edit, history"]]),
    n("인증·권한", "Auth and permissions", [
      n("인증 방식", "Authentication", L(["소셜 로그인", "Social login"], ["이메일 링크", "Magic link"], ["비밀번호", "Password"], ["SSO", "SSO"], ["2단계 인증", "2FA"], ["API 키", "API keys"])),
      n("권한 모델", "Authorisation", L(["역할 기반", "Role-based"], ["소유자·멤버·게스트", "Owner, member, guest"], ["워크스페이스", "Workspaces"], ["공유 링크", "Share links"], ["공개·비공개", "Public or private"])),
      n("계정 수명", "Account lifecycle", L(["초대", "Invite"], ["이전", "Transfer"], ["휴면", "Dormant"], ["탈퇴·삭제", "Deletion"])),
    ], [["누가 무엇을 볼 수 있고 바꿀 수 있나", "Who can see and change what"], ["탈퇴하면 그 사람의 글은 어떻게 되나", "What happens to a leaver's content"]]),
    n("외부 연동", "Integrations", [
      n("유형", "Types", L(["가져오기·내보내기", "Import and export"], ["웹훅", "Webhooks"], ["공개 API", "Public API"], ["OAuth 앱", "OAuth apps"], ["플러그인·MCP", "Plugins and MCP"], ["임베드", "Embeds"])),
      n("의존성", "Dependencies", L(["결제", "Payments"], ["이메일·SMS", "Email and SMS"], ["지도", "Maps"], ["AI 모델", "AI models"], ["파일 저장소", "File storage"], ["분석", "Analytics"])),
      n("장애 대비", "Failure handling", undefined, [["연동이 끊기면 제품이 멈추나", "Does the product stop if an integration breaks"]]),
      n("데이터 이동", "Data portability", L(["가져오기", "Import"], ["내보내기", "Export"], ["경쟁 제품에서 이전", "Migration from competitors"], ["탈퇴 시 반출", "Take-out on leaving"]), [["사용자가 자기 데이터를 들고 나갈 수 있나", "Can users leave with their own data"]]),
    ], [["어떤 API와 데이터를 주고받나", "Which APIs and data go in and out"]]),
    n("보안·개인정보", "Security and privacy", [
      n("데이터", "Data", L(["수집 최소화", "Minimise collection"], ["암호화", "Encryption"], ["보관 기간", "Retention period"], ["삭제 요청", "Deletion requests"], ["내보내기", "Export"])),
      n("접근", "Access", L(["최소 권한", "Least privilege"], ["감사 로그", "Audit logs"], ["비밀 관리", "Secrets"], ["세션 만료", "Session expiry"])),
      n("취약점", "Vulnerabilities", L(["입력 검증", "Input validation"], ["인젝션", "Injection"], ["CSRF·XSS", "CSRF and XSS"], ["SSRF", "SSRF"], ["의존성 취약점", "Dependency CVEs"], ["레이트 리밋", "Rate limits"])),
      n("법규", "Regulation", L(["개인정보처리방침", "Privacy policy"], ["동의", "Consent"], ["국외 이전", "Cross-border transfer"], ["아동", "Minors"])),
    ], [["어떤 개인정보를 왜 얼마나 오래 보관하나", "Which personal data, why, for how long"]]),
    n("신뢰와 안전", "Trust and safety", [
      n("남용 유형", "Abuse types", L(["스팸", "Spam"], ["괴롭힘", "Harassment"], ["사기", "Fraud"], ["저작권", "Copyright"], ["봇", "Bots"], ["가짜 리뷰", "Fake reviews"])),
      n("대응", "Controls", L(["신고", "Reporting"], ["모더레이션 큐", "Moderation queue"], ["자동 필터", "Automatic filters"], ["제재 단계", "Sanction ladder"], ["이의 제기", "Appeals"])),
      n("커뮤니티 규칙", "Community rules", undefined, [["무엇이 허용되고 무엇이 안 되는지 적혀 있나", "Is what is and is not allowed written down"]]),
    ], [["스팸·남용·괴롭힘을 어떻게 막나", "How are spam, abuse and harassment handled"]]),
    n("확장·비용", "Scale and cost", [
      n("병목", "Bottlenecks", L(["데이터베이스", "Database"], ["외부 API 한도", "External API limits"], ["미디어 처리", "Media processing"], ["실시간 연결", "Real-time connections"])),
      n("전략", "Strategies", L(["캐시", "Caching"], ["큐", "Queues"], ["CDN", "CDN"], ["읽기 복제", "Read replicas"], ["요금 상한", "Spend caps"])),
      n("가장 비싼 요청", "Most expensive request", undefined, [["가장 비싼 요청은", "The most expensive request"]]),
    ], [["10배 트래픽에서 무엇이 먼저 무너지나", "What breaks first at 10× traffic"]]),
    n("운영·지원", "Operations and support", [
      n("지원 채널", "Support channels", L(["이메일", "Email"], ["인앱 채팅", "In-app chat"], ["커뮤니티", "Community"], ["문서·FAQ", "Docs and FAQ"], ["도우미 봇", "Assistant bot"])),
      n("관측", "Observability", L(["로그", "Logs"], ["지표", "Metrics"], ["에러 추적", "Error tracking"], ["알림", "Alerts"], ["상태 페이지", "Status page"])),
      n("장애 대응", "Incidents", L(["온콜", "On-call"], ["런북", "Runbooks"], ["사후 분석", "Post-mortems"], ["사용자 공지", "User notice"])),
      n("릴리스", "Releases", L(["배포 주기", "Cadence"], ["기능 플래그", "Feature flags"], ["롤백", "Rollback"], ["변경 로그", "Changelog"])),
    ], [["문의는 어디로 오고 누가 답하나", "Where do questions arrive and who answers"], ["장애 때 사용자에게 어떻게 알리나", "How are users told during an outage"]]),
    n("국제화", "Internationalisation", L(["언어·번역", "Languages and translation"], ["시간대·날짜", "Time zones and dates"], ["통화·결제 수단", "Currencies and payment methods"], ["법적 차이", "Legal differences"], ["문화·톤", "Culture and tone"]), [["한국 밖 사용자가 오면 처음 깨지는 것은", "What breaks first when a user outside Korea arrives"]]),
    n("리스크", "Risk", [
      n("문서", "Documents", L(["이용약관", "Terms"], ["개인정보처리방침", "Privacy policy"], ["환불 정책", "Refund policy"], ["쿠키 고지", "Cookie notice"])),
      n("의존 리스크", "Dependency risks", L(["플랫폼 정책 변경", "Platform policy change"], ["API 가격 인상", "API price increase"], ["단일 공급자", "Single vendor"], ["핵심 인력", "Key person"])),
      n("업종 규제", "Sector rules", L(["결제·금융", "Payments and finance"], ["의료", "Health"], ["아동", "Minors"], ["통신·마케팅", "Marketing messages"], ["저작권·AI 생성물", "Copyright and AI output"])),
    ], [["플랫폼 정책이 바뀌면 어떻게 되나", "What if a platform policy changes"]]),
  ], undefined, ["Architecture", "Threat model", "Runbook", "OWASP"]),
];

export const DOMAINS: Record<string, Node[]> = {
  productivity: [
    n("노트·문서", "Notes and docs", [
      n("개인 노트", "Personal notes", L(["빠른 캡처", "Quick capture"], ["일간 노트", "Daily notes"], ["음성 메모", "Voice memos"], ["클리핑", "Web clipping"])),
      n("팀 위키", "Team wiki", L(["온보딩 문서", "Onboarding docs"], ["결정 기록", "Decision records"], ["런북", "Runbooks"], ["정책", "Policies"])),
      n("문서 협업", "Doc collaboration", L(["동시 편집", "Real-time editing"], ["코멘트·제안", "Comments and suggestions"], ["버전 이력", "Version history"], ["승인 흐름", "Approvals"])),
      n("템플릿", "Templates", L(["회의록", "Meeting notes"], ["프로젝트 킥오프", "Project kickoff"], ["주간 리뷰", "Weekly review"], ["OKR", "OKR"])),
      n("편집기", "Editor", L(["마크다운", "Markdown"], ["블록 편집", "Block editor"], ["표·임베드", "Tables and embeds"], ["수식·코드", "Math and code"])),
    ]),
    n("할 일·계획", "Tasks and planning", [
      n("할 일 관리", "To-do", L(["GTD", "GTD"], ["우선순위", "Prioritisation"], ["반복 작업", "Recurring tasks"], ["마감·알림", "Deadlines and reminders"])),
      n("칸반·보드", "Kanban and boards", L(["열·상태", "Columns and states"], ["WIP 제한", "WIP limits"], ["스윔레인", "Swimlanes"])),
      n("캘린더", "Calendar", L(["시간 블록", "Time blocking"], ["일정 공유", "Shared schedules"], ["예약 링크", "Booking links"])),
      n("습관·루틴", "Habits and routines", L(["스트릭", "Streaks"], ["체크인", "Check-ins"], ["회고", "Reflection"])),
      n("시간 추적", "Time tracking", L(["타이머", "Timers"], ["청구 시간", "Billable hours"], ["리포트", "Reports"])),
    ]),
    n("지식 관리", "Knowledge management", [
      n("세컨드 브레인", "Second brain", L(["PARA", "PARA"], ["제텔카스텐", "Zettelkasten"], ["백링크", "Backlinks"], ["그래프 뷰", "Graph view"])),
      n("수집", "Capture", L(["북마크", "Bookmarks"], ["읽기 목록", "Read later"], ["하이라이트", "Highlights"], ["RSS", "RSS"])),
      n("검색·회상", "Search and recall", L(["전문 검색", "Full-text search"], ["시맨틱 검색", "Semantic search"], ["요약", "Summaries"], ["복습", "Spaced review"])),
    ]),
    n("프로젝트 관리", "Project management", [
      n("이슈 트래킹", "Issue tracking", L(["백로그", "Backlog"], ["라벨·우선순위", "Labels and priority"], ["담당·마감", "Assignee and due"], ["의존성", "Dependencies"])),
      n("계획", "Planning", L(["로드맵", "Roadmap"], ["스프린트", "Sprints"], ["마일스톤", "Milestones"], ["간트", "Gantt"])),
      n("목표", "Goals", L(["OKR", "OKR"], ["KPI 대시보드", "KPI dashboards"], ["진행률", "Progress"])),
      n("리소스", "Resourcing", L(["업무량", "Workload"], ["예산", "Budget"], ["타임라인", "Timeline"])),
    ]),
    n("자동화", "Automation", [
      n("워크플로", "Workflows", L(["트리거·액션", "Triggers and actions"], ["조건 분기", "Conditions"], ["승인 단계", "Approval steps"])),
      n("연동", "Integrations", L(["앱 연결", "App connectors"], ["웹훅", "Webhooks"], ["API", "API"])),
      n("AI 자동화", "AI automation", L(["요약", "Summaries"], ["분류", "Classification"], ["초안 작성", "Drafting"], ["에이전트 작업", "Agent tasks"])),
    ]),
    n("회의·커뮤니케이션", "Meetings and communication", [
      n("회의", "Meetings", L(["안건", "Agendas"], ["회의록·녹취", "Notes and transcripts"], ["액션 아이템", "Action items"])),
      n("일정 조율", "Scheduling", L(["가능 시간 공유", "Availability"], ["예약 페이지", "Booking pages"], ["시간대", "Time zones"])),
      n("비동기", "Async", L(["영상 메시지", "Video messages"], ["업데이트 스레드", "Update threads"], ["결정 로그", "Decision logs"])),
    ]),
    n("데이터베이스·표", "Databases and tables", [
      n("스프레드시트", "Spreadsheets", L(["수식", "Formulas"], ["피벗", "Pivots"], ["가져오기", "Imports"])),
      n("관계형 뷰", "Relational views", L(["표·보드·캘린더", "Table, board, calendar"], ["관계·롤업", "Relations and rollups"], ["필터·정렬", "Filters and sorts"])),
      n("폼·수집", "Forms and intake", L(["설문", "Surveys"], ["신청서", "Applications"], ["피드백 폼", "Feedback forms"])),
      n("대시보드", "Dashboards", L(["차트", "Charts"], ["KPI 카드", "KPI cards"], ["공유·임베드", "Sharing and embeds"])),
    ]),
    n("개인 생산성", "Personal productivity", L(["집중 타이머", "Focus timer"], ["방해 차단", "Distraction blocking"], ["저널", "Journal"], ["목표", "Goals"], ["독서 기록", "Reading log"], ["클립보드·스니펫", "Clipboard and snippets"], ["단축키·런처", "Shortcuts and launchers"])),
    n("AI 보조", "AI assistance", L(["문서 질의응답", "Q&A over docs"], ["회의 요약", "Meeting summaries"], ["글쓰기 보조", "Writing help"], ["작업 자동 생성", "Task generation"], ["개인 비서", "Personal assistant"])),
  ],
  engineering: [
    n("개발 도구", "Developer tools", [
      n("편집기·IDE", "Editors and IDEs", L(["확장", "Extensions"], ["원격 개발", "Remote dev"], ["AI 자동완성", "AI completion"])),
      n("CLI·터미널", "CLI and terminal", L(["스캐폴딩", "Scaffolding"], ["작업 실행", "Task runners"], ["셸 도구", "Shell tools"])),
      n("코드 리뷰", "Code review", L(["PR 워크플로", "PR workflow"], ["자동 리뷰", "Automated review"], ["코드 오너", "Code owners"])),
      n("품질 도구", "Quality tools", L(["린트·포맷", "Lint and format"], ["타입 검사", "Type checking"], ["정적 분석", "Static analysis"])),
      n("디버깅", "Debugging", L(["로컬 디버거", "Local debugger"], ["재현 환경", "Repro environments"], ["프로파일링", "Profiling"])),
    ]),
    n("배포·인프라", "Deploy and infrastructure", [
      n("호스팅", "Hosting", L(["정적·프론트", "Static and frontend"], ["서버리스", "Serverless"], ["컨테이너", "Containers"], ["VPS", "VPS"], ["엣지", "Edge"])),
      n("CI/CD", "CI/CD", L(["파이프라인", "Pipelines"], ["프리뷰 배포", "Preview deploys"], ["릴리스 자동화", "Release automation"])),
      n("환경·설정", "Environments and config", L(["환경 변수·비밀", "Env and secrets"], ["기능 플래그", "Feature flags"], ["IaC", "Infrastructure as code"])),
      n("도메인·네트워크", "Domains and network", L(["DNS", "DNS"], ["SSL", "SSL"], ["CDN", "CDN"], ["방화벽", "Firewall"])),
    ]),
    n("데이터·백엔드", "Data and backend", [
      n("데이터베이스", "Databases", L(["Postgres·MySQL", "Postgres and MySQL"], ["문서형", "Document"], ["키-값·캐시", "Key-value and cache"], ["시계열", "Time series"], ["벡터", "Vector"])),
      n("인증", "Auth", L(["소셜 로그인", "Social login"], ["세션·토큰", "Sessions and tokens"], ["권한", "Permissions"], ["SSO", "SSO"])),
      n("API", "APIs", L(["REST", "REST"], ["GraphQL", "GraphQL"], ["실시간", "Real-time"], ["게이트웨이·레이트 리밋", "Gateway and rate limits"])),
      n("비동기 처리", "Async processing", L(["큐", "Queues"], ["스케줄러", "Schedulers"], ["이벤트", "Events"], ["웹훅", "Webhooks"])),
      n("검색", "Search", L(["전문 검색", "Full-text"], ["인덱싱", "Indexing"], ["추천", "Recommendation"])),
    ]),
    n("관측·품질", "Observability and quality", [
      n("모니터링", "Monitoring", L(["로그", "Logs"], ["지표", "Metrics"], ["트레이스", "Traces"], ["알림", "Alerts"], ["상태 페이지", "Status pages"])),
      n("에러 추적", "Error tracking", L(["크래시 리포트", "Crash reports"], ["세션 리플레이", "Session replay"], ["소스맵", "Source maps"])),
      n("테스트", "Testing", L(["단위", "Unit"], ["통합", "Integration"], ["E2E", "End-to-end"], ["부하", "Load"], ["시각 회귀", "Visual regression"])),
      n("성능", "Performance", L(["웹 바이탈", "Web vitals"], ["번들 크기", "Bundle size"], ["쿼리 최적화", "Query optimisation"])),
      n("보안", "Security", L(["의존성 스캔", "Dependency scanning"], ["시크릿 탐지", "Secret detection"], ["침투 테스트", "Pen testing"])),
    ]),
    n("협업", "Collaboration", L(["버전 관리", "Version control"], ["이슈·PR", "Issues and PRs"], ["문서화", "Documentation"], ["온콜", "On-call"], ["변경 로그", "Changelogs"], ["설계 문서", "Design docs"], ["API 문서·SDK", "API docs and SDKs"])),
    n("AI 코딩", "AI coding", L(["코드 생성", "Code generation"], ["에이전트 코딩", "Agentic coding"], ["코드 검색·설명", "Code search and explanation"], ["리뷰 자동화", "Automated review"], ["테스트 생성", "Test generation"], ["마이그레이션", "Migrations"])),
    n("노코드·로우코드", "No-code and low-code", L(["사이트 빌더", "Site builders"], ["앱 빌더", "App builders"], ["자동화 빌더", "Automation builders"], ["내부 도구", "Internal tools"], ["폼·DB 도구", "Forms and DB tools"])),
    n("학습·커뮤니티", "Learning and community", L(["튜토리얼", "Tutorials"], ["코딩 문제", "Practice problems"], ["오픈소스", "Open source"], ["기술 블로그", "Tech blogs"], ["스터디", "Study groups"])),
  ],
  llm: [
    n("모델·API", "Models and APIs", [
      n("호출", "Calling models", L(["채팅 API", "Chat APIs"], ["스트리밍", "Streaming"], ["구조화 출력", "Structured output"], ["함수 호출", "Function calling"])),
      n("커스터마이즈", "Customisation", L(["파인튜닝", "Fine-tuning"], ["시스템 프롬프트", "System prompts"], ["프롬프트 캐싱", "Prompt caching"])),
      n("멀티모달", "Multimodal", L(["이미지 입력", "Image input"], ["음성", "Voice"], ["영상", "Video"], ["문서", "Documents"])),
      n("배포", "Serving", L(["오픈 웨이트", "Open weights"], ["온디바이스", "On-device"], ["라우팅", "Model routing"])),
    ]),
    n("프롬프트·워크플로", "Prompts and workflows", L(["프롬프트 관리", "Prompt management"], ["체이닝", "Chaining"], ["템플릿 라이브러리", "Prompt libraries"], ["평가 세트", "Eval sets"], ["버전 관리", "Versioning"])),
    n("검색 증강", "Retrieval", [
      n("데이터 준비", "Data preparation", L(["파싱", "Parsing"], ["청킹", "Chunking"], ["임베딩", "Embeddings"], ["메타데이터", "Metadata"])),
      n("검색", "Retrieval", L(["벡터 DB", "Vector DB"], ["하이브리드 검색", "Hybrid search"], ["리랭킹", "Re-ranking"])),
      n("응답", "Answering", L(["인용·근거", "Citations"], ["환각 방지", "Grounding"], ["문서 질의응답", "Doc Q&A"])),
    ]),
    n("대화형 앱", "Conversational apps", L(["챗봇", "Chatbots"], ["고객 지원 봇", "Support bots"], ["튜터", "Tutors"], ["컴패니언", "Companions"], ["음성 비서", "Voice assistants"], ["인터뷰·코칭", "Interview and coaching"])),
    n("콘텐츠 생성", "Content generation", [
      n("텍스트", "Text", L(["글쓰기", "Writing"], ["번역", "Translation"], ["요약", "Summaries"], ["카피", "Copy"])),
      n("이미지", "Images", L(["생성", "Generation"], ["편집", "Editing"], ["업스케일", "Upscaling"], ["배경 제거", "Background removal"])),
      n("음성·영상", "Voice and video", L(["TTS", "TTS"], ["더빙", "Dubbing"], ["영상 생성", "Video generation"], ["아바타", "Avatars"])),
      n("코드·데이터", "Code and data", L(["코드 생성", "Code generation"], ["SQL 생성", "Text to SQL"], ["차트", "Charts"])),
    ]),
    n("운영·안전", "Ops and safety", L(["가드레일", "Guardrails"], ["비용 최적화", "Cost control"], ["관측·트레이스", "Observability"], ["개인정보", "Privacy"], ["환각 대응", "Hallucination handling"], ["레드팀", "Red teaming"])),
    n("개인화·메모리", "Personalisation and memory", L(["장기 기억", "Long-term memory"], ["사용자 프로필", "User profiles"], ["추천", "Recommendation"], ["맥락 주입", "Context injection"])),
  ],
  marketing: [
    n("획득 채널", "Acquisition channels", [
      n("검색", "Search", L(["SEO", "SEO"], ["검색 광고", "Search ads"], ["AI 검색 최적화", "AI search"])),
      n("콘텐츠", "Content", L(["블로그", "Blog"], ["영상", "Video"], ["팟캐스트", "Podcast"], ["무료 도구", "Free tools"])),
      n("소셜", "Social", L(["숏폼", "Short-form"], ["커뮤니티 운영", "Community management"], ["인플루언서", "Influencers"])),
      n("광고 운영", "Ads operations", L(["소재 제작", "Creatives"], ["타깃팅", "Targeting"], ["입찰·예산", "Bidding and budget"])),
    ]),
    n("전환·CRO", "Conversion", L(["랜딩 페이지", "Landing pages"], ["A/B 테스트", "A/B testing"], ["폼·리드", "Forms and leads"], ["가격 페이지", "Pricing pages"], ["팝업·배너", "Popups"], ["사회적 증거", "Social proof"])),
    n("CRM·이메일", "CRM and email", L(["이메일 시퀀스", "Email sequences"], ["뉴스레터", "Newsletters"], ["세그먼트", "Segments"], ["라이프사이클", "Lifecycle"], ["SMS·푸시", "SMS and push"], ["딜리버리", "Deliverability"])),
    n("분석", "Analytics", L(["어트리뷰션", "Attribution"], ["퍼널", "Funnels"], ["대시보드", "Dashboards"], ["히트맵·세션", "Heatmaps and sessions"], ["코호트", "Cohorts"], ["UTM·태깅", "UTM and tagging"])),
    n("브랜드·크리에이티브", "Brand and creative", L(["카피", "Copy"], ["비주얼 에셋", "Visual assets"], ["브랜드 가이드", "Brand guides"], ["영상 광고", "Video ads"], ["AI 소재 생성", "AI creatives"])),
    n("세일즈", "Sales", L(["아웃바운드", "Outbound"], ["리드 스코어링", "Lead scoring"], ["데모·미팅", "Demos"], ["제안서", "Proposals"], ["파이프라인", "Pipeline"], ["CPQ", "CPQ"])),
    n("커뮤니티·PR", "Community and PR", L(["런칭", "Launches"], ["앰배서더", "Ambassadors"], ["이벤트", "Events"], ["보도", "Press"], ["파트너 마케팅", "Partner marketing"], ["커뮤니티 운영", "Community management"])),
  ],
  design: [
    n("UI 디자인", "UI design", L(["디자인 도구", "Design tools"], ["프로토타이핑", "Prototyping"], ["디자인 시스템", "Design systems"], ["아이콘·일러스트", "Icons and illustration"], ["반응형 레이아웃", "Responsive layout"])),
    n("UX 리서치", "UX research", L(["사용자 인터뷰", "Interviews"], ["사용성 테스트", "Usability testing"], ["설문", "Surveys"], ["여정 지도", "Journey maps"], ["리서치 저장소", "Research repository"])),
    n("협업·핸드오프", "Collaboration and handoff", L(["코멘트·리뷰", "Comments and review"], ["개발 핸드오프", "Dev handoff"], ["버전 관리", "Versioning"], ["디자인 토큰", "Design tokens"], ["코드 연결", "Code connect"])),
    n("브랜드·그래픽", "Brand and graphics", L(["로고", "Logos"], ["타이포그래피", "Typography"], ["색", "Colour"], ["모션 그래픽", "Motion graphics"], ["프레젠테이션", "Presentations"])),
    n("생성형 디자인", "Generative design", L(["이미지 생성", "Image generation"], ["텍스트→UI", "Text to UI"], ["배경·패턴", "Backgrounds and patterns"], ["3D", "3D"], ["아이콘 생성", "Icon generation"])),
    n("에셋·리소스", "Assets and resources", L(["템플릿", "Templates"], ["폰트", "Fonts"], ["무료 이미지", "Stock"], ["영감 모음", "Inspiration"], ["목업", "Mockups"])),
    n("웹·랜딩", "Web and landing", L(["사이트 빌더", "Site builders"], ["포트폴리오", "Portfolios"], ["애니메이션", "Animation"], ["인터랙티브 3D", "Interactive 3D"])),
  ],
  social: [
    n("커뮤니티", "Community", L(["포럼·게시판", "Forums"], ["관심사 그룹", "Interest groups"], ["Q&A", "Q&A"], ["지역 커뮤니티", "Local"], ["멤버십 커뮤니티", "Paid communities"])),
    n("메시징", "Messaging", L(["채팅", "Chat"], ["음성·영상", "Voice and video"], ["익명", "Anonymous"], ["그룹", "Groups"], ["팀 메신저", "Team messaging"])),
    n("크리에이터", "Creators", L(["팬 후원", "Fan support"], ["뉴스레터", "Newsletters"], ["멤버십", "Memberships"], ["굿즈", "Merch"], ["링크 인 바이오", "Link in bio"])),
    n("공유·큐레이션", "Sharing and curation", L(["링크 공유", "Link sharing"], ["컬렉션", "Collections"], ["랭킹·투표", "Rankings and votes"], ["리뷰", "Reviews"], ["추천 피드", "Recommendation feeds"])),
    n("매칭", "Matching", L(["데이팅", "Dating"], ["스터디·동료", "Study partners"], ["멘토링", "Mentoring"], ["이벤트 모임", "Meetups"], ["코파운더", "Co-founders"])),
    n("신뢰·안전", "Trust and safety", L(["모더레이션", "Moderation"], ["신고", "Reporting"], ["평판", "Reputation"], ["프라이버시", "Privacy"], ["본인 확인", "Verification"])),
    n("게이미피케이션", "Gamification", L(["배지·레벨", "Badges and levels"], ["스트릭", "Streaks"], ["리더보드", "Leaderboards"], ["챌린지", "Challenges"])),
  ],
  finance: [
    n("개인 재무", "Personal finance", L(["가계부", "Budgeting"], ["구독 관리", "Subscription tracking"], ["저축 목표", "Savings goals"], ["신용 관리", "Credit"], ["계좌 통합", "Account aggregation"])),
    n("투자", "Investing", L(["포트폴리오 추적", "Portfolio tracking"], ["주식·ETF", "Stocks and ETFs"], ["암호자산", "Crypto"], ["리서치·뉴스", "Research and news"], ["자동 투자", "Robo-advisory"])),
    n("결제", "Payments", L(["결제 연동", "Payment integration"], ["송금", "Transfers"], ["정산", "Payouts"], ["구독 청구", "Subscription billing"], ["인보이스", "Invoicing"])),
    n("비즈니스 재무", "Business finance", L(["회계", "Accounting"], ["경비", "Expenses"], ["세금", "Tax"], ["급여", "Payroll"], ["현금 흐름 예측", "Cash-flow forecasting"])),
    n("대출·보험", "Lending and insurance", L(["대출 비교", "Loan comparison"], ["보험 비교", "Insurance comparison"], ["BNPL", "BNPL"], ["신용 평가", "Credit scoring"])),
    n("규제·보안", "Compliance and security", L(["본인 확인", "KYC"], ["이상 거래 탐지", "Fraud detection"], ["규제 보고", "Regulatory reporting"], ["자금세탁 방지", "AML"])),
    n("금융 교육", "Financial education", L(["시뮬레이션", "Simulators"], ["커뮤니티", "Community"], ["계산기", "Calculators"], ["뉴스 요약", "News digests"])),
  ],
  agents: [
    n("자율 에이전트", "Autonomous agents", L(["작업 실행", "Task execution"], ["브라우징 에이전트", "Browsing agents"], ["코딩 에이전트", "Coding agents"], ["리서치 에이전트", "Research agents"], ["데스크톱 제어", "Desktop control"])),
    n("도구·연동", "Tools and integrations", L(["함수 호출", "Function calling"], ["MCP·플러그인", "MCP and plugins"], ["API 커넥터", "API connectors"], ["브라우저 제어", "Browser control"], ["파일·문서 접근", "File access"])),
    n("오케스트레이션", "Orchestration", L(["멀티 에이전트", "Multi-agent"], ["워크플로", "Workflows"], ["스케줄링", "Scheduling"], ["사람 승인", "Human approval"], ["재시도·복구", "Retries and recovery"])),
    n("메모리·상태", "Memory and state", L(["장기 기억", "Long-term memory"], ["세션 상태", "Session state"], ["사용자 컨텍스트", "User context"], ["작업 로그", "Task logs"])),
    n("평가·관측", "Evaluation and observability", L(["트레이스", "Traces"], ["성공률", "Success rate"], ["비용", "Cost"], ["회귀 테스트", "Regression tests"], ["벤치마크", "Benchmarks"])),
    n("안전·권한", "Safety and permissions", L(["권한 범위", "Scopes"], ["샌드박스", "Sandboxing"], ["감사 로그", "Audit logs"], ["되돌리기", "Undo"], ["지출 한도", "Spend limits"])),
    n("업무 자동화", "Work automation", L(["이메일·일정", "Email and calendar"], ["고객 지원", "Customer support"], ["데이터 입력", "Data entry"], ["리포트 생성", "Report generation"], ["영업 보조", "Sales assistance"])),
  ],
  etc: [
    n("교육", "Education", L(["온라인 강의", "Courses"], ["튜터링", "Tutoring"], ["암기·학습", "Flashcards"], ["언어", "Languages"], ["시험 준비", "Exam prep"], ["코딩 교육", "Coding education"], ["학교·학원 운영", "School operations"])),
    n("일·채용", "Work and hiring", L(["채용 공고", "Job boards"], ["이력서·포트폴리오", "Resumes and portfolios"], ["프리랜서 매칭", "Freelance matching"], ["면접 준비", "Interview prep"], ["팀 문화·온보딩", "Team culture and onboarding"])),
    n("건강·웰니스", "Health and wellness", L(["운동", "Fitness"], ["수면", "Sleep"], ["명상", "Meditation"], ["식단", "Nutrition"], ["기록·추적", "Tracking"])),
    n("커머스", "Commerce", L(["쇼핑몰", "Storefronts"], ["중고 거래", "Resale"], ["구독 커머스", "Subscription commerce"], ["가격 비교", "Price comparison"], ["공동 구매", "Group buying"])),
    n("여행·로컬", "Travel and local", L(["여행 계획", "Trip planning"], ["맛집·장소", "Places"], ["예약", "Booking"], ["지도", "Maps"], ["동네 정보", "Neighbourhood"])),
    n("엔터테인먼트", "Entertainment", L(["음악", "Music"], ["게임", "Games"], ["영상", "Video"], ["독서", "Reading"], ["팬덤", "Fandom"])),
    n("생활", "Everyday life", L(["가사·집", "Home"], ["반려동물", "Pets"], ["육아", "Parenting"], ["차량", "Cars"], ["식사·레시피", "Meals and recipes"])),
    n("공공·비영리", "Public and non-profit", L(["시민 참여", "Civic"], ["기부", "Donations"], ["환경", "Environment"], ["동네 안전", "Local safety"])),
  ],
};

export function label(node: Node, lang: Lang) {
  return lang === "en" ? node.en : node.ko;
}

/** Stable id for a node: its English label as a slug, joined down the path. */
export function slugOf(node: Node) {
  return node.en.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

/** Depth-2 topics of a category as pickable options: [{ id: "cat/slug", node }]. */
export function topicsOf(cat: string) {
  return (DOMAINS[cat] ?? []).map((node) => ({ id: `${cat}/${slugOf(node)}`, node }));
}
/** Finds a topic node by "cat/slug"; null when the id is not a known topic. */
export function topicById(id: string) {
  const [cat, slug] = id.split("/");
  const node = (DOMAINS[cat] ?? []).find((x) => slugOf(x) === slug);
  return node ? { cat, node } : null;
}

/** "f/business/revenue-model" → "비즈니스 › 수익 모델" (labels in the given language). */
export function nodePath(id: string, lang: Lang) {
  const parts = id.split("/");
  let list: Node[] | undefined = parts[0] === "f" ? FLOW : DOMAINS[parts[0].slice(2)];
  const out: string[] = [];
  for (const seg of parts.slice(1)) {
    const hit: Node | undefined = list?.find((x) => slugOf(x) === seg);
    if (!hit) break;
    out.push(label(hit, lang));
    list = hit.children;
  }
  return out.join(" › ");
}
