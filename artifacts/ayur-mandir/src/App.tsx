import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link, Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import {
  ArrowRight,
  BookOpen,
  ChevronRight,
  Clock,
  Instagram,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Search,
  Shield,
  User,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ErrorBoundary } from '@/components/error-boundary';
import { CookieConsent } from '@/components/cookie-consent';
import { site, whatsappUrl } from '@/data/site';
import { productSeo, seo } from '@/data/seo';
import { medicalDisclaimer, products, type Product } from '@/data/products';
import { termsSections, supplierDetails } from '@/data/terms';
import { blogPosts, type BlogPost } from '@/data/blogs';
import { trackPhoneConversion } from '@/lib/google-ads';

function ScrollToTop() {
  const [path] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [path]);
  return null;
}

type PageMetaProps = {
  title: string;
  description: string;
  path: string;
  schema?: Record<string, unknown> | Record<string, unknown>[];
};

function PageMeta({ title, description, path, schema }: PageMetaProps) {
  useEffect(() => {
    document.title = title;
    const origin = site.siteUrl || (typeof window !== 'undefined' ? window.location.origin : 'https://ayurmandira.com');
    const canonicalUrl = `${origin}${path === '/' ? '' : path}`;

    const setMeta = (selector: string, attribute: string, value: string) => {
      let element = document.head.querySelector(selector) as HTMLMetaElement | null;
      if (!element) {
        element = document.createElement('meta');
        if (selector.includes('[property=')) element.setAttribute('property', selector.match(/\[property="([^"]+)"\]/)?.[1] ?? '');
        else if (selector.includes('[name=')) element.setAttribute('name', selector.match(/\[name="([^"]+)"\]/)?.[1] ?? '');
        document.head.appendChild(element);
      }
      element.setAttribute(attribute, value);
    };

    setMeta('meta[name="description"]', 'content', description);
    setMeta('meta[property="og:title"]', 'content', title);
    setMeta('meta[property="og:description"]', 'content', description);
    setMeta('meta[property="og:url"]', 'content', canonicalUrl);
    setMeta('meta[property="og:image"]', 'content', `${origin}/assets/ayur-mandir-logo-transparent.svg`);
    setMeta('meta[name="twitter:card"]', 'content', 'summary_large_image');
    setMeta('meta[name="twitter:title"]', 'content', title);
    setMeta('meta[name="twitter:description"]', 'content', description);
    setMeta('meta[name="twitter:image"]', 'content', `${origin}/assets/ayur-mandir-logo-transparent.svg`);

    let canonical = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;

    const oldSchema = document.getElementById('route-schema');
    if (oldSchema) oldSchema.remove();
    if (schema) {
      const script = document.createElement('script');
      script.id = 'route-schema';
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    }
  }, [title, description, path, schema]);
  return null;
}

function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.name,
    ...(site.siteUrl ? { url: site.siteUrl } : {}),
    telephone: site.phone,
    email: site.email,
    address: { '@type': 'PostalAddress', addressLocality: site.city, addressRegion: site.region, addressCountry: 'IN' },
    sameAs: [site.instagramUrl],
  };
}

function ContactButtons({ message = 'Hi Ayur Mandira, I would like to know more.' }: { message?: string }) {
  return (
    <div className="contact-inline">
      <a className="button button-primary" href={`tel:${site.phoneLink}`} onClick={trackPhoneConversion} data-testid="contact-call">
        <Phone size={17} aria-hidden="true" /> Call {site.phone}
      </a>
      <a className="button button-secondary" href={whatsappUrl(message)} target="_blank" rel="noopener noreferrer" data-testid="contact-whatsapp">
        <MessageCircle size={17} aria-hidden="true" /> WhatsApp us
      </a>
    </div>
  );
}

const navigation = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Products', href: '/products' },
  { label: 'Blogs', href: '/blogs' },
  { label: 'Contact', href: '/contact' },
];

