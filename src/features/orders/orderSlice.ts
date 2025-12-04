import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Order } from '../../types/order';
import { ordersApi } from './ordersApi';
import type { RootState } from '../../app/store';

interface OrderState {
  list: Order[];
  total: number;
  loading: boolean;
  error: string | null;
  pagination: {
    skip: number;
    limit: number;
    total: number;
  };
}

const initialState: OrderState = {
  list: [],
  total: 0,
  loading: false,
  error: null,
  pagination: {
    skip: 0,
    limit: 10,
    total: 0,
  },
};

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (params: { skip: number; limit: number }, { rejectWithValue }) => {
    try {
      const response = await ordersApi.fetchOrders(params);
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch orders');
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setSkip: (state, action) => {
      state.pagination.skip = Math.max(0, action.payload);
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
      state.pagination.skip = Math.max(0, state.pagination.skip || 0);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.orders;
        state.total = action.payload.total;
        state.pagination.total = action.payload.total;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSkip, setPagination } = orderSlice.actions;

// Selectors
export const selectOrders = (state: RootState) => state.orders.list;
export const selectOrdersLoading = (state: RootState) => state.orders.loading;
export const selectOrdersError = (state: RootState) => state.orders.error;
export const selectOrdersPagination = (state: RootState) => state.orders.pagination;

export default orderSlice.reducer;
