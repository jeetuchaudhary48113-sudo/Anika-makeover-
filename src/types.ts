export interface BannerSlide {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  badge: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  price?: string;
  popular?: boolean;
}

export interface ServiceCategory {
  category: string;
  services: ServiceItem[];
}

export interface Testimonial {
  id: string;
  name: string;
  role?: string;
  photo: string;
  rating: number;
  text: string;
}

export interface GalleryItem {
  id: string;
  image: string;
  title: string;
  category: 'Bridal Makeup' | 'Hair Transformations' | 'Party Looks' | 'Beauty Treatments';
}

export interface VideoTestimonial {
  id: string;
  title: string;
  videoUrl: string; // Direct video mp4 URL, or YouTube embed, or local blob
  thumbnail: string;
  category: string;
}

export interface FounderDetails {
  photo: string;
  name: string;
  designation: string;
  message: string;
  experienceYears: number;
  happyClientsCount: number;
  makeoversCount: number;
}

export interface ContactInfo {
  phone: string;
  phoneFormatted: string;
  whatsapp: string;
  whatsappFormatted: string;
  address: string;
  addressShort: string;
  instagram: string;
  instagramUsername: string;
  googleMapsLink: string;
  googleMapsEmbed: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'appointment' | 'bridal' | 'services' | 'seo' | 'gorakhpur';
}

export interface CustomPromoBanner {
  image: string;
  title: string;
  subtitle: string;
  buttonText: string;
  badge: string;
  active: boolean;
}

export interface CustomWelcomeBanner {
  image: string;
  title: string;
  subtitle: string;
  accentText: string;
  active: boolean;
}

export interface CustomShopBanner {
  image: string;
  title: string;
  subtitle: string;
  active: boolean;
}

export interface AboutUsSection {
  badge: string;
  title: string;
  description: string;
  image: string;
  certifiedBadgeTitle: string;
  certifiedBadgeText: string;
  artistrySubtitle: string;
  artistryTitle: string;
  artistryDescription: string;
  bullets: { title: string; text: string }[];
}

export interface WhyChooseSection {
  subtitle: string;
  title: string;
  bullets: { title: string; text: string; icon: string }[];
}

export interface QuickStatsRibbon {
  title: string;
  items: string[];
}

export interface FooterContent {
  description: string;
  copyrightText: string;
  usefulLinksTitle: string;
  quickBookTitle: string;
}

export interface ThemeSettings {
  primaryGold: string;
  accentGold: string;
  bgLight: string;
  bgDark: string;
  textLight: string;
  textDark: string;
  fontFamilySerif: string;
  fontFamilySans: string;
  fontSizeScale: number;
  sectionPadding: 'small' | 'medium' | 'large';
}

export interface SectionToggle {
  id: string;
  name: string;
  visible: boolean;
  order: number;
}

export interface SiteConfig {
  banners: BannerSlide[];
  founder: FounderDetails;
  services: ServiceCategory[];
  gallery: GalleryItem[];
  videos: VideoTestimonial[];
  testimonials: Testimonial[];
  faqs: FAQItem[];
  contact: ContactInfo;
  promoBanner: CustomPromoBanner;
  welcomeBanner: CustomWelcomeBanner;
  shopBanner: CustomShopBanner;
  aboutSection?: AboutUsSection;
  whyChooseSection?: WhyChooseSection;
  quickStatsRibbon?: QuickStatsRibbon;
  footerContent?: FooterContent;
  theme?: ThemeSettings;
  sections?: SectionToggle[];
  menuItems?: { id: string; label: string; visible: boolean }[];
}

