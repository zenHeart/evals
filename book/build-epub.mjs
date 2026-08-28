#!/usr/bin/env node
/**
 * build-epub.mjs — 构建 evals.epub
 *
 * 用法:
 *   node book/build-epub.mjs              # 默认输出 evals.epub
 *   node book/build-epub.mjs custom.epub  # 指定输出文件名
 *
 * 依赖:
 *   npm install jszip
 */

import { existsSync, readFileSync, readdirSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import JSZip from "jszip";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = join(__dirname, "epub-content");
const DEFAULT_EPUB = join(__dirname, "..", "evals.epub");

async function buildEpub(outputPath = DEFAULT_EPUB) {
  console.log("[evals] Building EPUB...");
  console.log("       Output:", outputPath);
  console.log("       Source:", OUTPUT_DIR);

  if (!existsSync(OUTPUT_DIR)) {
    throw new Error(`EPUB content directory not found: ${OUTPUT_DIR}. Run \`node book/preprocess.js\` first.`);
  }

  const zip = new JSZip();

  // 1. mimetype (uncompressed, must be first)
  const mimetype = readFileSync(join(OUTPUT_DIR, "mimetype"), "utf-8");
  zip.file("mimetype", mimetype, { compression: "STORE" });

  // 2. META-INF/container.xml
  const containerXml = readFileSync(join(OUTPUT_DIR, "META-INF", "container.xml"), "utf-8");
  zip.file("META-INF/container.xml", containerXml);

  // 3. content.opf
  const contentOpf = readFileSync(join(OUTPUT_DIR, "content.opf"), "utf-8");
  zip.file("content.opf", contentOpf);

  // 4. toc.ncx
  const tocNcx = readFileSync(join(OUTPUT_DIR, "toc.ncx"), "utf-8");
  zip.file("toc.ncx", tocNcx);

  // 5. nav.xhtml
  const navXhtml = readFileSync(join(OUTPUT_DIR, "nav.xhtml"), "utf-8");
  zip.file("nav.xhtml", navXhtml);

  // 6. cover
  const rootAssets = ["cover.xhtml", "cover.svg"];
  for (const file of rootAssets) {
    const target = join(OUTPUT_DIR, file);
    if (existsSync(target)) {
      zip.file(file, readFileSync(target));
    }
  }

  // 7. chapters
  const contentDir = join(OUTPUT_DIR, "content");
  if (!existsSync(contentDir)) {
    throw new Error(`Chapters directory not found: ${contentDir}. Run \`node book/preprocess.js\` first.`);
  }
  const chapterFiles = readdirSync(contentDir).filter((f) => f.endsWith(".xhtml")).sort();
  for (const file of chapterFiles) {
    zip.file(`content/${file}`, readFileSync(join(contentDir, file)));
  }
  console.log(`       Packaged ${chapterFiles.length} chapter files`);

  // 8. mermaid svg (if any)
  const mermaidDir = join(OUTPUT_DIR, "mermaid");
  if (existsSync(mermaidDir)) {
    const svgs = readdirSync(mermaidDir).filter((f) => f.endsWith(".svg"));
    for (const file of svgs) {
      zip.file(`mermaid/${file}`, readFileSync(join(mermaidDir, file)));
    }
    if (svgs.length > 0) {
      console.log(`       Packaged ${svgs.length} mermaid SVGs`);
    }
  }

  // 9. styles
  const stylesDir = join(OUTPUT_DIR, "styles");
  if (existsSync(stylesDir)) {
    const styles = readdirSync(stylesDir);
    for (const file of styles) {
      zip.file(`styles/${file}`, readFileSync(join(stylesDir, file)));
    }
    if (styles.length > 0) {
      console.log(`       Packaged ${styles.length} style files`);
    }
  }

  // Write
  const buf = await zip.generateAsync({
    type: "nodebuffer",
    compression: "DEFLATE",
    compressionOptions: { level: 9 },
    mimeType: "application/epub+zip",
  });

  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, buf);
  const kb = Math.round(buf.length / 1024);
  console.log(`[evals] EPUB built: ${outputPath} (${kb} KB, ${chapterFiles.length} chapters)`);
}

if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, "/")}` ||
    process.argv[1]?.endsWith("build-epub.mjs")) {
  const arg = process.argv[2];
  buildEpub(arg).catch((err) => {
    console.error("[evals] Build failed:", err);
    process.exit(1);
  });
}

export { buildEpub };
