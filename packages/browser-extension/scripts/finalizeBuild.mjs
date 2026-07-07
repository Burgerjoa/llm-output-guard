import { copyFile } from "node:fs/promises";
import { join } from "node:path";

const distDir = join(process.cwd(), "dist");

await copyFile(join(distDir, "contentScript.global.js"), join(distDir, "contentScript.js"));
