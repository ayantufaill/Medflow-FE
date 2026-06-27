import { Box, IconButton, MenuItem, Select, TextField, Typography } from "@mui/material";
import { DeleteOutline } from "@mui/icons-material";
import { Label, providerLabel } from "./helpers";

const ProviderTimesCard = ({ providerRows, setProviderRows, providers }) => (
  <Box>
    <Label>Provider / Assistant times</Label>
    <Box sx={{ border: "1px solid #e0e5eb", borderRadius: "8px", overflow: "hidden" }}>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: "6px", backgroundColor: "rgba(241, 246, 252, 0.60)", px: "8px", py: "6px", borderBottom: "1px solid #e0e5eb" }}>
        <Typography sx={{ flex: 1, fontFamily: "Inter", fontSize: "10px", fontWeight: 700, color: "#9aa3ae", letterSpacing: "0.5px" }}>PROVIDER</Typography>
        <Typography sx={{ width: "56px", fontFamily: "Inter", fontSize: "10px", fontWeight: 700, color: "#9aa3ae", letterSpacing: "0.5px" }}>TIME</Typography>
        {/* invisible spacers to align TIME header with time input */}
        <Typography sx={{ fontFamily: "Inter", fontSize: "11px", visibility: "hidden", userSelect: "none" }}>m</Typography>
        <Box sx={{ width: "20px" }} />
      </Box>

      {/* Rows */}
      {providerRows.map((row) => (
        <Box key={row.id} sx={{ display: "flex", alignItems: "center", gap: "6px", px: "8px", py: "8px", borderBottom: "1px solid #f0f2f5" }}>
          <Select
            size="small"
            displayEmpty
            value={row.providerId}
            onChange={(e) => setProviderRows((prev) => prev.map((r) => r.id === row.id ? { ...r, providerId: e.target.value } : r))}
            sx={{ flex: 1, fontFamily: "Inter", fontSize: "12px", "& .MuiSelect-select": { py: "5px" } }}
          >
            <MenuItem value="" sx={{ fontFamily: "Inter", fontSize: "12px", color: "#9aa3ae" }}>— Select —</MenuItem>
            {providers.map((p) => (
              <MenuItem key={p._id || p.id} value={String(p._id || p.id)} sx={{ fontFamily: "Inter", fontSize: "12px" }}>
                {providerLabel(p)}
              </MenuItem>
            ))}
          </Select>

          <TextField
            size="small"
            type="number"
            value={row.time}
            onChange={(e) => setProviderRows((prev) => prev.map((r) => r.id === row.id ? { ...r, time: Number(e.target.value) } : r))}
            sx={{
              width: "56px",
              "& .MuiInputBase-input": { fontFamily: "Inter", fontSize: "12px", fontWeight: 700, py: "5px", px: "4px", textAlign: "center" },
              "& input[type=number]": { MozAppearance: "textfield" },
              "& input[type=number]::-webkit-outer-spin-button": { display: "none" },
              "& input[type=number]::-webkit-inner-spin-button": { display: "none" },
            }}
          />
          <Typography sx={{ fontFamily: "Inter", fontSize: "11px", color: "#9aa3ae" }}>m</Typography>
          <IconButton
            size="small"
            onClick={() => setProviderRows((prev) => prev.filter((r) => r.id !== row.id))}
            sx={{ color: "#ef4444", p: "2px" }}
          >
            <DeleteOutline sx={{ fontSize: "14px" }} />
          </IconButton>
        </Box>
      ))}

      {/* Add button inside card */}
      <Box
        onClick={() => setProviderRows((prev) => [...prev, { id: Date.now(), providerId: "", time: 60 }])}
        sx={{ px: "10px", py: "8px", cursor: "pointer", textAlign: "center", "&:hover": { backgroundColor: "#f8fafc" } }}
      >
        <Typography sx={{ fontFamily: "Inter", fontSize: "12px", color: "#2262ef", fontWeight: 500 }}>
          + Add provider / assistant
        </Typography>
      </Box>
    </Box>
  </Box>
);

export default ProviderTimesCard;
