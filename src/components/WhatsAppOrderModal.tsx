import React, { useState } from 'react';
import { X, MessageCircle, ShieldCheck, MapPin, Phone, User, Hash, AlertCircle } from 'lucide-react';
import { Product, WhatsAppOrderFormData } from '../types/product';

interface WhatsAppOrderModalProps {
  product: Product | null;
  onClose: () => void;
}

export const WhatsAppOrderModal: React.FC<WhatsAppOrderModalProps> = ({
  product,
  onClose,
}) => {
  if (!product) return null;

  const [formData, setFormData] = useState<WhatsAppOrderFormData>({
    customerName: '',
    phoneNumber: '',
    deliveryAddress: '',
    quantity: 1,
    selectedFlavour: product.flavour || '',
    notes: '',
  });

  const [errorMsg, setErrorMsg] = useState('');

  const effectivePrice = product.discountPrice || product.price;
  const totalPrice = effectivePrice * formData.quantity;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName.trim()) {
      setErrorMsg('Please enter your full name');
      return;
    }
    if (!formData.phoneNumber.trim() || formData.phoneNumber.replace(/\D/g, '').length < 10) {
      setErrorMsg('Please enter a valid 10-digit phone number');
      return;
    }
    if (!formData.deliveryAddress.trim()) {
      setErrorMsg('Please enter your delivery city or address in Punjab / India');
      return;
    }

    // Build the exact message required by user specification:
    // "Hello Punjabi Tadka Nutrition, I want to order:
    // Product: [name] ([brand])
    // Price: ₹[price]
    // Quantity: [qty]
    // Name: [customer name]
    // Phone: [phone]
    // Address: [address]
    // Note: [note]
    // Please confirm availability and delivery."

    const notePart = formData.notes?.trim() ? `\nNote: ${formData.notes.trim()}` : '';
    const flavourPart = formData.selectedFlavour ? ` (Flavour: ${formData.selectedFlavour})` : '';

    const text = `Hello Punjabi Tadka Nutrition, I want to order/inquire:
Product: ${product.name} (${product.brand})${flavourPart}
Size/Weight: ${product.sizeWeight}
Quantity: ${formData.quantity}
Name: ${formData.customerName.trim()}
Phone: ${formData.phoneNumber.trim()}
Address: ${formData.deliveryAddress.trim()}${notePart}
Please confirm availability, your best price, and delivery details.`;

    const encoded = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/918591385213?text=${encoded}`;
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/45 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg glass-panel p-5 sm:p-7 shadow-2xl rounded-3xl max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-500 hover:text-slate-900 hover:bg-white/60 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-3.5 mb-5 pb-4 border-b border-slate-200/60">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 flex items-center justify-center text-emerald-600 shrink-0">
            <MessageCircle className="w-6 h-6 fill-current" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
              Direct WhatsApp Inquiry & Order
            </span>
            <h3 className="text-lg sm:text-xl font-bold font-display text-slate-900 mt-1">
              Order: {product.name}
            </h3>
            <p className="text-xs text-slate-500">
              {product.brand} · {product.sizeWeight}
            </p>
          </div>
        </div>

        {/* Product Summary Box (NO PRICE DISPLAYED) */}
        <div className="p-3.5 rounded-2xl bg-white/70 border border-white/80 mb-5 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500">Selected Product</span>
            <div className="text-xs sm:text-sm font-extrabold text-slate-900 line-clamp-1">
              {product.name}
            </div>
            <span className="text-[11px] text-slate-500">{product.sizeWeight} · {product.flavour || 'Standard'}</span>
          </div>
          <div className="text-right shrink-0">
            <span className="text-[10px] text-slate-400 block">Offer</span>
            <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md inline-block">
              Best Price on WA
            </span>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* WhatsApp Order Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              Your Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Gurpreet Singh"
              value={formData.customerName}
              onChange={(e) => {
                setFormData({ ...formData, customerName: e.target.value });
                setErrorMsg('');
              }}
              className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-slate-900 placeholder-slate-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                Phone / WhatsApp Number *
              </label>
              <input
                type="tel"
                required
                placeholder="10-digit mobile number"
                value={formData.phoneNumber}
                onChange={(e) => {
                  setFormData({ ...formData, phoneNumber: e.target.value });
                  setErrorMsg('');
                }}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-slate-900 placeholder-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-slate-400" />
                Quantity
              </label>
              <div className="flex items-center rounded-xl glass-input px-2 py-1">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, quantity: Math.max(1, formData.quantity - 1) })}
                  className="w-8 h-8 rounded-lg bg-white/70 hover:bg-white text-slate-700 font-bold flex items-center justify-center transition-colors text-sm"
                >
                  -
                </button>
                <span className="flex-1 text-center font-bold text-sm text-slate-900 tabular-nums">
                  {formData.quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, quantity: formData.quantity + 1 })}
                  className="w-8 h-8 rounded-lg bg-white/70 hover:bg-white text-slate-700 font-bold flex items-center justify-center transition-colors text-sm"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {product.flavour && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Selected Flavour
              </label>
              <input
                type="text"
                value={formData.selectedFlavour}
                onChange={(e) => setFormData({ ...formData, selectedFlavour: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-slate-900"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              Delivery Address or Store Pickup *
            </label>
            <textarea
              required
              rows={2}
              placeholder="e.g. House No, Street, Landmark, Firozpur / Local City"
              value={formData.deliveryAddress}
              onChange={(e) => {
                setFormData({ ...formData, deliveryAddress: e.target.value });
                setErrorMsg('');
              }}
              className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-slate-900 placeholder-slate-400 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Optional Note / Dietary Questions
            </label>
            <input
              type="text"
              placeholder="e.g. Please bring vanilla flavour if available, or ask for shaker"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-slate-900 placeholder-slate-400"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl glass-btn-primary font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              <span>Send Order on WhatsApp</span>
            </button>
            <p className="text-[11px] text-center text-slate-500 mt-2 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Official Store WhatsApp (+91 85913 85213). Pay after order confirmation.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
