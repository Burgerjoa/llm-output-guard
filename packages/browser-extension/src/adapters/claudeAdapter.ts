import type { LlmSiteAdapter } from "./types.js";
import { getVisibleText, uniqueElements } from "../utils/dom.js";

const assistantSelectors = [
  '[data-testid*="assistant"]',
  '[data-testid="message"]',
  ".font-claude-message",
  "article"
];

export const claudeAdapter: LlmSiteAdapter = {
  siteName: "claude",

  isSupported() {
    return location.hostname === "claude.ai";
  },

  getAssistantMessageElements() {
    const elements = assistantSelectors.flatMap((selector) =>
      Array.from(document.querySelectorAll<HTMLElement>(selector))
    );

    return uniqueElements(elements).filter((element) => getVisibleText(element).length > 0);
  },

  getMessageText(element) {
    return getVisibleText(element);
  },

  getBadgeAnchor(element) {
    return element;
  }
};
