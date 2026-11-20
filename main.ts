// gta6-clipper-01 entry, second clip (Node 22, standard library only).
//
// The entry is the video itself: a public YouTube Short cut by the agent in
// its recorded session from Rockstar's official GTA VI trailers (Launch
// Trailer, 15 Oct 2026, and Trailer 2). The clip opens on the trailer's
// most arresting beat — Lucia firing a rifle with a fireball behind her,
// then two women in pink balaclavas with rifles, a sniper aiming over the
// Vice City skyline, and Jason and Lucia on a balcony at sunset — and then
// turns to the viewer with make.fun's pitch as on-screen text: make clips
// like this with AI and earn money on make.fun
// (make.fun/bounty/gta6-clipper-01). The hook's four shots, in order:
// Lucia firing a rifle with a fireball behind her (Launch Trailer 72.3s),
// two women in pink balaclavas with rifles (59.4s), a sniper aiming over
// the Vice City skyline at night (71.4s), and Jason and Lucia on a balcony
// at sunset (66.6s) — all different from the first clip's chase/stunt beat.
//
// All this program has to do is copy VIDEO.json from the repository root to
// /output/VIDEO.json, where the house reads it and then reads the video's
// views through the YouTube Data API. Nothing this program writes about the
// video is scored.
//
// VIDEO.json holds a placeholder address until the clip is uploaded to
// YouTube as a public Short; replace it with the video's address before
// submitting.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR
// stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(OUTPUT_DIR, { recursive: true });
const videoJsonPath = join(BOT_DIR, 'VIDEO.json');
try {
  // Guard: refuse a malformed address before copying, so a submit never ships
  // a VIDEO.json the gate would refuse as no video. The placeholder is only
  // warned about here — it is replaced with the public Short's address
  // before submitting.
  const parsed = JSON.parse(readFileSync(videoJsonPath, 'utf8')) as { url?: unknown };
  const url = typeof parsed.url === 'string' ? parsed.url : '';
  const youtube = /^https:\/\/(www\.|m\.)?(youtube\.com\/(shorts\/|watch\?v=)|youtu\.be\/)[A-Za-z0-9_-]{11}([?#].*)?$/;
  if (url === 'https://www.youtube.com/shorts/<id>') {
    console.error('VIDEO.json still holds the placeholder address; replace it with the public Short before submitting.');
  } else if (!youtube.test(url)) {
    console.error(`VIDEO.json does not name a public YouTube video address: ${url || '(missing url)'}`);
    process.exit(1);
  }
  copyFileSync(videoJsonPath, join(OUTPUT_DIR, 'VIDEO.json'));
} catch (err) {
  console.error(`VIDEO.json could not be copied from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}
