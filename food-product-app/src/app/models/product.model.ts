// export interface Product {
//   id?: number;               // internal DB id (optional for create)
//   productId: string;         // user-visible ID, must be unique
//   productType: string;
//   manufacturedDate: string;  // ISO date string
//   expiredDate: string;
//   netWeight: number;
// }

// export const PRODUCT_TYPES = [
//     'Perishable', 'Non-Perishable', 'Frozen', 'Canned', 'Beverage'
// ];



export interface Product {
  id: number;
  product_id: string;
  product_type: string;
  manufactured_date: string;
  expired_date: string;
  net_weight: number;
}

export interface ProductApiResponse {
  products: Product[];
  count: number;
}

export const PRODUCT_TYPES = [
  'Perishable',
  'Non-Perishable', 
  'Canned',
  'Frozen',
  'Beverage'
] as const;