import React from 'react';
import { Box, Typography, Select, MenuItem } from "@mui/material";
import { COLORS } from "../../../constants/colors";
import { fontSize, fontWeight, radius, roundedSelectMenuProps } from "../../../constants/styles";
import { formatFieldKey } from "./utils";

const AuditHistoryFilter = ({ selectedAction, setSelectedAction, availableActions }) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
      <Typography
        sx={{
          fontSize: fontSize.md,
          fontWeight: fontWeight.semibold,
          color: COLORS.TEXT_SECONDARY,
        }}
      >
        Filter list by:
      </Typography>
      <Typography
        sx={{ fontSize: fontSize.md, color: COLORS.TEXT_SECONDARY }}
      >
        Action:
      </Typography>
      <Select
        size="small"
        value={selectedAction}
        onChange={(e) => setSelectedAction(e.target.value)}
        MenuProps={{
          ...(roundedSelectMenuProps || {}),
          sx: { zIndex: 30000, ...(roundedSelectMenuProps?.sx || {}) },
        }}
        sx={{
          minWidth: 160,
          fontFamily: "Inter",
          fontSize: fontSize.md,
          "& .MuiSelect-select": { py: "6px" },
          borderRadius: radius.md,
        }}
      >
        <MenuItem
          value="ALL"
          sx={{ fontFamily: "Inter", fontSize: fontSize.md }}
        >
          All Actions
        </MenuItem>
        {availableActions.map((actionKey) => (
          <MenuItem
            key={actionKey}
            value={actionKey}
            sx={{ fontFamily: "Inter", fontSize: fontSize.md }}
          >
            {formatFieldKey(actionKey)}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
};

export default AuditHistoryFilter;
