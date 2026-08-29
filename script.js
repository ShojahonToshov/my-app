const fs = require('fs');

const designPagePath = 'src/app/design/page.tsx';
let designPage = fs.readFileSync(designPagePath, 'utf8');

// 1. Add Ticket to imports
designPage = designPage.replace('QrCode,', 'QrCode,\n  Ticket,');

// 2. Add variants
const variants = 
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};
;

// Insert variants before AdaptedLogo or Bento Grid
designPage = designPage.replace('// Increased logo size', variants + '\n// Increased logo size');


// 3. Extract Variant2LightSaaS from xxx/page.tsx
const xxxPage = fs.readFileSync('src/app/xxx/page.tsx', 'utf8');
const match = xxxPage.match(/function Variant2LightSaaS\(\) \{[\s\S]*?return \(([\s\S]*?)\);\n\}/);
let replacementJsx = '';
if (match) {
    replacementJsx = match[1].trim();
    // In design page, the section needs an id="platform" and maybe some adjustments, but the user said "replace this section with it".
    // I will just use the <section> as is, but maybe add id="platform" so the scroll spy works.
    replacementJsx = replacementJsx.replace('<section className="min-h-screen', '<section id="platform" className="min-h-screen');
} else {
    console.error('Variant2LightSaaS not found');
    process.exit(1);
}

// 4. Replace Bento Grid
// Find start and end of BENTO GRID
const bentoStart = designPage.indexOf('{/* BENTO GRID */}');
const bentoEnd = designPage.indexOf('{/* ENHANCED FAQ SECTION (Full Width) */}');

if (bentoStart !== -1 && bentoEnd !== -1) {
    const before = designPage.substring(0, bentoStart);
    const after = designPage.substring(bentoEnd);
    
    // add comment for clarity
    const newDesignPage = before + '{/* BENTO GRID (Replaced with Variant2LightSaaS) */}\n        ' + replacementJsx + '\n\n        ' + after;
    
    fs.writeFileSync(designPagePath, newDesignPage, 'utf8');
    console.log('Successfully replaced Bento Grid');
} else {
    console.error('Bento grid boundaries not found');
}
