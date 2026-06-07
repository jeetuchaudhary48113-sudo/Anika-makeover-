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
}
