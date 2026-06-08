import { useState, useEffect, Fragment } from 'react';
import { 
  Sparkles, Star, Award, Users, Heart, Scissors, 
  ShieldCheck, Instagram, MapPin, Phone, ArrowRight, 
  ChevronLeft, ChevronRight, MessageSquare, BookmarkCheck,
  Percent, ShieldCheck as SecureIcon, Clock
} from 'lucide-react';

import { SiteConfig, ServiceItem } from './types';
import { DEFAULT_SITE_CONFIG } from './site-config';

// Import newly created modular components
import Header from './components/Header';
import Footer from './components/Footer';
import BookingForm from './components/BookingForm';
import FAQAccordion from './components/FAQAccordion';
import VideoPlayer from './components/VideoPlayer';
import GalleryLightbox from './components/GalleryLightbox';
import AdminPanel from './components/AdminPanel';

import { loadSiteConfigFromDb, saveSiteConfigToDb } from './firebase';

export default function App() {
  const [config, setConfig] = useState<SiteConfig>(DEFAULT_SITE_CONFIG);
  const [activeTab, setActiveTab] = useState<string>('home');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [preSelectedService, setPreSelectedService] = useState('');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [dbLoading, setDbLoading] = useState(true);

  // 1. Cloud Database Syncing
  useEffect(() => {
    async function initDbConfig() {
      try {
        const cloudConfig = await loadSiteConfigFromDb();
        if (cloudConfig) {
          let modified = false;
          const parsed = { ...cloudConfig };

          // Sync or override older default placeholder image if present
          const isCustomFounderPhoto = parsed.founder?.photo?.startsWith('data:image/') || parsed.founder?.photo?.startsWith('http');
          if (parsed.founder && !isCustomFounderPhoto && (
            parsed.founder.photo.includes('unsplash.com/photo-1573496359142') || 
            parsed.founder.photo.includes('real_owner_photo_1780806708774.png') || 
            parsed.founder.photo.includes('regenerated_image_1780807060954.jpg') ||
            !parsed.founder.photo.startsWith('/src/assets/')
          )) {
            parsed.founder.photo = DEFAULT_SITE_CONFIG.founder.photo;
            modified = true;
          }
          // Sync or override older default founder name if present
          if (parsed.founder && parsed.founder.name === 'Anika Singh') {
            parsed.founder.name = DEFAULT_SITE_CONFIG.founder.name;
            modified = true;
          }
          // Add missing banner configs if they aren't in database
          if (!parsed.promoBanner) {
            parsed.promoBanner = DEFAULT_SITE_CONFIG.promoBanner;
            modified = true;
          }
          if (!parsed.welcomeBanner) {
            parsed.welcomeBanner = DEFAULT_SITE_CONFIG.welcomeBanner;
            modified = true;
          } else {
            // Ensure we do not overwrite any user-uploaded Base64 welcome image or custom web URL
            const isCustomWelcomeImage = parsed.welcomeBanner.image?.startsWith('data:image/') || parsed.welcomeBanner.image?.startsWith('http');
            if (!isCustomWelcomeImage && (
              parsed.welcomeBanner.image.includes('unsplash.com') ||
              parsed.welcomeBanner.image.includes('photo-1522337360788-8b13dee7a37e') ||
              parsed.welcomeBanner.image.includes('regenerated_image_1780817423496') ||
              !parsed.welcomeBanner.image.startsWith('/src/assets/images/regenerated_image')
            )) {
              parsed.welcomeBanner.image = DEFAULT_SITE_CONFIG.welcomeBanner.image;
              modified = true;
            }
          }
          if (!parsed.shopBanner) {
            parsed.shopBanner = DEFAULT_SITE_CONFIG.shopBanner;
            modified = true;
          }
          if (!parsed.aboutSection) {
            parsed.aboutSection = DEFAULT_SITE_CONFIG.aboutSection;
            modified = true;
          }
          if (!parsed.whyChooseSection) {
            parsed.whyChooseSection = DEFAULT_SITE_CONFIG.whyChooseSection;
            modified = true;
          }
          if (!parsed.quickStatsRibbon) {
            parsed.quickStatsRibbon = DEFAULT_SITE_CONFIG.quickStatsRibbon;
            modified = true;
          }
          if (!parsed.footerContent) {
            parsed.footerContent = DEFAULT_SITE_CONFIG.footerContent;
            modified = true;
          }
          if (!parsed.theme) {
            parsed.theme = DEFAULT_SITE_CONFIG.theme;
            modified = true;
          }
          if (!parsed.sections) {
            parsed.sections = DEFAULT_SITE_CONFIG.sections;
            modified = true;
          }
          if (!parsed.menuItems) {
            parsed.menuItems = DEFAULT_SITE_CONFIG.menuItems;
            modified = true;
          }

          if (modified) {
            await saveSiteConfigToDb(parsed);
          }
          setConfig(parsed);
        } else {
          await saveSiteConfigToDb(DEFAULT_SITE_CONFIG);
          setConfig(DEFAULT_SITE_CONFIG);
        }
      } catch (err) {
        console.error('Failed to parse database configuration, falling back to default.', err);
        setConfig(DEFAULT_SITE_CONFIG);
      } finally {
        setDbLoading(false);
      }
    }

    initDbConfig();

    // Hash sync on load
    const hash = window.location.hash.replace('#', '');
    if (hash && ['home', 'about', 'services', 'gallery', 'testimonials', 'faq', 'contact', 'booking'].includes(hash)) {
      setActiveTab(hash);
      setTimeout(() => {
        const element = document.getElementById(`${hash}-section`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500);
    }
  }, []);

  const handleConfigSave = async (newConfig: SiteConfig) => {
    setConfig(newConfig);
    try {
      await saveSiteConfigToDb(newConfig);
    } catch (err) {
      console.error('Failed to save configuration to cloud database:', err);
    }
  };

  const handleConfigReset = async () => {
    setConfig(DEFAULT_SITE_CONFIG);
    try {
      await saveSiteConfigToDb(DEFAULT_SITE_CONFIG);
    } catch (err) {
      console.error('Failed to reset configuration in cloud database:', err);
    }
  };

  // 2. Automated Banner Sizing
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % config.banners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [config.banners.length]);

  // 3. Automated Reviews Settle
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % config.testimonials.length);
    }, 8500);
    return () => clearInterval(timer);
  }, [config.testimonials.length]);

  // Extract top 10 popular services for Home page
  const popularServices = config.services
    .flatMap((cat) => cat.services.map((s) => ({ ...s, category: cat.category })))
    .filter((s) => s.popular)
    .slice(0, 10);

  // Transition to specific service booking
  const triggerQuickBooking = (serviceName: string) => {
    setPreSelectedService(serviceName);
    setActiveTab('booking');
    const bForm = document.getElementById('booking-section');
    if (bForm) {
      bForm.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % config.banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + config.banners.length) % config.banners.length);
  };

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % config.testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + config.testimonials.length) % config.testimonials.length);
  };

  // Section Rendering map matching custom positions & visibility controls
  const renderSection = (id: string) => {
    switch (id) {
      case 'banners':
        return (
          <section id="home-section" className="relative h-[85vh] sm:h-screen w-full bg-neutral-950 overflow-hidden">
            {config.banners.map((slide, idx) => (
              <div
                key={slide.id}
                className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                  idx === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              >
                {/* Visual background image with dark vignette mask */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/30 z-10" />
                <img
                  src={slide.image}
                  alt={slide.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transform scale-102 transition-transform duration-6000"
                />

                {/* Slider Central Message Content */}
                <div className="absolute inset-0 z-12 flex flex-col justify-center px-4 sm:px-8 md:px-12 lg:px-24 max-w-4xl text-white">
                  <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-[#D4AF37]/20 border border-accent-gold/40 text-accent-gold font-btn font-extrabold text-[9px] sm:text-[10px] uppercase tracking-widest rounded-full mb-4 w-max animate-pulse">
                    <Star size={10} className="fill-current text-accent-gold" />
                    <span>{slide.badge}</span>
                  </span>

                  <h2 className="font-serif-luxury text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-4 leading-tight sm:leading-none">
                    {slide.title}
                  </h2>

                  <p className="font-sans text-xs sm:text-base text-neutral-300 font-light max-w-xl mb-8 leading-relaxed">
                    {slide.subtitle}
                  </p>

                  {/* Responsive Action Buttons Group */}
                  <div className="flex flex-wrap items-center gap-3.5" id="hero-actions-container">
                    <button
                      onClick={() => {
                        setActiveTab('booking');
                        const element = document.getElementById('booking-section');
                        if (element) element.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="px-6 py-3.5 bg-gradient-to-r from-primary-gold to-[#a15a64] text-white font-btn font-bold uppercase tracking-wider text-[11px] rounded-full transition-transform duration-300 hover:scale-[1.03] shadow-lg shadow-primary-gold/15 cursor-pointer"
                    >
                      Book Appointment
                    </button>

                    <a
                      href={`tel:${config.contact.phone}`}
                      className="px-6 py-3.5 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 text-white font-btn font-bold uppercase tracking-wider text-[11px] rounded-full transition-all flex items-center space-x-2"
                    >
                      <Phone size={13} />
                      <span>Call Now</span>
                    </a>

                    <a
                      href={`https://wa.me/${config.contact.whatsapp}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-btn font-bold uppercase tracking-wider text-[11px] rounded-full transition-all flex items-center space-x-2 shadow-lg shadow-emerald-950/15"
                    >
                      <MessageSquare size={13} className="fill-current" />
                      <span>WhatsApp Now</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}

            {/* Previous Next Navigation icons for slider */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-15 p-2 bg-black/40 hover:bg-black/70 rounded-full border border-white/10 text-white cursor-pointer transition-colors"
              aria-label="Previous Slide"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-15 p-2 bg-black/40 hover:bg-black/70 rounded-full border border-white/10 text-white cursor-pointer transition-colors"
              aria-label="Next Slide"
            >
              <ChevronRight size={18} />
            </button>

            {/* Indicators dot bar */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-15 flex items-center space-x-2.5">
              {config.banners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all border duration-300 ${
                    idx === currentSlide ? 'bg-primary-gold border-primary-gold w-6' : 'bg-white/20 border-white/10 hover:bg-white/40'
                  }`}
                />
              ))}
            </div>
          </section>
        );

      case 'intro':
        return (
          <section className="py-16 bg-[#FFFDF8]" id="introductory-hero">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center font-sans">
              {/* Sizable Floating Indicators row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-primary-gold/10 hover:border-primary-gold/20 hover:shadow-md transition-all">
                  <span className="font-serif-luxury text-3xl sm:text-4xl text-primary-gold font-bold block mb-1">
                    {config.founder.experienceYears}+
                  </span>
                  <span className="font-btn text-[10px] tracking-widest text-gray-400 uppercase font-extrabold block">
                    Years of Excellence
                  </span>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-primary-gold/10 hover:border-primary-gold/20 hover:shadow-md transition-all">
                  <span className="font-serif-luxury text-3xl sm:text-4xl text-primary-gold font-bold block mb-1">
                    {config.founder.happyClientsCount.toLocaleString()}+
                  </span>
                  <span className="font-btn text-[10px] tracking-widest text-gray-400 uppercase font-extrabold block">
                    Happy Glamorous Clients
                  </span>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-primary-gold/10 hover:border-primary-gold/20 hover:shadow-md transition-all">
                  <span className="font-serif-luxury text-3xl sm:text-4xl text-primary-gold font-bold block mb-1">
                    {config.founder.makeoversCount.toLocaleString()}+
                  </span>
                  <span className="font-btn text-[10px] tracking-widest text-gray-400 uppercase font-extrabold block">
                    Bridal Makeovers Completed
                  </span>
                </div>
              </div>
            </div>
          </section>
        );

      case 'welcome':
        return config.welcomeBanner?.active ? (
          <section id="welcome-banner-section" className="relative w-full bg-neutral-900 text-white overflow-hidden border-b border-primary-gold/15">
            {/* Full responsive visible image without any cropping */}
            <div className="w-full h-auto z-0 flex justify-center items-center">
              <img
                src={config.welcomeBanner.image}
                alt="Welcome Banner Backdrop"
                referrerPolicy="no-referrer"
                className="w-full h-auto object-contain block opacity-100 scale-100"
              />
            </div>
          </section>
        ) : null;

      case 'about':
        return (
          <section id="about-section" className="py-20 bg-neutral-50 relative overflow-hidden font-sans">
            <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary-gold/5 rounded-full blur-3xl -ml-48" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              {/* Introductory Text */}
              <div className="max-w-3xl mx-auto text-center space-y-4 mb-20 animate-fade-in">
                <span className="font-sub-luxury italic text-primary-gold text-lg sm:text-2xl font-medium block">
                  {config.aboutSection?.badge}
                </span>
                <h3 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-luxury-text leading-tight uppercase font-medium">
                  {config.aboutSection?.title}
                </h3>
                <p className="font-sans text-sm sm:text-base text-gray-500 max-w-2xl mx-auto leading-relaxed">
                  {config.aboutSection?.description}
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                {/* Left Col portrait */}
                <div className="lg:col-span-5 relative">
                  <div className="relative rounded-3xl overflow-hidden aspect-[4/5] border-2 border-primary-gold/10 shadow-xl max-w-md mx-auto">
                    <img
                      src={config.aboutSection?.image || "/src/assets/images/regenerated_image_1780807331392.jpg"}
                      alt="Anika Makeover Salon Interior"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/60 to-transparent" />
                  </div>

                  {/* Floating Certification Badge */}
                  <div className="absolute -bottom-5 -right-2 sm:-right-6 bg-[#2C2C2C]/95 text-white p-5 rounded-2xl shadow-2xl border border-accent-gold/20 max-w-[210px] animate-bounce-slow">
                    <span className="text-accent-gold flex items-center space-x-1.5 mb-1.5">
                      <Award size={18} />
                      <span className="font-btn text-[10px] font-bold uppercase tracking-wider">{config.aboutSection?.certifiedBadgeTitle || 'Certified Safe'}</span>
                    </span>
                    <p className="font-sans text-[11px] text-neutral-300 leading-normal">
                      {config.aboutSection?.certifiedBadgeText || 'Our premises run sterile, hospital-grade instrument sanitization protocols daily.'}
                    </p>
                  </div>
                </div>

                {/* Right Col about */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="space-y-1.5">
                    <span className="font-sub-luxury italic text-primary-gold text-lg font-medium block">
                      {config.aboutSection?.artistrySubtitle}
                    </span>
                    <h3 className="font-serif-luxury text-3xl sm:text-4xl text-luxury-text font-bold uppercase tracking-wide">
                      {config.aboutSection?.artistryTitle}
                    </h3>
                  </div>

                  <p className="font-sans text-sm text-gray-500 leading-relaxed font-light">
                    {config.aboutSection?.artistryDescription}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {(config.aboutSection?.bullets || []).map((item, idx) => (
                      <div key={idx} className="flex items-start space-x-3 p-3 bg-white rounded-xl border border-primary-gold/10">
                        <span className="p-1.5 rounded-lg bg-primary-gold/5 text-primary-gold mt-1 shrink-0">
                          <ShieldCheck size={14} />
                        </span>
                        <div className="space-y-0.5">
                          <h5 className="font-serif-luxury font-bold text-xs text-luxury-text">{item.title}</h5>
                          <p className="font-sans text-[10px] text-gray-400 leading-normal font-light">{item.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Dynamic Stats Counters */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-primary-gold/10 border-dashed">
                    <div className="text-center sm:text-left">
                      <span className="font-serif-luxury text-2xl sm:text-3xl text-primary-gold font-bold block">{(config.founder.happyClientsCount / 1000).toFixed(1)}k+</span>
                      <span className="font-btn text-[9px] tracking-widest text-gray-400 uppercase font-semibold">Clients Served</span>
                    </div>
                    <div className="text-center sm:text-left">
                      <span className="font-serif-luxury text-2xl sm:text-3xl text-primary-gold font-bold block">{(config.founder.makeoversCount / 1000).toFixed(1)}k+</span>
                      <span className="font-btn text-[9px] tracking-widest text-gray-400 uppercase font-semibold">Bridal Brides</span>
                    </div>
                    <div className="text-center sm:text-left">
                      <span className="font-serif-luxury text-2xl sm:text-3xl text-primary-gold font-bold block">{config.founder.experienceYears}+</span>
                      <span className="font-btn text-[9px] tracking-widest text-gray-400 uppercase font-semibold">Years Active</span>
                    </div>
                    <div className="text-center sm:text-left">
                      <span className="font-serif-luxury text-2xl sm:text-3xl text-primary-gold font-bold block">50+</span>
                      <span className="font-btn text-[9px] tracking-widest text-gray-400 uppercase font-semibold">Specialties</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );

      case 'founder':
        return (
          <section id="founder-section" className="py-20 bg-neutral-50 relative overflow-hidden font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="glass-premium p-6 sm:p-10 md:p-12 rounded-3xl border border-primary-gold/15 shadow-xl max-w-4xl mx-auto relative overflow-hidden">
                <div className="absolute top-0 right-0 w-44 h-44 bg-primary-gold/5 rounded-full blur-2xl -mr-12 -mt-12" />

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
                  {/* Left Portrait */}
                  <div className="md:col-span-4 max-w-xs mx-auto">
                    <div className="aspect-[3/4] rounded-2xl overflow-hidden border-2 border-primary-gold/10 shadow-lg relative bg-neutral-100">
                      <img
                        src={config.founder.photo}
                        alt={config.founder.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-3 left-3 right-3 bg-neutral-900/90 backdrop-blur-md text-white py-1.5 px-3 rounded-xl border border-white/10 text-center">
                        <span className="font-btn text-[9px] uppercase font-bold tracking-widest text-accent-gold block leading-none">Senior expert</span>
                        <span className="font-serif-luxury font-bold text-[11px]">{config.founder.name}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Founder message */}
                  <div className="md:col-span-8 space-y-4">
                    <div className="space-y-0.5">
                      <span className="font-btn text-[10px] tracking-widest font-extrabold text-[#B76E79] uppercase block mb-1">Meet the Visionary</span>
                      <h4 className="font-serif-luxury text-2xl font-bold text-luxury-text">{config.founder.name}</h4>
                      <p className="font-sub-luxury italic text-xs sm:text-sm text-gray-500 font-semibold">{config.founder.designation}</p>
                    </div>

                    <p className="font-sans text-xs sm:text-sm text-gray-600 leading-relaxed font-light italic">
                      "{config.founder.message}"
                    </p>

                    {/* Achievements horizontal statistics */}
                    <div className="grid grid-cols-3 gap-3 pt-3 border-t border-primary-gold/10 text-center md:text-left">
                      <div>
                        <span className="font-serif-luxury text-base sm:text-xl text-primary-gold font-bold block">{config.founder.experienceYears} Years</span>
                        <span className="font-sans text-[9px] text-gray-400 uppercase font-semibold">Clinical Experience</span>
                      </div>
                      <div>
                        <span className="font-serif-luxury text-base sm:text-xl text-primary-gold font-bold block">{config.founder.happyClientsCount.toLocaleString()}</span>
                        <span className="font-sans text-[9px] text-gray-400 uppercase font-semibold">Clients Pampered</span>
                      </div>
                      <div>
                        <span className="font-serif-luxury text-base sm:text-xl text-primary-gold font-bold block">{config.founder.makeoversCount.toLocaleString()}</span>
                        <span className="font-sans text-[9px] text-gray-400 uppercase font-semibold">Brides Styled</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );

      case 'ribbon':
        return (
          <section className="py-8 bg-neutral-900 border-y border-white/5 relative overflow-hidden text-center font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <span className="font-btn text-[9px] tracking-widest text-[#D4AF37] uppercase font-extrabold block mb-4">
                {config.quickStatsRibbon?.title || 'Our Premium Line Partners'}
              </span>
              <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-white/50 font-serif-luxury uppercase tracking-widest" id="partner-logos-ribbon">
                {(config.quickStatsRibbon?.items || []).map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </div>
          </section>
        );

      case 'services':
        return (
          <section id="services-section" className="py-20 bg-neutral-50 relative font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto mb-12">
                <span className="font-sub-luxury italic text-primary-gold text-base block mb-0.5">Popular Treatments</span>
                <h3 className="font-serif-luxury text-3xl sm:text-4xl text-luxury-text font-bold uppercase tracking-wide mb-3">
                  Top 10 Popular Services
                </h3>
                <p className="font-sans text-xs sm:text-sm text-gray-400 font-light">
                  We curate the most chosen hair transformations, bridal glow packages, and cosmetic therapies favored by our elegant clientele in Taramandal.
                </p>
              </div>

              {/* Top 10 Popular services grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 text-left" id="popular-services-grid">
                {popularServices.map((srv) => (
                  <div
                    key={srv.id}
                    className="p-5 bg-white rounded-2xl border border-primary-gold/10 hover:border-primary-gold/25 hover:shadow-lg transition-all flex flex-col justify-between group"
                  >
                    <div className="space-y-2">
                      <span className="text-[8px] bg-primary-gold/5 text-primary-gold font-btn font-extrabold uppercase px-2 py-0.5 rounded tracking-widest border border-primary-gold/10">
                        {srv.category}
                      </span>
                      <h4 className="font-serif-luxury font-bold text-sm sm:text-base text-luxury-text leading-tight group-hover:text-primary-gold transition-colors pt-1">
                        {srv.title}
                      </h4>
                      <p className="font-sans text-[11px] text-gray-400 font-light leading-relaxed">
                        {srv.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
                      <button
                        onClick={() => triggerQuickBooking(srv.title)}
                        className="flex items-center space-x-1 text-[10px] font-btn font-bold text-primary-gold uppercase tracking-widest hover:text-accent-gold transition-colors group cursor-pointer"
                      >
                        <span>Reserve Space</span>
                        <ArrowRight size={12} className="transform group-hover:translate-x-1.5 transition-all" />
                      </button>
                      <span className="text-[9px] text-[#A15A64] font-semibold bg-[#FFF5F6] px-2 py-0.5 rounded uppercase font-btn tracking-widest">
                        Best choice
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* View All CTA */}
              <div className="text-center mt-12">
                <button
                  onClick={() => {
                    setActiveTab('all-services');
                    setTimeout(() => {
                      const element = document.getElementById('all-services-header');
                      if (element) element.scrollIntoView({ behavior: 'smooth' });
                    }, 300);
                  }}
                  className="px-8 py-4 bg-gradient-to-r from-[#D4AF37] to-[#B76E79] text-white font-btn font-bold uppercase tracking-widest text-[11px] rounded-full shadow-lg hover:shadow-[#D4AF37]/15 hover:scale-[1.02] cursor-pointer"
                >
                  View All Services
                </button>
              </div>
            </div>
          </section>
        );

      case 'promo_banner':
        return config.promoBanner?.active ? (
          <section id="promo-banner-section" className="relative w-full bg-neutral-900 text-white overflow-hidden border-b border-primary-gold/15 border-t">
            {/* Full responsive visible image without any cropping */}
            <div className="w-full h-auto z-0 flex justify-center items-center">
              <img
                src={config.promoBanner.image}
                alt="Promo Banner Backdrop"
                referrerPolicy="no-referrer"
                className="w-full h-auto object-contain block opacity-100 scale-100"
              />
            </div>
          </section>
        ) : null;

      case 'shop_banner':
        return config.shopBanner?.active ? (
          <section id="shop-banner-section" className="relative w-full bg-neutral-900 text-white overflow-hidden border-b border-primary-gold/15">
            {/* Full responsive visible image without any cropping */}
            <div className="w-full h-auto z-0 flex justify-center items-center">
              <img
                src={config.shopBanner.image}
                alt="Shop Banner Backdrop"
                referrerPolicy="no-referrer"
                className="w-full h-auto object-contain block opacity-100 scale-100"
              />
            </div>
          </section>
        ) : null;

      case 'why_choose':
        return (
          <section id="whychoose-section" className="py-20 bg-[#FFFDF8] relative overflow-hidden font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto mb-16">
                <span className="font-sub-luxury italic text-primary-gold text-base block">
                  {config.whyChooseSection?.subtitle || 'THE ANIKA TOUCH'}
                </span>
                <h3 className="font-serif-luxury text-3xl sm:text-4xl text-luxury-text font-bold uppercase tracking-wide">
                  {config.whyChooseSection?.title || 'Why Choose Anika Makeover'}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
                {(config.whyChooseSection?.bullets || []).map((card, idx) => {
                  const renderCardIcon = (iconName: string) => {
                    switch (iconName) {
                      case 'Award': return <Award size={20} className="text-accent-gold" />;
                      case 'ShieldCheck': return <ShieldCheck size={20} className="text-accent-gold" />;
                      case 'Sparkles': return <Sparkles size={20} className="text-accent-gold" />;
                      case 'Heart': return <Heart size={20} className="text-primary-gold" />;
                      case 'Percent': return <Percent size={18} className="text-primary-gold" />;
                      case 'Star': return <Star size={20} className="text-primary-gold fill-current" />;
                      default: return <Award size={20} className="text-accent-gold" />;
                    }
                  };
                  return (
                    <div
                      key={idx}
                      className="bg-white p-6 sm:p-7 rounded-2xl border border-primary-gold/10 hover:border-primary-gold/25 shadow-sm hover:shadow-md transition-all space-y-4"
                    >
                      <span className="inline-flex p-3 rounded-xl bg-primary-gold/5 border border-primary-gold/10">
                        {renderCardIcon(card.icon)}
                      </span>
                      <h4 className="font-serif-luxury font-bold text-base text-luxury-text leading-tight tracking-wide">
                        {card.title}
                      </h4>
                      <p className="font-sans text-xs text-gray-500 font-light leading-relaxed">
                        {card.text}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        );

      case 'gallery':
        return (
          <section id="gallery-section" className="py-20 bg-neutral-50 font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto mb-12">
                <span className="font-sub-luxury italic text-primary-gold text-base block mb-0.5">Signature Archive</span>
                <h3 className="font-serif-luxury text-3xl sm:text-4xl text-luxury-text font-bold uppercase tracking-wide">
                  Salon Portfolio Lookbook
                </h3>
                <p className="font-sans text-xs sm:text-sm text-gray-400 font-light mt-1.5 font-light">
                  Glance through our physical transformations. Standard bridal finishes, glowing cocktail highlights, and artistic nail enhancements.
                </p>
              </div>

              {/* Emitted Lightbox component */}
              <GalleryLightbox items={config.gallery} />
            </div>
          </section>
        );

      case 'videos':
        return (
          <section id="videos-section" className="py-20 bg-[#FFFDF8] font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto mb-12">
                <span className="font-sub-luxury italic text-primary-gold text-base block">Transformation Reels</span>
                <h3 className="font-serif-luxury text-3xl sm:text-4xl text-luxury-text font-bold uppercase tracking-wide">
                  Video Testimonials & Highlights
                </h3>
              </div>

              {/* Video Player component */}
              <VideoPlayer videos={config.videos} />
            </div>
          </section>
        );

      case 'testimonials':
        return (
          <section id="testimonials-section" className="py-20 bg-neutral-900 border-y-2 border-accent-gold/20 text-white relative overflow-hidden font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row gap-12 items-center text-left">
              <div className="max-w-md space-y-4 text-center md:text-left shrink-0">
                <span className="font-sub-luxury italic text-accent-gold text-base block leading-none">Shared Radiance</span>
                <h3 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl uppercase tracking-wider font-bold">
                  What Clients Say About Anika
                </h3>
                <p className="font-sans text-xs sm:text-sm text-neutral-400 leading-normal font-light">
                  See how hundreds of happy brides and hair transformation catalog lovers describe our hygiene, elite artistry, and personalized touch in Taramandal.
                </p>
                <div className="flex justify-center md:justify-start gap-4 pt-4">
                  <button
                    onClick={prevTestimonial}
                    className="p-3 bg-white/5 border border-white/10 hover:border-[#D4AF37] rounded-full text-white cursor-pointer transition-all"
                    aria-label="Previous review"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={nextTestimonial}
                    className="p-3 bg-white/5 border border-white/10 hover:border-[#D4AF37] rounded-full text-white cursor-pointer transition-all"
                    aria-label="Next review"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              <div className="relative w-full md:flex-1 max-w-xl mx-auto h-[320px] md:h-[280px] flex items-center justify-center">
                {config.testimonials.map((test, index) => (
                  <div
                    key={test.id}
                    className={`absolute inset-0 bg-white/5 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-white/10 flex flex-col justify-between transition-all duration-700 ${
                      index === activeTestimonial ? 'opacity-100 translate-x-0 scale-100 z-10' : 'opacity-0 translate-x-12 scale-95 pointer-events-none'
                    }`}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center space-x-1 text-[#D4AF37]">
                        {[...Array(test.rating)].map((_, i) => (
                          <Star key={i} size={13} className="fill-current text-accent-gold" />
                        ))}
                      </div>
                      <p className="font-sans text-xs sm:text-sm text-neutral-200 line-clamp-4 leading-relaxed font-light italic">
                        "{test.text}"
                      </p>
                    </div>

                    <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                      <div>
                        <h4 className="font-serif-luxury font-bold text-xs sm:text-sm text-white">{test.name}</h4>
                        <p className="font-sans text-[10px] text-gray-400 font-light">{test.service}</p>
                      </div>
                      <span className="text-[10px] text-accent-gold font-btn font-extrabold uppercase px-2 py-0.5 rounded tracking-widest border border-accent-gold/25 bg-accent-gold/5 leading-none">
                        Verified
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'faqs':
        return (
          <section id="faq-section" className="py-20 bg-neutral-50 font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto mb-12">
                <span className="font-sub-luxury italic text-primary-gold text-base block mb-0.5">Quick Assistance</span>
                <h3 className="font-serif-luxury text-3xl sm:text-4xl text-luxury-text font-bold uppercase tracking-wide">
                  Frequently Asked Questions
                </h3>
              </div>

              {/* Interactive Accordion FAQs */}
              <FAQAccordion faqs={config.faqs} />
            </div>
          </section>
        );

      case 'instagram':
        return (
          <section className="py-16 bg-[#FFFDF8]" id="instagram-section">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
              <div className="text-center max-w-2xl mx-auto mb-10">
                <span className="font-btn text-[10px] tracking-widest text-[#B76E79] uppercase font-extrabold block mb-1">Follow Our Work</span>
                <h4 className="font-serif-luxury text-2xl font-bold text-luxury-text uppercase tracking-wide">
                  Connect {config.contact.instagramUsername || '@anikamakeover45'}
                </h4>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in" id="instagram-grid">
                {[
                  { url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=400', likes: '895', loves: '114' },
                  { url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=400', likes: '1,450', loves: '320' },
                  { url: 'https://images.unsplash.com/photo-1560869713-7d0a29430f23?auto=format&fit=crop&q=80&w=400', likes: '2,104', loves: '540' },
                  { url: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=400', likes: '640', loves: '88' }
                ].map((post, idx) => (
                  <a
                    key={idx}
                    href={config.contact.instagram}
                    target="_blank"
                    rel="noreferrer"
                    referrerPolicy="no-referrer"
                    className="group relative aspect-square rounded-2xl overflow-hidden border border-gray-100 bg-neutral-100 block shadow-sm hover:shadow-md cursor-pointer"
                  >
                    <img
                      src={post.url}
                      alt="Anika Instagram Post"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-neutral-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4 text-white text-xs font-semibold">
                      <span>❤️ {post.likes}</span>
                      <span>💬 {post.loves}</span>
                    </div>
                  </a>
                ))}
              </div>

              {/* Direct link button */}
              <div className="text-center mt-8 font-sans">
                <a
                  href={config.contact.instagram}
                  target="_blank"
                  rel="noreferrer"
                  referrerPolicy="no-referrer"
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-btn font-bold uppercase tracking-wider text-[10px] rounded-full shadow-md cursor-pointer hover:brightness-110"
                >
                  <Instagram size={14} />
                  <span>Follow On Instagram</span>
                </a>
              </div>
            </div>
          </section>
        );

      case 'booking':
        return (
          <section id="booking-section" className="py-20 bg-neutral-50 font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <BookingForm 
                services={config.services} 
                preSelectedService={preSelectedService} 
              />
            </div>
          </section>
        );

      case 'contact':
        return (
          <section id="contact-section" className="py-20 bg-[#FFFDF8] border-t border-primary-gold/10 font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center text-left">
                {/* Left Col Contact details */}
                <div className="space-y-6">
                  <div className="space-y-1.5">
                    <span className="font-sub-luxury italic text-primary-gold text-lg block">Open Daily</span>
                    <h3 className="font-serif-luxury text-3xl sm:text-4xl text-luxury-text font-bold uppercase tracking-wide">
                      Anika Makeover Salon
                    </h3>
                    <p className="font-sans text-xs text-gray-500 font-light">
                      Open 7 Days a week from <span className="font-semibold text-luxury-text">10:00 AM to 08:30 PM</span>. Secure parking slot is dedicated and completely free for salon clients.
                    </p>
                  </div>

                  {/* Stack details cards */}
                  <div className="space-y-4 text-xs sm:text-sm text-gray-700">
                    <div className="flex items-start space-x-3.5 p-4 bg-white rounded-2xl border border-primary-gold/10">
                      <MapPin size={18} className="text-primary-gold shrink-0 mt-0.5 animate-bounce-slow" />
                      <div className="space-y-0.5">
                        <h5 className="font-serif-luxury font-bold text-luxury-text text-sm mb-1">Our Location Address</h5>
                        <p className="font-sans text-gray-500 leading-relaxed font-light">
                          {config.contact.address}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3.5 p-4 bg-white rounded-2xl border border-primary-gold/10">
                      <Phone size={16} className="text-primary-gold shrink-0" />
                      <div>
                        <h5 className="font-serif-luxury font-bold text-luxury-text text-xs sm:text-sm">Contact Number</h5>
                        <a href={`tel:${config.contact.phone}`} className="font-sans text-primary-gold font-bold">
                          {config.contact.phoneFormatted}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Contact Button Row Bar */}
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => {
                        setActiveTab('booking');
                        const element = document.getElementById('booking-section');
                        if (element) element.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="px-5 py-3 bg-primary-gold hover:bg-primary-gold/90 text-white font-btn font-bold uppercase tracking-wider text-[10px] rounded-full shadow-md cursor-pointer transition-colors"
                    >
                      Reserve Slot Now
                    </button>

                    <a
                      href={`tel:${config.contact.phone}`}
                      className="px-5 py-3 bg-white border border-primary-gold/25 hover:border-primary-gold text-primary-gold hover:bg-primary-gold/5 font-btn font-bold uppercase tracking-wider text-[10px] rounded-full transition-colors flex items-center space-x-1.5"
                    >
                      <Phone size={12} />
                      <span>Call Desk</span>
                    </a>

                    <a
                      href={config.contact.googleMapsLink}
                      target="_blank"
                      rel="noreferrer"
                      className="px-5 py-3 bg-gradient-to-r from-accent-gold to-[#B76E79] text-white font-btn font-bold uppercase tracking-wider text-[10px] rounded-full shadow-md hover:brightness-110 flex items-center space-x-1.5"
                    >
                      <MapPin size={12} />
                      <span>Get Directions</span>
                    </a>
                  </div>
                </div>

                {/* Right Col map iframe */}
                <div className="rounded-3xl overflow-hidden border border-primary-gold/15 shadow-xl bg-neutral-100 w-full h-[250px] sm:h-[320px] lg:h-[350px]">
                  <iframe
                    title="Anika Makeover Salon Map Location"
                    src={config.contact.googleMapsEmbed}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  if (dbLoading) {
    return (
      <div className="bg-[#0A0A0A] text-white min-h-screen flex flex-col items-center justify-center font-sans">
        <div className="text-center space-y-6">
          <div className="w-14 h-14 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto" />
          <div className="space-y-2 animate-pulse">
            <h1 className="font-serif text-xl font-bold tracking-widest text-[#D4AF37]">
              ANIKA MAKEOVER SALON
            </h1>
            <p className="text-xs text-neutral-400 font-mono tracking-widest uppercase">
              Loading Luxury Database...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-luxury-bg text-luxury-text min-h-screen relative font-sans overflow-x-hidden w-full">
      
      {/* 1. Header Navigation elements */}
      <Header 
        contact={config.contact} 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />

      {/* 2. Sorted layout based on customized section weight and visibility settings */}
      {config.sections
        .slice()
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map((sec) => {
          if (sec.visible === false) return null;
          return <Fragment key={sec.id}>{renderSection(sec.id)}</Fragment>;
        })}

      {/* DEDICATED FULL SERVICES PAGE STATE */}
      {activeTab === 'all-services' && (
        <section className="py-20 bg-white" id="all-services-header">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-2 font-sans">
              <span className="font-sub-luxury italic text-[#B76E79] text-lg block">Full Menu Catalog</span>
              <h3 className="font-serif-luxury text-3xl sm:text-5xl text-luxury-text uppercase tracking-wide font-medium">
                Our Complete Salon Services
              </h3>
              <p className="font-sans text-xs sm:text-sm text-gray-400 leading-relaxed font-light">
                Scroll through our comprehensive, professional beauty care menu spanning haircuts, deep spas, waterproof party makeovers, facials, and certified salon care at your doorstep.
              </p>
            </div>

            {/* Structured Columns Categories Grid */}
            <div className="space-y-12 text-left font-sans">
              {config.services.map((cat) => (
                <div key={cat.category} className="space-y-4">
                  <h4 className="font-serif-luxury text-xl font-bold text-primary-gold uppercase tracking-widest border-b border-primary-gold/15 pb-2">
                    {cat.category}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cat.services.map((srv) => (
                      <div
                        key={srv.id}
                        className="p-5 bg-[#FFFDF8] rounded-2xl border border-primary-gold/10 hover:border-primary-gold/30 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-start justify-between gap-2">
                            <h5 className="font-serif-luxury font-bold text-sm sm:text-base text-luxury-text leading-tight">
                              {srv.title}
                            </h5>
                            {srv.popular && (
                              <span className="flex-shrink-0 text-[8px] bg-accent-gold/10 text-accent-gold font-btn font-extrabold uppercase px-1.5 py-0.5 rounded tracking-widest leading-none border border-accent-gold/25">
                                Popular
                              </span>
                            )}
                          </div>
                          <p className="font-sans text-[11px] sm:text-xs text-gray-500 font-light leading-relaxed">
                            {srv.description}
                          </p>
                        </div>
                        <button
                          onClick={() => triggerQuickBooking(srv.title)}
                          className="mt-3.5 pt-2.5 border-t border-dashed border-primary-gold/5 flex items-center justify-between text-[10px] font-btn font-bold text-primary-gold uppercase tracking-widest hover:text-accent-gold transition-colors cursor-pointer w-full"
                        >
                          <span>Reserve Look</span>
                          <span>→</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions to jump back to Home */}
            <div className="text-center mt-12 font-sans">
              <button
                onClick={() => {
                  setActiveTab('home');
                  const element = document.getElementById('services-section');
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-2.5 border border-primary-gold/30 hover:border-primary-gold text-primary-gold hover:bg-primary-gold/5 font-btn font-bold uppercase tracking-wider text-[11px] rounded-full cursor-pointer"
              >
                Back to Top popular
              </button>
            </div>

          </div>
        </section>
      )}

      {/* 3. Brand Footer with deep links */}
      <Footer 
        contact={config.contact} 
        onTabChange={setActiveTab} 
        onAdminClick={() => setIsAdminOpen(true)}
      />

      {/* 4. Customizable Admin dashboard Settings Panel */}
      <AdminPanel
        currentConfig={config}
        onSave={handleConfigSave}
        onReset={handleConfigReset}
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />

      {/* 5. Floating WhatsApp help button widget on every page corner */}
      <a
        href={`https://wa.me/${config.contact.whatsapp}`}
        target="_blank"
        rel="noreferrer"
        referrerPolicy="no-referrer"
        className="fixed bottom-6 right-6 z-40 p-4 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white rounded-full shadow-2xl flex items-center justify-center border-2 border-[#FFFDF8] hover:border-emerald-300 transition-all cursor-pointer animate-bounce-slow"
        title="Direct Chat WhatsApp help"
      >
        <MessageSquare size={22} className="fill-current text-white" />
      </a>

    </div>
  );
}
