import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  RadioGroup,
  Radio,
  FormControlLabel,
  Checkbox,
  InputBase,
  Button,
  TextField,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import { invoiceService } from "../../services/invoice.service";
import { COLORS } from '../../constants/colors';
import { radius, fontWeight } from '../../constants/styles';

const AccountAdjustmentDialog = ({ patient, onClose, onSave }) => {
  const [adjustmentType, setAdjustmentType] = useState("Un-Collected");
  const [rateType, setRateType] = useState("Flat rate");
  const [outstandingType, setOutstandingType] = useState("total");
  const [specificAmount, setSpecificAmount] = useState("$ 0");
  const [includeCourtesy, setIncludeCourtesy] = useState(false);
  const [description, setDescription] = useState("");

  const [totalOutstanding, setTotalOutstanding] = useState(0);
  const [patientOutstanding, setPatientOutstanding] = useState(0);
  const courtesyCredit = 0.0;

  useEffect(() => {
    const fetchBalance = async () => {
      const patientId = patient?.id || patient?._id;
      if (!patientId) return;
      try {
        const balanceData = await invoiceService.getPatientBalance(patientId);
        if (balanceData) {
          const bal = balanceData.balance || 0;
          setTotalOutstanding(bal);
          setPatientOutstanding(bal);
        }
      } catch (err) {
        console.error("Error fetching patient balance:", err);
      }
    };
    fetchBalance();
  }, [patient]);

  // Adjustment type options - can be fetched from API
  const adjustmentTypeOptions = [
    "Un-Collected",
    "Professional Courtesy",
    "Immediate Family Courtesy",
    "OON paid",
    "Sunbit Fee",
    "Courtesy 3% for cash pay",
    "Alle Rewards",
    "Uncollect: de-escalate situation",
    "No balance billing",
    "Pro bono",
    "Fee included in Invisalign treatment",
    "Downgrade",
    "Care Credit fee",
    "Employee benefit",
    "Cherry Fee",
    "HFD Fee",
  ];

  // Rate type options - can be fetched from API
  const rateTypeOptions = ["Flat rate", "Percentage"];

  // Outstanding type options
  const outstandingTypeOptions = [
    { value: "total", label: "Total Outstanding", amount: totalOutstanding },
    { value: "patient", label: "Patient Outstanding", amount: patientOutstanding },
    { value: "specific", label: "Specific", amount: null },
  ];

  const calculateAdjustmentValue = () => {
    let value = 0;

    if (outstandingType === "total") {
      value = totalOutstanding;
    } else if (outstandingType === "patient") {
      value = patientOutstanding;
    } else if (outstandingType === "specific") {
      value = parseFloat(specificAmount.replace(/[^0-9.-]+/g, "")) || 0;
    }

    if (rateType === "Percentage") {
      // Assuming 100% for flat rate, adjust as needed
      value = value;
    }

    if (includeCourtesy) {
      value += courtesyCredit;
    }

    return value.toFixed(2);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', bgcolor: 'white', borderRadius: '14px', overflow: 'hidden' }}>
      {/* Header Bar */}
      <DialogTitle
        sx={{
          boxSizing: 'border-box',
          px: '25px',
          py: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          borderBottom: `1px solid ${COLORS.BORDER}`,
          backgroundColor: COLORS.SURFACE_TINT,
          m: 0,
          flexShrink: 0,
        }}
      >
        <AccountBalanceWalletOutlinedIcon sx={{ fontSize: '20px', color: COLORS.ACCENT }} />
        <Typography sx={{ fontSize: '15px', fontWeight: 600, color: COLORS.TEXT_PRIMARY, flex: 1 }}>
          Account Adjustment
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: COLORS.TEXT_SECONDARY }}>
          <CloseIcon sx={{ fontSize: '18px' }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: '25px', py: '20px', pt: '25px !important', display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* First Row: Date and Adjustment Type */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            borderBottom: `1px solid ${COLORS.BORDER}`,
            pb: 2,
          }}
        >
          <Typography sx={{ color: COLORS.TEXT_SECONDARY, fontSize: "13px", fontWeight: fontWeight.medium }}>
            04/15/2026
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexGrow: 1 }}>
            <Typography sx={{ color: COLORS.TEXT_PRIMARY, fontSize: "13px", fontWeight: fontWeight.medium }}>
              Adjustment Type
            </Typography>
            <Select
              variant="outlined"
              size="small"
              value={adjustmentType}
              onChange={(e) => setAdjustmentType(e.target.value)}
              sx={{
                width: '240px',
                height: '36px',
                fontSize: "13px",
                '& .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.BORDER },
                bgcolor: COLORS.SURFACE_TINT
              }}
              MenuProps={{
                sx: { zIndex: 15000 },
                PaperProps: {
                  sx: {
                    mt: 1,
                    '& .MuiMenuItem-root': { fontSize: '13px' }
                  },
                },
              }}
            >
              {adjustmentTypeOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Box>

        {/* Second Row: Calculation Logic */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Select
              variant="outlined"
              size="small"
              value={rateType}
              onChange={(e) => setRateType(e.target.value)}
              sx={{ 
                height: '36px',
                fontSize: "13px",
                width: '140px',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.BORDER },
                bgcolor: COLORS.SURFACE_TINT
              }}
              MenuProps={{
                sx: { zIndex: 15000 },
                PaperProps: {
                  sx: { mt: 1, '& .MuiMenuItem-root': { fontSize: '13px' } },
                },
              }}
            >
              {rateTypeOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>

            <RadioGroup
              row
              value={outstandingType}
              onChange={(e) => setOutstandingType(e.target.value)}
              sx={{ gap: 2 }}
            >
              {outstandingTypeOptions.map((option) => (
                <Box
                  key={option.value}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: option.value === "specific" ? 1 : 0,
                  }}
                >
                  <FormControlLabel
                    value={option.value}
                    control={
                      <Radio
                        size="small"
                        sx={{ color: COLORS.ACCENT, "&.Mui-checked": { color: COLORS.ACCENT } }}
                      />
                    }
                    label={
                      <Typography sx={{ fontSize: "13px", color: COLORS.TEXT_PRIMARY }}>
                        {option.label}
                        {option.amount !== null && (
                          <span style={{ fontWeight: fontWeight.semiBold, marginLeft: '4px' }}>
                            (${option.amount.toFixed(2)})
                          </span>
                        )}
                      </Typography>
                    }
                    sx={{ m: 0 }}
                  />
                  {option.value === "specific" && (
                    <TextField
                      variant="outlined"
                      size="small"
                      value={specificAmount}
                      onChange={(e) => setSpecificAmount(e.target.value)}
                      placeholder="$ 0.00"
                      sx={{
                        width: '100px',
                        '& .MuiInputBase-root': { 
                          height: '30px', 
                          fontSize: '13px',
                          bgcolor: COLORS.SURFACE_TINT
                        }
                      }}
                    />
                  )}
                </Box>
              ))}
            </RadioGroup>
          </Box>

          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={includeCourtesy}
                onChange={(e) => setIncludeCourtesy(e.target.checked)}
                sx={{ color: COLORS.ACCENT, '&.Mui-checked': { color: COLORS.ACCENT } }}
              />
            }
            label={
              <Typography sx={{ fontSize: "13px", color: COLORS.TEXT_PRIMARY }}>
                Include the Courtesy Credit (${courtesyCredit.toFixed(2)})
              </Typography>
            }
            sx={{ m: 0 }}
          />
        </Box>

        {/* Third Row: Description */}
        <Box sx={{ mt: 1 }}>
          <TextField
            variant="outlined"
            placeholder="Add description..."
            size="small"
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{
              '& .MuiInputBase-root': { 
                fontSize: '13px',
                bgcolor: COLORS.SURFACE_TINT
              }
            }}
          />
        </Box>
      </DialogContent>

      {/* Footer */}
      <DialogActions sx={{ p: '16px 25px', borderTop: `1px solid ${COLORS.BORDER}`, display: 'flex', justifyContent: 'space-between' }}>
        <Typography
          sx={{
            color: '#dc2626',
            fontWeight: fontWeight.semiBold,
            fontSize: "14px",
          }}
        >
          Adjustment Value: ${calculateAdjustmentValue()}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{
              borderColor: COLORS.BORDER,
              color: COLORS.TEXT_PRIMARY,
              textTransform: 'none',
              fontSize: '13px',
              fontWeight: fontWeight.medium,
              borderRadius: radius.sm,
              height: '36px',
              px: 3,
              '&:hover': { borderColor: COLORS.TEXT_SECONDARY, backgroundColor: 'transparent' }
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              const value = parseFloat(calculateAdjustmentValue()) || 0;
              if (onSave) {
                onSave({
                  adjustmentType,
                  amount: value,
                  description,
                });
              }
            }}
            sx={{
              backgroundColor: COLORS.ACCENT,
              color: COLORS.WHITE,
              textTransform: 'none',
              fontSize: '13px',
              fontWeight: fontWeight.medium,
              borderRadius: radius.sm,
              height: '36px',
              px: 3,
              boxShadow: 'none',
              '&:hover': { backgroundColor: COLORS.ACCENT_HOVER, boxShadow: 'none' }
            }}
          >
            Apply
          </Button>
        </Box>
      </DialogActions>
    </Box>
  );
};

export default AccountAdjustmentDialog;
