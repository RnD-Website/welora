#!/usr/bin/env node
/**
 * WELORA asset fetcher
 * ------------------------------------------------------------
 * Downloads the curated editorial photography (Unsplash License)
 * listed in src/data/assets.json into /public/images, then renders
 * the slow, cinematic "stories" film into /public/videos using ffmpeg.
 *
 * The repo ships with soft brand-coloured placeholders so the site
 * renders before this runs. Placeholders are tracked in
 * public/images/.placeholders.json and replaced automatically.
 *
 *   npm run assets          → fetch anything still a placeholder
 *   npm run assets:force    → re-download everything
 *
 * Runs automatically after `npm install` and never fails the install.
 */
import { readFile, writeFile, mkdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const imgDir = path.join(root, "public", "images");
const vidDir = path.join(root, "public", "videos");
const markerPath = path.join(imgDir, ".placeholders.json");
const force = process.argv.includes("--force");

const log = (...a) => console.log("\x1b[38;5;180m[welora]\x1b[0m", ...a);

async function readJSON(p, fallback) {
  try {
    return JSON.parse(await readFile(p, "utf8"));
  } catch {
    return fallback;
  }
}

async function download(url, dest) {
  const res = await fetch(url, { headers: { "User-Agent": "welora-asset-fetcher" } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 10_000) throw new Error("response too small");
  await writeFile(dest, buf);
  return buf.length;
}

function run(bin, args) {
  return new Promise((resolve, reject) => {
    const p = spawn(bin, args, { stdio: "ignore" });
    p.on("error", reject);
    p.on("close", (code) => (code === 0 ? resolve() : reject(new Error(`ffmpeg exited ${code}`))));
  });
}

async function resolveFfmpeg() {
  try {
    const mod = await import("ffmpeg-static");
    if (mod.default && existsSync(mod.default)) return mod.default;
  } catch {}
  return "ffmpeg"; // fall back to a system install
}

async function main() {
  const manifest = await readJSON(path.join(root, "src", "data", "assets.json"), null);
  if (!manifest) return log("assets.json not found — skipping");
  await mkdir(imgDir, { recursive: true });
  await mkdir(vidDir, { recursive: true });

  const placeholders = new Set(await readJSON(markerPath, []));
  let fetched = 0;
  let failed = 0;

  for (const img of manifest.images) {
    const dest = path.join(imgDir, img.file);
    const needs = force || !existsSync(dest) || placeholders.has(img.file);
    if (!needs) continue;
    const url = `${manifest.source}/${img.id}?w=${img.w}&q=82&fm=jpg&fit=max`;
    try {
      const bytes = await download(url, dest);
      placeholders.delete(img.file);
      fetched++;
      log(`✓ ${img.file}  (${Math.round(bytes / 1024)} KB)`);
    } catch (e) {
      failed++;
      log(`✗ ${img.file}  — ${e.message} (placeholder kept)`);
    }
  }

  // Cinematic stories film — slow push-in with a soft focus drift.
  for (const v of manifest.videos ?? []) {
    const dest = path.join(vidDir, v.file);
    const src = path.join(imgDir, v.from);
    const needs = force || !existsSync(dest) || placeholders.has(`videos/${v.file}`);
    if (!needs || placeholders.has(v.from)) continue;
    try {
      const ffmpeg = await resolveFfmpeg();
      await run(ffmpeg, [
        "-y", "-loop", "1", "-i", src,
        "-vf",
        "scale=2560:-2,zoompan=z='min(zoom+0.0006,1.18)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=360:s=1280x720:fps=30,gblur=sigma=1.2,eq=saturation=0.9,format=yuv420p",
        "-t", "12", "-c:v", "libx264", "-preset", "veryfast", "-crf", "26",
        "-movflags", "+faststart", "-an", dest,
      ]);
      placeholders.delete(`videos/${v.file}`);
      const s = await stat(dest);
      log(`✓ videos/${v.file}  (${Math.round(s.size / 1024)} KB)`);
    } catch (e) {
      log(`✗ videos/${v.file} — ${e.message}. Install ffmpeg or run \`npm i\` to get ffmpeg-static.`);
    }
  }

  await writeFile(markerPath, JSON.stringify([...placeholders], null, 2));
  if (fetched || failed) log(`done — ${fetched} downloaded, ${failed} failed.`);
  else log("all assets present.");
}

main().catch((e) => log("asset step skipped:", e.message)).finally(() => process.exit(0));
