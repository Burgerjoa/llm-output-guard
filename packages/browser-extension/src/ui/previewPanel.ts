import { fixMarkdownFences, type ValidationResult } from "@llm-output-guard/core";

export function openPreviewPanel(
  messageElement: HTMLElement,
  siteName: string,
  text: string,
  validation: ValidationResult
): void {
  messageElement.querySelector<HTMLElement>(".log-panel")?.remove();

  const fix = fixMarkdownFences(text);
  const panel = document.createElement("section");
  panel.className = "log-panel";

  const header = document.createElement("div");
  header.className = "log-panel-header";

  const title = document.createElement("strong");
  title.textContent = `LLM Output Guard · ${siteName}`;

  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.className = "log-panel-close";
  closeButton.textContent = "Close";
  closeButton.onclick = () => panel.remove();

  header.append(title, closeButton);

  const status = document.createElement("p");
  status.className = validation.ok ? "log-status log-status-ok" : "log-status log-status-error";
  status.textContent = validation.ok
    ? "No error-level fence issues detected."
    : "Broken Markdown code fence detected.";

  const warningList = document.createElement("ul");
  warningList.className = "log-warning-list";

  for (const warning of validation.warnings) {
    const item = document.createElement("li");
    item.textContent = `${warning.severity.toUpperCase()} ${warning.type} at ${warning.line}:${warning.column} - ${warning.message}`;
    warningList.append(item);
  }

  const textarea = document.createElement("textarea");
  textarea.className = "log-fixed-preview";
  textarea.readOnly = true;
  textarea.value = fix.fixedText;
  textarea.rows = Math.min(16, Math.max(6, fix.fixedText.split(/\r?\n/).length));

  const copyButton = document.createElement("button");
  copyButton.type = "button";
  copyButton.className = "log-copy";
  copyButton.textContent = "Copy fixed Markdown";
  copyButton.onclick = async () => {
    await navigator.clipboard.writeText(fix.fixedText);
    copyButton.textContent = "Copied";
    window.setTimeout(() => {
      copyButton.textContent = "Copy fixed Markdown";
    }, 1500);
  };

  panel.append(header, status, warningList, textarea, copyButton);
  messageElement.append(panel);
}
