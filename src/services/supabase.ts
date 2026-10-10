import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Product } from '../types/product';
import { INITIAL_PRODUCTS } from '../data/initialProducts';

const STORAGE_KEY = 'punjabi_tadka_products_v2';
const SUPABASE_CONFIG_KEY = 'punjabi_tadka_supabase_cfg';

export const normalizeSupabaseUrl = (url?: string): string => {
  if (!url || typeof url !== 'string') return '';
  let trimmed = url.trim();
  if (!trimmed) return '';
  if (!/^https?:\/\//i.test(trimmed)) {
    trimmed = `https://${trimmed}`;
  }
  return trimmed.replace(/\/+$/, '');
};

export const isValidSupabaseUrl = (url?: string): boolean => {
  if (!url || typeof url !== 'string') return false;
  const normalized = normalizeSupabaseUrl(url);
  if (!normalized) return false;

  // Reject placeholder values
  if (
    normalized.includes('your-project.supabase.co') ||
    normalized.includes('placeholder') ||
    normalized.includes('example.com')
  ) {
    return false;
  }

  try {
    const parsed = new URL(normalized);
    const hasValidProtocol = parsed.protocol === 'http:' || parsed.protocol === 'https:';
    const hasValidHost = parsed.hostname.length > 3 && (parsed.hostname.includes('.') || parsed.hostname === 'localhost');
    return hasValidProtocol && hasValidHost;
  } catch {
    return false;
  }
};

export const isValidSupabaseKey = (key?: string): boolean => {
  if (!key || typeof key !== 'string') return false;
  const trimmed = key.trim();
  if (!trimmed) return false;
  if (trimmed.includes('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...') || trimmed.includes('placeholder')) {
    return false;
  }
  return trimmed.length > 20;
};

// Get config from env or local config override with strict URL verification
const getEnvOrStoredConfig = () => {
  const envUrl = normalizeSupabaseUrl(import.meta.env.VITE_SUPABASE_URL);
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (isValidSupabaseUrl(envUrl) && isValidSupabaseKey(envKey)) {
    return { url: envUrl, anonKey: envKey.trim(), source: 'env' };
  }
  
  try {
    const stored = localStorage.getItem(SUPABASE_CONFIG_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      const storedUrl = normalizeSupabaseUrl(parsed.url);
      if (isValidSupabaseUrl(storedUrl) && isValidSupabaseKey(parsed.anonKey)) {
        return { url: storedUrl, anonKey: parsed.anonKey.trim(), source: 'manual' };
      } else {
        // Purge invalid stored credentials to avoid repeated initialization errors
        localStorage.removeItem(SUPABASE_CONFIG_KEY);
      }
    }
  } catch (e) {
    console.warn('Error reading Supabase stored config:', e);
  }
  return { url: '', anonKey: '', source: 'none' };
};

let supabaseClient: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient | null => {
  const { url, anonKey } = getEnvOrStoredConfig();
  if (isValidSupabaseUrl(url) && isValidSupabaseKey(anonKey)) {
    if (!supabaseClient) {
      try {
        supabaseClient = createClient(url, anonKey, {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
          },
          global: {
            fetch: (input, init) => window.fetch(input, init),
          },
        });
      } catch (err) {
        console.warn('Supabase client connection not active (using local store fallback):', err);
        supabaseClient = null;
        return null;
      }
    }
    return supabaseClient;
  }
  return null;
};

export const saveSupabaseConfig = (url: string, anonKey: string): { success: boolean; message: string } => {
  const normalizedUrl = normalizeSupabaseUrl(url);
  const trimmedKey = anonKey.trim();

  // If both empty, user is clearing config
  if (!url.trim() && !trimmedKey) {
    localStorage.removeItem(SUPABASE_CONFIG_KEY);
    supabaseClient = null;
    return { success: true, message: 'Settings cleared. Using local store.' };
  }

  if (!isValidSupabaseUrl(normalizedUrl)) {
    return { 
      success: false, 
      message: 'Invalid URL. Please enter a valid Supabase project URL (e.g. https://xyz.supabase.co).' 
    };
  }

  if (!isValidSupabaseKey(trimmedKey)) {
    return { 
      success: false, 
      message: 'Invalid Anon Key. Please paste your full Supabase anon API key.' 
    };
  }

  localStorage.setItem(SUPABASE_CONFIG_KEY, JSON.stringify({ url: normalizedUrl, anonKey: trimmedKey }));
  supabaseClient = null; // reset to force re-creation
  return { success: true, message: 'Supabase configuration saved! Connected.' };
};

