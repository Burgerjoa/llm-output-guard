#!/usr/bin/env node
import { readFile, writeFile } from "node:fs/promises";
import { basename } from "node:path";
import { fixMarkdownFences, validateMarkdownFences } from "@llm-output-guard/core";
import type { ValidationResult } from "@llm-output-guard/core";

type Command = "check" | "fix";

function printUsage(): void {
  console.error(`Usage:
  guard check <file>
  guard fix <file> [--write]`);
}

function hasErrors(result: ValidationResult): boolean {
  return result.warnings.some((warning) => warning.severity === "error");
}

function printReport(filePath: string, result: ValidationResult): void {
  const status = result.ok ? "ok" : "failed";
  console.log(`${basename(filePath)}: ${status}`);
  console.log(
    `lines=${result.stats.totalLines} fences=${result.stats.codeFenceCount} blocks=${result.stats.codeBlockCount} unclosed=${result.stats.unclosedFenceCount}`
  );

  if (result.warnings.length === 0) {
    console.log("No warnings.");
    return;
  }

  for (const warning of result.warnings) {
    console.log(
      `${warning.severity.toUpperCase()} ${warning.type} ${warning.line}:${warning.column} ${warning.message}`
    );
  }
}

async function main(args: string[]): Promise<number> {
  const [command, filePath, ...flags] = args;
  const write = flags.includes("--write");

  if ((command !== "check" && command !== "fix") || filePath === undefined) {
    printUsage();
    return 2;
  }

  if (flags.some((flag) => flag !== "--write")) {
    console.error(`Unknown option: ${flags.find((flag) => flag !== "--write")}`);
    printUsage();
    return 2;
  }

  if (command === "check" && write) {
    console.error("--write is only supported for the fix command.");
    return 2;
  }

  const input = await readFile(filePath, "utf8");

  if (command === "check") {
    const result = validateMarkdownFences(input);
    printReport(filePath, result);
    return hasErrors(result) ? 1 : 0;
  }

  const fixResult = fixMarkdownFences(input);
  const resultAfterFix = validateMarkdownFences(fixResult.fixedText);

  if (write) {
    if (fixResult.changed) {
      await writeFile(filePath, fixResult.fixedText, "utf8");
    }

    printReport(filePath, resultAfterFix);
    return hasErrors(resultAfterFix) ? 1 : 0;
  }

  process.stdout.write(fixResult.fixedText);
  return hasErrors(resultAfterFix) ? 1 : 0;
}

main(process.argv.slice(2))
  .then((code) => {
    process.exitCode = code;
  })
  .catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
