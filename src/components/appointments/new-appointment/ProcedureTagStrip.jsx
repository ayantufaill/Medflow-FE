import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Autocomplete, Box, Chip, IconButton, TextField, Typography, CircularProgress } from "@mui/material";
import { Close } from "@mui/icons-material";
import { fetchProcedureCodes, selectProcedureCodes, selectProcedureCodesLoading } from "../../../store/slices/feeGuideSlice";
import { Label } from "./helpers";
import { DEFAULT_PROCEDURE_TAGS, TAG_DEFAULT_PROCEDURES } from "./constants";

const ProcedureTagStrip = ({
  selectedTagLabels,
  onTagClick,
  addingProcedure,
  procedureInput,
  onProcedureInputChange,
  onAddingProcedureToggle,
  onSelectProcedure,
}) => {
  const dispatch = useDispatch();
  const procedureCodes = useSelector(selectProcedureCodes) || [];
  const loading = useSelector(selectProcedureCodesLoading);

  useEffect(() => {
    if (addingProcedure && procedureCodes.length === 0 && !loading) {
      dispatch(fetchProcedureCodes({ limit: 2000 }));
    }
  }, [addingProcedure, procedureCodes.length, loading, dispatch]);

  return (
  <Box sx={{ mb: "20px" }}>
    <Label>Quick add procedure</Label>
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: "6px", alignItems: "center" }}>
      {DEFAULT_PROCEDURE_TAGS.map((tag, idx) => {
        if (!TAG_DEFAULT_PROCEDURES[tag.label]) return null;
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
            openOnFocus
            options={procedureCodes}
            loading={loading}
            componentsProps={{ popper: { sx: { zIndex: 1400 } } }}
            getOptionLabel={(o) => `${o.ProcCode || o.code} – ${o.Descript || o.name || o.AbbrDesc || o.abbreviation}`}
            inputValue={procedureInput}
            onInputChange={(_, v) => onProcedureInputChange(v)}
            onChange={(_, v) => {
              if (v) {
                onSelectProcedure({
                  code: v.ProcCode || v.code,
                  treatment: v.Descript || v.name || v.AbbrDesc || v.abbreviation,
                  charge: "$0.00",
                  tag: { label: "PRC", color: "#e5e7eb", font: "#374151" },
                });
              }
            }}
            filterOptions={(opts, { inputValue }) => {
              const q = (inputValue || "").toLowerCase();
              return opts.filter((o) => (o.ProcCode || o.code || "").toLowerCase().includes(q) || (o.Descript || o.name || "").toLowerCase().includes(q));
            }}
            renderOption={(props, o) => {
              const { key, ...restProps } = props;
              return (
                <Box component="li" key={key} {...restProps} sx={{ display: "flex", alignItems: "center", gap: "8px", py: "4px !important" }}>
                  <Chip label="PRC" size="small" sx={{ backgroundColor: "#e5e7eb", color: "#374151", fontSize: "9px", height: "16px", borderRadius: "4px", fontWeight: 700, "& .MuiChip-label": { px: "6px" } }} />
                  <Typography sx={{ fontFamily: "Inter", fontSize: "11px", fontWeight: 600 }}>{o.ProcCode || o.code}</Typography>
                  <Typography sx={{ fontFamily: "Inter", fontSize: "11px", color: "#6b7280" }}>{o.Descript || o.name || o.AbbrDesc || o.abbreviation}</Typography>
                </Box>
              );
            }}
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
};

export default ProcedureTagStrip;
