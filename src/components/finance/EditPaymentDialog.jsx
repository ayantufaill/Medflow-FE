import React from "react";
import { Box, Button, MenuItem, Select, TextField, Typography } from "@mui/material";
import BaseDialog from "../shared/BaseDialog";
import { COLORS } from "../../constants/colors";
import { radius, fontWeight, labelSx, roundedSelectMenuProps } from "../../constants/styles";
import { PAYMENT_METHODS } from "../../constants/financeConstants";

const INSURANCE_METHODS = PAYMENT_METHODS.filter(
  (method) =>
    method !== "Patient Check" &&
    method !== "Account Credit" &&
    method !== "Courtesy Credit",
);

// The dialog sits at zIndex 130000 (BaseDialog), so the Select popup needs to
// clear that or the options list renders behind the dialog's backdrop.
const METHOD_MENU_PROPS = {
  ...roundedSelectMenuProps,
  style: { zIndex: 150000 },
  sx: { zIndex: 150000 },
  anchorOrigin: { vertical: "bottom", horizontal: "left" },
  transformOrigin: { vertical: "top", horizontal: "left" },
};

const FieldRow = ({ label, children }) => (
  <Box>
    <Typography sx={{ ...labelSx, mb: 0.75 }}>{label}</Typography>
    {children}
  </Box>
);

const EditPaymentDialog = ({ open = true, paymentData, onSave, onCancel }) => {
  const isInsurance = Boolean(paymentData?.isInsurancePayment);
  const initialMethod =
    paymentData?.method && paymentData.method !== "insurance"
      ? paymentData.method
      : "";
  const [method, setMethod] = React.useState(initialMethod);
  const [chequeNo, setChequeNo] = React.useState(paymentData?.chequeNo || "");

  // Re-seed the fields whenever a different payment is opened.
  React.useEffect(() => {
    setMethod(
      paymentData?.method && paymentData.method !== "insurance"
        ? paymentData.method
        : "",
    );
    setChequeNo(paymentData?.chequeNo || "");
  }, [paymentData?.id, paymentData?.method, paymentData?.chequeNo]);

  const baseMethods = isInsurance ? INSURANCE_METHODS : PAYMENT_METHODS;
  const methodOptions =
    method && !baseMethods.includes(method) ? [method, ...baseMethods] : baseMethods;

  const handleSave = () => onSave?.({ method, chequeNo });

  return (
    <BaseDialog
      open={open}
      onClose={onCancel}
      title={`Edit Payment #${paymentData?.id || ""}`}
      showCloseButton
      maxWidth="sm"
      fullWidth={false}
      paperSx={{ width: "440px", maxWidth: "92vw" }}
      contentSx={{ pt: "20px !important" }}
      actions={
        <>
          <Button
            onClick={onCancel}
            variant="outlined"
            sx={{
              textTransform: "none",
              borderColor: COLORS.BORDER,
              color: COLORS.TEXT_PRIMARY,
              fontSize: "13px",
              fontWeight: fontWeight.medium,
              borderRadius: radius.sm,
              height: "36px",
              px: 3,
              "&:hover": { borderColor: COLORS.TEXT_SECONDARY, bgcolor: "transparent" },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{
              textTransform: "none",
              bgcolor: COLORS.ACCENT,
              color: COLORS.WHITE,
              fontSize: "13px",
              fontWeight: fontWeight.medium,
              borderRadius: radius.sm,
              height: "36px",
              px: 3,
              boxShadow: "none",
              "&:hover": { bgcolor: COLORS.ACCENT_HOVER, boxShadow: "none" },
              "&.Mui-disabled": { bgcolor: "rgba(35, 98, 239, 0.5)", color: COLORS.WHITE },
            }}
          >
            Save
          </Button>
        </>
      }
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
        <FieldRow label="Method">
          <Select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            displayEmpty
            variant="outlined"
            size="small"
            fullWidth
            MenuProps={METHOD_MENU_PROPS}
            sx={{
              bgcolor: COLORS.SURFACE_CARD,
              borderRadius: radius.md,
              fontSize: "13px",
              color: COLORS.TEXT_PRIMARY,
              "& .MuiOutlinedInput-notchedOutline": { borderColor: COLORS.BORDER },
              "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: COLORS.TEXT_MUTED },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: COLORS.ACCENT,
                borderWidth: "1.2px",
              },
              "& .MuiSvgIcon-root": { color: COLORS.TEXT_SECONDARY },
              "& .MuiSelect-select": { py: 0.9 },
            }}
          >
            <MenuItem value="" disabled sx={{ fontSize: "13px" }}>
              <em style={{ color: COLORS.TEXT_MUTED, fontStyle: "normal" }}>
                Select method
              </em>
            </MenuItem>
            {methodOptions.map((option) => (
              <MenuItem key={option} value={option} sx={{ fontSize: "13px" }}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FieldRow>

        <FieldRow label="Cheque #">
          <TextField
            variant="outlined"
            size="small"
            fullWidth
            value={chequeNo}
            onChange={(e) => setChequeNo(e.target.value)}
            placeholder="Enter cheque number"
            sx={{
              "& .MuiOutlinedInput-root": {
                bgcolor: COLORS.SURFACE_CARD,
                borderRadius: radius.md,
                fontSize: "13px",
                "& fieldset": { borderColor: COLORS.BORDER },
                "&:hover fieldset": { borderColor: COLORS.TEXT_MUTED },
                "&.Mui-focused fieldset": {
                  borderColor: COLORS.ACCENT,
                  borderWidth: "1.2px",
                },
              },
              "& .MuiOutlinedInput-input": { py: 0.9, fontSize: "13px" },
              "& input::placeholder": { color: COLORS.TEXT_MUTED, opacity: 1 },
            }}
          />
        </FieldRow>
      </Box>
    </BaseDialog>
  );
};

export default EditPaymentDialog;
