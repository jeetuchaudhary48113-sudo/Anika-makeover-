import React, { useState, useEffect } from 'react';
import { Lock, Settings, Save, RotateCcw, X, Edit3, Trash2, Plus, Check, MapPin, Phone, MessageSquare, Instagram, FileText, Upload, Percent, Sparkles, Eye, EyeOff, ArrowUp, ArrowDown, Award, ShieldCheck, Heart } from 'lucide-react';
import { SiteConfig, ServiceItem, GalleryItem, Testimonial, VideoTestimonial } from '../types';
import { uploadImageToStorage, isFirebasePlaceholder } from '../firebase';

interface AdminPanelProps {
  currentConfig: SiteConfig;
  onSave: (newConfig: SiteConfig) => void;
  onReset: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminPanel({ currentConfig, onSave, onReset, isOpen, onClose }: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState<string>('contact');
  const [isDragOver, setIsDragOver] = useState(false);

  // Working state copy of the configuration
  const [config, setConfig] = useState<SiteConfig>({ ...currentConfig });

  // Sync state copy with currentConfig whenever component mounts or currentConfig updates
  useEffect(() => {
    setConfig({ ...currentConfig });
  }, [currentConfig, isOpen]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === 'anika123' || passcode === 'admin') {
      setIsAuthenticated(true);
      setErrorMsg('');
    } else {
      setErrorMsg('Incorrect Passcode. Access restricted.');
    }
  };

  const handleSaveAll = () => {
    onSave(config);
    onClose();
    // Display sweet browser alert confirmation
    alert('✨ Anika Makeover Salon website configuration updated successfully of all live features!');
  };

  const handleResetDefaults = () => {
    if (window.confirm('Are you absolutely sure you want to reset all configurations back to the luxury defaults? This action is irreversible.')) {
      onReset();
      setConfig({ ...currentConfig });
      onClose();
      setIsAuthenticated(false);
      setPasscode('');
    }
  };

  // State handlers
  const updateContact = (key: string, value: string) => {
    setConfig({
      ...config,
      contact: {
        ...config.contact,
        [key]: value
      }
    });
  };

  const updateFounder = (key: string, value: any) => {
    setConfig({
      ...config,
      founder: {
        ...config.founder,
        [key]: value
      }
    });
  };

