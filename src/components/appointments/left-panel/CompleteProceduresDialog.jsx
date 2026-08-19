import React, { useState, useEffect } from "react";
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
  IconButton,
} from "@mui/material";
import { Close, CheckCircle as CheckCircleIcon, CheckCircleOutline as CheckCircleOutlineIcon } from "@mui/icons-material";
import { roundedSelectMenuProps } from "../../../constants/styles";
import { COLORS } from "../../../constants/colors";

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
  onCollectPayments,
  onDone,
}) => {
  const [completedMap, setCompletedMap] = useState({});

  useEffect(() => {
    if (open && proceduresData && proceduresData.length > 0) {
      const initialMap = {};
      proceduresData.forEach((p, idx) => {
        const val = p.completed;
        initialMap[idx] = val === true || val === "true" || val === 1 || String(val).toLowerCase() === 'true';
      });
      setCompletedMap(initialMap);
    }
  }, [proceduresData, open]);

  const toggleCompleted = (idx) => {
    setCompletedMap(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const getFilteredProcedures = () => {
    return (proceduresData || []).filter((_, idx) => completedMap[idx]);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      sx={{ zIndex: 1310 }}
      PaperProps={{
        sx: {
          borderRadius: '12px',
          border: '1px solid #e0e5eb',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          "& .MuiDialogTitle-root": { ...DIALOG_FONT, fontSize: '16px' },
          "& .MuiDialogContent-root": DIALOG_FONT,
          "& .MuiTableCell-root": DIALOG_FONT,
          "& .MuiMenuItem-root": DIALOG_FONT,
          "& .MuiButton-root": DIALOG_FONT,
        },
      }}
    >
      <DialogTitle
        sx={{
          px: '20px',
          py: '12px',
          fontFamily: "Inter",
          fontSize: "15px",
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          bgcolor: "#f3f8fd",
          color: "#09121f",
          borderBottom: '1px solid #e0e5eb',
        }}
      >
        <Box>Complete Procedures</Box>
        <IconButton onClick={onClose} size="small" sx={{ color: "#6b7280" }}>
          <Close fontSize="small" />
        </IconButton>
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
            mt: 1.5,
            mb: 0,
          }}
        >
          Providers assigned to this appointment:{" "}
          {Array.from(new Set((Array.isArray(proceduresData) ? proceduresData : []).map(p => p.provider).filter(Boolean))).map((provider, idx) => (
            <Chip
              key={idx}
              label={provider}
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
          ))}
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
                <TableCell align="center" sx={{ fontWeight: 600, ...DIALOG_FONT_SM, color: "#475569", borderBottom: "1px solid #e2e8f0", py: 1, width: 32 }}>
                  
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(Array.isArray(proceduresData) ? proceduresData : []).map((row, index) => (
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
                  <TableCell align="center" sx={{ py: 1 }}>
                    <Box onClick={() => toggleCompleted(index)} sx={{ cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {completedMap[index] ? (
                        <CheckCircleIcon sx={{ fontSize: "18px", color: "#4ade80" }} />
                      ) : (
                        <CheckCircleOutlineIcon sx={{ fontSize: "18px", color: "#d1d5db" }} />
                      )}
                    </Box>
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
            disableElevation
            onClick={() => {
              if (onCompleteAll) {
                // Check all internally and pass all
                const allMap = {};
                proceduresData.forEach((_, idx) => { allMap[idx] = true; });
                setCompletedMap(allMap);
                onCompleteAll(proceduresData);
              }
            }}
            sx={{
              fontFamily: "Inter", fontSize: "13px", fontWeight: 500,
              textTransform: "none", borderRadius: "8px",
              backgroundColor: "#2262ef", color: "#fff",
              height: "36px", px: "20px",
              "&:hover": { backgroundColor: "#1e53cc" },
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
          onClick={() => {
            console.log('[DEBUG-DIALOG] Done clicked. onDone is:', typeof onDone);
            console.log('[DEBUG-DIALOG] getFilteredProcedures:', JSON.stringify(getFilteredProcedures().map(p => ({ code: p.code, completed: p.completed }))));
            if (onDone) onDone(getFilteredProcedures());
            onClose();
          }}
          variant="outlined"
          color="inherit"
          sx={{
            fontFamily: "Inter", fontSize: "13px", fontWeight: 500,
            textTransform: "none", borderRadius: "8px",
            border: "1px solid #d0d5dd", color: "#374151",
            height: "36px", px: "20px",
            "&:hover": { borderColor: "#9aa3ae", backgroundColor: "#f9fafb" },
          }}
        >
          Done
        </Button>
        <Button
          variant="contained"
          disableElevation
          onClick={() => {
            if (onCollectPayments) onCollectPayments(getFilteredProcedures());
          }}
          sx={{
            fontFamily: "Inter", fontSize: "13px", fontWeight: 500,
            textTransform: "none", borderRadius: "8px",
            backgroundColor: "#2262ef", color: "#fff",
            height: "36px", px: "20px",
            "&:hover": { backgroundColor: "#1e53cc" },
          }}
        >
          Collect Payments
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CompleteProceduresDialog;

