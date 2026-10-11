import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link, Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import { ArrowRight, ChevronRight, Instagram, Mail, Menu, MessageCircle, Phone, X } from 'lucide-react';
import { ErrorBoundary } from '@/components/error-boundary';
import { site, whatsappUrl } from '@/data/site';
import { medicalDisclaimer, products, type Product } from '@/data/products';

type PageMetaProps = {
  title: string;
  description: string;
  path: string;
  schema?: Record<string, unknown> | Record<string, unknown>[];
};

function PageMeta({ title, description, path, schema }: PageMetaProps) {
  useEffect(() => {
    document.title = title;
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
    if (site.siteUrl) {
      setMeta('meta[property="og:url"]', 'content', `${site.siteUrl}${path}`);
      setMeta('meta[property="og:image"]', 'content', `${site.siteUrl}/assets/ayur-mandir-logo.jpeg`);
      setMeta('meta[name="twitter:image"]', 'content', `${site.siteUrl}/assets/ayur-mandir-logo.jpeg`);
    }
    setMeta('meta[name="twitter:title"]', 'content', title);
    setMeta('meta[name="twitter:description"]', 'content', description);
    let canonical = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (site.siteUrl) {
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.rel = 'canonical';
        document.head.appendChild(canonical);
      }
      canonical.href = `${site.siteUrl}${path}`;
    } else if (canonical) canonical.remove();
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

function ContactButtons({ message = 'Hi Ayur Mandir, I would like to know more.' }: { message?: string }) {
  return (
    <div className="contact-inline">
      <a className="button button-primary" href={`tel:${site.phoneLink}`} data-testid="contact-call">
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
  { label: 'Contact', href: '/contact' },
];

function Navbar() {
  const [path, setPath] = useLocation();
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

  const isActive = (href: string) => href === '/' ? path === '/' : path === href || path.startsWith(`${href}/`);
  const toggle = () => setOpen((value) => !value);
  return (
    <header className="site-header">
      <div className="nav-inner">
        <Link href="/" className="brand-link" aria-label="Ayur Mandir home" data-testid="brand-home">
          <img src="/assets/ayur-mandir-logo.jpeg" alt="Ayur Mandir" width="112" height="66" />
        </Link>
        <nav className="nav-links" aria-label="Primary navigation">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} aria-current={isActive(item.href) ? 'page' : undefined} data-testid={`nav-${item.label.toLowerCase().replaceAll(' ', '-')}`}>
              {item.label}
            </Link>
          ))}
        </nav>
        <a className="button button-primary nav-order" href={whatsappUrl('Hi Ayur Mandir, I would like to know more.')} target="_blank" rel="noopener noreferrer" data-testid="nav-order-whatsapp">
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
          <Link key={item.href} href={item.href} aria-current={isActive(item.href) ? 'page' : undefined} tabIndex={open ? 0 : -1} data-testid={`mobile-nav-${item.label.toLowerCase().replaceAll(' ', '-')}`}>
            {item.label}
          </Link>
        ))}
        <a className="button button-primary" href={whatsappUrl('Hi Ayur Mandir, I would like to know more.')} target="_blank" rel="noopener noreferrer" tabIndex={open ? 0 : -1} data-testid="mobile-order-whatsapp">
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
            <Link href="/" className="footer-logo-panel" aria-label="Ayur Mandir home" data-testid="footer-brand">
              <img src="/assets/ayur-mandir-logo.jpeg" alt="Ayur Mandir" width="130" height="88" loading="lazy" />
            </Link>
          </div>
          <nav className="footer-links" aria-label="Footer navigation">
            <h2>Explore</h2>
            {navigation.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}
          </nav>
          <div className="footer-contact">
            <h2>Get in touch</h2>
            <a href={`tel:${site.phoneLink}`}><Phone size={15} aria-hidden="true" /> {site.phone}</a>
            <a href={whatsappUrl('Hi Ayur Mandir, I would like to know more.')} target="_blank" rel="noopener noreferrer"><MessageCircle size={15} aria-hidden="true" /> WhatsApp</a>
            <a href={`mailto:${site.email}`}><Mail size={15} aria-hidden="true" /> {site.email}</a>
            <a href={site.instagramUrl} target="_blank" rel="noopener noreferrer"><Instagram size={15} aria-hidden="true" /> {site.instagramHandle}</a>
            <p>{site.city}, {site.region}</p>
          </div>
        </div>
        <p className="footer-disclaimer" data-testid="footer-disclaimer">{medicalDisclaimer}</p>
        <div className="copyright"><span>© {new Date().getFullYear()} Ayur Mandir</span><span>{site.city}, {site.region}</span></div>
      </div>
    </footer>
  );
}