  const handlePhotoUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, JPEG, etc.).');
      return;
    }
    try {
      const url = await uploadImageToStorage(file, 'founder');
      updateFounder('photo', url);
    } catch (error) {
      console.error(error);
      alert('Failed to upload founder photo to Firebase storage.');
    }
  };

  const updatePromoBanner = (key: string, value: any) => {
    setConfig({
      ...config,
      promoBanner: {
        ...config.promoBanner,
        [key]: value
      }
    });
  };

  const updateWelcomeBanner = (key: string, value: any) => {
    setConfig({
      ...config,
      welcomeBanner: {
        ...config.welcomeBanner,
        [key]: value
      }
    });
  };

  const updateShopBanner = (key: string, value: any) => {
    setConfig({
      ...config,
      shopBanner: {
        ...config.shopBanner,
        [key]: value
      }
    });
  };

  const updateBannerSlide = (id: string, key: string, value: any) => {
    setConfig({
      ...config,
      banners: config.banners.map(b => b.id === id ? { ...b, [key]: value } : b)
    });
  };

  const deleteBannerSlide = (id: string) => {
    if (config.banners.length <= 1) {
      alert('You must have at least one hero slider banner active.');
      return;
    }
    setConfig({
      ...config,
      banners: config.banners.filter(b => b.id !== id)
    });
  };

  const addBannerSlide = () => {
    const newSlide = {
      id: `banner_custom_${Date.now()}`,
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=1200',
      title: 'Luxury Makeover Experience',
      subtitle: 'Premium styling under world-class safety protocols and personalized trends.',
      badge: 'Exclusive Beauty Lounge'
    };
    setConfig({
      ...config,
      banners: [...config.banners, newSlide]
    });
  };

  const handleBannerSlideUpload = async (id: string, file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, JPEG, etc.).');
      return;
    }
    try {
      const url = await uploadImageToStorage(file, 'banners');
      updateBannerSlide(id, 'image', url);
    } catch (error) {
      console.error(error);
      alert('Failed to upload banner image to Firebase storage.');
    }
  };

  const handlePromoBannerUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, JPEG, etc.).');
      return;
    }
    try {
      const url = await uploadImageToStorage(file, 'promos');
      updatePromoBanner('image', url);
    } catch (error) {
      console.error(error);
      alert('Failed to upload promo banner image to Firebase storage.');
    }
  };

  const handleWelcomeBannerUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, JPEG, etc.).');
      return;
    }
    try {
      const url = await uploadImageToStorage(file, 'welcome');
      updateWelcomeBanner('image', url);
    } catch (error) {
      console.error(error);
      alert('Failed to upload welcome banner image to Firebase storage.');
    }
  };

  const handleShopBannerUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, JPEG, etc.).');
      return;
    }
    try {
      const url = await uploadImageToStorage(file, 'shop');
      updateShopBanner('image', url);
    } catch (error) {
      console.error(error);
      alert('Failed to upload flagship banner image to Firebase storage.');
    }
  };

  // Service Edit helper
  const addService = (categoryName: string) => {
    const defaultSrv: ServiceItem = {
      id: `srv_custom_${Date.now()}`,
      title: 'New Custom Service',
      description: 'Enter styling, spa, skin, or makeup explanation details here.',
      popular: false
    };

    const newServices = config.services.map(cat => {
      if (cat.category === categoryName) {
        return {
          ...cat,
          services: [...cat.services, defaultSrv]
        };
      }
      return cat;
    });

    setConfig({ ...config, services: newServices });
  };

  const deleteService = (categoryName: string, serviceId: string) => {
    const newServices = config.services.map(cat => {
      if (cat.category === categoryName) {
        return {
          ...cat,
          services: cat.services.filter(s => s.id !== serviceId)
        };
      }
      return cat;
    });
    setConfig({ ...config, services: newServices });
  };

  const updateServiceDetail = (categoryName: string, serviceId: string, fields: Partial<ServiceItem>) => {
    const newServices = config.services.map(cat => {
      if (cat.category === categoryName) {
        return {
          ...cat,
          services: cat.services.map(s => {
            if (s.id === serviceId) {
              return { ...s, ...fields };
            }
            return s;
          })
        };
      }
      return cat;
    });
    setConfig({ ...config, services: newServices });
  };

  // Gallery Helpers
  const addGalleryItem = () => {
    const newItem: GalleryItem = {
      id: `gal_custom_${Date.now()}`,
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=800',
      title: 'Custom Makeover Look',
      category: 'Bridal Makeup'
    };
    setConfig({
      ...config,
      gallery: [newItem, ...config.gallery]
    });
  };

  const deleteGalleryItem = (id: string) => {
    setConfig({
      ...config,
      gallery: config.gallery.filter(item => item.id !== id)
    });
  };

  const updateGalleryItem = (id: string, fields: Partial<GalleryItem>) => {
    setConfig({
      ...config,
      gallery: config.gallery.map(item => item.id === id ? { ...item, ...fields } as GalleryItem : item)
    });
  };

  // Testimonials Helpers
  const addTestimonial = () => {
    const newItem: Testimonial = {
      id: `test_custom_${Date.now()}`,
      name: 'Simran Singh',
      role: 'Bridal Client',
      photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
      rating: 5,
      text: 'Highly professional experience. Completely satisfied with the luxury treatment!'
    };
    setConfig({
      ...config,
      testimonials: [newItem, ...config.testimonials]
    });
  };

  const deleteTestimonial = (id: string) => {
    setConfig({
      ...config,
      testimonials: config.testimonials.filter(t => t.id !== id)
    });
  };

  const updateTestimonial = (id: string, fields: Partial<Testimonial>) => {
    setConfig({
      ...config,
      testimonials: config.testimonials.map(t => t.id === id ? { ...t, ...fields } as Testimonial : t)
    });
  };

  const handleGalleryItemUpload = async (id: string, file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, JPEG, etc.).');
      return;
    }
    try {
      const url = await uploadImageToStorage(file, 'gallery');
      updateGalleryItem(id, { image: url });
    } catch (error) {
      console.error(error);
      alert('Failed to upload gallery image to Firebase storage.');
    }
  };

  const handleTestimonialUpload = async (id: string, file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, JPEG, etc.).');
      return;
    }
    try {
      const url = await uploadImageToStorage(file, 'testimonials');
      updateTestimonial(id, { photo: url });
    } catch (error) {
      console.error(error);
      alert('Failed to upload testimonial photo to Firebase storage.');
    }
  };

  const updateAboutSection = (key: string, value: any) => {
    setConfig({
      ...config,
      aboutSection: {
        ...(config.aboutSection || {
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
        }),
        [key]: value
      }
    });
  };

  const handleAboutSectionUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, JPEG, etc.).');
      return;
    }
    try {
      const url = await uploadImageToStorage(file, 'about');
      updateAboutSection('image', url);
    } catch (error) {
      console.error(error);
      alert('Failed to upload about section image to Firebase storage.');
    }
  };

  const updateWhyChooseSection = (key: string, value: any) => {
    setConfig({
      ...config,
      whyChooseSection: {
        ...(config.whyChooseSection || {
          subtitle: 'THE ANIKA TOUCH',
          title: 'Why Choose Our Salon',
          bullets: [
            { title: 'Certified Experts Only', text: 'Our professionals are trained periodically under elite cosmetic directors and hold active international treatment credentials.', icon: 'Award' },
            { title: 'Clinically Sterilized Space', text: 'We maintain hospital-grade sanitation, vacuum-sealed tool envelopes, and single-use protective fabrics.', icon: 'ShieldCheck' },
            { title: '100% Genuine Products', text: 'Absolutely zero copycats or dilutions. We use direct manufacturer imports from Huda, MAC, Moroccanoil, and L’Oréal Professionnel.', icon: 'Sparkles' },
            { title: 'Tailored Facemap Analysis', text: 'Every haircut, coloring, or bridal makeup palette is mathematically coordinated against your skin undertones & bone composition.', icon: 'Heart' }
          ]
        }),
        [key]: value
      }
    });
  };

  const updateFooterContent = (key: string, value: any) => {
    setConfig({
      ...config,
      footerContent: {
        ...(config.footerContent || {
          description: 'गोरखपुर का सबसे शानदार और भरोसेमंद लक्ज़री मेकअप स्टूडियो और ब्यूटी पार्लर। Experience luxurious beauty, hair care, and professional bridal services curated by Menka Singh.',
          copyrightText: '© 2026 Anika Makeover Salon. All Rights Reserved. Crafted for elite luxury bridal results in Gorakhpur.',
          usefulLinksTitle: 'Useful Directory',
          quickBookTitle: 'Online Reservations'
        }),
        [key]: value
      }
    });
  };

  const updateTheme = (key: string, value: any) => {
    setConfig({
      ...config,
      theme: {
        ...(config.theme || {
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
        }),
        [key]: value
      }
    });
  };

  const updateSectionToggle = (id: string, key: string, value: any) => {
    const defaultSections = [
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
    ];
    const list = config.sections || defaultSections;
    setConfig({
      ...config,
      sections: list.map(s => s.id === id ? { ...s, [key]: value } : s)
    });
  };

  const moveSection = (id: string, direction: 'up' | 'down') => {
    const defaultSections = [
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
    ];
    const list = [...(config.sections || defaultSections)];
    const index = list.findIndex(s => s.id === id);
    if (index === -1) return;
    const nextIndex = direction === 'up' ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= list.length) return;

    // Swap orders
    const currentOrder = list[index].order;
    list[index].order = list[nextIndex].order;
    list[nextIndex].order = currentOrder;

    // Sort
    list.sort((a, b) => a.order - b.order);
    setConfig({
      ...config,
      sections: list
    });
  };

  const updateMenuItem = (id: string, key: string, value: any) => {
    const defaultMenu = [
      { id: 'home', label: 'Home', visible: true },
      { id: 'about', label: 'About', visible: true },
      { id: 'services', label: 'Services', visible: true },
      { id: 'gallery', label: 'Gallery', visible: true },
      { id: 'testimonials', label: 'Reviews', visible: true },
      { id: 'faq', label: 'FAQ', visible: true },
      { id: 'contact', label: 'Contact', visible: true }
    ];
    const list = config.menuItems || defaultMenu;
    setConfig({
      ...config,
      menuItems: list.map(m => m.id === id ? { ...m, [key]: value } : m)
    });
  };

  const addVideoTestimonial = () => {
    const newItem: VideoTestimonial = {
      id: `vid_custom_${Date.now()}`,
      title: 'Bridal Makeover Transformation Reel',
      category: 'Bridal Series',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      thumbnail: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=400'
    };
    setConfig({
      ...config,
      videos: [...config.videos, newItem]
    });
  };

  const deleteVideoTestimonial = (id: string) => {
    setConfig({
      ...config,
      videos: config.videos.filter(v => v.id !== id)
    });
  };

  const updateVideoTestimonial = (id: string, fields: Partial<VideoTestimonial>) => {
    setConfig({
      ...config,
      videos: config.videos.map(v => v.id === id ? { ...v, ...fields } as VideoTestimonial : v)
    });
  };

  const handleVideoThumbnailUpload = async (id: string, file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, JPEG, etc.).');
      return;
    }
    try {
      const url = await uploadImageToStorage(file, 'videos');
      updateVideoTestimonial(id, { thumbnail: url });
    } catch (error) {
      console.error(error);
      alert('Failed to upload video thumbnail image to Firebase storage.');
    }
  };

  return (
    <div className="relative">
      {/* Editor Modal Sheet */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end font-sans">
          {/* Blur screen cover */}
          <div onClick={onClose} className="absolute inset-0 bg-neutral-950/80 backdrop-blur-sm cursor-pointer" />

          {/* Sizable Modal block */}
          <div className="relative w-full max-w-3xl bg-[#FFFDF8] h-full shadow-2xl flex flex-col border-l border-primary-gold/15 animate-slide-in">
            {/* Header Section */}
            <div className="p-6 border-b border-primary-gold/10 bg-neutral-900 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Lock className="text-accent-gold" size={20} />
                <h2 className="font-serif-luxury text-lg font-bold tracking-wide">
                  Anika Makeover Salon <span className="text-accent-gold">Owner Desk</span>
                </h2>
              </div>
              <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer">
                <X size={20} />
              </button>
            </div>

            {/* Authenticated content vs Login */}
            {!isAuthenticated ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 bg-neutral-900 text-neutral-300">
                <div className="max-w-md w-full bg-[#FFFDF8] text-luxury-text p-8 rounded-3xl border border-primary-gold/10 hover:border-primary-gold/30 shadow-2xl transition-all">
                  <div className="flex items-center justify-center p-3 bg-primary-gold/10 rounded-full w-14 h-14 mx-auto mb-4 border border-primary-gold/20 text-primary-gold">
                    <Lock size={24} />
                  </div>
                  <h3 className="font-serif-luxury text-xl font-bold text-center mb-1">Enter Master Password</h3>
                  <p className="font-sans text-xs text-gray-500 text-center mb-6">
                    Unlock master configuration controls to customize banners, services, images &amp; salon info.
                  </p>

                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <input
                        type="password"
                        placeholder="Owner Passcode"
                        value={passcode}
                        onChange={(e) => setPasscode(e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-primary-gold/20 focus:outline-none focus:border-primary-gold rounded-xl text-center font-sans tracking-widest text-sm"
                        autoFocus
                      />
                      {errorMsg && <p className="text-red-500 text-[11px] text-center mt-1.5 font-medium">{errorMsg}</p>}
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-gradient-to-r from-primary-gold to-[#a15a64] text-white rounded-xl font-btn font-bold uppercase tracking-wider text-xs transition-transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                    >
                      Authenticate Slot
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              <>
                {/* Content Tabs Navigation */}
                <div className="flex border-b border-primary-gold/10 bg-white shadow-sm shrink-0 overflow-x-auto text-[10px] font-btn">
                  {[
                    { id: 'contact', name: 'Contact' },
                    { id: 'services', name: 'Services' },
                    { id: 'founder', name: 'Founder' },
                    { id: 'banners', name: 'Banners' },
                    { id: 'about_us', name: 'About' },
                    { id: 'why_choose', name: 'Why Us' },
                    { id: 'gallery', name: 'Gallery' },
                    { id: 'videos', name: 'Videos' },
                    { id: 'testimonials', name: 'Reviews' },
                    { id: 'brand', name: 'Brand Style' },
                    { id: 'layout', name: 'Sections Order' },
                    { id: 'menu', name: 'Menu' },
                    { id: 'footer', name: 'Footer' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`min-w-[70px] px-3 py-3 text-center border-b-2 font-bold uppercase tracking-wider cursor-pointer transition-all shrink-0 ${
                        activeTab === tab.id
                          ? 'border-primary-gold text-primary-gold font-bold bg-primary-gold/5'
                          : 'border-transparent text-gray-500 hover:text-primary-gold hover:bg-neutral-50'
                      }`}
                    >
                      {tab.name}
                    </button>
                  ))}
                </div>

                {/* Main Form Fields Edit Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  
                  {isFirebasePlaceholder && (
                    <div id="firebase-status-banner" className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-800 space-y-2 animate-fade-in font-sans">
                      <div className="flex items-center gap-2 font-bold select-none">
                        <span className="p-1.5 bg-amber-200 text-amber-900 rounded-lg">⚙️</span>
                        <span>Complete Your Cloud Configuration</span>
                      </div>
                      <p className="leading-relaxed">
                        Your application is running in fully compliant Firebase Storage & Firestore mode! To enable live synchronization, please replace the placeholders in <code className="bg-amber-100 px-1 py-0.5 rounded font-mono font-bold text-amber-900">firebase-applet-config.json</code> with your actual project keys:
                      </p>
                      <div className="bg-amber-100/50 p-3 rounded-xl font-mono text-[10px] text-amber-900 grid grid-cols-1 sm:grid-cols-2 gap-2 border border-amber-200/50 select-all">
                        <div>• apiKey</div>
                        <div>• authDomain</div>
                        <div>• projectId</div>
                        <div>• storageBucket</div>
                        <div>• messagingSenderId</div>
                        <div>• appId</div>
                      </div>
                      <p className="text-[10px] text-amber-700 leading-normal">
                        Note: Once you supply these, all uploaded headers, gallery reels, founder quotes, and customer reviews will sync live and look identical on every phone and PC!
                      </p>
                    </div>
                  )}

                  {/* TAB 1: CONTACTS */}
                  {activeTab === 'contact' && (
                    <div className="space-y-4 animate-fade-in">
                      <div className="bg-primary-gold/5 p-4 rounded-2xl border border-primary-gold/10">
                        <h4 className="font-serif-luxury font-bold text-sm text-primary-gold mb-1">Direct Live Info Configuration</h4>
                        <p className="text-[11px] text-gray-500">Update salon contact details. Changes immediately reflect across navigation links, footers, call commands, and Google Map overlays!</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-btn text-gray-700 uppercase tracking-widest font-bold mb-1">Contact Phone</label>
                          <input
                            type="text"
                            value={config.contact.phone}
                            onChange={(e) => updateContact('phone', e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-primary-gold/20 focus:outline-none focus:border-primary-gold rounded-xl font-sans text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-btn text-gray-700 uppercase tracking-widest font-bold mb-1">Display formatted</label>
                          <input
                            type="text"
                            value={config.contact.phoneFormatted}
                            onChange={(e) => updateContact('phoneFormatted', e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-primary-gold/20 focus:outline-none focus:border-primary-gold rounded-xl font-sans text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-btn text-gray-700 uppercase tracking-widest font-bold mb-1">WhatsApp API Number</label>
                          <input
                            type="text"
                            value={config.contact.whatsapp}
                            onChange={(e) => updateContact('whatsapp', e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-primary-gold/20 focus:outline-none focus:border-primary-gold rounded-xl font-sans text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-btn text-gray-700 uppercase tracking-widest font-bold mb-1">Instagram Link</label>
                          <input
                            type="text"
                            value={config.contact.instagram}
                            onChange={(e) => updateContact('instagram', e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-primary-gold/20 focus:outline-none focus:border-primary-gold rounded-xl font-sans text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-btn text-gray-700 uppercase tracking-widest font-bold mb-1">Full Physical Address</label>
                        <textarea
                          value={config.contact.address}
                          onChange={(e) => updateContact('address', e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2 bg-white border border-primary-gold/20 focus:outline-none focus:border-primary-gold rounded-xl font-sans text-sm resize-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-btn text-gray-700 uppercase tracking-widest font-bold mb-1">Google Directions / Search Link</label>
                        <input
                          type="text"
                          value={config.contact.googleMapsLink}
                          onChange={(e) => updateContact('googleMapsLink', e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-primary-gold/20 focus:outline-none focus:border-primary-gold rounded-xl font-sans text-xs"
                        />
                      </div>
                    </div>
                  )}

                  {/* TAB 2: SERVICES */}
                  {activeTab === 'services' && (
                    <div className="space-y-6 animate-fade-in">
                      {config.services.map((cat) => (
                        <div key={cat.category} className="p-4 bg-white rounded-2xl border border-primary-gold/15">
                          <div className="flex items-center justify-between mb-3.5 border-b border-primary-gold/5 pb-2">
                            <h4 className="font-serif-luxury font-bold text-sm sm:text-base text-primary-gold uppercase tracking-wide">
                              {cat.category}
                            </h4>
                            <button
                              type="button"
                              onClick={() => addService(cat.category)}
                              className="px-3 py-1 bg-primary-gold/5 hover:bg-primary-gold text-primary-gold hover:text-white border border-primary-gold/20 rounded-full font-btn text-[10px] uppercase font-bold flex items-center space-x-1 cursor-pointer transition-colors"
                            >
                              <Plus size={12} />
                              <span>Add Service</span>
                            </button>
                          </div>

                          <div className="space-y-3">
                            {cat.services.map((srv) => (
                              <div key={srv.id} className="p-3 bg-neutral-50/50 rounded-xl border border-gray-100 flex flex-col space-y-2">
                                <div className="flex items-center justify-between gap-2">
                                  <input
                                    type="text"
                                    value={srv.title}
                                    placeholder="Service Title"
                                    onChange={(e) => updateServiceDetail(cat.category, srv.id, { title: e.target.value })}
                                    className="font-serif-luxury font-bold text-xs sm:text-sm text-luxury-text bg-transparent border-b border-dashed border-gray-300 focus:outline-none focus:border-primary-gold px-1 py-0.5 max-w-[200px]"
                                  />
                                  <div className="flex items-center space-x-2">
                                    <label className="flex items-center space-x-1 cursor-pointer">
                                      <input
                                        type="checkbox"
                                        checked={!!srv.popular}
                                        onChange={(e) => updateServiceDetail(cat.category, srv.id, { popular: e.target.checked })}
                                        className="rounded border-primary-gold text-primary-gold focus:ring-primary-gold"
                                      />
                                      <span className="text-[10px] text-gray-500 uppercase font-btn font-bold">Popular</span>
                                    </label>
                                    <button
                                      type="button"
                                      onClick={() => deleteService(cat.category, srv.id)}
                                      className="p-1.5 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors cursor-pointer"
                                      title="Delete Service"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                </div>

                                <textarea
                                  value={srv.description}
                                  placeholder="Service Description"
                                  onChange={(e) => updateServiceDetail(cat.category, srv.id, { description: e.target.value })}
                                  rows={2}
                                  className="w-full px-2.5 py-1.5 bg-white border border-gray-200 focus:outline-none focus:border-primary-gold rounded-lg font-sans text-xs resize-none"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* TAB 3: FOUNDER */}
                  {activeTab === 'founder' && (
                    <div className="space-y-4 animate-fade-in">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-btn text-gray-700 uppercase tracking-widest font-bold mb-1">Founder Name</label>
                          <input
                            type="text"
                            value={config.founder.name}
                            onChange={(e) => updateFounder('name', e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-primary-gold/20 focus:outline-none focus:border-primary-gold rounded-xl font-sans text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-btn text-gray-700 uppercase tracking-widest font-bold mb-1">Founder Title</label>
                          <input
                            type="text"
                            value={config.founder.designation}
                            onChange={(e) => updateFounder('designation', e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-primary-gold/20 focus:outline-none focus:border-primary-gold rounded-xl font-sans text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-btn text-gray-700 uppercase tracking-widest font-bold mb-1">Years Experience</label>
                          <input
                            type="number"
                            value={config.founder.experienceYears}
                            onChange={(e) => updateFounder('experienceYears', parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 bg-white border border-primary-gold/20 focus:outline-none focus:border-primary-gold rounded-xl font-sans text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-btn text-gray-700 uppercase tracking-widest font-bold mb-1">Happy Clients Count</label>
                          <input
                            type="number"
                            value={config.founder.happyClientsCount}
                            onChange={(e) => updateFounder('happyClientsCount', parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 bg-white border border-primary-gold/20 focus:outline-none focus:border-primary-gold rounded-xl font-sans text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-btn text-gray-700 uppercase tracking-widest font-bold mb-2">Founder Portrait Photo</label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                          {/* Left thumbnail preview */}
                          <div className="relative group rounded-xl overflow-hidden aspect-[3/4] max-h-48 border border-primary-gold/20 shadow-md">
                            <img
                              src={config.founder.photo}
                              alt="Founder preview"
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-neutral-950/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className="text-white text-[10px] uppercase tracking-wider font-bold">Current Image</span>
                            </div>
                          </div>

                          {/* Upload interaction box */}
                          <div className="sm:col-span-2">
                            <div
                              onDragOver={(e) => {
                                e.preventDefault();
                                setIsDragOver(true);
                              }}
                              onDragLeave={() => setIsDragOver(false)}
                              onDrop={(e) => {
                                e.preventDefault();
                                setIsDragOver(false);
                                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                                  handlePhotoUpload(e.dataTransfer.files[0]);
                                }
                              }}
                              onClick={() => document.getElementById('founder-photo-file-input')?.click()}
                              className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                                isDragOver
                                  ? 'border-primary-gold bg-primary-gold/10'
                                  : 'border-gray-300 hover:border-primary-gold hover:bg-neutral-50/50'
                              }`}
                            >
                              <Upload className={`h-8 w-8 mb-2 ${isDragOver ? 'text-primary-gold animate-bounce' : 'text-gray-400'}`} />
                              <p className="text-xs font-semibold text-gray-700">Drag &amp; drop owner's photo here</p>
                              <p className="text-[10px] text-gray-500 mt-1">or click to browse local files</p>
                              <input
                                id="founder-photo-file-input"
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    handlePhotoUpload(e.target.files[0]);
                                  }
                                }}
                                className="hidden"
                              />
                            </div>

                            <div className="mt-3">
                              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Or paste direct image address</label>
                              <input
                                type="text"
                                value={config.founder.photo}
                                onChange={(e) => updateFounder('photo', e.target.value)}
                                placeholder="https://images.unsplash.com/... or public cloud image URL"
                                className="w-full px-3 py-1.5 bg-white border border-primary-gold/20 focus:outline-none focus:border-primary-gold rounded-xl font-sans text-xs"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-btn text-gray-700 uppercase tracking-widest font-bold mb-1">Founder Message</label>
                        <textarea
                          value={config.founder.message}
                          onChange={(e) => updateFounder('message', e.target.value)}
                          rows={6}
                          className="w-full px-3 py-2 bg-white border border-primary-gold/20 focus:outline-none focus:border-primary-gold rounded-xl font-sans text-sm resize-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* TAB: BANNERS */}
                  {activeTab === 'banners' && (
                    <div className="space-y-8 animate-fade-in divide-y divide-primary-gold/15">
                      {/* Section 0: Homepage Main Hero Slider Banners */}
                      <div className="space-y-4 pb-6">
                        <div className="bg-primary-gold/5 p-4 rounded-2xl border border-primary-gold/10 flex items-center justify-between">
                          <div>
                            <h4 className="font-serif-luxury font-bold text-sm text-primary-gold mb-1">0. Page-top Rotating Slideshow Banners</h4>
                            <p className="text-[11px] text-gray-500">Edit and save custom messages, or upload new beautiful graphics directly inside the active slideshow banner seen on your home page greeting screen!</p>
                          </div>
                          <button
                            type="button"
                            onClick={addBannerSlide}
                            className="px-3 py-1.5 bg-primary-gold hover:bg-primary-gold/90 text-white border-0 rounded-full font-btn text-[10px] uppercase font-bold flex items-center space-x-1 cursor-pointer transition-transform active:scale-95"
                          >
                            <Plus size={12} />
                            <span>Add Slide</span>
                          </button>
                        </div>

                        <div className="space-y-6">
                          {config.banners?.map((slide, sIdx) => (
                            <div key={slide.id} className="p-4 bg-white rounded-2xl border border-primary-gold/15 space-y-4 shadow-sm animate-fade-in relative text-luxury-text">
                              <div className="flex items-center justify-between border-b border-primary-gold/5 pb-2">
                                <span className="text-xs uppercase font-btn tracking-wider font-extrabold text-primary-gold">
                                  Slide #{sIdx + 1}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => deleteBannerSlide(slide.id)}
                                  className="text-gray-400 hover:text-red-500 p-1.5 rounded-full hover:bg-red-50 transition-colors cursor-pointer border-0 bg-transparent"
                                  title="Remove Slide"
                                >
                                  <Trash2 size={15} />
                                </button>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-xs font-btn text-gray-700 uppercase tracking-widest font-bold mb-1">Gold Badge Text</label>
                                  <input
                                    type="text"
                                    value={slide.badge}
                                    placeholder="e.g. Premium Makeovers In Gorakhpur"
                                    onChange={(e) => updateBannerSlide(slide.id, 'badge', e.target.value)}
                                    className="w-full px-3 py-2 bg-white border border-primary-gold/20 focus:outline-[#C5A880] focus:border-primary-gold rounded-xl font-sans text-xs"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-btn text-gray-700 uppercase tracking-widest font-bold mb-1">Main Headline Text</label>
                                  <input
                                    type="text"
                                    value={slide.title}
                                    placeholder="e.g. Experience Personalized Glamour"
                                    onChange={(e) => updateBannerSlide(slide.id, 'title', e.target.value)}
                                    className="w-full px-3 py-2 bg-white border border-primary-gold/20 focus:outline-[#C5A880] focus:border-primary-gold rounded-xl font-sans text-xs"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-xs font-btn text-gray-700 uppercase tracking-widest font-bold mb-1">Slide Subtitle description</label>
                                <textarea
                                  value={slide.subtitle}
                                  placeholder="Describe the styling message..."
                                  onChange={(e) => updateBannerSlide(slide.id, 'subtitle', e.target.value)}
                                  rows={2}
                                  className="w-full px-3 py-2 bg-white border border-primary-gold/20 focus:outline-[#C5A880] focus:border-primary-gold rounded-xl font-sans text-xs resize-none"
                                />
                              </div>

                              <div>
                                <label className="block text-xs font-btn text-gray-700 uppercase tracking-widest font-bold mb-2">Backdrop Image Preview &amp; Upload</label>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                                  {/* Preview box */}
                                  <div className="relative group rounded-xl overflow-hidden aspect-[16/9] max-h-36 border border-primary-gold/20 shadow-md">
                                    <img
                                      src={slide.image}
                                      alt={`Slide ${sIdx + 1}`}
                                      referrerPolicy="no-referrer"
                                      className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-neutral-950/65 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                      <span className="text-white text-[10px] uppercase tracking-wider font-bold font-btn">Current Image</span>
                                    </div>
                                  </div>

                                  {/* Upload tools */}
                                  <div className="sm:col-span-2 space-y-2.5">
                                    <div
                                      onClick={() => document.getElementById(`hero-file-input-${slide.id}`)?.click()}
                                      className="border-2 border-dashed border-gray-300 hover:border-primary-gold hover:bg-[#FFFDF8] rounded-2xl p-4 flex flex-col items-center justify-center text-center transition-all cursor-pointer"
                                    >
                                      <Upload className="h-6 w-6 mb-1 text-gray-400" />
                                      <span className="text-xs font-semibold text-gray-700">Drag &amp; drop or click to upload brand image</span>
                                      <input
                                        id={`hero-file-input-${slide.id}`}
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                          if (e.target.files && e.target.files[0]) {
                                            handleBannerSlideUpload(slide.id, e.target.files[0]);
                                          }
                                        }}
                                        className="hidden"
                                      />
                                    </div>

                                    <div>
                                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Or paste background link address</label>
                                      <input
                                        type="text"
                                        value={slide.image}
                                        onChange={(e) => updateBannerSlide(slide.id, 'image', e.target.value)}
                                        placeholder="https://images.unsplash.com/... or uploaded local asset path"
                                        className="w-full px-3 py-1.5 bg-white border border-primary-gold/20 focus:outline-[#C5A880] focus:border-primary-gold rounded-xl font-sans text-xs"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Section 1: Welcome Banner Settings */}
                      <div className="space-y-4 pt-6">
                        <div className="bg-primary-gold/5 p-4 rounded-2xl border border-primary-gold/10 flex items-center justify-between">
                          <div>
                            <h4 className="font-serif-luxury font-bold text-sm text-primary-gold mb-1">1. Welcome Banner Section</h4>
                            <p className="text-[11px] text-gray-500">Configure the beautiful full-width welcome section positioned at the top fold of your page.</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-[11px] text-gray-500 uppercase tracking-wider font-bold">Active:</span>
                            <button
                              type="button"
                              onClick={() => updateWelcomeBanner('active', !config.welcomeBanner.active)}
                              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                config.welcomeBanner?.active ? 'bg-primary-gold' : 'bg-gray-300'
                              }`}
                            >
                              <span
                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                                  config.welcomeBanner?.active ? 'translate-x-5' : 'translate-x-0'
                                }`}
                              />
                            </button>
                          </div>
                        </div>

                        {config.welcomeBanner?.active && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs font-btn text-gray-700 uppercase tracking-widest font-bold mb-1">Banner Badge Text</label>
                                <input
                                  type="text"
                                  value={config.welcomeBanner.accentText}
                                  onChange={(e) => updateWelcomeBanner('accentText', e.target.value)}
                                  className="w-full px-3 py-2 bg-white border border-primary-gold/20 focus:outline-none focus:border-primary-gold rounded-xl font-sans text-sm"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-btn text-gray-700 uppercase tracking-widest font-bold mb-1">Banner Main Title</label>
                                <input
                                  type="text"
                                  value={config.welcomeBanner.title}
                                  onChange={(e) => updateWelcomeBanner('title', e.target.value)}
                                  className="w-full px-3 py-2 bg-white border border-primary-gold/20 focus:outline-none focus:border-primary-gold rounded-xl font-sans text-sm"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-xs font-btn text-gray-700 uppercase tracking-widest font-bold mb-1">Welcome Subtitle Details</label>
                              <textarea
                                value={config.welcomeBanner.subtitle}
                                onChange={(e) => updateWelcomeBanner('subtitle', e.target.value)}
                                rows={2}
                                className="w-full px-3 py-2 bg-white border border-primary-gold/20 focus:outline-none focus:border-primary-gold rounded-xl font-sans text-sm resize-none"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-btn text-gray-700 uppercase tracking-widest font-bold mb-2">Welcome Banner Image</label>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center animate-fade-in">
                                {/* Thumbnail preview */}
                                <div className="relative group rounded-xl overflow-hidden aspect-[16/9] max-h-36 border border-primary-gold/20 shadow-md">
                                  <img
                                    src={config.welcomeBanner.image}
                                    alt="Welcome preview"
                                    referrerPolicy="no-referrer"
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="absolute inset-0 bg-neutral-950/65 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-white text-[10px] uppercase tracking-wider font-bold">Current Banner</span>
                                  </div>
                                </div>

                                {/* Upload box */}
                                <div className="sm:col-span-2 space-y-2.5">
                                  <div
                                    onClick={() => document.getElementById('welcome-banner-file-input')?.click()}
                                    className="border-2 border-dashed border-gray-300 hover:border-primary-gold hover:bg-[#FFFDF8] rounded-2xl p-4 flex flex-col items-center justify-center text-center transition-all cursor-pointer"
                                  >
                                    <Upload className="h-6 w-6 mb-1 text-gray-400" />
                                    <span className="text-xs font-semibold text-gray-700">Drag &amp; drop or click to upload banner image</span>
                                    <input
                                      id="welcome-banner-file-input"
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                          handleWelcomeBannerUpload(e.target.files[0]);
                                        }
                                      }}
                                      className="hidden"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 animate-pulse">Or paste image web link reference</label>
                                    <input
                                      type="text"
                                      value={config.welcomeBanner.image}
                                      onChange={(e) => updateWelcomeBanner('image', e.target.value)}
                                      placeholder="https://unsplash.com/... or search-generated image path"
                                      className="w-full px-3 py-1.5 bg-white border border-primary-gold/20 focus:outline-none focus:border-primary-gold rounded-xl font-sans text-xs"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Section 2: Promo Banner Settings */}
                      <div className="space-y-4 pt-6">
                        <div className="bg-primary-gold/5 p-4 rounded-2xl border border-primary-gold/10 flex items-center justify-between">
                          <div>
                            <h4 className="font-serif-luxury font-bold text-sm text-primary-gold mb-1">2. Promotional / Coupon Banner</h4>
                            <p className="text-[11px] text-gray-500">Configure the highlighted wide promotion banner featured down the services block of your page.</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-[11px] text-gray-500 uppercase tracking-wider font-bold">Active:</span>
                            <button
                              type="button"
                              onClick={() => updatePromoBanner('active', !config.promoBanner.active)}
                              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                config.promoBanner?.active ? 'bg-primary-gold' : 'bg-gray-300'
                              }`}
                            >
                              <span
                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                                  config.promoBanner?.active ? 'translate-x-5' : 'translate-x-0'
                                }`}
                              />
                            </button>
                          </div>
                        </div>

                        {config.promoBanner?.active && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs font-btn text-gray-700 uppercase tracking-widest font-bold mb-1">Sale Badge Text</label>
                                <input
                                  type="text"
                                  value={config.promoBanner.badge}
                                  onChange={(e) => updatePromoBanner('badge', e.target.value)}
                                  className="w-full px-3 py-2 bg-white border border-primary-gold/20 focus:outline-none focus:border-primary-gold rounded-xl font-sans text-sm"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-btn text-gray-700 uppercase tracking-widest font-bold mb-1">Primary Banner Heading</label>
                                <input
                                  type="text"
                                  value={config.promoBanner.title}
                                  onChange={(e) => updatePromoBanner('title', e.target.value)}
                                  className="w-full px-3 py-2 bg-white border border-primary-gold/20 focus:outline-none focus:border-primary-gold rounded-xl font-sans text-sm"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs font-btn text-gray-700 uppercase tracking-widest font-bold mb-1">Button Action Text</label>
                                <input
                                  type="text"
                                  value={config.promoBanner.buttonText}
                                  onChange={(e) => updatePromoBanner('buttonText', e.target.value)}
                                  className="w-full px-3 py-2 bg-white border border-primary-gold/20 focus:outline-none focus:border-primary-gold rounded-xl font-sans text-sm"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-btn text-gray-700 uppercase tracking-widest font-bold mb-1">Promo Details Text</label>
                                <input
                                  type="text"
                                  value={config.promoBanner.subtitle}
                                  onChange={(e) => updatePromoBanner('subtitle', e.target.value)}
                                  className="w-full px-3 py-2 bg-white border border-primary-gold/20 focus:outline-none focus:border-primary-gold rounded-xl font-sans text-sm"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-xs font-btn text-gray-700 uppercase tracking-widest font-bold mb-2">Promotion Backdrop Picture</label>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center animate-fade-in">
                                {/* Thumbnail preview */}
                                <div className="relative group rounded-xl overflow-hidden aspect-[16/9] max-h-36 border border-primary-gold/20 shadow-md">
                                  <img
                                    src={config.promoBanner.image}
                                    alt="Promo preview"
                                    referrerPolicy="no-referrer"
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="absolute inset-0 bg-neutral-950/65 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-white text-[10px] uppercase tracking-wider font-bold">Current Backdrop</span>
                                  </div>
                                </div>

                                {/* Upload box */}
                                <div className="sm:col-span-2 space-y-2.5">
                                  <div
                                    onClick={() => document.getElementById('promo-banner-file-input')?.click()}
                                    className="border-2 border-dashed border-gray-300 hover:border-primary-gold hover:bg-[#FFFDF8] rounded-2xl p-4 flex flex-col items-center justify-center text-center transition-all cursor-pointer"
                                  >
                                    <Upload className="h-6 w-6 mb-1 text-gray-400" />
                                    <span className="text-xs font-semibold text-gray-700">Drag &amp; drop or click to upload promo backdrop</span>
                                    <input
                                      id="promo-banner-file-input"
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                          handlePromoBannerUpload(e.target.files[0]);
                                        }
                                      }}
                                      className="hidden"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 animate-pulse">Or paste backdrop URL link</label>
                                    <input
                                      type="text"
                                      value={config.promoBanner.image}
                                      onChange={(e) => updatePromoBanner('image', e.target.value)}
                                      placeholder="https://unsplash.com/... or search-generated image path"
                                      className="w-full px-3 py-1.5 bg-white border border-primary-gold/20 focus:outline-none focus:border-primary-gold rounded-xl font-sans text-xs"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Section 3: Shop / Salon Banner Settings */}
                      <div className="space-y-4 pt-6">
                        <div className="bg-primary-gold/5 p-4 rounded-2xl border border-primary-gold/10 flex items-center justify-between">
                          <div>
                            <h4 className="font-serif-luxury font-bold text-sm text-primary-gold mb-1">3. Shop / Studio Banner</h4>
                            <p className="text-[11px] text-gray-500">Configure the beautiful full-width shop banner to display your visual studio frontage or storefront.</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-[11px] text-gray-500 uppercase tracking-wider font-bold">Active:</span>
                            <button
                              type="button"
                              onClick={() => updateShopBanner('active', !config.shopBanner.active)}
                              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                config.shopBanner?.active ? 'bg-primary-gold' : 'bg-gray-300'
                              }`}
                            >
                              <span
                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                                  config.shopBanner?.active ? 'translate-x-5' : 'translate-x-0'
                                }`}
                              />
                            </button>
                          </div>
                        </div>

                        {config.shopBanner?.active && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs font-btn text-gray-700 uppercase tracking-widest font-bold mb-1">Section Title Reference</label>
                                <input
                                  type="text"
                                  value={config.shopBanner.title}
                                  onChange={(e) => updateShopBanner('title', e.target.value)}
                                  className="w-full px-3 py-2 bg-white border border-primary-gold/20 focus:outline-[#C5A880] focus:border-primary-gold rounded-xl font-sans text-sm"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-btn text-gray-700 uppercase tracking-widest font-bold mb-1">Subtitle Note Reference</label>
                                <input
                                  type="text"
                                  value={config.shopBanner.subtitle}
                                  onChange={(e) => updateShopBanner('subtitle', e.target.value)}
                                  className="w-full px-3 py-2 bg-white border border-primary-gold/20 focus:outline-[#C5A880] focus:border-primary-gold rounded-xl font-sans text-sm"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-xs font-btn text-gray-700 uppercase tracking-widest font-bold mb-2">Shop Front Backdrop Picture</label>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center animate-fade-in">
                                {/* Thumbnail preview */}
                                <div className="relative group rounded-xl overflow-hidden aspect-[16/9] max-h-36 border border-primary-gold/20 shadow-md">
                                  <img
                                    src={config.shopBanner.image}
                                    alt="Shop preview"
                                    referrerPolicy="no-referrer"
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="absolute inset-0 bg-neutral-950/65 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-white text-[10px] uppercase tracking-wider font-bold">Current Shop Banner</span>
                                  </div>
                                </div>

                                {/* Upload box */}
                                <div className="sm:col-span-2 space-y-2.5">
                                  <div
                                    onClick={() => document.getElementById('shop-banner-file-input')?.click()}
                                    className="border-2 border-dashed border-gray-300 hover:border-primary-gold hover:bg-[#FFFDF8] rounded-2xl p-4 flex flex-col items-center justify-center text-center transition-all cursor-pointer"
                                  >
                                    <Upload className="h-6 w-6 mb-1 text-gray-400" />
                                    <span className="text-xs font-semibold text-gray-700">Drag &amp; drop or click to upload shop picture</span>
                                    <input
                                      id="shop-banner-file-input"
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                          handleShopBannerUpload(e.target.files[0]);
                                        }
                                      }}
                                      className="hidden"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 animate-pulse">Or paste backdrop URL link</label>
                                    <input
                                      type="text"
                                      value={config.shopBanner.image}
                                      onChange={(e) => updateShopBanner('image', e.target.value)}
                                      placeholder="https://unsplash.com/... or upload-generated file"
                                      className="w-full px-3 py-1.5 bg-white border border-primary-gold/20 focus:outline-[#C5A880] focus:border-primary-gold rounded-xl font-sans text-xs"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* TAB 4: GALLERY */}
                  {activeTab === 'gallery' && (
                    <div className="space-y-4 animate-fade-in">
                      <div className="flex items-center justify-between border-b border-primary-gold/10 pb-2.5">
                        <span className="font-serif-luxury text-sm font-bold text-gray-700">Manage Picture Portfolio ({config.gallery.length} items)</span>
                        <button
                          type="button"
                          onClick={addGalleryItem}
                          className="px-3 py-1.5 bg-primary-gold text-white font-btn text-[10px] uppercase font-bold rounded-full flex items-center space-x-1 cursor-pointer transition-colors hover:bg-primary-gold/90"
                        >
                          <Plus size={12} />
                          <span>Add Image Slot</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {config.gallery.map((item) => (
                          <div key={item.id} className="p-3 bg-white rounded-2xl border border-primary-gold/10 flex space-x-3 items-center">
                            <div 
                              onClick={() => document.getElementById(`gallery-file-input-${item.id}`)?.click()} 
                              className="relative cursor-pointer group w-14 h-14 shrink-0 rounded-xl overflow-hidden border border-gray-200 hover:border-primary-gold"
                              title="Click to Upload Custom Image"
                            >
                              <img
                                src={item.image}
                                alt={item.title}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Upload size={14} className="text-white" />
                              </div>
                              <input
                                id={`gallery-file-input-${item.id}`}
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    handleGalleryItemUpload(item.id, e.target.files[0]);
                                  }
                                }}
                                className="hidden"
                              />
                            </div>
                            <div className="flex-1 min-w-0 space-y-1.5">
                              <input
                                type="text"
                                value={item.title}
                                placeholder="Image Title"
                                onChange={(e) => updateGalleryItem(item.id, { title: e.target.value })}
                                className="w-full text-xs font-bold font-serif-luxury bg-transparent border-b border-gray-200 focus:outline-none focus:border-primary-gold py-0.5 text-luxury-text"
                              />
                              <div className="flex items-center space-x-2">
                                <select
                                  value={item.category}
                                  onChange={(e) => updateGalleryItem(item.id, { category: e.target.value as any })}
                                  className="text-[10px] font-sans bg-transparent border border-gray-200 focus:outline-none rounded px-1"
                                >
                                  <option value="Bridal Makeup">Bridal Makeup</option>
                                  <option value="Hair Transformations">Hair Transformations</option>
                                  <option value="Party Looks">Party Looks</option>
                                  <option value="Beauty Treatments">Beauty Treatments</option>
                                </select>
                                <button
                                  type="button"
                                  onClick={() => deleteGalleryItem(item.id)}
                                  className="text-[10px] font-bold font-btn text-red-500 hover:underline cursor-pointer"
                                >
                                  Remove
                                </button>
                              </div>
                              <input
                                type="text"
                                value={item.image}
                                placeholder="Or Paste Image Link Link"
                                onChange={(e) => updateGalleryItem(item.id, { image: e.target.value })}
                                className="w-full text-[9px] text-gray-400 bg-transparent border-0 truncate focus:outline-none"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB 5: TESTIMONIAL REVIEWS */}
                  {activeTab === 'testimonials' && (
                    <div className="space-y-4 animate-fade-in">
                      <div className="flex items-center justify-between border-b border-primary-gold/10 pb-2.5">
                        <span className="font-serif-luxury text-sm font-bold text-gray-700">Text Customer Reviews ({config.testimonials.length} reviews)</span>
                        <button
                          type="button"
                          onClick={addTestimonial}
                          className="px-3 py-1.5 bg-primary-gold text-white font-btn text-[10px] uppercase font-bold rounded-full flex items-center space-x-1 cursor-pointer transition-colors hover:bg-primary-gold/90"
                        >
                          <Plus size={12} />
                          <span>Add Review</span>
                        </button>
                      </div>

                      <div className="space-y-4">
                        {config.testimonials.map((t) => (
                          <div key={t.id} className="p-4 bg-white rounded-2xl border border-primary-gold/15 space-y-3">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-center space-x-3 flex-1 min-w-0">
                                <div 
                                  onClick={() => document.getElementById(`testimonial-file-input-${t.id}`)?.click()} 
                                  className="relative cursor-pointer group w-10 h-10 shrink-0 rounded-full overflow-hidden border border-gray-200 hover:border-primary-gold"
                                  title="Click to Upload Custom Avatar"
                                >
                                  <img
                                    src={t.photo}
                                    alt={t.name}
                                    referrerPolicy="no-referrer"
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Upload size={12} className="text-white" />
                                  </div>
                                  <input
                                    id={`testimonial-file-input-${t.id}`}
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                      if (e.target.files && e.target.files[0]) {
                                        handleTestimonialUpload(t.id, e.target.files[0]);
                                      }
                                    }}
                                    className="hidden"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <input
                                    type="text"
                                    value={t.name}
                                    onChange={(e) => updateTestimonial(t.id, { name: e.target.value })}
                                    className="w-full font-serif-luxury font-bold text-xs bg-transparent border-b border-gray-200 focus:outline-none py-0.5 text-luxury-text"
                                    placeholder="Reviewer Name"
                                  />
                                  <input
                                    type="text"
                                    value={t.role}
                                    onChange={(e) => updateTestimonial(t.id, { role: e.target.value })}
                                    className="w-full text-[10px] block text-gray-400 bg-transparent border-0 focus:outline-none mt-0.5"
                                    placeholder="Reviewer Role (e.g. Regular Client)"
                                  />
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => deleteTestimonial(t.id)}
                                className="p-1.5 text-gray-400 hover:text-red-500 rounded-full cursor-pointer hover:bg-neutral-50 transition-colors"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>

                            <textarea
                              value={t.text}
                              onChange={(e) => updateTestimonial(t.id, { text: e.target.value })}
                              rows={3}
                              className="w-full px-2.5 py-1.5 bg-[#FFFDF8] border border-gray-200 focus:outline-none focus:border-primary-gold rounded-xl font-sans text-xs resize-none"
                              placeholder="Review Text Content..."
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB: ABOUT US */}
                  {activeTab === 'about_us' && (() => {
                    const about = config.aboutSection || {
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
                    };
                    return (
                      <div className="space-y-6 animate-fade-in text-luxury-text text-xs text-left">
                        <div className="bg-primary-gold/5 p-4 rounded-2xl border border-primary-gold/10">
                          <h4 className="font-serif-luxury font-bold text-sm text-primary-gold mb-1">About Us Section Editor</h4>
                          <p className="text-[11px] text-gray-500">Configure the biographical narrative, certified credentials, and core philosophy bullets of Anika Makeover Salon.</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-btn font-bold uppercase text-gray-700 tracking-wider mb-1">Badge Text</label>
                            <input
                              type="text"
                              value={about.badge}
                              onChange={(e) => updateAboutSection('badge', e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-primary-gold/20 focus:outline-none focus:border-primary-gold rounded-xl font-sans text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-btn font-bold uppercase text-gray-700 tracking-wider mb-1">Artistry Subtitle</label>
                            <input
                              type="text"
                              value={about.artistrySubtitle}
                              onChange={(e) => updateAboutSection('artistrySubtitle', e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-primary-gold/20 focus:outline-none focus:border-primary-gold rounded-xl font-sans text-xs text-luxury-text"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-btn font-bold uppercase text-gray-700 tracking-wider mb-1">Welcome Bold Title</label>
                            <input
                              type="text"
                              value={about.title}
                              onChange={(e) => updateAboutSection('title', e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-primary-gold/20 focus:outline-none focus:border-primary-gold rounded-xl font-sans text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-btn font-bold uppercase text-gray-700 tracking-wider mb-1">Artistry Section Title</label>
                            <input
                              type="text"
                              value={about.artistryTitle}
                              onChange={(e) => updateAboutSection('artistryTitle', e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-primary-gold/20 focus:outline-none focus:border-primary-gold rounded-xl font-sans text-xs text-luxury-text"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-btn font-bold uppercase text-gray-700 tracking-wider mb-1">Welcome Paragraph description</label>
                            <textarea
                              value={about.description}
                              onChange={(e) => updateAboutSection('description', e.target.value)}
                              rows={4}
                              className="w-full px-3 py-2 bg-white border border-primary-gold/20 focus:outline-none focus:border-primary-gold rounded-xl font-sans text-xs resize-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-btn font-bold uppercase text-gray-700 tracking-wider mb-1">Artistry Paragraph details</label>
                            <textarea
                              value={about.artistryDescription}
                              onChange={(e) => updateAboutSection('artistryDescription', e.target.value)}
                              rows={4}
                              className="w-full px-3 py-2 bg-white border border-primary-gold/20 focus:outline-none focus:border-primary-gold rounded-xl font-sans text-xs resize-none text-luxury-text"
                            />
                          </div>
                        </div>

                        <div className="p-4 bg-primary-gold/5 border border-primary-gold/10 rounded-2xl space-y-3">
                          <h5 className="font-serif-luxury font-bold text-xs text-primary-gold">Clinical Sanitization / Certified Badge Overlay</h5>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] font-btn font-bold uppercase text-gray-700 tracking-wider mb-1">Badge Title</label>
                              <input
                                type="text"
                                value={about.certifiedBadgeTitle}
                                onChange={(e) => updateAboutSection('certifiedBadgeTitle', e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-primary-gold/20 focus:outline-none focus:border-primary-gold rounded-xl font-sans text-xs text-luxury-text"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-btn font-bold uppercase text-gray-700 tracking-wider mb-1">Badge Details Formatted</label>
                              <input
                                type="text"
                                value={about.certifiedBadgeText}
                                onChange={(e) => updateAboutSection('certifiedBadgeText', e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-primary-gold/20 focus:outline-none focus:border-primary-gold rounded-xl font-sans text-xs text-luxury-text"
                              />
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-btn font-bold uppercase text-gray-700 tracking-wider mb-1 font-semibold">About Side Image Backdrop</label>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                            <div className="relative group rounded-xl overflow-hidden aspect-[4/3] max-h-32 border border-primary-gold/20 shadow-sm">
                              <img src={about.image} alt="About preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            </div>
                            <div className="sm:col-span-2 space-y-2">
                              <div
                                onClick={() => document.getElementById('about-section-file-input')?.click()}
                                className="border-2 border-dashed border-gray-300 hover:border-primary-gold hover:bg-[#FFFDF8] rounded-xl p-3 flex flex-col items-center justify-center text-center cursor-pointer"
                              >
                                <Upload className="h-5 w-5 mb-1 text-gray-400" />
                                <span className="text-[10px] font-semibold text-gray-700">Drag &amp; drop or click to upload brand photo</span>
                                <input
                                  id="about-section-file-input"
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                      handleAboutSectionUpload(e.target.files[0]);
                                    }
                                  }}
                                  className="hidden"
                                />
                              </div>
                              <input
                                type="text"
                                value={about.image}
                                onChange={(e) => updateAboutSection('image', e.target.value)}
                                placeholder="Or paste custom image address link"
                                className="w-full px-3 py-1.5 bg-white border border-primary-gold/20 focus:outline-none focus:border-primary-gold rounded-xl font-sans text-xs"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3 pt-2">
                          <h5 className="font-serif-luxury font-bold text-xs text-primary-gold">About Bullets List (4 Points)</h5>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {about.bullets?.map((b, bIdx) => (
                              <div key={bIdx} className="p-3 bg-white rounded-xl border border-primary-gold/10 space-y-2 text-left">
                                <span className="text-[9px] font-bold text-primary-gold uppercase tracking-widest">Bullet Point #{bIdx + 1}</span>
                                <input
                                  type="text"
                                  value={b.title}
                                  onChange={(e) => {
                                    const newBullets = [...about.bullets];
                                    newBullets[bIdx] = { ...b, title: e.target.value };
                                    updateAboutSection('bullets', newBullets);
                                  }}
                                  placeholder="Bullet Title"
                                  className="w-full px-2 py-1 bg-neutral-50 border border-gray-200 focus:outline-[#C5A880] focus:bg-white rounded text-xs font-bold font-serif-luxury"
                                />
                                <textarea
                                  value={b.text}
                                  onChange={(e) => {
                                    const newBullets = [...about.bullets];
                                    newBullets[bIdx] = { ...b, text: e.target.value };
                                    updateAboutSection('bullets', newBullets);
                                  }}
                                  rows={2}
                                  placeholder="Bullet Description Text"
                                  className="w-full px-2 py-1 bg-neutral-50 border border-gray-200 focus:outline-[#C5A880] focus:bg-white rounded text-[11px] resize-none"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* TAB: WHY CHOOSE US */}
                  {activeTab === 'why_choose' && (() => {
                    const why = config.whyChooseSection || {
                      subtitle: 'THE ANIKA TOUCH',
                      title: 'Why Choose Our Salon',
                      bullets: [
                        { title: 'Certified Experts Only', text: 'Our professionals are trained periodically under elite cosmetic directors and hold active international treatment credentials.', icon: 'Award' },
                        { title: 'Clinically Sterilized Space', text: 'We maintain hospital-grade sanitation, vacuum-sealed tool envelopes, and single-use protective fabrics.', icon: 'ShieldCheck' },
                        { title: '100% Genuine Products', text: 'Absolutely zero copycats or dilutions. We use direct manufacturer imports from Huda, MAC, Moroccanoil, and L’Oréal Professionnel.', icon: 'Sparkles' },
                        { title: 'Tailored Facemap Analysis', text: 'Every haircut, coloring, or bridal makeup palette is mathematically coordinated against your skin undertones & bone composition.', icon: 'Heart' }
                      ]
                    };
                    return (
                      <div className="space-y-6 animate-fade-in text-luxury-text text-xs text-left">
                        <div className="bg-primary-gold/5 p-4 rounded-2xl border border-primary-gold/10 font-sans">
                          <h4 className="font-serif-luxury font-bold text-sm text-primary-gold mb-1">Why Choose Anika Makeover Section</h4>
                          <p className="text-[11px] text-gray-500">Edit the highlight values, core selling points, and certified credentials that elevate your reputation above competitors in Gorakhpur.</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-btn font-bold uppercase text-gray-700 tracking-wider mb-1">Section Subtitle</label>
                            <input
                              type="text"
                              value={why.subtitle}
                              onChange={(e) => updateWhyChooseSection('subtitle', e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-primary-gold/20 focus:outline-none focus:border-primary-gold rounded-xl font-sans text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-btn font-bold uppercase text-gray-700 tracking-wider mb-1">Section Main Title</label>
                            <input
                              type="text"
                              value={why.title}
                              onChange={(e) => updateWhyChooseSection('title', e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-primary-gold/20 focus:outline-none focus:border-primary-gold rounded-xl font-sans text-xs font-serif-luxury font-bold"
                            />
                          </div>
                        </div>

                        <div className="space-y-4 pt-2">
                          <h5 className="font-serif-luxury font-bold text-xs text-primary-gold">Valued Highlights list (4 main cards)</h5>
                          <div className="space-y-3">
                            {why.bullets?.map((b, bIdx) => (
                              <div key={bIdx} className="p-4 bg-white rounded-2xl border border-primary-gold/15 space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-[9px] font-bold text-primary-gold uppercase tracking-wider">Highlight card #{bIdx + 1}</span>
                                  <div className="flex items-center space-x-2">
                                    <span className="text-[9px] text-gray-400 font-bold uppercase">Associated Icon:</span>
                                    <select
                                      value={b.icon}
                                      onChange={(e) => {
                                        const newBullets = [...why.bullets];
                                        newBullets[bIdx] = { ...b, icon: e.target.value };
                                        updateWhyChooseSection('bullets', newBullets);
                                      }}
                                      className="text-[10px] font-sans bg-[#FFFDF8] border border-primary-gold/20 rounded px-1.5 py-0.5 text-luxury-text focus:outline-none cursor-pointer"
                                    >
                                      <option value="Award">Award Badge (Elite training)</option>
                                      <option value="ShieldCheck">Shield Check (Hygienic standard)</option>
                                      <option value="Sparkles">Sparkles Star (Genuine formulas)</option>
                                      <option value="Heart">Heart Facemap (Anatomical matches)</option>
                                    </select>
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                  <div className="sm:col-span-1">
                                    <label className="block text-[9px] uppercase font-bold text-gray-500 mb-0.5">Card Heading</label>
                                    <input
                                      type="text"
                                      value={b.title}
                                      onChange={(e) => {
                                        const newBullets = [...why.bullets];
                                        newBullets[bIdx] = { ...b, title: e.target.value };
                                        updateWhyChooseSection('bullets', newBullets);
                                      }}
                                      className="w-full px-2 py-1 bg-neutral-50 border border-gray-200 focus:outline-[#C5A880] focus:bg-white rounded text-xs font-bold font-serif-luxury"
                                    />
                                  </div>
                                  <div className="sm:col-span-2 font-sans text-left text-xs">
                                    <label className="block text-[9px] uppercase font-bold text-gray-500 mb-0.5">Card Description Text</label>
                                    <textarea
                                      value={b.text}
                                      onChange={(e) => {
                                        const newBullets = [...why.bullets];
                                        newBullets[bIdx] = { ...b, text: e.target.value };
                                        updateWhyChooseSection('bullets', newBullets);
                                      }}
                                      rows={2}
                                      className="w-full px-2 py-1 bg-neutral-50 border border-gray-200 focus:outline-[#C5A880] focus:bg-white rounded text-xs resize-none"
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* TAB: VIDEO TESTIMONIALS */}
                  {activeTab === 'videos' && (
                    <div className="space-y-4 animate-fade-in text-luxury-text text-xs text-left">
                      <div className="flex items-center justify-between border-b border-primary-gold/15 pb-2.5">
                        <div className="text-left">
                          <h4 className="font-serif-luxury font-bold text-sm text-primary-gold mb-1">Video Testimonials Manager</h4>
                          <p className="text-[11px] text-gray-500">Manage real client result videos, embed custom YouTube reels/videos, edit thumbnails, or drag-and-drop cover graphics.</p>
                        </div>
                        <button
                          type="button"
                          onClick={addVideoTestimonial}
                          className="px-3 py-1.5 bg-primary-gold text-white font-btn text-[10px] uppercase font-bold rounded-full flex items-center space-x-1 cursor-pointer transition-colors hover:bg-primary-gold/90 shrink-0"
                        >
                          <Plus size={12} />
                          <span>Add Video Slot</span>
                        </button>
                      </div>

                      <div className="space-y-4">
                        {config.videos?.map((v, index) => (
                          <div key={v.id} className="p-4 bg-white rounded-2xl border border-primary-gold/15 space-y-3 shadow-sm relative text-left">
                            <div className="flex items-center justify-between border-b border-primary-gold/5 pb-2">
                              <span className="text-[10px] font-extrabold uppercase font-btn text-primary-gold">
                                Video Reel #{index + 1} ({v.category})
                              </span>
                              <div className="flex items-center space-x-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (index > 0) {
                                      const list = [...config.videos];
                                      const temp = list[index];
                                      list[index] = list[index - 1];
                                      list[index - 1] = temp;
                                      setConfig({ ...config, videos: list });
                                    }
                                  }}
                                  disabled={index === 0}
                                  className="p-1 text-gray-400 hover:text-primary-gold hover:bg-gray-50 rounded disabled:opacity-30 cursor-pointer border-0 bg-transparent"
                                  title="Move Up"
                                >
                                  <ArrowUp size={13} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (index < config.videos.length - 1) {
                                      const list = [...config.videos];
                                      const temp = list[index];
                                      list[index] = list[index + 1];
                                      list[index + 1] = temp;
                                      setConfig({ ...config, videos: list });
                                    }
                                  }}
                                  disabled={index === config.videos.length - 1}
                                  className="p-1 text-gray-400 hover:text-primary-gold hover:bg-gray-50 rounded disabled:opacity-30 cursor-pointer border-0 bg-transparent"
                                  title="Move Down"
                                >
                                  <ArrowDown size={13} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => deleteVideoTestimonial(v.id)}
                                  className="p-1.5 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors cursor-pointer border-0 bg-transparent"
                                  title="Delete video reel"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                              {/* Thumbnail Preview and Upload */}
                              <div className="flex flex-col items-center space-y-1.5">
                                <div
                                  onClick={() => document.getElementById(`video-thumb-input-${v.id}`)?.click()}
                                  className="relative cursor-pointer group rounded-xl overflow-hidden aspect-video border border-gray-200 hover:border-primary-gold w-full max-h-24 max-w-[150px]"
                                  title="Click to upload custom cover photo"
                                >
                                  <img src={v.thumbnail} alt={v.title} className="w-full h-full object-cover pointer-events-none" referrerPolicy="no-referrer" />
                                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Upload size={14} className="text-white" />
                                  </div>
                                </div>
                                <span className="text-[9px] text-gray-400 font-semibold">Change Thumbnail</span>
                                <input
                                  id={`video-thumb-input-${v.id}`}
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                      handleVideoThumbnailUpload(v.id, e.target.files[0]);
                                    }
                                  }}
                                  className="hidden"
                                />
                              </div>

                              <div className="sm:col-span-2 space-y-2">
                                <div className="grid grid-cols-2 gap-2 text-left">
                                  <div>
                                    <label className="block text-[9px] font-bold text-gray-500 uppercase">Video Title</label>
                                    <input
                                      type="text"
                                      value={v.title}
                                      onChange={(e) => updateVideoTestimonial(v.id, { title: e.target.value })}
                                      className="w-full px-2 py-1 bg-neutral-50 border border-gray-200 focus:outline-[#C5A880] focus:bg-white rounded text-xs text-luxury-text font-serif-luxury font-bold"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[9px] font-bold text-gray-500 uppercase">Category Tag</label>
                                    <input
                                      type="text"
                                      value={v.category}
                                      onChange={(e) => updateVideoTestimonial(v.id, { category: e.target.value })}
                                      className="w-full px-2 py-1 bg-neutral-50 border border-gray-200 focus:outline-[#C5A880] focus:bg-white rounded text-xs text-luxury-text"
                                    />
                                  </div>
                                </div>

                                <div className="text-left pb-1">
                                  <label className="block text-[9px] font-bold text-gray-500 uppercase">YouTube embed URL / Direct video Link</label>
                                  <input
                                    type="text"
                                    value={v.videoUrl}
                                    onChange={(e) => updateVideoTestimonial(v.id, { videoUrl: e.target.value })}
                                    placeholder="e.g. https://www.youtube.com/embed/... or .mp4 link"
                                    className="w-full px-2 py-1 bg-neutral-50 border border-gray-200 focus:outline-[#C5A880] focus:bg-white rounded text-xs text-luxury-text"
                                  />
                                </div>

                                <div className="text-left opacity-95">
                                  <label className="block text-[8px] font-bold text-gray-400 uppercase">Or Thumbnail Image Reference URL</label>
                                  <input
                                    type="text"
                                    value={v.thumbnail}
                                    onChange={(e) => updateVideoTestimonial(v.id, { thumbnail: e.target.value })}
                                    className="w-full px-2 py-0.5 bg-transparent border-0 font-mono text-[9px] text-gray-400 focus:outline-none focus:border-b truncate text-left"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB: BRAND THEME STYLE */}
                  {activeTab === 'brand' && (() => {
                    const t = config.theme || {
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
                    };
                    return (
                      <div className="space-y-6 animate-fade-in text-luxury-text text-xs text-left">
                        <div className="bg-primary-gold/5 p-4 rounded-2xl border border-primary-gold/10 font-sans">
                          <h4 className="font-serif-luxury font-bold text-sm text-primary-gold mb-1">Cosmetics &amp; Brand Style Customizer</h4>
                          <p className="text-[11px] text-gray-500">Fine-tune custom palettes, gold accents, luxurious serif typefaces, typography size magnification, and cushion density levels.</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="p-3 bg-white rounded-xl border border-gray-100 flex items-center justify-between shadow-sm">
                            <div>
                              <label className="block text-[10px] font-bold uppercase text-gray-500">Primary Brand Gold</label>
                              <span className="text-[9px] text-gray-400 font-mono">{t.primaryGold}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input
                                type="color"
                                value={t.primaryGold}
                                onChange={(e) => updateTheme('primaryGold', e.target.value)}
                                className="w-8 h-8 rounded-full border border-gray-200 cursor-pointer overflow-hidden outline-none bg-transparent"
                              />
                              <input
                                type="text"
                                value={t.primaryGold}
                                onChange={(e) => updateTheme('primaryGold', e.target.value)}
                                className="w-16 px-1.5 py-0.5 text-xs bg-neutral-100 border text-center font-mono rounded text-luxury-text"
                              />
                            </div>
                          </div>

                          <div className="p-3 bg-white rounded-xl border border-gray-100 flex items-center justify-between shadow-sm">
                            <div>
                              <label className="block text-[10px] font-bold uppercase text-gray-500">Accent Brilliance Gold</label>
                              <span className="text-[9px] text-gray-400 font-mono">{t.accentGold}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input
                                type="color"
                                value={t.accentGold}
                                onChange={(e) => updateTheme('accentGold', e.target.value)}
                                className="w-8 h-8 rounded-full border border-gray-200 cursor-pointer overflow-hidden outline-none bg-transparent"
                              />
                              <input
                                type="text"
                                value={t.accentGold}
                                onChange={(e) => updateTheme('accentGold', e.target.value)}
                                className="w-16 px-1.5 py-0.5 text-xs bg-neutral-100 border text-center font-mono rounded text-luxury-text"
                              />
                            </div>
                          </div>

                          <div className="p-3 bg-white rounded-xl border border-gray-100 flex items-center justify-between shadow-sm">
                            <div>
                              <label className="block text-[10px] font-bold uppercase text-gray-500">Luxury Light Background</label>
                              <span className="text-[9px] text-gray-400 font-mono">{t.bgLight}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input
                                type="color"
                                value={t.bgLight}
                                onChange={(e) => updateTheme('bgLight', e.target.value)}
                                className="w-8 h-8 rounded-full border border-gray-200 cursor-pointer overflow-hidden outline-none bg-transparent"
                              />
                              <input
                                type="text"
                                value={t.bgLight}
                                onChange={(e) => updateTheme('bgLight', e.target.value)}
                                className="w-16 px-1.5 py-0.5 text-xs bg-neutral-100 border text-center font-mono rounded text-luxury-text"
                              />
                            </div>
                          </div>

                          <div className="p-3 bg-white rounded-xl border border-gray-100 flex items-center justify-between shadow-sm">
                            <div>
                              <label className="block text-[10px] font-bold uppercase text-gray-500">Bespoke Dark Backdrop</label>
                              <span className="text-[9px] text-gray-400 font-mono">{t.bgDark}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input
                                type="color"
                                value={t.bgDark}
                                onChange={(e) => updateTheme('bgDark', e.target.value)}
                                className="w-8 h-8 rounded-full border border-gray-200 cursor-pointer overflow-hidden outline-none bg-transparent"
                              />
                              <input
                                type="text"
                                value={t.bgDark}
                                onChange={(e) => updateTheme('bgDark', e.target.value)}
                                className="w-16 px-1.5 py-0.5 text-xs bg-neutral-100 border text-center font-mono rounded text-luxury-text"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-primary-gold/10 pt-4 text-left">
                          <div>
                            <label className="block text-[10px] font-btn font-bold uppercase text-gray-700 tracking-wider mb-1">Display Headings Serif Typeface</label>
                            <select
                              value={t.fontFamilySerif}
                              onChange={(e) => updateTheme('fontFamilySerif', e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-primary-gold/20 focus:outline-[#C5A880] rounded-xl text-xs text-luxury-text cursor-pointer"
                            >
                              <option value="Playfair Display">Playfair Display (Default Roman)</option>
                              <option value="Cinzel">Cinzel (Imperial Sculptural Style)</option>
                              <option value="Cormorant Garamond">Cormorant Garamond (Graceful Editorial)</option>
                              <option value="Didot">Didot (High-End Fashion Editorial)</option>
                              <option value="Georgia">Georgia (Subdued Editorial Sans)</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[10px] font-btn font-bold uppercase text-gray-700 tracking-wider mb-1">Secondary Sans Typeface</label>
                            <select
                              value={t.fontFamilySans}
                              onChange={(e) => updateTheme('fontFamilySans', e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-primary-gold/20 focus:outline-[#C5A880] rounded-xl text-xs text-luxury-text cursor-pointer"
                            >
                              <option value="Poppins">Poppins (Warm Modern geometric)</option>
                              <option value="Inter">Inter (Swiss Premium Universal)</option>
                              <option value="Montserrat">Montserrat (Classic Clean Structure)</option>
                              <option value="Lato">Lato (Svelte elegant curves)</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[10px] font-btn font-bold uppercase text-gray-700 tracking-wider mb-1">Global Font Sizing Scale ({t.fontSizeScale}x)</label>
                            <div className="flex items-center space-x-3 bg-white border border-primary-gold/20 rounded-xl p-2 h-[38px]">
                              <input
                                type="range"
                                min="0.8"
                                max="1.3"
                                step="0.05"
                                value={t.fontSizeScale}
                                onChange={(e) => updateTheme('fontSizeScale', parseFloat(e.target.value))}
                                className="flex-1 accent-primary-gold cursor-pointer"
                              />
                              <span className="w-10 text-center font-bold font-mono text-primary-gold text-[10px]">{(t.fontSizeScale * 100).toFixed(0)}%</span>
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] font-btn font-bold uppercase text-gray-700 tracking-wider mb-1">Page Sections Spacing Cushion</label>
                            <select
                              value={t.sectionPadding}
                              onChange={(e) => updateTheme('sectionPadding', e.target.value as any)}
                              className="w-full px-3 py-2 bg-white border border-primary-gold/20 focus:outline-[#C5A880] rounded-xl text-xs text-luxury-text cursor-pointer"
                            >
                              <option value="small">Small (Compact dense spacing)</option>
                              <option value="medium">Medium (Balanced standard layout)</option>
                              <option value="large">Large (Bespoke premium negative space)</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* TAB: SECTIONS ORDER / LAYOUT */}
                  {activeTab === 'layout' && (() => {
                    const defaultSections = [
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
                    ];
                    const list = [...(config.sections || defaultSections)].sort((a, b) => a.order - b.order);
                    return (
                      <div className="space-y-4 animate-fade-in text-luxury-text text-xs text-left">
                        <div className="bg-primary-gold/5 p-4 rounded-2xl border border-primary-gold/10 font-sans">
                          <h4 className="font-serif-luxury font-bold text-sm text-primary-gold mb-1">Page Section Order &amp; Show/Hide Controls</h4>
                          <p className="text-[11px] text-gray-500">Take control of your homepage layout! Click Up/Down arrows to shift slots, or toggle the eye icons to instantly mount/unmount parts from your live audience.</p>
                        </div>

                        <div className="bg-white rounded-2xl border border-primary-gold/15 divide-y divide-gray-100 overflow-hidden shadow-sm">
                          {list.map((sec, sIdx) => (
                            <div key={sec.id} className="p-3 flex items-center justify-between transition-all hover:bg-[#FFFDF8]/60 text-left">
                              <div className="flex items-center space-x-3">
                                <span className="font-mono text-xs text-gray-400 font-bold w-5 text-right">{sIdx + 1}.</span>
                                <button
                                  type="button"
                                  onClick={() => updateSectionToggle(sec.id, 'visible', !sec.visible)}
                                  className="p-1 cursor-pointer transition-colors text-gray-400 hover:text-primary-gold bg-transparent border-0"
                                  title={sec.visible ? "Hide section from homepage" : "Show section on homepage"}
                                >
                                  {sec.visible ? <Eye size={16} className="text-primary-gold" /> : <EyeOff size={16} className="text-gray-300" />}
                                </button>
                                <div className="flex flex-col text-left">
                                  <span className={`font-serif-luxury text-xs font-bold leading-tight ${sec.visible ? 'text-luxury-text' : 'text-gray-400 line-through'}`}>{sec.name}</span>
                                  <span className="text-[9px] text-primary-gold/75 tracking-wider uppercase font-semibold font-mono mt-0.5">id: {sec.id}</span>
                                </div>
                              </div>

                              <div className="flex items-center space-x-2">
                                <button
                                  type="button"
                                  onClick={() => moveSection(sec.id, 'up')}
                                  disabled={sIdx === 0}
                                  className="p-1 bg-neutral-50 hover:bg-neutral-100 text-gray-500 hover:text-primary-gold border border-gray-200 rounded disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer"
                                  title="Shift Section Up"
                                >
                                  <ArrowUp size={13} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => moveSection(sec.id, 'down')}
                                  disabled={sIdx === list.length - 1}
                                  className="p-1 bg-neutral-50 hover:bg-neutral-100 text-gray-500 hover:text-primary-gold border border-gray-200 rounded disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer"
                                  title="Shift Section Down"
                                >
                                  <ArrowDown size={13} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}

                  {/* TAB: MENU LINKS */}
                  {activeTab === 'menu' && (() => {
                    const defaultMenu = [
                      { id: 'home', label: 'Home', visible: true },
                      { id: 'about', label: 'About', visible: true },
                      { id: 'services', label: 'Services', visible: true },
                      { id: 'gallery', label: 'Gallery', visible: true },
                      { id: 'testimonials', label: 'Reviews', visible: true },
                      { id: 'faq', label: 'FAQ', visible: true },
                      { id: 'contact', label: 'Contact', visible: true }
                    ];
                    const list = config.menuItems || defaultMenu;
                    return (
                      <div className="space-y-4 animate-fade-in text-luxury-text text-xs text-left">
                        <div className="bg-primary-gold/5 p-4 rounded-2xl border border-primary-gold/10 font-sans">
                          <h4 className="font-serif-luxury font-bold text-sm text-primary-gold mb-1">Header Navigation Menu Link Manager</h4>
                          <p className="text-[11px] text-gray-500">Edit navigation labels shown in your web header bar, or toggle their visibility links globally.</p>
                        </div>

                        <div className="bg-white rounded-2xl border border-primary-gold/15 divide-y divide-gray-100 overflow-hidden shadow-sm">
                          {list.map((m) => (
                            <div key={m.id} className="p-3 flex items-center justify-between text-left">
                              <div className="flex items-center space-x-3 flex-1">
                                <button
                                  type="button"
                                  onClick={() => updateMenuItem(m.id, 'visible', !m.visible)}
                                  className="p-1 cursor-pointer transition-colors border-0 bg-transparent"
                                >
                                  {m.visible ? <Eye size={16} className="text-primary-gold" /> : <EyeOff size={16} className="text-gray-300" />}
                                </button>
                                <div className="flex-1 max-w-[200px] text-left">
                                  <input
                                    type="text"
                                    value={m.label}
                                    onChange={(e) => updateMenuItem(m.id, 'label', e.target.value)}
                                    className="w-full px-2.5 py-1 bg-neutral-50 focus:bg-white border text-luxury-text rounded text-xs font-serif-luxury font-bold focus:outline-[#C5A880]"
                                    placeholder="Nav Link Title"
                                  />
                                </div>
                              </div>
                              <span className="font-mono text-[9px] uppercase tracking-wider text-gray-400">Section ID: {m.id}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}

                  {/* TAB: FOOTER CONFIG */}
                  {activeTab === 'footer' && (() => {
                    const foot = config.footerContent || {
                      description: 'गोरखपुर का सबसे शानदार और भरोसेमंद लक्ज़री मेकअप स्टूडियो और ब्यूटी पार्लर। Experience luxurious beauty, hair care, and professional bridal services curated by Menka Singh.',
                      copyrightText: '© 2026 Anika Makeover Salon. All Rights Reserved. Crafted for elite luxury bridal results in Gorakhpur.',
                      usefulLinksTitle: 'Useful Directory',
                      quickBookTitle: 'Online Reservations'
                    };
                    return (
                      <div className="space-y-4 animate-fade-in text-luxury-text text-xs text-left">
                        <div className="bg-primary-gold/5 p-4 rounded-2xl border border-primary-gold/10 font-sans">
                          <h4 className="font-serif-luxury font-bold text-sm text-primary-gold mb-1">Footer Configuration</h4>
                          <p className="text-[11px] text-gray-500">Edit standard copyrights, title columns, and translation texts displayed at the very base fold of your website pages.</p>
                        </div>

                        <div>
                          <label className="block text-[10px] font-btn font-bold uppercase text-gray-700 tracking-wider mb-1">Footer Brand Subtitle / Hindi Description Text</label>
                          <textarea
                            value={foot.description}
                            onChange={(e) => updateFooterContent('description', e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 bg-white border border-primary-gold/20 focus:outline-[#C5A880] rounded-xl font-sans text-xs resize-none text-luxury-text"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-btn font-bold uppercase text-gray-700 tracking-wider mb-1">Useful Directory Subtitle</label>
                            <input
                              type="text"
                              value={foot.usefulLinksTitle}
                              onChange={(e) => updateFooterContent('usefulLinksTitle', e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-primary-gold/20 focus:outline-[#C5A880] rounded-xl font-sans text-xs text-luxury-text"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-btn font-bold uppercase text-gray-700 tracking-wider mb-1">Quick Reservations Subtitle</label>
                            <input
                              type="text"
                              value={foot.quickBookTitle}
                              onChange={(e) => updateFooterContent('quickBookTitle', e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-primary-gold/20 focus:outline-[#C5A880] rounded-xl font-sans text-xs text-luxury-text"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-btn font-bold uppercase text-gray-700 tracking-wider mb-1">Footer Copyright Line</label>
                          <input
                            type="text"
                            value={foot.copyrightText}
                            onChange={(e) => updateFooterContent('copyrightText', e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-primary-gold/20 focus:outline-[#C5A880] rounded-xl font-sans text-xs text-luxury-text"
                          />
                        </div>
                      </div>
                    );
                  })()}

                </div>

                {/* Footer Save & Resets Column */}
                <div className="p-4 sm:p-6 border-t border-primary-gold/10 bg-neutral-900 flex flex-col sm:flex-row gap-3.5 items-center justify-between shrink-0">
                  <button
                    type="button"
                    onClick={handleResetDefaults}
                    className="w-full sm:w-auto px-5 py-2.5 border border-red-500/30 hover:border-red-500 text-red-500 hover:bg-red-500/5 font-btn text-[11px] uppercase font-bold rounded-lg flex items-center justify-center space-x-1.5 cursor-pointer transition-all"
                  >
                    <RotateCcw size={14} />
                    <span>Reset Defaults</span>
                  </button>

                  <div className="flex w-full sm:w-auto items-center gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 sm:flex-none px-5 py-2.5 border border-white/10 hover:border-white/30 text-neutral-400 hover:text-white font-btn text-[11px] uppercase font-bold rounded-lg cursor-pointer"
                    >
                      Discard
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveAll}
                      className="flex-1 sm:flex-none px-6 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#B76E79] hover:brightness-110 text-white font-btn text-[11px] uppercase font-bold rounded-lg flex items-center justify-center space-x-1.5 shadow-lg cursor-pointer transition-all"
                    >
                      <Save size={14} />
                      <span>Save Live Changes</span>
                    </button>
                  </div>
                </div>
              </>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
