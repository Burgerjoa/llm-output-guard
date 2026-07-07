# LLM Output Guard Browser Extension

[한국어](./README.ko.md)

A Chrome extension that watches ChatGPT, Claude, and Gemini responses and shows a small warning badge when Markdown code fence issues are detected.

All validation runs locally in the browser. Page content is not sent to external servers, and no AI APIs are called.

![Chrome extension screenshot](../../docs/assets/chrome-extension-screenshot.png)

## Supported Sites

- ChatGPT: `https://chatgpt.com/*`
- ChatGPT legacy: `https://chat.openai.com/*`
- Claude: `https://claude.ai/*`
- Gemini: `https://gemini.google.com/*`

## How It Works

1. The content script selects the adapter for the current site.
2. A `MutationObserver` watches assistant response changes.
3. Visible message text is extracted.
4. `validateMarkdownFences` from `@llm-output-guard/core` validates the text.
5. If issues exist, a `Markdown fence issue` badge is inserted near the response.
6. Clicking the badge opens a panel with warnings, a fixed Markdown preview, and a copy button.

## Build

```bash
pnpm install
pnpm --filter @llm-output-guard/browser-extension build
```

After building, the content script is available at `packages/browser-extension/dist/contentScript.js`.

## Package for Chrome Web Store

```bash
pnpm --filter @llm-output-guard/browser-extension package
```

This creates:

```text
packages/browser-extension/release/llm-output-guard-chrome-0.1.0.zip
```

Upload that ZIP in the Chrome Web Store Developer Dashboard.

## Load as an Unpacked Chrome Extension

1. Open `chrome://extensions` in Chrome.
2. Enable `Developer mode`.
3. Click `Load unpacked`.
4. Select the `packages/browser-extension` folder.
5. Refresh ChatGPT, Claude, or Gemini.

## Manual Test

1. Open ChatGPT.
2. Ask it to intentionally produce a broken Markdown code fence.
3. Confirm the `Markdown fence issue` badge appears near the assistant response.
4. Click the badge.
5. Confirm the fixed preview panel appears.
6. Click `Copy fixed Markdown`.

## Privacy

- No page content is sent to external servers.
- No AI APIs are called.
- No network permissions are requested.
- Original assistant response DOM is not replaced.

## Current Limitations

- LLM site DOM changes may break selectors.
- The original message is not modified.
- The fixed preview may not perfectly preserve rendered formatting.
