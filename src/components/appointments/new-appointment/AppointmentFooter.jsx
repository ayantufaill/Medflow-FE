import { Box, Button, Typography } from "@mui/material";
import { Person } from "@mui/icons-material";

const AppointmentFooter = ({ patient, patientDisplayName, patientId, onCancel, onSubmit, loading }) => (
  <Box sx={{
    display: "flex", alignItems: "center", justifyContent: "space-between",
    px: "20px", py: "12px",
    borderTop: "1px solid #e0e5eb", flexShrink: 0,
  }}>
    <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <Person sx={{ fontSize: "16px", color: "#9aa3ae" }} />
      <Typography sx={{ fontFamily: "Inter", fontSize: "12px", color: "#6b7280" }}>
        Booking for{" "}
        <Box component="span" sx={{ fontWeight: 700, color: "#09121f" }}>
          {patientDisplayName || "—"}
        </Box>
        {patient && (
          <Box component="span" sx={{ color: "#9aa3ae" }}> · pt #{patientId || "—"}</Box>
        )}
      </Typography>
    </Box>

    <Box sx={{ display: "flex", gap: "8px" }}>
      <Button
        variant="outlined"
        color="inherit"
        onClick={onCancel}
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
        variant="outlined"
        color="inherit"
        sx={{
          fontFamily: "Inter", fontSize: "13px", fontWeight: 500,
          textTransform: "none", borderRadius: "8px",
          border: "1px solid #d0d5dd", color: "#374151",
          px: "16px", py: "7px",
          "&:hover": { borderColor: "#9aa3ae", backgroundColor: "#f9fafb" },
        }}
      >
        Save as draft
      </Button>
      <Button
        variant="contained"
        disableElevation
        onClick={onSubmit}
        disabled={loading || !patient}
        sx={{
          fontFamily: "Inter", fontSize: "13px", fontWeight: 600,
          textTransform: "none", borderRadius: "8px",
          backgroundColor: "#2262ef", color: "#fff",
          px: "20px", py: "7px",
          "&:hover": { backgroundColor: "#1a50cc" },
          "&.Mui-disabled": { backgroundColor: "#c5d3f8", color: "#fff" },
        }}
      >
        {loading ? "Saving…" : "Add appointment"}
      </Button>
    </Box>
  </Box>
);

export default AppointmentFooter;
