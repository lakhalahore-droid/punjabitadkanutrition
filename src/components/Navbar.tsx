import React, { useState } from 'react';
import { MessageCircle, Phone, Menu, X, Lock } from 'lucide-react';

interface NavbarProps {
  onCategorySelect?: (category: string) => void;
  onOpenAdmin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAdmin }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-3 z-40 w-full max-w-6xl mx-auto px-4 sm:px-6">
      <nav className="glass-pill rounded-full px-5 py-3 flex items-center justify-between transition-all duration-300">
        {/* Zone 1: Single text element wordmark */}
        <a 
          href="#top" 
          className="text-lg md:text-xl font-extrabold tracking-tight font-display text-slate-900 flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-orange-500 rounded-lg outline-none"
        >
          <span className="text-orange-500">Punjabi Tadka</span>
          <span className="text-slate-800 font-semibold text-base md:text-lg">Nutrition</span>
        </a>

        {/* Zone 2: 4-5 Clean text navigation links */}
        <div className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-700">
          <a 
            href="#products" 
            className="hover:text-orange-600 transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-orange-500 hover:after:w-full after:transition-all"
          >
            Products
          </a>
          <a 
            href="#categories" 
            className="hover:text-orange-600 transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-orange-500 hover:after:w-full after:transition-all"
          >
            Categories
          </a>
          <a 
            href="#why-us" 
            className="hover:text-orange-600 transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-orange-500 hover:after:w-full after:transition-all"
          >
            Why Choose Us
          </a>
          <a 
            href="#testimonials" 
            className="hover:text-orange-600 transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-orange-500 hover:after:w-full after:transition-all"
          >
            Reviews
          </a>
          <a 
            href="#visit-us" 
            className="hover:text-orange-600 transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-orange-500 hover:after:w-full after:transition-all"
          >
            Visit Store
          </a>
        </div>

        {/* Zone 3: 1-2 Primary actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (onOpenAdmin) onOpenAdmin();
              else window.location.hash = '#admin';
            }}
            className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-orange-600 glass-btn-secondary rounded-full transition-colors"
            title="Owner Portal / Admin Login"
          >
            <Lock className="w-3 h-3 text-orange-600" />
            <span>Owner</span>
          </button>

          <a
            href="tel:+918591385213"
            aria-label="Call Store"
            className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 glass-btn-secondary rounded-full"
          >
            <Phone className="w-3.5 h-3.5 text-orange-500" />
            <span>Call Store</span>
          </a>

          <a
            href="https://wa.me/918591385213"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-full glass-btn-primary whitespace-nowrap"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-current" />
            <span>WhatsApp</span>
          </a>

          {/* Mobile hamburger toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-full text-slate-700 hover:bg-white/40 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer (Glass) */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 glass-panel p-4 shadow-xl flex flex-col gap-3 animate-in fade-in zoom-in-95 duration-200">
          <a
            href="#products"
            onClick={() => setMobileMenuOpen(false)}
            className="px-3 py-2 text-sm font-semibold text-slate-800 rounded-xl hover:bg-white/60 transition-colors"
          >
            Explore Products
          </a>
          <a
            href="#categories"
            onClick={() => setMobileMenuOpen(false)}
            className="px-3 py-2 text-sm font-semibold text-slate-800 rounded-xl hover:bg-white/60 transition-colors"
          >
            Categories
          </a>
          <a
            href="#why-us"
            onClick={() => setMobileMenuOpen(false)}
            className="px-3 py-2 text-sm font-semibold text-slate-800 rounded-xl hover:bg-white/60 transition-colors"
          >
            Why Choose Us (Authenticity & GST)
          </a>
          <a
            href="#testimonials"
            onClick={() => setMobileMenuOpen(false)}
            className="px-3 py-2 text-sm font-semibold text-slate-800 rounded-xl hover:bg-white/60 transition-colors"
          >
            Customer Reviews
          </a>
          <a
            href="#visit-us"
            onClick={() => setMobileMenuOpen(false)}
            className="px-3 py-2 text-sm font-semibold text-slate-800 rounded-xl hover:bg-white/60 transition-colors"
          >
            Visit Store in Firozpur
          </a>

          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              if (onOpenAdmin) onOpenAdmin();
              else window.location.hash = '#admin';
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-orange-700 bg-orange-50 hover:bg-orange-100 transition-colors"
          >
            <Lock className="w-3.5 h-3.5 text-orange-600" />
            <span>Owner Portal / Admin Login</span>
          </button>

          <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
            <span className="text-xs text-slate-500">Need Guidance?</span>
            <a
              href="tel:+918591385213"
              className="text-xs font-bold text-orange-600 flex items-center gap-1"
            >
              <Phone className="w-3 h-3" />
              +91 85913 85213
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
