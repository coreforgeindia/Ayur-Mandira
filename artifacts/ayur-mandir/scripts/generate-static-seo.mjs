import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputDirectory = path.join(appRoot, 'dist', 'public');
const canonicalOrigin = 'https://www.ayurmandira.com';
const imageUrl = `${canonicalOrigin}/assets/ayur-mandir-logo.png`;

function escapeAttribute(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function setMeta(html, key, content, attribute = 'name') {
  const keyPattern = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const tagPattern = new RegExp(
    `<meta\\s+[^>]*${attribute}=["']${keyPattern}["'][^>]*>`,
    'i',
  );
  const contentValue = escapeAttribute(content);
  const existingTag = html.match(tagPattern)?.[0];

  if (existingTag) {
    const updatedTag = /content=["'][^"']*["']/i.test(existingTag)
      ? existingTag.replace(/content=["'][^"']*["']/i, `content="${contentValue}"`)
      : existingTag.replace(/>$/, ` content="${contentValue}">`);
    return html.replace(existingTag, updatedTag);
  }

  return html.replace(
    '</head>',
    `    <meta ${attribute}="${key}" content="${contentValue}" />\n  </head>`,
  );
}

function setCanonical(html, canonicalUrl) {
  const tagPattern = /<link\s+[^>]*rel=["']canonical["'][^>]*>/i;
  const existingTag = html.match(tagPattern)?.[0];
  if (!existingTag) return html;

  const updatedTag = existingTag.replace(
    /href=["'][^"']*["']/i,
    `href="${escapeAttribute(canonicalUrl)}"`,
  );
  return html.replace(existingTag, updatedTag);
}

function withPageMetadata(template, page) {
  const canonicalUrl = `${canonicalOrigin}${page.path === '/' ? '/' : page.path}`;
  let html = template.replace(
    /<title>[\s\S]*?<\/title>/i,
    `<title>${escapeAttribute(page.title)}</title>`,
  );
  html = setMeta(html, 'description', page.description);
  html = setMeta(html, 'og:site_name', 'Ayur Mandira', 'property');
  html = setMeta(html, 'og:url', canonicalUrl, 'property');
  html = setMeta(html, 'og:title', page.title, 'property');
  html = setMeta(html, 'og:description', page.description, 'property');
  html = setMeta(html, 'og:image', imageUrl, 'property');
  html = setMeta(html, 'twitter:title', page.title);
  html = setMeta(html, 'twitter:description', page.description);
  html = setMeta(html, 'twitter:image', imageUrl);
  if (page.path !== '/') {
    html = html.replace(
      /<script type="application\/ld\+json">[\s\S]*?"@type":\s*"WebSite"[\s\S]*?<\/script>/i,
      '',
    );
  }
  return setCanonical(html, canonicalUrl);
}

const vite = await createServer({
  configFile: path.join(appRoot, 'vite.config.ts'),
  appType: 'custom',
  logLevel: 'error',
  server: { middlewareMode: true },
});

try {
  const { getStaticSeoRoutes } = await vite.ssrLoadModule('/src/data/seo.ts');
  const template = await readFile(path.join(outputDirectory, 'index.html'), 'utf8');
  const routes = getStaticSeoRoutes();
  const paths = new Set();

  for (const route of routes) {
    if (paths.has(route.path)) throw new Error(`Duplicate SEO route: ${route.path}`);
    paths.add(route.path);
    const routeDirectory = path.join(outputDirectory, route.path.replace(/^\/|\/$/g, ''));
    const routeHtml = withPageMetadata(template, route);
    if (route.path === '/') {
      await writeFile(path.join(outputDirectory, 'index.html'), routeHtml);
    } else {
      await mkdir(routeDirectory, { recursive: true });
      await writeFile(path.join(routeDirectory, 'index.html'), routeHtml);
    }
  }

  const notFoundTitle = 'Page not found | Ayur Mandira';
  const notFoundDescription =
    "That page could not be found. Browse Ayur Mandira's Ayurvedic products or contact us for assistance.";
  let notFoundHtml = template.replace(
    /<title>[\s\S]*?<\/title>/i,
    `<title>${notFoundTitle}</title>`,
  );
  notFoundHtml = setMeta(notFoundHtml, 'description', notFoundDescription);
  notFoundHtml = setMeta(notFoundHtml, 'robots', 'noindex, follow');
  notFoundHtml = notFoundHtml.replace(/<link\s+[^>]*rel=["']canonical["'][^>]*>/i, '');
  notFoundHtml = setMeta(notFoundHtml, 'og:title', notFoundTitle, 'property');
  notFoundHtml = setMeta(notFoundHtml, 'og:description', notFoundDescription, 'property');
  notFoundHtml = setMeta(
    notFoundHtml,
    'og:url',
    `${canonicalOrigin}/404.html`,
    'property',
  );
  notFoundHtml = setMeta(notFoundHtml, 'twitter:title', notFoundTitle);
  notFoundHtml = setMeta(notFoundHtml, 'twitter:description', notFoundDescription);
  notFoundHtml = notFoundHtml.replace(
    /<script type="application\/ld\+json">[\s\S]*?"@type":\s*"WebSite"[\s\S]*?<\/script>/i,
    '',
  );
  await writeFile(path.join(outputDirectory, '404.html'), notFoundHtml);
  console.log(`Generated static SEO metadata for ${routes.length} routes and a noindex 404 page.`);
} finally {
  await vite.close();
}
