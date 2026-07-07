# LLM Output Guard

LLM이 생성한 깨진 코드블럭을 감지하고 수정 미리보기를 제공하는 오픈소스 도구입니다.

[English README](./README.md)

![LLM Output Guard 데모](./docs/assets/demo.gif)

## 왜 만들었나

LLM도 코드펜스를 깨뜨립니다. 그래서 답변이 사용자에게 가기 전에 검사하는 가드를 만들었습니다.

코드 블록 닫는 펜스 하나가 빠지면 나머지 응답 전체가 코드 블록 안으로 들어갈 수 있습니다. 사용자는 깨진 응답을 보게 되고, 도구는 잘못된 범위를 파싱할 수 있으며, 에이전트는 망가진 Markdown을 파일에 적용할 수 있습니다.

LLM Output Guard는 이런 구조적 Markdown 문제를 사용자, 파일, PR, 다른 에이전트에게 전달되기 전에 잡습니다.

## 감지하는 문제

- 닫히지 않은 코드 펜스
- 짧거나 잘못된 백틱 펜스
- 언어 태그 누락
- 열린 코드 블록 내부의 수상한 중첩 펜스
- 설명 문장이 코드 블록 안에 들어가는 문제

모든 검사는 로컬에서 실행됩니다. AI API 호출, 추적, 코드 실행은 없습니다.

## Before / After

Before:

<pre><code>Here is the TypeScript example:

&#96;&#96;&#96;ts
export function hello(name: string) {
  return `hello ${name}`;
}

This explanation is accidentally inside the code block.</code></pre>

After:

<pre><code>Here is the TypeScript example:

&#96;&#96;&#96;ts
export function hello(name: string) {
  return `hello ${name}`;
}
&#96;&#96;&#96;

This explanation is outside the code block again.</code></pre>

## Chrome Extension

Chrome 확장은 ChatGPT, Claude, Gemini의 assistant 응답을 감시합니다. 깨졌거나 수상한 Markdown 코드 펜스를 찾으면 작은 경고 배지를 표시하고, 클릭하면 경고 목록과 수정된 Markdown 미리보기, 복사 버튼을 보여줍니다.

![Chrome extension screenshot](./docs/assets/chrome-extension-screenshot.png)

로컬 빌드:

```bash
pnpm install
pnpm --filter @llm-output-guard/browser-extension build
```

Chrome에서 `chrome://extensions`를 열고 `Developer mode`를 켠 다음 `Load unpacked`로 `packages/browser-extension` 폴더를 선택하면 됩니다.

지원 사이트:

- `https://chatgpt.com/*`
- `https://chat.openai.com/*`
- `https://claude.ai/*`
- `https://gemini.google.com/*`

## MCP Server

MCP 서버는 코딩 에이전트가 Markdown을 사용자에게 보여주거나 파일에 적용하기 전에 검사하고 싶을 때 사용합니다.

```bash
pnpm install
pnpm build
pnpm --filter @llm-output-guard/mcp-server start
```

MCP client 설정 예시:

```json
{
  "mcpServers": {
    "llm-output-guard": {
      "command": "pnpm",
      "args": [
        "--dir",
        "/path/to/llm-output-guard",
        "--filter",
        "@llm-output-guard/mcp-server",
        "start"
      ]
    }
  }
}
```

제공 도구:

- `validate_markdown_output`: Markdown output을 검사하고 warnings와 stats 반환
- `fix_markdown_output`: 닫히지 않은 fence를 보수적으로 닫고 남은 warning 반환

## CLI

Markdown 파일 검사:

```bash
pnpm guard check ./example.md
```

수정본 출력:

```bash
pnpm guard fix ./example.md
```

파일에 직접 적용:

```bash
pnpm guard fix ./example.md --write
```

## TypeScript Library

~~~ts
import { fixMarkdownFences, validateMarkdownFences } from "@llm-output-guard/core";

const text = "```ts\nconst value = 1;";
const result = validateMarkdownFences(text);

if (!result.ok) {
  const fix = fixMarkdownFences(text);
  console.log(fix.fixedText);
}
~~~

## Architecture

```text
packages/core
  Shared Markdown fence validator and fixer

packages/cli
  Local file checker

packages/mcp-server
  MCP tools for IDE agents

packages/browser-extension
  Chrome extension for ChatGPT, Claude, and Gemini web UIs
```

## 개발

```bash
pnpm install
pnpm test
pnpm check
pnpm build
```

## 홍보/수동 테스트 흐름

1. `pnpm --filter @llm-output-guard/browser-extension build`
2. Chrome에서 `packages/browser-extension`를 unpacked extension으로 로드
3. ChatGPT를 열고 의도적으로 닫히지 않은 Markdown 코드 펜스를 출력하게 요청
4. `Markdown fence issue` 배지 확인
5. 배지를 클릭해 수정 미리보기 패널 확인
6. `Copy fixed Markdown` 버튼 확인

## Roadmap

- JSON block validation
- XML/HTML tag validation
- VS Code extension
- GitHub Actions integration
- streaming validation for partial LLM responses

## License

MIT
