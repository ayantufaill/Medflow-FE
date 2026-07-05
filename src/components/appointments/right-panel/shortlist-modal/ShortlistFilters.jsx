import { useState } from "react";
import { Box, Typography } from "@mui/material";
import { Search, Print } from "@mui/icons-material";
import { FilterLabel, FilterInput, FilterSelect } from "./helpers";

const ShortlistFilters = () => {
  const [ampm, setAmpm] = useState("AM");

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
          <FilterSelect value="All" />
        </Box>

        <Box sx={{ width: "150px" }}>
          <FilterLabel>Max Appt. Duration</FilterLabel>
          <FilterInput
            endAdornment={
              <Typography sx={{ fontFamily: "Inter", fontSize: "12px", color: "#9aa3ae", flexShrink: 0 }}>min</Typography>
            }
          />
        </Box>

        <Box sx={{ width: "150px" }}>
          <FilterLabel>Min Appt. Duration</FilterLabel>
          <FilterInput
            endAdornment={
              <Typography sx={{ fontFamily: "Inter", fontSize: "12px", color: "#9aa3ae", flexShrink: 0 }}>min</Typography>
            }
          />
        </Box>

        <Box sx={{ width: "165px" }}>
          <FilterLabel>Pref Day</FilterLabel>
          <FilterSelect value="All" />
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
                defaultValue="12"
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
                  onClick={() => setAmpm(v)}
                  sx={{
                    px: "14px",
                    display: "flex", alignItems: "center",
                    backgroundColor: ampm === v ? "#2262ef" : "#fff",
                    cursor: "pointer",
                    "&:hover": { backgroundColor: ampm === v ? "#2262ef" : "#f5f7fa" },
                  }}
                >
                  <Typography sx={{ fontFamily: "Inter", fontSize: "13px", fontWeight: 600, color: ampm === v ? "#fff" : "#374151" }}>
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
        <Typography sx={{ fontFamily: "Inter", fontSize: "13px", color: "#2262ef", cursor: "pointer", fontWeight: 500 }}>
          + Select Flags
        </Typography>
      </Box>

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

        <Box sx={{
          border: "1px solid #d1d5db", borderRadius: "8px",
          px: "20px", height: "38px",
          display: "flex", alignItems: "center",
          cursor: "pointer", "&:hover": { backgroundColor: "#f5f7fa" },
        }}>
          <Typography sx={{ fontFamily: "Inter", fontSize: "13px", fontWeight: 500, color: "#374151" }}>
            Clear All Filters
          </Typography>
        </Box>

        <Box sx={{
          border: "1px solid #d1d5db", borderRadius: "8px",
          px: "16px", height: "38px",
          display: "flex", alignItems: "center", gap: "7px",
          cursor: "pointer", "&:hover": { backgroundColor: "#f5f7fa" },
        }}>
          <Print sx={{ fontSize: "15px", color: "#374151" }} />
          <Typography sx={{ fontFamily: "Inter", fontSize: "13px", fontWeight: 500, color: "#374151" }}>
            Print
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default ShortlistFilters;
