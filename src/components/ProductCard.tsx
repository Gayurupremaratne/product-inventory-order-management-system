import { memo } from 'react';
import { Card, CardContent, CardMedia, Typography, Box, Chip } from '@mui/material';
import { Product } from '../../types/product';
import { formatCurrency } from '../../utils/format';

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
}

export const ProductCard = memo<ProductCardProps>(({ product, onClick }) => {
  return (
    <Card sx={{ cursor: onClick ? 'pointer' : 'default', height: '100%' }} onClick={onClick}>
      <CardMedia
        component="img"
        height="200"
        image={product.thumbnail}
        alt={product.title}
        sx={{ objectFit: 'contain', p: 1 }}
      />
      <CardContent>
        <Typography variant="h6" component="h3" noWrap>
          {product.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          {product.category}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Typography variant="h6" color="primary">
            {formatCurrency(product.price)}
          </Typography>
          <Chip label={`⭐ ${product.rating}`} size="small" variant="outlined" />
        </Box>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Stock: {product.stock}
        </Typography>
      </CardContent>
    </Card>
  );
});

ProductCard.displayName = 'ProductCard';
