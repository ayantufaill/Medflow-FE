import { useMemo, useState } from "react";
import {
  Box,
  InputAdornment,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import {
  PersonOutline,
  CalendarTodayOutlined,
  PendingActionsOutlined,
} from "@mui/icons-material";
import { ApptBlock, SL, selectSx } from "./helpers";
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

const getProviderId = (provider) => String(provider._id || provider.id || "");

const HygienistPanel = ({ pt }) => {
  const [selectedHygienist, setSelectedHygienist] = useState(() =>
    pt.preferredHygienistId ? String(pt.preferredHygienistId) : "",
  );
  const { providers = [] } = useDropdownData({ providers: true });

  const hygienistOptions = useMemo(() => {
    const hygienists = providers.filter((provider) => {
      const type = getProviderTypeString(provider);
      return type.includes("hygien");
    });
    const options = hygienists.length > 0 ? hygienists : providers;
    const selectedProvider = providers.find(
      (provider) => getProviderId(provider) === selectedHygienist,
    );

    if (
      selectedProvider &&
      !options.some((provider) => getProviderId(provider) === selectedHygienist)
    ) {
      return [selectedProvider, ...options];
    }

    return options;
  }, [providers, selectedHygienist]);

  const selectedHygienistInOptions = hygienistOptions.some(
    (provider) => getProviderId(provider) === selectedHygienist,
  );

  return (
    <Box
      sx={{
        flex: 1,
        minWidth: 0,
        px: "16px",
        py: "12px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      <Select
        size="small"
        displayEmpty
        value={selectedHygienist}
        onChange={(e) => setSelectedHygienist(e.target.value)}
        sx={selectSx}
        MenuProps={{
          sx: { zIndex: 1500 },
          PaperProps: { sx: { zIndex: 1500 } },
        }}
        startAdornment={
          <InputAdornment position="start" sx={{ mr: 0 }}>
            <PersonOutline sx={{ fontSize: "14px", color: "#9aa3ae" }} />
          </InputAdornment>
        }
      >
        <MenuItem
          value=""
          sx={{ fontFamily: "Inter", fontSize: "11px", color: "#9aa3ae" }}
        >
          Select a preferred hygienist
        </MenuItem>
        {selectedHygienist && !selectedHygienistInOptions && (
          <MenuItem
            value={selectedHygienist}
            sx={{ fontFamily: "Inter", fontSize: "11px" }}
          >
            Preferred hygienist
          </MenuItem>
        )}
        {hygienistOptions.map((provider) => (
          <MenuItem
            key={getProviderId(provider)}
            value={getProviderId(provider)}
            sx={{ fontFamily: "Inter", fontSize: "11px" }}
          >
            {getProviderName(provider)}
          </MenuItem>
        ))}
      </Select>

      <ApptBlock
        label="NEXT HYG APPT"
        date={pt.nextHygAppt.date}
        time={pt.nextHygAppt.time}
        provider={pt.nextHygAppt.provider}
        icon={<CalendarTodayOutlined sx={{ fontSize: "12px" }} />}
      />

      <Box sx={{ mt: "auto" }}>
        <Box
          sx={{ display: "flex", alignItems: "center", gap: "3px", mb: "2px" }}
        >
          <PendingActionsOutlined sx={{ fontSize: "12px", color: "#f59e0b" }} />
          <SL>HYG DUE DATE</SL>
        </Box>
        <Typography
          sx={{
            fontFamily: "Inter",
            fontSize: "11px",
            fontWeight: 600,
            color: "#09121f",
          }}
        >
          {pt.hygQueDate}
        </Typography>
      </Box>
    </Box>
  );
};

export default HygienistPanel;
