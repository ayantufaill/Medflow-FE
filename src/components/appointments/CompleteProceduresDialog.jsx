import {
  Box,
  Button,
  Chip,
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
  Typography,
} from "@mui/material";

const DIALOG_FONT = { fontSize: "0.8125rem" }; // project-consistent small
const DIALOG_FONT_SM = { fontSize: "0.75rem" };

const CompleteProceduresDialog = ({
  open,
  onClose,
  proceduresData,
  treatmentOptions,
  providerOptions,
  handleTreatmentChange,
  handleProviderChange,
  onAddProcedure,
  onCompleteAll,
}) => {
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
          "& .MuiTableCell-root": DIALOG_FONT,
          "& .MuiMenuItem-root": DIALOG_FONT,
          "& .MuiButton-root": DIALOG_FONT,
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
        Complete Procedures
      </DialogTitle>
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
          pb: 2,
          ...DIALOG_FONT,
        }}
      >
        <Typography
          variant="body2"
          sx={{
            ...DIALOG_FONT_SM,
            color: "#4b5563",
            mt: 0.5,
            mb: 0,
          }}
        >
          Providers assigned to this appointment:{" "}
          <Chip
            label="KIM"
            size="small"
            sx={{
              ml: 0.5,
              height: 20,
              ...DIALOG_FONT_SM,
              fontWeight: 600,
              bgcolor: "#e0f2fe",
              color: "#0369a1",
            }}
          />
        </Typography>

        <TableContainer
          sx={{
            border: "1px solid #e2e8f0",
            borderRadius: 1.5,
            overflow: "hidden",
          }}
        >
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: "#f8fafc" }}>
                <TableCell sx={{ fontWeight: 600, ...DIALOG_FONT_SM, color: "#475569", borderBottom: "1px solid #e2e8f0", py: 1 }}>
                  Procedure
                </TableCell>
                <TableCell sx={{ fontWeight: 600, ...DIALOG_FONT_SM, color: "#475569", borderBottom: "1px solid #e2e8f0", py: 1 }}>
                  Site
                </TableCell>
                <TableCell sx={{ fontWeight: 600, ...DIALOG_FONT_SM, color: "#475569", borderBottom: "1px solid #e2e8f0", py: 1 }}>
                  Treatment
                </TableCell>
                <TableCell sx={{ fontWeight: 600, ...DIALOG_FONT_SM, color: "#475569", borderBottom: "1px solid #e2e8f0", py: 1 }}>
                  Provider
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, ...DIALOG_FONT_SM, color: "#475569", borderBottom: "1px solid #e2e8f0", py: 1 }}>
                  Total Charge
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {proceduresData.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    borderBottom: index < proceduresData.length - 1 ? "1px solid #f1f5f9" : "none",
                  }}
                >
                  <TableCell sx={{ fontWeight: 600, color: "#1e293b", py: 1, ...DIALOG_FONT_SM }}>
                    {row.code}
                  </TableCell>
                  <TableCell sx={{ color: "#64748b", py: 1, ...DIALOG_FONT_SM }}>
                    {row.site || "-"}
                  </TableCell>
                  <TableCell sx={{ py: 1 }}>
                    <FormControl fullWidth size="small">
                      <Select
                        value={row.treatment}
                        onChange={(e) => handleTreatmentChange(index, e.target.value)}
                        variant="outlined"
                        sx={{ ...DIALOG_FONT_SM, minHeight: "auto", height: 32 }}
                        MenuProps={{ PaperProps: { sx: { "& .MuiMenuItem-root": DIALOG_FONT_SM } } }}
                      >
                        {treatmentOptions.map((option) => (
                          <MenuItem key={option} value={option} sx={{ ...DIALOG_FONT_SM, py: 0.75 }}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell sx={{ py: 1 }}>
                    <FormControl fullWidth size="small">
                      <Select
                        value={row.provider}
                        onChange={(e) => handleProviderChange(index, e.target.value)}
                        variant="outlined"
                        sx={{ ...DIALOG_FONT_SM, minHeight: "auto", height: 32 }}
                        MenuProps={{ PaperProps: { sx: { "& .MuiMenuItem-root": DIALOG_FONT_SM } } }}
                      >
                        {providerOptions.map((option) => (
                          <MenuItem key={option} value={option} sx={{ ...DIALOG_FONT_SM, py: 0.75 }}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600, color: "#1e293b", py: 1, ...DIALOG_FONT_SM }}>
                    {row.charge}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Button
            onClick={onAddProcedure}
            sx={{
              color: "#1976d2",
              textTransform: "none",
              ...DIALOG_FONT_SM,
              fontWeight: 500,
              "&:hover": { backgroundColor: "transparent", textDecoration: "underline" },
            }}
          >
            + Add Procedure
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              if (onCompleteAll) {
                onCompleteAll(proceduresData);
              }
            }}
            sx={{
              textTransform: "none",
              borderRadius: 1.5,
              bgcolor: "#10b981",
              px: 2,
              ...DIALOG_FONT_SM,
              fontWeight: 500,
              "&:hover": { bgcolor: "#059669" },
            }}
          >
            Complete All
          </Button>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 1, borderTop: "1px solid #e2e8f0" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mr: 2 }}>
          <input
            type="checkbox"
            id="checkout-appointment"
            style={{ width: 14, height: 14, cursor: "pointer", accentColor: "#1976d2" }}
          />
          <label htmlFor="checkout-appointment" style={{ ...DIALOG_FONT_SM, color: "#475569", cursor: "pointer" }}>
            check out appointment
          </label>
        </Box>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{ textTransform: "none", borderRadius: 1.5, borderColor: "#cbd5e1", color: "#475569", ...DIALOG_FONT_SM }}
        >
          Done
        </Button>
        <Button
          variant="contained"
          sx={{
            textTransform: "none",
            borderRadius: 1.5,
            bgcolor: "#1976d2",
            px: 2,
            ...DIALOG_FONT_SM,
            fontWeight: 600,
            "&:hover": { bgcolor: "#1565c0" },
          }}
        >
          Collect Payments
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CompleteProceduresDialog;

