import { Box, IconButton } from "@mui/material";
import { PhotoCamera as CameraIcon, Description as DocIcon, Assignment as ChecklistIcon } from "@mui/icons-material";

export const FloatingActions = ({ onUploadCustomForm }) => {
  return (
    <Box
      sx={{
        position: "fixed",
        right: 16,
        top: "50%",
        transform: "translateY(-50%)",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        zIndex: 10,
      }}
    >
      <IconButton
        onClick={onUploadCustomForm}
        sx={{
          bgcolor: "#ffffff",
          borderRadius: "50%",
          border: "1px solid #e0e0e0",
          boxShadow: "0px 1px 3px rgba(0,0,0,0.15)",
          "&:hover": {
            bgcolor: "#fafafa",
          },
        }}
      >
        <CameraIcon fontSize="small" />
      </IconButton>
      <IconButton
        sx={{
          bgcolor: "#ffffff",
          borderRadius: "50%",
          border: "1px solid #e0e0e0",
          boxShadow: "0px 1px 3px rgba(0,0,0,0.15)",
          "&:hover": {
            bgcolor: "#fafafa",
          },
        }}
      >
        <DocIcon fontSize="small" />
      </IconButton>
      <IconButton
        sx={{
          bgcolor: "#ffffff",
          borderRadius: "50%",
          border: "1px solid #e0e0e0",
          boxShadow: "0px 1px 3px rgba(0,0,0,0.15)",
          "&:hover": {
            bgcolor: "#fafafa",
          },
        }}
      >
        <ChecklistIcon fontSize="small" />
      </IconButton>
    </Box>
  );
};