export const getSupabaseConfigState = () => {
  return getEnvOrStoredConfig();
};

/* --- Products Local Cache & Fallback Store --- */
export const getLocalProducts = (): Product[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }
    const parsed: Product[] = JSON.parse(raw);
    const initialMap = new Map(INITIAL_PRODUCTS.map((p) => [p.id, p]));

    // Check if any product has broken or placeholder amazon images
    let hasBrokenImages = false;
    const repaired = parsed.map((p) => {
      const fresh = initialMap.get(p.id);
      const isBroken =
        !p.images ||
        p.images.length === 0 ||
        p.images.some((img: string) => typeof img === 'string' && img.includes('images-na.ssl-images-amazon.com/images/P/'));

      if (fresh && isBroken) {
        hasBrokenImages = true;
        return { ...p, images: fresh.images };
      }
      return p;
    });

    if (hasBrokenImages) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(repaired));
      return repaired;
    }

    return parsed;
  } catch {
    return INITIAL_PRODUCTS;
  }
};

export const saveLocalProducts = (products: Product[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
};

/* --- Hybrid Database API (Supabase with instant local fallback) --- */
export const fetchAllProducts = async (): Promise<Product[]> => {
  const client = getSupabaseClient();
  const initialMap = new Map(INITIAL_PRODUCTS.map((p) => [p.id, p]));

  if (client) {
    try {
      let queryResult = await client
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (queryResult.error) {
        // Fallback without order in case table schema differs
        queryResult = await client.from('products').select('*');
      }

      const { data, error } = queryResult;

      if (error) {
        console.warn('Supabase fetch error, using local fallback:', error.message);
        return getLocalProducts();
      }

      if (data && data.length > 0) {
        // Map Supabase snake_case/camelCase
        const mapped: Product[] = data.map((item: any) => {
          const fresh = initialMap.get(item.id);
          let itemImages: string[] = Array.isArray(item.images)
            ? item.images
            : item.image_url
            ? [item.image_url]
            : [];

          // If remote image is broken Amazon placeholder, heal with verified images
          const isBroken =
            itemImages.length === 0 ||
            itemImages.some(
              (img: string) =>
                typeof img === 'string' &&
                img.includes('images-na.ssl-images-amazon.com/images/P/')
            );

          if (isBroken && fresh && fresh.images && fresh.images.length > 0) {
            itemImages = fresh.images;
          }

          return {
            id: item.id || `prod-${Date.now()}`,
            name: item.name,
            brand: item.brand,
            category: item.category,
            price: Number(item.price),
            discountPrice: item.discount_price
              ? Number(item.discount_price)
              : item.discountPrice
              ? Number(item.discountPrice)
              : undefined,
            sizeWeight: item.size_weight || item.sizeWeight || '',
            flavour: item.flavour || item.flavor || '',
            description: item.description || '',
            inStock: Boolean(item.in_stock ?? item.inStock ?? true),
            featured: Boolean(item.featured ?? false),
            images: itemImages,
            createdAt: item.created_at || item.createdAt,
            updatedAt: item.updated_at || item.updatedAt,
          };
        });
        // Update local cache for offline/instant render
        saveLocalProducts(mapped);
        return mapped;
      }
    } catch (e) {
      console.warn('Network exception while fetching Supabase products:', e);
    }
  }

  // Fallback to local store
  return getLocalProducts();
};

export const createProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
  const newProduct: Product = {
    ...productData,
    id: `prod-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('products')
        .insert({
          id: newProduct.id,
          name: newProduct.name,
          brand: newProduct.brand,
          category: newProduct.category,
          price: newProduct.price,
          discount_price: newProduct.discountPrice || null,
          size_weight: newProduct.sizeWeight,
          flavour: newProduct.flavour || null,
          description: newProduct.description,
          in_stock: newProduct.inStock,
          featured: newProduct.featured || false,
          images: newProduct.images,
        })
        .select()
        .single();

      if (!error && data) {
        // successfully inserted into Supabase
      }
    } catch (err) {
      console.warn('Failed to insert product into Supabase:', err);
    }
  }

  // Always update local cache so updates reflect immediately
  const localList = getLocalProducts();
  const updated = [newProduct, ...localList];
  saveLocalProducts(updated);
  return newProduct;
};

export const updateProduct = async (id: string, updates: Partial<Product>): Promise<Product | null> => {
  const client = getSupabaseClient();
  if (client) {
    try {
      const payload: any = {
        updated_at: new Date().toISOString(),
      };
      if (updates.name !== undefined) payload.name = updates.name;
      if (updates.brand !== undefined) payload.brand = updates.brand;
      if (updates.category !== undefined) payload.category = updates.category;
      if (updates.price !== undefined) payload.price = updates.price;
      if (updates.discountPrice !== undefined) payload.discount_price = updates.discountPrice || null;
      if (updates.sizeWeight !== undefined) payload.size_weight = updates.sizeWeight;
      if (updates.flavour !== undefined) payload.flavour = updates.flavour || null;
      if (updates.description !== undefined) payload.description = updates.description;
      if (updates.inStock !== undefined) payload.in_stock = updates.inStock;
      if (updates.featured !== undefined) payload.featured = updates.featured;
      if (updates.images !== undefined) payload.images = updates.images;

      await client.from('products').update(payload).eq('id', id);
    } catch (err) {
      console.warn('Supabase update failed:', err);
    }
  }

  // Update local list
  const current = getLocalProducts();
  let updatedProduct: Product | null = null;
  const nextList = current.map(p => {
    if (p.id === id) {
      updatedProduct = { ...p, ...updates, updatedAt: new Date().toISOString() };
      return updatedProduct;
    }
    return p;
  });

  saveLocalProducts(nextList);
  return updatedProduct;
};

export const deleteProduct = async (id: string): Promise<boolean> => {
  const client = getSupabaseClient();
  if (client) {
    try {
      await client.from('products').delete().eq('id', id);
    } catch (err) {
      console.warn('Supabase delete failed:', err);
    }
  }

  const current = getLocalProducts();
  const next = current.filter(p => p.id !== id);
  saveLocalProducts(next);
  return true;
};

/* --- Upload Image to Supabase Storage or Local Base64 --- */
export const uploadProductImage = async (file: File): Promise<string> => {
  const client = getSupabaseClient();
  if (client) {
    try {
      const fileExt = file.name.split('.').pop() || 'jpg';
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await client.storage
        .from('product-images')
        .upload(filePath, file, { upsert: true });

      if (!uploadError) {
        const { data } = client.storage.from('product-images').getPublicUrl(filePath);
        if (data?.publicUrl) {
          return data.publicUrl;
        }
      }
    } catch (err) {
      console.warn('Supabase storage upload error, falling back to base64:', err);
    }
  }

  // Fallback to local Data URL
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/* --- Supabase Setup SQL instructions for Owner --- */
export const SUPABASE_SETUP_SQL = `-- Run this in your Supabase SQL Editor:
-- 1. Create Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    category TEXT NOT NULL,
    price NUMERIC NOT NULL,
    discount_price NUMERIC,
    size_weight TEXT,
    flavour TEXT,
    description TEXT,
    in_stock BOOLEAN DEFAULT true,
    featured BOOLEAN DEFAULT false,
    images JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- 3. Public Read & Management Policies (Safe recreation)
DROP POLICY IF EXISTS "Public products are viewable by everyone" ON public.products;
CREATE POLICY "Public products are viewable by everyone" 
ON public.products FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Public products insert" ON public.products;
DROP POLICY IF EXISTS "Authenticated owner can insert products" ON public.products;
CREATE POLICY "Public products insert" 
ON public.products FOR INSERT 
WITH CHECK (true);

DROP POLICY IF EXISTS "Public products update" ON public.products;
DROP POLICY IF EXISTS "Authenticated owner can update products" ON public.products;
CREATE POLICY "Public products update" 
ON public.products FOR UPDATE 
USING (true);

DROP POLICY IF EXISTS "Public products delete" ON public.products;
DROP POLICY IF EXISTS "Authenticated owner can delete products" ON public.products;
CREATE POLICY "Public products delete" 
ON public.products FOR DELETE 
USING (true);

-- 4. Storage bucket for product images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- 5. Storage RLS Policies (Safe recreation)
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Image Access" ON storage.objects;
CREATE POLICY "Public Image Access" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Owner Upload Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Image Upload" ON storage.objects;
CREATE POLICY "Public Image Upload" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'product-images');
`;
