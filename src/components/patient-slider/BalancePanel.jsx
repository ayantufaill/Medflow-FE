import { Box, Divider, Typography } from "@mui/material";
import { CreditCardOutlined } from "@mui/icons-material";

const Row = ({ icon, label, value, valueColor, muted }) => (
  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: "3px" }}>
    <Box sx={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
      {icon && <Box sx={{ display: "flex", mt: "1px" }}>{icon}</Box>}
      <Typography sx={{ fontFamily: "Inter", fontSize: "11px", color: muted ? "#9aa3ae" : "#374151" }}>
        {label}
      </Typography>
    </Box>
    <Typography sx={{ fontFamily: "Inter", fontSize: "11px", fontWeight: valueColor ? 700 : 400, color: valueColor || "#374151" }}>
      {value}
    </Typography>
  </Box>
);

const BalancePanel = ({ pt }) => (
  <Box sx={{ flex: 1, minWidth: 0, px: "16px", py: "12px", borderRight: "1px solid #f0f2f5" }}>
    <Row icon={<CreditCardOutlined sx={{ fontSize: "13px", color: "#9aa3ae" }} />} label="Family Balance"  value={pt.familyBalance}  valueColor="#ef4444" />
    <Row label="Patient Balance" value={pt.patientBalance} valueColor="#ef4444" />

    <Divider sx={{ my: "8px", borderColor: "#f0f2f5" }} />

    <Row label="Last patient pay" value={pt.lastPatientPay} muted />
    <Row label="Last ins pay"     value={pt.lastInsPay}     muted />
  </Box>
);

export default BalancePanel;
