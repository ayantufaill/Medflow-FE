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
import AppointmentHistoryDialog from "../appointments/schedule/appointment-history-modal/AppointmentHistoryDialog";

const getProviderName = (provider) => {
  if (!provider) return "Unknown";
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

const getProviderId = (provider) => String(provider._id || provider.id || "");

const DoctorPanel = ({ pt }) => {
  const [selectedDentist, setSelectedDentist] = useState(() =>
    pt.preferredDentistId ? String(pt.preferredDentistId) : "",
  );
  const [historyOpen, setHistoryOpen] = useState(false);
  const { providers = [] } = useDropdownData({ providers: true });

  const patientForHistory = pt.rawId ? { _id: pt.rawId, id: pt.rawId } : null;

  // 1. Find and format the provider name for the next appointment block
  const nextApptProviderName = useMemo(() => {
    const rawProvider = pt.nextTxAppt?.provider;
    if (!rawProvider) return "Unknown";

    // If it's an object with a name already, pass it to the helper
    if (typeof rawProvider === "object") {
      return getProviderName(rawProvider);
    }

    // If it's a string ID or code, find the matching full provider object from Redux data
    const matchedProvider = providers.find(
      (p) =>
        getProviderId(p) === String(rawProvider) ||
        p.providerCode === String(rawProvider),
    );

    // Fallback to the raw value (like the number/ID) if no match is found in dropdown data
    return matchedProvider
      ? getProviderName(matchedProvider)
      : String(rawProvider);
  }, [providers, pt.nextTxAppt?.provider]);

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
    const options = dentists.length > 0 ? dentists : providers;
    const selectedProvider = providers.find(
      (provider) => getProviderId(provider) === selectedDentist,
    );

    if (
      selectedProvider &&
      !options.some((provider) => getProviderId(provider) === selectedDentist)
    ) {
      return [selectedProvider, ...options];
    }

    return options;
  }, [providers, selectedDentist]);

  const selectedDentistInOptions = dentistOptions.some(
    (provider) => getProviderId(provider) === selectedDentist,
  );

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
        {selectedDentist && !selectedDentistInOptions && (
          <MenuItem
            value={selectedDentist}
            sx={{ fontFamily: "Inter", fontSize: "11px" }}
          >
            Preferred dentist
          </MenuItem>
        )}
        {dentistOptions.map((provider) => (
          <MenuItem
            key={getProviderId(provider)}
            value={getProviderId(provider)}
            sx={{ fontFamily: "Inter", fontSize: "11px" }}
          >
            {getProviderName(provider)}
          </MenuItem>
        ))}
      </Select>

      {/* 2. Pass the formatted name here */}
      <ApptBlock
        label="NEXT TX APPT"
        date={pt.nextTxAppt.date}
        time={pt.nextTxAppt.time}
        provider={nextApptProviderName}
        icon={<CalendarTodayOutlined sx={{ fontSize: "12px" }} />}
      />

      <Typography
        onClick={() => patientForHistory && setHistoryOpen(true)}
        sx={{
          fontFamily: "Inter",
          fontSize: "11px",
          color: patientForHistory ? "#2262ef" : "#9aa3ae",
          cursor: patientForHistory ? "pointer" : "default",
          mt: "auto",
          "&:hover": patientForHistory ? { textDecoration: "underline" } : {},
        }}
      >
        View Appt History →
      </Typography>

      <AppointmentHistoryDialog
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        patient={patientForHistory}
      />
    </Box>
  );
};

export default DoctorPanel;
