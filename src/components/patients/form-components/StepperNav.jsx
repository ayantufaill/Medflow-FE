import { Box, Typography } from "@mui/material";

const steps = [
  { label: "Patient Details", num: 1 },
  { label: "Contact & Addresses", num: 2 },
  { label: "Insurance", num: 3 },
  { label: "Preferences", num: 4 },
  { label: "Review & Save", num: 5 },
];

const StepperNav = ({ activeStep = 0 }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 0, mb: 3, overflowX: "auto", py: 1 }}>
    {steps.map((step, idx) => {
      const isActive = idx === activeStep;
      const isCompleted = idx < activeStep;
      return (
        <Box key={step.num} sx={{ display: "flex", alignItems: "center", flex: idx < steps.length - 1 ? 1 : "none" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, cursor: "pointer", whiteSpace: "nowrap" }}>
            <Box sx={{
              width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "0.75rem", fontWeight: 600, flexShrink: 0,
              ...(isActive ? { backgroundColor: "#1a73e8", color: "#fff" }
                : isCompleted ? { backgroundColor: "#1a73e8", color: "#fff" }
                : { backgroundColor: "#F1F5F9", color: "#94A3B8" }),
            }}>
              {step.num}
            </Box>
            <Typography sx={{
              fontSize: "0.82rem", fontWeight: isActive ? 600 : 400,
              color: isActive ? "#1E293B" : "#94A3B8",
            }}>
              {step.label}
            </Typography>
          </Box>
          {idx < steps.length - 1 && (
            <Box sx={{ flex: 1, height: "1px", backgroundColor: "#E2E8F0", mx: 1.5, minWidth: 20 }} />
          )}
        </Box>
      );
    })}
  </Box>
);

export default StepperNav;
