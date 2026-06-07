import { Sparkles, Phone, Mail, MapPin, Instagram, MessageSquare, ChevronRight } from 'lucide-react';
import { ContactInfo } from '../types';

interface FooterProps {
  contact: ContactInfo;
  onTabChange: (tab: string) => void;
  onAdminClick: () => void;
  footerContent?: {
    description: string;
    copyrightText: string;
    usefulLinksTitle: string;
    quickBookTitle: string;
  };
}

export default function Footer({ contact, onTabChange, onAdminClick, footerContent }: FooterProps) {
  const handleNavClick = (target: string) => {
    onTabChange(target);
    const element = document.getElementById(`${target}-section`);
    if (element) {
      const headerOffset = 90;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const defaultDesc = "Experience authentic five-star bridal makeovers, elite haircare, and glowing skin therapies in Gorakhpur. Our certified experts deliver clinical hygiene standards and premium beauty routines designed for self-pampering.";
  const defaultCopyright = "© 2026 Anika Makeover Salon. All Rights Reserved. Created for Luxury beauty care in Gorakhpur, UP.";

  return (
    <footer className="bg-neutral-900 text-neutral-300 font-sans border-t-2 border-accent-gold/20 pt-16 pb-8 relative overflow-hidden" id="contact-footer">
      {/* Subtle gold decoration background overlays */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-primary-gold/5 rounded-full blur-3xl -mr-32 -mt-32" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent-gold/5 rounded-full blur-3xl -ml-32 -mb-32" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Column 1: Short Brand Pitch */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2.5">
              <span className="p-2 bg-gradient-to-br from-primary-gold to-accent-gold rounded-full text-white shadow-md">
                <Sparkles size={14} />
              </span>
              <h3 className="font-serif-luxury font-bold text-white text-base tracking-widest uppercase">
                Anika <span className="font-sub-luxury tracking-wide italic text-primary-gold lowercase">makeover</span>
              </h3>
            </div>
            <p className="text-xs text-neutral-400 font-light leading-relaxed">
              {footerContent?.description || defaultDesc}
            </p>
            <div className="flex items-center space-x-3.5 pt-1.5" id="social-footer-group">
              <a
                href={contact.instagram}
                target="_blank"
                rel="noreferrer"
                referrerPolicy="no-referrer"
                className="p-2 rounded-full bg-neutral-800 hover:bg-gradient-to-tr hover:from-purple-600 hover:to-pink-500 text-neutral-400 hover:text-white transition-all shadow-sm border border-neutral-700 hover:border-transparent cursor-pointer"
                title="Follow Instagram"
              >
                <Instagram size={14} />
              </a>
              <a
                href={`https://wa.me/${contact.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                referrerPolicy="no-referrer"
                className="p-2 rounded-full bg-neutral-800 hover:bg-emerald-600 text-neutral-400 hover:text-white transition-all shadow-sm border border-neutral-700 hover:border-transparent cursor-pointer"
                title="WhatsApp Us"
              >
                <MessageSquare size={14} />
              </a>
            </div>
          </div>

          {/* Column 2: Sitemap Navigation links */}
          <div className="space-y-4">
            <h4 className="font-serif-luxury text-sm font-bold text-white tracking-widest uppercase border-b border-white/5 pb-2">
              {footerContent?.usefulLinksTitle || "Sitemap Links"}
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs font-medium">
              {[
                { label: 'Home Page', target: 'home' },
                { label: 'About Salon', target: 'about' },
                { label: 'Our Services', target: 'services' },
                { label: 'Lookbook', target: 'gallery' },
                { label: 'Review Hub', target: 'testimonials' },
                { label: 'FAQs Desk', target: 'faq' },
                { label: 'Directions', target: 'contact' }
              ].map((lnk) => (
                <button
                  key={lnk.target}
                  onClick={() => handleNavClick(lnk.target)}
                  className="group flex items-center space-x-1 text-neutral-400 hover:text-primary-gold transition-colors text-left py-1 cursor-pointer"
                >
                  <ChevronRight size={12} className="text-accent-gold opacity-30 group-hover:opacity-100 transition-all transform group-hover:translate-x-0.5" />
                  <span>{lnk.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Column 3: Top Hair & Bridal Services */}
          <div className="space-y-4">
            <h4 className="font-serif-luxury text-sm font-bold text-white tracking-widest uppercase border-b border-white/5 pb-2">
              {footerContent?.quickBookTitle || "Our Specialties"}
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400 leading-none">
              {[
                'Bridal Airbrush Makeup',
                'HD Wedding Makeover',
                'Frizz-Free Keratin Treatment',
                'Advanced Hair Coloring & Balayage',
                'Nourishing Deep Hair Spa',
                'Therapeutic Facials & Skin Glowing'
              ].map((item) => (
                <li key={item} className="flex items-center space-x-1">
                  <span className="text-accent-gold mr-1.5">✦</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact & Coordinates */}
          <div className="space-y-4">
            <h4 className="font-serif-luxury text-sm font-bold text-white tracking-widest uppercase border-b border-white/5 pb-2">
              Visit Salon
            </h4>
            <ul className="space-y-3.5 text-xs text-neutral-400">
              <li className="flex items-start space-x-2.5">
                <MapPin size={15} className="text-accent-gold flex-shrink-0 mt-0.5 animate-bounce-slow" />
                <span className="leading-relaxed font-light">{contact.address}</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Phone size={14} className="text-accent-gold flex-shrink-0" />
                <a href={`tel:${contact.phone}`} className="hover:text-primary-gold font-semibold transition-colors">
                  {contact.phoneFormatted}
                </a>
              </li>
              <li className="flex items-center space-x-2.5">
                <Instagram size={14} className="text-accent-gold flex-shrink-0" />
                <a
                  href={contact.instagram}
                  target="_blank"
                  rel="noreferrer"
                  referrerPolicy="no-referrer"
                  className="hover:text-primary-gold transition-colors"
                >
                  {contact.instagramUsername}
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Lower Border Copy block with hidden Portal */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-500 font-light gap-4">
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            <span>{footerContent?.copyrightText || defaultCopyright}</span>
          </div>

          {/* Discreet Admin Portal access button */}
          <div className="flex items-center space-x-3.5">
            <span className="text-neutral-500 uppercase tracking-widest font-btn text-[9px] font-bold">5-Star ⭐ Google Rated</span>
            <span className="text-neutral-700">|</span>
            <button
              onClick={() => {
                // Focus edit command
                const element = document.getElementById('booking-form-card');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
                // We'll hint they can click the Admin Panel link in the footer!
                alert('🔑 Owner Desk: To enter the Admin configuration workspace and customize layout, services, and pictures, click the "Admin Panel" link centered at the very bottom of this footer. Access requires the master administrator passcode.');
              }}
              className="text-neutral-600 hover:text-primary-gold underline underline-offset-2 transition-colors cursor-pointer text-[10px]"
            >
              Staff Portal
            </button>
          </div>
        </div>

        {/* Outer Visual Button Row for Owner Admin Desk Link */}
        <div className="mt-8 pt-4 border-t border-white/5 flex justify-center text-[11px] animate-fade-in">
          <button
            onClick={onAdminClick}
            className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-400 via-primary-gold to-neutral-400 hover:from-primary-gold hover:to-accent-gold transition-all duration-300 font-btn font-extrabold uppercase tracking-[0.2em] cursor-pointer text-[11px] hover:scale-105 active:scale-95 py-2 px-4 rounded-lg bg-neutral-950/10 hover:bg-neutral-950/40 border border-primary-gold/10 hover:border-primary-gold/30 hover:shadow-[0_2px_12px_rgba(197,168,128,0.1)] flex items-center gap-2"
          >
            <span>✦</span>
            <span>Admin Panel</span>
            <span>✦</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
