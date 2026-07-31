import { useState } from "react";
import { Box, Typography, Button, Tooltip } from "@mui/material";
import { Search, Print } from "@mui/icons-material";
import { FilterLabel, FilterInput, FilterSelect } from "./helpers";
import PatientFlagsDialog from "../../../patient-flags/PatientFlagsDialog";
import { getFlagColor } from "../../../patient-flags/constants";

const ShortlistFilters = ({ filters, onChange, providersList = [], onClear, onPrint }) => {
  const [flagsDialogOpen, setFlagsDialogOpen] = useState(false);
  const handleSearchChange = (e) => onChange("searchName", e.target.value);
  const handleProviderChange = (e) => onChange("providerId", e.target.value);
  const handleMaxDurChange = (e) => onChange("maxDuration", e.target.value);
  const handleMinDurChange = (e) => onChange("minDuration", e.target.value);
  const handlePrefDayChange = (e) => onChange("prefDay", e.target.value);
  const handlePrefTimeHourChange = (e) => {
    let val = e.target.value.replace(/[^0-9]/g, '');
    if (val !== "") {
      const num = parseInt(val, 10);
      if (num > 12) val = "12";
      else if (num < 1) val = "1";
    }
    onChange("prefTimeHour", val);
  };
  const handlePrefTimeAmpmChange = (val) => onChange("prefTimeAmpm", val);

  const providerOptions = providersList.map(p => {
    const pName = p.providerName || p.name || `${p.userId?.firstName || p.firstName || ''} ${p.userId?.lastName || p.lastName || ''}`.trim() || p.providerCode;
    return { value: p.id || p._id || p.ProvNum, label: pName };
  });

  const dayOptions = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <Box sx={{ px: "24px", py: "16px", borderBottom: "1px solid #f0f2f5", flexShrink: 0 }}>

      {/* Search row */}
      <Box sx={{ display: "flex", alignItems: "center", gap: "12px", mb: "16px" }}>
        <Typography sx={{ fontFamily: "Inter", fontSize: "14px", fontWeight: 700, color: "#09121f", flexShrink: 0 }}>
          Search:
        </Typography>

        <Box sx={{
          display: "flex", alignItems: "center", gap: "8px",
          flex: 1, maxWidth: "340px",
          border: "1px solid #d1d5db", borderRadius: "8px",
          px: "10px", height: "38px",
        }}>
          <Search sx={{ fontSize: "15px", color: "#9aa3ae" }} />
          <Box
            component="input"
            placeholder="Patient Name"
            value={filters.searchName}
            onChange={handleSearchChange}
            sx={{
              flex: 1, border: "none", outline: "none",
              fontFamily: "Inter", fontSize: "13px", color: "#374151",
              "&::placeholder": { color: "#9aa3ae" },
            }}
          />
        </Box>

        <Box sx={{
          backgroundColor: "#2262ef", borderRadius: "8px",
          px: "18px", height: "38px",
          display: "flex", alignItems: "center",
          cursor: "pointer", "&:hover": { backgroundColor: "#1a50cc" },
        }}>
          <Typography sx={{ fontFamily: "Inter", fontSize: "13px", fontWeight: 600, color: "#fff" }}>
            Search Patient Name
          </Typography>
        </Box>
      </Box>

      {/* Filter row */}
      <Box sx={{ display: "flex", gap: "12px", alignItems: "flex-end", mb: "14px" }}>
        <Box sx={{ width: "165px" }}>
          <FilterLabel>Provider</FilterLabel>
          <FilterSelect value={filters.providerId} onChange={handleProviderChange} options={providerOptions} />
        </Box>

        <Box sx={{ width: "150px" }}>
          <FilterLabel>Max Appt.Duration (min)</FilterLabel>
          <FilterInput
            type="number"
            placeholder="e.g. 60"
            value={filters.maxDuration}
            onChange={handleMaxDurChange}
            endAdornment={
              <Typography sx={{ fontFamily: "Inter", fontSize: "12px", color: "#9aa3ae", flexShrink: 0 }}>min</Typography>
            }
          />
        </Box>

        <Box sx={{ width: "150px" }}>
          <FilterLabel>Min Appt.Duration (min)</FilterLabel>
          <FilterInput
            type="number"
            placeholder="e.g. 30"
            value={filters.minDuration}
            onChange={handleMinDurChange}
            endAdornment={
              <Typography sx={{ fontFamily: "Inter", fontSize: "12px", color: "#9aa3ae", flexShrink: 0 }}>min</Typography>
            }
          />
        </Box>

        <Box sx={{ width: "165px" }}>
          <FilterLabel>Pref Day</FilterLabel>
          <FilterSelect value={filters.prefDay} onChange={handlePrefDayChange} options={dayOptions} />
        </Box>

        {/* Pref time — hour input + AM/PM toggle */}
        <Box>
          <FilterLabel>Pref. Time</FilterLabel>
          <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <Box sx={{
              border: "1px solid #d1d5db", borderRadius: "6px",
              px: "10px", height: "36px",
              display: "flex", alignItems: "center",
              width: "54px",
            }}>
                <Box
                component="input"
                type="number"
                min="1" max="12"
                placeholder="1"
                value={filters.prefTimeHour}
                onChange={handlePrefTimeHourChange}
                sx={{
                  width: "100%", border: "none", outline: "none",
                  fontFamily: "Inter", fontSize: "13px", color: "#374151",
                  textAlign: "center",
                }}
              />
            </Box>

            <Box sx={{ display: "flex", border: "1px solid #d1d5db", borderRadius: "6px", overflow: "hidden", height: "36px" }}>
              {["AM", "PM"].map((v) => (
                <Box
                  key={v}
                  onClick={() => handlePrefTimeAmpmChange(v)}
                  sx={{
                    px: "14px",
                    display: "flex", alignItems: "center",
                    backgroundColor: filters.prefTimeAmpm === v ? "#2262ef" : "#fff",
                    cursor: "pointer",
                    "&:hover": { backgroundColor: filters.prefTimeAmpm === v ? "#2262ef" : "#f5f7fa" },
                  }}
                >
                  <Typography sx={{ fontFamily: "Inter", fontSize: "13px", fontWeight: 600, color: filters.prefTimeAmpm === v ? "#fff" : "#374151" }}>
                    {v}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Patient flags */}
      <Box sx={{ mb: "14px" }}>
        <Typography sx={{ fontFamily: "Inter", fontSize: "12px", color: "#9aa3ae", mb: "5px" }}>
          Patient Flags
        </Typography>
        {filters.flags?.length > 0 ? (
          <Box 
            onClick={() => setFlagsDialogOpen(true)} 
            sx={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap', cursor: 'pointer' }}
          >
            {filters.flags.map((flag, idx) => (
              <Tooltip 
                key={idx} 
                title={flag === 'appointment_reminder' ? 'Appt Reminder' : flag} 
                arrow 
                placement="top"
                PopperProps={{ sx: { zIndex: 1700 } }}
              >
                <Box 
                  sx={{ 
                    width: 12, 
                    height: 12, 
                    borderRadius: '2px', 
                    bgcolor: getFlagColor(flag), 
                    flexShrink: 0,
                    cursor: 'pointer'
                  }} 
                />
              </Tooltip>
            ))}
            <Typography 
            onClick={() => setFlagsDialogOpen(true)}
            sx={{ fontFamily: "Inter", fontSize: "13px", color: "#2262ef", cursor: "pointer", fontWeight: 500 }}
        >
            + Select Flags
          </Typography>
          </Box>
        ) : (
          <Typography 
            onClick={() => setFlagsDialogOpen(true)}
            sx={{ fontFamily: "Inter", fontSize: "13px", color: "#2262ef", cursor: "pointer", fontWeight: 500 }}
          >
            + Select Flags
          </Typography>
        )}
      </Box>

      <PatientFlagsDialog
        open={flagsDialogOpen}
        onClose={() => setFlagsDialogOpen(false)}
        initialFlags={filters.flags || []}
        onSave={(selectedFlags) => onChange("flags", selectedFlags)}
      />

      {/* Action buttons — right-aligned */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
        <Box sx={{
          backgroundColor: "#2262ef", borderRadius: "8px",
          px: "20px", height: "38px",
          display: "flex", alignItems: "center",
          cursor: "pointer", "&:hover": { backgroundColor: "#1a50cc" },
        }}>
          <Typography sx={{ fontFamily: "Inter", fontSize: "13px", fontWeight: 600, color: "#fff" }}>
            Apply Filters
          </Typography>
        </Box>

        <Box 
          onClick={onClear}
          sx={{
            border: "1px solid #d1d5db", borderRadius: "8px",
            px: "20px", height: "38px",
            display: "flex", alignItems: "center",
            cursor: "pointer", "&:hover": { backgroundColor: "#f5f7fa" },
          }}>
          <Typography sx={{ fontFamily: "Inter", fontSize: "13px", fontWeight: 500, color: "#374151" }}>
            Clear All Filters
          </Typography>
        </Box>

        <Button 
          variant="outlined" 
          size="small"
          startIcon={<Print />} 
          onClick={onPrint}
          sx={{ 
            textTransform: 'none',
            borderColor: '#3b82f6', 
            color: '#3b82f6', 
            borderRadius: '8px', 
            px: 2, 
            height: "38px",
            fontWeight: 600,
            '&:hover': { backgroundColor: '#eff6ff', borderColor: '#2563eb' }
          }}
        >
          Print
        </Button>
      </Box>
    </Box>
  );
};

export default ShortlistFilters;
