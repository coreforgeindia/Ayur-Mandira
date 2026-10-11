export const site = {
  name: 'Ayur Mandir',
  kannadaName: 'ಆಯುರ್ ಮಂದಿರ್',
  phone: '+91 84969 54795',
  phoneLink: '+918496954795',
  whatsappNumber: '918496954795',
  email: 'ayurmandira@gmail.com',
  instagramHandle: '@ayurmandiraofficial',
  instagramUrl: 'https://instagram.com/ayurmandiraofficial',
  city: 'Bangalore',
  region: 'Karnataka',
  siteUrl: (import.meta.env.VITE_SITE_URL || '').replace(/\/$/, ''),
};

export const whatsappUrl = (message: string) =>
  `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;
