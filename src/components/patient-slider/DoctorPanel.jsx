import { useMemo, useState } from "react";
import {
  Box,
  InputAdornment,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import {
  MedicalServicesOutlined,
  CalendarTodayOutlined,
} from "@mui/icons-material";
import { ApptBlock, selectSx } from "./helpers";
import { useDropdownData } from "../../hooks/redux/useDropdownData";

const getProviderName = (provider) => {
  const first =
    provider.userId?.firstName || provider.firstName || provider.FName || "";
  const last =
    provider.userId?.lastName || provider.lastName || provider.LName || "";
  return (
    `${first} ${last}`.trim() ||
    provider.providerCode ||
    provider._id ||
    "Unknown"
  );
};

const getProviderTypeString = (provider) => {
  const raw =
    provider.providerType ||
    provider.specialty ||
    provider.specialtyId?.name ||
    "";
  if (typeof raw === "string") return raw.toLowerCase();
  if (Array.isArray(raw)) return raw.join(" ").toLowerCase();
  if (typeof raw === "object" && raw !== null)
    return JSON.stringify(raw).toLowerCase();
  return String(raw).toLowerCase();
};

const DoctorPanel = ({ pt }) => {
  const [selectedDentist, setSelectedDentist] = useState("");
  const { providers = [] } = useDropdownData({ providers: true });

  const dentistOptions = useMemo(() => {
    const dentists = providers.filter((provider) => {
      const type = getProviderTypeString(provider);
      return (
        type.includes("dentist") ||
        type.includes("dds") ||
        type.includes("dmd") ||
        type.includes("doctor")
      );
    });
    return dentists.length > 0 ? dentists : providers;
  }, [providers]);

  return (
    <Box
      sx={{
        flex: 1,
        minWidth: 0,
        px: "16px",
        py: "12px",
        borderRight: "1px solid #f0f2f5",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      <Select
        size="small"
        displayEmpty
        value={selectedDentist}
        onChange={(e) => setSelectedDentist(e.target.value)}
        sx={selectSx}
        MenuProps={{
          sx: { zIndex: 1500 },
          PaperProps: { sx: { zIndex: 1500 } },
        }}
        startAdornment={
          <InputAdornment position="start" sx={{ mr: 0 }}>
            <MedicalServicesOutlined
              sx={{ fontSize: "14px", color: "#9aa3ae" }}
            />
          </InputAdornment>
        }
      >
        <MenuItem
          value=""
          sx={{ fontFamily: "Inter", fontSize: "11px", color: "#9aa3ae" }}
        >
          Select a preferred dentist
        </MenuItem>
        {dentistOptions.map((provider) => (
          <MenuItem
            key={provider._id || provider.id}
            value={provider._id || provider.id}
            sx={{ fontFamily: "Inter", fontSize: "11px" }}
          >
            {getProviderName(provider)}
          </MenuItem>
        ))}
      </Select>

      <ApptBlock
        label="NEXT TX APPT"
        date={pt.nextTxAppt.date}
        time={pt.nextTxAppt.time}
        provider={pt.nextTxAppt.provider}
        icon={<CalendarTodayOutlined sx={{ fontSize: "12px" }} />}
      />

      <Typography
        sx={{
          fontFamily: "Inter",
          fontSize: "11px",
          color: "#2262ef",
          cursor: "pointer",
          mt: "auto",
          "&:hover": { textDecoration: "underline" },
        }}
      >
        View Appt History →
      </Typography>
    </Box>
  );
};

export default DoctorPanel;
