import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Sparkles } from 'lucide-react';
import { GalleryItem } from '../types';

interface GalleryLightboxProps {
  items: GalleryItem[];
}

export default function GalleryLightbox({ items }: GalleryLightboxProps) {
  const [activeCategory, setActiveCategory] = useState<'All' | 'Bridal Makeup' | 'Hair Transformations' | 'Party Looks' | 'Beauty Treatments'>('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Grouped logic matching filter choice
  const filteredItems = items.filter(
    (item) => activeCategory === 'All' || item.category === activeCategory
  );

  const openLightbox = (imageIndexInFiltered: number) => {
    setLightboxIndex(imageIndexInFiltered);
    setZoomLevel(1);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
    setZoomLevel(1);
  };

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filteredItems.length);
      setZoomLevel(1);
    }
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + filteredItems.length) % filteredItems.length);
      setZoomLevel(1);
    }
  };

  const handleZoom = (e: React.MouseEvent, factor: number) => {
    e.stopPropagation();
    setZoomLevel(prev => Math.max(1, Math.min(3, prev + factor)));
  };

  return (
    <div className="w-full">
      {/* Category Tab Selector */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10" id="gallery-categories-tab">
        {(['All', 'Bridal Makeup', 'Hair Transformations', 'Party Looks', 'Beauty Treatments'] as const).map(
          (cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 text-[11px] sm:text-xs font-btn font-bold rounded-full uppercase tracking-widest transition-all duration-300 pointer-events-auto border cursor-pointer ${
                activeCategory === cat
                  ? 'bg-primary-gold border-primary-gold text-white shadow-md shadow-primary-gold/15'
                  : 'bg-white/90 border-primary-gold/10 text-gray-700 hover:border-primary-gold/30'
              }`}
            >
              {cat}
            </button>
          )
        )}
      </div>

      {/* Grid Display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" id="gallery-grid">
        {filteredItems.map((item, index) => (
          <div
            key={item.id}
            onClick={() => openLightbox(index)}
            className="group relative cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-primary-gold/5"
          >
            {/* Aspect box ratios based on category */}
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-100">
              <img
                src={item.image}
                alt={item.title}
                referrerPolicy="no-referrer"
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {/* Glossy overlay with golden slide icons */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/15 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-5">
                <span className="text-[10px] uppercase font-btn tracking-widest text-accent-gold flex items-center space-x-1 mb-1 font-bold">
                  <Sparkles size={10} />
                  <span>{item.category}</span>
                </span>
                <h5 className="font-serif-luxury font-bold text-white text-base leading-tight tracking-wide">
                  {item.title}
                </h5>
                <span className="text-white/60 font-sans text-[11px] mt-1.5 flex items-center space-x-1 select-none">
                  <span>✦ View Luxury HD Zoom</span>
                </span>
              </div>
            </div>
          </div>
        ))}
        {filteredItems.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-400 font-sans">
            No portfolio images loaded in this category yet.
          </div>
        )}
      </div>

      {/* HD Lightbox Mode */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in" id="gallery-lightbox">
          {/* Backdrop Closer */}
          <div onClick={closeLightbox} className="absolute inset-0 cursor-pointer" />

          {/* Core Frame of Lightbox */}
          <div className="relative w-full max-w-5xl aspect-[3/4] max-h-[85vh] flex items-center justify-center select-none bg-neutral-950/30 rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
            
            {/* Interactive Image Display */}
            <div className="relative h-full w-full flex items-center justify-center p-2">
              <img
                src={filteredItems[lightboxIndex].image}
                alt={filteredItems[lightboxIndex].title}
                referrerPolicy="no-referrer"
                style={{ transform: `scale(${zoomLevel})` }}
                className="max-w-full max-h-[75vh] object-contain rounded-xl transition-all duration-300 ease-out"
              />
            </div>

            {/* Header Description Label */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10 text-white">
              <span className="px-3.5 py-1.5 bg-black/50 backdrop-blur-md rounded-full text-xs font-serif-luxury tracking-wide border border-white/10 uppercase">
                {filteredItems[lightboxIndex].category} • {filteredItems[lightboxIndex].title}
              </span>
              
              <div className="flex items-center space-x-2">
                {/* Zoom controls */}
                <button
                  type="button"
                  onClick={(e) => handleZoom(e, 0.25)}
                  disabled={zoomLevel >= 3}
                  className="p-2 bg-black/50 hover:bg-black/75 rounded-full transition-colors border border-white/10 cursor-pointer disabled:opacity-40"
                  title="Zoom In"
                >
                  <ZoomIn size={16} />
                </button>
                <button
                  type="button"
                  onClick={(e) => handleZoom(e, -0.25)}
                  disabled={zoomLevel <= 1}
                  className="p-2 bg-black/50 hover:bg-black/75 rounded-full transition-colors border border-white/10 cursor-pointer disabled:opacity-40"
                  title="Zoom Out"
                >
                  <ZoomOut size={16} />
                </button>
                <button
                  type="button"
                  onClick={closeLightbox}
                  className="p-2 bg-black/50 hover:bg-[#B76E79]/85 rounded-full transition-colors border border-white/10 cursor-pointer"
                  title="Close Gallery"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Carousel Side Controls */}
            <button
              type="button"
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/75 text-white rounded-full transition-color border border-white/10 hover:border-accent-gold cursor-pointer"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/75 text-white rounded-full transition-color border border-white/10 hover:border-accent-gold cursor-pointer"
            >
              <ChevronRight size={20} />
            </button>

            {/* Bottom Counter Bar */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-black/55 backdrop-blur-md text-white/80 rounded-full font-sans text-xs border border-white/10">
              {lightboxIndex + 1} / {filteredItems.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
