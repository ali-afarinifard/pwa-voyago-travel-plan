const sharp = require("sharp");
const path = require("path");

const SCRIPTS = path.join(__dirname);
const PUBLIC_ICONS = path.join(__dirname, "..", "public", "icons");
const APP = path.join(__dirname, "..", "app");

const jobs = [
  // PWA manifest icons
  { src: "icon.svg", out: path.join(PUBLIC_ICONS, "icon-192.png"), size: 192 },
  { src: "icon.svg", out: path.join(PUBLIC_ICONS, "icon-512.png"), size: 512 },
  { src: "icon-maskable.svg", out: path.join(PUBLIC_ICONS, "icon-maskable-192.png"), size: 192 },
  { src: "icon-maskable.svg", out: path.join(PUBLIC_ICONS, "icon-maskable-512.png"), size: 512 },
  // App shortcut icons
  { src: "shortcut-explore.svg", out: path.join(PUBLIC_ICONS, "shortcut-explore.png"), size: 96 },
  { src: "shortcut-trips.svg", out: path.join(PUBLIC_ICONS, "shortcut-trips.png"), size: 96 },
  // Browser favicon + Apple touch icon (Next.js metadata file conventions)
  { src: "icon.svg", out: path.join(APP, "icon.png"), size: 64 },
  { src: "icon.svg", out: path.join(APP, "apple-icon.png"), size: 180 },
];

(async () => {
  for (const job of jobs) {
    await sharp(path.join(SCRIPTS, job.src))
      .resize(job.size, job.size)
      .png()
      .toFile(job.out);
    console.log(`wrote ${job.out} (${job.size}x${job.size})`);
  }
})();
