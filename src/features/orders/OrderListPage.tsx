import { useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  CircularProgress,
} from '@mui/material';
import dayjs from 'dayjs';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  fetchOrders,
  setSkip,
  setPagination,
  selectOrders,
  selectOrdersLoading,
  selectOrdersError,
  selectOrdersPagination,
} from './orderSlice';
import type { OrderStatus } from '../../types/order';

const getStatusColor = (status: OrderStatus) => {
  const colors: Record<
    OrderStatus,
    'default' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning'
  > = {
    Pending: 'warning',
    Processing: 'info',
    Shipped: 'primary',
    Delivered: 'success',
    Cancelled: 'error',
  };
  return colors[status] || 'default';
};

export default function OrderListPage() {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(selectOrders);
  const loading = useAppSelector(selectOrdersLoading);
  const error = useAppSelector(selectOrdersError);
  const pagination = useAppSelector(selectOrdersPagination);

  useEffect(() => {
    dispatch(
      fetchOrders({
        skip: pagination.skip,
        limit: pagination.limit,
      })
    );
  }, [dispatch, pagination.skip, pagination.limit]);

  const handlePageChange = (_event: unknown, newPage: number) => {
    dispatch(setSkip(newPage * pagination.limit));
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPageSize = parseInt(event.target.value, 10);
    dispatch(setPagination({ skip: 0, limit: newPageSize }));
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Orders
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ width: '100%' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>User ID</TableCell>
                <TableCell>Items</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Discounted</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">No orders found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order.id} hover>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{dayjs(order.date).format('MMM DD, YYYY')}</TableCell>
                    <TableCell>{order.userId}</TableCell>
                    <TableCell>{order.totalProducts}</TableCell>
                    <TableCell>{order.totalQuantity}</TableCell>
                    <TableCell>${order.total.toFixed(2)}</TableCell>
                    <TableCell>${order.discountedTotal.toFixed(2)}</TableCell>
                    <TableCell>
                      <Chip
                        label={order.status}
                        color={getStatusColor(order.status)}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={pagination.total}
          page={Math.floor(pagination.skip / pagination.limit)}
          onPageChange={handlePageChange}
          rowsPerPage={pagination.limit}
          onRowsPerPageChange={handleRowsPerPageChange}
          rowsPerPageOptions={[10, 25, 50]}
        />
      </Paper>
    </Box>
  );
}
