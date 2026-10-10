# Yeseul Seo · Academic portfolio & blog

미국 대학원 지원용 영어 연구 포트폴리오와 GitHub 블로그입니다.

**사이트:** https://ashleysys04-blip.github.io/

Notion, API 키, 외부 CMS 없이 GitHub 저장소의 파일만으로 운영합니다. `main`에 변경을 올리면 GitHub Actions가 사이트를 빌드하고 GitHub Pages로 배포합니다.

## 내용 수정

| 파일 | 용도 |
|---|---|
| `content/profile.json` | 이름, 이메일, 연구 프로젝트 4개, 연구 경력, 클린룸 경험, 학력·장학금·기술 역량, 사진 및 CV 경로 |
| `content/posts.json` | 블로그 글 |
| `public/style.css` | 사이트 디자인 및 반응형 레이아웃 |
| `scripts/portfolio.mjs` | 홈페이지 섹션 렌더링 (HTML) |
| `public/` | CV, 이미지 등 정적 파일 |

GitHub에서 파일을 열고 연필 버튼으로 수정한 뒤 main에 커밋해도 됩니다.

## 대학원 지원용 프로필 완성

- 영어 소개와 연구 프로젝트 요약이 기본으로 들어 있습니다. 제출 전에 사실과 표현을 확인하세요.
- KAIST 이메일 `ashleysys@kaist.ac.kr`과 LinkedIn 링크가 연결되어 있습니다.
- CV를 `public/cv.pdf`에 업로드하고 `cv` 값을 `/cv.pdf`로 설정하면 CV 버튼이 표시됩니다.
- 이메일은 현재 표시되며 CV는 PDF가 아직 업로드되지 않아 버튼을 숨깁니다.
- 논문, 수상, 연구 성과는 실제 확인 가능한 항목만 추가하세요.

## 글 작성

`content/posts.json`에 글 객체를 추가합니다. 기본 예시는 비공개 초안으로 들어 있습니다.

```json
{
  "published": true,
  "slug": "vestibular-encoding",
  "title": "Notes on vestibular encoding",
  "date": "2026-10-10",
  "description": "A short summary for the article listing.",
  "body": [
    {"type": "heading", "text": "Research question"},
    {"type": "paragraph", "text": "Write your article here."},
    {"type": "list", "items": ["First point", "Second point"]},
    {"type": "code", "text": "print('hello')"},
    {"type": "link", "text": "Project repository", "url": "https://github.com/ashleysys04-blip"}
  ]
}
```

`slug`는 중복되지 않는 영문 소문자/숫자/하이픈 조합입니다. 글 주소는 `/writing/slug/`입니다. `published: false`인 글은 사이트에 표시하지 않습니다. 단, 공개 저장소에 작성한 파일 자체는 누구나 볼 수 있으므로 비밀 자료를 넣지 마세요.

첫 글이 공개되면 홈의 Writing 영역과 메뉴가 자동으로 나타납니다. 글이 없는 동안은 지원용 연구 포트폴리오에 집중합니다. 날짜는 정렬용이며 미래 날짜가 예약 발행을 의미하지는 않습니다.

## 로컬 실행

Node.js 22 이상이 필요합니다. 별도 npm 패키지 설치는 필요 없습니다.

```bash
git clone https://github.com/ashleysys04-blip/ashleysys04-blip.github.io.git
cd ashleysys04-blip.github.io
npm run dev
```

http://localhost:4321 에서 확인합니다. 수정 후 `npm run build`를 실행하고 브라우저를 새로고침하세요.

```bash
git add .
git commit -m "Update portfolio"
git push origin main
```

## 배포

`.github/workflows/pages.yml`이 main push와 수동 실행을 처리합니다. 정기 동기화는 없습니다. GitHub **Settings → Pages → Source**는 **GitHub Actions**로 설정합니다.

배포 상태: https://github.com/ashleysys04-blip/ashleysys04-blip.github.io/actions

사이트는 반응형 레이아웃, 페이지별 제목/설명, sitemap, robots.txt, 404 페이지를 포함합니다.

## 사진 직접 넣기

* 연구 사진: `public/images/` 폴더에 사진을 추가한 뒤 `content/profile.json`의 해당 프로젝트 `image`에 `/images/filename.jpg` 입력
* 프로필 사진: `public/images/portrait.jpg`를 추가하고 `portrait`를 `/images/portrait.jpg`로 변경
* 클린룸 사진: `cleanroom.image`에 사진 경로 입력
* 이미지 경로가 비어 있으면 의도적으로 추상 그래픽이 표시됩니다. 깨진 이미지가 나타나지 않습니다.
* CV: `public/cv.pdf` 업로드 후 `profile.json`의 `cv`를 `/cv.pdf`로 변경

연구, 공정 및 수상 내용은 제공된 CV와 면담 발표 자료를 바탕으로 작성했습니다. 특히 클린룸 경험은 **직접 참여와 관찰을 구분**합니다. 발표 전 문구와 날짜를 최종 확인하세요.
