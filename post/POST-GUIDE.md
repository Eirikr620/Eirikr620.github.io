# 포스트 작성 방법

## 기존 글 수정

`post1.html`에서 두 곳만 수정합니다.

1. `id="post-title"`인 `<h1>` 안의 제목
2. `본문 시작`과 `본문 끝` 주석 사이의 글

브라우저 탭 제목은 `<h1>`에서 자동으로 가져옵니다.
블로그 목록의 제목·날짜는 `blog1.posts.js`에서 별도로 수정합니다.

## 긴 텍스트 붙여 넣기

`post-text` 안에 글을 붙여 넣으세요. 줄바꿈과 빈 줄이 그대로 표시되고, 화면 너비에 맞춰 자동으로 줄바꿈됩니다. 글이 길면 창 내부에서 스크롤할 수 있습니다.

```html
<div class="post-text">
첫 번째 문단입니다. 이곳에 긴 글을 붙여 넣습니다.

두 번째 문단입니다.
줄바꿈도 유지됩니다.
</div>
```

HTML 파일이므로 일반 텍스트의 `<`는 `&lt;`, `&`는 `&amp;`로 입력하세요. 따옴표나 백틱은 이 본문 영역에서 그대로 사용할 수 있습니다. Markdown 문법은 자동 변환되지 않습니다.

소제목·링크·사진 등이 필요하면 `post-content` 안에서 HTML 요소를 사용하세요. 아래처럼 `post-text` 밖에 추가하면 코드 들여쓰기가 화면 여백에 영향을 주지 않습니다.

```html
<h2>소제목</h2>
<p>첫 문단입니다. <strong>강조할 내용</strong>을 넣을 수 있습니다.</p>
<p>다음 문단입니다. <a href="https://example.com">참고 링크</a></p>
<blockquote>인용문을 적습니다.</blockquote>
<figure>
  <img src="images/사진파일.jpg" alt="사진 설명" />
  <figcaption>사진 아래에 표시할 설명</figcaption>
</figure>
```

## 새 포스트 추가

1. `post-template.html`을 같은 폴더에 `post3.html`처럼 새 이름으로 복사합니다.
2. 새 파일의 제목과 본문을 작성합니다.
3. `blog1.posts.js`의 `BLOG_POSTS` 목록에 다음 항목을 추가합니다.

```js
{
  title: '새 글 제목',
  date: '2026-09-25',
  href: 'post3.html',
},
```

목록은 최신 날짜순으로 정렬됩니다. 목록에서 항목을 제거해도 글 파일은 삭제되지 않습니다. 작성용 `post-template.html`은 블로그 목록에 등록하지 않아도 됩니다.

## 공통 디자인과 동작

`post.css`와 `post.js`는 `post1.html` 및 템플릿을 복사한 새 글이 함께 사용합니다. 새 글마다 CSS나 JavaScript를 복사할 필요가 없습니다. 배포할 때 두 공통 파일도 함께 올리세요. 기존 `post2.html`은 아직 독립된 스타일과 동작을 사용합니다.

`post.css` 상단에서 다음 값을 조절합니다.

| 설정 | 용도 |
| --- | --- |
| `--post-width` | 포스트 창 너비 |
| `--post-body-height` | 본문 스크롤 영역 높이 |
| `--post-text-width` | 한 줄의 최대 길이 |
| `--post-font-size` | 글자 크기 |
| `--post-line-height` | 행간 |
| `--post-padding` | 본문 안쪽 여백 |
