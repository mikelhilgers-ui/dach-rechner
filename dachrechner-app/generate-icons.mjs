import sharp from 'sharp';
import { writeFileSync } from 'fs';

// SVG Icon: Slate background + weißes Dach + "DR" Text
const svg = (size) => {
  const r = Math.round(size * 0.18);   // border-radius
  const cx = size / 2;
  const pad = size * 0.12;

  // Dach-Dreieck
  const roofTop   = size * 0.18;
  const roofLeft  = size * 0.10;
  const roofRight = size * 0.90;
  const roofBase  = size * 0.52;

  // Wände
  const wallLeft   = size * 0.22;
  const wallRight  = size * 0.78;
  const wallBottom = size * 0.82;

  // Tür
  const doorW  = size * 0.16;
  const doorH  = size * 0.20;
  const doorX  = cx - doorW / 2;
  const doorY  = wallBottom - doorH;
  const doorR  = size * 0.03;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <clipPath id="clip">
      <rect width="${size}" height="${size}" rx="${r}" ry="${r}"/>
    </clipPath>
  </defs>

  <!-- Hintergrund Anthrazit -->
  <rect width="${size}" height="${size}" rx="${r}" ry="${r}" fill="#37474f"/>

  <!-- Dach-Silhouette -->
  <polygon
    points="${roofLeft},${roofBase} ${cx},${roofTop} ${roofRight},${roofBase}"
    fill="white" opacity="0.95"/>

  <!-- Wände -->
  <rect x="${wallLeft}" y="${roofBase}" width="${wallRight - wallLeft}" height="${wallBottom - roofBase}"
        fill="white" opacity="0.95"/>

  <!-- Tür (Anthrazit = "ausgespart") -->
  <rect x="${doorX}" y="${doorY}" width="${doorW}" height="${doorH}"
        rx="${doorR}" ry="${doorR}" fill="#37474f"/>
</svg>`;
};

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

for (const size of sizes) {
  const svgBuf = Buffer.from(svg(size));
  await sharp(svgBuf)
    .png()
    .toFile(`public/icons/icon-${size}x${size}.png`);
  console.log(`✔ icon-${size}x${size}.png`);
}

// Auch favicon.ico (als 32x32 PNG – Browser akzeptieren PNG als favicon)
await sharp(Buffer.from(svg(32))).png().toFile('src/favicon.png');
console.log('✔ favicon.png');