function Navbar() {
  const [path] = useLocation();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setOpen(false);
  }, [path]);

  useEffect(() => {
    if (!open) return;
    const first = menuRef.current?.querySelector<HTMLElement>('a');
    first?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
      if (event.key === 'Tab' && menuRef.current) {
        const focusable = Array.from(menuRef.current.querySelectorAll<HTMLElement>('a[href]'));
        if (!focusable.length) return;
        const firstItem = focusable[0];
        const lastItem = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === firstItem) {
          event.preventDefault();
          lastItem.focus();
        } else if (!event.shiftKey && document.activeElement === lastItem) {
          event.preventDefault();
          firstItem.focus();
        }
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  const isActive = (href: string) => (href === '/' ? path === '/' : path === href || path.startsWith(`${href}/`));
  const toggle = () => setOpen((value) => !value);

  return (
    <header className="site-header">
      <div className="nav-inner">
        <Link href="/" className="brand-link" aria-label="Ayur Mandira home" data-testid="brand-home">
          <img src="/assets/ayur-mandir-logo-transparent.svg" alt="Ayur Mandira" width="112" height="66" />
        </Link>
        <nav className="nav-links" aria-label="Primary navigation">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? 'page' : undefined}
              data-testid={`nav-${item.label.toLowerCase().replaceAll(' ', '-')}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <a className="nav-order" href={whatsappUrl('Hi Ayur Mandira, I would like to know more.')} target="_blank" rel="noopener noreferrer" data-testid="nav-order-whatsapp">
          <MessageCircle size={16} aria-hidden="true" /> Order on WhatsApp
        </a>
        <button
          ref={toggleRef}
          type="button"
          className="menu-toggle"
          aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={toggle}
          data-testid="mobile-menu-toggle"
        >
          {open ? <X size={21} aria-hidden="true" /> : <Menu size={21} aria-hidden="true" />}
        </button>
      </div>
      <nav id="mobile-navigation" ref={menuRef} className="mobile-menu" data-open={open} aria-label="Mobile navigation" aria-hidden={!open}>
        {navigation.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive(item.href) ? 'page' : undefined}
            tabIndex={open ? 0 : -1}
            data-testid={`mobile-nav-${item.label.toLowerCase().replaceAll(' ', '-')}`}
          >
            {item.label}
          </Link>
        ))}
        <a className="button button-primary" href={whatsappUrl('Hi Ayur Mandira, I would like to know more.')} target="_blank" rel="noopener noreferrer" tabIndex={open ? 0 : -1} data-testid="mobile-order-whatsapp">
          <MessageCircle size={17} aria-hidden="true" /> Order on WhatsApp
        </a>
      </nav>
    </header>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <Link href="/" className="footer-logo-panel" aria-label="Ayur Mandira home" data-testid="footer-brand">
              <img src="/assets/ayur-mandir-logo-transparent.svg" alt="Ayur Mandira" width="140" height="94" loading="lazy" />
            </Link>
            <p className="footer-tagline">Discover thoughtfully selected herbal products for everyday wellness and balance.</p>
            <div className="footer-supplier-badge">
              <span>Sole Manufacturing Partner</span>
              <strong>Vijayanagar Ayurvedic Centre (VAC)</strong>
            </div>
          </div>
          <nav className="footer-links" aria-label="Footer navigation">
            <h2>Explore</h2>
            {navigation.map((item) => (
              <Link key={item.href} href={item.href}>{item.label}</Link>
            ))}
            <Link href="/terms" data-testid="footer-terms">Terms & Conditions</Link>
          </nav>
          <div className="footer-contact">
            <h2>Get in touch</h2>
            <a href={`tel:${site.phoneLink}`} onClick={trackPhoneConversion}><Phone size={15} aria-hidden="true" /> <span>{site.phone}</span></a>
            <a href={whatsappUrl('Hi Ayur Mandira, I would like to know more.')} target="_blank" rel="noopener noreferrer"><MessageCircle size={15} aria-hidden="true" /> <span>WhatsApp</span></a>
            <a href={`mailto:${site.email}`}><Mail size={15} aria-hidden="true" /> <span>{site.email}</span></a>
            <a href={site.instagramUrl} target="_blank" rel="noopener noreferrer"><Instagram size={15} aria-hidden="true" /> <span>{site.instagramHandle}</span></a>
            <p className="footer-location"><MapPin size={15} aria-hidden="true" /> <span>{site.city}, {site.region}</span></p>
          </div>
        </div>
        <p className="footer-disclaimer" data-testid="footer-disclaimer">
          {medicalDisclaimer} All products distributed by Ayur Mandira are authentically procured exclusively from Vijayanagar Ayurvedic Centre (VAC), Bangalore.
        </p>
        <div className="copyright">
          <span>© {new Date().getFullYear()} Ayur Mandira. Exclusive supplier of VAC formulations. All rights reserved.</span>
          <span>{site.city}, {site.region}</span>
        </div>
      </div>
    </footer>
  );
}

function SiteShell({ children }: { children: ReactNode }) {
  const [path] = useLocation();
  const currentProduct = path.startsWith('/products/')
    ? products.find((p) => `/products/${p.slug}` === path)
    : null;
  const stickyWhatsappMsg = currentProduct
    ? `Hi Ayur Mandira, I'd like to order ${currentProduct.name}.`
    : 'Hi Ayur Mandira, I would like to know more.';

  return (
    <>
      <ScrollToTop />
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <Navbar />
      <main id="main-content">{children}</main>
      <Footer />
      <div className="mobile-order-bar" role="group" aria-label="Quick contact actions">
        <a className="button button-primary" href={`tel:${site.phoneLink}`} onClick={trackPhoneConversion} data-testid="mobile-sticky-call">
          <Phone size={16} aria-hidden="true" /> Call
        </a>
        <a
          className="button button-secondary"
          href={whatsappUrl(stickyWhatsappMsg)}
          target="_blank"
          rel="noopener noreferrer"
          data-testid="mobile-sticky-whatsapp"
          style={{ color: '#fff', borderColor: 'rgba(255,255,255,.5)' }}
        >
          <MessageCircle size={16} aria-hidden="true" /> WhatsApp
        </a>
      </div>
      <CookieConsent />
    </>
  );
}

function Breadcrumb({ items }: { items: { name: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="breadcrumb">
      {items.map((item, index) => (
        <span key={`${item.name}-${index}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 9 }}>
          {index > 0 && <ChevronRight size={14} aria-hidden="true" />}
          {item.href ? <Link href={item.href}>{item.name}</Link> : <span aria-current="page">{item.name}</span>}
        </span>
      ))}
    </nav>
  );
}

function ProductImage({ product, lazy = true }: { product: Product; lazy?: boolean }) {
  if (!product.image) {
    return (
      <div className="image-placeholder" role="img" aria-label={`${product.name} image to be added`}>
        <span>Product image<br />To be added</span>
      </div>
    );
  }
  return <img src={product.image} alt={product.imageAlt} width="480" height="400" loading={lazy ? 'lazy' : 'eager'} />;
}

function ProductCard({ product, compact = false }: { product: Product; compact?: boolean }) {
  return (
    <Link href={`/products/${product.slug}`} className={`product-card ${compact ? 'product-card-compact' : ''}`} data-testid={`product-card-${product.slug}`}>
      <div className="product-frame">
        <ProductImage product={product} />
      </div>
      <div className="product-card-copy">
        <span className="product-card-cat">{product.category}</span>
        <h3>{product.name}</h3>
        <p>{product.descriptor}</p>
        <span className="card-link">View details <ArrowRight size={14} /></span>
      </div>
    </Link>
  );
}

function ProductCards({ items = products, compact = false }: { items?: Product[]; compact?: boolean }) {
  return (
    <div className={`product-grid ${compact ? 'product-grid-compact' : ''}`}>
      {items.map((product) => (
        <ProductCard key={product.slug} product={product} compact={compact} />
      ))}
    </div>
  );
}

/* ═══ HOME SECTIONS ═══ */

function ServicesSection() {
  const services = [
    {
      image: '/assets/services/herbal-products.png',
      title: 'Herbal Formulations',
      desc: 'Genuine Ayurvedic supplements exclusively sourced from Vijayanagar Ayurvedic Centre (VAC).',
      featured: false,
    },
    {
      image: '/assets/services/wellness-solutions.png',
      title: 'Targeted Wellness',
      desc: 'Doctor-formulated herbal solutions for glycemic stability, gut Agni, and Pitta skin balance.',
      featured: true,
    },
    {
      image: '/assets/services/ayurvedic-store.png',
      title: 'Ayurvedic Dispensary',
      desc: 'Personalized herbal ordering with direct Vaidya dosage guidance via Call or WhatsApp.',
      featured: false,
    },
  ];
  return (
    <section className="services-section">
      <div className="wrap">
        <div className="services-grid">
          {services.map((s) => (
            <div key={s.title} className={`service-card${s.featured ? ' featured' : ''}`}>
              <div className="service-image-wrap">
                <img src={s.image} alt={s.title} width="90" height="90" loading="lazy" />
              </div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyChooseSection() {
  const reasons = [
    {
      image: '/assets/why/verified-suppliers.png',
      title: 'Verified Sourcing (VAC)',
      desc: 'Every product sourced exclusively from certified Vijayanagar Ayurvedic Centre (VAC).',
    },
    {
      image: '/assets/why/natural-ingredients.png',
      title: '100% Pure Botanicals',
      desc: 'Pure, authentic herbal extracts rooted in classical Ayurvedic pharmacopoeia.',
    },
    {
      image: '/assets/why/personal-guidance.png',
      title: 'Doctor-Backed Guidance',
      desc: 'Direct personal communication for proper dosage, Prakriti assessment, and support.',
    },
    {
      image: '/assets/why/holistic-wellness.png',
      title: 'Tridosha Equilibrium',
      desc: 'Targeted classical formulas supporting complete balance of Vata, Pitta, and Kapha.',
    },
  ];
  return (
    <section className="why-section">
      <div className="wrap">
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <p className="eyebrow">Why Choose Us</p>
        </div>
        <h2>Natural care, verified products, and<br />thoughtful service combined</h2>
        <div className="why-grid">
          {reasons.map((r) => (
            <div key={r.title} className="why-item">
              <div className="why-image-wrap">
                <img src={r.image} alt={r.title} width="84" height="84" loading="lazy" />
              </div>
              <h3>{r.title}</h3>
              <p>{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutHomeSection() {
  return (
    <section className="about-section">
      <div className="wrap">
        <div className="about-grid">
          <div className="about-copy">
            <p className="eyebrow">Who We Are</p>
            <h2>Our story begins with mindful choices</h2>
            <p>
              Ayur Mandira is a Bangalore-based supplier of genuine Ayurvedic supplements. We partner exclusively with <strong>Vijayanagar Ayurvedic Centre (VAC)</strong> to bring authentic, traditionally prepared wellness formulations directly to your doorstep.
            </p>
            <div className="about-stat">
              <span className="about-stat-number">100%</span>
              <span className="about-stat-text">Authentic VAC Formulations.<br />Exclusively sourced from Vijayanagar Ayurvedic Centre.</span>
            </div>
          </div>
          <div className="about-image">
            <img src="/assets/agastya_thuli_nadi.jpg" alt="Sage Agastya recording Ayurvedic wisdom on palm leaves" loading="lazy" />
          </div>
          <div className="about-values">
            <div className="about-value">
              <div className="about-value-icon"><Shield size={20} /></div>
              <div>
                <h3>Honest Guidance</h3>
                <p>We provide clear, accurate product information so you can make informed choices for your health.</p>
              </div>
            </div>
            <div className="about-value">
              <div className="about-value-icon"><BookOpen size={20} /></div>
              <div>
                <h3>Herbal Wisdom</h3>
                <p>Rooted in centuries-old Ayurvedic traditions, our products honour the wisdom of natural healing.</p>
              </div>
            </div>
            <div className="about-value">
              <div className="about-value-icon"><Shield size={20} /></div>
              <div>
                <h3>Sole Supplier</h3>
                <p>Exclusively distributed from Vijayanagar Ayurvedic Centre (VAC) in Bangalore.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CategoriesSection() {
  const categories = [
    { img: '/assets/categories/herbal-supplements.png', label: 'Herbal Supplements' },
    { img: '/assets/categories/digestive-care.png', label: 'Digestive Care' },
    { img: '/assets/categories/skin-care.png', label: 'Skin Care' },
    { img: '/assets/categories/body-care.png', label: 'Body Care' },
    { img: '/assets/categories/diabetes-care.png', label: 'Diabetes Care' },
    { img: '/assets/categories/raw-herbs.png', label: 'Raw Herbs' },
  ];
  return (
    <section className="categories-section">
      <div className="wrap">
        <div className="categories-grid">
          {categories.map((c) => (
            <Link key={c.label} href="/products" className="category-item" data-testid={`category-${c.label.toLowerCase().replace(/\s+/g, '-')}`}>
              <div className="category-thumb">
                <img src={c.img} alt={c.label} width="110" height="110" loading="lazy" />
              </div>
              <span className="category-label">{c.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function NewsletterStrip() {
  return (
    <section className="newsletter-strip">
      <div className="wrap">
        <div className="newsletter-inner">
          <div className="newsletter-text">
            <p>Explore herbal stories, product updates, and special offers from Ayur Mandira.</p>
          </div>
          <div className="newsletter-actions">
            <a className="button button-primary" href={whatsappUrl('Hi Ayur Mandira, I want to stay updated on products.')} target="_blank" rel="noopener noreferrer">
              <MessageCircle size={16} aria-hidden="true" /> Stay Connected
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function ClosingCta() {
  return (
    <section className="cta-band">
      <div className="wrap">
        <p className="eyebrow">We are here to help</p>
        <h2>Questions? Call, WhatsApp or email us.</h2>
        <p>Choose the way that works best for you.</p>
        <ContactButtons />
        <p style={{ marginTop: 20, marginBottom: 0 }}>
          <a href={`mailto:${site.email}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,.85)', textDecoration: 'none', fontSize: 14 }}>
            <Mail size={16} aria-hidden="true" />
            <span>{site.email}</span>
          </a>
        </p>
      </div>
    </section>
  );
}

/* ═══ PAGES ═══ */

function HomePage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}>
      <PageMeta
        title={seo.home.title}
        description={seo.home.description}
        path="/"
        schema={organizationSchema()}
      />
      <section className="hero">
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <div className="mobile-hero-logo" aria-hidden="true">
              <img src="/assets/ayur-mandir-logo-transparent.svg" alt="Ayur Mandira" width="80" height="48" />
            </div>
            <div className="hero-tag-row">
              <span className="hero-kicker">✦ Ayur Mandira · Bangalore</span>
              <span className="hero-supplier-pill">Exclusive Supplier of VAC</span>
            </div>
            <h1>Genuine Ayurvedic supplements, sourced with care.</h1>
            <p className="lead">
              Authorized supplier of authentic doctor-formulated preparations from <strong>Vijayanagar Ayurvedic Centre (VAC)</strong>. Connect with us directly to discuss dosage and delivery across Bangalore.
            </p>
            <div className="hero-actions">
              <Link href="/products" className="button button-primary" data-testid="home-view-products">View Products</Link>
              <a href={whatsappUrl('Hi Ayur Mandira, I would like to know more about VAC products.')} className="button button-secondary" target="_blank" rel="noopener noreferrer" data-testid="home-whatsapp">
                <MessageCircle size={17} aria-hidden="true" /> Order on WhatsApp
              </a>
            </div>
            <div className="hero-trust-bar">
              <span className="hero-trust-item"><Shield size={14} aria-hidden="true" /> 100% Genuine VAC</span>
              <span className="hero-trust-item"><Clock size={14} aria-hidden="true" /> Same-Day Dispatch</span>
              <span className="hero-trust-item"><Phone size={14} aria-hidden="true" /> Doctor Consultation</span>
            </div>
          </div>
          <div className="hero-art desktop-hero-art">
            <img src="/assets/ayur-mandir-logo-transparent.svg" alt="Ayur Mandira temple emblem and Kannada wordmark" width="814" height="610" fetchPriority="high" />
          </div>
        </div>
      </section>

      <ServicesSection />
      <CategoriesSection />

      <section className="section section-latest-products">
        <div className="wrap">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Latest Products</p>
              <h2>Doctor-formulated Ayurvedic products</h2>
            </div>
            <Link className="text-link" href="/products">View all products <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
          <ProductCards compact />
        </div>
      </section>

      <WhyChooseSection />
      <AboutHomeSection />

      <section className="section section-glacial">
        <div className="wrap">
          <p className="eyebrow">Simple and direct</p>
          <h2>How to order</h2>
          <div className="steps">
            <div className="step"><h3>Choose a product</h3><p>Browse our catalog or read our doctor-backed health guides to identify the right formulation.</p></div>
            <div className="step"><h3>Call or WhatsApp us</h3><p>Get in touch directly with Ayur Mandira for batch availability, pricing, and advice.</p></div>
            <div className="step"><h3>Direct dispatch</h3><p>We pack your sealed VAC products securely and deliver them straight to your address.</p></div>
          </div>
          <ContactButtons />
        </div>
      </section>

      <NewsletterStrip />
      <ClosingCta />
    </motion.div>
  );
}

function AboutPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}>
      <PageMeta
        title={seo.about.title}
        description={seo.about.description}
        path="/about"
        schema={organizationSchema()}
      />
      <section className="section">
        <div className="wrap">
          <Breadcrumb items={[{ name: 'Home', href: '/' }, { name: 'About Us' }]} />
          <p className="eyebrow">About Ayur Mandira</p>
          <h1>A trusted source for Ayurvedic supplements.</h1>
          <p className="lead">Ayur Mandira is a Bangalore-based supplier of Ayurvedic supplements, partnering exclusively with Vijayanagar Ayurvedic Centre (VAC) to provide authenticated herbal products.</p>
        </div>
      </section>
      <section className="section section-sand">
        <div className="wrap about-columns">
          <div><p className="eyebrow">Our sourcing promise</p><h2>Exclusive partnership with VAC. Genuine products.</h2></div>
          <div className="promise-box">
            <p>We source 100% of our products exclusively from <strong>Vijayanagar Ayurvedic Centre (VAC)</strong>. Every batch is verified for authenticity, storage compliance, and tamper-evident packaging.</p>
            <p style={{ marginTop: 12, fontSize: 14, color: 'var(--color-dark-green)', fontWeight: 600 }}>Exclusive Supplier: Vijayanagar Ayurvedic Centre (VAC), Bangalore</p>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="wrap about-columns">
          <div><p className="eyebrow">What we offer</p><h2>A curated range, with direct answers.</h2></div>
          <div><p>Explore our Ayurvedic supplement range, then call or message us for product information, pricing and availability.</p><Link href="/products" className="button button-primary">Explore products</Link>
            <div className="location-block"><h3>Find us</h3><p>{site.city}, {site.region}</p><p className="placeholder">Authorized Bangalore Distributor for VAC</p></div>
          </div>
        </div>
      </section>
      <ClosingCta />
    </motion.div>
  );
}

function ProductsPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Diabetes Care', 'Digestive Care', 'Skin Care'];

  const filtered = products.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.descriptor.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q)) ||
      p.category.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}>
      <PageMeta
        title={seo.products.title}
        description={seo.products.description}
        path="/products"
        schema={organizationSchema()}
      />
      <section className="section section-tight">
        <div className="wrap">
          <Breadcrumb items={[{ name: 'Home', href: '/' }, { name: 'Products' }]} />
          <p className="eyebrow">Ayur Mandira · VAC Product Catalog</p>
          <h1>Our Ayurvedic Formulations</h1>
          <p className="lead">
            Exclusively manufactured by <strong>Vijayanagar Ayurvedic Centre (VAC)</strong>. Search our range by condition or herb, or contact us directly on WhatsApp.
          </p>

          <div className="catalog-toolbar">
            <div className="catalog-search-wrap">
              <Search size={18} className="search-icon" aria-hidden="true" />
              <input
                type="text"
                className="search-input"
                placeholder="Search products, herbs (e.g. Amla, Digestion, Skin, Turmeric)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search Ayurvedic products"
              />
              {search && (
                <button type="button" className="search-clear-btn" onClick={() => setSearch('')} aria-label="Clear search">
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="category-filter-chips">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`category-chip ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 36 }}>
            <h2 className="sr-only">Product listings</h2>
            {filtered.length > 0 ? (
              <ProductCards items={filtered} />
            ) : (
              <div className="no-products-found">
                <h3>No formulations found matching “{search}”</h3>
                <p>Looking for a specific classical Ayurvedic preparation from Vijayanagar Ayurvedic Centre (VAC)? Speak with us directly—we can verify batch availability for you.</p>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 20, flexWrap: 'wrap' }}>
                  <button type="button" className="button button-primary" onClick={() => { setSearch(''); setSelectedCategory('All'); }}>
                    Clear Filters
                  </button>
                  <a className="button button-secondary" href={whatsappUrl(`Hi Ayur Mandira, I am inquiring about product availability for: ${search}`)} target="_blank" rel="noopener noreferrer">
                    <MessageCircle size={16} /> Ask on WhatsApp
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      <ClosingCta />
    </motion.div>
  );
}

function ProductNotFound({ slug }: { slug?: string }) {
  const [query, setQuery] = useState('');
  const [, navigate] = useLocation();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/products`);
    }
  };

  return (
    <section className="section">
      <div className="wrap" style={{ textAlign: 'center', maxWidth: 720 }}>
        <p className="eyebrow">Formulation Inquiry</p>
        <h1>Product Not Found</h1>
        <p className="lead" style={{ marginInline: 'auto' }}>
          We could not find a formulation matching <strong>"{slug || 'this URL'}"</strong>. The product might have been updated or is available by special dispensary request.
        </p>

        <form onSubmit={handleSearchSubmit} className="substitute-search-form">
          <Search size={18} aria-hidden="true" />
          <input
            type="text"
            placeholder="Search other Ayurvedic products (e.g. Digestive, Diabetes, Skin)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="button button-primary">Search</button>
        </form>

        <div style={{ marginTop: 48, textAlign: 'left' }}>
          <h2 style={{ fontSize: 24, textAlign: 'center', marginBottom: 24 }}>Available Formulations from VAC</h2>
          <ProductCards items={products} compact />
        </div>

        <div style={{ marginTop: 40 }}>
          <a className="button button-primary" href={whatsappUrl(`Hi Ayur Mandira, I was looking for product ${slug || ''} on your website. Is it available?`)} target="_blank" rel="noopener noreferrer">
            <MessageCircle size={16} /> Inquire on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}

