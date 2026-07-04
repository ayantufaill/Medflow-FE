import { Autocomplete, Box, TextField, Typography } from "@mui/material";
import { Search } from "@mui/icons-material";
import { FieldBox } from "./helpers";
import PatientListCard from "../../layout/header/patient-dropdown/PatientListCard";
import { toCardShape } from "../../layout/header/patient-dropdown/PatientDropdownPanel";

const PatientSearchField = ({ patients, loadingPatients, value, onChange, onSearch }) => {
  const getOptionLabel = (o) => {
    const name = o.name || o.fullName || `${o.firstName || ""} ${o.lastName || ""}`.trim();
    const id = o.patientId || o.chartNumber || o.id || o._id || "";
    return id ? `${name}  pt #${id}` : name;
  };

  return (
    <FieldBox label="For Patient" sx={{ flex: 1 }}>
      <Autocomplete
        size="small"
        options={patients}
        loading={loadingPatients}
        getOptionLabel={getOptionLabel}
        value={value}
        componentsProps={{ popper: { sx: { zIndex: 1400 } } }}
        onChange={(_, v) => onChange(v)}
        onInputChange={(_, v, reason) => { if (reason === "input" && onSearch) onSearch(v); }}
        renderOption={(props, o) => {
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
                sx: { fontFamily: "Inter", fontWeight: 500, fontSize: "13px", borderRadius: "8px", height: "40px" },
              }}
            />
          );
        }}
      />
    </FieldBox>
  );
};

export default PatientSearchField;
