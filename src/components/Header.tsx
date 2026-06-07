import { useState, useEffect } from 'react';
import { Menu, X, Sparkles, Phone, MessageSquare } from 'lucide-react';
import { ContactInfo } from '../types';

interface HeaderProps {
  contact: ContactInfo;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Header({ contact, activeTab, onTabChange }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Scroll effect to add class
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', target: 'home' },
    { label: 'About', target: 'about' },
    { label: 'Services', target: 'services' },
    { label: 'Gallery', target: 'gallery' },
    { label: 'Reviews', target: 'testimonials' },
    { label: 'FAQ', target: 'faq' },
    { label: 'Contact', target: 'contact' }
  ];

  const handleNavClick = (target: string) => {
    setMobileMenuOpen(false);
    onTabChange(target);

    // Symmetrical navigation hash synchronization
    window.location.hash = target === 'home' ? '' : `#${target}`;
    
    // Smooth scroll to target view
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

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 ${
        isScrolled
          ? 'py-3.5 bg-[#FFFDF8]/90 backdrop-blur-md shadow-md border-b border-primary-gold/10'
          : 'py-6 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center space-x-2.5 cursor-pointer group"
          >
            <span className="p-2 bg-gradient-to-br from-primary-gold to-accent-gold rounded-full text-white shadow-md shadow-primary-gold/15 group-hover:rotate-12 transition-transform duration-305">
              <Sparkles size={16} className="text-[#FFFDF8]" />
            </span>
            <div className="flex flex-col">
              <h1 className="font-serif-luxury font-bold text-base sm:text-lg tracking-widest text-luxury-text uppercase leading-none">
                Anika <span className="font-sub-luxury tracking-wide italic text-primary-gold lowercase">makeover</span>
              </h1>
              <span className="text-[9px] uppercase tracking-widest font-btn text-accent-gold font-bold">Bridal & Hair Studio</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7">
            {navLinks.map((link) => (
              <button
                key={link.target}
                onClick={() => handleNavClick(link.target)}
                className={`text-[11px] font-btn font-bold uppercase tracking-widest transition-colors relative py-1 cursor-pointer hover:text-primary-gold ${
                  activeTab === link.target 
                    ? 'text-primary-gold' 
                    : 'text-gray-700'
                }`}
              >
                <span>{link.label}</span>
                {activeTab === link.target && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-accent-gold rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Call & WhatsApp CTAs */}
          <div className="hidden sm:flex items-center space-x-3">
            {/* Direct Call to Number */}
            <a
              href={`tel:${contact.phone}`}
              className="p-2.5 rounded-full border border-primary-gold/15 bg-[#FFFDF8]/50 text-primary-gold hover:bg-primary-gold hover:text-white transition-all shadow-sm"
              title="Call Salon"
            >
              <Phone size={14} />
            </a>
            {/* Direct Book Button */}
            <button
              onClick={() => handleNavClick('booking')}
              className="px-5 py-2.5 bg-gradient-to-r from-primary-gold to-[#a15a64] text-white font-btn font-bold uppercase tracking-wider text-[10px] rounded-full transition-transform duration-300 hover:scale-[1.03] shadow-md shadow-primary-gold/10 cursor-pointer"
            >
              Book Appointment
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden flex items-center space-x-3.5">
            <a
              href={`tel:${contact.phone}`}
              className="sm:hidden p-2.5 rounded-full border border-primary-gold/15 bg-white text-primary-gold active:bg-primary-gold active:text-white transition-colors"
            >
              <Phone size={13} />
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-primary-gold hover:text-accent-gold cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Sliding Menu Drawer */}
      <div
        className={`lg:hidden fixed inset-x-0 top-[60px] bg-[#FFFDF8] border-b border-primary-gold/15 shadow-xl transition-all duration-300 transform ${
          mobileMenuOpen ? 'translate-y-0 opacity-100 pointer-events-auto' : '-translate-y-6 opacity-0 pointer-events-none'
        }`}
      >
        <div className="px-5 py-6 space-y-4 text-center">
          <div className="grid grid-cols-2 gap-2.5">
            {navLinks.map((link) => (
              <button
                key={link.target}
                onClick={() => handleNavClick(link.target)}
                className={`py-3 bg-neutral-50 rounded-xl text-[11px] font-btn font-bold uppercase tracking-wider border cursor-pointer hover:bg-primary-gold/5 ${
                  activeTab === link.target
                    ? 'border-primary-gold text-primary-gold font-semibold'
                    : 'border-transparent text-gray-700'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-primary-gold/5 flex flex-col gap-2.5">
            {/* Quick CTAs inside menu */}
            <a
              href={`tel:${contact.phone}`}
              className="w-full py-3.5 bg-white border border-primary-gold/20 hover:border-primary-gold text-primary-gold rounded-xl font-btn font-bold uppercase tracking-widest text-[11px] flex items-center justify-center space-x-2"
            >
              <Phone size={13} />
              <span>Call: {contact.phoneFormatted}</span>
            </a>
            <button
              onClick={() => handleNavClick('booking')}
              className="w-full py-4 bg-gradient-to-r from-primary-gold to-[#a15a64] text-white rounded-xl font-btn font-bold uppercase tracking-widest text-[11px] flex items-center justify-center space-x-2 cursor-pointer shadow-md"
            >
              <MessageSquare size={13} />
              <span>Book Appointment Slot</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
