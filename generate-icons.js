const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const svgCode = `
<svg width="512" height="512" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="32" height="32" fill="#ffffff" />
  <circle cx="16" cy="16" r="13" stroke="#121415" stroke-width="1.5" opacity="0.2" />
  <circle cx="16" cy="16" r="13" stroke="#8A2532" stroke-width="1.5" stroke-dasharray="20 62" stroke-linecap="round" transform="rotate(-90 16 16)" />
  <path d="M16 6C16 11 11 16 6 16C11 16 16 21 16 26C16 21 21 16 26 16C21 16 16 11 16 6Z" fill="#121415" />
</svg>
`;

async function generate() {
  const publicDir = path.join(__dirname, 'public');
  
  // Save SVG
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgCode.trim());
  
  // Generate 512x512 PNG
  await sharp(Buffer.from(svgCode.trim()))
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'icon-512.png'));
    
  // Generate 192x192 PNG
  await sharp(Buffer.from(svgCode.trim()))
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'icon-192.png'));
    
  console.log('Icons successfully generated from original component SVG.');
}

generate().catch(console.error);
