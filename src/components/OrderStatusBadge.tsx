import { memo } from 'react';
import { Chip } from '@mui/material';
import type { OrderStatus } from '../types/order';

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

const getStatusColor = (
  status: OrderStatus
): 'default' | 'primary' | 'success' | 'warning' | 'error' => {
  switch (status) {
    case 'Pending':
      return 'warning';
    case 'Processing':
      return 'primary';
    case 'Shipped':
      return 'primary';
    case 'Delivered':
      return 'success';
    case 'Cancelled':
      return 'error';
    default:
      return 'default';
  }
};

export const OrderStatusBadge = memo<OrderStatusBadgeProps>(({ status }) => {
  return <Chip label={status} color={getStatusColor(status)} size="small" />;
});

OrderStatusBadge.displayName = 'OrderStatusBadge';
