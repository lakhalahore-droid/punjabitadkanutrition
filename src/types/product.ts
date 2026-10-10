export type ProductCategory = 
  | 'Protein' 
  | 'Mass Gainer'
  | 'Creatine' 
  | 'Pre Workout' 
  | 'Vitamins & Supplements' 
  | 'Other';

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  price: number;
  discountPrice?: number;
  sizeWeight: string; // e.g. "2.27 kg (5 lbs)", "250 g", "120 Tablets"
  flavour?: string; // e.g. "Double Rich Chocolate", "Watermelon", "Unflavoured"
  description: string;
  inStock: boolean;
  featured?: boolean;
  images: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface WhatsAppOrderFormData {
  customerName: string;
  phoneNumber: string;
  deliveryAddress: string;
  quantity: number;
  selectedFlavour?: string;
  notes?: string;
}
