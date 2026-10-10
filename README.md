# Yeseul Seo · Academic website

미국 대학원 지원용 연구 포트폴리오 + Notion 연동 블로그.

**사이트 주소:** https://ashleysys04-blip.github.io (Pages 활성화 및 배포 성공 후)

## 구조

Notion에서 글 작성 → GitHub Actions가 공개 글을 가져옴 → HTML 생성 → GitHub Pages 배포.

- Node.js 22 이상. 외부 npm 패키지 설치 없이 동작합니다.
- 홈: About / Research / Writing / Contact. 영어 프로필은 `content/profile.json`에서 수정합니다.
- Notion 미설정 상태에서는 포트폴리오만 생성됩니다.
- `main` push, 수동 실행, 6시간 간격 예약 실행으로 갱신합니다. 예약 실행은 GitHub 사정에 따라 지연될 수 있고, 장기간 활동 없는 공개 저장소에서는 비활성화될 수 있습니다.
- Notion 원본이나 토큰을 저장소에 커밋하지 않습니다. 정적 HTML과 공개 글의 이미지가 배포됩니다.

## 1. GitHub Pages 켜기

저장소 **Settings → Pages → Build and deployment → Source → GitHub Actions** 선택.

https://github.com/ashleysys04-blip/ashleysys04-blip.github.io/settings/pages

설정 후 **Actions → Publish academic site → Run workflow → main** 실행.

## 2. Notion 데이터베이스 만들기

글 하나가 데이터베이스의 페이지 하나인 전체 페이지 데이터베이스를 만듭니다. 속성 이름은 아래 대소문자를 정확히 맞춥니다.

| 속성 | Notion 타입 | 용도 |
|---|---|---|
| Name | Title (제목) | 필수. 글 제목 |
| Published | Checkbox (체크박스) | 필수. 체크한 글만 공개 |
| Slug | Text (텍스트) | 선택. `vestibular-encoding` 같은 URL. 비어 있으면 페이지 ID |
| Summary | Text (텍스트) | 선택. 글 목록 및 검색 결과 설명 |
| Date | Date (날짜) | 선택. 표시 날짜와 정렬. 비어 있으면 생성일 |

글 본문은 해당 페이지 안에 작성합니다. Slug는 소문자 영문/숫자/하이픈만 사용하고 중복하지 않습니다. 공개 후 바꾸면 주소도 바뀝니다. Date는 미래 날짜여도 예약 발행되지 않으며 Published 체크가 공개 기준입니다.

Notion의 데이터베이스 URL에서 ID를 복사합니다. 예: `https://www.notion.so/<32자리ID>?v=...`의 `<32자리ID>`. `?v=` 뒤는 뷰 ID이므로 사용하지 않습니다. 연결한 데이터 소스가 여러 개라면 `NOTION_DATA_SOURCE_ID`를 직접 지정합니다.

## 3. Notion 연결 만들기

https://www.notion.so/profile/integrations 에서 내부 연결(Internal integration/connection)을 생성하고 콘텐츠 읽기 권한을 부여합니다. 토큰을 복사합니다.

작성용 데이터베이스의 `••• → Connections`에서 만든 연결을 추가합니다. Notion 페이지를 웹에 공개할 필요는 없습니다. 토큰은 채팅이나 코드에 붙여넣지 말고 다음 GitHub Secret에 직접 저장하세요.

## 4. GitHub에 연결 값 등록

**Settings → Secrets and variables → Actions**:

| 탭 | 이름 | 값 |
|---|---|---|
| Secrets | NOTION_TOKEN | Notion 내부 연결 토큰 |
| Variables | NOTION_DATABASE_ID | 작성용 데이터베이스 ID |
| Variables | NOTION_DATA_SOURCE_ID | 선택. 특정 데이터 소스를 직접 지정할 경우 |

https://github.com/ashleysys04-blip/ashleysys04-blip.github.io/settings/secrets/actions

