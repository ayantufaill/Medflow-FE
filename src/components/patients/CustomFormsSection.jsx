import { Box, Typography } from "@mui/material";
import { Description as DocIcon, Assignment as ChecklistIcon, Check as CheckIcon } from "@mui/icons-material";

const truncateLabel = (value, max = 30) => {
  if (!value) return "";
  if (value.length <= max) return value;
  return `${value.slice(0, max - 3)}...`;
};

export const CustomFormsSection = ({ 
  customForms, 
  selectedFormId, 
  onFormClick, 
  onFormDeleteClick 
}) => {
  return (
    <Box sx={{ p: 3, mb: 2, borderRadius: 1, border: "1px solid #e0e0e0", bgcolor: "#ffffff" }}>
      <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
        Custom Forms:
      </Typography>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
        {customForms.map((f) => (
          <Box
            key={f.id}
            sx={{
              width: 190,
              textAlign: "center",
              cursor: "pointer",
            }}
            onClick={() => onFormClick(f)}
          >
            <Box sx={{ height: 92, display: "grid", placeItems: "center" }}>
              <Box sx={{ position: "relative", width: 72, height: 72 }}>
                <DocIcon sx={{ fontSize: 68, color: "primary.main" }} />
                <ChecklistIcon
                  sx={{
                    position: "absolute",
                    right: -4,
                    bottom: -6,
                    fontSize: 26,
                    color: "#64b5f6",
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    top: -6,
                    left: -6,
                    width: 12,
                    height: 12,
                    bgcolor: "#ffffff",
                    border: selectedFormId === f.id ? "1px solid #1976d2" : "1px solid #bdbdbd",
                    borderRadius: 0.5,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onFormDeleteClick(f);
                  }}
                >
                  {selectedFormId === f.id && (
                    <CheckIcon sx={{ fontSize: 10, color: "#1976d2" }} />
                  )}
                </Box>
              </Box>
            </Box>
            <Typography
              variant="body2"
              sx={{
                whiteSpace: "pre-line",
                fontWeight: 600,
                color: "#424242",
              }}
            >
              {truncateLabel(f.title.replace(/\n/g, " "))}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {f.status}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
