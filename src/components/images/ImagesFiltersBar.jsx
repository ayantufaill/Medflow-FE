import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  MenuItem,
  Select,
  Tooltip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import AddIcon from "@mui/icons-material/Add";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import SettingsIcon from "@mui/icons-material/Settings";
import DeleteIcon from "@mui/icons-material/Delete";
import RefreshIcon from "@mui/icons-material/Refresh";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import { COLORS } from "../../constants/colors";
import { radius, fontSize, fontWeight, roundedSelectMenuProps } from "../../constants/styles";
import { actionButtonSx, pillSelectSx, LAYOUT_OPTIONS } from "./imagesConstants";

const ImagesFiltersBar = ({
  search,
  onSearchChange,
  onClearSearch,
  onOpenNewMountMenu,
  onOpenImportDialog,
  onOpenSettings,
  selectedCount,
  onOpenBatchDelete,
  layoutFilter,
  onLayoutFilterChange,
  sortByName,
  onSortByNameChange,
  onRefresh,
  onResetFilters,
}) => (
  <>
    {/* ─── Row 1: Search & Action Buttons ────────────────── */}
    <Box sx={{ display: "flex", alignItems: "center", gap: "10px", mb: "14px", flexWrap: "wrap" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          flex: "1 1 280px",
          maxWidth: 420,
          backgroundColor: COLORS.SURFACE_INPUT,
          borderRadius: radius.md,
          px: "10px",
          py: "7px",
          border: "1.5px solid transparent",
          "&:focus-within": { borderColor: COLORS.ACCENT },
        }}
      >
        <SearchIcon sx={{ fontSize: "16px", color: COLORS.TEXT_MUTED, flexShrink: 0 }} />
        <Box
          component="input"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search mounts..."
          sx={{
            flex: 1,
            border: "none",
            outline: "none",
            backgroundColor: "transparent",
            fontFamily: "Inter",
            fontSize: fontSize.md,
            color: COLORS.TEXT_BODY,
            "&::placeholder": { color: COLORS.TEXT_MUTED },
          }}
        />
        {search && (
          <IconButton size="small" onClick={onClearSearch} aria-label="clear search" sx={{ p: "2px" }}>
            <ClearIcon sx={{ fontSize: "16px" }} />
          </IconButton>
        )}
      </Box>

      <Box sx={{ display: "flex", gap: "8px", flexWrap: "wrap", ml: "auto", alignItems: "center" }}>
        <Button
          variant="contained"
          disableElevation
          startIcon={<AddIcon sx={{ fontSize: "16px" }} />}
          onClick={onOpenNewMountMenu}
          sx={{
            ...actionButtonSx,
            backgroundColor: COLORS.ACCENT,
            "&:hover": { backgroundColor: COLORS.ACCENT_HOVER },
          }}
        >
          New Mount
        </Button>
        <Button
          variant="contained"
          disableElevation
          startIcon={<UploadFileIcon sx={{ fontSize: "16px" }} />}
          onClick={onOpenImportDialog}
          sx={{
            ...actionButtonSx,
            backgroundColor: COLORS.ACCENT,
            "&:hover": { backgroundColor: COLORS.ACCENT_HOVER },
          }}
        >
          Import Images
        </Button>
        <Button
          variant="outlined"
          startIcon={<SettingsIcon sx={{ fontSize: "16px" }} />}
          onClick={onOpenSettings}
          sx={{
            ...actionButtonSx,
            borderColor: COLORS.BORDER,
            color: COLORS.TEXT_BODY,
            "&:hover": {
              borderColor: COLORS.TEXT_MUTED,
              backgroundColor: COLORS.SURFACE_HOVER,
            },
          }}
        >
          Imaging Settings
        </Button>
        {selectedCount > 0 && (
          <Button
            variant="contained"
            disableElevation
            startIcon={<DeleteIcon sx={{ fontSize: "16px" }} />}
            onClick={onOpenBatchDelete}
            sx={{
              ...actionButtonSx,
              backgroundColor: COLORS.STATUS_ERROR,
              "&:hover": { backgroundColor: "#dc2626" },
            }}
          >
            Delete Selected ({selectedCount})
          </Button>
        )}
      </Box>
    </Box>

    {/* ─── Row 2: Filters Bar ────────────────────────────── */}
    <Box sx={{ display: "flex", alignItems: "center", gap: "10px", mb: "14px", flexWrap: "wrap" }}>
      <Select
        value={layoutFilter}
        displayEmpty
        onChange={(e) => onLayoutFilterChange(e.target.value)}
        sx={pillSelectSx}
        MenuProps={roundedSelectMenuProps}
      >
        <MenuItem value="">All Layouts</MenuItem>
        {LAYOUT_OPTIONS.map((opt) => (
          <MenuItem key={opt} value={opt}>
            {opt}
          </MenuItem>
        ))}
      </Select>

      <FormControlLabel
        control={
          <Checkbox
            checked={sortByName}
            onChange={(e) => onSortByNameChange(e.target.checked)}
            size="small"
            sx={{ color: COLORS.ACCENT, "&.Mui-checked": { color: COLORS.ACCENT } }}
          />
        }
        label="Sort By Name"
        sx={{
          "& .MuiFormControlLabel-label": {
            fontFamily: "Inter",
            fontSize: fontSize.base,
            color: COLORS.TEXT_BODY,
          },
        }}
      />

      <Box sx={{ display: "flex", gap: "4px", alignItems: "center", ml: "auto" }}>
        <Tooltip title="Refresh">
          <IconButton size="small" onClick={onRefresh} sx={{ color: COLORS.TEXT_MUTED }}>
            <RefreshIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Reset Filters">
          <IconButton size="small" onClick={onResetFilters} sx={{ color: COLORS.TEXT_MUTED }}>
            <FilterAltOffIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  </>
);

export default ImagesFiltersBar;
