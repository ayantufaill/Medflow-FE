import {
  Box,
  Checkbox,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import CollectionsIcon from "@mui/icons-material/Collections";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { COLORS } from "../../constants/colors";
import { radius, fontSize, fontWeight, roundedSelectMenuProps } from "../../constants/styles";

const ImagesTable = ({
  paginatedMounts,
  filteredMounts,
  selectedIds,
  allSelected,
  someSelected,
  onSelectAll,
  onSelectOne,
  onOpenEditor,
  onOpenRowMenu,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  search,
  layoutFilter,
}) => (
  <>
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow
            sx={{
              "& .MuiTableCell-head": {
                py: "10px",
                fontFamily: "Inter",
                fontSize: fontSize.sm,
                fontWeight: fontWeight.semibold,
                color: COLORS.TEXT_MUTED,
                letterSpacing: "0.4px",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
                borderBottom: `1px solid ${COLORS.BORDER}`,
              },
            }}
          >
            <TableCell padding="checkbox">
              <Checkbox
                size="small"
                indeterminate={someSelected}
                checked={allSelected}
                onChange={onSelectAll}
                sx={{ color: COLORS.ACCENT, "&.Mui-checked": { color: COLORS.ACCENT } }}
              />
            </TableCell>
            <TableCell>Mount Name</TableCell>
            <TableCell>Layout</TableCell>
            <TableCell>Date Created</TableCell>
            <TableCell>Content</TableCell>
            <TableCell align="right">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedMounts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                <Typography color="text.secondary" sx={{ fontFamily: "Inter", fontSize: fontSize.base }}>
                  {search || layoutFilter ? "No mounts match your filters" : "No imaging mounts found"}
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            paginatedMounts.map((mount) => {
              const isSelected = selectedIds.includes(mount.id);
              return (
                <TableRow
                  key={mount.id}
                  hover
                  selected={isSelected}
                  onClick={() => onOpenEditor(mount)}
                  sx={{
                    cursor: "pointer",
                    "& .MuiTableCell-body": {
                      py: "8px",
                      fontFamily: "Inter",
                      fontSize: fontSize.md,
                      color: COLORS.TEXT_BODY,
                      borderBottom: `1px solid ${COLORS.BORDER_VERY_LIGHT}`,
                    },
                  }}
                >
                  <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      size="small"
                      checked={isSelected}
                      onChange={() => onSelectOne(mount.id)}
                      sx={{ color: COLORS.ACCENT, "&.Mui-checked": { color: COLORS.ACCENT } }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <CollectionsIcon sx={{ fontSize: "18px", color: COLORS.ACCENT }} />
                      <Typography
                        sx={{
                          fontFamily: "Inter",
                          fontSize: fontSize.md,
                          fontWeight: fontWeight.medium,
                          color: COLORS.TEXT_PRIMARY,
                        }}
                      >
                        {mount.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.md, color: COLORS.TEXT_SECONDARY }}>
                      {mount.layout || "Grid"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.md, color: COLORS.TEXT_SECONDARY }}>
                      {mount.createdAt}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box
                      component="span"
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        px: "10px",
                        py: "3px",
                        borderRadius: radius.pill,
                        fontSize: fontSize.xs,
                        fontWeight: fontWeight.semibold,
                        backgroundColor: COLORS.SURFACE_INPUT,
                        color: COLORS.TEXT_SECONDARY,
                        border: `1px solid ${COLORS.BORDER}`,
                      }}
                    >
                      {mount.content}
                    </Box>
                  </TableCell>
                  <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                    <IconButton
                      size="small"
                      aria-label={`Actions for ${mount.name}`}
                      onClick={(e) => onOpenRowMenu(e, mount)}
                      sx={{ color: COLORS.TEXT_MUTED }}
                    >
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </TableContainer>

    <TablePagination
      component="div"
      count={filteredMounts.length}
      page={page}
      onPageChange={onPageChange}
      rowsPerPage={rowsPerPage}
      onRowsPerPageChange={onRowsPerPageChange}
      rowsPerPageOptions={[5, 10, 25, 50]}
      labelRowsPerPage="Rows per page:"
      SelectProps={{
        MenuProps: roundedSelectMenuProps,
      }}
      sx={{
        borderTop: `1px solid ${COLORS.BORDER}`,
        "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
          fontFamily: "Inter",
          fontSize: fontSize.sm,
          color: COLORS.TEXT_MUTED,
          textTransform: "uppercase",
          letterSpacing: "0.3px",
        },
        "& .MuiTablePagination-select": { fontFamily: "Inter", fontSize: fontSize.sm },
      }}
    />
  </>
);

export default ImagesTable;
