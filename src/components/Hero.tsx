import React from 'react';
import { ArrowDown, MessageCircle, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import heroImg from '../assets/images/punjabi_tadka_storefront_billboard_1791099789547.jpg';

export const Hero: React.FC = () => {
  return (
    <section id="top" className="relative pt-6 sm:pt-10 pb-12 sm:pb-16 max-w-6xl mx-auto px-4 sm:px-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
        {/* Left Column: Headlines & CTAs */}
        <div className="lg:col-span-7 flex flex-col items-start text-left z-10">
          {/* Trust verification pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-pill text-xs font-semibold text-slate-800 mb-5 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Firozpur’s #1 Authentic Supplement Destination</span>
            <span className="text-slate-300">|</span>
            <span className="text-orange-600 font-bold">100% Original</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-display text-slate-900 leading-[1.12] mb-4 text-balance">
            Fuel Your Ambition With <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-500">100% Authentic</span> Nutrition
          </h1>

          <p className="text-base sm:text-lg text-slate-600 font-normal mb-7 max-w-xl leading-relaxed">
            Your Trusted Supplement Store – 100% Authentic Brands with GST Bill. Zero adulteration, expert bodybuilding & fitness guidance directly from the owner in Firozpur.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3.5 w-full sm:w-auto">
            <a
              href="#products"
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl glass-btn-primary font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg"
            >
              <span>Explore Products</span>
              <ArrowDown className="w-4 h-4 animate-bounce" />
            </a>

            <a
              href="https://wa.me/918591385213?text=Hello%20Punjabi%20Tadka%20Nutrition,%20I%20need%20authentic%20supplement%20guidance"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl glass-btn-secondary font-semibold text-sm sm:text-base flex items-center justify-center gap-2 hover:border-orange-400"
            >
              <MessageCircle className="w-5 h-5 text-emerald-600 fill-emerald-500/20" />
              <span>WhatsApp Store</span>
            </a>
          </div>

          {/* Micro trust indicators */}
          <div className="mt-8 pt-6 border-t border-slate-200/60 w-full flex flex-wrap items-center gap-6 text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Official Importer Hologram</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Same-Day Pickup in Firozpur</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-orange-500" />
              <span>Diet & Cycle Guidance</span>
            </div>
          </div>
        </div>

        {/* Right Column: 3D Liquid Glass Supplement Composition */}
        <div className="lg:col-span-5 relative flex items-center justify-center">
          {/* Main 3D Card Vessel */}
          <div className="relative w-full max-w-md glass-panel p-3.5 sm:p-5 shadow-2xl rounded-3xl transform transition-transform duration-500 hover:rotate-1">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-gradient-to-tr from-slate-100 to-white shadow-inner group">
              <img
                src={heroImg}
                alt="Punjabi Tadka Nutrition Storefront and Billboard in Firozpur"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
              
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-orange-300">Zira Road Store & Billboard</span>
                <p className="text-sm font-bold text-white drop-shadow-sm">Punjabi Tadka Nutrition · Firozpur</p>
              </div>
            </div>

            {/* Floating Glass Micro Badge 1 (Top Left) */}
            <div className="absolute -top-4 -left-4 sm:-left-6 glass-pill px-3.5 py-2 rounded-2xl shadow-xl flex items-center gap-2 animate-float-slow">
              <div className="w-7 h-7 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-600">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-[10px] text-slate-500 font-medium">Verified</div>
                <div className="text-xs font-bold text-slate-800">GST Invoice</div>
              </div>
            </div>

            {/* Floating Glass Micro Badge 2 (Bottom Right) */}
            <div className="absolute -bottom-5 -right-3 sm:-right-5 glass-pill px-3.5 py-2.5 rounded-2xl shadow-xl flex items-center gap-2.5 animate-float-alt">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-600 font-bold text-xs">
                5.0★
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-slate-800">73+ Reviews</div>
                <div className="text-[10px] text-slate-500">Google Verified Store</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
