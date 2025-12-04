import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Product, ProductFilters, ProductPagination } from '../../types/product';
import { getProducts, getProductById, updateProduct as updateProductApi } from './productsApi';
import type { RootState } from '../../app/store';

interface ProductState {
  list: Product[];
  currentProduct: Product | null;
  total: number;
  loading: boolean;
  error: string | null;
  filters: ProductFilters;
  pagination: ProductPagination;
  categories: string[];
}

const initialState: ProductState = {
  list: [],
  currentProduct: null,
  total: 0,
  loading: false,
  error: null,
  filters: {
    search: '',
    category: '',
    priceRange: [0, 2000],
  },
  pagination: {
    page: 0,
    pageSize: 10,
    total: 0,
  },
  categories: [],
};

// Async thunks
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const { pagination, filters } = state.products;

      const params = {
        limit: pagination.pageSize,
        skip: pagination.page * pagination.pageSize,
        search: filters.search || undefined,
        category: filters.category || undefined,
      };

      const response = await getProducts(params);
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch products');
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id: number, { rejectWithValue }) => {
    try {
      const product = await getProductById(id);
      return product;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch product');
    }
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, data }: { id: number; data: Partial<Product> }, { rejectWithValue }) => {
    try {
      const product = await updateProductApi(id, data);
      return product;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update product');
    }
  }
);

// Selectors
export const selectAllCategories = createSelector(
  (state: RootState) => state.products.list,
  (products) => {
    const categories = new Set(products.map((p) => p.category));
    return Array.from(categories).sort();
  }
);

export const selectFilteredProducts = createSelector(
  [(state: RootState) => state.products.list, (state: RootState) => state.products.filters],
  (products, filters) => {
    let filtered = [...products];

    // Price range filter
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 2000) {
      filtered = filtered.filter(
        (p) => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
      );
    }

    return filtered;
  }
);

// Basic selectors
export const selectCurrentProduct = (state: RootState) => state.products.currentProduct;
export const selectProductsLoading = (state: RootState) => state.products.loading;
export const selectProductsError = (state: RootState) => state.products.error;
export const selectProducts = (state: RootState) => state.products.list;
export const selectFilters = (state: RootState) => state.products.filters;
export const selectPagination = createSelector(
  (state: RootState) => state.products.pagination,
  (pagination) => ({
    skip: pagination.page * pagination.pageSize,
    limit: pagination.pageSize,
    total: pagination.total,
  })
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<ProductFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setPagination: (state, action: PayloadAction<Partial<ProductPagination>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
      state.pagination.page = Math.max(0, state.pagination.page || 0);
    },
    setActiveStatus: (state, action: PayloadAction<{ id: number; active: boolean }>) => {
      const product = state.list.find((p) => p.id === action.payload.id);
      if (product) {
        product.isActive = action.payload.active;
      }
      if (state.currentProduct?.id === action.payload.id) {
        state.currentProduct.isActive = action.payload.active;
      }
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.products;
        state.total = action.payload.total;
        state.pagination.total = action.payload.total;

        // Extract categories from products
        const categories = new Set(action.payload.products.map((p) => p.category));
        state.categories = Array.from(categories).sort();
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch product by ID
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update product
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = {
            ...action.payload,
            isActive: state.list[index].isActive,
          };
        }
        if (state.currentProduct?.id === action.payload.id) {
          state.currentProduct = {
            ...action.payload,
            isActive: state.currentProduct.isActive,
          };
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setFilters, setPagination, setActiveStatus, clearCurrentProduct } =
  productSlice.actions;

export default productSlice.reducer;
