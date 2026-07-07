import { copyFile, mkdir } from "node:fs/promises";
import { join } from "node:path";

const distDir = join(process.cwd(), "dist");

await mkdir(distDir, { recursive: true });
await copyFile(join(distDir, "contentScript.global.js"), join(distDir, "contentScript.js"));
await copyFile(join(process.cwd(), "src", "ui", "styles.css"), join(distDir, "styles.css"));
