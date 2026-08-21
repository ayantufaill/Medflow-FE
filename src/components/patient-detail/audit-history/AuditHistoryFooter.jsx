import React from 'react';
import { Box, Button } from "@mui/material";
import { COLORS } from "../../../constants/colors";
import { fontSize, fontWeight, radius } from "../../../constants/styles";

const AuditHistoryFooter = ({ onClose }) => {
  return (
    <Box
      sx={{
        px: 2.5,
        py: 1.5,
        borderTop: `1px solid ${COLORS.BORDER}`,
        display: "flex",
        justifyContent: "flex-end",
        backgroundColor: '#fff',
      }}
    >
      <Button
        variant="outlined"
        size="small"
        onClick={onClose}
        sx={{
          borderRadius: radius.sm,
          textTransform: "none",
          fontSize: fontSize.md,
          fontWeight: fontWeight.medium,
          px: 2,
          borderColor: COLORS.BORDER,
          color: COLORS.TEXT_PRIMARY,
          "&:hover": {
            borderColor: COLORS.TEXT_MUTED,
            backgroundColor: "rgba(0,0,0,0.02)",
          },
        }}
      >
        Close
      </Button>
    </Box>
  );
};

export default AuditHistoryFooter;
