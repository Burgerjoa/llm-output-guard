export type LlmSiteAdapter = {
  siteName: "chatgpt" | "claude" | "gemini";
  isSupported(): boolean;
  getAssistantMessageElements(): HTMLElement[];
  getMessageText(element: HTMLElement): string;
  getBadgeAnchor(element: HTMLElement): HTMLElement;
};
