import { fixMarkdownFences, validateMarkdownFences } from "@llm-output-guard/core";

export const fixMarkdownOutputDescription =
  "Conservatively fix broken Markdown code fences in LLM-generated output.";

export function fixMarkdownOutput(text: string) {
  const fixResult = fixMarkdownFences(text);
  const validationAfterFix = validateMarkdownFences(fixResult.fixedText);

  return {
    fixedText: fixResult.fixedText,
    changed: fixResult.changed,
    appliedFixes: fixResult.appliedFixes,
    warningsAfterFix: validationAfterFix.warnings
  };
}
