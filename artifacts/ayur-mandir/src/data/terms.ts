export interface TermSection {
  id: string;
  title: string;
  summary: string;
  content: string[];
}

export const supplierDetails = {
  distributorName: 'Ayur Mandira',
  manufacturerName: 'Vijayanagar Ayurvedic Centre (VAC)',
  location: 'Bangalore, Karnataka, India',
  email: 'ayurmandira@gmail.com',
  phone: '+91 84969 54795',
  effectiveDate: 'October 2026',
};

export const termsSections: TermSection[] = [
  {
    id: 'supplier-scope',
    title: '1. Role and Scope as Authorized Supplier',
    summary: 'Ayur Mandira operates as a dedicated supplier and distributor of authentic Ayurvedic formulations in Bangalore.',
    content: [
      'Ayur Mandira is a registered supplier and distributor of traditional Ayurvedic supplements and herbal wellness products based in Bangalore, Karnataka.',
      'Our primary mandate is providing consumers, families, and wellness practitioners with genuine, authenticated Ayurvedic preparations sourced directly from reputable manufacturers.',
      'All commercial transactions, inquiries, and dispatches fulfilled by Ayur Mandira are governed strictly by the terms, disclosures, and warranties outlined herein.',
    ],
  },
  {
    id: 'exclusive-sourcing-vac',
    title: '2. Exclusive Sourcing: Vijayanagar Ayurvedic Centre (VAC)',
    summary: '100% of our inventory is exclusively procured from Vijayanagar Ayurvedic Centre (VAC).',
    content: [
      'Ayur Mandira procures its entire catalog exclusively from Vijayanagar Ayurvedic Centre, widely known as VAC—a trusted, long-standing institution in traditional Ayurvedic preparation.',
      'We do not engage secondary brokers, third-party stockists, or unverified re-packagers. Every bottle, jar, tube, and churna in our inventory is supplied directly from VAC with verified batch documentation.',
      'By maintaining a single, exclusive manufacturing relationship with Vijayanagar Ayurvedic Centre (VAC), Ayur Mandira guarantees the provenance, authenticity, and classical formulation standards of every item delivered.',
    ],
  },
  {
    id: 'medical-disclaimer',
    title: '3. Medical & Regulatory Disclaimer (Supplier Perspective)',
    summary: 'Products are classical herbal supplements for supportive wellness, not clinical pharmaceutical replacements.',
    content: [
      'The products distributed by Ayur Mandira are traditional Ayurvedic proprietary medicines, herbal food supplements, and classical wellness formulations. They are not synthetic pharmaceutical drugs.',
      'Statements made on this website, product packaging, and informational literature have not been evaluated to replace statutory medical advice or to diagnose, treat, cure, or prevent any acute clinical emergency or pathology.',
      'Individual responses to Ayurvedic formulations depend on unique constitutional factors (Prakriti, Vikriti, Agni, and metabolic balance). Ayur Mandira makes no generalized guarantees regarding specific therapeutic timelines.',
    ],
  },
  {
    id: 'practitioner-consultation',
    title: '4. Mandatory Medical Consultation Advisory',
    summary: 'Always consult a qualified Ayurvedic physician (BAMS/MD) or healthcare professional before taking supplements.',
    content: [
      'We strongly recommend that customers consult a qualified Ayurvedic physician (Vaidya / BAMS / MD Ayurveda) or certified healthcare practitioner prior to starting any herbal regimen.',
      'Physician guidance is particularly critical for individuals who are pregnant, lactating, nursing, pediatric or geriatric patients, individuals with diagnosed chronic conditions (including severe hypertension, renal dysfunction, or cardiovascular disorders), and anyone currently taking prescription allopathic medications.',
      'Never discontinue, alter, or delay prescribed clinical medications or conventional medical therapy without direct approval from your attending physician.',
    ],
  },
  {
    id: 'quality-storage',
    title: '5. Product Integrity, Batch Standards & Storage Guidelines',
    summary: 'Products are warehoused in temperature-controlled, hygienic facilities; proper customer storage is required.',
    content: [
      'Ayur Mandira stores all products in clean, climate-controlled, dry environments protected from direct sunlight, moisture, and pests, adhering to Ayurvedic storage principles.',
      'Every product is supplied with its intact original manufacturer seal, clear batch number, manufacturing date, and expiration date provided by Vijayanagar Ayurvedic Centre (VAC).',
      'The consumer is obligated to store the products in a cool, dry place away from direct sunlight, keep lids tightly closed, and use dry spoons to prevent moisture contamination in powders and churnas.',
    ],
  },
  {
    id: 'ordering-pricing',
    title: '6. Ordering, Inquiries & Price Transparency',
    summary: 'Orders are processed directly via Phone and WhatsApp with clear pricing and batch confirmation.',
    content: [
      'To provide personalized care and accurate batch information, orders are placed via direct communication (Phone Call or verified WhatsApp).',
      'Prices quoted by Ayur Mandira adhere strictly to the Maximum Retail Price (MRP) established by Vijayanagar Ayurvedic Centre (VAC) or applicable seasonal promotional rates inclusive of statutory taxes.',
      'Order confirmation occurs once customer delivery details and product availability are verified by our team.',
    ],
  },
  {
    id: 'shipping-delivery',
    title: '7. Packaging, Shipping & Delivery Protocols',
    summary: 'Carefully packaged with tamper-evident materials and dispatched across Bangalore and Karnataka.',
    content: [
      'Ayur Mandira dispatches orders using protective, shock-absorbent packaging designed to prevent breakage of glass containers, effervescent tubes, and jars.',
      'Deliveries within Bangalore are scheduled through reliable local logistics partners. Consignments outside Bangalore are shipped through trusted courier networks.',
      'Customers are advised to inspect the external parcel upon delivery and notify the delivery agent immediately if the outer package appears visibly crushed or tampered with.',
    ],
  },
  {
    id: 'returns-safety',
    title: '8. Consumable Safety, Hygiene Seals & Replacement Policy',
    summary: 'For hygiene and safety reasons, opened consumable health products cannot be returned or refunded.',
    content: [
      'Strict Hygiene Protocol: In accordance with health and drug safety standards for consumable health preparations, opened, unsealed, or partially consumed Ayurvedic items cannot be returned or refunded once the tamper seal is breached.',
      'Damaged or Defective Items: In the event a product is received broken, leaking, or damaged in transit, the customer must contact Ayur Mandira within 48 hours of delivery via WhatsApp with photographic/video evidence of the sealed package and damage.',
      'Upon verification, Ayur Mandira will arrange an immediate replacement or store credit at no additional charge.',
    ],
  },
  {
    id: 'liability-limitation',
    title: '9. Limitation of Liability',
    summary: 'Ayur Mandira acts as an authorized supplier; liability is limited to product replacement value.',
    content: [
      'As a distributor and supplier of formulations manufactured by Vijayanagar Ayurvedic Centre (VAC), Ayur Mandira’s liability is strictly limited to the retail purchase price of the delivered product.',
      'Ayur Mandira is not liable for allergic reactions, idiosyncrasies, or improper usage resulting from failure to read product labels or non-compliance with practitioner advice.',
      'Customers are encouraged to conduct a small patch test for topical creams and review ingredient lists for known botanical allergies before full application.',
    ],
  },
  {
    id: 'governing-law',
    title: '10. Regulatory Compliance & Jurisdiction',
    summary: 'Compliant with Indian AYUSH regulations and governed by the laws of Bangalore, Karnataka.',
    content: [
      'These Terms & Conditions operate under the regulatory framework established by the Ministry of AYUSH, the Drugs and Cosmetics Act of India, and applicable consumer protection statutes.',
      'Any legal disputes, interpretations, or claims arising from transactions with Ayur Mandira are subject to the exclusive jurisdiction of the competent courts in Bangalore, Karnataka, India.',
      'For inquiries regarding batch certificates, product sourcing from Vijayanagar Ayurvedic Centre (VAC), or terms clarification, please contact ayurmandira@gmail.com or call +91 84969 54795.',
    ],
  },
];
