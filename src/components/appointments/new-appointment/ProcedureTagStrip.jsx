import { Box, Chip, Typography, Tooltip } from "@mui/material";
import { Label } from "./helpers";
import { DEFAULT_PROCEDURE_TAGS, TAG_DEFAULT_PROCEDURES } from "./constants";

const ProcedureTagStrip = ({
  selectedTagLabels,
  onTagClick,
  onOpenAddProcedureDialog,
}) => {
  return (
    <Box sx={{ mb: "20px" }}>
      <Label>Quick add procedure</Label>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: "6px", alignItems: "center" }}>
        {DEFAULT_PROCEDURE_TAGS.map((tag, idx) => {
          if (!TAG_DEFAULT_PROCEDURES[tag.label]) return null;
          const key = `${tag.label}-${idx}`;
          const isSelected = selectedTagLabels.has(key);
          const procInfo = TAG_DEFAULT_PROCEDURES[tag.label];
          return (
            <Tooltip
              key={key}
              title={
                <Box sx={{ px: 1, py: 0.5 }}>
                  <Typography variant="body2" sx={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 600 }}>
                    {tag.label} — {procInfo.treatment}
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: "Inter", fontSize: "11px", color: "#6b7280" }}>
                    Code: {procInfo.code} · {procInfo.charge}
                  </Typography>
                  {isSelected && (
                    <Typography variant="body2" sx={{ fontFamily: "Inter", fontSize: "11px", color: "#2262ef", mt: 0.5 }}>
                      Selected
                    </Typography>
                  )}
                </Box>
              }
              placement="top"
            >
              <Box sx={{ pointerEvents: "auto" }}>
                <Chip
                  label={tag.label}
                  onClick={() => onTagClick(tag.label, idx)}
                  sx={{
                    backgroundColor: tag.color,
                    color: tag.font || "#111",
                    borderRadius: "20px",
                    height: "26px",
                    fontSize: "11px",
                    fontWeight: 700,
                    fontFamily: "Inter",
                    cursor: "pointer",
                    border: isSelected ? "2px solid #09121f" : "2px solid transparent",
                    "& .MuiChip-label": { px: "8px" },
                    "&:hover": { opacity: 0.85 },
                  }}
                />
              </Box>
            </Tooltip>
          );
        })}

        <Box
          onClick={onOpenAddProcedureDialog}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            border: "1.5px dashed #d1d5db",
            borderRadius: "20px",
            px: "10px",
            height: "26px",
            cursor: "pointer",
            transition: "all 0.15s",
            "&:hover": { borderColor: "#2262ef", backgroundColor: "#f8fafc" },
          }}
        >
          <Typography sx={{ fontFamily: "Inter", fontSize: "11px", fontWeight: 500, color: "#6b7280" }}>
            + Add Procedure
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default ProcedureTagStrip;
