export type Product = {
  slug: string;
  name: string;
  descriptor: string;
  category: string;
  tags: string[];
  image: string | null;
  imageAlt: string;
  sections: { title: string; content: string | null }[];
  packSize: string | null;
  manufacturer: string;
};

export const products: Product[] = [
  {
    slug: 'amla-turmeric-effervescent-tablet',
    name: 'Amla Turmeric Effervescent Tablet',
    descriptor: 'Overall Diabetes Management & Glycemic Balance',
    category: 'Diabetes Care',
    tags: ['diabetes', 'sugar', 'blood sugar', 'amla', 'turmeric', 'nishamalaki', 'glycemic', 'tablets', 'effervescent', 'vac'],
    image: '/assets/lightroom-03.webp',
    imageAlt: 'Amla Turmeric Effervescent Tablet tube by Vijayanagar Ayurvedic Centre (VAC), 20 tablets',
    manufacturer: 'Vijayanagar Ayurvedic Centre (VAC)',
    sections: [
      {
        title: 'Overview',
        content: 'A clinically designed Ayurvedic effervescent formulation combining traditional Nishamalaki (Amla and Turmeric). Exclusively prepared by Vijayanagar Ayurvedic Centre (VAC) to support healthy insulin response, protect pancreatic beta-cells from oxidative stress, and balance systemic Kapha-Pitta doshas.',
      },
      {
        title: 'Key ingredients',
        content: 'Standardized Amalaki (Phyllanthus emblica) extract, Curcuma longa (Haridra rhizome extract with active curcuminoids), natural mineral effervescent base.',
      },
      {
        title: 'How to use',
        content: 'Drop 1 tablet into 150ml of fresh room-temperature water. Allow it to completely dissolve, then drink immediately. Recommended once daily after breakfast or as directed by an Ayurvedic physician.',
      },
      {
        title: 'Pack size',
        content: '20 effervescent tablets, moisture-sealed tube pack',
      },
      {
        title: 'Cautions',
        content: 'Dietary supplement for wellness support. Regularly monitor blood sugar levels when co-administering with prescription anti-diabetic medication. Consult your physician during pregnancy or lactation.',
      },
    ],
    packSize: '20 effervescent tablets, moisture-sealed tube pack',
  },
  {
    slug: 'advanced-digestive-powder',
    name: 'ADP, Advanced Digestive Powder',
    descriptor: 'Restores Gut Agni, Eliminates Acid Reflux & Bloating',
    category: 'Digestive Care',
    tags: ['digestive', 'digestion', 'gut', 'acidity', 'gas', 'bloating', 'triphala', 'churna', 'powder', 'constipation', 'adp', 'vac'],
    image: '/assets/lightroom-01.webp',
    imageAlt: 'ADP Advanced Digestive Powder jar by Vijayanagar Ayurvedic Centre (VAC)',
    manufacturer: 'Vijayanagar Ayurvedic Centre (VAC)',
    sections: [
      {
        title: 'Overview',
        content: 'Advanced Digestive Powder (ADP) is a doctor-formulated classical digestive blend formulated by Vijayanagar Ayurvedic Centre (VAC). Designed according to the Deepana-Pachana principle to kindle Jatharagni (digestive fire), clear metabolic toxins (Ama), and eliminate post-meal heaviness.',
      },
      {
        title: 'Key ingredients',
        content: 'Triphala (Haritaki, Bibhitaki, Amalaki), Shunthi (Zingiber officinale), Mishreya (Fennel seed), Jeeraka (Cumin), Saindhava Lavana (Rock salt), Shuddha Hingu (Purified Asafoetida).',
      },
      {
        title: 'How to use',
        content: 'Take 1 level teaspoon (approx. 3-5g) with lukewarm water 15 minutes before major meals or before bedtime for smooth morning elimination.',
      },
      {
        title: 'Pack size',
        content: '100g airtight glass container with tamper-evident seal',
      },
      {
        title: 'Cautions',
        content: 'Store in a cool dry place. Use only dry spoons to prevent moisture contamination. Keep lid sealed tightly.',
      },
    ],
    packSize: '100g airtight glass container',
  },
  {
    slug: 'skin-cream',
    name: 'Skin Cream',
    descriptor: 'Deep Herbal Nourishment & Complexion Radiance',
    category: 'Skin Care',
    tags: ['skin', 'cream', 'face', 'radiance', 'glow', 'turmeric', 'saffron', 'kumkumadi', 'blemish', 'pitta', 'vac'],
    image: '/assets/lightroom-02.webp',
    imageAlt: 'Skin Cream tubs by Vijayanagar Ayurvedic Centre (VAC)',
    manufacturer: 'Vijayanagar Ayurvedic Centre (VAC)',
    sections: [
      {
        title: 'Overview',
        content: 'An intensive Ayurvedic herbal formulation crafted with classical skin-rejuvenating herbs by Vijayanagar Ayurvedic Centre (VAC). Soothes aggravated Bhrajaka Pitta, improves epidermal microcirculation, diminishes blemishes, and provides all-day lipid barrier protection.',
      },
      {
        title: 'Key ingredients',
        content: 'Kashmiri Saffron (Kumkuma), Wild Turmeric (Kasturi Manjal), Sandalwood (Chandan), Aloe Vera Leaf extract, cold-pressed Sesame oil base, and natural beeswax.',
      },
      {
        title: 'How to use',
        content: 'Gently cleanse face and pat dry. Apply a dime-sized amount evenly across face and neck using gentle upward strokes until absorbed. Ideal for morning and nocturnal skincare rituals.',
      },
      {
        title: 'Pack size',
        content: '50g dual-pot protective container pack',
      },
      {
        title: 'Cautions',
        content: 'For external topical use only. Perform a patch test on inner forearm prior to initial application. Avoid contact with eyes.',
      },
    ],
    packSize: '50g dual-pot container pack',
  },
];

export const medicalDisclaimer =
  'These products are authentic Ayurvedic supplements manufactured by Vijayanagar Ayurvedic Centre (VAC) and distributed by Ayur Mandira. They are not intended to substitute professional medical diagnosis or clinical prescription. Consult a qualified Ayurvedic physician (BAMS/MD) or healthcare professional before beginning any herbal regimen.';
