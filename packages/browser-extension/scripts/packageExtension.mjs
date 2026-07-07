import { createWriteStream } from "node:fs";
import { mkdir, rm } from "node:fs/promises";
import { join } from "node:path";
import { createRequire } from "node:module";
import packageJson from "../package.json" with { type: "json" };

const require = createRequire(import.meta.url);
const { ZipArchive } = require("archiver");
const root = process.cwd();
const releaseDir = join(root, "release");
const zipName = `llm-output-guard-chrome-${packageJson.version}.zip`;
const zipPath = join(releaseDir, zipName);

await mkdir(releaseDir, { recursive: true });
await rm(zipPath, { force: true });

await new Promise((resolve, reject) => {
  const output = createWriteStream(zipPath);
  const archive = new ZipArchive({ zlib: { level: 9 } });

  output.on("close", resolve);
  archive.on("error", reject);
  archive.pipe(output);
  archive.file(join(root, "manifest.json"), { name: "manifest.json" });
  archive.file(join(root, "dist", "contentScript.js"), { name: "dist/contentScript.js" });
  archive.file(join(root, "dist", "styles.css"), { name: "dist/styles.css" });
  archive.directory(join(root, "icons"), "icons");
  archive.finalize();
});

console.log(`Created ${zipPath}`);
