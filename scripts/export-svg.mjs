import fs from 'fs';
import path from 'path';

const srcSvg = fs.readFileSync('Ayur Mandire Logo 4.svg', 'utf8');
const assetsDir = path.join('artifacts', 'ayur-mandir', 'public', 'assets');

fs.writeFileSync(path.join(assetsDir, 'ayur-mandir-logo.svg'), srcSvg);
fs.writeFileSync(path.join(assetsDir, 'ayur-mandira-logo.svg'), srcSvg);

const transparentSvg = srcSvg.replace(/<rect class="fil0"[^>]*\/>/g, '');
fs.writeFileSync(path.join(assetsDir, 'ayur-mandir-logo-transparent.svg'), transparentSvg);
fs.writeFileSync(path.join(assetsDir, 'ayur-mandira-logo-transparent.svg'), transparentSvg);

console.log('SVGs created successfully in ' + assetsDir);
