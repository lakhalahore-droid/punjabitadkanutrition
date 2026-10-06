import React from 'react';
import { MapPin, Clock, Phone, Navigation, ExternalLink, ShieldCheck } from 'lucide-react';
import storeImg from '../assets/images/store_showcase_firozpur_1791098811579.jpg';

export const VisitUs: React.FC = () => {
  const storeAddress = 'Zira Gate, Guru Ram Das Nagar Out Side, Zira Rd, Firozpur, Punjab 152002';
  const phone = '+91 85913 85213';
  const hours = '9:00 AM – 8:00 PM (Monday to Sunday)';

  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    'Punjabi Tadka Nutrition, Zira Gate, Guru Ram Das Nagar Out Side, Zira Rd, Firozpur, Punjab 152002'
  )}`;

  return (
    <section id="visit-us" className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="glass-panel p-6 sm:p-10 rounded-3xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Store Details & Actions */}
          <div className="lg:col-span-5 flex flex-col justify-between text-left">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
                In-Store Experience
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold font-display text-slate-900 mt-1">
                Visit Us in Firozpur
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                Step into our retail store to inspect importer seals, compare flavors, and get one-on-one nutrition advice from the owner.
              </p>

              {/* Address card */}
              <div className="mt-6 space-y-4">
                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/60 border border-white/80">
                  <div className="w-9 h-9 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-600 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                      Store Address
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-700 font-medium mt-0.5 leading-snug">
                      {storeAddress}
                    </p>
                  </div>
                </div>

                {/* Timings */}
                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/60 border border-white/80">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                      Store Hours
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-700 font-medium mt-0.5">
                      {hours}
                    </p>
                    <span className="text-[11px] text-emerald-600 font-bold inline-block mt-0.5">
                      ● Open Today
                    </span>
                  </div>
                </div>

                {/* Contact */}
                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/60 border border-white/80">
                  <div className="w-9 h-9 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-600 shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                      Direct Store Phone
                    </h4>
                    <a
                      href="tel:+918591385213"
                      className="text-xs sm:text-sm text-orange-600 font-bold mt-0.5 hover:underline block"
                    >
                      {phone}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a
                href={googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-4 rounded-xl glass-btn-primary font-bold text-xs sm:text-sm flex items-center justify-center gap-2"
              >
                <Navigation className="w-4 h-4" />
                <span>Get Directions</span>
              </a>

              <a
                href="tel:+918591385213"
                className="flex-1 py-3 px-4 rounded-xl glass-btn-secondary font-bold text-xs sm:text-sm flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4 text-orange-500" />
                <span>Call Store</span>
              </a>
            </div>
          </div>

          {/* Right Column: Embedded Google Map & Visual */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Interactive Google Map iframe */}
            <div className="relative w-full h-72 sm:h-80 rounded-2xl overflow-hidden shadow-md border border-white/80 bg-slate-200">
              <iframe
                title="Punjabi Tadka Nutrition Firozpur Location"
                src="https://maps.google.com/maps?q=Zira+Gate,+Guru+Ram+Das+Nagar+Outside,+Zira+Rd,+Firozpur,+Punjab+152002&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />
              <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg text-[11px] font-bold text-slate-700 shadow-sm flex items-center gap-1.5 border border-slate-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Zira Gate, Firozpur</span>
              </div>
            </div>

            {/* Storefront Ambiance Card */}
            <div className="p-3.5 rounded-2xl bg-white/70 border border-white/80 flex items-center gap-3.5">
              <img
                src={storeImg}
                alt="Inside Punjabi Tadka Nutrition Store"
                className="w-20 h-16 rounded-xl object-cover shrink-0 shadow-sm"
              />
              <div className="text-left">
                <h4 className="text-xs font-bold text-slate-900">
                  Fully Stocked Retail Store
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                  Walk in today to verify your batch scratch-code on live importer apps before you make your purchase!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
