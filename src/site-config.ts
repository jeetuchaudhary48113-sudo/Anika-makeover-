import { SiteConfig } from './types';

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  banners: [
    {
      id: 'banner_1',
      image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=1200',
      title: 'Luxury Beauty & Bridal Studio',
      subtitle: 'Experience world-class professional beauty, premium haircare, and glowing skin treatments crafted by experts.',
      badge: '★★★★★ 5-Star Rated Salon In Gorakhpur'
    },
    {
      id: 'banner_2',
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=1200',
      title: 'Exquisite Bridal Makeovers',
      subtitle: 'Be the star of your special day with our signature Airbrush and High-Definition luxury bridal packages.',
      badge: 'Gorakhpur’s Most Trusted Wedding Service'
    },
    {
      id: 'banner_3',
      image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=1200',
      title: 'Master Hair Transformations',
      subtitle: 'From advanced Keratin treatments to global hair coloring, let our certified stylists redefine your crown.',
      badge: 'Premium International Brands Only'
    }
  ],
  founder: {
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    name: 'Menka Singh',
    designation: 'Founder & Senior Beauty Expert',
    message: 'Welcome to Anika Makeover Salon. With over a decade of dedication to the art of beauty, hair styling, and bridal makeup, my team and I believe that every makeover is an expression of self-love. We combine cutting-edge international standards, certified organic premium products, and clinical hygiene protocols to give you an unparalleled pampering experience right here in Gorakhpur. Step in and let us elevate your natural radiance.',
    experienceYears: 10,
    happyClientsCount: 8500,
    makeoversCount: 1200
  },
  services: [
    {
      category: 'Hair Care',
      services: [
        { id: 'hair_1', title: 'Hair Cutting', description: 'Precision multi-layered cuts, bob adjustments, or custom signature trims matching your face structure.', popular: true },
        { id: 'hair_2', title: 'Hair Styling', description: 'Thermal styling, signature blow-dries, permanent beach waves, crimping, or sophisticated updos for events.', popular: false },
        { id: 'hair_3', title: 'Hair Spa', description: 'Intense nourishment ritual with deep conditioning steam masks to repair damage, combat hair loss, and boost shine.', popular: true },
        { id: 'hair_4', title: 'Hair Coloring', description: 'Premium global coloration, high-contrast highlights, balayage, ombre, or gray coverage using ammonia-free dyes.', popular: true },
        { id: 'hair_5', title: 'Hair Straightening', description: 'Sleek, poker-straight hair restructuring using high-performing thermal bonding elements.', popular: false },
        { id: 'hair_6', title: 'Hair Rebonding', description: 'Advanced structural realignment for long-lasting silky, completely straight hairstyles.', popular: false },
        { id: 'hair_7', title: 'Keratin Treatment', description: 'Protein filling treatment to eliminate frizz, restore moisture, and leave hair ultra-smooth and manageable.', popular: true },
        { id: 'hair_8', title: 'Cysteine Hair Treatment', description: 'Natural protein defense shield designed for dry, colored, or highly sensitive hair textures.', popular: false }
      ]
    },
    {
      category: 'Makeup Services',
      services: [
        { id: 'make_1', title: 'Bridal Makeup', description: 'Luxurious heavy traditional and modern bridal cosmetic styling using high-end global tools designed for high-resolution photography.', popular: true },
        { id: 'make_2', title: 'Air Brush Makeup', description: 'Silicon micro-droplet airbrushing for a highly uniform, ultra-lightweight, and smudge-free velvet skin appearance.', popular: true },
        { id: 'make_3', title: 'Waterproof Makeup', description: 'Specialized elements that resist sweat, humidity, and tears, locking in your gorgeous radiance all night.', popular: false },
        { id: 'make_4', title: 'Party Makeup', description: 'Stunning daytime or evening party looks customized to coordinate with your outfit and theme.', popular: true },
        { id: 'make_5', title: 'Fashion Makeup', description: 'High-contrast stylized cosmetics optimized for ramp shows, photography Portfolios, and theatrical shoots.', popular: false },
        { id: 'make_6', title: 'Eye Makeup', description: 'Mesmerizing focal eye definitions, including cut-creases, smoky eyes, glitter drops, and long-flare faux lash styling.', popular: false }
      ]
    },
    {
      category: 'Skin Care & Facials',
      services: [
        { id: 'skin_1', title: 'Facial Treatments', description: 'Aromatic standard and therapeutic facials targeting brightness, anti-aging, firming, or deep hydration.', popular: true },
        { id: 'skin_2', title: 'Skin Care', description: 'Clinical skin diagnostics and custom nourishing steps designed to establish balance and minimize acne or dryness.', popular: false },
        { id: 'skin_3', title: 'Clean Up', description: 'Rapid dead-skin exfoliation, blackhead extractions, and pore-tightening clay therapy.', popular: false },
        { id: 'skin_4', title: 'Detan', description: 'Safe organic citrus acid packs designed to reverse sunburn, environmental dulling, and dark patches.', popular: false }
      ]
    },
    {
      category: 'Body Care',
      services: [
        { id: 'body_1', title: 'Body Polishing', description: 'Exquisite head-to-toe body scrub, customized fruit oil massage, and glowing milk wrap.', popular: false },
        { id: 'body_2', title: 'Body Spa', description: 'Relaxing hot-oil essential therapy designed to release muscle stress and restore holistic tranquility.', popular: false }
      ]
    },
    {
      category: 'Waxing & Hair Removal',
      services: [
        { id: 'wax_1', title: 'Waxing', description: 'Smooth, painless standard honey, chocolate, or premium Rica waxing for hands, legs, and full body.', popular: true },
        { id: 'wax_2', title: 'Threading', description: 'Delicate hand-looped cotton thread precision shaping for eyebrows, upper lip, chin, and forehead.', popular: false }
      ]
    },
    {
      category: 'Nails & Grooming',
      services: [
        { id: 'nail_1', title: 'Manicure', description: 'Therapeutic hand baths, cuticle trimming, tan removal packs, massage, and professional lacquer coatings.', popular: true },
        { id: 'nail_2', title: 'Pedicure', description: 'Soothing warm foot soak, dead-cell scraping, structural nail filing, moisturizing cream massage, and beautiful colors.', popular: true },
        { id: 'nail_3', title: 'Nail Care', description: 'Advanced nail strengthening, extension repairs, and basic nail polish styling.', popular: false }
      ]
    },
    {
      category: 'Bridal Services',
      services: [
        { id: 'bride_1', title: 'Bridal Packages', description: 'Comprehensive pre-wedding grooming (hair spa, facials, waxing, pedicure) + main wedding day makeover.', popular: false },
        { id: 'bride_2', title: 'Saree Draping', description: 'Faultless box pleat draping, lehenga styling, or traditional heavy chunri setups that stay perfectly pinned.', popular: false },
        { id: 'bride_3', title: 'Bridal Consultation', description: 'Custom hair and cosmetic matching with physical trail discussions prior to your wedding timeline.', popular: false }
      ]
    },
    {
      category: 'Home Services',
      services: [
        { id: 'home_1', title: 'Home Salon Services', description: 'Bringing certified makeover and hair experts directly to your doorstep for pre-wedding and group grooming events.', popular: false }
      ]
    }
  ],
  gallery: [
    { id: 'gal_1', image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=800', title: 'Royal Indian Bridal Makeover', category: 'Bridal Makeup' },
    { id: 'gal_2', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=800', title: 'Matte HD Bridal Transformation', category: 'Bridal Makeup' },
    { id: 'gal_3', image: 'https://images.unsplash.com/photo-1560869713-7d0a29430f23?auto=format&fit=crop&q=80&w=800', title: 'Silk Keratin Treatment & Polish', category: 'Hair Transformations' },
    { id: 'gal_4', image: 'https://images.unsplash.com/photo-1522337060766-9b1717a5f64b?auto=format&fit=crop&q=80&w=800', title: 'Golden Highlights & Soft Waves', category: 'Hair Transformations' },
    { id: 'gal_5', image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=800', title: 'Glamorous Evening Cocktail Look', category: 'Party Looks' },
    { id: 'gal_6', image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=800', title: 'Ethereal Engagement Party Glow', category: 'Party Looks' },
    { id: 'gal_7', image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=800', title: 'Hydro-Dew Radiance Facial Treatment', category: 'Beauty Treatments' },
    { id: 'gal_8', image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=800', title: 'Aromatherapy Skin Rejuvenation', category: 'Beauty Treatments' }
  ],
  videos: [
    {
      id: 'vid_1',
      title: 'Bridal Transformation Reveal',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-beautiful-woman-applying-lipstick-in-front-of-mirror-34449-large.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=400',
      category: 'Bridal Makeup'
    },
    {
      id: 'vid_2',
      title: 'Premium Hair Spa & Styling Session',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-washing-hair-in-a-salon-39906-large.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1560869713-7d0a29430f23?auto=format&fit=crop&q=80&w=400',
      category: 'Hair Care'
    },
    {
      id: 'vid_3',
      title: 'Flawless Eye Makeup & Lashes Tutorial',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hairdresser-styling-hair-with-a-round-brush-39903-large.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=400',
      category: 'Makeup Work'
    }
  ],
  testimonials: [
    {
      id: 'test_1',
      name: 'Priya Sharma',
      role: 'Bride from Gorakhpur',
      photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
      rating: 5,
      text: 'Menka did my bridal makeup and it was absolutely magnificent! Everyone at my wedding in Gorakhpur couldn’t stop praising the elegant, glowing look. She uses highly premium international cosmetics, and the makeup stayed completely fresh and waterproof for over 12 hours. Best bridal makeup artist in Gorakhpur!'
    },
    {
      id: 'test_2',
      name: 'Diksha Singh',
      role: 'Regular Hair Client',
      photo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=400',
      rating: 5,
      text: 'The best hair treatment center in Gorakhpur. I got my damaged frizzy hair treated with their signature Keratin Treatment, and the transformation is unbelievable. My hair is now silky, super straight, and healthy. Their level of hygiene, warm tea service, and expert care is completely premium.'
    },
    {
      id: 'test_3',
      name: 'Neha Tripathi',
      role: 'Event Celebrity',
      photo: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=400',
      rating: 5,
      text: 'Loved my makeup look for the family reception. Subtle, lightweight, yet glamorous enough for heavy photography. Anika Makeover Salon understands your requirements perfectly before beginning. The rose gold, modern aesthetic of their salon is also beautiful!'
    },
    {
      id: 'test_4',
      name: 'Rashmi Verma',
      role: 'Skincare Client',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      rating: 5,
      text: 'Their charcoal d-tan and Hydro-Dew facials are absolutely divine. My skin feels deeply cleansed and brightened. The salon interior feels incredibly peaceful, and the hygiene standards are top-notch. Truly the finest salon in Taramandal!'
    }
  ],
  faqs: [
    {
      id: 'faq_1',
      question: 'How do I book an appointment with Anika Makeover Salon?',
      answer: 'You can instantly book an appointment by filling out our online form, which will pre-compile your services and launch WhatsApp directly to chat with our staff. Alternatively, you can directly call us at 08922933940 or hit the "WhatsApp Now" buttons listed across our website.',
      category: 'appointment'
    },
    {
      id: 'faq_2',
      question: 'What cosmetics brands do you use for Bridal and Airbrush Makeup?',
      answer: 'We secure your skin health and glamour by using only premium, dermatologist-tested international brands such as MAC, Huda Beauty, Bobbi Brown, NARS, Charlotte Tilbury, Estée Lauder, and Anastasica Beverly Hills for both HD and Airbrush styles.',
      category: 'bridal'
    },
    {
      id: 'faq_3',
      question: 'What is the duration of a standard Keratin or Hair Spa treatment?',
      answer: 'A professional Keratin treatment takes approximately 2.5 to 3.5 hours depending on your hair length and volume. A deep conditioning Hair Spa ritual is usually completed in 45 to 60 minutes and includes a soothing pressure-point scalp massage.',
      category: 'services'
    },
    {
      id: 'faq_4',
      question: 'Are home salon services available for destination weddings in Gorakhpur?',
      answer: 'Yes! We run customized home and venue bridal services across Gorakhpur and nearby cities. Our team brings portable professional lighting, product carts, and styling kits directly to your home or hotel wedding suite.',
      category: 'services'
    },
    {
      id: 'faq_5',
      question: 'Where is your salon located? Is parking available?',
      answer: 'Our luxury salon is premiumly located at Budh Vihar Part-C, Near By Pani Ki Tanki, Gaighat Road, Taramandal, Gorakhpur - 273010, Uttar Pradesh, India. We are super easy to locate on Google Maps. We offer secure, dedicated, free parking spaces for our clients.',
      category: 'gorakhpur'
    },
    {
      id: 'faq_6',
      question: 'Why is Anika Makeover Salon considered the best beauty salon in Taramandal, Gorakhpur?',
      answer: 'We holds a perfect 5-Star user rating on Google! This reputation is generated through our highly certified beauty specialists, rigorous hospital-grade sanitization of styling tools, personalized skin diagnostic testing before treatments, and transparent, luxury services at highly affordable prices.',
      category: 'seo'
    }
  ],
  contact: {
    phone: '08922933940',
    phoneFormatted: '+91 8922933940',
    whatsapp: '918922933940',
    whatsappFormatted: '+91 8922933940',
    address: 'Budh Vihar Part-C, Near By Pani Ki Tanki, Gaighat Road, Taramandal, Gorakhpur - 273010, Uttar Pradesh, India',
    addressShort: 'Taramandal, Gorakhpur, UP',
    instagram: 'https://www.instagram.com/anikamakeover45',
    instagramUsername: '@anikamakeover45',
    googleMapsLink: 'https://www.google.com/maps/search/?api=1&query=Anika+Makeover+Salon+Budh+Vihar+Part+C+Gaighat+Road+Taramandal+Gorakhpur',
    googleMapsEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3563.8560029312953!2d83.3934338753232!3d26.717013876766453!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399143ded4a5bb07%3A0xa19c7f1a30dd3b6!2sAnika%20Makeover%20Salon!5e0!3m2!1sen!2sin!4v1717751000000!5m2!1sen!2sin'
  },
  promoBanner: {
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=1200',
    title: 'Grand Seasonal Bridal Makeover Packages',
    subtitle: 'Book your luxury HD or Airbrush bridal makeup look and receive a complimentary premium pre-bridal skin therapy ritual.',
    buttonText: 'Avail Pre-Bridal Offer',
    badge: 'Limited Summer Season Slot Booking Live Now',
    active: true
  },
  welcomeBanner: {
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=1200',
    title: 'Experience Personalized Glamour',
    subtitle: 'Step into Anika Makeover Salon, where your vision meets our premium brush strokes. Under the exquisite guidance of Menka Singh, we customize every detail to celebrate your unique charm.',
    accentText: 'Gorakhpur’s Premium Destination',
    active: true
  },
  shopBanner: {
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=1200',
    title: 'Visit Our Luxury Flagship Salon',
    subtitle: 'Experience state-of-the-art beauty facilities in Gorakhpur designed for ultimate pampering and medical-grade visual hygiene protocols.',
    active: true
  },
  aboutSection: {
    badge: 'Experience Radiance & Elegance',
    title: 'Transform Your Beauty With Expert Salon Care',
    description: 'Anika Makeover Salon delivers professional hairdressing, bridal cosmetics, specialized hydra facials, and grooming routines crafted by highly certified stylists. Step inside to look, feel, and embody your finest self.',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800',
    certifiedBadgeTitle: 'Certified Safe',
    certifiedBadgeText: 'Our premises run sterile, hospital-grade instrument sanitization protocols daily.',
    artistrySubtitle: 'Our Sacred Art of Beauty',
    artistryTitle: 'About Anika Makeover Salon',
    artistryDescription: 'Founded in Gorakhpur, Anika Makeover Salon represents the pinnacle of luxury personalized salon care. We specialize in mapping facial symmetries, calculating customized hair nourishment, and compiling rich wedding makeovers utilizing top-tier international beauty lines.',
    bullets: [
      { title: 'Exquisite Artistry', text: 'Stunning HD & Airbrush results mapped by multi-certified cosmeticians.' },
      { title: 'Strict Clinical Hygiene', text: 'Fresh single-use kits, deep styling station sterilization.' },
      { title: 'Premium Global Line', text: 'Dermatologically cleared formulas from Estée Lauder, HUDA, MAC.' },
      { title: 'Transparent Pricing', text: 'Fair pricing layouts without hidden sub-charges on services.' }
    ]
  },
  whyChooseSection: {
    subtitle: 'THE ANIKA TOUCH',
    title: 'Why Choose Our Salon',
    bullets: [
      { title: 'Certified Experts Only', text: 'Our professionals are trained periodically under elite cosmetic directors and hold active international treatment credentials.', icon: 'Award' },
      { title: 'Clinically Sterilized Space', text: 'We maintain hospital-grade sanitation, vacuum-sealed tool envelopes, and single-use protective fabrics.', icon: 'ShieldCheck' },
      { title: '100% Genuine Products', text: 'Absolutely zero copycats or dilutions. We use direct manufacturer imports from Huda, MAC, Moroccanoil, and L’Oréal Professionnel.', icon: 'Sparkles' },
      { title: 'Tailored Facemap Analysis', text: 'Every haircut, coloring, or bridal makeup palette is mathematically coordinated against your skin undertones & bone composition.', icon: 'Heart' }
    ]
  },
  quickStatsRibbon: {
    title: 'Our Premium Line Partners',
    items: ['HUDA BEAUTY', 'MAC COSMETICS', 'MOROCCANOIL', 'L’ORÉAL PROFESSIONNEL', 'KRYOLAN', 'ESTÉE LAUDER']
  },
  footerContent: {
    description: 'गोरखपुर का सबसे शानदार और भरोसेमंद लक्ज़री मेकअप स्टूडियो और ब्यूटी पार्लर। Experience luxurious beauty, hair care, and professional bridal services curated by Menka Singh.',
    copyrightText: '© 2026 Anika Makeover Salon. All Rights Reserved. Crafted for elite luxury bridal results in Gorakhpur.',
    usefulLinksTitle: 'Useful Directory',
    quickBookTitle: 'Online Reservations'
  },
  theme: {
    primaryGold: '#B76E79',
    accentGold: '#D4AF37',
    bgLight: '#FFFDF8',
    bgDark: '#0A0A0A',
    textLight: '#2C2C2C',
    textDark: '#FFFFFF',
    fontFamilySerif: 'Playfair Display',
    fontFamilySans: 'Poppins',
    fontSizeScale: 1.0,
    sectionPadding: 'medium'
  },
  sections: [
    { id: 'banners', name: 'Hero Sliders', visible: true, order: 10 },
    { id: 'intro', name: 'Intro Stats Box', visible: true, order: 20 },
    { id: 'welcome', name: 'Welcome Banner', visible: true, order: 30 },
    { id: 'about', name: 'About Us Section', visible: true, order: 40 },
    { id: 'founder', name: 'Founder Message', visible: true, order: 50 },
    { id: 'ribbon', name: 'Premium Partners Ribbon', visible: true, order: 60 },
    { id: 'services', name: 'Services Grid & List', visible: true, order: 70 },
    { id: 'promo_banner', name: 'Promo Banner', visible: true, order: 80 },
    { id: 'shop_banner', name: 'Visit Flagship Banner', visible: true, order: 90 },
    { id: 'why_choose', name: 'Why Choose Us', visible: true, order: 100 },
    { id: 'gallery', name: 'Portfolio Lookbook', visible: true, order: 110 },
    { id: 'videos', name: 'Video Testimonial Reels', visible: true, order: 120 },
    { id: 'testimonials', name: 'Text Testimonials Carousel', visible: true, order: 130 },
    { id: 'faqs', name: 'FAQ Accordeons', visible: true, order: 140 },
    { id: 'instagram', name: 'Instagram Grid', visible: true, order: 150 },
    { id: 'booking', name: 'Appointment Booking Form', visible: true, order: 160 },
    { id: 'contact', name: 'Map & Contact Details', visible: true, order: 170 }
  ],
  menuItems: [
    { id: 'home', label: 'Home', visible: true },
    { id: 'about', label: 'About', visible: true },
    { id: 'services', label: 'Services', visible: true },
    { id: 'gallery', label: 'Gallery', visible: true },
    { id: 'testimonials', label: 'Reviews', visible: true },
    { id: 'faq', label: 'FAQ', visible: true },
    { id: 'contact', label: 'Contact', visible: true }
  ]
};
