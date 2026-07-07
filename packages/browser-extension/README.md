# LLM Output Guard 브라우저 확장

[English](./README.en.md)

Chrome에서 ChatGPT, Claude, Gemini 응답을 감시하고 Markdown 코드 펜스 문제가 있으면 작은 경고 배지를 표시하는 MVP 확장입니다.

모든 검사는 브라우저 안에서 로컬로 실행됩니다. 페이지 내용은 외부 서버로 전송하지 않고, AI API도 호출하지 않습니다.

## 지원 사이트

- ChatGPT: `https://chatgpt.com/*`
- ChatGPT legacy: `https://chat.openai.com/*`
- Claude: `https://claude.ai/*`
- Gemini: `https://gemini.google.com/*`

## 동작 방식

1. content script가 현재 사이트에 맞는 adapter를 선택합니다.
2. `MutationObserver`로 assistant 응답 영역 변화를 감시합니다.
3. 응답의 보이는 텍스트를 추출합니다.
4. `@llm-output-guard/core`의 `validateMarkdownFences`로 검사합니다.
5. 문제가 있으면 응답 근처에 `Markdown fence issue` 배지를 추가합니다.
6. 배지를 누르면 경고 목록, 수정된 Markdown 미리보기, 복사 버튼이 있는 패널을 보여줍니다.

## 빌드

```bash
pnpm install
pnpm --filter @llm-output-guard/browser-extension build
```

빌드 후 content script는 `packages/browser-extension/dist/contentScript.js`에 생성됩니다.

## Chrome에 unpacked extension으로 로드하기

1. Chrome에서 `chrome://extensions`를 엽니다.
2. 오른쪽 위 `Developer mode`를 켭니다.
3. `Load unpacked`를 누릅니다.
4. `packages/browser-extension` 폴더를 선택합니다.
5. ChatGPT, Claude, Gemini 페이지를 새로고침합니다.

## 수동 테스트

1. ChatGPT를 엽니다.
2. 의도적으로 닫히지 않은 Markdown 코드 펜스를 만들도록 요청합니다.
3. assistant 응답 근처에 `Markdown fence issue` 배지가 나타나는지 확인합니다.
4. 배지를 클릭합니다.
5. 수정 미리보기 패널이 열리는지 확인합니다.
6. `Copy fixed Markdown` 버튼으로 수정된 Markdown이 복사되는지 확인합니다.

## 개인정보

- 페이지 콘텐츠를 외부 서버로 보내지 않습니다.
- AI API를 호출하지 않습니다.
- 네트워크 권한을 요청하지 않습니다.
- 원본 assistant 응답 DOM을 교체하지 않습니다.

## 현재 한계

- LLM 사이트의 DOM 구조가 바뀌면 selector가 깨질 수 있습니다.
- 원본 메시지는 수정하지 않고 별도 미리보기만 제공합니다.
- 수정 미리보기가 렌더링된 Markdown의 시각적 포맷을 완벽히 보존하지는 않습니다.
