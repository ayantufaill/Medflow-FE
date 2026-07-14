import { Box, Typography, Paper } from "@mui/material";
import { InsertDriveFileOutlined as DocIcon } from "@mui/icons-material";
import { COLORS } from "../../constants/colors";
import { fontSize, fontWeight } from "../../constants/styles";

export const DocumentThumbnail = ({ document, onOpen }) => {
  return (
    <Paper
      key={document.id}
      variant="outlined"
      onClick={onOpen ? () => onOpen(document) : undefined}
      sx={{
        width: 180,
        p: 1.25,
        display: "flex",
        alignItems: "flex-start",
        gap: 0.75,
        borderColor: COLORS.BORDER,
        borderRadius: "8px",
        cursor: onOpen ? "pointer" : "default",
        "&:hover": onOpen ? { borderColor: COLORS.ACCENT } : undefined,
      }}
    >
      <DocIcon sx={{ fontSize: 16, color: COLORS.ACCENT, mt: "2px", flexShrink: 0 }} />
      <Box sx={{ minWidth: 0 }}>
        <Typography
          sx={{
            fontFamily: "Inter",
            fontSize: fontSize.base,
            fontWeight: fontWeight.semibold,
            color: COLORS.TEXT_PRIMARY,
            lineHeight: 1.35,
            wordBreak: "break-word",
          }}
        >
          {document.name}
        </Typography>
        <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.sm, color: COLORS.TEXT_MUTED, lineHeight: 1.4 }}>
          Uploaded by {document.uploadedBy}
        </Typography>
        <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.sm, color: COLORS.TEXT_MUTED, lineHeight: 1.4 }}>
          {document.type}
        </Typography>
      </Box>
    </Paper>
  );
};
