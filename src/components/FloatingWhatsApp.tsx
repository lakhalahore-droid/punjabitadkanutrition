import React from 'react';
import { MessageCircle } from 'lucide-react';

export const FloatingWhatsApp: React.FC = () => {
  return (
    <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40">
      <a
        href="https://wa.me/918591385213?text=Hello%20Punjabi%20Tadka%20Nutrition,%20I%20have%20an%20inquiry%20regarding%20supplements"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="glass-pill px-4 py-3 sm:px-5 sm:py-3.5 rounded-full shadow-2xl flex items-center gap-2.5 hover:scale-105 active:scale-95 transition-all duration-300 group border border-white/80"
        style={{
          background: 'rgba(255, 255, 255, 0.75)',
          boxShadow: '0 12px 30px -5px rgba(16, 185, 129, 0.3), inset 0 1px 1.5px rgba(255, 255, 255, 1)',
        }}
      >
        <span className="relative flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500" />
        </span>
        
        <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-sm group-hover:bg-emerald-600 transition-colors">
          <MessageCircle className="w-5 h-5 fill-current" />
        </div>

        <div className="text-left hidden xs:block">
          <div className="text-[10px] uppercase font-bold tracking-wider text-emerald-700">Chat with Owner</div>
          <div className="text-xs font-black text-slate-800">+91 85913 85213</div>
        </div>
      </a>
    </div>
  );
};
