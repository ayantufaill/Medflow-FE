import { Box, Typography, Button, IconButton, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SettingsIcon from "@mui/icons-material/Settings";
import { COLORS } from "../../constants/colors";
import { radius, fontSize, fontWeight } from "../../constants/styles";
import { actionButtonSx } from "./imagesConstants";

const ImagesHeader = ({ title, onOpenNewMountMenu, onOpenSettings }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      mb: "16px",
      flexWrap: "wrap",
      gap: 2,
    }}
  >
    <Box>
      <Typography
        sx={{
          fontFamily: "Inter",
          fontSize: fontSize.base,
          color: COLORS.TEXT_MUTED,
          mb: "2px",
        }}
      >
        Patients / {title} /{" "}
        <Box component="span" sx={{ color: COLORS.TEXT_PRIMARY, fontWeight: fontWeight.bold }}>
          Imaging
        </Box>
      </Typography>
      <Typography
        variant="h5"
        sx={{
          fontFamily: "Inter",
          fontSize: "20px",
          fontWeight: fontWeight.bold,
          color: COLORS.TEXT_PRIMARY,
        }}
      >
        Imaging Mounts
      </Typography>
    </Box>

    <Box sx={{ display: "flex", gap: "8px", alignItems: "center" }}>
      <Tooltip title="Configure Imaging Devices">
        <IconButton
          onClick={onOpenSettings}
          sx={{
            border: `1px solid ${COLORS.BORDER}`,
            borderRadius: radius.md,
            backgroundColor: COLORS.SURFACE_CARD,
            "&:hover": { backgroundColor: COLORS.SURFACE_HOVER },
          }}
        >
          <SettingsIcon sx={{ fontSize: "18px", color: COLORS.TEXT_SECONDARY }} />
        </IconButton>
      </Tooltip>

      <Button
        variant="contained"
        disableElevation
        startIcon={<AddIcon sx={{ fontSize: "16px" }} />}
        onClick={onOpenNewMountMenu}
        sx={{
          ...actionButtonSx,
          backgroundColor: COLORS.ACCENT,
          "&:hover": { backgroundColor: COLORS.ACCENT_HOVER },
          px: 2,
        }}
      >
        New Mount
      </Button>
    </Box>
  </Box>
);

export default ImagesHeader;
