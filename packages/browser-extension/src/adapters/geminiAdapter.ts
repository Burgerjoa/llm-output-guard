import type { LlmSiteAdapter } from "./types.js";
import { getVisibleText, uniqueElements } from "../utils/dom.js";

const assistantSelectors = [
  "model-response",
  '[data-test-id*="model-response"]',
  ".model-response-text",
  "message-content"
];

export const geminiAdapter: LlmSiteAdapter = {
  siteName: "gemini",

  isSupported() {
    return location.hostname === "gemini.google.com";
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
