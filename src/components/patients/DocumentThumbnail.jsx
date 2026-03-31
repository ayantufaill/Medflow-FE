import { Box, Typography, Paper, IconButton, Tooltip } from "@mui/material";
import { Description as DocIcon } from "@mui/icons-material";

export const DocumentThumbnail = ({ document, onOpen, onDownload, onShare }) => {
  return (
    <Box key={document.id} sx={{ minWidth: 280, maxWidth: 360 }}>
      <Paper
        variant="outlined"
        sx={{
          p: 2,
          display: "flex",
          alignItems: "flex-start",
          gap: 2,
        }}
      >
        <Box sx={{ color: "primary.main", mt: 0.25 }}>
          <DocIcon sx={{ fontSize: 28 }} />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="subtitle1" fontWeight={600}>
            {document.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Uploaded by {document.uploadedBy} — {document.uploadedDate}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {document.type}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};
