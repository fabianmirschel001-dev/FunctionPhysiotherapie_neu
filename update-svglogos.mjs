import { readFile, writeFile } from 'fs/promises';

const PAGES = [
  'index.html', 'leistungen.html', 'konzept.html', 'team.html',
  'kontakt.html', 'agb.html', 'datenschutz.html', 'impressum.html',
];

const ALT = 'Function Physiotherapie Flensburg';

for (const page of PAGES) {
  let html = await readFile(page, 'utf8');

  // 1. Nav link: class nav-home → nav-logo, remove aria-label
  html = html.replace(
    /class="nav-home" aria-label="Startseite"/g,
    'class="nav-logo" aria-label="Startseite"'
  );

  // 2. Nav logo-light: PNG → SVG, update alt
  html = html.replace(
    /<img class="nav-logo-light" src="images\/logo-weiss\.png" alt="[^"]*">/g,
    `<img class="nav-logo-light" src="images/logo-weiss.svg" alt="${ALT}">`
  );

  // 3. Nav logo-dark: PNG → SVG, update alt
  html = html.replace(
    /<img class="nav-logo-dark" src="images\/logo-farbig\.png" alt="[^"]*">/g,
    `<img class="nav-logo-dark" src="images/logo-farbig.svg" alt="${ALT}">`
  );

  // 4. Footer logo: PNG → SVG, update alt
  html = html.replace(
    /<img src="images\/logo-weiss\.png" alt="[^"]*">/g,
    `<img src="images/logo-weiss.svg" alt="${ALT}">`
  );

  await writeFile(page, html, 'utf8');
  console.log(`✓ ${page}`);
}
