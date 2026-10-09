# 성격 팔레트 (MBTI 컬러 팔레트 웹앱)

질문 4개(각 두 가지 보기)에 답하면 16가지 유형 중 하나가 정해지고, 유형별 4색 팔레트가 결과로 나오는 웹앱입니다. 로그인·서버 없이 정적 사이트로 동작합니다. 공식 성격 검사가 아닌 재미용 테스트입니다.

## 실행

```bash
npm install
npm run dev        # 개발 서버
npm test           # 유형 계산·팔레트 검수 테스트
npm run build      # 타입 검사 + 배포용 빌드 (dist/)
npm run preview    # 빌드 결과 미리보기
```

## 배포
Vercel은 `vercel.json`, Netlify는 `public/_redirects`가 `/result/infp` 같은 주소를 `index.html`로 연결합니다. 빌드 명령은 `npm run build`, 출력 폴더는 `dist`입니다.

## 카카오톡 공유 설정
1. [카카오 디벨로퍼스](https://developers.kakao.com)에서 애플리케이션을 만들고 **앱 키 > JavaScript 키**를 복사합니다.
2. **앱 설정 > 플랫폼 > Web**에 사이트 도메인을 등록합니다. 개발용 `http://localhost:5173`과 배포 도메인을 모두 넣어야 합니다.
3. `.env.example`을 `.env.local`로 복사하고 `VITE_KAKAO_JS_KEY`에 키를 넣습니다. 배포할 때는 Vercel/Netlify 환경 변수에 같은 이름으로 넣습니다.

키가 없으면 결과 화면에 카카오톡 공유 버튼이 나오지 않습니다. 공유 메시지의 썸네일은 결과 팔레트로 그린 이미지를 카카오 서버에 올려서 씁니다. 업로드에 실패하면 이미지 없는 텍스트 메시지로 보냅니다.

## 구조
- `src/data/questions.ts` 질문 4개 (A는 축의 앞 글자, B는 뒤 글자)
- `src/data/types.ts` 16유형 이름·설명·4색 팔레트 (디자이너 검수 전 초안)
- `src/lib/scoring.ts` 답 → 유형 계산, `src/lib/color.ts` 대비 계산
- `src/screens/` 시작 · 질문 · 로딩 · 결과 (`/result/:type` 직접 진입이 공유 링크 화면)
- `src/lib/saveImage.ts` 결과 카드를 1080x1920 PNG로 저장, `share.ts` 링크 공유, `kakao.ts` 카카오톡 공유

## 아직 안 한 것
- 유형별 공유 미리보기(OG 이미지·메타태그)는 정적 페이지 생성이 필요해 다음 단계로 남겨 뒀습니다.
- 16유형 갤러리, 분석 도구 연동.
# app-MBTI
