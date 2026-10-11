# Ayur Mandir website

A quiet, editorial-style product information website for Ayur Mandir, a Bangalore-based supplier of Ayurvedic supplements. Product enquiries and orders are direct: phone or WhatsApp. There is no cart, checkout, payment flow, contact form, or ordering API.

## Local setup

From the workspace root:

```sh
pnpm install
pnpm --filter @workspace/ayur-mandir dev
```

Build and preview:

```sh
pnpm --filter @workspace/ayur-mandir build
pnpm --filter @workspace/ayur-mandir serve
```

Copy `.env.example` to `.env.local` for local configuration. Set `VITE_SITE_URL` to the exact canonical production origin once it is known (for example `https://your-owned-domain.example`). Leave it blank during local development; no development or guessed production domain is embedded in the app. The value controls route canonical URLs, `og:url`, and absolute JSON-LD URLs. It is public site configuration, not a secret.

## Owner editing

- **Business contact values:** edit `src/data/site.ts` only. Phone, WhatsApp number, email, Instagram account and city are centralized there and consumed by the site UI and structured data.
- **Products and content placeholders:** edit `src/data/products.ts`. Each product has a slug, name, factual label descriptor, image and the structured page sections. Missing facts are intentionally set to `null` and visibly rendered as “To be added.” Do not add ingredients, directions, benefits, certifications, prices or other unsupported facts. The exact medical disclaimer is centralized in this file and appears in the footer and product pages.
- **Product images:** place owner-supplied, unaltered product images in `public/assets` and set the image path/alt text in the products data. The Amla image is intentionally a labeled placeholder because no photo was supplied. Existing source images are the supplied ADP and Skin Cream photos. Do not substitute stock or generated imagery.
- **Logo:** use `public/assets/ayur-mandir-logo.jpeg` as supplied. It is used in the navbar, footer and as the favicon source; do not recolor or distort it.
- **Site copy and design:** pages and shared navigation/footer live in `src/App.tsx`; design tokens, typography, layout and responsive behavior live in `src/index.css`.
- **Canonical host for crawlers:** after deciding on the owned production domain, set `VITE_SITE_URL` at build time and replace `REPLACE-WITH-PRODUCTION-DOMAIN` in `public/robots.txt` and `public/sitemap.xml`. Never publish those placeholder values unchanged.

### Color-token note

The requested **Wood** token uses the dark-brown swatch value `#5A3519`, not the conflicting gold value printed beside the swatch. The optional separate `--color-gold` token is `#DFA237`; it is not used as a core surface color.

## Verified in this build

- [x] `pnpm --filter @workspace/ayur-mandir run typecheck` passes.
- [x] Home, contact and a product detail route loaded in the preview; reviewed the home layout on mobile and the product/contact layouts on desktop.
- [x] Supplied logo, ADP and Skin Cream photos display; the missing Amla photo is clearly marked for replacement.
- [x] Contact links use the configured phone, WhatsApp, email and Instagram details; no prices, cart, checkout, payment or nonfunctional form are included.
- [x] The exact medical disclaimer appears in the footer and on product detail pages.

## QA checklist before release

- [ ] Build with `pnpm --filter @workspace/ayur-mandir run build`; visit all seven Wouter history routes directly and through internal links.
- [ ] Check responsive layout at 320, 375, 390, 414, 768, 1024, 1280, 1440 and 1920 px; confirm no horizontal overflow.
- [ ] Keyboard-test skip link, navigation links, mobile menu (open/close, Escape, focus containment and return), and visible focus rings.
- [ ] Confirm all product facts are owner-approved, placeholders have been replaced only with verified label data, and no pricing or unsupported claims are present.
- [ ] Set the production URL, replace sitemap/robots placeholders, check canonical/OG metadata and JSON-LD, and confirm hosting applies `public/_headers`.
- [ ] Verify phone, WhatsApp, email and Instagram destinations against `src/data/site.ts`; confirm there are no form, cart or checkout flows.
