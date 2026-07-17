import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  Box,
  Button,
  Typography,
  IconButton,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";
import {
  Close as CloseIcon,
  PersonAddAlt1 as PersonAddAlt1Icon,
} from "@mui/icons-material";
import { useSnackbar } from "../../../contexts/SnackbarContext";
import { updatePracticeInfo } from "../../../store/slices/practiceInfoSlice";

const BillingConfig = ({ onNext, onFinishLater, practiceInfoId }) => {
  const { showSnackbar } = useSnackbar();
  const [outOfNetwork, setOutOfNetwork] = useState("yes"); // Defaults to yes based on design
  const [assignment, setAssignment] = useState("non-assignment"); // Defaults to non-assignment based on design
  const [billingProvider, setBillingProvider] = useState("default"); // Defaults to default based on design
  const [saving, setSaving] = useState(false);

  const dispatch = useDispatch();

  const handleSaveAndNext = async () => {
    try {
      setSaving(true);
      if (practiceInfoId) {
        await dispatch(
          updatePracticeInfo({
            practiceInfoId,
            updates: {
              billingOutOfNetwork: outOfNetwork,
              billingAssignmentType: assignment,
              billingProvider: billingProvider,
            },
          }),
        ).unwrap();
      }
      onNext();
    } catch (err) {
      showSnackbar(err || "Failed to save billing config", "error");
    } finally {
      setSaving(false);
    }
  };

  const CustomRadio = (props) => (
    <Radio
      disableRipple
      color="default"
      checkedIcon={
        <Box
          sx={{
            width: 18,
            height: 18,
            borderRadius: "50%",
            bgcolor: "#2563EB",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#fff" }} />
        </Box>
      }
      icon={
        <Box
          sx={{
            width: 18,
            height: 18,
            borderRadius: "50%",
            border: "1px solid #D1D5DB",
            bgcolor: "#fff",
          }}
        />
      }
      sx={{ p: 0.5 }}
      {...props}
    />
  );

  const FormRow = ({ label, name, value, onChange, options }) => (
    <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
      <Typography
        sx={{
          width: 180, // Fixed width to align all radio groups
          color: "#6B7280",
          fontSize: "12px",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        {label}
      </Typography>
      <RadioGroup
        row
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        sx={{ gap: 3 }}
      >
        {options.map((opt) => (
          <FormControlLabel
            key={opt.value}
            value={opt.value}
            control={<CustomRadio />}
            label={
              <Typography
                sx={{
                  fontSize: "14px",
                  color: value === opt.value ? "#111827" : "#4B5563",
                  fontWeight: value === opt.value ? 600 : 400,
                }}
              >
                {opt.label}
              </Typography>
            }
            sx={{ m: 0, gap: 1 }}
          />
        ))}
      </RadioGroup>
    </Box>
  );

  return (
    <Box sx={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
      {/* Outer Container */}
      <Box
        sx={{
          bgcolor: "#FBFCFD",
          borderRadius: "12px",
          border: "1px solid #E5E7EB",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            bgcolor: "#F1F5FD",
            height: "73px",
            px: "17px",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                bgcolor: "#E0E7FF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <PersonAddAlt1Icon sx={{ color: "#3B82F6", fontSize: 20 }} />
            </Box>
            <Box>
              <Typography
                sx={{
                  color: "#111928",
                  fontWeight: 600,
                  fontSize: "16px",
                  lineHeight: 1.2,
                }}
              >
                Billing Configuration
              </Typography>
              <Typography sx={{ color: "#6B7280", fontSize: "13px" }}>
                Add new Users
              </Typography>
            </Box>
          </Box>
          <IconButton size="small">
            <CloseIcon fontSize="small" sx={{ color: "#6B7280" }} />
          </IconButton>
        </Box>

        {/* Inner Content */}
        <Box sx={{ py: "23px", px: "17px" }}>
          <Box
            sx={{
              bgcolor: "#FFFFFF",
              borderRadius: "12px",
              border: "1px solid #E5E7EB",
              height: "179px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              px: 4,
            }}
          >
            <FormRow
              label="Out of Network"
              name="outOfNetwork"
              value={outOfNetwork}
              onChange={setOutOfNetwork}
              options={[
                { value: "yes", label: "Yes" },
                { value: "no", label: "No" },
              ]}
            />
            <FormRow
              label="Assignment Type"
              name="assignment"
              value={assignment}
              onChange={setAssignment}
              options={[
                { value: "in-assignment", label: "In-Assignment" },
                { value: "non-assignment", label: "No-Assignment" },
              ]}
            />
            <FormRow
              label="Billing Provider"
              name="billingProvider"
              value={billingProvider}
              onChange={setBillingProvider}
              options={[
                { value: "default", label: "Default" },
                { value: "treating", label: "Treating" },
                { value: "business", label: "Business" },
              ]}
            />
          </Box>
        </Box>
      </Box>

      {/* Footer Actions */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 1.5,
          mt: 3,
        }}
      >
        <Button
          variant="outlined"
          onClick={onFinishLater}
          disabled={saving}
          sx={{
            borderColor: "#D1D5DB",
            color: "#374151",
            textTransform: "none",
            borderRadius: "8px",
            px: 3,
            fontWeight: 600,
            "&:hover": { borderColor: "#9CA3AF", bgcolor: "#F3F4F6" },
          }}
        >
          Finish Later
        </Button>
        <Button
          variant="contained"
          onClick={handleSaveAndNext}
          disabled={saving}
          sx={{
            bgcolor: "#2563EB",
            textTransform: "none",
            borderRadius: "8px",
            px: 4,
            fontWeight: 600,
            boxShadow: "none",
            "&:hover": { bgcolor: "#1D4ED8", boxShadow: "none" },
          }}
        >
          {saving ? "Saving..." : "Finish"}
        </Button>
      </Box>
    </Box>
  );
};

export default BillingConfig;
