import { Box, Divider, Menu, MenuItem, Typography } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import SettingsIcon from "@mui/icons-material/Settings";
import EditIcon from "@mui/icons-material/Edit";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import DeleteIcon from "@mui/icons-material/Delete";
import { COLORS } from "../../constants/colors";
import { radius, fontSize, fontWeight } from "../../constants/styles";

export const NewMountMenu = ({ anchorEl, onClose, onOpenSettings, onOpenImport }) => (
  <Menu
    anchorEl={anchorEl}
    open={Boolean(anchorEl)}
    onClose={onClose}
    MenuListProps={{ sx: { p: 1, minWidth: 280 } }}
    PaperProps={{
      sx: {
        mt: "4px",
        borderRadius: radius.md,
        border: `1px solid ${COLORS.BORDER}`,
        boxShadow: "0px 4px 20px rgba(0,0,0,0.12)",
      },
    }}
  >
    <MenuItem disabled sx={{ opacity: "1 !important", py: 0.5, "&.Mui-disabled": { opacity: 1 } }}>
      <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.md, fontWeight: fontWeight.bold, color: COLORS.TEXT_PRIMARY }}>
        No devices found
      </Typography>
    </MenuItem>
    <MenuItem
      onClick={() => {
        onOpenSettings();
        onClose();
      }}
      sx={{ py: 0.5, mb: 0.5, "&:hover": { backgroundColor: COLORS.SURFACE_HOVER } }}
    >
      <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.sm, color: COLORS.TEXT_MUTED }}>
        Setup devices in{" "}
        <Box
          component="span"
          sx={{
            color: COLORS.ACCENT,
            fontWeight: fontWeight.semibold,
            cursor: "pointer",
            "&:hover": { textDecoration: "underline" },
          }}
        >
          Imaging Settings
        </Box>
      </Typography>
    </MenuItem>
    <Divider sx={{ my: 0.5 }} />
    <MenuItem
      onClick={() => {
        onClose();
        onOpenImport();
      }}
    >
      <UploadFileIcon sx={{ mr: 1.5, fontSize: "18px", color: COLORS.ACCENT }} />
      <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.md, fontWeight: fontWeight.medium }}>
        Import Images
      </Typography>
    </MenuItem>
    <Divider sx={{ my: 0.5 }} />
    <MenuItem
      onClick={() => {
        onOpenSettings();
        onClose();
      }}
    >
      <SettingsIcon sx={{ mr: 1.5, fontSize: "18px", color: COLORS.TEXT_MUTED }} />
      <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.md }}>
        Configure Devices
      </Typography>
    </MenuItem>
  </Menu>
);

export const MountRowActionMenu = ({
  anchorEl,
  onClose,
  activeMount,
  onOpenEdit,
  onOpenTransfer,
  onOpenDelete,
}) => (
  <Menu
    anchorEl={anchorEl}
    open={Boolean(anchorEl)}
    onClose={onClose}
    PaperProps={{
      sx: {
        mt: "4px",
        borderRadius: radius.md,
        border: `1px solid ${COLORS.BORDER}`,
        boxShadow: "0px 4px 20px rgba(0,0,0,0.12)",
        minWidth: 160,
      },
    }}
  >
    <MenuItem
      onClick={() => {
        onOpenEdit(activeMount);
        onClose();
      }}
    >
      <EditIcon sx={{ mr: 1.5, fontSize: "18px", color: COLORS.TEXT_MUTED }} />
      <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.md }}>Edit Mount</Typography>
    </MenuItem>
    <MenuItem
      onClick={() => {
        onOpenTransfer(activeMount);
        onClose();
      }}
    >
      <SwapHorizIcon sx={{ mr: 1.5, fontSize: "18px", color: COLORS.TEXT_MUTED }} />
      <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.md }}>Transfer Mount</Typography>
    </MenuItem>
    <Divider sx={{ my: 0.5 }} />
    <MenuItem
      onClick={() => {
        onOpenDelete(activeMount);
        onClose();
      }}
      sx={{ color: COLORS.STATUS_ERROR }}
    >
      <DeleteIcon sx={{ mr: 1.5, fontSize: "18px", color: COLORS.STATUS_ERROR }} />
      <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.md, color: COLORS.STATUS_ERROR }}>
        Delete Mount
      </Typography>
    </MenuItem>
  </Menu>
);
