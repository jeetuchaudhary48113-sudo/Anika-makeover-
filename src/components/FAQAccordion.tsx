import { useState } from 'react';
import { ChevronDown, Sparkles, HelpCircle, MapPin, Calendar, Scissors } from 'lucide-react';
import { FAQItem } from '../types';

interface FAQAccordionProps {
  faqs: FAQItem[];
}

export default function FAQAccordion({ faqs }: FAQAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<'all' | 'appointment' | 'bridal' | 'services' | 'gorakhpur' | 'seo'>('all');

  const filteredFaqs = faqs.filter(faq => {
    if (activeCategory === 'all') return true;
    return faq.category === activeCategory;
  });

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'appointment':
        return <Calendar size={14} className="text-primary-gold" />;
      case 'bridal':
        return <Sparkles size={14} className="text-accent-gold" />;
      case 'services':
        return <Scissors size={14} className="text-primary-gold" />;
      default:
        return <HelpCircle size={14} className="text-gray-400" />;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      {/* Category Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8" id="faq-categories-tab">
        {(['all', 'appointment', 'bridal', 'services', 'gorakhpur', 'seo'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setActiveCategory(cat);
              setOpenId(null);
            }}
            className={`px-4 py-2 text-xs font-btn font-semibold rounded-full uppercase tracking-wider transition-all duration-300 pointer-events-auto border cursor-pointer ${
              activeCategory === cat
                ? 'bg-primary-gold border-primary-gold text-white shadow-md'
                : 'bg-white/80 border-primary-gold/15 text-gray-700 hover:border-primary-gold/40'
            }`}
          >
            {cat === 'all' && 'All Questions'}
            {cat === 'appointment' && 'Appointments'}
            {cat === 'bridal' && 'Bridal Makeup'}
            {cat === 'services' && 'Salon Services'}
            {cat === 'gorakhpur' && 'Our Location'}
            {cat === 'seo' && 'Why Choose Us'}
          </button>
        ))}
      </div>

      {/* Accordion Container */}
      <div className="space-y-4" id="faq-accordion-list">
        {filteredFaqs.map((faq) => {
          const isOpen = openId === faq.id;
          return (
            <div
              key={faq.id}
              className={`p-1 rounded-2xl transition-all duration-300 border ${
                isOpen 
                  ? 'bg-gradient-to-br from-[#FFFDF8] to-[#FFF5F6] border-primary-gold/35 shadow-md' 
                  : 'bg-white/70 border-primary-gold/10 hover:border-primary-gold/25 shadow-sm'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleFaq(faq.id)}
                className="w-full px-5 py-4 flex items-center justify-between text-left focus:outline-none cursor-pointer"
              >
                <div className="flex items-center space-x-3.5 pr-4">
                  <span className="flex-shrink-0 p-1.5 rounded-lg bg-primary-gold/5 border border-primary-gold/10">
                    {getCategoryIcon(faq.category)}
                  </span>
                  <span className="font-serif-luxury font-bold text-sm sm:text-base text-luxury-text tracking-wide leading-snug">
                    {faq.question}
                  </span>
                </div>
                <span
                  className={`flex-shrink-0 p-1 rounded-full border border-gray-100 bg-white shadow-sm transition-transform duration-300 text-primary-gold ${
                    isOpen ? 'rotate-180' : 'rotate-0'
                  }`}
                >
                  <ChevronDown size={16} />
                </span>
              </button>

              {/* Collapsed view content panel */}
              <div
                className={`transition-all duration-500 overflow-hidden ${
                  isOpen ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
                }`}
              >
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-gray-600 font-sans leading-relaxed border-t border-primary-gold/5 mt-1">
                  {faq.answer}
                </div>
              </div>
            </div>
          );
        })}

        {filteredFaqs.length === 0 && (
          <div className="text-center py-8 text-gray-400 font-sans">
            No custom FAQs found in this category.
          </div>
        )}
      </div>
    </div>
  );
}
