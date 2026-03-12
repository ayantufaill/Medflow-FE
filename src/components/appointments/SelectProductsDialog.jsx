import { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";

const DIALOG_FONT = { fontSize: "0.8125rem" };
const DIALOG_FONT_SM = { fontSize: "0.75rem" };

const defaultProducts = [
  {
    id: 1,
    productName: "Mechanical toothbrush",
    productChoice: "Sonicare",
    provider: "Ronald Townsend",
    price: 150,
    quantity: 1,
    bought: false,
  },
  {
    id: 2,
    productName: "Toothpaste",
    productChoice: "CariFree CTx4 Gel 5000",
    provider: "Ronald Townsend",
    price: 25,
    quantity: 1,
    bought: false,
  },
];

const providerOptions = ["Ronald Townsend", "KIM", "DR", "JOHN", "SARAH"];

const SelectProductsDialog = ({ open, onClose }) => {
  const [rows, setRows] = useState(defaultProducts);

  const handleQuantityChange = (id, value) => {
    const num = Math.max(0, parseInt(value, 10) || 0);
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, quantity: num } : r))
    );
  };

  const handleProviderChange = (id, value) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, provider: value } : r))
    );
  };

  const handleBuy = (id) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, bought: true } : r))
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: "0 12px 32px rgba(0,0,0,0.1)",
          "& .MuiDialogTitle-root": DIALOG_FONT,
          "& .MuiDialogContent-root": DIALOG_FONT,
        },
      }}
    >
      <DialogTitle
        sx={{
          py: 1.25,
          fontWeight: 600,
          textAlign: "center",
          bgcolor: "#2b6cb0",
          color: "#ffffff",
          ...DIALOG_FONT,
        }}
      >
        Select Products & Quantity
      </DialogTitle>
      <DialogContent sx={{ p: 0, ...DIALOG_FONT }}>
        <TableContainer sx={{ border: "1px solid #e2e8f0" }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: "#f8fafc" }}>
                <TableCell sx={{ fontWeight: 600, ...DIALOG_FONT_SM, color: "#475569", borderBottom: "1px solid #e2e8f0", py: 1 }}>
                  Product Name
                </TableCell>
                <TableCell sx={{ fontWeight: 600, ...DIALOG_FONT_SM, color: "#475569", borderBottom: "1px solid #e2e8f0", py: 1 }}>
                  Product Choice
                </TableCell>
                <TableCell sx={{ fontWeight: 600, ...DIALOG_FONT_SM, color: "#475569", borderBottom: "1px solid #e2e8f0", py: 1 }}>
                  Provider
                </TableCell>
                <TableCell sx={{ fontWeight: 600, ...DIALOG_FONT_SM, color: "#475569", borderBottom: "1px solid #e2e8f0", py: 1 }}>
                  Price
                </TableCell>
                <TableCell sx={{ fontWeight: 600, ...DIALOG_FONT_SM, color: "#475569", borderBottom: "1px solid #e2e8f0", py: 1 }}>
                  Quantity
                </TableCell>
                <TableCell sx={{ fontWeight: 600, ...DIALOG_FONT_SM, color: "#475569", borderBottom: "1px solid #e2e8f0", py: 1 }}>
                  Total Price
                </TableCell>
                <TableCell sx={{ fontWeight: 600, ...DIALOG_FONT_SM, color: "#475569", borderBottom: "1px solid #e2e8f0", py: 1 }} />
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{
                    "&:last-child td": { borderBottom: 0 },
                    borderBottom: "1px solid #f1f5f9",
                  }}
                >
                  <TableCell sx={{ ...DIALOG_FONT_SM, color: "#1e293b", py: 1 }}>
                    {row.productName}
                  </TableCell>
                  <TableCell sx={{ ...DIALOG_FONT_SM, color: "#64748b", py: 1 }}>
                    {row.productChoice}
                  </TableCell>
                  <TableCell sx={{ py: 1 }}>
                    <FormControl size="small" fullWidth sx={{ minWidth: 140 }}>
                      <Select
                        value={row.provider}
                        onChange={(e) => handleProviderChange(row.id, e.target.value)}
                        variant="outlined"
                        sx={{ ...DIALOG_FONT_SM, height: 32 }}
                        MenuProps={{ PaperProps: { sx: { "& .MuiMenuItem-root": DIALOG_FONT_SM } } }}
                      >
                        {providerOptions.map((opt) => (
                          <MenuItem key={opt} value={opt} sx={{ ...DIALOG_FONT_SM }}>
                            {opt}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell sx={{ ...DIALOG_FONT_SM, color: "#1e293b", py: 1 }}>
                    ${row.price.toFixed(2)}
                  </TableCell>
                  <TableCell sx={{ py: 1 }}>
                    <TextField
                      type="number"
                      size="small"
                      value={row.quantity}
                      onChange={(e) => handleQuantityChange(row.id, e.target.value)}
                      inputProps={{ min: 0, style: { textAlign: "center" } }}
                      sx={{ width: 72, "& .MuiInputBase-input": { ...DIALOG_FONT_SM, py: 0.5 } }}
                    />
                  </TableCell>
                  <TableCell sx={{ ...DIALOG_FONT_SM, fontWeight: 600, color: "#1e293b", py: 1 }}>
                    ${(row.price * row.quantity).toFixed(2)}
                  </TableCell>
                  <TableCell sx={{ py: 1 }}>
                    {row.bought ? (
                      <Box
                        sx={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          bgcolor: "#10b981",
                          color: "#fff",
                        }}
                      >
                        <CheckIcon sx={{ fontSize: 18 }} />
                      </Box>
                    ) : (
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleBuy(row.id)}
                        sx={{
                          textTransform: "none",
                          ...DIALOG_FONT_SM,
                          bgcolor: "#a1806b",
                          color: "#fff",
                          "&:hover": { bgcolor: "#8b6f5c" },
                        }}
                      >
                        buy
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions sx={{ p: 2, borderTop: "1px solid #e2e8f0" }}>
        <Box sx={{ flex: 1 }} />
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            textTransform: "none",
            ...DIALOG_FONT_SM,
            fontWeight: 600,
            bgcolor: "#a1806b",
            color: "#fff",
            px: 2.5,
            "&:hover": { bgcolor: "#8b6f5c" },
          }}
        >
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SelectProductsDialog;
