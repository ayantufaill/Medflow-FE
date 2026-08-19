import React from 'react';
import { Box, Typography, Avatar } from "@mui/material";
import { SmartToy, Check } from "@mui/icons-material";

const PatientChatMessageList = ({ messages }) => {
  return (
    <Box
      sx={{
        flexGrow: 1,
        p: 2,
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        scrollbarWidth: "thin",
        "&::-webkit-scrollbar": {
          width: "6px",
        },
        "&::-webkit-scrollbar-track": {
          background: "#f1f1f1",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "#c1c1c1",
          borderRadius: "3px",
        },
        "&::-webkit-scrollbar-thumb:hover": {
          background: "#a8a8a8",
        },
      }}
    >
      {messages.map((msg, i) => (
        <Box
          key={i}
          sx={{
            alignSelf: "flex-end",
            display: "flex",
            alignItems: "flex-start",
            gap: 1.5,
            maxWidth: "85%",
          }}
        >
          <Box sx={{ position: "relative" }}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                bgcolor: msg.type === "teal" ? "#e0f2f1" : "#fff7ed",
                border: `1px solid ${msg.type === "teal" ? "#b2dfdb" : "#ffedd5"}`,
                position: "relative",
                width: "280px",
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  fontSize: "11px",
                  fontWeight: 800,
                  color: msg.type === "teal" ? "#00695c" : "#c2410c",
                  mb: 0.5,
                  textTransform: "none",
                }}
              >
                {msg.title}
              </Typography>
              <Typography
                sx={{ fontSize: "12px", fontWeight: 600, color: "#1f2937" }}
              >
                {msg.patient}
              </Typography>
              {msg.details && (
                <Typography
                  sx={{ fontSize: "11px", color: "#6b7280", mt: 0.25 }}
                >
                  {msg.details}
                </Typography>
              )}

              <Box
                sx={{ mt: 1, display: "flex", justifyContent: "flex-end" }}
              >
                <Typography sx={{ fontSize: "10px", color: "#9ca3af" }}>
                  {msg.time}
                </Typography>
              </Box>
            </Box>

            {/* Status below the bubble */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                mt: 0.5,
              }}
            >
              <Typography
                sx={{
                  fontSize: "9px",
                  fontStyle: "italic",
                  color: "#16a34a",
                  mr: 0.25,
                }}
              >
                {msg.status}
              </Typography>
              <Check sx={{ fontSize: 14, color: "#16a34a" }} />
            </Box>
          </Box>

          <Avatar
            sx={{
              width: 36,
              height: 36,
              border: "1px solid #cbd5e1",
              bgcolor: "white",
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
              flexShrink: 0,
            }}
          >
            <SmartToy sx={{ color: "#00acc1", fontSize: 22 }} />
          </Avatar>
        </Box>
      ))}
    </Box>
  );
};

export default PatientChatMessageList;
