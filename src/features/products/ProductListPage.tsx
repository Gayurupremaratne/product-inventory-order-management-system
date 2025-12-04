import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, TextField, MenuItem, Alert } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  fetchProducts,
  setFilters,
  setPagination,
  selectProducts,
  selectProductsLoading,
  selectProductsError,
  selectFilters,
  selectPagination,
} from './productSlice';

export default function ProductListPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const products = useAppSelector(selectProducts);
  const loading = useAppSelector(selectProductsLoading);
  const error = useAppSelector(selectProductsError);
  const filters = useAppSelector(selectFilters);
  const pagination = useAppSelector(selectPagination);

  const [searchInput, setSearchInput] = useState(filters.search);

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setFilters({ search: searchInput }));
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput, dispatch]);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch, pagination.skip, pagination.limit, filters.search, filters.category]);

  const handlePaginationChange = (model: GridPaginationModel) => {
    dispatch(setPagination({ page: model.page, pageSize: model.pageSize }));
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'title', headerName: 'Title', width: 250, flex: 1 },
    { field: 'brand', headerName: 'Brand', width: 150 },
    { field: 'category', headerName: 'Category', width: 150 },
    {
      field: 'price',
      headerName: 'Price',
      width: 100,
      valueFormatter: (value) => `$${value}`,
    },
    { field: 'stock', headerName: 'Stock', width: 100 },
    {
      field: 'rating',
      headerName: 'Rating',
      width: 100,
      valueFormatter: (value) => `${value}/5`,
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Products
      </Typography>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            label="Search products"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            sx={{ minWidth: 300 }}
          />
          <TextField
            select
            label="Category"
            value={filters.category}
            onChange={(e) => dispatch(setFilters({ category: e.target.value }))}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="">All Categories</MenuItem>
            <MenuItem value="smartphones">Smartphones</MenuItem>
            <MenuItem value="laptops">Laptops</MenuItem>
            <MenuItem value="fragrances">Fragrances</MenuItem>
            <MenuItem value="skincare">Skincare</MenuItem>
            <MenuItem value="groceries">Groceries</MenuItem>
            <MenuItem value="home-decoration">Home Decoration</MenuItem>
          </TextField>
        </Box>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={products}
          columns={columns}
          loading={loading}
          pageSizeOptions={[10, 25, 50]}
          paginationModel={{
            page: Math.floor(pagination.skip / pagination.limit),
            pageSize: pagination.limit,
          }}
          onPaginationModelChange={handlePaginationChange}
          rowCount={pagination.total}
          paginationMode="server"
          onRowClick={(params) => navigate(`/products/${params.id}`)}
          sx={{
            '& .MuiDataGrid-row': {
              cursor: 'pointer',
            },
          }}
        />
      </Paper>
    </Box>
  );
}
