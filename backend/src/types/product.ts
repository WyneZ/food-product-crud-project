export type ProductType = 'Perishable' | 'Non-Perishable' | 'Frozen' | 'Canned' | 'Beverage';

export interface Product {
  id?: number;
  product_id: string;
  product_type: ProductType;
  manufactured_date: Date;
  expired_date: Date;
  net_weight: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface CreateProductRequest {
  product_id: string;
  product_type: ProductType;
  manufactured_date: string;
  expired_date: string;
  net_weight: number;
}

export interface UpdateProductRequest {
  product_type?: ProductType;
  manufactured_date?: string;
  expired_date?: string;
  net_weight?: number;
}