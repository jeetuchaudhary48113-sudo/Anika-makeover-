import React, { useState, useRef, useEffect } from 'react';
import { X, Crop, Move, Sliders, Check, Maximize2 } from 'lucide-react';

interface ImageCropperModalProps {
  file: File;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (editedFile: File) => void;
}

export default function ImageCropperModal({ file, isOpen, onClose, onConfirm }: ImageCropperModalProps) {
  const [imgUrl, setImgUrl] = useState<string>('');
  const [cropRatio, setCropRatio] = useState<string>('free'); // 'free', '1:1', '16:9', '3:1'
  const [zoom, setZoom] = useState<number>(100); // 50 to 200%
  const [resizeWidth, setResizeWidth] = useState<number>(800); // Target pixel width
  const [aspectError, setAspectError] = useState<string>('');
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImgUrl(url);
    
    // Set default target width based on image type or typical use cases
    if (file.name.includes('banner') || file.name.includes('slide')) {
      setResizeWidth(1200);
    } else {
      setResizeWidth(800);
    }

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  const handleApply = () => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // We calculate crop offsets and widths based on Selected Ratio
    let sourceX = 0;
    let sourceY = 0;
    let sourceWidth = img.naturalWidth;
    let sourceHeight = img.naturalHeight;

    // Apply crops based on ratio preset
    if (cropRatio === '1:1') {
      const size = Math.min(sourceWidth, sourceHeight);
      sourceX = (sourceWidth - size) / 2;
      sourceY = (sourceHeight - size) / 2;
      sourceWidth = size;
      sourceHeight = size;
    } else if (cropRatio === '16:9') {
      let targetHeight = (sourceWidth * 9) / 16;
      if (targetHeight <= sourceHeight) {
        sourceY = (sourceHeight - targetHeight) / 2;
        sourceHeight = targetHeight;
      } else {
        let targetWidth = (sourceHeight * 16) / 9;
        sourceX = (sourceWidth - targetWidth) / 2;
        sourceWidth = targetWidth;
      }
    } else if (cropRatio === '3:1') {
      let targetHeight = sourceWidth / 3;
      if (targetHeight <= sourceHeight) {
        sourceY = (sourceHeight - targetHeight) / 2;
        sourceHeight = targetHeight;
      } else {
        let targetWidth = sourceHeight * 3;
        sourceX = (sourceWidth - targetWidth) / 2;
        sourceWidth = targetWidth;
      }
    }

    // Apply Zoom factor (crop window zoom in or out)
    if (zoom !== 100) {
      const zoomFactor = 100 / zoom;
      const zoomWidth = sourceWidth * zoomFactor;
      const zoomHeight = sourceHeight * zoomFactor;
      
      // Keep inside bounds
      sourceX = Math.max(0, sourceX + (sourceWidth - zoomWidth) / 2);
      sourceY = Math.max(0, sourceY + (sourceHeight - zoomHeight) / 2);
      sourceWidth = Math.min(img.naturalWidth - sourceX, zoomWidth);
      sourceHeight = Math.min(img.naturalHeight - sourceY, zoomHeight);
    }

    // Calculate dynamic scaling for resizing
    canvas.width = resizeWidth;
    canvas.height = Math.round((sourceHeight / sourceWidth) * resizeWidth);

    // Render cropped + resized image onto the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, canvas.width, canvas.height);

    // Extract file blob
    canvas.toBlob((blob) => {
      if (blob) {
        const editedFile = new File([blob], file.name, {
          type: 'image/jpeg',
          lastModified: Date.now(),
        });
        onConfirm(editedFile);
      }
    }, 'image/jpeg', 0.90);
  };

  if (!isOpen) return null;

  return (
    <div id="image-editor-modal" className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 font-sans animate-fade-in">
      <div className="bg-[#FFFDF8] rounded-3xl p-6 max-w-lg w-full text-luxury-text shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto border border-primary-gold/20 flex flex-col relative">
        
        {/* Header indicator */}
        <div className="flex justify-between items-center pb-3 border-b border-gray-100 shrink-0">
          <div className="flex items-center space-x-2">
            <Crop size={20} className="text-primary-gold" />
            <h3 className="font-serif-luxury text-lg font-bold">Crop &amp; Resize Studio</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 text-gray-500 cursor-pointer">
            <X size={18} />
          </button>
        </div>

        {/* Viewport content */}
        <div className="space-y-4 flex-1">
          {imgUrl && (
            <div className="relative bg-neutral-900 rounded-2xl overflow-hidden aspect-video flex items-center justify-center border border-neutral-800">
              <img
                ref={imageRef}
                src={imgUrl}
                alt="Source Editor view"
                className="max-h-[300px] object-contain select-none"
              />
              <div className="absolute inset-x-0 bottom-2 text-center pointer-events-none select-none">
                <span className="bg-black/70 text-[9px] text-gray-300 px-2 py-1 rounded font-mono uppercase tracking-wider">
                  Source: {file.name}
                </span>
              </div>
            </div>
          )}

          {/* Sizing & Crop ratios configurations */}
          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-gray-600">Select Crop Aspect-Ratio:</span>
              <span className="font-mono text-primary-gold text-[10px] font-bold uppercase">{cropRatio}</span>
            </div>
            
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: 'Free Aspect', id: 'free' },
                { label: '1:1 Square', id: '1:1' },
                { label: '16:9 Landscape', id: '16:9' },
                { label: '3:1 Banner', id: '3:1' }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setCropRatio(opt.id)}
                  className={`py-2 text-[10px] uppercase font-bold rounded-xl border tracking-wide transition-all ${
                    cropRatio === opt.id
                      ? 'border-primary-gold text-primary-gold bg-primary-gold/5 font-bold shadow-sm'
                      : 'border-transparent text-gray-400 bg-neutral-50 hover:text-gray-600'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Scale Resizer details */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-gray-600">Zoom Window viewport:</span>
                <span className="font-mono text-gray-500 font-bold">{zoom}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="200"
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full accent-primary-gold cursor-pointer"
              />
            </div>

            {/* Resize details */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-gray-600">Output Dimension Resizing:</span>
                <span className="font-mono text-gray-500 font-bold">{resizeWidth}px (Width)</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[400, 800, 1200].map(w => (
                  <button
                    key={w}
                    onClick={() => setResizeWidth(w)}
                    className={`py-1.5 text-[10px] rounded-xl border tracking-wide transition-all font-mono font-bold ${
                      resizeWidth === w
                        ? 'border-[#a15a64] text-[#a15a64] bg-[#a15a64]/5 shadow-sm'
                        : 'border-transparent text-gray-400 bg-neutral-50 hover:text-gray-600'
                    }`}
                  >
                    {w === 400 ? 'Small (400px)' : w === 800 ? 'Medium (800px)' : 'HDR Large (1200px)'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Hidden internal rendering canvas */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Action Button footer */}
        <div className="flex gap-2 shrink-0 pt-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="flex-1 py-3 text-xs uppercase tracking-wider font-btn border border-gray-200 text-gray-500 hover:bg-neutral-50 rounded-xl"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="flex-1 py-3 text-xs uppercase tracking-wider font-btn font-bold bg-gradient-to-r from-primary-gold to-[#a15a64] text-white hover:opacity-90 rounded-xl flex items-center justify-center gap-1.5 shadow"
          >
            <Check size={14} />
            <span>Apply Crop &amp; Upload</span>
          </button>
        </div>
      </div>
    </div>
  );
}
