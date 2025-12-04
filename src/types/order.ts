export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

// Cart and CartsResponse types for API responses

export interface OrderProduct {
  id: number;
  title: string;
  price: number;
  quantity: number;
  total: number;
  thumbnail: string;
}

export interface Cart {
  id: number;
  userId: number;
  total: number;
  discountedTotal: number;
  totalProducts: number;
  products: OrderProduct[];
}

export interface CartsResponse {
  carts: Cart[];
  total: number;
  skip: number;
  limit: number;
}

export interface Order {
  id: number;
  products: OrderProduct[];
  total: number;
  discountedTotal: number;
  userId: number;
  totalProducts: number;
  totalQuantity: number;
  status: OrderStatus;
  date: string;
}

export interface OrdersResponse {
  carts: Order[];
  total: number;
  skip: number;
  limit: number;
}

export interface OrderState {
  orders: Order[];
  total: number;
  skip: number;
  limit: number;
  loading: boolean;
  error: string | null;
}
