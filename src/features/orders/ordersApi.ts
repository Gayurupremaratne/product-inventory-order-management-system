import type { CartsResponse, Cart, Order, OrderStatus } from '../../types/order';
import { apiClient } from '../../utils/apiClient';

const api = apiClient;

const statuses: OrderStatus[] = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const generateStatus = (cartId: number): OrderStatus => {
  // Generate consistent status based on cart ID
  return statuses[cartId % statuses.length];
};

const convertCartToOrder = (cart: Cart): Order => {
  return {
    id: cart.id,
    userId: cart.userId,
    total: cart.total,
    discountedTotal: cart.discountedTotal,
    totalProducts: cart.totalProducts,
    totalQuantity: cart.products.reduce((sum, product) => sum + product.quantity, 0),
    date: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(), // Random date within last 90 days
    status: generateStatus(cart.id),
    products: cart.products,
  };
};

export const ordersApi = {
  fetchOrders: async (params: {
    limit: number;
    skip: number;
  }): Promise<{ orders: Order[]; total: number }> => {
    const response = await api.get<CartsResponse>(
      `/carts?limit=${params.limit}&skip=${params.skip}`
    );

    const orders = response.data.carts.map(convertCartToOrder);

    return {
      orders,
      total: response.data.total,
    };
  },
};
