export type Product = {
  slug: string;
  name: string;
  descriptor: string;
  image: string | null;
  imageAlt: string;
  sections: { title: string; content: string | null }[];
  packSize: string | null;
};

export const products: Product[] = [
  {
    slug: 'amla-turmeric-effervescent-tablet',
    name: 'Amla Turmeric Effervescent Tablet',
    descriptor: 'Overall Diabetes Management',
    image: null,
    imageAlt: 'Amla Turmeric Effervescent Tablet tube, 20 tablets',
    sections: [
      { title: 'Overview', content: null },
      { title: 'Key ingredients', content: null },
      { title: 'How to use', content: null },
      { title: 'Pack size', content: '20 effervescent tablets, tube pack' },
      { title: 'Cautions', content: null },
    ],
    packSize: '20 effervescent tablets, tube pack',
  },
  {
    slug: 'advanced-digestive-powder',
    name: 'ADP, Advanced Digestive Powder',
    descriptor: 'For your healthy digestive system with herbs',
    image: '/assets/advanced-digestive-powder.jpeg',
    imageAlt: 'ADP Advanced Digestive Powder in a glass jar',
    sections: [
      { title: 'Overview', content: null },
      { title: 'Key ingredients', content: null },
      { title: 'How to use', content: null },
      { title: 'Pack size', content: null },
      { title: 'Cautions', content: null },
    ],
    packSize: null,
  },
  {
    slug: 'skin-cream',
    name: 'Skin Cream',
    descriptor: 'Enrich your health with herbs',
    image: '/assets/skin-cream.jpeg',
    imageAlt: 'Ayur Mandir Skin Cream shown in two white tubs',
    sections: [
      { title: 'Overview', content: null },
      { title: 'Key ingredients', content: null },
      { title: 'How to use', content: null },
      { title: 'Pack size', content: null },
      { title: 'Cautions', content: null },
    ],
    packSize: null,
  },
];

export const medicalDisclaimer =
  'These products are dietary/Ayurvedic supplements and are not a substitute for medical advice. Consult a qualified healthcare professional before use, especially if you have a medical condition or take medication.';