설정 완료 후 글 하나에 Published를 체크하고 **Actions → Publish academic site → Run workflow**를 실행합니다. 성공하면 `/writing/`에서 글을 확인합니다. 이후 예약 실행으로 반영되며 즉시 반영하려면 Run workflow를 다시 실행합니다.

Published 체크 해제/페이지 삭제는 **다음 성공한 배포**에 반영됩니다. 연결 오류나 지원하지 않는 본문 블록이 있으면 배포를 중단하므로 이전 사이트가 유지됩니다. 먼저 오류를 수정한 뒤 다시 실행하세요. 이미 공개된 콘텐츠의 검색엔진 캐시까지 삭제되지는 않습니다.

## 로컬 개발

```bash
git clone https://github.com/ashleysys04-blip/ashleysys04-blip.github.io.git
cd ashleysys04-blip.github.io
npm test
npm run dev
```

http://localhost:4321 에서 확인합니다. 수정 후 `npm run build`를 실행하고 브라우저를 새로고침합니다.

로컬에서도 Notion을 사용하려면 `.env.example`을 `.env`로 복사하고 값을 넣습니다. `.env`는 Git에 포함되지 않습니다. GitHub Actions에서는 `.env` 대신 Secrets/Variables를 사용합니다.

```bash
git add .
git commit -m "Update academic website"
git push origin main
```

origin과 main은 이미 설정된 프로젝트이므로 `git remote add origin`을 반복할 필요가 없습니다.

## 프로필, CV, 연락처

`content/profile.json`에 소개, 연구 주제, 이메일을 설정합니다. 현재 소개는 초기 초안이며 제출 전에 표현을 확인하세요. `email`이 비어 있으면 이메일 버튼을 표시하지 않습니다. CV PDF를 `public/cv.pdf`에 넣고 `cv`를 `/cv.pdf`로 설정하면 버튼이 나타납니다. 실제 CV가 없는 상태에서는 버튼을 숨깁니다.

## Notion 본문 지원 범위

문단, 제목, 굵게/기울임/밑줄/취소선, 링크, 중첩 목록, 인용, 콜아웃, 코드, 이미지, 표, 토글, 체크리스트를 지원합니다. 이미지는 빌드 시 다운로드하여 만료되는 Notion URL을 배포 페이지에 남기지 않습니다. PNG/JPEG/WebP/GIF/AVIF와 이미지당 20 MB 이하를 지원합니다. 이미지 캡션은 대체 텍스트로도 사용됩니다.

수식은 현재 LaTeX 원문으로 표시됩니다. 수식 조판, 동영상, 파일 첨부, 하위 페이지, 데이터베이스 임베드는 아직 지원하지 않습니다. 지원하지 않는 블록은 조용히 누락하지 않고 빌드를 실패시킵니다. 필요 시 `scripts/notion.mjs`의 변환기를 확장하면 됩니다.

## 파일 안내

- `scripts/build.mjs`: 정적 페이지, sitemap, SEO 메타데이터 생성
- `scripts/notion.mjs`: API 조회, 페이지네이션, 공개 필터, 본문 변환
- `public/style.css`: 반응형 디자인
- `content/profile.json`: 프로필과 프로젝트 소개
- `.github/workflows/pages.yml`: 자동 동기화 및 Pages 배포
- `tests/notion.test.mjs`: 비공개 글 제외, 페이지네이션, 안전한 HTML/URL, 오류 처리 검증

API 버전은 `2025-09-03`에 고정합니다. 데이터베이스 컨테이너에서 데이터 소스 ID를 확인하고 `POST /v1/data_sources/{id}/query`로 조회합니다.

참고: [Notion API 변경 안내](https://developers.notion.com/guides/get-started/upgrade-guide-2025-09-03), [블록 조회](https://developers.notion.com/reference/get-block-children), [GitHub Pages 워크플로](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).
