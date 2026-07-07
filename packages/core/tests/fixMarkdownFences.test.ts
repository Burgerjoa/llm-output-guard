import { describe, expect, it } from "vitest";
import { fixMarkdownFences } from "../src/index.js";

describe("fixMarkdownFences", () => {
  it("appends a closing fence when a code block is left open", () => {
    const result = fixMarkdownFences("```ts\nconst value = 1;");

    expect(result.changed).toBe(true);
    expect(result.fixedText).toBe("```ts\nconst value = 1;\n```\n");
    expect(result.appliedFixes).toEqual([
      expect.objectContaining({ type: "CLOSE_UNCLOSED_FENCE" })
    ]);
  });

  it("does not change already balanced fences", () => {
    const input = "```ts\nconst value = 1;\n```\n";
    const result = fixMarkdownFences(input);

    expect(result.changed).toBe(false);
    expect(result.fixedText).toBe(input);
    expect(result.appliedFixes).toEqual([]);
  });
});
