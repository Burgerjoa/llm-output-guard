# Chrome Web Store Listing Copy

Use this file when filling out the Chrome Web Store Developer Dashboard. The main description is written as plain store copy, not as a technical README.

## Basic Info

Extension name:

```text
LLM Output Guard
```

Short description:

```text
Detect and preview fixes for broken Markdown code fences in ChatGPT, Claude, and Gemini.
```

Category:

```text
Developer Tools
```

Homepage URL:

```text
https://github.com/Burgerjoa/llm-output-guard
```

Support URL:

```text
https://github.com/Burgerjoa/llm-output-guard/issues
```

Privacy policy URL:

```text
https://github.com/Burgerjoa/llm-output-guard/blob/main/docs/chrome-web-store/privacy.md
```

Language:

```text
English
```

## Detailed Description

```text
LLM Output Guard helps you catch broken Markdown code blocks in ChatGPT, Claude, and Gemini responses before they become annoying to read or copy.

LLM answers often contain multiple code blocks mixed with explanations. When one Markdown fence is missing or malformed, the explanation can accidentally appear inside a code block, and the next code block can render outside of the intended structure. This extension detects those broken or suspicious Markdown fences and shows a small warning badge near the assistant response.

Click the badge to inspect what went wrong. LLM Output Guard shows the validation warnings, a conservative fixed Markdown preview, and a button to copy the fixed version. It does not replace or rewrite the original response on the page.

The extension is designed for developers who frequently copy code, JSON, shell commands, or technical notes from LLM web UIs. It focuses on one small but common failure mode: broken Markdown code fences.

Everything runs locally in your browser. The extension does not call AI APIs, does not track you, does not send page content to external servers, and does not collect user data.
```

## Privacy Practices

Suggested answers:

```text
The extension does not collect, sell, transmit, or store user data.
All Markdown validation runs locally in the browser content script.
The extension does not make network requests and does not call AI APIs.
```

Single purpose:

```text
Detect broken Markdown code fences in supported LLM web responses and show a local fixed preview.
```

Permission justification:

```text
The extension uses content scripts on ChatGPT, Claude, and Gemini pages to inspect visible assistant response text locally and display a warning badge when Markdown code fence issues are detected.
```

Host permission justification:

```text
The extension runs only on supported LLM web UIs:
- chatgpt.com
- chat.openai.com
- claude.ai
- gemini.google.com

These matches are needed to observe assistant responses and display local validation UI.
```

Remote code:

```text
No remote code is used.
```

Data collection:

```text
No data is collected.
```

## Assets

Extension package:

```text
packages/browser-extension/release/llm-output-guard-chrome-0.1.0.zip
```

Icon:

```text
packages/browser-extension/icons/icon-128.png
```

Screenshot:

```text
docs/chrome-web-store/screenshots/screenshot-1-fence-issue-preview.png
```

Optional promo tile:

```text
docs/chrome-web-store/screenshots/promo-tile-440x280.png
```

## Publish Checklist

1. Run `pnpm --filter @llm-output-guard/browser-extension package`.
2. Open the Chrome Web Store Developer Dashboard.
3. Click `Add new item`.
4. Upload `packages/browser-extension/release/llm-output-guard-chrome-0.1.0.zip`.
5. Fill in store listing text from this file.
6. Upload screenshot and icon assets.
7. Add the support URL and privacy policy URL from this file.
8. Complete privacy practices with local-only/no-data answers.
9. Choose visibility, preferably `Unlisted` for first review or `Public` for launch.
10. Submit for review.
