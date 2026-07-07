# llm-output-guard

[English](./README.en.md)

LLM이 만든 Markdown을 사용자에게 보여주거나 파일에 적용하기 전에 구조적으로 검사하는 작은 TypeScript 도구 모음입니다.

첫 MVP는 Markdown 코드 펜스에 집중합니다. 닫히지 않은 코드 블록, 짧거나 잘못된 백틱 펜스, 언어 태그 누락, 수상한 중첩 펜스를 빠르게 잡아냅니다.

## 왜 필요한가

LLM 코딩 에이전트는 설명, 코드, 셸 명령, JSON, diff, 후속 안내를 Markdown 하나에 섞어서 출력합니다. 이때 코드 블록 닫는 펜스 하나가 빠지면 나머지 응답 전체가 코드 블록 안으로 빨려 들어갈 수 있습니다.

그 결과 사용자는 깨진 응답을 보게 되고, 도구는 잘못된 범위를 파싱할 수 있으며, 자동화된 에이전트는 망가진 Markdown을 파일에 적용할 수 있습니다.

`llm-output-guard`는 에이전트가 말하거나 쓰기 전에 실행하는 가벼운 preflight check입니다.

## 제공 기능

- 작은 line-based state machine으로 fenced code block 검사
- line, column, type, message, severity가 포함된 구조화 경고 반환
- 닫히지 않은 코드 펜스는 마지막에 닫는 펜스를 추가하는 보수적 수정
- MCP 서버로 IDE/agent workflow에 연결
- CLI로 로컬 Markdown 파일 검사
- Chrome 확장으로 ChatGPT, Claude, Gemini 웹 UI에서 응답 검사

## 아키텍처

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

## 패키지

| 패키지 | 역할 |
| --- | --- |
| `@llm-output-guard/core` | 재사용 가능한 validator와 보수적 fixer |
| `@llm-output-guard/cli` | 로컬 파일 검사 CLI |
| `@llm-output-guard/mcp-server` | agent 통합용 MCP stdio 서버 |
| `@llm-output-guard/browser-extension` | ChatGPT, Claude, Gemini용 Chrome 확장 |

## 설치

```bash
pnpm install
pnpm build
```

## CLI

Markdown 파일 검사:

```bash
pnpm guard check ./example.md
```

수정 결과를 stdout으로 출력:

```bash
pnpm guard fix ./example.md
```

파일에 직접 적용:

```bash
pnpm guard fix ./example.md --write
```

`check`는 error-level warning이 있으면 non-zero status로 종료합니다.

## MCP 서버

stdio 기반 MCP 서버 실행:

```bash
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

- `validate_markdown_output`: LLM Markdown 출력의 코드 펜스 문제를 검사합니다.
- `fix_markdown_output`: 안전한 범위에서 닫히지 않은 코드 펜스를 보수적으로 수정합니다.

## 브라우저 확장

Chrome 확장은 ChatGPT, Claude, Gemini 응답을 페이지 안에서 로컬로 검사합니다. 문제가 있으면 assistant 응답 근처에 작은 경고 배지를 보여주고, 클릭하면 수정된 Markdown 미리보기와 복사 버튼을 제공합니다.

```bash
pnpm --filter @llm-output-guard/browser-extension build
```

Chrome에서 `chrome://extensions`를 열고 `Developer mode`를 켠 뒤 `packages/browser-extension` 폴더를 `Load unpacked`로 불러오면 됩니다.

자세한 내용은 [browser extension README](./packages/browser-extension/README.md)를 참고하세요.

## Core API

~~~ts
import { fixMarkdownFences, validateMarkdownFences } from "@llm-output-guard/core";

const result = validateMarkdownFences("```ts\nconst value = 1;");

if (!result.ok) {
  const fix = fixMarkdownFences("```ts\nconst value = 1;");
  console.log(fix.fixedText);
}
~~~

## Warning Types

| Type | Severity | 의미 |
| --- | --- | --- |
| `UNCLOSED_FENCE` | `error` | 코드 블록이 열렸지만 EOF 전에 닫히지 않음 |
| `MALFORMED_FENCE` | `warning` | 한두 개 백틱 라인이 fence 의도처럼 보임 |
| `MISSING_LANGUAGE` | `warning` | opening fence에 language tag가 없음 |
| `SUSPICIOUS_NESTED_FENCE` | `warning` | 열린 코드 블록 안에서 닫는 fence가 아닌 triple backtick 발견 |

## 개발

```bash
pnpm install
pnpm test
pnpm check
pnpm build
```

## 수동 테스트 예시

브라우저 확장:

1. `pnpm --filter @llm-output-guard/browser-extension build`
2. Chrome에서 `packages/browser-extension`를 unpacked extension으로 로드
3. ChatGPT를 열고 의도적으로 닫히지 않은 Markdown 코드 펜스를 출력하게 요청
4. `Markdown fence issue` 배지가 나타나는지 확인
5. 배지를 클릭해 수정 미리보기 패널 확인
6. `Copy fixed Markdown` 버튼 확인

## 설계 원칙

- parser는 단순하고 예측 가능하게 유지
- Markdown 렌더링보다 구조 검사에 집중
- 코드 블록을 실행하지 않음
- AI API를 호출하지 않음
- 안전한 수정만 수행
- agent가 읽기 쉬운 machine-readable output 제공

## 로드맵

- JSON block validation
- XML/HTML tag validation
- VS Code extension
- GitHub Actions integration
- Streaming validation for partial LLM responses

## 라이선스

MIT