function SiteShell({ children }: { children: ReactNode }) {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <Navbar />
      <main id="main-content">{children}</main>
      <Footer />
      <div className="mobile-order-bar" role="group" aria-label="Quick contact actions">
        <a className="button button-primary" href={`tel:${site.phoneLink}`} data-testid="mobile-sticky-call"><Phone size={16} aria-hidden="true" /> Call</a>
        <a className="button button-secondary" href={whatsappUrl('Hi Ayur Mandir, I would like to know more.')} target="_blank" rel="noopener noreferrer" data-testid="mobile-sticky-whatsapp"><MessageCircle size={16} aria-hidden="true" /> WhatsApp</a>
      </div>
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
    return <div className="image-placeholder" role="img" aria-label={`${product.name} image to be added`}><span>Product image<br />To be added</span></div>;
  }
  return <img src={product.image} alt={product.imageAlt} width="640" height="800" loading={lazy ? 'lazy' : 'eager'} />;
}

function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.slug}`} className="product-card" data-testid={`product-card-${product.slug}`}>
      <div className="product-frame"><ProductImage product={product} /></div>
      <div className="product-card-copy">
        <h3>{product.name}</h3>
        <p>{product.descriptor}</p>
        <span className="card-link">View details</span>
      </div>
    </Link>
  );
}

function ProductCards({ items = products }: { items?: Product[] }) {
  return <div className="product-grid">{items.map((product) => <ProductCard key={product.slug} product={product} />)}</div>;
}

function ClosingCta() {
  return (
    <section className="cta-band">
      <div className="wrap">
        <p className="eyebrow">We are here to help</p>
        <h2>Questions? Call, WhatsApp or email us.</h2>
        <p>Choose the way that works best for you.</p>
        <ContactButtons />
        <p style={{ marginTop: 16, marginBottom: 0 }}><a href={`mailto:${site.email}`} style={{ color: 'var(--color-clouds)' }}>{site.email}</a></p>
      </div>
    </section>
  );
}

function HomePage() {
  return (
    <>
      <PageMeta title="Ayurvedic Supplements in Bangalore | Ayur Mandir" description="Ayur Mandir supplies genuine Ayurvedic supplements sourced from verified suppliers in Bangalore. Explore our products and order by call or WhatsApp." path="/" schema={organizationSchema()} />
      <section className="hero">
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Ayur Mandir · Bangalore</p>
            <h1>Genuine Ayurvedic supplements, sourced from verified suppliers.</h1>
            <p className="lead">We bring together carefully sourced Ayurvedic supplements. Discover our range and speak with us directly to order.</p>
            <div className="hero-actions">
              <Link href="/products" className="button button-primary" data-testid="home-view-products">View Products</Link>
              <a href={whatsappUrl('Hi Ayur Mandir, I would like to know more.')} className="button button-secondary" target="_blank" rel="noopener noreferrer" data-testid="home-whatsapp"><MessageCircle size={17} aria-hidden="true" /> Order on WhatsApp</a>
            </div>
          </div>
          <div className="hero-art">
            <img src="/assets/ayur-mandir-logo.jpeg" alt="Ayur Mandir temple emblem and Kannada wordmark" width="814" height="610" fetchPriority="high" />
            <span className="hero-caption">A Bangalore-based Ayurvedic supplement supplier</span>
          </div>
        </div>
      </section>
      <section className="section section-sand">
        <div className="wrap intro-grid">
          <div>
            <p className="eyebrow">What we do</p>
            <h2>A considered way to find your supplements.</h2>
          </div>
          <div>
            <p className="lead">Ayur Mandir is a Bangalore-based supplier of Ayurvedic supplements. We source only from verified suppliers and make sure every product is genuine. For product information and orders, speak with us directly.</p>
            <ul className="facts"><li>Verified suppliers</li><li>Genuine products</li><li>Order by call or WhatsApp</li></ul>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="wrap">
          <div className="section-heading"><div><p className="eyebrow">Our range</p><h2>Our products</h2></div><Link className="text-link" href="/products">View all products <ArrowRight size={16} aria-hidden="true" /></Link></div>
          <ProductCards />
        </div>
      </section>
      <section className="section section-glacial">
        <div className="wrap">
          <p className="eyebrow">Simple and direct</p><h2>How to order</h2>
          <div className="steps">
            <div className="step"><h3>Choose a product</h3><p>Browse the product range and choose what you would like to ask about.</p></div>
            <div className="step"><h3>Call or WhatsApp us</h3><p>Get in touch directly with Ayur Mandir.</p></div>
            <div className="step"><h3>We confirm your order</h3><p>We will confirm details with you directly.</p></div>
          </div>
          <ContactButtons />
        </div>
      </section>
      <ClosingCta />
    </>
  );
}

function AboutPage() {
  return (
    <>
      <PageMeta title="About Ayur Mandir | Bangalore Ayurvedic Supplier" description="Learn about Ayur Mandir, a Bangalore-based supplier of genuine Ayurvedic supplements sourced only from verified suppliers." path="/about" schema={organizationSchema()} />
      <section className="section">
        <div className="wrap">
          <Breadcrumb items={[{ name: 'Home', href: '/' }, { name: 'About Us' }]} />
          <p className="eyebrow">About Ayur Mandir</p>
          <h1>A trusted source for Ayurvedic supplements.</h1>
          <p className="lead">Ayur Mandir is a Bangalore-based supplier of Ayurvedic supplements, serving people looking for genuine products from verified suppliers.</p>
        </div>
      </section>
      <section className="section section-sand">
        <div className="wrap about-columns">
          <div><p className="eyebrow">Our sourcing promise</p><h2>Verified suppliers. Genuine products.</h2></div>
          <div className="promise-box"><p>We source only from verified suppliers and make sure every product is genuine.</p><p className="placeholder">Supplier verification details: To be added</p></div>
        </div>
      </section>
      <section className="section">
        <div className="wrap about-columns">
          <div><p className="eyebrow">What we offer</p><h2>A small range, with direct answers.</h2></div>
          <div><p>Explore our Ayurvedic supplement range, then call or message us for product information, pricing and availability.</p><Link href="/products" className="button button-primary">Explore products</Link>
            <div className="location-block"><h3>Find us</h3><p>{site.city}, {site.region}</p><p className="placeholder">Full address: To be added</p></div>
          </div>
        </div>
      </section>
      <ClosingCta />
    </>
  );
}

function ProductsPage() {
  return (
    <>
      <PageMeta title="Ayurvedic Products | Ayur Mandir Bangalore" description="Explore Ayur Mandir's Ayurvedic supplement range: Amla Turmeric Effervescent Tablet, Advanced Digestive Powder and Skin Cream." path="/products" schema={organizationSchema()} />
      <section className="section">
        <div className="wrap">
          <Breadcrumb items={[{ name: 'Home', href: '/' }, { name: 'Products' }]} />
          <p className="eyebrow">Ayur Mandir · Product range</p>
          <h1>Our products</h1>
          <p className="lead">Explore our Ayurvedic supplement range. For product details, pricing and availability, call or WhatsApp us.</p>
          <div style={{ marginTop: 40 }}><h2 className="sr-only">Product listings</h2><ProductCards /></div>
        </div>
      </section>
      <ClosingCta />
    </>
  );
}

function ProductDetailPage({ product }: { product: Product }) {
  const otherProducts = products.filter((item) => item.slug !== product.slug);
  const path = `/products/${product.slug}`;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.descriptor,
    ...(product.image ? { image: site.siteUrl ? `${site.siteUrl}${product.image}` : product.image } : {}),
    brand: { '@type': 'Brand', name: site.name },
    ...(site.siteUrl ? { url: `${site.siteUrl}${path}` } : {}),
  };
  return (
    <>
      <PageMeta title={`${product.name} | Ayur Mandir`} description={`${product.name} from Ayur Mandir. ${product.descriptor}. Call or WhatsApp for product information, pricing and availability.`} path={path} schema={schema} />
      <section className="page-intro">
        <div className="wrap">
          <Breadcrumb items={[{ name: 'Home', href: '/' }, { name: 'Products', href: '/products' }, { name: product.name }]} />
          <p className="eyebrow">Ayur Mandir · Product information</p>
        </div>
      </section>
      <section className="wrap product-detail">
        <div className="detail-media">
          {product.image ? <ProductImage product={product} lazy={false} /> : <ProductImage product={product} lazy={false} />}
        </div>
        <div className="detail-copy">
          <h1>{product.name}</h1>
          <p className="lead">{product.descriptor}</p>
          <p>Call or WhatsApp for pricing and availability.</p>
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
            <ContactButtons message={`Hi Ayur Mandir, I'd like to order ${product.name}`} />
          </div>
          <p className="disclaimer" style={{ marginTop: 24 }} data-testid="product-disclaimer">{medicalDisclaimer}</p>
        </div>
      </section>
      <section className="section-sand other-products">
        <div className="wrap"><p className="eyebrow">Continue browsing</p><h2>Other products</h2><ProductCards items={otherProducts} /></div>
      </section>
    </>
  );
}

