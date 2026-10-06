import React from 'react';
import { Star, CheckCircle, MessageSquareQuote } from 'lucide-react';

export const Testimonials: React.FC = () => {
  const reviews = [
    {
      name: 'Harmanpreet Sandhu',
      role: 'Gym Trainer & Fitness Enthusiast, Firozpur',
      quote: 'The owner is knowledgeable and provides honest guidance. Unlike other shops, he never pushes expensive unwanted supplements. Only authentic batches with proper GST bills.',
      rating: 5,
      date: '2 weeks ago',
      productPurchased: 'ON Gold Standard Isolate',
    },
    {
      name: 'Gurpreet Singh',
      role: 'Powerlifter & Athlete',
      quote: 'Great prices, trusted brands, and professional guidance. Checked the importer scratch code on Bright Commodities portal right inside the shop, came 100% verified original.',
      rating: 5,
      date: '1 month ago',
      productPurchased: 'Wellcore Creatine Monohydrate',
    },
    {
      name: 'Rohit Sharma',
      role: 'Marathon Runner, Punjab',
      quote: 'Best supplement shop in Firozpur by far. You get fair prices, friendly guidance, and complete peace of mind. Delivery to my gym was prompt!',
      rating: 5,
      date: '3 weeks ago',
      productPurchased: 'Biozyme Whey & Fish Oil',
    },
  ];

  return (
    <section id="testimonials" className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
            Real Customer Experiences
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-display text-slate-900 mt-1">
            5.0 ★ Google Rating (73+ Reviews)
          </h2>
        </div>
        <div className="flex items-center gap-1.5 mt-2 sm:mt-0 text-xs font-semibold text-slate-600">
          <span className="flex text-amber-500">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
            ))}
          </span>
          <span>Verified Local Community</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {reviews.map((rev, idx) => (
          <div 
            key={idx} 
            className="glass-card p-6 flex flex-col justify-between relative group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <span className="text-[11px] text-slate-400">{rev.date}</span>
              </div>

              <MessageSquareQuote className="w-7 h-7 text-orange-400/40 mb-2" />

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                "{rev.quote}"
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-200/60">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center text-white font-bold text-xs">
                  {rev.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1">
                    {rev.name}
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  </h4>
                  <p className="text-[11px] text-slate-500">{rev.role}</p>
                </div>
              </div>

              <div className="mt-2 text-[10px] text-slate-400 font-medium">
                Purchased: {rev.productPurchased}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
