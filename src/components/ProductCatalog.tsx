import React, { useState, useMemo } from 'react';
import { Search, MessageCircle, Eye, CheckCircle2, AlertOctagon, Sparkles, Filter } from 'lucide-react';
import { Product, ProductCategory } from '../types/product';

interface ProductCatalogProps {
  products: Product[];
  selectedCategory: string;
  onSelectCategory: (category: ProductCategory | 'All') => void;
  onViewProduct: (product: Product) => void;
  onBuyWhatsApp: (product: Product) => void;
}

const CATEGORIES: (ProductCategory | 'All')[] = [
  'All',
  'Protein',
  'Mass Gainer',
  'Creatine',
  'Pre Workout',
  'Vitamins & Supplements',
  'Other',
];

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  selectedCategory,
  onSelectCategory,
  onViewProduct,
  onBuyWhatsApp,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);

  // Filtered and searched list
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category match
      const matchesCategory =
        selectedCategory === 'All' || p.category === selectedCategory;

      // In-stock toggle
      const matchesStock = !inStockOnly || p.inStock;

      // Search query (name, brand, flavour, description)
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        (p.flavour && p.flavour.toLowerCase().includes(q)) ||
        p.description.toLowerCase().includes(q);

      return matchesCategory && matchesStock && matchesQuery;
    });
  }, [products, selectedCategory, inStockOnly, searchQuery]);

  return (
    <section id="products" className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
            Verified Authentic Inventory
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-display text-slate-900 mt-1">
            Our Supplements Catalog
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            100% Genuine with GST Bill · Official Importer Holograms · Direct from Firozpur Store
          </p>
        </div>

        {/* Search Input Bar */}
        <div className="w-full md:w-80 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search protein, creatine, mass gainer..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl glass-input text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs Segmented Bar & Stock Checkbox */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8 p-1.5 glass-panel rounded-2xl">
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => onSelectCategory(cat)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/30'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer px-2 select-none">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 border-slate-300"
          />
          <span>In Stock Only</span>
        </label>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="glass-panel p-12 text-center my-6 rounded-3xl">
          <div className="w-16 h-16 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-600 mx-auto mb-4">
            <Filter className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No supplements match your criteria</h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
            Looking for a specific imported stack, mass gainer, or vitamin brand? Message the owner directly on WhatsApp for special stock requests.
          </p>
          <div className="mt-5 flex justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                onSelectCategory('All');
                setInStockOnly(false);
              }}
              className="px-5 py-2 rounded-xl glass-btn-secondary text-xs font-bold"
            >
              Reset Filters
            </button>
            <a
              href="https://wa.me/918591385213?text=Hello%20Punjabi%20Tadka%20Nutrition,%20I%20am%20looking%20for%20a%20specific%20supplement"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2 rounded-xl glass-btn-primary text-xs font-bold flex items-center gap-1.5"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
              <span>Ask Owner on WhatsApp</span>
            </a>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((product) => {
            const primaryImage =
              product.images && product.images.length > 0
                ? product.images[0]
                : '/placeholder-supplement.jpg';

            return (
              <div
                key={product.id}
                className="glass-card flex flex-col justify-between overflow-hidden group cursor-pointer"
                onClick={() => onViewProduct(product)}
              >
                {/* Image Section */}
                <div className="relative aspect-square bg-white/70 overflow-hidden flex items-center justify-center p-3">
                  <img
                    src={primaryImage}
                    alt={product.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />

                  {/* Badges Overlay */}
                  <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 items-start">
                    {product.featured && (
                      <span className="text-[10px] font-extrabold uppercase tracking-wide bg-orange-500 text-white px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5" />
                        Featured
                      </span>
                    )}
                    <span className="text-[10px] font-bold bg-slate-900/80 backdrop-blur-md text-white px-2 py-0.5 rounded-full shadow-sm">
                      {product.images?.length || 3} Views
                    </span>
                  </div>

                  {/* Stock Status Pill */}
                  <div className="absolute bottom-2 right-2">
                    {product.inStock ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100/90 backdrop-blur-md px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        In Stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-800 bg-rose-100/90 backdrop-blur-md px-2 py-0.5 rounded-full border border-rose-200">
                        <AlertOctagon className="w-3 h-3 text-rose-600" />
                        Out of Stock
                      </span>
                    )}
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between text-left">
                  <div>
                    {/* Brand and category */}
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 mb-1">
                      <span>{product.brand}</span>
                      <span>·</span>
                      <span className="text-orange-600 font-bold">{product.category}</span>
                    </div>

                    {/* Product Name */}
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-2">
                      {product.name}
                    </h3>

                    {/* Size & Flavour */}
                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500">
                      <span className="font-medium bg-slate-100/80 px-2 py-0.5 rounded-md">
                        {product.sizeWeight}
                      </span>
                      {product.flavour && (
                        <span className="font-medium bg-slate-100/80 px-2 py-0.5 rounded-md line-clamp-1">
                          {product.flavour}
                        </span>
                      )}
                    </div>

                    {/* Short Description */}
                    <p className="mt-2 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  {/* Best Deal on WhatsApp & Action (NO PRICE DISPLAYED) */}
                  <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-extrabold text-orange-600">
                        Best Price on WhatsApp
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium">
                        100% Original + GST Bill
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => onViewProduct(product)}
                        aria-label="View product details"
                        className="p-2 rounded-xl glass-btn-secondary text-slate-600 hover:text-orange-600"
                        title="View details & photos"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onBuyWhatsApp(product)}
                        className="px-3 py-2 rounded-xl glass-btn-primary text-xs font-bold flex items-center gap-1.5 shadow-sm"
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-current" />
                        <span>Inquire</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

