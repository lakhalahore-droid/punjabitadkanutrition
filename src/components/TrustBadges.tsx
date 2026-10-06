import React from 'react';
import { ShieldCheck, FileText, Award, Star } from 'lucide-react';

export const TrustBadges: React.FC = () => {
  const badges = [
    {
      icon: ShieldCheck,
      title: '100% Authentic Brands',
      subtitle: 'Official Importer Scratch Code & Barcode Verified',
    },
    {
      icon: FileText,
      title: 'GST Bill Provided',
      subtitle: 'Tax Paid Legitimate Invoice for Every Single Order',
    },
    {
      icon: Award,
      title: 'Honest Expert Guidance',
      subtitle: 'Personalized Stacks tailored to your fitness goals',
    },
    {
      icon: Star,
      title: '5.0 ★ Google Rating',
      subtitle: '73+ Verified Customer Reviews in Firozpur',
      highlight: true,
    },
  ];

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 my-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {badges.map((b, idx) => {
          const Icon = b.icon;
          return (
            <div 
              key={idx} 
              className="glass-card p-4 sm:p-5 flex flex-col justify-between group hover:border-orange-500/40"
            >
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="w-9 h-9 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-600 group-hover:scale-110 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300">
                  <Icon className="w-5 h-5" />
                </div>
                {b.highlight && (
                  <span className="text-[11px] font-bold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-full">
                    Top Rated
                  </span>
                )}
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                  {b.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {b.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
