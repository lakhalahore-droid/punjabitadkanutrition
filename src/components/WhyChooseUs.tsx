import React from 'react';
import { ShieldCheck, FileCheck, DollarSign, UserCheck, Truck, Check } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const reasons = [
    {
      icon: ShieldCheck,
      title: '100% Authentic Brands',
      description: 'Every product is sourced directly from authorized Indian importers (such as Bright Commodities, Glanbia, MusclePro). Check importer holograms & scratch codes on the spot.',
      color: 'text-emerald-600 bg-emerald-500/10',
    },
    {
      icon: FileCheck,
      title: 'Genuine GST Bill Provided',
      description: 'We strictly operate with official tax invoices. A valid GST bill guarantees legitimate provenance, no gray-market contraband, and total accountability.',
      color: 'text-blue-600 bg-blue-500/10',
    },
    {
      icon: UserCheck,
      title: "Owner's Honest Guidance",
      description: 'No pushy sales or unsolicited stacks. Get real, science-based advice directly from the certified owner who understands nutrition, diet protocols, and fitness.',
      color: 'text-orange-600 bg-orange-500/10',
    },
    {
      icon: DollarSign,
      title: 'Fair & Transparent Prices',
      description: 'We believe genuine health should be affordable. You get genuine competitive pricing without exorbitant middlemen markups or fake inflated discounts.',
      color: 'text-amber-600 bg-amber-500/10',
    },
    {
      icon: Truck,
      title: 'Local Delivery & Store Pickup',
      description: 'Same-day instant pickup at our Zira Road, Firozpur store or prompt courier delivery across Punjab & neighboring districts.',
      color: 'text-purple-600 bg-purple-500/10',
    },
  ];

  return (
    <section id="why-us" className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="glass-panel p-6 sm:p-10 rounded-3xl relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-2xl mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
            Why Fitness Athletes Trust Us
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-display text-slate-900 mt-1">
            Built on Honesty, Authenticity & Real Results
          </h2>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">
            The supplement market is flooded with counterfeit products. At Punjabi Tadka Nutrition, we built our reputation in Firozpur by ensuring every single scoop you consume is 100% authentic.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {reasons.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx} 
                className="p-5 rounded-2xl bg-white/60 border border-white/80 hover:bg-white/90 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center mb-3.5`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-bold text-emerald-700">
                  <Check className="w-3.5 h-3.5" />
                  <span>Guaranteed by Punjabi Tadka</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