function ProductDetailPage({ slug }: { slug: string }) {
  const product = products.find((item) => item.slug === slug);
  if (!product) {
    return <ProductNotFound slug={slug} />;
  }

  const otherProducts = products.filter((item) => item.slug !== product.slug);
  const path = `/products/${product.slug}`;
  const origin = site.siteUrl || (typeof window !== 'undefined' ? window.location.origin : '');
  const metadata = productSeo(product);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.descriptor,
    ...(product.image ? { image: `${origin}${product.image}` } : {}),
    brand: { '@type': 'Brand', name: 'Vijayanagar Ayurvedic Centre (VAC)' },
    url: `${origin}${path}`,
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}>
      <PageMeta
        title={metadata.title}
        description={metadata.description}
        path={path}
        schema={schema}
      />
      <section className="page-intro">
        <div className="wrap">
          <Breadcrumb items={[{ name: 'Home', href: '/' }, { name: 'Products', href: '/products' }, { name: product.name }]} />
          <p className="eyebrow">Ayur Mandira · Product information</p>
        </div>
      </section>
      <section className="wrap product-detail">
        <div className="detail-media">
          <ProductImage product={product} lazy={false} />
        </div>
        <div className="detail-copy">
          <span className="product-card-cat">{product.category}</span>
          <h1>{product.name}</h1>
          <p className="lead">{product.descriptor}</p>
          <div className="supplier-tag-inline">
            <Shield size={15} aria-hidden="true" />
            <span>Sole Manufacturer: Vijayanagar Ayurvedic Centre (VAC)</span>
          </div>
          <p style={{ marginTop: 14 }}>Call or WhatsApp for pricing, batch availability, and delivery options.</p>
          <div className="product-quick-cta">
            <a className="button button-primary" href={`tel:${site.phoneLink}`} onClick={trackPhoneConversion} data-testid="product-quick-call">
              <Phone size={15} aria-hidden="true" /> Call {site.phone}
            </a>
            <a
              className="button button-secondary"
              href={whatsappUrl(`Hi Ayur Mandira, I'd like to order ${product.name}`)}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="product-quick-whatsapp"
            >
              <MessageCircle size={15} aria-hidden="true" /> Order on WhatsApp
            </a>
          </div>
          <h2 className="sr-only">Product details</h2>
          <div className="data-sections">
            {product.sections.map((section) => (
              <section className="data-section" key={section.title}>
                <h3>{section.title}</h3>
                <div>{section.content ? <p style={{ margin: 0 }}>{section.content}</p> : <span className="placeholder">{section.title}: To be added</span>}</div>
              </section>
            ))}
          </div>
          <div className="order-panel">
            <h2>Order this product</h2>
            <ContactButtons message={`Hi Ayur Mandira, I'd like to order ${product.name}`} />
          </div>
          <p className="disclaimer" style={{ marginTop: 24 }} data-testid="product-disclaimer">{medicalDisclaimer}</p>
        </div>
      </section>
      <section className="section-sand other-products">
        <div className="wrap"><p className="eyebrow">Continue browsing</p><h2>Other products</h2><ProductCards items={otherProducts} compact /></div>
      </section>
    </motion.div>
  );
}

function BlogsPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Diabetes Care', 'Skin Care', 'Digestive Health'];

  const filtered = blogPosts.filter((b) => {
    const matchesCat = selectedCategory === 'All' || b.category === selectedCategory;
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      b.title.toLowerCase().includes(q) ||
      b.summary.toLowerCase().includes(q) ||
      b.tags.some((t) => t.toLowerCase().includes(q));
    return matchesCat && matchesSearch;
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}>
      <PageMeta
        title={seo.blogs.title}
        description={seo.blogs.description}
        path="/blogs"
        schema={{
          '@context': 'https://schema.org',
          '@type': 'Blog',
          name: 'Ayur Mandira Ayurvedic Health Journal',
          description: 'Evidence-based Ayurvedic guidance on diabetic patient supplements, herbal skincare, and digestive wellness.',
        }}
      />
      <section className="section section-tight">
        <div className="wrap">
          <Breadcrumb items={[{ name: 'Home', href: '/' }, { name: 'Blogs' }]} />
          <p className="eyebrow">Clinical Research · Sourcing Desk</p>
          <h1>Health & Wellness Articles</h1>
          <p className="lead">
            Evidence-based Ayurvedic guidance on diabetic glycemic support, Pitta dosha skin balance, and gut Agni restoration using authentic VAC botanical formulations.
          </p>

          <div className="catalog-toolbar">
            <div className="catalog-search-wrap">
              <Search size={18} className="search-icon" aria-hidden="true" />
              <input
                type="text"
                className="search-input"
                placeholder="Search articles by condition (e.g. diabetes, skin, digestion, triphala)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button type="button" className="search-clear-btn" onClick={() => setSearch('')}>
                  <X size={16} />
                </button>
              )}
            </div>
            <div className="category-filter-chips">
              {categories.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`category-chip ${selectedCategory === c ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="blogs-grid">
            {filtered.map((post) => (
              <article key={post.slug} className="blog-card">
                <Link href={`/blogs/${post.slug}`} className="blog-card-media">
                  <img src={post.image} alt={post.imageAlt} width="360" height="240" loading="lazy" />
                  <span className="blog-category-tag">{post.category}</span>
                </Link>
                <div className="blog-card-body">
                  <div className="blog-meta-row">
                    <span className="blog-author">{post.author}</span>
                    <span className="blog-dot">·</span>
                    <span className="blog-read-time"><Clock size={13} /> {post.readTime}</span>
                  </div>
                  <h2>
                    <Link href={`/blogs/${post.slug}`}>{post.title}</Link>
                  </h2>
                  <p>{post.summary}</p>
                  <Link href={`/blogs/${post.slug}`} className="card-link">
                    Read Ayurvedic Guide <ArrowRight size={14} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <ClosingCta />
    </motion.div>
  );
}

function BlogPostPage({ slug }: { slug: string }) {
  const post = blogPosts.find((b) => b.slug === slug);
  if (!post) {
    return <NotFound />;
  }

  const relatedProduct = post.relatedProductSlug
    ? products.find((p) => p.slug === post.relatedProductSlug)
    : null;

  const path = `/blogs/${post.slug}`;
  const origin = site.siteUrl || (typeof window !== 'undefined' ? window.location.origin : '');

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.summary,
    author: {
      '@type': 'Organization',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: site.name,
      logo: {
        '@type': 'ImageObject',
        url: `${origin}/assets/ayur-mandir-logo-transparent.svg`,
      },
    },
    datePublished: '2026-10-08',
    image: `${origin}${post.image}`,
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}>
      <PageMeta
        title={`${post.title} | Ayur Mandira Blog`}
        description={post.summary}
        path={path}
        schema={schema}
      />
      <section className="section section-tight">
        <div className="wrap blog-post-layout">
          <Breadcrumb items={[{ name: 'Home', href: '/' }, { name: 'Blogs', href: '/blogs' }, { name: post.category }]} />

          <header className="blog-post-header">
            <span className="blog-category-tag">{post.category}</span>
            <h1>{post.title}</h1>
            <div className="blog-post-author-box">
              <div className="blog-author-avatar"><User size={20} /></div>
              <div>
                <strong>{post.author}</strong>
                <span>{post.authorRole} · {post.date} · {post.readTime}</span>
              </div>
            </div>
          </header>

          <div className="blog-post-featured-media">
            <img src={post.image} alt={post.imageAlt} width="720" height="400" />
          </div>

          <div className="blog-post-content">
            <p className="lead" style={{ fontStyle: 'italic', borderLeft: '3px solid var(--color-forest)', paddingLeft: 16 }}>
              {post.summary}
            </p>

            {post.sections.map((section, idx) => (
              <section key={idx} className="blog-section-block">
                <h2>{section.heading}</h2>
                {section.paragraphs.map((p, pIdx) => (
                  <p key={pIdx}>{p}</p>
                ))}
                {section.bulletPoints && (
                  <ul className="blog-bullet-list">
                    {section.bulletPoints.map((bp, bpIdx) => (
                      <li key={bpIdx}>{bp}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}

            {relatedProduct && (
              <div className="blog-product-spotlight">
                <div className="spotlight-badge">
                  <Shield size={16} /> Authentic VAC Formulation
                </div>
                <h3>Recommended Formulation: {relatedProduct.name}</h3>
                <p>{relatedProduct.descriptor}. Exclusively manufactured by Vijayanagar Ayurvedic Centre (VAC).</p>
                <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 16 }}>
                  <Link href={`/products/${relatedProduct.slug}`} className="button button-primary">
                    View Product Details
                  </Link>
                  <a
                    href={whatsappUrl(`Hi Ayur Mandira, I read your article "${post.title}" and would like to order ${relatedProduct.name}.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="button button-secondary"
                  >
                    <MessageCircle size={16} /> Order on WhatsApp
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      <ClosingCta />
    </motion.div>
  );
}

function TermsPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}>
      <PageMeta
        title={seo.terms.title}
        description={seo.terms.description}
        path="/terms"
        schema={organizationSchema()}
      />
      <section className="section section-tight">
        <div className="wrap">
          <Breadcrumb items={[{ name: 'Home', href: '/' }, { name: 'Terms & Conditions' }]} />
          <p className="eyebrow">Supplier Terms & Medical Disclaimers</p>
          <h1>Terms & Conditions</h1>
          <p className="lead">
            Ayur Mandira operates as an authorized distributor and supplier of authentic Ayurvedic formulations in Bangalore.
            All products cataloged and distributed are exclusively manufactured and supplied by <strong>Vijayanagar Ayurvedic Centre (VAC)</strong>.
          </p>

          <div className="supplier-declaration-card">
            <div className="supplier-declaration-badge">
              <Shield size={18} aria-hidden="true" />
              <span>Official Sourcing & Sponsoring Declaration</span>
            </div>
            <h3>Exclusive Supply Partner: Vijayanagar Ayurvedic Centre (VAC)</h3>
            <p>
              Please note that <strong>Vijayanagar Ayurvedic Centre (VAC)</strong> is the sole and exclusive manufacturing supplier for all products distributed through Ayur Mandira. We guarantee that 100% of the products delivered to our customers are authentic, sealed, and directly sourced from VAC without intermediate stockists.
            </p>
            <div className="supplier-meta-grid">
              <div><strong>Distributor:</strong> Ayur Mandira, Bangalore</div>
              <div><strong>Sole Manufacturer / Supplier:</strong> Vijayanagar Ayurvedic Centre (VAC)</div>
              <div><strong>Jurisdiction:</strong> Bangalore, Karnataka, India</div>
              <div><strong>Effective Date:</strong> {supplierDetails.effectiveDate}</div>
            </div>
          </div>

          <div className="terms-grid">
            {termsSections.map((sec) => (
              <article key={sec.id} className="term-card">
                <h2>{sec.title}</h2>
                <div className="term-summary-pill">{sec.summary}</div>
                <div className="term-content">
                  {sec.content.map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <div className="terms-contact-callout">
            <h3>Need clarification regarding our supplier terms or VAC batch verification?</h3>
            <p>Reach out to us directly for batch numbers, certification, or practitioner inquiries.</p>
            <ContactButtons message="Hi Ayur Mandira, I have a question regarding your supplier terms and VAC products." />
          </div>
        </div>
      </section>
      <ClosingCta />
    </motion.div>
  );
}

function ContactPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}>
      <PageMeta
        title={seo.contact.title}
        description={seo.contact.description}
        path="/contact"
        schema={organizationSchema()}
      />
      <section className="section">
        <div className="wrap">
          <Breadcrumb items={[{ name: 'Home', href: '/' }, { name: 'Contact' }]} />
          <p className="eyebrow">Contact Ayur Mandira</p>
          <h1>How can we help?</h1>
          <p className="lead">For orders, get in touch by phone or WhatsApp. For general queries, email us. We are the exclusive supplier of Vijayanagar Ayurvedic Centre (VAC) products in Bangalore.</p>
          <div className="contact-options">
            <article className="contact-option"><p className="eyebrow">Order by phone</p><h2>Call us</h2><p>Speak with Ayur Mandira directly.</p><a className="button button-primary" href={`tel:${site.phoneLink}`} onClick={trackPhoneConversion} data-testid="contact-page-call"><Phone size={17} aria-hidden="true" /> Call {site.phone}</a></article>
            <article className="contact-option"><p className="eyebrow">Order by message</p><h2>WhatsApp us</h2><p>Send us a message about the product you are interested in.</p><a className="button button-primary" href={whatsappUrl('Hi Ayur Mandira, I would like to know more.')} target="_blank" rel="noopener noreferrer" data-testid="contact-page-whatsapp"><MessageCircle size={17} aria-hidden="true" /> WhatsApp Ayur Mandira</a></article>
          </div>
          <div className="contact-details">
            <div className="contact-detail-card">
              <span className="contact-detail-label">General queries</span>
              <a className="contact-inline-link" href={`mailto:${site.email}`}>
                <Mail size={18} aria-hidden="true" />
                <span>{site.email}</span>
              </a>
            </div>
            <div className="contact-detail-card">
              <span className="contact-detail-label">Instagram</span>
              <a className="contact-inline-link" href={site.instagramUrl} target="_blank" rel="noopener noreferrer">
                <Instagram size={18} aria-hidden="true" />
                <span>{site.instagramHandle}</span>
              </a>
            </div>
            <div className="contact-detail-card">
              <span className="contact-detail-label">Location</span>
              <div className="contact-inline-link">
                <MapPin size={18} aria-hidden="true" />
                <span>{site.city}, {site.region}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}

