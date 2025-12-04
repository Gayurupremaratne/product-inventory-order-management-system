import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Chip,
  TextField,
  Switch,
  FormControlLabel,
  CircularProgress,
  Alert,
} from '@mui/material';
import { ArrowBack, Edit, Save, Cancel } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  fetchProductById,
  updateProduct,
  selectCurrentProduct,
  selectProductsLoading,
  selectProductsError,
  clearCurrentProduct,
} from './productSlice';
import { ConfirmationDialog } from '../../components/ConfirmationDialog';

export default function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const product = useAppSelector(selectCurrentProduct);
  const loading = useAppSelector(selectProductsLoading);
  const error = useAppSelector(selectProductsError);

  const [isEditing, setIsEditing] = useState(false);
  const [editedStock, setEditedStock] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const previousProductId = useRef<number | null>(null);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(Number(id)));
    }
    return () => {
      dispatch(clearCurrentProduct());
    };
  }, [id, dispatch]);

  useEffect(() => {
    if (product && product.id !== previousProductId.current) {
      const productId = product.id;
      previousProductId.current = productId;
      // Schedule state updates to avoid cascading renders
      setEditedStock(product.stock);
      setIsActive(product.isActive ?? true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id]);

  const handleSave = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmSave = async () => {
    if (!product) return;

    setShowConfirmDialog(false);

    try {
      await dispatch(
        updateProduct({
          id: product.id,
          data: {
            stock: editedStock,
            isActive,
          },
        })
      ).unwrap();

      enqueueSnackbar('Product updated successfully', { variant: 'success' });
      setIsEditing(false);
    } catch {
      enqueueSnackbar('Failed to update product', { variant: 'error' });
    }
  };

  const handleCancel = () => {
    if (product) {
      setEditedStock(product.stock);
      setIsActive(product.isActive ?? true);
    }
    setIsEditing(false);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Alert severity="error">{error}</Alert>
        <Button onClick={() => navigate('/products')} startIcon={<ArrowBack />} sx={{ mt: 2 }}>
          Back to Products
        </Button>
      </Box>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <Box>
      <Box
        sx={{
          mb: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Button onClick={() => navigate('/products')} startIcon={<ArrowBack />}>
          Back to Products
        </Button>
        {!isEditing ? (
          <Button variant="contained" startIcon={<Edit />} onClick={() => setIsEditing(true)}>
            Edit
          </Button>
        ) : (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="outlined" startIcon={<Cancel />} onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant="contained" startIcon={<Save />} onClick={handleSave}>
              Save
            </Button>
          </Box>
        )}
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <img
              src={product.thumbnail}
              alt={product.title}
              style={{ width: '100%', borderRadius: 8 }}
            />
            <Box sx={{ display: 'flex', gap: 1, mt: 2, overflowX: 'auto' }}>
              {product.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`${product.title} ${idx + 1}`}
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 4,
                    objectFit: 'cover',
                  }}
                />
              ))}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
              {product.title}
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Chip label={product.category} color="primary" sx={{ mr: 1 }} />
              <Chip label={product.brand} variant="outlined" />
            </Box>

            <Typography variant="h5" color="primary" gutterBottom>
              ${product.price}
            </Typography>

            {product.discountPercentage > 0 && (
              <Chip
                label={`${product.discountPercentage}% OFF`}
                color="success"
                size="small"
                sx={{ mb: 2 }}
              />
            )}

            <Typography variant="body1" paragraph>
              {product.description}
            </Typography>

            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Rating: {product.rating}/5
              </Typography>

              {isEditing ? (
                <>
                  <TextField
                    label="Stock"
                    type="number"
                    value={editedStock}
                    onChange={(e) => setEditedStock(Number(e.target.value))}
                    fullWidth
                    sx={{ mt: 2 }}
                  />
                  <FormControlLabel
                    control={
                      <Switch checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
                    }
                    label="Active"
                    sx={{ mt: 2 }}
                  />
                </>
              ) : (
                <>
                  <Typography variant="body1">Stock: {product.stock}</Typography>
                  <Typography variant="body1">
                    Status: {isActive ? 'Active' : 'Inactive'}
                  </Typography>
                </>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <ConfirmationDialog
        open={showConfirmDialog}
        title="Confirm Save"
        message="Are you sure you want to save these changes?"
        confirmText="Save"
        cancelText="Cancel"
        onConfirm={handleConfirmSave}
        onCancel={() => setShowConfirmDialog(false)}
      />
    </Box>
  );
}
