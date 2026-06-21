import { readFile, writeFile } from 'fs/promises';

const PAGES = [
  'index.html',
  'leistungen.html',
  'konzept.html',
  'team.html',
  'kontakt.html',
  'agb.html',
  'datenschutz.html',
  'impressum.html',
];

const NAV_IMG_NEW = `<img class="nav-logo-light" src="images/logo-weiss.png" alt="Function Physiotherapie">
      <img class="nav-logo-dark" src="images/logo-farbig.png" alt="Function Physiotherapie">`;

const FAVICON_LINKS = `  <link rel="icon" type="image/png" sizes="32x32" href="images/favicon-32.png">
  <link rel="apple-touch-icon" sizes="180x180" href="images/apple-touch-icon.png">`;

for (const page of PAGES) {
  let html = await readFile(page, 'utf8');

  // 1. Nav: replace nav-home-img with two logo images
  html = html.replace(
    '<img class="nav-home-img" src="brand assets/Logo_erste Idee_ohne Hintergrund.png" alt="Function Physiotherapie">',
    NAV_IMG_NEW
  );

  // 2. Footer: replace old logo with white logo
  html = html.replace(
    '<img src="brand assets/Logo_erste Idee_ohne Hintergrund.png" alt="Function Physiotherapie">\n          <p class="footer-tagline">',
    '<img src="images/logo-weiss.png" alt="Function Physiotherapie">\n          <p class="footer-tagline">'
  );

  // 3. Favicon: inject after last existing <link> in <head>
  if (!html.includes('favicon-32.png')) {
    html = html.replace(
      '</head>',
      `${FAVICON_LINKS}\n</head>`
    );
  }

  await writeFile(page, html, 'utf8');
  console.log(`✓ ${page}`);
}

// index.html extra: remove nav-logo block + nav-home-label + hero-logo-wrap img + footer logo (different context)
let idx = await readFile('index.html', 'utf8');

// Remove the display:none nav-logo link
idx = idx.replace(
  `    <a href="#" class="nav-logo">\n      <img src="brand assets/Logo_erste Idee_ohne Hintergrund.png" alt="Function Physiotherapie">\n    </a>\n`,
  ''
);

// Remove nav-home-label span
idx = idx.replace(
  '      <span class="nav-home-label">Home</span>\n',
  ''
);

// Hero logo wrap: replace old logo with white logo (index.html uses different footer pattern - no tagline p in footer-brand)
idx = idx.replace(
  '<img src="brand assets/Logo_erste Idee_ohne Hintergrund.png" alt="Function Physiotherapie">\n    </div>\n\n        <div>',
  '<img src="images/logo-weiss.png" alt="Function Physiotherapie">\n    </div>\n\n        <div>'
);

// Hero section logo wrap
idx = idx.replace(
  `    <div class="hero-logo-wrap">\n      <img src="brand assets/Logo_erste Idee_ohne Hintergrund.png" alt="Function Physiotherapie">\n    </div>`,
  `    <div class="hero-logo-wrap">\n      <img src="images/logo-weiss.png" alt="Function Physiotherapie">\n    </div>`
);

await writeFile('index.html', idx, 'utf8');
console.log('✓ index.html (extra cleanup done)');
