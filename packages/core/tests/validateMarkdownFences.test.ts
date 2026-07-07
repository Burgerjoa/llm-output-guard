import { describe, expect, it } from "vitest";
import { validateMarkdownFences } from "../src/index.js";

describe("validateMarkdownFences", () => {
  it("accepts a valid fenced code block", () => {
    const result = validateMarkdownFences("Before\n```ts\nconst ok = true;\n```\nAfter");

    expect(result.ok).toBe(true);
    expect(result.warnings).toEqual([]);
    expect(result.stats).toMatchObject({
      totalLines: 5,
      codeFenceCount: 2,
      codeBlockCount: 1,
      unclosedFenceCount: 0
    });
  });

  it("reports an unclosed fenced code block", () => {
    const result = validateMarkdownFences("```ts\nconst value = 1;");

    expect(result.ok).toBe(false);
    expect(result.warnings).toContainEqual(
      expect.objectContaining({
        type: "UNCLOSED_FENCE",
        line: 1,
        severity: "error"
      })
    );
    expect(result.stats.unclosedFenceCount).toBe(1);
  });

  it("warns when an opening fence is missing a language tag", () => {
    const result = validateMarkdownFences("```\nplain text\n```");

    expect(result.ok).toBe(true);
    expect(result.warnings).toContainEqual(
      expect.objectContaining({
        type: "MISSING_LANGUAGE",
        line: 1,
        severity: "warning"
      })
    );
  });

  it("warns on malformed short backtick fences", () => {
    const result = validateMarkdownFences("``ts\nconst value = 1;\n``");

    expect(result.ok).toBe(true);
    expect(result.warnings).toEqual([
      expect.objectContaining({ type: "MALFORMED_FENCE", line: 1 }),
      expect.objectContaining({ type: "MALFORMED_FENCE", line: 3 })
    ]);
  });

  it("tracks multiple code blocks", () => {
    const result = validateMarkdownFences("```ts\nconst a = 1;\n```\n\n```json\n{\"ok\":true}\n```");

    expect(result.ok).toBe(true);
    expect(result.stats.codeBlockCount).toBe(2);
    expect(result.stats.codeFenceCount).toBe(4);
  });

  it("warns about suspicious nested fences inside a code block", () => {
    const result = validateMarkdownFences("```md\nprefix ```ts\ncontent\n```");

    expect(result.ok).toBe(true);
    expect(result.warnings).toContainEqual(
      expect.objectContaining({
        type: "SUSPICIOUS_NESTED_FENCE",
        line: 2
      })
    );
  });
});
