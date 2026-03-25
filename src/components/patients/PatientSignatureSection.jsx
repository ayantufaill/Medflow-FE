import { Box, Paper, Typography } from "@mui/material";
import SignaturePad from "../shared/SignaturePad";

const PatientSignatureSection = ({ value, onChange, reviewedWithPatient }) => (
  <Paper
    elevation={0}
    sx={{
      p: 3,
      mb: 0,
      borderRadius: 1,
      border: "1px solid #e0e0e0",
      bgcolor: "#ffffff",
    }}
  >
    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
      <Box>
        <Typography
          variant="caption"
          sx={{ color: "#757575", mb: 0.5, display: "block" }}
        >
          Patient/Guardian Signature:
        </Typography>
        <SignaturePad
          width={240}
          height={72}
          value={value}
          onChange={onChange}
          showClearButton
          sx={{ mt: 0.5 }}
        />
        {reviewedWithPatient && (
          <Typography
            variant="caption"
            sx={{ color: "#43a047", mt: 1, display: "block" }}
          >
            ✓ Reviewed with patient
          </Typography>
        )}
      </Box>
    </Box>
  </Paper>
);

export default PatientSignatureSection;

