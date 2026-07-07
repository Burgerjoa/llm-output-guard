import type { ValidationResult } from "@llm-output-guard/core";
import type { LlmSiteAdapter } from "../adapters/types.js";
import { openPreviewPanel } from "./previewPanel.js";

const BADGE_ATTR = "data-log-badge";

export function upsertWarningBadge(
  messageElement: HTMLElement,
  adapter: LlmSiteAdapter,
  text: string,
  validation: ValidationResult
): void {
  const existingBadge = messageElement.querySelector<HTMLButtonElement>(`[${BADGE_ATTR}="true"]`);
  const shouldShowBadge = validation.warnings.some(
    (warning) => warning.severity === "error" || warning.severity === "warning"
  );

  if (!shouldShowBadge) {
    existingBadge?.remove();
    messageElement.querySelector<HTMLElement>(".log-panel")?.remove();
    return;
  }

  const badge = existingBadge ?? document.createElement("button");
  badge.type = "button";
  badge.className = "log-badge";
  badge.textContent = "Markdown fence issue";
  badge.setAttribute(BADGE_ATTR, "true");
  badge.title = "Show Markdown fence validation details";
  badge.onclick = () => openPreviewPanel(messageElement, adapter.siteName, text, validation);

  if (existingBadge === null) {
    adapter.getBadgeAnchor(messageElement).append(badge);
  }
}
