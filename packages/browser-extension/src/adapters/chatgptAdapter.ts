import type { LlmSiteAdapter } from "./types.js";
import { getVisibleText, uniqueElements } from "../utils/dom.js";

const assistantSelectors = [
  '[data-message-author-role="assistant"]',
  '[data-testid*="conversation-turn"] [data-message-author-role="assistant"]',
  "article"
];

export const chatgptAdapter: LlmSiteAdapter = {
  siteName: "chatgpt",

  isSupported() {
    return location.hostname === "chatgpt.com" || location.hostname === "chat.openai.com";
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
