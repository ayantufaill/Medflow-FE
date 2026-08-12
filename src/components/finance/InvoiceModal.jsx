import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllProvidersForDropdown,
  selectProviderDropdownList,
} from "../../store/slices/providerSlice";
import {
  Box,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  TextField,
  IconButton,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import AddNewProcedureDialog from "./AddNewProcedureDialog";
import { calculatePortionsForCategory } from "../../utils/cdtCategoryHelper";
import { Close as CloseIcon, Receipt as ReceiptIcon } from "@mui/icons-material";
import { COLORS } from "../../constants/colors";

const InvoiceModal = ({ patient, invoiceData, onSave, onCancel, onClose }) => {
  const dispatch = useDispatch();
  const [showAddProcedure, setShowAddProcedure] = useState(false);
  const [procedures, setProcedures] = useState([]);
  const [addClaim, setAddClaim] = useState(false);

  // Procedures eligible for a claim: only those where dbi is false
  const claimProcedures = procedures.filter((p) => !p.dbi);

  // Providers from Redux (cached — won't re-fetch if already loaded)
  const providersList = useSelector(selectProviderDropdownList);
  useEffect(() => {
    dispatch(fetchAllProvidersForDropdown());
  }, [dispatch]);

  const handleSaveProcedure = async (savedData, keepOpen = false) => {
    if (!keepOpen) {
      setShowAddProcedure(false);
    }
    if (!savedData) return;

    const fee = parseFloat(savedData.fee || 0);
    const code = savedData.procedureCode || "";

    const portions = calculatePortionsForCategory({
      charge: fee,
      writeoff: 0,
      code,
      dbi: false,
      coverageTable: patient?.coverageTable || null,
    });

    const newProcedure = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
      date: new Date().toISOString().split("T")[0],
      code,
      site:
        savedData.selectedTeeth.join(",") +
        (savedData.selectedSurfaces.length > 0
          ? ` (${savedData.selectedSurfaces.join("")})`
          : ""),
      treatment: savedData.procedureDescription || "Custom Procedure",
      provider: "",
      writeoff: "$0.00",
      coveragePct: portions.coveragePct,
      ptPortion: `$${portions.ptPortion.toFixed(2)}`,
      insPortion: `$${portions.insPortion.toFixed(2)}`,
      charge: `$${fee.toFixed(2)}`,
      balance: `$${portions.balance.toFixed(2)}`,
      dbi: false,
      completed: true,
    };

    if (patient && patient._id) {
      try {
        const estimates = await invoiceService.estimateInvoiceItems(patient._id, [
          { code: newProcedure.code, charge: fee }
        ]);
        if (estimates && estimates.length > 0) {
          const est = estimates[0];
          newProcedure.insPortion = `$${Number(est.insPortion || 0).toFixed(2)}`;
          newProcedure.ptPortion = `$${Number(est.ptPortion || 0).toFixed(2)}`;
          newProcedure.balance = `$${(Number(est.insPortion || 0) + Number(est.ptPortion || 0)).toFixed(2)}`;
        }
      } catch (err) {
        console.warn("Failed to fetch estimate for procedure:", err);
      }
    }

    setProcedures((prev) => [...prev, newProcedure]);
  };

  const handleProviderChange = (procedureId, newProvider) => {
    setProcedures((prev) =>
      prev.map((p) =>
        p.id === procedureId ? { ...p, provider: newProvider } : p,
      ),
    );
  };

  const handleDeleteProcedure = (procedureId) => {
    setProcedures((prev) => prev.filter((p) => p.id !== procedureId));
  };

  const handleAmountChange = async (procedureId, field, value) => {
    let updatedProcedure = null;
    
    setProcedures((prev) => {
      return prev.map((p) => {
        if (p.id !== procedureId) return p;

        const updated = { ...p, [field]: value };
        updatedProcedure = updated;

        const numCharge =
          parseFloat(
            (updated.charge || "").toString().replace(/[^0-9.-]+/g, ""),
          ) || 0;
        const numWriteoff =
          parseFloat(
            (updated.writeoff || "").toString().replace(/[^0-9.-]+/g, ""),
          ) || 0;
        const dbiState = updated.dbi;

        if (["charge", "writeoff", "dbi"].includes(field)) {
          const portions = calculatePortionsForCategory({
            charge: numCharge,
            writeoff: numWriteoff,
            code: updated.code,
            dbi: dbiState,
            coverageTable: patient?.coverageTable || null,
            explicitPct: updated.coveragePct,
          });
          updated.insPortion = `$${portions.insPortion.toFixed(2)}`;
          updated.ptPortion = `$${portions.ptPortion.toFixed(2)}`;
          updated.balance = `$${portions.balance.toFixed(2)}`;
          updated.coveragePct = portions.coveragePct;
        } else if (["ptPortion", "insPortion"].includes(field)) {
          updated.balance = `$${Math.max(0, numCharge - numWriteoff).toFixed(2)}`;
        } else if (field === "charge") {
          updated.balance = `$${numCharge.toFixed(2)}`;
        }

        return updated;
      });
    });

    if (field === "charge" && patient && patient._id && updatedProcedure && !updatedProcedure.dbi) {
      try {
        const numCharge = parseFloat((updatedProcedure.charge || "").toString().replace(/[^0-9.-]+/g, "")) || 0;
        const estimates = await invoiceService.estimateInvoiceItems(patient._id, [
          { code: updatedProcedure.code, charge: numCharge }
        ]);
        if (estimates && estimates.length > 0) {
          const est = estimates[0];
          setProcedures((prev) => prev.map((p) => {
            if (p.id !== procedureId) return p;
            return {
              ...p,
              insPortion: `$${Number(est.insPortion || 0).toFixed(2)}`,
              ptPortion: `$${Number(est.ptPortion || 0).toFixed(2)}`,
              balance: `$${(Number(est.insPortion || 0) + Number(est.ptPortion || 0)).toFixed(2)}`
            };
          }));
        }
      } catch (err) {
        console.warn("Failed to fetch estimate after charge change:", err);
      }
    }
  };

  const handleReestimate = () => {
    setProcedures((prev) =>
      prev.map((p) => {
        const numCharge =
          parseFloat((p.charge || "").toString().replace(/[^0-9.-]+/g, "")) || 0;
        const numWriteoff =
          parseFloat((p.writeoff || "").toString().replace(/[^0-9.-]+/g, "")) || 0;
        const portions = calculatePortionsForCategory({
          charge: numCharge,
          writeoff: numWriteoff,
          code: p.code,
          dbi: p.dbi,
          coverageTable: patient?.coverageTable || null,
        });
        return {
          ...p,
          insPortion: `$${portions.insPortion.toFixed(2)}`,
          ptPortion: `$${portions.ptPortion.toFixed(2)}`,
          balance: `$${portions.balance.toFixed(2)}`,
          coveragePct: portions.coveragePct,
        };
      })
    );
  };

  const ProviderDropdown = ({ value, onChange }) => {
    return (
      <Select
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        displayEmpty
        variant="outlined"
        size="small"
        MenuProps={{ 
          style: { zIndex: 150000 }, 
          sx: { zIndex: 150000 },
          anchorOrigin: { vertical: "bottom", horizontal: "left" },
          transformOrigin: { vertical: "top", horizontal: "left" }
        }}
        renderValue={(selected) => {
          if (!selected) return "Sel";
          return selected.substring(0, 2).toUpperCase();
        }}
        sx={{
          bgcolor: "white",
          color: COLORS.TEXT_PRIMARY,
          borderRadius: "4px",
          fontSize: "12px",
          width: "70px",
          "& .MuiSelect-select": {
            py: 0.5,
            px: 1,
            display: "flex",
            alignItems: "center",
          },
          "& .MuiSvgIcon-root": {
            color: COLORS.TEXT_SECONDARY,
            fontSize: "16px",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: COLORS.BORDER,
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: '#9ca3af',
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: COLORS.ACCENT,
          }
        }}
      >
        <MenuItem value="" disabled sx={{ fontSize: "12px" }}>
          <em>Select Provider</em>
        </MenuItem>
        {providersList.map((p) => {
          const firstName = p.userId?.firstName || p.firstName || "";
          const lastName = p.userId?.lastName || p.lastName || "";
          const name =
            `${firstName} ${lastName}`.trim() ||
            p.name ||
            `Provider ${p._id || p.id}`;
          return (
            <MenuItem
              key={p._id || p.id}
              value={name}
              sx={{ fontSize: "12px" }}
            >
              {name}
            </MenuItem>
          );
        })}
      </Select>
    );
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', bgcolor: 'white', borderRadius: '14px', overflow: 'hidden' }}>
      <DialogTitle
        sx={{
          boxSizing: "border-box",
          px: "25px",
          py: "8px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          borderBottom: `1px solid ${COLORS.BORDER}`,
          backgroundColor: COLORS.SURFACE_TINT,
          m: 0,
          flexShrink: 0,
        }}
      >
        <ReceiptIcon sx={{ fontSize: "20px", color: COLORS.ACCENT }} />
        <Typography sx={{ fontSize: "15px", fontWeight: 600, color: COLORS.TEXT_PRIMARY, flex: 1 }}>
          {invoiceData?.invoiceId ? `Invoice #${invoiceData.invoiceId}` : 'New Invoice'}
        </Typography>
        <IconButton onClick={onClose || onCancel} size="small" sx={{ color: COLORS.TEXT_SECONDARY }}>
          <CloseIcon sx={{ fontSize: "18px" }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: procedures.length > 0 ? 0 : 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {procedures.length === 0 ? (
          <Typography sx={{ color: "#666", fontSize: "14px", my: 2 }}>
            There are no completed procedures ready to be billed
          </Typography>
        ) : (
          <Box sx={{ width: "100%", px: 3, pt: 2 }}>
            <Box
              sx={{
                borderBottom: `1px solid ${COLORS.BORDER}`,
                pb: 1,
                mb: 1,
                textAlign: "left",
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  color: COLORS.ACCENT,
                  display: "inline-block",
                  mr: 2,
                  fontSize: "13px",
                  fontWeight: 600,
                }}
              >
                {new Date().toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" })}
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{ display: "inline-block", color: COLORS.TEXT_SECONDARY, fontSize: "13px" }}
              >
                No descriptions
              </Typography>
            </Box>
            <TableContainer sx={{ boxShadow: "none" }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontSize: "11px", color: COLORS.TEXT_SECONDARY, fontWeight: 600, py: 1 }}>DATE</TableCell>
                    <TableCell sx={{ fontSize: "11px", color: COLORS.TEXT_SECONDARY, fontWeight: 600, py: 1 }}>CODE</TableCell>
                    <TableCell sx={{ fontSize: "11px", color: COLORS.TEXT_SECONDARY, fontWeight: 600, py: 1 }}>SITE</TableCell>
                    <TableCell sx={{ fontSize: "11px", color: COLORS.TEXT_SECONDARY, fontWeight: 600, py: 1 }}>TREATMENT</TableCell>
                    <TableCell sx={{ fontSize: "11px", color: COLORS.TEXT_SECONDARY, fontWeight: 600, py: 1 }}>PROVIDER</TableCell>
                    <TableCell sx={{ fontSize: "11px", color: COLORS.TEXT_SECONDARY, fontWeight: 600, py: 1 }}>WRITEOFF</TableCell>
                    <TableCell sx={{ fontSize: "11px", color: COLORS.TEXT_SECONDARY, fontWeight: 600, py: 1 }}>PT PORTION</TableCell>
                    <TableCell sx={{ fontSize: "11px", color: COLORS.TEXT_SECONDARY, fontWeight: 600, py: 1 }}>INS PORTION</TableCell>
                    <TableCell sx={{ fontSize: "11px", color: COLORS.TEXT_SECONDARY, fontWeight: 600, py: 1 }}>CHARGE</TableCell>
                    <TableCell sx={{ fontSize: "11px", color: COLORS.ACCENT, fontWeight: 600, py: 1 }}>BALANCE</TableCell>
                    <TableCell sx={{ py: 1 }}></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {procedures.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell sx={{ color: COLORS.TEXT_PRIMARY, py: 1 }}>{row.date}</TableCell>
                      <TableCell sx={{ color: COLORS.TEXT_PRIMARY, py: 1 }}>{row.code}</TableCell>
                      <TableCell sx={{ color: COLORS.TEXT_PRIMARY, py: 1 }}>{row.site || "-"}</TableCell>
                      <TableCell sx={{ color: COLORS.TEXT_PRIMARY, py: 1 }}>{row.treatment}</TableCell>
                      <TableCell sx={{ py: 1 }}>
                        <ProviderDropdown
                          value={row.provider}
                          onChange={(val) => handleProviderChange(row.id, val)}
                        />
                      </TableCell>
                      <TableCell sx={{ color: COLORS.TEXT_PRIMARY, py: 1 }}>{row.writeoff}</TableCell>
                      <TableCell sx={{ color: COLORS.TEXT_PRIMARY, py: 1 }}>{row.ptPortion}</TableCell>
                      <TableCell sx={{ color: COLORS.TEXT_PRIMARY, py: 1 }}>{row.insPortion}</TableCell>
                      <TableCell sx={{ py: 1 }}>
                        <TextField
                          size="small"
                          value={row.charge}
                          onChange={(e) => handleAmountChange(row.id, "charge", e.target.value)}
                          sx={{ width: "80px", "& .MuiInputBase-input": { py: 0.5, px: 1, fontSize: "12px" } }}
                        />
                      </TableCell>
                      <TableCell sx={{ color: COLORS.ACCENT, fontWeight: 600, py: 1 }}>{row.balance}</TableCell>
                      <TableCell sx={{ py: 1 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                size="small"
                                checked={row.dbi || false}
                                onChange={(e) => handleAmountChange(row.id, "dbi", e.target.checked)}
                                sx={{ p: 0.5, color: COLORS.TEXT_SECONDARY }}
                              />
                            }
                            label={<Typography sx={{ fontSize: "11px", color: COLORS.TEXT_SECONDARY }}>DBI</Typography>}
                            sx={{ m: 0 }}
                          />
                          <Box
                            onClick={() => handleAmountChange(row.id, "completed", row.completed === undefined ? false : !row.completed)}
                            sx={{
                              bgcolor: row.completed === false ? "#d32f2f" : "#8bc34a",
                              color: "white",
                              borderRadius: "4px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: "20px",
                              height: "20px",
                              cursor: "pointer",
                              fontSize: "12px"
                            }}
                          >
                            {row.completed === false ? "✗" : "✓"}
                          </Box>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ borderTop: `1px solid ${COLORS.BORDER}`, p: 2, display: 'flex', justifyContent: 'space-between', bgcolor: COLORS.SURFACE_TINT }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button
            variant="contained"
            size="small"
            sx={{ bgcolor: COLORS.ACCENT, color: "white", textTransform: "none", boxShadow: 'none', "&:hover": { bgcolor: "#1565c0", boxShadow: 'none' } }}
            onClick={() => setShowAddProcedure(true)}
          >
            +Add Procedure
          </Button>
          <Button
            variant="outlined"
            size="small"
            sx={{ 
              fontFamily: "Inter", fontSize: "13px", fontWeight: 500,
              textTransform: "none", borderRadius: "8px",
              border: "1px solid #f97316", color: "#f97316",
              px: "16px", py: "4px", bgcolor: 'white',
              "&:hover": { borderColor: "#ea6c00", backgroundColor: "#fff7ed" }
            }}
          >
            Re-estimate
          </Button>
          <Button
            variant="text"
            size="small"
            sx={{ color: COLORS.ACCENT, textTransform: "none", fontWeight: 600 }}
          >
            + Add description
          </Button>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={addClaim}
                onChange={(e) => setAddClaim(e.target.checked)}
                size="small"
              />
            }
            label={<Typography sx={{ fontSize: '13px', color: COLORS.TEXT_PRIMARY }}>Add Claim</Typography>}
            sx={{ m: 0 }}
          />

          <Button
            variant="contained"
            size="small"
            onClick={() => { if (onSave) onSave({ procedures, addClaim, claimProcedures }); }}
            sx={{ bgcolor: COLORS.ACCENT, color: "white", textTransform: "none", boxShadow: 'none', "&:hover": { bgcolor: "#1565c0" } }}
          >
            Add New Invoice
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={onCancel || onClose}
            sx={{ color: COLORS.TEXT_SECONDARY, borderColor: COLORS.BORDER, textTransform: "none", bgcolor: "white", "&:hover": { bgcolor: "#f5f5f5" } }}
          >
            Cancel
          </Button>
        </Box>
      </DialogActions>

      {showAddProcedure && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1400,
          }}
          onClick={() => setShowAddProcedure(false)}
        >
          <Box
            sx={{
              maxWidth: "600px",
              width: "90%",
              bgcolor: "transparent",
              borderRadius: "4px",
              overflow: "visible",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <AddNewProcedureDialog
              onClose={() => setShowAddProcedure(false)}
              onSave={handleSaveProcedure}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default InvoiceModal;