function NotFound() {
  const [query, setQuery] = useState('');
  const [, navigate] = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/products`);
    }
  };

  return (
    <section className="section">
      <div className="wrap" style={{ textAlign: 'center', maxWidth: 640 }}>
        <p className="eyebrow">404 Error</p>
        <h1>We couldn't find that page.</h1>
        <p className="lead" style={{ marginInline: 'auto' }}>
          The link you followed may be incorrect, or the page may have been moved. Try searching our catalog or return home.
        </p>
        <form onSubmit={handleSearch} className="substitute-search-form" style={{ marginBlock: 28 }}>
          <Search size={18} aria-hidden="true" />
          <input
            type="text"
            placeholder="Search products (e.g. digestive, diabetes, skin)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="button button-primary">Search</button>
        </form>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" className="button button-primary">Return Home</Link>
          <Link href="/products" className="button button-secondary">Browse Products</Link>
          <Link href="/blogs" className="button button-secondary">Read Health Articles</Link>
        </div>
      </div>
    </section>
  );
}

function RouterContent() {
  const [path] = useLocation();
  return (
    <SiteShell>
      <ErrorBoundary resetKey={path}>
        <AnimatePresence mode="wait">
          <Switch key={path}>
            <Route path="/" component={HomePage} />
            <Route path="/about" component={AboutPage} />
            <Route path="/products" component={ProductsPage} />
            <Route path="/products/:slug">{(params) => <ProductDetailPage slug={params.slug} />}</Route>
            <Route path="/blogs" component={BlogsPage} />
            <Route path="/blogs/:slug">{(params) => <BlogPostPage slug={params.slug} />}</Route>
            <Route path="/terms" component={TermsPage} />
            <Route path="/contact" component={ContactPage} />
            <Route><NotFound /></Route>
          </Switch>
        </AnimatePresence>
      </ErrorBoundary>
      <span className="sr-only" aria-live="polite" key={path}>{path}</span>
    </SiteShell>
  );
}

export default function App() {
  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <RouterContent />
    </WouterRouter>
  );
}
