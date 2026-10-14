import { blogPosts } from './blogs';
import { products, type Product } from './products';

type SeoMetadata = {
  title: string;
  description: string;
};

export const seo = {
  home: {
    title: 'Ayur Mandira | Ayurvedic Products in Bangalore',
    description:
      'Ayur Mandira is the authorized distributor of Vijayanagar Ayurvedic Centre (VAC) products in Bangalore. Authentic Ayurvedic supplements, order via Call or WhatsApp.',
  },
  about: {
    title: 'About Ayur Mandira | Bangalore Ayurvedic Supplier',
    description:
      "Learn about Ayur Mandira, Bangalore's authorized supplier of authentic Ayurvedic supplements exclusively from Vijayanagar Ayurvedic Centre (VAC).",
  },
  products: {
    title: 'Ayurvedic Products | Ayur Mandira Bangalore',
    description:
      "Explore Ayur Mandira's Ayurvedic supplement range exclusively manufactured by Vijayanagar Ayurvedic Centre (VAC). Search diabetes, digestive, and skin formulations.",
  },
  blogs: {
    title: 'Ayurvedic Health & Wellness Articles | Ayur Mandira Bangalore',
    description:
      'Clinical Ayurvedic research and wellness articles on diabetic patient supplements, Pitta skin balance, and gut Agni restoration by Vijayanagar Ayurvedic Centre.',
  },
  terms: {
    title: 'Terms & Conditions | Ayur Mandira (Supplier & Distributor)',
    description:
      'Terms and conditions for Ayur Mandira from an authorized supplier perspective. Exclusive sourcing from Vijayanagar Ayurvedic Centre (VAC), Bangalore.',
  },
  contact: {
    title: 'Contact Ayur Mandira | Call or WhatsApp',
    description:
      'Contact Ayur Mandira in Bangalore. Call or WhatsApp to order, email for general queries, or find us on Instagram.',
  },
} satisfies Record<string, SeoMetadata>;

export function productSeo(product: Product): SeoMetadata {
  return {
    title: `${product.name} | Ayur Mandira`,
    description: `${product.name} from Ayur Mandira. Sourced from Vijayanagar Ayurvedic Centre (VAC). Call or WhatsApp for pricing and availability.`,
  };
}

export function getStaticSeoRoutes(): { path: string; title: string; description: string }[] {
  return [
    { path: '/', ...seo.home },
    { path: '/about', ...seo.about },
    { path: '/products', ...seo.products },
    ...products.map((product) => ({
      path: `/products/${product.slug}`,
      ...productSeo(product),
    })),
    { path: '/blogs', ...seo.blogs },
    ...blogPosts.map((post) => ({
      path: `/blogs/${post.slug}`,
      title: `${post.title} | Ayur Mandira Blog`,
      description: post.summary,
    })),
    { path: '/terms', ...seo.terms },
    { path: '/contact', ...seo.contact },
  ];
}
