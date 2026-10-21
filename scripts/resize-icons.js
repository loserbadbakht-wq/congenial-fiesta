const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const jobs = [
  { src: 'icons/favicon-96x96.png', size: 48, dest: 'dist/icons/icon-48.png' },
  { src: 'icons/favicon-96x96.png', size: 96, dest: 'dist/icons/icon-96.png' },
  { src: 'icons/web-app-manifest-192x192.png', size: 128, dest: 'dist/icons/icon-128.png' },
];

(async () => {
  fs.mkdirSync(path.resolve('dist/icons'), { recursive: true });

  for (const job of jobs) {
    if (!fs.existsSync(path.resolve(job.src))) {
      throw new Error(`Missing icon source: ${job.src}`);
    }
    await sharp(path.resolve(job.src))
      .resize(job.size, job.size)
      .toFile(path.resolve(job.dest));
    console.log(`Generated ${job.dest} (${job.size}x${job.size})`);
  }
})().catch(err => {
  console.error(err);
  process.exit(1);
});
