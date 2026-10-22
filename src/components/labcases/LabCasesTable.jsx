import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Checkbox, IconButton } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { COLORS } from "../../constants/colors";
import { radius, fontSize, fontWeight, roundedSelectMenuProps } from "../../constants/styles";
import { STATUS_COLORS } from "./labCasesConstants";

const LabCasesTable = ({
  paginatedCases,
  filteredCount,
  selectedIds,
  allSelected,
  someSelected,
  onSelectAll,
  onSelectOne,
  onOpenRowMenu,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  search,
  statusFilter,
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
            <TableCell>Date</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Procedure</TableCell>
            <TableCell>Lab</TableCell>
            <TableCell>Est Receive Date</TableCell>
            <TableCell>Appt Date</TableCell>
            <TableCell>Provider</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right" sx={{ width: "48px" }} />
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedCases.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} align="center" sx={{ py: 5 }}>
                <Typography color="text.secondary" sx={{ fontFamily: "Inter", fontSize: fontSize.base }}>
                  {search || statusFilter ? "No lab cases match your filters" : "No lab cases found"}
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            paginatedCases.map((labCase) => {
              const isSelected = selectedIds.includes(labCase.id);
              const statusStyle = STATUS_COLORS[labCase.status] || {
                bg: COLORS.SURFACE_INPUT,
                color: COLORS.TEXT_SECONDARY,
              };
              return (
                <TableRow
                  key={labCase.id}
                  hover
                  selected={isSelected}
                  sx={{
                    "& .MuiTableCell-body": {
                      py: "8px",
                      fontFamily: "Inter",
                      fontSize: fontSize.md,
                      color: COLORS.TEXT_BODY,
                      borderBottom: `1px solid ${COLORS.BORDER_VERY_LIGHT}`,
                    },
                  }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      size="small"
                      checked={isSelected}
                      onChange={() => onSelectOne(labCase.id)}
                      sx={{ color: COLORS.ACCENT, "&.Mui-checked": { color: COLORS.ACCENT } }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.md, color: COLORS.TEXT_SECONDARY }}>
                      {labCase.date}
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
                      {labCase.type}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography
                      sx={{
                        fontFamily: "Inter",
                        fontSize: fontSize.md,
                        fontWeight: fontWeight.medium,
                        color: COLORS.TEXT_PRIMARY,
                      }}
                    >
                      {labCase.procedure}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.md, color: COLORS.TEXT_SECONDARY }}>
                      {labCase.lab}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.md, color: COLORS.TEXT_SECONDARY }}>
                      {labCase.estReceiveDate}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.md, color: COLORS.TEXT_SECONDARY }}>
                      {labCase.apptDate}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.md, color: COLORS.TEXT_SECONDARY }}>
                      {labCase.provider}
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
                        backgroundColor: statusStyle.bg,
                        color: statusStyle.color,
                      }}
                    >
                      {labCase.status}
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      aria-label={`Lab case options for ${labCase.procedure || labCase.date}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenRowMenu(e, labCase);
                      }}
                      sx={{ color: COLORS.TEXT_MUTED, p: "4px", "&:hover": { backgroundColor: COLORS.SURFACE_HOVER } }}
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
      count={filteredCount}
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

export default LabCasesTable;
