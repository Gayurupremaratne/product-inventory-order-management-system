import { useCallback } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import { fetchProductById } from '../productSlice';

export function usePrefetchProduct() {
  const dispatch = useAppDispatch();

  const prefetchProduct = useCallback(
    (id: number) => {
      // Prefetch without showing loading state - background fetch
      dispatch(fetchProductById(id));
    },
    [dispatch]
  );

  return { prefetchProduct };
}
