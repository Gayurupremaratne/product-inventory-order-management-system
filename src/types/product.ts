export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
  isActive?: boolean;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface ProductFilters {
  search: string;
  category: string;
  priceRange: [number, number];
}

export interface ProductPagination {
  page: number;
  pageSize: number;
  total: number;
}

export interface ProductState {
  products: Product[];
  currentProduct: Product | null;
  total: number;
  skip: number;
  limit: number;
  filters: ProductFilters;
  loading: boolean;
  error: string | null;
}
