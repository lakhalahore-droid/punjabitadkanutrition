import React, { useState } from 'react';
import { X, MessageCircle, ShieldCheck, CheckCircle2, AlertOctagon, Sparkles, Box } from 'lucide-react';
import { Product } from '../types/product';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onBuyWhatsApp: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onBuyWhatsApp,
}) => {
  if (!product) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const rawImages = product.images && product.images.length > 0 
    ? product.images 
    : ['/placeholder-supplement.svg'];

  const images = rawImages;
  const [failedIndices, setFailedIndices] = useState<Record<number, boolean>>({});

  const handleModalImageError = (index: number) => {
    setFailedIndices((prev) => ({ ...prev, [index]: true }));
  };

  const handleModalImageLoad = (e: React.SyntheticEvent<HTMLImageElement>, index: number) => {
    if (e.currentTarget.naturalWidth <= 1 || e.currentTarget.naturalHeight <= 1) {
      handleModalImageError(index);
    }
  };

  const getValidImgSrc = (index: number) => {
    if (failedIndices[index]) return '/placeholder-supplement.svg';
    return images[index] || '/placeholder-supplement.svg';
  };

  const effectivePrice = product.discountPrice || product.price;
  const hasDiscount = Boolean(product.discountPrice && product.discountPrice < product.price);
  const discountPercent = hasDiscount 
    ? Math.round(((product.price - product.discountPrice!) / product.price) * 100) 
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/45 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl glass-panel p-5 sm:p-7 shadow-2xl rounded-3xl max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-500 hover:text-slate-900 hover:bg-white/60 transition-colors z-10"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Left: Image Gallery */}
          <div className="flex flex-col gap-3">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-b from-slate-50/80 to-white/95 border border-white/80 shadow-inner flex items-center justify-center p-4">
              <img
                key={getValidImgSrc(activeImageIndex)}
                src={getValidImgSrc(activeImageIndex)}
                alt={product.name}
                onError={() => handleModalImageError(activeImageIndex)}
                onLoad={(e) => handleModalImageLoad(e, activeImageIndex)}
                className="w-full h-full object-contain transition-all duration-300 filter drop-shadow-sm"
                referrerPolicy="no-referrer"
              />
              <span className="absolute top-3 left-3 bg-slate-900/85 backdrop-blur-md text-white font-bold text-xs px-2.5 py-1 rounded-full shadow-md">
                Angle {activeImageIndex + 1} of {images.length}
              </span>
            </div>

            {/* Thumbnail selector if multiple images */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 bg-white p-1 flex items-center justify-center ${
                      activeImageIndex === idx ? 'border-orange-500 ring-2 ring-orange-500/20' : 'border-slate-200/80 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={getValidImgSrc(idx)}
                      alt=""
                      onError={() => handleModalImageError(idx)}
                      onLoad={(e) => handleModalImageLoad(e, idx)}
                      className="w-full h-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Importer Authentication Seal */}
            <div className="p-3 rounded-2xl bg-orange-500/5 border border-orange-500/20 flex items-center gap-2.5 text-xs text-orange-800">
              <ShieldCheck className="w-5 h-5 text-orange-600 shrink-0" />
              <span>Includes Official Importer Scratch Barcode & GST Tax Invoice</span>
            </div>
          </div>

          {/* Right: Product Details */}
          <div className="flex flex-col justify-between h-full text-left">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
                <span>{product.brand}</span>
                <span>·</span>
                <span className="text-orange-600">{product.category}</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold font-display text-slate-900 leading-snug">
                {product.name}
              </h2>

              {/* Best Price & Authenticity Guarantee (NO PRICE DISPLAYED) */}
              <div className="mt-4 p-3 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-orange-600 block">
                    Best Price on WhatsApp
                  </span>
                  <span className="text-xs font-extrabold text-slate-800">
                    Direct Store Offer & GST Bill
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full inline-block">
                    ● 100% Genuine
                  </span>
                </div>
              </div>

              {/* Status pill */}
              <div className="mt-3 flex items-center gap-2">
                {product.inStock ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    In Stock (Ready for Dispatch)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 bg-rose-100/80 px-2.5 py-0.5 rounded-full">
                    <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
                    Out of Stock (Pre-order on WhatsApp)
                  </span>
                )}
              </div>

              {/* Key Specs */}
              <div className="mt-5 grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-xl bg-white/60 border border-white/80">
                  <div className="text-[11px] text-slate-400 font-medium">Weight / Size</div>
                  <div className="text-xs font-bold text-slate-800 mt-0.5">{product.sizeWeight}</div>
                </div>

                <div className="p-3 rounded-xl bg-white/60 border border-white/80">
                  <div className="text-[11px] text-slate-400 font-medium">Flavour</div>
                  <div className="text-xs font-bold text-slate-800 mt-0.5">{product.flavour || 'Standard'}</div>
                </div>
              </div>

              {/* Description */}
              <div className="mt-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Product Overview
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {product.description}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 pt-4 border-t border-slate-200/60 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onBuyWhatsApp(product);
                }}
                className="w-full py-3.5 rounded-2xl glass-btn-primary font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>Inquire Price & Order on WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 rounded-xl glass-btn-secondary text-xs font-semibold text-slate-600"
              >
                Continue Browsing Catalog
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
