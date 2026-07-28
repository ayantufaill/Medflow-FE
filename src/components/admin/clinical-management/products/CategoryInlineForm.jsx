import { Box, TextField, IconButton } from '@mui/material';
import { Save as SaveIcon, Close as CloseIcon } from '@mui/icons-material';

const CategoryInlineForm = ({
  productDraftName,
  setProductDraftName,
  handleSaveInlineProduct,
  handleCancelInlineProduct
}) => {
  return (
    <Box sx={{ py: 2, px: 3, mb: 3, border: '1px solid #bfdbfe', borderRadius: 2, backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', gap: 2 }}>
      <TextField
        autoFocus
        size="small"
        variant="outlined"
        placeholder="Product Category Name"
        value={productDraftName}
        onChange={(e) => setProductDraftName(e.target.value)}
        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: '#fff' }, '& .MuiInputBase-input': { fontSize: '0.9rem', py: 1 }, flex: 1 }}
      />
      <IconButton size="small" onClick={handleSaveInlineProduct} sx={{ color: '#10b981', backgroundColor: '#d1fae5', '&:hover': { backgroundColor: '#a7f3d0' }, p: 1 }}>
        <SaveIcon />
      </IconButton>
      <IconButton size="small" onClick={handleCancelInlineProduct} sx={{ color: '#ef4444', backgroundColor: '#fee2e2', '&:hover': { backgroundColor: '#fecaca' }, p: 1 }}>
        <CloseIcon />
      </IconButton>
    </Box>
  );
};

export default CategoryInlineForm;