function ContactPage() {
  return (
    <>
      <PageMeta title="Contact Ayur Mandir | Call or WhatsApp" description="Contact Ayur Mandir in Bangalore. Call or WhatsApp to order, email for general queries, or find us on Instagram." path="/contact" schema={organizationSchema()} />
      <section className="section">
        <div className="wrap">
          <Breadcrumb items={[{ name: 'Home', href: '/' }, { name: 'Contact' }]} />
          <p className="eyebrow">Contact Ayur Mandir</p>
          <h1>How can we help?</h1>
          <p className="lead">For orders, get in touch by phone or WhatsApp. For general queries, email us.</p>
          <div className="contact-options">
            <article className="contact-option"><p className="eyebrow">Order by phone</p><h2>Call us</h2><p>Speak with Ayur Mandir directly.</p><a className="button button-primary" href={`tel:${site.phoneLink}`} data-testid="contact-page-call"><Phone size={17} aria-hidden="true" /> Call {site.phone}</a></article>
            <article className="contact-option"><p className="eyebrow">Order by message</p><h2>WhatsApp us</h2><p>Send us a message about the product you are interested in.</p><a className="button button-primary" href={whatsappUrl('Hi Ayur Mandir, I would like to know more.')} target="_blank" rel="noopener noreferrer" data-testid="contact-page-whatsapp"><MessageCircle size={17} aria-hidden="true" /> WhatsApp Ayur Mandir</a></article>
          </div>
          <div className="contact-details">
            <div><p className="eyebrow">General queries</p><a href={`mailto:${site.email}`}><Mail size={16} aria-hidden="true" /> {site.email}</a></div>
            <div><p className="eyebrow">Instagram</p><a href={site.instagramUrl} target="_blank" rel="noopener noreferrer"><Instagram size={16} aria-hidden="true" /> {site.instagramHandle}</a></div>
            <div><p className="eyebrow">Location</p><p>{site.city}, {site.region}</p></div>
          </div>
        </div>
      </section>
    </>
  );
}

function NotFound() {
  return <section className="section"><div className="wrap"><p className="eyebrow">Page not found</p><h1>We could not find that page.</h1><Link href="/" className="button button-primary">Return home</Link></div></section>;
}

function RouterContent() {
  const [path] = useLocation();
  return (
    <SiteShell>
      <ErrorBoundary resetKey={path}>
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/about" component={AboutPage} />
          <Route path="/products" component={ProductsPage} />
          {products.map((product) => <Route key={product.slug} path={`/products/${product.slug}`}><ProductDetailPage product={product} /></Route>)}
          <Route path="/contact" component={ContactPage} />
          <Route><NotFound /></Route>
        </Switch>
      </ErrorBoundary>
      <span className="sr-only" aria-live="polite" key={path}>{path}</span>
    </SiteShell>
  );
}

export default function App() {
  return <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><RouterContent /></WouterRouter>;
}
