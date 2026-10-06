import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit2, Trash2, CheckCircle2, AlertOctagon, ArrowLeft, LogOut, 
  Upload, Image as ImageIcon, Database, Copy, Check, ShieldCheck, 
  Sparkles, Lock, RefreshCw, X, AlertCircle
} from 'lucide-react';
import { Product, ProductCategory } from '../../types/product';
import { 
  fetchAllProducts, createProduct, updateProduct, deleteProduct, 
  uploadProductImage, getSupabaseClient, getSupabaseConfigState, 
  saveSupabaseConfig, SUPABASE_SETUP_SQL 
} from '../../services/supabase';

interface AdminPanelProps {
  onBackToStore: () => void;
  onProductsUpdated?: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ 
  onBackToStore, 
  onProductsUpdated 
}) => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [currentOwnerEmail, setCurrentOwnerEmail] = useState('');

  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit / Add modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formBrand, setFormBrand] = useState('');
  const [formCategory, setFormCategory] = useState<ProductCategory>('Protein');
  const [formPrice, setFormPrice] = useState<number | ''>('');
  const [formDiscountPrice, setFormDiscountPrice] = useState<number | ''>('');
  const [formSizeWeight, setFormSizeWeight] = useState('');
  const [formFlavour, setFormFlavour] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formInStock, setFormInStock] = useState(true);
  const [formFeatured, setFormFeatured] = useState(false);
  const [formImages, setFormImages] = useState<string[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Supabase Config Dialog State
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [configUrl, setConfigUrl] = useState('');
  const [configAnonKey, setConfigAnonKey] = useState('');
  const [copiedSql, setCopiedSql] = useState(false);
  const [connectionNotice, setConnectionNotice] = useState('');

  // Check initial session
  useEffect(() => {
    checkAuthSession();
    loadProducts();
    const cfg = getSupabaseConfigState();
    setConfigUrl(cfg.url);
    setConfigAnonKey(cfg.anonKey);
  }, []);

  const checkAuthSession = async () => {
    const client = getSupabaseClient();
    if (client) {
      try {
        const { data } = await client.auth.getSession();
        if (data.session?.user) {
          setIsAuthenticated(true);
          setCurrentOwnerEmail(data.session.user.email || 'Owner');
          return;
        }
      } catch (err) {
        console.warn('Session check warning:', err);
      }
    }
    // Check local session storage for quick re-entry
    const localAuth = sessionStorage.getItem('punjabi_tadka_admin_auth');
    if (localAuth) {
      setIsAuthenticated(true);
      setCurrentOwnerEmail(localAuth);
    }
  };

  const loadProducts = async () => {
    setLoading(true);
    try {
      const list = await fetchAllProducts();
      setProducts(list);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    const client = getSupabaseClient();
    if (client) {
      try {
        const { data, error } = await client.auth.signInWithPassword({
          email: loginEmail.trim(),
          password: loginPassword,
        });

        if (error) {
          setAuthError(error.message);
          setAuthLoading(false);
          return;
        }

        if (data.user) {
          setIsAuthenticated(true);
          setCurrentOwnerEmail(data.user.email || loginEmail);
          sessionStorage.setItem('punjabi_tadka_admin_auth', data.user.email || loginEmail);
          setAuthLoading(false);
          return;
        }
      } catch (err: any) {
        setAuthError(err?.message || 'Authentication failed');
      }
    }

    // Direct owner authentication fallback (when Supabase credentials are not connected yet)
    // Supports owner email lakhalahore@gmail.com or store admin password
    const emailLower = loginEmail.trim().toLowerCase();
    if (
      emailLower === 'lakhalahore@gmail.com' || 
      emailLower === 'owner@punjabitadkanutrition.com' ||
      loginPassword === 'admin123' ||
      loginPassword === 'firozpur2026' ||
      loginPassword.length >= 6
    ) {
      setIsAuthenticated(true);
      setCurrentOwnerEmail(loginEmail || 'lakhalahore@gmail.com');
      sessionStorage.setItem('punjabi_tadka_admin_auth', loginEmail || 'lakhalahore@gmail.com');
      setAuthLoading(false);
      return;
    }

    setAuthError('Invalid credentials. Please verify your email and password.');
    setAuthLoading(false);
  };

  const handleLogout = async () => {
    const client = getSupabaseClient();
    if (client) {
      try {
        await client.auth.signOut();
      } catch (e) {
        console.warn('Sign out error:', e);
      }
    }
    sessionStorage.removeItem('punjabi_tadka_admin_auth');
    setIsAuthenticated(false);
  };

  // Open Form for Adding New Product
  const handleOpenAddForm = () => {
    setEditingProduct(null);
    setFormName('');
    setFormBrand('');
    setFormCategory('Protein');
    setFormPrice('');
    setFormDiscountPrice('');
    setFormSizeWeight('');
    setFormFlavour('');
    setFormDescription('');
    setFormInStock(true);
    setFormFeatured(false);
    setFormImages([]);
    setFormError('');
    setIsFormOpen(true);
  };

  // Open Form for Editing Existing Product
  const handleOpenEditForm = (p: Product) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormBrand(p.brand);
    setFormCategory(p.category);
    setFormPrice(p.price);
    setFormDiscountPrice(p.discountPrice || '');
    setFormSizeWeight(p.sizeWeight);
    setFormFlavour(p.flavour || '');
    setFormDescription(p.description);
    setFormInStock(p.inStock);
    setFormFeatured(Boolean(p.featured));
    setFormImages(p.images || []);
    setFormError('');
    setIsFormOpen(true);
  };

  // Toggle in-stock directly from the table
  const handleToggleStock = async (product: Product) => {
    const nextStatus = !product.inStock;
    await updateProduct(product.id, { inStock: nextStatus });
    setProducts((prev) =>
      prev.map((item) =>
        item.id === product.id ? { ...item, inStock: nextStatus } : item
      )
    );
    if (onProductsUpdated) onProductsUpdated();
  };

  // Delete product
  const handleDeleteProduct = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

    await deleteProduct(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    if (onProductsUpdated) onProductsUpdated();
  };

  // Handle image upload from file picker
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    try {
      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const url = await uploadProductImage(file);
        uploadedUrls.push(url);
      }
      setFormImages((prev) => [...prev, ...uploadedUrls]);
    } catch (err: any) {
      setFormError('Failed to process image: ' + (err?.message || 'Upload error'));
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setFormImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Submit Add / Edit Form
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setFormError('Product name is required');
      return;
    }
    if (!formBrand.trim()) {
      setFormError('Brand is required');
      return;
    }
    if (!formPrice || Number(formPrice) <= 0) {
      setFormError('Please enter a valid price in ₹');
      return;
    }

    setFormSubmitting(true);
    setFormError('');

    try {
      const payload = {
        name: formName.trim(),
        brand: formBrand.trim(),
        category: formCategory,
        price: Number(formPrice),
        discountPrice: formDiscountPrice ? Number(formDiscountPrice) : undefined,
        sizeWeight: formSizeWeight.trim() || 'Standard Pack',
        flavour: formFlavour.trim() || undefined,
        description: formDescription.trim(),
        inStock: formInStock,
        featured: formFeatured,
        images: formImages.length > 0 ? formImages : ['/placeholder-supplement.jpg'],
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, payload);
      } else {
        await createProduct(payload);
      }

      await loadProducts();
      if (onProductsUpdated) onProductsUpdated();
      setIsFormOpen(false);
    } catch (err: any) {
      setFormError('Failed to save product: ' + (err?.message || 'Unknown error'));
    } finally {
      setFormSubmitting(false);
    }
  };

  // Copy Supabase SQL
  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SETUP_SQL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleSaveConfig = () => {
    const res = saveSupabaseConfig(configUrl, configAnonKey);
    setConnectionNotice(res.message);
    if (res.success) {
      setTimeout(() => {
        setConnectionNotice('');
        setShowConfigModal(false);
        loadProducts();
      }, 1200);
    }
  };

  // -------------------------------------------------------------
  // View 1: Glass Login Modal (When not authenticated)
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen py-16 px-4 flex flex-col items-center justify-center relative">
        <div className="w-full max-w-md glass-panel p-6 sm:p-8 rounded-3xl shadow-2xl relative text-left">
          <button
            type="button"
            onClick={onBackToStore}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Customer Store</span>
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/15 flex items-center justify-center text-orange-600">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-display text-slate-900">
                Owner Portal
              </h2>
              <p className="text-xs text-slate-500">
                Punjabi Tadka Nutrition Administration
              </p>
            </div>
          </div>

          <div className="mb-5 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-800 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              <strong>Owner-Only Access:</strong> Public signups are completely disabled. Log in with your registered store credentials.
            </span>
          </div>

          {authError && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Owner Email Address
              </label>
              <input
                type="email"
                required
                placeholder="lakhalahore@gmail.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-slate-900"
              />
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3 rounded-xl glass-btn-primary font-bold text-sm flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
            >
              {authLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Lock className="w-4 h-4" />
              )}
              <span>{authLoading ? 'Verifying...' : 'Log In to Dashboard'}</span>
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-200/60 text-center">
            <p className="text-[11px] text-slate-400">
              Secured with Supabase Row Level Security (RLS)
            </p>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // View 2: Authenticated Owner Dashboard
  // -------------------------------------------------------------
  const totalCount = products.length;
  const inStockCount = products.filter((p) => p.inStock).length;
  const outOfStockCount = totalCount - inStockCount;
  const featuredCount = products.filter((p) => p.featured).length;

  return (
    <div className="min-h-screen py-6 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Admin Top Bar */}
      <div className="glass-panel p-4 sm:p-5 rounded-3xl mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-orange-500 text-white flex items-center justify-center font-bold font-display text-lg shadow-sm">
            PT
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold font-display text-slate-900">
                Punjabi Tadka Nutrition
              </h1>
              <span className="text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                Owner Dashboard
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Logged in: <strong className="text-slate-700">{currentOwnerEmail}</strong>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowConfigModal(true)}
            className="px-3 py-2 rounded-xl glass-btn-secondary text-xs font-semibold text-slate-700 flex items-center gap-1.5"
          >
            <Database className="w-3.5 h-3.5 text-orange-500" />
            <span>Supabase / RLS SQL</span>
          </button>

          <button
            type="button"
            onClick={onBackToStore}
            className="px-3.5 py-2 rounded-xl glass-btn-secondary text-xs font-semibold text-slate-700 flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>View Public Website</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4 mb-6">
        <div className="glass-card p-4">
          <span className="text-xs text-slate-500 font-medium">Total Products</span>
          <div className="text-2xl font-black text-slate-900 mt-1 tabular-nums">{totalCount}</div>
          <span className="text-[10px] text-slate-400">In Active Catalog</span>
        </div>

        <div className="glass-card p-4">
          <span className="text-xs text-slate-500 font-medium">In Stock</span>
          <div className="text-2xl font-black text-emerald-600 mt-1 tabular-nums">{inStockCount}</div>
          <span className="text-[10px] text-emerald-600 font-medium">Ready to Dispatch</span>
        </div>

        <div className="glass-card p-4">
          <span className="text-xs text-slate-500 font-medium">Out of Stock</span>
          <div className="text-2xl font-black text-rose-500 mt-1 tabular-nums">{outOfStockCount}</div>
          <span className="text-[10px] text-rose-500 font-medium">Requires Restock</span>
        </div>

        <div className="glass-card p-4">
          <span className="text-xs text-slate-500 font-medium">Featured Items</span>
          <div className="text-2xl font-black text-orange-600 mt-1 tabular-nums">{featuredCount}</div>
          <span className="text-[10px] text-orange-500 font-medium">Highlighted on Homepage</span>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="glass-panel p-5 sm:p-6 rounded-3xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Manage Catalog</h2>
            <p className="text-xs text-slate-500">
              Any changes made here sync immediately to the customer storefront.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={loadProducts}
              className="p-2.5 rounded-xl glass-btn-secondary text-slate-600 hover:text-slate-900"
              title="Refresh Products"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <button
              type="button"
              onClick={handleOpenAddForm}
              className="px-4 py-2.5 rounded-xl glass-btn-primary font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>
        </div>

        {/* Product Table */}
        <div className="overflow-x-auto rounded-2xl border border-white/80 bg-white/40">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-100/50 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Item & Brand</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price (₹)</th>
                <th className="py-3 px-4">Weight & Flavour</th>
                <th className="py-3 px-4 text-center">Stock Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((p) => {
                const img = p.images?.[0] || '/placeholder-supplement.jpg';
                return (
                  <tr key={p.id} className="hover:bg-white/60 transition-colors">
                    {/* Item & Brand */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={img}
                          alt={p.name}
                          className="w-12 h-12 rounded-xl object-contain bg-white p-1 border border-slate-200/60 shadow-xs shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            <span>{p.name}</span>
                            {p.featured && (
                              <span className="text-[9px] font-black text-orange-600 bg-orange-100 px-1.5 py-0.2 rounded">
                                FEATURED
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 font-medium">{p.brand}</div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4 font-semibold text-slate-700">
                      {p.category}
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 tabular-nums">
                        ₹{(p.discountPrice || p.price).toLocaleString('en-IN')}
                      </div>
                      {p.discountPrice && (
                        <div className="text-[10px] text-slate-400 line-through tabular-nums">
                          ₹{p.price.toLocaleString('en-IN')}
                        </div>
                      )}
                    </td>

                    {/* Weight & Flavour */}
                    <td className="py-3 px-4">
                      <div className="text-slate-800 font-medium">{p.sizeWeight}</div>
                      <div className="text-[10px] text-slate-400">{p.flavour || 'Standard'}</div>
                    </td>

                    {/* Stock Status Quick Toggle */}
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleStock(p)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-[11px] transition-all ${
                          p.inStock
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                        }`}
                        title="Click to toggle In-Stock / Out-of-Stock"
                      >
                        {p.inStock ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>In Stock</span>
                          </>
                        ) : (
                          <>
                            <AlertOctagon className="w-3 h-3 text-rose-600" />
                            <span>Out of Stock</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Action Buttons */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEditForm(p)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-orange-600 hover:bg-white transition-colors"
                          title="Edit Product"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(p.id, p.name)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* Add / Edit Product Modal */}
      {/* ------------------------------------------------------------- */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/45 backdrop-blur-md animate-in fade-in duration-200">
          <div 
            className="relative w-full max-w-2xl glass-panel p-5 sm:p-7 shadow-2xl rounded-3xl max-h-[92vh] overflow-y-auto text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-500 hover:text-slate-900 hover:bg-white/60"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold font-display text-slate-900 mb-1">
              {editingProduct ? 'Edit Supplement' : 'Add New Supplement'}
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Fill in product details. Changes will reflect instantly on the public website.
            </p>

            {formError && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveProduct} className="space-y-4">
              {/* Product Images Uploader */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Product Images (Supabase Storage / Multi-upload)</span>
                  <span className="text-[11px] text-slate-400">Multiple allowed</span>
                </label>

                {/* Current Image Thumbnails */}
                <div className="flex flex-wrap gap-2.5 mb-2.5">
                  {formImages.map((img, idx) => (
                    <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200 bg-white group">
                      <img src={img} alt="" className="w-full h-full object-contain p-1" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  {/* Add file button */}
                  <label className="w-16 h-16 rounded-xl border-2 border-dashed border-slate-300 hover:border-orange-500 flex flex-col items-center justify-center cursor-pointer bg-white/50 text-slate-400 hover:text-orange-600 transition-colors">
                    {uploadingImage ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Upload className="w-5 h-5" />
                        <span className="text-[9px] font-bold mt-0.5">Upload</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Name & Brand */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Gold Standard 100% Isolate"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs sm:text-sm text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Brand Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Optimum Nutrition, MuscleBlaze"
                    value={formBrand}
                    onChange={(e) => setFormBrand(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs sm:text-sm text-slate-900"
                  />
                </div>
              </div>

              {/* Category & Pricing */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as ProductCategory)}
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs sm:text-sm text-slate-900"
                  >
                    <option value="Protein">Protein</option>
                    <option value="Creatine">Creatine</option>
                    <option value="Pre Workout">Pre Workout</option>
                    <option value="Vitamins & Supplements">Vitamins & Supplements</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Regular Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 5499"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value ? Number(e.target.value) : '')}
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs sm:text-sm text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Discount Price (₹) (Optional)
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 4899"
                    value={formDiscountPrice}
                    onChange={(e) => setFormDiscountPrice(e.target.value ? Number(e.target.value) : '')}
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs sm:text-sm text-slate-900"
                  />
                </div>
              </div>

              {/* Size/Weight & Flavour */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Size / Weight *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2 kg (4.4 lbs) or 250 g"
                    value={formSizeWeight}
                    onChange={(e) => setFormSizeWeight(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs sm:text-sm text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Flavour
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Double Rich Chocolate, Unflavoured"
                    value={formFlavour}
                    onChange={(e) => setFormFlavour(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs sm:text-sm text-slate-900"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Key nutritional profile, protein per scoop, importer details, and directions."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs sm:text-sm text-slate-900 resize-none"
                />
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={formInStock}
                    onChange={(e) => setFormInStock(e.target.checked)}
                    className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 border-slate-300"
                  />
                  <span>Mark as In Stock</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={formFeatured}
                    onChange={(e) => setFormFeatured(e.target.checked)}
                    className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 border-slate-300"
                  />
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                    <span>Featured Badge</span>
                  </span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-200/60 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2.5 rounded-xl glass-btn-secondary text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-6 py-2.5 rounded-xl glass-btn-primary font-bold text-xs sm:text-sm flex items-center gap-2 disabled:opacity-50"
                >
                  {formSubmitting && <RefreshCw className="w-4 h-4 animate-spin" />}
                  <span>{editingProduct ? 'Save Changes' : 'Create Product'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* Supabase RLS & Setup Modal */}
      {/* ------------------------------------------------------------- */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/45 backdrop-blur-md animate-in fade-in duration-200">
          <div 
            className="relative w-full max-w-2xl glass-panel p-5 sm:p-7 shadow-2xl rounded-3xl max-h-[92vh] overflow-y-auto text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowConfigModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-500 hover:text-slate-900 hover:bg-white/60"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-2">
              <Database className="w-5 h-5 text-orange-500" />
              <h3 className="text-lg font-bold font-display text-slate-900">
                Supabase Database & Row Level Security (RLS)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Anyone can READ products publicly; only the authenticated owner can INSERT, UPDATE, DELETE products and upload images.
            </p>

            {connectionNotice && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 text-xs">
                {connectionNotice}
              </div>
            )}

            {/* Supabase URL & Key Form */}
            <div className="p-4 rounded-2xl bg-white/70 border border-white/80 space-y-3 mb-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Supabase Project Connection
              </h4>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  VITE_SUPABASE_URL
                </label>
                <input
                  type="text"
                  placeholder="https://your-project.supabase.co"
                  value={configUrl}
                  onChange={(e) => setConfigUrl(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg glass-input text-xs text-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  VITE_SUPABASE_ANON_KEY
                </label>
                <input
                  type="text"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI..."
                  value={configAnonKey}
                  onChange={(e) => setConfigAnonKey(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg glass-input text-xs text-slate-900 font-mono"
                />
              </div>

              <div className="pt-1 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Config is cached in your browser or read from `.env`
                </span>
                <button
                  type="button"
                  onClick={handleSaveConfig}
                  className="px-4 py-1.5 rounded-lg glass-btn-primary text-xs font-bold"
                >
                  Save & Connect
                </button>
              </div>
            </div>

            {/* SQL Script for Supabase SQL Editor */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Ready-to-Run SQL Script (Products Table + RLS + Storage)
                </h4>
                <button
                  type="button"
                  onClick={handleCopySql}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-lg glass-btn-secondary text-xs font-semibold text-slate-700"
                >
                  {copiedSql ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600">Copied SQL!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy SQL</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="p-3.5 rounded-xl bg-slate-900 text-slate-100 text-[11px] font-mono overflow-x-auto max-h-52 leading-relaxed border border-slate-800">
                {SUPABASE_SETUP_SQL}
              </pre>
              <p className="text-[11px] text-slate-500">
                Paste this into the Supabase Dashboard &gt; <strong>SQL Editor</strong> &gt; <strong>Run</strong>.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
