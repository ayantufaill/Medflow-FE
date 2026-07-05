import { Autocomplete, Box, Chip, IconButton, TextField, Typography } from "@mui/material";
import { Close } from "@mui/icons-material";
import { Label } from "./helpers";
import { DEFAULT_PROCEDURE_TAGS, DUMMY_PROCEDURE_OPTIONS } from "./constants";

const ProcedureTagStrip = ({
  selectedTagLabels,
  onTagClick,
  addingProcedure,
  procedureInput,
  onProcedureInputChange,
  onAddingProcedureToggle,
  onSelectProcedure,
}) => (
  <Box sx={{ mb: "20px" }}>
    <Label>Quick add procedure</Label>
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: "6px", alignItems: "center" }}>
      {DEFAULT_PROCEDURE_TAGS.map((tag, idx) => {
        const key = `${tag.label}-${idx}`;
        const isSelected = selectedTagLabels.has(key);
        return (
          <Chip
            key={key}
            label={tag.label}
            onClick={() => onTagClick(tag.label, idx)}
            sx={{
              backgroundColor: tag.color,
              color: tag.font || "#111",
              borderRadius: "20px", height: "26px",
              fontSize: "11px", fontWeight: 700, fontFamily: "Inter",
              cursor: "pointer",
              border: isSelected ? "2px solid #09121f" : "2px solid transparent",
              "& .MuiChip-label": { px: "8px" },
              "&:hover": { opacity: 0.85 },
            }}
          />
        );
      })}

      {addingProcedure ? (
        <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <Autocomplete
            autoFocus
            open={procedureInput.length > 0}
            options={DUMMY_PROCEDURE_OPTIONS}
            getOptionLabel={(o) => `${o.code} – ${o.treatment}`}
            inputValue={procedureInput}
            onInputChange={(_, v) => onProcedureInputChange(v)}
            onChange={(_, v) => onSelectProcedure(v)}
            filterOptions={(opts, { inputValue }) => {
              const q = inputValue.toLowerCase();
              return opts.filter((o) => o.code.toLowerCase().includes(q) || o.treatment.toLowerCase().includes(q));
            }}
            renderOption={(props, o) => (
              <Box component="li" {...props} key={o.code} sx={{ display: "flex", alignItems: "center", gap: "8px", py: "4px !important" }}>
                <Chip label={o.tag.label} size="small" sx={{ backgroundColor: o.tag.color, color: o.tag.font || "#111", fontSize: "9px", height: "16px", borderRadius: "4px", fontWeight: 700, "& .MuiChip-label": { px: "6px" } }} />
                <Typography sx={{ fontFamily: "Inter", fontSize: "11px", fontWeight: 600 }}>{o.code}</Typography>
                <Typography sx={{ fontFamily: "Inter", fontSize: "11px", color: "#6b7280" }}>{o.treatment}</Typography>
                <Typography sx={{ fontFamily: "Inter", fontSize: "11px", color: "#9aa3ae", ml: "auto" }}>{o.charge}</Typography>
              </Box>
            )}
            sx={{ width: 260 }}
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                autoFocus
                placeholder="Search by code or name…"
                onKeyDown={(e) => { if (e.key === "Escape") { onProcedureInputChange(""); onAddingProcedureToggle(false); } }}
                sx={{ "& .MuiInputBase-input": { fontFamily: "Inter", fontSize: "11px" } }}
              />
            )}
          />
          <IconButton size="small" onClick={() => { onProcedureInputChange(""); onAddingProcedureToggle(false); }} sx={{ p: "2px" }}>
            <Close sx={{ fontSize: "14px", color: "#9aa3ae" }} />
          </IconButton>
        </Box>
      ) : (
        <Box
          onClick={() => onAddingProcedureToggle(true)}
          sx={{ display: "flex", alignItems: "center", gap: "4px", border: "1.5px dashed #d1d5db", borderRadius: "20px", px: "10px", height: "26px", cursor: "pointer", "&:hover": { borderColor: "#2262ef" } }}
        >
          <Typography sx={{ fontFamily: "Inter", fontSize: "11px", fontWeight: 500, color: "#6b7280" }}>+ Add Procedure</Typography>
        </Box>
      )}
    </Box>
  </Box>
);

export default ProcedureTagStrip;
