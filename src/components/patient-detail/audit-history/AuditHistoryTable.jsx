import React from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, CircularProgress, Alert
} from "@mui/material";
import { COLORS } from "../../../constants/colors";
import { fontSize, fontWeight, radius } from "../../../constants/styles";

const diffSubHeaderSx = {
  fontFamily: "Inter",
  fontSize: fontSize.xs,
  fontWeight: fontWeight.semibold,
  color: COLORS.TEXT_MUTED,
  letterSpacing: "0.3px",
  textTransform: "uppercase",
  py: 0.5,
  borderBottom: `1px solid ${COLORS.BORDER}`,
};

const diffCellSx = {
  fontFamily: "Inter",
  fontSize: fontSize.sm,
  color: COLORS.TEXT_BODY,
  py: 0.75,
  px: 1,
  wordBreak: "break-word",
  whiteSpace: "pre-line",
};

const AuditHistoryTable = ({ loading, error, filteredAuditData }) => {
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          py: 8,
        }}
      >
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ py: 4 }}>
        <Alert severity="info">{error}</Alert>
      </Box>
    );
  }

  if (filteredAuditData.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography
          sx={{
            fontFamily: "Inter",
            fontSize: fontSize.md,
            color: COLORS.TEXT_MUTED,
          }}
        >
          No audit history available
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer
      sx={{
        border: `1px solid ${COLORS.BORDER}`,
        borderRadius: radius.lg,
        maxHeight: "calc(100vh - 280px)",
        overflow: "auto",
      }}
    >
      <Table size="small" stickyHeader sx={{ tableLayout: "fixed" }}>
        <TableHead>
          <TableRow
            sx={{
              "& .MuiTableCell-head": {
                fontFamily: "Inter",
                fontSize: fontSize.sm,
                fontWeight: fontWeight.semibold,
                color: COLORS.TEXT_MUTED,
                letterSpacing: "0.4px",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
                backgroundColor: COLORS.SURFACE_CARD,
                borderBottom: `1px solid ${COLORS.BORDER}`,
              },
            }}
          >
            <TableCell sx={{ width: 170 }}>Date</TableCell>
            <TableCell sx={{ width: 100 }}>User</TableCell>
            <TableCell sx={{ width: 140 }}>Name</TableCell>
            <TableCell sx={{ width: 170 }}>Action</TableCell>
            <TableCell colSpan={3} sx={{ p: 0 }}>
              <Box sx={{ py: 1, px: 1.5 }}>Difference</Box>
              <Box
                sx={{
                  display: "flex",
                  borderTop: `1px solid ${COLORS.BORDER}`,
                }}
              >
                <Box sx={{ ...diffSubHeaderSx, flex: 1, px: 1.5 }}>
                  Key
                </Box>
                <Box
                  sx={{
                    ...diffSubHeaderSx,
                    flex: 1,
                    px: 1.5,
                    borderLeft: `1px solid ${COLORS.BORDER}`,
                  }}
                >
                  Old
                </Box>
                <Box
                  sx={{
                    ...diffSubHeaderSx,
                    flex: 1,
                    px: 1.5,
                    borderLeft: `1px solid ${COLORS.BORDER}`,
                  }}
                >
                  New
                </Box>
              </Box>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredAuditData.map((row, rowIndex) => (
            <TableRow key={row.id || rowIndex} hover>
              <TableCell
                sx={{
                  fontFamily: "Inter",
                  fontSize: fontSize.sm,
                  color: COLORS.TEXT_BODY,
                  verticalAlign: "top",
                  borderBottom: `1px solid ${COLORS.BORDER_VERY_LIGHT}`,
                  whiteSpace: "nowrap",
                }}
              >
                {row.date}
              </TableCell>
              <TableCell
                sx={{
                  fontFamily: "Inter",
                  fontSize: fontSize.sm,
                  color: COLORS.TEXT_BODY,
                  verticalAlign: "top",
                  borderBottom: `1px solid ${COLORS.BORDER_VERY_LIGHT}`,
                }}
              >
                {row.user}
              </TableCell>
              <TableCell
                sx={{
                  fontFamily: "Inter",
                  fontSize: fontSize.sm,
                  color: COLORS.TEXT_BODY,
                  verticalAlign: "top",
                  borderBottom: `1px solid ${COLORS.BORDER_VERY_LIGHT}`,
                  wordBreak: "break-word",
                }}
              >
                {row.name}
              </TableCell>
              <TableCell
                sx={{
                  fontFamily: "Inter",
                  fontSize: fontSize.sm,
                  color: COLORS.TEXT_BODY,
                  verticalAlign: "top",
                  borderBottom: `1px solid ${COLORS.BORDER_VERY_LIGHT}`,
                  wordBreak: "break-word",
                }}
              >
                {row.action}
              </TableCell>
              <TableCell
                colSpan={3}
                sx={{
                  p: 0,
                  verticalAlign: "top",
                  borderBottom: `1px solid ${COLORS.BORDER_VERY_LIGHT}`,
                }}
              >
                {row.differences.map((diff, diffIndex) => (
                  <Box
                    key={diffIndex}
                    sx={{
                      display: "flex",
                      width: "100%",
                      borderTop:
                        diffIndex > 0
                          ? `1px solid ${COLORS.BORDER_VERY_LIGHT}`
                          : "none",
                    }}
                  >
                    <Box
                      sx={{
                        ...diffCellSx,
                        flex: 1,
                        fontWeight: fontWeight.medium,
                      }}
                    >
                      {diff.key}
                    </Box>
                    <Box
                      sx={{
                        ...diffCellSx,
                        flex: 1,
                        borderLeft: `1px solid ${COLORS.BORDER_VERY_LIGHT}`,
                      }}
                    >
                      {diff.old}
                    </Box>
                    <Box
                      sx={{
                        ...diffCellSx,
                        flex: 1,
                        borderLeft: `1px solid ${COLORS.BORDER_VERY_LIGHT}`,
                      }}
                    >
                      {diff.new}
                    </Box>
                  </Box>
                ))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AuditHistoryTable;
