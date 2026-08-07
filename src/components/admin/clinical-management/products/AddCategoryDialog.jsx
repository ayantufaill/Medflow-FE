import { Dialog, Box, Typography, TextField, Button, IconButton } from '@mui/material';
import { Close as CloseIcon, CategoryOutlined } from '@mui/icons-material';

const AddCategoryDialog = ({
  open,
  productDraftName,
  setProductDraftName,
  handleSaveInlineProduct,
  handleCancelInlineProduct
}) => {
  return (
    <Dialog
      open={open}
      onClose={handleCancelInlineProduct}
      maxWidth="sm"
      fullWidth
      sx={{ zIndex: 9999 }}
      PaperProps={{
        sx: { borderRadius: "12px", border: "1px solid #e0e5eb", overflow: "hidden" }
      }}
    >
      {/* Header */}
      <Box sx={{
        display: "flex", alignItems: "center", gap: "12px",
        px: "20px", py: "16px",
        borderBottom: "1px solid #e0e5eb",
        backgroundColor: "#f3f8fd",
      }}>
        <Box sx={{
          width: "36px", height: "36px", borderRadius: "8px",
          backgroundColor: "#eff6ff",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <CategoryOutlined sx={{ fontSize: "20px", color: "#2262ef" }} />
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: 1 }}>
          <Typography sx={{
            fontFamily: "Inter", fontSize: "15px", fontWeight: 700, color: "#09121f",
          }}>
            Add new product category
          </Typography>
          <Typography sx={{
            fontWeight: 400, color: "#5c646f", fontFamily: "Inter", fontSize: "11px",
          }}>
            Create a new product category to organize your clinical items.
          </Typography>
        </Box>

        <IconButton onClick={handleCancelInlineProduct} size="small" sx={{ color: "#6b7280" }}>
          <CloseIcon sx={{ fontSize: "18px" }} />
        </IconButton>
      </Box>

      {/* Content */}
      <Box sx={{ p: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
        <Box>
          <Typography sx={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 500, color: "#374151", mb: "6px" }}>
            Category Name
          </Typography>
          <TextField
            autoFocus
            fullWidth
            size="small"
            placeholder="Product Category Name"
            value={productDraftName}
            onChange={(e) => setProductDraftName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSaveInlineProduct();
            }}
            sx={{
              "& .MuiInputBase-root": { fontFamily: "Inter", fontSize: "13px", borderRadius: "8px" },
              "& .MuiInputBase-input": { color: "#374151", py: "8.5px" },
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "#d0d5dd" }
            }}
          />
        </Box>
      </Box>

      {/* Footer */}
      <Box sx={{
        display: "flex", alignItems: "center", justifyContent: "flex-end",
        px: "20px", py: "12px",
        borderTop: '1px solid #e0e5eb'
      }}>
        <Box sx={{ display: "flex", gap: "8px" }}>
          <Button
            variant="outlined"
            onClick={handleCancelInlineProduct}
            sx={{
              fontFamily: "Inter", fontSize: "13px", fontWeight: 500,
              textTransform: "none", borderRadius: "8px",
              border: "1px solid #d0d5dd", color: "#374151",
              px: "16px", py: "7px",
              "&:hover": { borderColor: "#9aa3ae", backgroundColor: "#f9fafb" },
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            disableElevation
            onClick={handleSaveInlineProduct}
            disabled={!productDraftName}
            sx={{
              fontFamily: "Inter", fontSize: "13px", fontWeight: 600,
              textTransform: "none", borderRadius: "8px",
              backgroundColor: "#2262ef", color: "#fff",
              px: "20px", py: "7px",
              "&:hover": { backgroundColor: "#1a50cc" },
              "&.Mui-disabled": { backgroundColor: "#c5d3f8", color: "#fff" },
            }}
          >
            Save
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default AddCategoryDialog;
