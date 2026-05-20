import { cpSync, mkdirSync, rmSync } from 'fs';

// Clean and recreate dist/
rmSync('./dist', { recursive: true, force: true });
mkdirSync('./dist', { recursive: true });

// Copy only the deployable web files
cpSync('./index.html',      './dist/index.html');
cpSync('./leistungen.html', './dist/leistungen.html');
cpSync('./brand assets',    './dist/brand assets', { recursive: true });

console.log('Build complete → dist/');
