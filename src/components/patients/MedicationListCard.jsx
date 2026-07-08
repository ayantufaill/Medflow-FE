import { Box, Typography, TextField, Button } from "@mui/material";
import { MedicationOutlined as MedicationIcon, Add as AddIcon, RemoveCircleOutline as RemoveIcon } from "@mui/icons-material";
import SectionCard from "../shared/SectionCard";
import { COLORS } from "../../constants/colors";
import { fontSize, fontWeight, radius } from "../../constants/styles";

const rowFieldSx = {
  "& .MuiInputBase-input": { padding: 0 },
  "& .MuiOutlinedInput-notchedOutline": { border: "none" },
};

/**
 * A medication/supplement row — pill icon, name + dosage stacked, a
 * freeform purpose "chip", and a remove button, matching the Task
 * List/Messages sidebar's row-card treatment for visual consistency.
 */
const MedicationRow = ({ row, onChangeRow, onRemoveRow }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 1.5,
      backgroundColor: "rgba(241, 246, 250, 0.60);",
      borderRadius: '20px',
      px: 1.5,
      py: 1,
      mb: 1,
    }}
  >
    <Box
      sx={{
        width: 32,
        height: 32,
        borderRadius: "50%",
        backgroundColor: COLORS.ACCENT_BG,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <MedicationIcon sx={{ fontSize: 16, color: COLORS.ACCENT }} />
    </Box>

    <Box sx={{ flex: 1, minWidth: 0 }}>
      <TextField
        variant="outlined"
        size="small"
        fullWidth
        placeholder="Drug name"
        value={row.drug}
        onChange={(e) => onChangeRow(row.id, "drug", e.target.value)}
        sx={{ ...rowFieldSx, "& .MuiInputBase-input": { padding: 0, fontFamily: "Inter", fontSize: fontSize.md, fontWeight: fontWeight.semibold, color: COLORS.TEXT_PRIMARY } }}
      />
      <TextField
        variant="outlined"
        size="small"
        fullWidth
        placeholder="Dosage · frequency"
        value={row.dosage}
        onChange={(e) => onChangeRow(row.id, "dosage", e.target.value)}
        sx={{ ...rowFieldSx, "& .MuiInputBase-input": { padding: 0, fontFamily: "Inter", fontSize: fontSize.base, color: COLORS.TEXT_SECONDARY } }}
      />
    </Box>

    <TextField
      variant="outlined"
      size="small"
      placeholder="Purpose"
      value={row.purpose}
      title={row.purpose || ""}
      onChange={(e) => onChangeRow(row.id, "purpose", e.target.value)}
      sx={{
        width: 160,
        flexShrink: 0,
        "& .MuiOutlinedInput-root": { borderRadius: radius.pill, backgroundColor: COLORS.SURFACE_CARD },
        "& .MuiInputBase-input": {
          fontFamily: "Inter",
          fontSize: fontSize.xs,
          fontWeight: fontWeight.medium,
          color: COLORS.TEXT_SECONDARY,
          textAlign: "center",
          py: 0.5,
          textOverflow: "ellipsis",
        },
      }}
    />

    <Box
      onClick={() => onRemoveRow(row.id)}
      sx={{ display: "flex", cursor: "pointer", color: COLORS.TEXT_MUTED, "&:hover": { color: COLORS.STATUS_ERROR } }}
    >
      <RemoveIcon sx={{ fontSize: 20 }} />
    </Box>
  </Box>
);

const MedicationListCard = ({ title, rows, onChangeRow, onAddRow, onRemoveRow }) => (
  <SectionCard
    icon={MedicationIcon}
    title={title}
    action={
      <Button
        size="small"
        startIcon={<AddIcon sx={{ fontSize: 16 }} />}
        onClick={onAddRow}
        sx={{
          textTransform: "none",
          fontFamily: "Inter",
          fontWeight: fontWeight.semibold,
          fontSize: fontSize.base,
          borderRadius: radius.pill,
          backgroundColor: COLORS.SURFACE_CARD,
          color: COLORS.TEXT_BODY,
          border: `1px solid ${COLORS.BORDER}`,
          px: 1.5,
          boxShadow: "none",
          "&:hover": { backgroundColor: COLORS.SURFACE_HOVER },
        }}
      >
        Add
      </Button>
    }
  >
    {rows.length ? (
      rows.map((row, index) => (
        <MedicationRow key={row.id || index} row={row} onChangeRow={onChangeRow} onRemoveRow={onRemoveRow} />
      ))
    ) : (
      <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.base, color: COLORS.TEXT_MUTED }}>
        None recorded.
      </Typography>
    )}
  </SectionCard>
);

export default MedicationListCard;
