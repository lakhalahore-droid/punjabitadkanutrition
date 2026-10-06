import React from 'react';
import { MessageCircle, Phone, MapPin, ShieldCheck, Heart, Lock } from 'lucide-react';

interface FooterProps {
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  return (
    <footer className="mt-16 border-t border-slate-200/80 bg-white/40 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10 text-left">
          {/* Brand Col */}
          <div className="md:col-span-2">
            <span className="text-xl font-extrabold font-display tracking-tight text-slate-900 flex items-center gap-1">
              <span className="text-orange-500">Punjabi Tadka</span>
              <span className="text-slate-800">Nutrition</span>
            </span>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-sm leading-relaxed">
              Your Trusted Supplement Store – 100% Authentic Brands with GST Bill. Dedicated to bringing genuine, certified sports nutrition and vitamins to fitness athletes in Firozpur, Punjab.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-500/10 px-3 py-1 rounded-full w-fit">
              <ShieldCheck className="w-4 h-4" />
              <span>Official Importers Only · No Adulteration</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Store Navigation
            </h4>
            <ul className="space-y-2 text-xs font-medium text-slate-600">
              <li>
                <a href="#products" className="hover:text-orange-600 transition-colors">
                  All Supplements
                </a>
              </li>
              <li>
                <a href="#categories" className="hover:text-orange-600 transition-colors">
                  Product Categories
                </a>
              </li>
              <li>
                <a href="#why-us" className="hover:text-orange-600 transition-colors">
                  Why Choose Us (GST & Auth)
                </a>
              </li>
              <li>
                <a href="#testimonials" className="hover:text-orange-600 transition-colors">
                  Google Customer Reviews
                </a>
              </li>
              <li>
                <a href="#visit-us" className="hover:text-orange-600 transition-colors">
                  Store Location & Hours
                </a>
              </li>
              <li className="pt-2 border-t border-slate-200/60">
                <button
                  type="button"
                  onClick={() => {
                    if (onOpenAdmin) onOpenAdmin();
                    else window.location.hash = '#admin';
                  }}
                  className="text-orange-600 hover:text-orange-700 font-bold flex items-center gap-1.5 transition-colors group"
                >
                  <Lock className="w-3.5 h-3.5 text-orange-500 group-hover:scale-110 transition-transform" />
                  <span>Owner Portal / Admin Login</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Direct Inquiries
            </h4>
            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <span>Zira Gate, Guru Ram Das Nagar, Zira Rd, Firozpur, Punjab 152002</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-orange-500 shrink-0" />
                <a href="tel:+918591385213" className="hover:text-orange-600 font-semibold">
                  +91 85913 85213
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <a
                  href="https://wa.me/918591385213"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-700 font-bold text-emerald-700"
                >
                  WhatsApp: +91 85913 85213
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Punjabi Tadka Nutrition. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (onOpenAdmin) onOpenAdmin();
                else window.location.hash = '#admin';
              }}
              className="text-slate-400 hover:text-orange-600 transition-colors flex items-center gap-1"
            >
              <Lock className="w-3 h-3" />
              <span>Owner Portal</span>
            </button>
            <span className="text-slate-300">·</span>
            <p className="flex items-center gap-1">
              Made with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> for athletes in Firozpur
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
