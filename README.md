# Ayur Mandira (ಆಯುರ್ ಮಂದಿರ) — Official Web Application

> **Authorized Supplier & Bangalore Distributor for Vijayanagar Ayurvedic Centre (VAC)**

---

## 1. Executive Summary & Brand Identity

* **Brand Name:** **Ayur Mandira** (Kannada: **ಆಯುರ್ ಮಂದಿರ**)
* **Domain:** `https://ayurmandira.com`
* **Headquarters:** Bangalore, Karnataka, India
* **Phone / Orders:** `+91 84969 54795`
* **Email:** `ayurmandira@gmail.com`
* **Instagram:** `@ayurmandiraofficial`
* **Core Value Proposition:** Ayur Mandira is the exclusive Bangalore-based distributor for **Vijayanagar Ayurvedic Centre (VAC)**. All products are authentic doctor-formulated classical preparations adhering to strict Ayurvedic pharmacology (Charaka & Sushruta Samhita standards).
* **Ordering Mechanism:** Direct consultation and order routing via Phone Call and verified WhatsApp. No complex checkout barriers; customers receive personal Vaidya guidance on batch availability and dosage.

---

## 2. Technology Stack & Project Architecture

* **Frontend:** React 19 + TypeScript
* **Build Tool:** Vite 7 (optimized client environment in `artifacts/ayur-mandir`)
* **Routing:** `wouter` (lightweight, client-side SPA routing with custom `ScrollToTop`)
* **Icons:** `lucide-react`
* **Animations:** `framer-motion` (page transitions)
* **Styling:** Vanilla CSS design system (`artifacts/ayur-mandir/src/index.css`) with Ayurvedic tokens, Cormorant Garamond serif headers, Outfit sans-serif body, and mobile-first responsive architecture.
* **Monorepo / Package Manager:** `pnpm` workspace (managed under `@workspace/ayur-mandir`).

---

## 3. Directory Layout

```
Ayur-Mandir-website/
├── artifacts/
│   └── ayur-mandir/               # Main client application
│       ├── public/
│       │   ├── assets/            # Web-optimized imagery (hero, logos, products)
│       │   │   ├── ayur-mandir-logo.png
│       │   │   ├── hero-bg.png
│       │   │   └── ...
│       │   ├── favicon.ico        # Root favicon
│       │   ├── favicon.png        # PNG favicon
│       │   ├── robots.txt         # SEO crawler instructions
│       │   ├── sitemap.xml        # Dynamic XML sitemap
│       │   └── _headers           # Security & caching headers
│       ├── src/
│       │   ├── data/              # Core business & product data
│       │   │   ├── blogs.ts       # Clinical articles (keyword-optimized)
│       │   │   ├── products.ts    # VAC product catalog specifications
│       │   │   ├── site.ts        # Brand metadata, phone, WhatsApp helpers
│       │   │   └── terms.ts       # Supplier & distributor terms
│       │   ├── App.tsx            # Main application, routes & page views
│       │   ├── index.css          # Core design system & responsive styling
│       │   └── main.tsx           # React DOM root entry
│       ├── index.html             # HTML entry with SEO, OpenGraph & Favicons
│       ├── package.json           # Client dependencies
│       └── vite.config.ts         # Vite configuration with safe PORT/BASE_PATH defaults
├── package.json                   # Root workspace scripts & dev tools
├── pnpm-lock.yaml                 # Fully synced pnpm v10 lockfile
├── pnpm-workspace.yaml            # Monorepo packages definition
└── README.md                      # This comprehensive documentation file
```

---

## 4. Key Pages & Routes

| Route | Page Component | Description |
| :--- | :--- | :--- |
| `/` | `HomePage` | Hero with Ayur Mandira temple emblem, VAC partnership pill, Services grid, Product categories, Featured compact product showcase, Why Choose VAC section, and About excerpt. |
| `/products` | `ProductsPage` | Catalog of VAC formulations with search filter, category chips, and fallback inquiry state. |
| `/products/:slug` | `ProductDetailPage` | Individual product showcase with single-column mobile stacking, instant **Call** and **Order on WhatsApp** CTA buttons, detailed clinical ingredients, dosage instructions, and pack sizes. |
| `/blogs` | `BlogsPage` | Clinical Ayurvedic wellness journal categorized by Diabetes Care, Skin Care, and Digestive Health. Keyword-optimized without individual doctor names. |
| `/blogs/:slug` | `BlogPostPage` | Complete article reader with cross-links to the related VAC formulation and direct WhatsApp consultation buttons. |
| `/about` | `AboutPage` | Ayur Mandira’s heritage, exclusive partnership with Vijayanagar Ayurvedic Centre, and sourcing standards. |
| `/contact` | `ContactPage` | Direct phone calling, WhatsApp ordering, email, Instagram, and Bangalore address. |
| `/terms` | `TermsPage` | Supplier & distributor terms and conditions, consumable hygiene regulations, and medical disclaimers. |
| `*` | `NotFoundPage` | 404 route with search form and recommendations. |

