import sharp from "sharp";
import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { once } from "node:events";
import { fileURLToPath } from "node:url";

const out = fileURLToPath(new URL("../public/placements/", import.meta.url));
await mkdir(out, { recursive: true });
const ink = "#302d28";
function item(kind, label = "YOUR BRAND", scale = 1) {
  const shape = kind === "Clothing"
    ? '<path d="M245 67L180 100 117 180 177 226 206 187 206 326 393 326 393 187 422 226 483 180 420 100 355 67Q300 116 245 67Z" fill="#fffdf8"/><path d="M245 67Q300 143 355 67M247 266L353 266 367 306 234 306Z" fill="none"/>'
    : kind === "Laptops"
      ? '<rect x="142" y="88" width="316" height="224" rx="18" fill="#fffdf8"/><path d="M142 312L105 333Q100 344 121 344H479Q500 344 495 333L458 312Z" fill="#e5dfd1"/>'
      : '<path d="M262 86V63Q300 32 338 63V86" fill="none" stroke-width="12"/><rect x="195" y="82" width="210" height="251" rx="50" fill="#fffdf8"/><path d="M210 140Q300 111 390 140M217 320V245Q300 222 383 245V320" fill="none"/>';
  return '<ellipse cx="300" cy="350" rx="150" ry="12" fill="' + ink + '" opacity=".08"/><g stroke="' + ink + '" stroke-width="3" stroke-linejoin="round">' + shape + '</g><g transform="translate(300 200) scale(' + scale + ') translate(-300 -200)"><rect x="243" y="165" width="114" height="70" rx="8" fill="#ff724e" stroke="' + ink + '" stroke-width="2" stroke-dasharray="6 4"/><text x="300" y="197" text-anchor="middle" font-size="13" font-weight="700">' + label + '</text><text x="300" y="216" text-anchor="middle" font-size="10">AD SPACE</text></g>';
}
const palette = { Clothing: "#f5d8c4", Laptops: "#cce5ee", Bags: "#dce9bf", Travel: "#f8e5a8" };
for (const kind of Object.keys(palette)) {
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400"><rect width="600" height="400" fill="' + palette[kind] + '"/><g font-family="DejaVu Sans, sans-serif" fill="' + ink + '">' + item(kind) + '</g></svg>';
  await writeFile(out + kind.toLowerCase() + ".svg", svg);
}
const scenes = [
  { kind: "Clothing", tag: "01 / CREATORS LIST AD SPACE", title: "A hoodie. A brand new opportunity.", note: "Chest patch · Dubai · 7 days", footer: "Creators keep and wear their own items." },
  { kind: "Laptops", tag: "02 / EVERYDAY ITEMS, REAL PLACEMENTS", title: "Your logo. Their everyday.", note: "Laptop sticker · Coworking · 30 days", footer: "Choose clothes, laptops, bags, or travel." },
  { kind: "Travel", tag: "03 / BRANDS MAKE AN OFFER", title: "Go wherever they go.", note: "Backpack patch · Tokyo trip · 7 days", footer: "Agree on space, dates, and price." },
  { kind: "Bags", tag: "04 / AGREED PLACEMENT. PHOTO PROOF.", title: "Small space. A real partnership.", note: "Placement completed · Proof submitted", footer: "MOMENTO · Your brand. Their everyday." },
];
function frame(t) {
  const index = Math.min(3, Math.floor(t / 4));
  const local = t % 4;
  const scene = scenes[index];
  const enter = Math.min(1, local / .55);
  const ease = 1 - Math.pow(1 - enter, 3);
  const scale = .65 + .35 * ease;
  const shift = (1 - ease) * 35;
  const progress = ((t % 16) / 16) * 828;
  return '<svg xmlns="http://www.w3.org/2000/svg" width="960" height="760" viewBox="0 0 960 760"><rect width="960" height="760" fill="#f9f5eb"/><g font-family="DejaVu Sans, sans-serif" fill="' + ink + '"><text x="55" y="58" font-size="17" font-weight="700" letter-spacing="2">MOMENTO</text><rect x="739" y="30" width="165" height="35" rx="17" fill="#e9e2d4"/><text x="821" y="53" text-anchor="middle" font-size="13">HOW IT WORKS</text><text x="55" y="112" font-size="13" letter-spacing="1.5">' + scene.tag + '</text><text x="55" y="159" font-size="32" font-weight="700" letter-spacing="-1">' + scene.title + '</text><rect x="55" y="190" width="850" height="408" rx="24" fill="' + palette[scene.kind] + '"/><g transform="translate(130 ' + (185 + shift) + ') scale(1.17 .99)" opacity="' + ease + '">' + item(scene.kind, "YOUR BRAND", scale) + '</g><rect x="195" y="568" width="570" height="51" rx="25" fill="#fffdf8" stroke="#d8d0c1"/><text x="480" y="600" text-anchor="middle" font-size="18">' + scene.note + '</text><text x="480" y="667" text-anchor="middle" font-size="18">' + scene.footer + '</text><rect x="66" y="705" width="828" height="4" rx="2" fill="#e9e2d4"/><rect x="66" y="705" width="' + progress + '" height="4" rx="2" fill="#ff724e"/><text x="480" y="738" text-anchor="middle" font-size="11" fill="#777065">Illustrative concept · No guaranteed impressions or earnings</text></g></svg>';
}
await sharp(Buffer.from(frame(2))).png().toFile(out + "hero-poster.png");
const ffmpeg = spawn("ffmpeg", ["-y", "-loglevel", "error", "-f", "image2pipe", "-vcodec", "mjpeg", "-framerate", "24", "-i", "pipe:0", "-an", "-c:v", "libx264", "-preset", "medium", "-crf", "24", "-pix_fmt", "yuv420p", "-movflags", "+faststart", out + "momento-explainer.mp4"], { stdio: ["pipe", "inherit", "inherit"] });
const finished = once(ffmpeg, "close");
for (let n = 0; n < 384; n++) {
  const jpg = await sharp(Buffer.from(frame(n / 24))).jpeg({ quality: 88 }).toBuffer();
  if (!ffmpeg.stdin.write(jpg)) await once(ffmpeg.stdin, "drain");
}
ffmpeg.stdin.end();
const [code] = await finished;
if (code !== 0) throw new Error("Video encoding failed: " + code);
console.log("Rendered four placement illustrations, poster, and 16-second MP4.");
