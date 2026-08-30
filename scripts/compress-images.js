#!/usr/bin/env node
/**
 * compress-images.js
 *
 * Compresses all large images in /public in-place.
 * Resizes to max 1920px on the longest side, re-encodes at high quality.
 * Skips files already under 300 KB and font directories.
 * Does not change filenames or extensions — no code changes needed.
 *
 * Usage:  node scripts/compress-images.js
 * Dry run: node scripts/compress-images.js --dry
 */

const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const PUBLIC_DIR = path.join(__dirname, "../public");
const MAX_DIM = 1920;          // longest edge cap
const SKIP_BELOW = 300 * 1024; // skip files already under 300 KB
const DRY = process.argv.includes("--dry");

// Directories to skip entirely (fonts, etc.)
const SKIP_DIRS = new Set(["Font", "circular-std-book-cufonfonts-webfont"]);

// Formats we handle
const HANDLERS = {
  ".webp": (pipeline) => pipeline.webp({ quality: 82 }),
  ".jpg":  (pipeline) => pipeline.jpeg({ quality: 85, mozjpeg: true }),
  ".jpeg": (pipeline) => pipeline.jpeg({ quality: 85, mozjpeg: true }),
  ".png":  (pipeline) => pipeline.png({ compressionLevel: 9, effort: 10 }),
};

function formatMB(bytes) {
  return (bytes / 1024 / 1024).toFixed(1) + " MB";
}

function formatKB(bytes) {
  return (bytes / 1024).toFixed(0) + " KB";
}

function walk(dir, results = []) {
  for (const entry of fs.readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue;
    const full = path.join(dir, entry);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      walk(full, results);
    } else {
      results.push({ full, size: stat.size });
    }
  }
  return results;
}

async function compress(filePath, originalSize) {
  const ext = path.extname(filePath).toLowerCase();
  const handler = HANDLERS[ext];
  if (!handler) return null;

  const tmp = filePath + ".tmp";

  try {
    const pipeline = sharp(filePath).resize(MAX_DIM, MAX_DIM, {
      fit: "inside",
      withoutEnlargement: true,
    });

    await handler(pipeline).toFile(tmp);

    const newSize = fs.statSync(tmp).size;

    if (newSize >= originalSize) {
      // Already optimal — don't replace
      fs.unlinkSync(tmp);
      return null;
    }

    if (!DRY) {
      fs.renameSync(tmp, filePath);
    } else {
      fs.unlinkSync(tmp);
    }

    return { before: originalSize, after: newSize };
  } catch (err) {
    if (fs.existsSync(tmp)) fs.unlinkSync(tmp);
    console.error(`  ERROR: ${path.relative(PUBLIC_DIR, filePath)} — ${err.message}`);
    return null;
  }
}

async function main() {
  if (DRY) console.log("DRY RUN — no files will be modified\n");

  const files = walk(PUBLIC_DIR).filter((f) => f.size >= SKIP_BELOW);

  console.log(`Found ${files.length} files >= 300 KB to process...\n`);

  let totalBefore = 0;
  let totalAfter = 0;
  let changed = 0;
  let skipped = 0;

  for (const { full, size } of files) {
    const rel = path.relative(PUBLIC_DIR, full);
    const result = await compress(full, size);

    if (result) {
      const saved = result.before - result.after;
      const pct = Math.round((saved / result.before) * 100);
      console.log(
        `  ${DRY ? "[dry] " : ""}${rel}\n` +
        `    ${formatMB(result.before)} → ${formatMB(result.after)}  (${pct}% smaller)\n`
      );
      totalBefore += result.before;
      totalAfter += result.after;
      changed++;
    } else {
      const ext = path.extname(full).toLowerCase();
      if (HANDLERS[ext]) {
        // Supported format but no gain or already small
        skipped++;
      }
    }
  }

  const totalSaved = totalBefore - totalAfter;
  console.log("─".repeat(56));
  console.log(`Files compressed : ${changed}`);
  console.log(`Files skipped    : ${skipped} (already optimal)`);
  if (changed > 0) {
    console.log(`Total before     : ${formatMB(totalBefore)}`);
    console.log(`Total after      : ${formatMB(totalAfter)}`);
    console.log(`Total saved      : ${formatMB(totalSaved)}`);
  }
  if (DRY) console.log("\nRun without --dry to apply changes.");
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
