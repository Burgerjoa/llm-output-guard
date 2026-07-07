import type { FixResult } from "./types.js";
import { validateMarkdownFences } from "./validateMarkdownFences.js";

export function fixMarkdownFences(input: string): FixResult {
  const validation = validateMarkdownFences(input);
  const unclosedFence = validation.warnings.find((warning) => warning.type === "UNCLOSED_FENCE");

  if (unclosedFence === undefined) {
    return {
      fixedText: input,
      changed: false,
      appliedFixes: []
    };
  }

  const separator = input.length === 0 || input.endsWith("\n") ? "" : "\n";
  const fixedText = `${input}${separator}\`\`\`\n`;

  return {
    fixedText,
    changed: true,
    appliedFixes: [
      {
        type: "CLOSE_UNCLOSED_FENCE",
        line: validation.stats.totalLines + (separator === "" ? 1 : 2),
        message: "Appended a closing triple-backtick fence at the end of the input."
      }
    ]
  };
}
