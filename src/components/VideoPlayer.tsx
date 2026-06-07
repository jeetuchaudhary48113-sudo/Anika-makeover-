import { useState, useRef } from 'react';
import { Play, X, Volume2, VolumeX, Sparkles, AlertCircle } from 'lucide-react';
import { VideoTestimonial } from '../types';

interface VideoPlayerProps {
  videos: VideoTestimonial[];
}

export default function VideoPlayer({ videos }: VideoPlayerProps) {
  const [activeVideo, setActiveVideo] = useState<VideoTestimonial | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const openVideo = (video: VideoTestimonial) => {
    setActiveVideo(video);
  };

  const closeVideo = () => {
    setActiveVideo(null);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {videos.map((vid) => (
          <div
            key={vid.id}
            onClick={() => openVideo(vid)}
            className="group cursor-pointer bg-white rounded-3xl overflow-hidden border border-primary-gold/10 hover:border-primary-gold/30 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative"
          >
            {/* Thumbnail aspect-video container */}
            <div className="relative aspect-video w-full bg-neutral-900 overflow-hidden">
              <img
                src={vid.thumbnail}
                alt={vid.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {/* Overlay with subtle blur & gold accent */}
              <div className="absolute inset-0 bg-neutral-950/45 group-hover:bg-neutral-950/30 transition-colors duration-300" />
              
              {/* Floating gold category tag */}
              <span className="absolute top-4 left-4 inline-flex items-center space-x-1.5 px-3 py-1 bg-[#FFFDF8]/90 text-primary-gold font-btn font-bold text-[10px] uppercase tracking-wider rounded-full shadow-sm">
                <Sparkles size={10} className="text-accent-gold" />
                <span>{vid.category}</span>
              </span>

              {/* Central Premium Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-gold to-accent-gold rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 active:scale-95 transition-all duration-300 relative">
                  <div className="absolute inset-0 bg-white/20 rounded-full animate-ping opacity-60" />
                  <Play size={24} className="text-white fill-current translate-x-0.5" />
                </div>
              </div>
            </div>

            {/* Title description bar */}
            <div className="p-4 sm:p-5 bg-[#FFFDF8]">
              <h4 className="font-serif-luxury font-bold text-base text-luxury-text line-clamp-1 group-hover:text-primary-gold transition-colors duration-300">
                {vid.title}
              </h4>
              <p className="font-sans text-[11px] text-gray-400 mt-1 uppercase tracking-wider font-semibold">
                Client Testimonial Video • Click to Play
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Cinematic Theater Modal */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" id="video-theater-overlay">
          {/* Backdrop with extreme blur */}
          <div
            onClick={closeVideo}
            className="absolute inset-0 bg-black/85 backdrop-blur-md cursor-pointer"
          />

          {/* Interactive Modal Frame */}
          <div className="relative w-full max-w-4xl bg-black rounded-3xl overflow-hidden border border-accent-gold/25 shadow-2xl overflow-y-auto animate-fade-in">
            {/* Upper Action Bar */}
            <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
              <span className="px-3.5 py-1.5 bg-black/60 backdrop-blur-md rounded-full text-white font-serif-luxury text-xs sm:text-sm font-semibold tracking-wide border border-white/10">
                {activeVideo.title}
              </span>

              <div className="flex items-center space-x-2 pointer-events-auto">
                <button
                  type="button"
                  onClick={toggleMute}
                  className="p-2.5 bg-black/60 hover:bg-black/80 text-white rounded-full transition-color border border-white/10 hover:border-accent-gold cursor-pointer"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
                <button
                  type="button"
                  onClick={closeVideo}
                  className="p-2.5 bg-black/60 hover:bg-black/80 text-white rounded-full transition-color border border-white/10 hover:border-primary-gold cursor-pointer"
                  title="Close Screen"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Main Video Screen */}
            <div className="aspect-video w-full flex items-center justify-center bg-zinc-950 font-sans">
              <video
                ref={videoRef}
                src={activeVideo.videoUrl}
                autoPlay
                controls
                playsInline
                loop
                muted={isMuted}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              >
                Your browser does not support HTML5 video streaming. Here is a direct link:{' '}
                <a href={activeVideo.videoUrl} target="_blank" rel="noreferrer" className="text-primary-gold">
                  Download Link
                </a>
              </video>
            </div>

            {/* Detailed Context Bar */}
            <div className="bg-neutral-900 border-t border-white/5 px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-neutral-300">
              <div className="flex items-center space-x-2.5 text-xs font-sans">
                <AlertCircle size={14} className="text-accent-gold shrink-0" />
                <span>Experience live cinematic results. All cosmetics are authentic & water-tested.</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  closeVideo();
                  // Symmetrical appointment transition
                  const element = document.getElementById('booking-section');
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-5 py-2 bg-primary-gold hover:bg-primary-gold/90 text-white font-btn font-bold uppercase tracking-wider text-[11px] rounded-full transition-all shadow-md hover:shadow-primary-gold/15 cursor-pointer"
              >
                Reserve Look Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
