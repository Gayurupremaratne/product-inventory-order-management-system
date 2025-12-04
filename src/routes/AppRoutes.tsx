import { Suspense, lazy, memo } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import LoadingFallback from '../components/LoadingFallback';

const ProductListPage = lazy(() => import('../features/products/ProductListPage'));

const ProductDetailsPage = lazy(() => import('../features/products/ProductDetailsPage'));

const OrderListPage = lazy(() => import('../features/orders/OrderListPage'));

export const AppRoutes = memo(() => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Navigate to="/products" replace />} />
          <Route path="products" element={<ProductListPage />} />
          <Route path="products/:id" element={<ProductDetailsPage />} />
          <Route path="orders" element={<OrderListPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
});

AppRoutes.displayName = 'AppRoutes';
