import type { Product, ProductsResponse } from '../../types/product';
import { apiClient } from '../../utils/apiClient';

const api = apiClient;

interface GetProductsParams {
  skip: number;
  limit: number;
  search?: string;
  category?: string;
}

export const getProducts = async (params: GetProductsParams): Promise<ProductsResponse> => {
  try {
    let url = '/products';

    if (params.search) {
      url += `/search?q=${encodeURIComponent(params.search)}`;
    } else if (params.category) {
      url += `/category/${encodeURIComponent(params.category)}`;
    }

    const response = await api.get<ProductsResponse>(url, {
      params: {
        limit: params.limit,
        skip: params.skip,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const getProductById = async (id: number): Promise<Product> => {
  try {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

export const updateProduct = async (id: number, data: Partial<Product>): Promise<Product> => {
  try {
    const response = await api.put<Product>(`/products/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const getCategories = async (): Promise<string[]> => {
  try {
    const response = await api.get<string[]>('/products/categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};