---

## 5. Current Products Catalog (`src/data/products.ts`)

1. **ADP, Advanced Digestive Powder** (`/products/advanced-digestive-powder`)
   * **Category:** Digestive Care
   * **Purpose:** Restores Gut Agni, eliminates acid reflux, bloating, and gas.
   * **Key Actives:** Triphala (Haritaki, Bibhitaki, Amalaki), Shunthi, Mishreya, Jeeraka, Saindhava Lavana, Shuddha Hingu.
   * **Pack Size:** 100g airtight glass container.

2. **Amla Turmeric Effervescent Tablet** (`/products/amla-turmeric-effervescent-tablet`)
   * **Category:** Diabetes Care
   * **Purpose:** Overall diabetes management, pancreatic beta-cell support & glycemic stability.
   * **Key Actives:** Standardized Amalaki (Nishamalaki) extract, Curcuma longa (Haridra rhizome extract with active curcuminoids), natural mineral effervescent base.
   * **Pack Size:** 20 effervescent tablets, moisture-sealed tube pack.

3. **Skin Cream** (`/products/skin-cream`)
   * **Category:** Skin Care
   * **Purpose:** Deep herbal nourishment, Pitta dosha balance, and complexion radiance.
   * **Key Actives:** Kumkumadi Taila, Manjistha, Raktachandana, Haridra, Yashtimadhu, Sariva, pure natural lipid base.
   * **Pack Size:** 50g dual-pot container pack.

---

## 6. Mobile & Responsive Design Highlights

* **Mobile Hero Section:** Includes a dedicated glass capsule brand emblem (`.mobile-hero-logo`) displaying the Ayur Mandira temple gopuram and Kannada wordmark, fitted snugly without full-width stretching.
* **Sticky Navbar:** Positioned with `position: sticky; top: 0; z-index: 100;` using `overflow-x: clip` on `html, body` to prevent sticky cancellation on mobile browsers.
* **Mobile Product Showcase:** Stacks image and details vertically (`display: flex; flex-direction: column; width: 100%;`). Includes dual **Call** and **Order on WhatsApp** buttons immediately below the product title so shoppers don't need to scroll through multi-page tables.
* **Contextual Sticky Order Bar:** The mobile bottom bar (`.mobile-order-bar`) automatically detects if the customer is browsing an individual product and pre-fills WhatsApp with:
  `Hi Ayur Mandira, I'd like to order [Product Name].`

---

## 7. Developer & Build Commands

### Install Dependencies
```bash
# Standard frozen install (CI/CD compatible)
pnpm install --frozen-lockfile

# If adding new dependencies
pnpm install --no-frozen-lockfile
```

### Run Locally (Dev Server)
```bash
pnpm --filter @workspace/ayur-mandir dev
```
> The development server will start at `http://localhost:3000/`.

### Production Build
```bash
pnpm --filter @workspace/ayur-mandir build
```
> Compiles into `artifacts/ayur-mandir/dist/public`. Safe default fallbacks for `PORT=3000` and `BASE_PATH=/` are built into `vite.config.ts`, making it 100% compatible with Cloudflare Pages, Vercel, Netlify, or Docker builds.

---

## 8. Deployment Configuration (Cloudflare Pages / Vercel)

* **Framework Preset:** `Vite`
* **Root Directory:** `artifacts/ayur-mandir` (or build from root via workspace filter)
* **Build Command:** `pnpm --filter @workspace/ayur-mandir build`
* **Output Directory:** `dist/public` (when building from `artifacts/ayur-mandir`) or `artifacts/ayur-mandir/dist/public`
* **Node Version:** `20.x` or `24.x`
* **Package Manager:** `pnpm` (lockfile synchronized with v10.x standards)
