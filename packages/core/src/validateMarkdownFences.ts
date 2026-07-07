import type { ValidationResult, ValidationWarning } from "./types.js";

type OpenFence = {
  line: number;
  column: number;
  length: number;
};

const OPENING_FENCE_RE = /^( {0,3})(`{3,})([^`]*)$/;
const SHORT_FENCE_RE = /^( {0,3})(`{1,2})(?!`)(.*)$/;

function createLineList(input: string): string[] {
  if (input.length === 0) {
    return [];
  }

  return input.split(/\r?\n/);
}

function isClosingFence(line: string, fenceLength: number): boolean {
  const match = /^( {0,3})(`{3,})([ \t]*)$/.exec(line);
  return match !== null && match[2].length >= fenceLength;
}

function getColumn(line: string, token: string): number {
  return line.indexOf(token) + 1;
}

function looksLikeShortFence(line: string): boolean {
  const match = SHORT_FENCE_RE.exec(line);
  if (match === null) {
    return false;
  }

  const rest = match[3].trim();
  return rest.length === 0 || /^[A-Za-z0-9_-]+$/.test(rest);
}

export function validateMarkdownFences(input: string): ValidationResult {
  const lines = createLineList(input);
  const warnings: ValidationWarning[] = [];
  let openFence: OpenFence | undefined;
  let codeFenceCount = 0;
  let codeBlockCount = 0;
  let unclosedFenceCount = 0;

  lines.forEach((line, index) => {
    const lineNumber = index + 1;

    if (looksLikeShortFence(line)) {
      warnings.push({
        type: "MALFORMED_FENCE",
        line: lineNumber,
        column: getColumn(line, "`"),
        message: "Line contains one or two backticks where a fenced code block may have been intended.",
        severity: "warning"
      });
      return;
    }

    if (openFence !== undefined) {
      if (isClosingFence(line, openFence.length)) {
        codeFenceCount += 1;
        openFence = undefined;
        return;
      }

      const nestedColumn = line.indexOf("```");
      if (nestedColumn !== -1) {
        warnings.push({
          type: "SUSPICIOUS_NESTED_FENCE",
          line: lineNumber,
          column: nestedColumn + 1,
          message: "Triple backticks appeared inside an open code block but did not form a valid closing fence.",
          severity: "warning"
        });
      }

      return;
    }

    const openingMatch = OPENING_FENCE_RE.exec(line);
    if (openingMatch === null) {
      return;
    }

    const fenceText = openingMatch[2];
    const language = openingMatch[3].trim();
    codeFenceCount += 1;
    codeBlockCount += 1;
    openFence = {
      line: lineNumber,
      column: openingMatch[1].length + 1,
      length: fenceText.length
    };

    if (language.length === 0) {
      warnings.push({
        type: "MISSING_LANGUAGE",
        line: lineNumber,
        column: openingMatch[1].length + fenceText.length + 1,
        message: "Opening code fence is missing a language tag.",
        severity: "warning"
      });
    }
  });

  if (openFence !== undefined) {
    unclosedFenceCount = 1;
    warnings.push({
      type: "UNCLOSED_FENCE",
      line: openFence.line,
      column: openFence.column,
      message: "Code block opened here is not closed before the end of the input.",
      severity: "error"
    });
  }

  return {
    ok: warnings.every((warning) => warning.severity !== "error"),
    warnings,
    stats: {
      totalLines: lines.length,
      codeFenceCount,
      codeBlockCount,
      unclosedFenceCount
    }
  };
}
