import { memo, useState, useEffect } from 'react';
import { Box, TextField, MenuItem, Slider, Typography, Paper } from '@mui/material';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { setFilters, selectAllCategories } from '../../features/products/productSlice';
import { useDebounce } from '../../features/products/hooks/useDebounce';
import { ProductFilters } from '../../types/product';

interface FilterPanelProps {
  onFiltersChange?: (filters: ProductFilters) => void;
}

export const FilterPanel = memo<FilterPanelProps>(({ onFiltersChange }) => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.products.filters);
  const categories = useAppSelector(selectAllCategories);
  const [searchInput, setSearchInput] = useState(filters.search);

  const debouncedSearch = useDebounce(searchInput, 500);

  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      dispatch(setFilters({ search: debouncedSearch }));
      onFiltersChange?.({ ...filters, search: debouncedSearch });
    }
  }, [debouncedSearch, dispatch, filters, onFiltersChange]);

  const handleCategoryChange = (category: string) => {
    dispatch(setFilters({ category }));
    onFiltersChange?.({ ...filters, category });
  };

  const handlePriceRangeChange = (
    _event: React.SyntheticEvent | Event,
    newValue: number | number[]
  ) => {
    const range = newValue as [number, number];
    dispatch(setFilters({ priceRange: range }));
    onFiltersChange?.({ ...filters, priceRange: range });
  };

  const maxPrice = 2000; // Fixed max price for the slider

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Filters
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Search Products"
          variant="outlined"
          fullWidth
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />

        <TextField
          select
          label="Category"
          variant="outlined"
          fullWidth
          value={filters.category}
          onChange={(e) => handleCategoryChange(e.target.value)}
        >
          <MenuItem value="">All Categories</MenuItem>
          {categories.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </TextField>

        <Box>
          <Typography gutterBottom>Price Range</Typography>
          <Slider
            value={filters.priceRange}
            onChange={handlePriceRangeChange}
            valueLabelDisplay="auto"
            min={0}
            max={maxPrice}
            step={50}
            marks={[
              { value: 0, label: '$0' },
              { value: maxPrice, label: `$${maxPrice}` },
            ]}
          />
        </Box>
      </Box>
    </Paper>
  );
});

FilterPanel.displayName = 'FilterPanel';
