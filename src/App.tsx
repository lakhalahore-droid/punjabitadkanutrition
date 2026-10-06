import React, { useState, useEffect } from 'react';
import { BackgroundGlows } from './components/BackgroundGlows';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TrustBadges } from './components/TrustBadges';
import { Categories } from './components/Categories';
import { ProductCatalog } from './components/ProductCatalog';
import { WhyChooseUs } from './components/WhyChooseUs';
import { Testimonials } from './components/Testimonials';
import { VisitUs } from './components/VisitUs';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { ProductDetailModal } from './components/ProductDetailModal';
import { WhatsAppOrderModal } from './components/WhatsAppOrderModal';
import { AdminPanel } from './components/Admin/AdminPanel';
import { Product, ProductCategory } from './types/product';
import { fetchAllProducts } from './services/supabase';

export default function App() {
  // Check if current route is /admin
  const [isAdminRoute, setIsAdminRoute] = useState<boolean>(() => {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    const search = window.location.search.toLowerCase();
    return (
      path === '/admin' || 
      path.startsWith('/admin/') || 
      hash === '#/admin' || 
      hash === '#admin' || 
      search.includes('admin=true')
    );
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'All'>('All');
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [orderingProduct, setOrderingProduct] = useState<Product | null>(null);

  // Sync route on popstate and hashchange
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();
      setIsAdminRoute(
        path === '/admin' || 
        path.startsWith('/admin/') || 
        hash === '#/admin' || 
        hash === '#admin' || 
        search.includes('admin=true')
      );
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  // Fetch products
  const loadProducts = async () => {
    try {
      const data = await fetchAllProducts();
      setProducts(data);
    } catch (e) {
      console.error('Failed to load products in App:', e);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Calculate category count for badge counters
  const categoryCounts = React.useMemo(() => {
    const counts: Record<string, number> = {
      Protein: 0,
      Creatine: 0,
      'Pre Workout': 0,
      'Vitamins & Supplements': 0,
      Other: 0,
    };
    products.forEach((p) => {
      if (counts[p.category] !== undefined) {
        counts[p.category] += 1;
      }
    });
    return counts;
  }, [products]);

  // Navigate back to public store from admin
  const handleBackToStore = () => {
    window.history.pushState({}, '', '/');
    setIsAdminRoute(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navigate to admin portal
  const handleOpenAdmin = () => {
    window.location.hash = '#admin';
    setIsAdminRoute(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen relative font-sans text-slate-900 selection:bg-orange-500 selection:text-white">
      {/* Background liquid glass ambient light blobs */}
      <BackgroundGlows />

      {isAdminRoute ? (
        // Admin View (Owner Only, accessed by typing /admin or clicking Owner Portal)
        <AdminPanel 
          onBackToStore={handleBackToStore} 
          onProductsUpdated={loadProducts} 
        />
      ) : (
        // Public Customer Website (View-only, with clean Owner entry point)
        <div className="flex flex-col min-h-screen">
          <Navbar onOpenAdmin={handleOpenAdmin} />
          
          <main className="flex-1">
            <Hero />
            <TrustBadges />
            <Categories 
              selectedCategory={selectedCategory}
              onSelectCategory={(cat) => setSelectedCategory(cat)}
              categoryCounts={categoryCounts}
            />
            <ProductCatalog
              products={products}
              selectedCategory={selectedCategory}
              onSelectCategory={(cat) => setSelectedCategory(cat)}
              onViewProduct={(product) => setViewingProduct(product)}
              onBuyWhatsApp={(product) => setOrderingProduct(product)}
            />
            <WhyChooseUs />
            <Testimonials />
            <VisitUs />
          </main>

          <Footer onOpenAdmin={handleOpenAdmin} />

          {/* Floating WhatsApp button on every screen */}
          <FloatingWhatsApp />

          {/* Product Detail Modal */}
          {viewingProduct && (
            <ProductDetailModal
              product={viewingProduct}
              onClose={() => setViewingProduct(null)}
              onBuyWhatsApp={(product) => setOrderingProduct(product)}
            />
          )}

          {/* Direct WhatsApp Order Form Modal */}
          {orderingProduct && (
            <WhatsAppOrderModal
              product={orderingProduct}
              onClose={() => setOrderingProduct(null)}
            />
          )}
        </div>
      )}
    </div>
  );
}
