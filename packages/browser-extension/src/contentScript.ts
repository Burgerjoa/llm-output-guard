import { validateMarkdownFences } from "@llm-output-guard/core";
import { chatgptAdapter } from "./adapters/chatgptAdapter.js";
import { claudeAdapter } from "./adapters/claudeAdapter.js";
import { geminiAdapter } from "./adapters/geminiAdapter.js";
import type { LlmSiteAdapter } from "./adapters/types.js";
import { upsertWarningBadge } from "./ui/badge.js";
import { debounce } from "./utils/dom.js";

const adapters: LlmSiteAdapter[] = [chatgptAdapter, claudeAdapter, geminiAdapter];
const adapter = adapters.find((candidate) => candidate.isSupported());
const lastSeenText = new WeakMap<HTMLElement, string>();

function validateVisibleMessages(siteAdapter: LlmSiteAdapter): void {
  for (const messageElement of siteAdapter.getAssistantMessageElements()) {
    const text = siteAdapter.getMessageText(messageElement);

    if (text.length === 0 || lastSeenText.get(messageElement) === text) {
      continue;
    }

    lastSeenText.set(messageElement, text);
    const validation = validateMarkdownFences(text);
    upsertWarningBadge(messageElement, siteAdapter, text, validation);
  }
}

if (adapter !== undefined) {
  const debouncedValidate = debounce(() => validateVisibleMessages(adapter), 250);

  debouncedValidate();

  const observer = new MutationObserver(() => {
    debouncedValidate();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true
  });
}
