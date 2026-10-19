import { Box, Typography, IconButton, Button, MenuItem, Select, Tooltip } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import RefreshIcon from "@mui/icons-material/Refresh";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import ScienceIcon from "@mui/icons-material/Science";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { COLORS } from "../../constants/colors";
import { radius, fontSize, roundedSelectMenuProps } from "../../constants/styles";
import { STATUS_OPTIONS, actionButtonSx } from "./labCasesConstants";

const LabCasesFiltersBar = ({
  search,
  onSearchChange,
  onClearSearch,
  onOpenNewDialog,
  onOpenHeaderMenu,
  statusFilter,
  onStatusFilterChange,
  onRefresh,
  onResetFilters,
}) => (
  <>
    {/* ─── Row 1: Search & Actions ────────────────── */}
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
          placeholder="Search lab cases..."
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
          variant="outlined"
          disableElevation
          startIcon={<ScienceIcon sx={{ fontSize: "16px" }} />}
          onClick={onOpenNewDialog}
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
          New Lab Case
        </Button>
        <IconButton
          size="small"
          aria-label="Lab case options"
          onClick={onOpenHeaderMenu}
          sx={{
            border: `1px solid ${COLORS.BORDER}`,
            borderRadius: radius.md,
            color: COLORS.TEXT_MUTED,
            px: "6px",
            "&:hover": { backgroundColor: COLORS.SURFACE_HOVER, borderColor: COLORS.TEXT_MUTED },
          }}
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>

    {/* ─── Row 2: Filters ────────────────────────────── */}
    <Box sx={{ display: "flex", alignItems: "center", gap: "10px", mb: "14px", flexWrap: "wrap" }}>
      <Select
        value={statusFilter}
        displayEmpty
        onChange={(e) => onStatusFilterChange(e.target.value)}
        sx={{
          minWidth: 150,
          height: "36px",
          fontFamily: "Inter",
          fontSize: fontSize.md,
          color: COLORS.TEXT_BODY,
          backgroundColor: COLORS.SURFACE_CARD,
          borderRadius: radius.md,
          "& .MuiOutlinedInput-notchedOutline": { borderColor: COLORS.BORDER },
          "& .MuiSelect-select": { py: "8px" },
        }}
        MenuProps={roundedSelectMenuProps}
      >
        <MenuItem value="">All Statuses</MenuItem>
        {STATUS_OPTIONS.map((opt) => (
          <MenuItem key={opt} value={opt}>
            {opt}
          </MenuItem>
        ))}
      </Select>

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

export default LabCasesFiltersBar;
