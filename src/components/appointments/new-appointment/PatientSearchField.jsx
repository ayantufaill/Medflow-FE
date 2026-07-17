import { Autocomplete, Box, TextField, Typography, createFilterOptions } from "@mui/material"; // 1. Added createFilterOptions
import { Search } from "@mui/icons-material";
import { FieldBox } from "./helpers";
import PatientListCard from "../../layout/header/patient-dropdown/PatientListCard";
import { toCardShape } from "../../layout/header/patient-dropdown/PatientDropdownPanel";

const PatientSearchField = ({ patients, loadingPatients, value, onChange, onSearch, error }) => {
  const getOptionLabel = (o) => {
    const name = o.name || o.fullName || `${o.firstName || ""} ${o.lastName || ""}`.trim();
    const id = o.patientId || o.chartNumber || o.id || o._id || "";
    return id ? `${name}  pt #${id}` : name;
  };

  // 2. Define a clean, case-insensitive filter method targeting patient properties directly
  const filterOptions = (options, { inputValue }) => {
    const search = inputValue.trim().toLowerCase();
    if (!search) return options;

    return options.filter((o) => {
      const first = (o.firstName || "").toLowerCase();
      const last = (o.lastName || "").toLowerCase();
      const full = (o.name || o.fullName || "").toLowerCase();
      const id = String(o.patientId || o.chartNumber || o.id || o._id || "").toLowerCase();

      return (
        first.includes(search) ||
        last.includes(search) ||
        full.includes(search) ||
        id.includes(search)
      );
    });
  };

  return (
    <FieldBox label="For Patient" sx={{ flex: 1 }}>
      <Autocomplete
        size="small"
        options={patients}
        loading={loadingPatients}
        getOptionLabel={getOptionLabel}
        filterOptions={filterOptions} // 3. Attached the case-insensitive filter override
        value={value}
        componentsProps={{ popper: { sx: { zIndex: 1400 } } }}
        onChange={(_, v) => onChange(v)}
        onInputChange={(_, v, reason) => { 
          if (reason === "input" && onSearch) {
            onSearch(v.toLowerCase()); // <-- FORCE LOWERCASE HERE before calling API
          }
        }}        renderOption={(props, o) => {
          const cardData = toCardShape(o);
          if (!cardData) return null;
          
          const { key, ...restProps } = props;
          return (
            <Box component="li" key={key} {...restProps} sx={{ p: "0 !important" }}>
              <Box sx={{ width: "100%" }}>
                <PatientListCard patient={cardData} />
              </Box>
            </Box>
          );
        }}
        renderInput={(params) => {
          const initials = value
            ? (value.name
                ? value.name.slice(0, 2).toUpperCase()
                : `${value.firstName?.[0] || ""}${value.lastName?.[0] || ""}`.toUpperCase())
            : "";
          return (
            <TextField
              {...params}
              placeholder="Search patient..."
              error={!!error}
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <>
                    <Search sx={{ fontSize: "16px", color: "#9aa3ae", ml: "4px", mr: "2px", flexShrink: 0 }} />
                    {value && (
                      <Box sx={{ width: "22px", height: "22px", borderRadius: "50%", backgroundColor: "#2262ef", display: "flex", alignItems: "center", justifyContent: "center", mx: "4px", flexShrink: 0 }}>
                        <Typography sx={{ fontFamily: "Inter", fontSize: "9px", fontWeight: 700, color: "#fff" }}>{initials}</Typography>
                      </Box>
                    )}
                    {params.InputProps.startAdornment}
                  </>
                ),
                sx: {
                  fontFamily: "Inter", fontWeight: 500, fontSize: "13px", borderRadius: "8px", height: "40px",
                  ...(error && {
                    "& .MuiOutlinedInput-notchedOutline": { borderColor: "#ef4444" },
                    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#ef4444" },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#ef4444" },
                  }),
                },
              }}
            />
          );
        }}
      />
    </FieldBox>
  );
};

export default PatientSearchField;