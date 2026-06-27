import { Box, Divider, Typography } from "@mui/material";

const Row = ({ label, value, valueColor, muted }) => (
  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: "3px" }}>
    <Typography sx={{ fontFamily: "Inter", fontSize: "11px", color: muted ? "#9aa3ae" : "#374151" }}>
      {label}
    </Typography>
    <Typography sx={{ fontFamily: "Inter", fontSize: "11px", fontWeight: valueColor ? 700 : 400, color: valueColor || "#374151" }}>
      {value}
    </Typography>
  </Box>
);

const BalancePanel = ({ pt }) => (
  <Box sx={{ flex: 1, minWidth: 0, px: "16px", py: "12px", borderRight: "1px solid #f0f2f5" }}>
    <Row label="Family Balance"  value={pt.familyBalance}  valueColor="#ef4444" />
    <Row label="Patient Balance" value={pt.patientBalance} valueColor="#ef4444" />

    <Divider sx={{ my: "8px", borderColor: "#f0f2f5" }} />

    <Row label="Last patient pay" value={pt.lastPatientPay} muted />
    <Row label="Last ins pay"     value={pt.lastInsPay}     muted />
  </Box>
);

export default BalancePanel;
