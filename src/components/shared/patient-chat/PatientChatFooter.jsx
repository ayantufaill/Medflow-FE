import React from 'react';
import { Box, Button } from "@mui/material";
import { KeyboardArrowDown } from "@mui/icons-material";

const PatientChatFooter = ({ actionButtons }) => {
  return (
    <Box
      sx={{
        p: 2,
        bgcolor: "#ffffff",
        display: "flex",
        flexWrap: "wrap",
        gap: 1.5,
        borderTop: "1px solid #e0e5eb",
        flexShrink: 0,
        justifyContent: "flex-start",
        alignContent: "flex-start",
      }}
    >
      {actionButtons.map((btn, i) => (
        <Button
          key={i}
          variant="contained"
          endIcon={btn.hasArrow ? <KeyboardArrowDown /> : null}
          onClick={btn.onClick}
          sx={{
            bgcolor: btn.color,
            color: btn.font === "black" ? "black" : "white",
            textTransform: "none",
            borderRadius: 50,
            fontSize: "11px",
            fontWeight: 700,
            px: 1.5,
            py: 0.6,
            boxShadow: "none",
            "&:hover": {
              bgcolor: btn.color,
              opacity: 0.9,
              boxShadow: "none",
              transform: "translateY(-1px)",
              transition: "all 0.2s",
            },
            transition: "all 0.2s",
            flexGrow: 0,
            flexShrink: 0,
            alignSelf: "flex-start",
          }}
        >
          {btn.label}
        </Button>
      ))}
    </Box>
  );
};

export default PatientChatFooter;
