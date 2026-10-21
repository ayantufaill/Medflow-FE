import { Box, Menu, MenuItem, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import printIcon from "../../assets/clinicalicons/print icon.svg";
import exportIcon from "../../assets/clinicalicons/export icon.svg";
import settingsIcon from "../../assets/clinicalicons/setting icon.svg";
import { COLORS } from "../../constants/colors";
import { fontSize } from "../../constants/styles";
import NewLabCaseDialog from "./NewLabCaseDialog";
import { menuPaperSx, menuItemSx } from "./labCasesConstants";

const menuItemIconSx = { mr: 1.5, fontSize: "18px", color: COLORS.TEXT_MUTED };
const headerMenuIconSx = { width: 18, height: 18, mr: 1.5, flexShrink: 0 };

const LabCasesDialogsContainer = ({
  menuAnchor,
  onCloseMenu,
  onPrintList,
  onExportCsv,
  rowMenuAnchor,
  onCloseRowMenu,
  onEditRow,
  onDuplicateRow,
  onDeleteRow,
  dialogOpen,
  onCloseDialog,
  title,
  editingId,
  formData,
  onFormChange,
  onSubmitCase,
}) => (
  <>
    {/* Header Options Menu */}
    <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={onCloseMenu} PaperProps={{ sx: menuPaperSx(180) }}>
      <MenuItem
        onClick={() => {
          onCloseMenu();
          onPrintList();
        }}
        sx={menuItemSx}
      >
        <Box component="img" src={printIcon} alt="" sx={headerMenuIconSx} />
        <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.md }}>Print List</Typography>
      </MenuItem>
      <MenuItem
        onClick={() => {
          onCloseMenu();
          onExportCsv();
        }}
        sx={menuItemSx}
      >
        <Box component="img" src={exportIcon} alt="" sx={headerMenuIconSx} />
        <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.md }}>Export to CSV</Typography>
      </MenuItem>
      <MenuItem onClick={onCloseMenu} sx={menuItemSx}>
        <Box component="img" src={settingsIcon} alt="" sx={headerMenuIconSx} />
        <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.md }}>Lab Settings</Typography>
      </MenuItem>
    </Menu>

    {/* Row Options Menu */}
    <Menu anchorEl={rowMenuAnchor} open={Boolean(rowMenuAnchor)} onClose={onCloseRowMenu} PaperProps={{ sx: menuPaperSx(160) }}>
      <MenuItem onClick={onEditRow} sx={menuItemSx}>
        <EditIcon sx={menuItemIconSx} />
        <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.md }}>Edit</Typography>
      </MenuItem>
      <MenuItem onClick={onDuplicateRow} sx={menuItemSx}>
        <FileCopyIcon sx={menuItemIconSx} />
        <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.md }}>Duplicate</Typography>
      </MenuItem>
      <MenuItem onClick={onDeleteRow} sx={{ py: 0.75, "&:hover": { backgroundColor: "rgba(239, 68, 68, 0.08)" } }}>
        <DeleteIcon sx={{ mr: 1.5, fontSize: "18px", color: COLORS.STATUS_ERROR }} />
        <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.md, color: COLORS.STATUS_ERROR }}>
          Delete
        </Typography>
      </MenuItem>
    </Menu>

    {/* New / Edit Lab Case Dialog */}
    <NewLabCaseDialog
      scheduleStyle
      open={dialogOpen}
      onClose={onCloseDialog}
      title={title}
      heading={editingId ? "Edit Lab Case" : "New Lab Case"}
      submitLabel={editingId ? "Save Changes" : "Save"}
      formData={formData}
      onFormChange={onFormChange}
      onSubmit={onSubmitCase}
    />
  </>
);

export default LabCasesDialogsContainer;
