# llm-output-guard

[한국어](./README.md)

Tiny structural validation for LLM-generated Markdown.

`llm-output-guard` helps coding agents catch broken Markdown code fences before the output reaches a user, a file, a pull request, or another tool in the chain.

It is intentionally small: no AI APIs, no code execution, no heavy Markdown renderer. Just a conservative TypeScript validator, a fixer, a CLI, an MCP server, and a browser extension.

## The Problem

LLM coding agents often return Markdown that mixes explanation, code, shell commands, JSON, diffs, and follow-up instructions. One missing closing fence can turn the rest of the response into a code block.

That means users may see mangled output, tools may parse the wrong content, and automated agents may apply broken Markdown to files.

Common failures include:

- opening ` ``` ` and never closing it
- using malformed fence-like lines such as `` or ````
- forgetting language tags on opening fences
- accidentally placing prose inside an unclosed code block
- ending a response while Markdown is still structurally open

`llm-output-guard` gives agents a fast preflight check before they speak or write.

## What It Does

- Validates fenced code blocks using a small line-based state machine
- Reports structured warnings with line, column, type, message, and severity
- Conservatively fixes unclosed code fences by appending a closing fence
- Exposes the validator through an MCP server for agent workflows
- Provides a local CLI for testing Markdown files
- Provides a Chrome extension for ChatGPT, Claude, and Gemini web UIs

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

## Packages

| Package | Purpose |
| --- | --- |
| `@llm-output-guard/core` | Reusable validator and conservative fixer |
| `@llm-output-guard/cli` | Local `guard` command for files |
| `@llm-output-guard/mcp-server` | MCP stdio server exposing validation/fix tools |
| `@llm-output-guard/browser-extension` | Chrome extension for ChatGPT, Claude, and Gemini |

## Install

```bash
pnpm install
pnpm build
```

## CLI

Check a Markdown file:

```bash
pnpm guard check ./example.md
```

Print a conservative fix to stdout:

```bash
pnpm guard fix ./example.md
```

Apply the fix in place:

```bash
pnpm guard fix ./example.md --write
```

`check` exits with a non-zero status when error-level warnings are found.

## MCP Server

Start the MCP server over stdio:

```bash
pnpm build
pnpm --filter @llm-output-guard/mcp-server start
```

Example MCP client configuration:

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

The server exposes:

- `validate_markdown_output`: validates LLM-generated Markdown and returns warnings plus stats
- `fix_markdown_output`: appends a missing closing fence when safe, then returns remaining warnings

## Browser Extension

The Chrome extension watches ChatGPT, Claude, and Gemini responses locally in the page. When code fence issues are found, it shows a small badge near the assistant response. Clicking the badge opens a fixed Markdown preview and copy button.

```bash
pnpm --filter @llm-output-guard/browser-extension build
```

Open `chrome://extensions`, enable `Developer mode`, click `Load unpacked`, and select `packages/browser-extension`.

See the [browser extension README](./packages/browser-extension/README.en.md) for details.

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

| Type | Severity | Meaning |
| --- | --- | --- |
| `UNCLOSED_FENCE` | `error` | A code block was opened but not closed before EOF |
| `MALFORMED_FENCE` | `warning` | A one- or two-backtick line looks like an intended fence |
| `MISSING_LANGUAGE` | `warning` | An opening fence has no language tag |
| `SUSPICIOUS_NESTED_FENCE` | `warning` | Triple backticks appeared inside an open block without forming a valid close |

## Development

```bash
pnpm install
pnpm test
pnpm check
pnpm build
```

## Manual Browser Extension Test

1. Run `pnpm --filter @llm-output-guard/browser-extension build`.
2. Load `packages/browser-extension` as an unpacked Chrome extension.
3. Open ChatGPT.
4. Ask it to produce intentionally broken Markdown fence output.
5. Confirm the `Markdown fence issue` badge appears.
6. Click the badge and confirm the fixed preview panel appears.
7. Click `Copy fixed Markdown`.

## Design Principles

- Keep the parser boring and predictable
- Prefer structural checks over Markdown rendering
- Never execute code blocks
- Never call AI APIs
- Fix only what is safe to fix
- Return machine-readable output for agents
- Keep browser extension checks local-only

## Roadmap

- JSON block validation
- XML/HTML tag validation
- VS Code extension
- GitHub Actions integration
- Streaming validation for partial LLM responses

## License

MIT
