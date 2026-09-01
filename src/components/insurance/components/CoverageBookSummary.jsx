import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Box,
  Button,
  TableContainer,
} from "@mui/material";
import { Article as ArticleIcon } from "@mui/icons-material";
import { headerCellSx } from "../styles/coverageStyles";
import { DEFAULT_BOOK_ROW_DATA } from "../utils/insuranceConstants";
import ToothSelectionDialog from "../shared/ToothSelectionDialog";
import CoverageBookRow from "./CoverageBookRow";

const CoverageBookSummary = ({
  coverageData = [],
  onCoverageDataChange,
  onViewFullBook,
}) => {
  const [activeToothSelection, setActiveToothSelection] = useState(null);

  const rowData = DEFAULT_BOOK_ROW_DATA || [];

  const displayRows = useMemo(() => {
    const list = [...rowData];
    (coverageData || []).forEach((item) => {
      if (!item.code) return;
      const idx = list.findIndex((r) => r.code === item.code);
      if (idx >= 0) {
        list[idx] = { ...list[idx], ...item };
      } else {
        list.push(item);
      }
    });
    return list;
  }, [rowData, coverageData]);

  const getRowData = (code) => {
    return (
      coverageData.find(
        (item) => item.code === code || item.rowKey === `proc-${code}`,
      ) || {}
    );
  };

  const handleFieldChange = (code, field, value) => {
    if (!onCoverageDataChange) return;
    let updatedData = Array.isArray(coverageData) ? [...coverageData] : [];
    if (!updatedData || updatedData.length === 0) {
      updatedData = rowData.map((r) => ({ ...r }));
    }
    const idx = updatedData.findIndex(
      (item) => item.code === code || item.rowKey === `proc-${code}`,
    );
    if (idx >= 0) {
      updatedData[idx] = { ...updatedData[idx], [field]: value };
    } else {
      const template = rowData.find((r) => r.code === code) || { code };
      const newRow = { ...template, rowKey: `proc-${code}`, [field]: value };
      updatedData.push(newRow);
    }
    onCoverageDataChange(updatedData);
  };

  const handleToothToggle = (tooth) => {
    if (activeToothSelection === null) return;

    let updatedData = [...coverageData];
    const existingIndex = updatedData.findIndex(
      (item) =>
        item.code === activeToothSelection ||
        item.rowKey === `proc-${activeToothSelection}`,
    );

    let proc;
    if (existingIndex >= 0) {
      proc = { ...updatedData[existingIndex] };
    } else {
      const templateRow = rowData.find((r) => r.code === activeToothSelection);
      proc = { ...templateRow, rowKey: `proc-${activeToothSelection}` };
    }

    let currentTeeth = [];
    if (proc.teethLimit) {
      currentTeeth = proc.teethLimit
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
    } else if (Array.isArray(proc.teeth)) {
      currentTeeth = proc.teeth.map((t) => String(t).trim()).filter(Boolean);
    }

    if (currentTeeth.includes(tooth)) {
      currentTeeth = currentTeeth.filter((t) => t !== tooth);
    } else {
      currentTeeth.push(tooth);
    }

    proc.teethLimit = currentTeeth.join(", ");
    proc.teeth = currentTeeth;

    if (existingIndex >= 0) {
      updatedData[existingIndex] = proc;
    } else {
      updatedData.push(proc);
    }

    if (onCoverageDataChange) {
      onCoverageDataChange(updatedData);
    }
  };

  const getActiveSelectedTeeth = () => {
    if (!activeToothSelection) return [];
    const proc = {
      ...(rowData.find((r) => r.code === activeToothSelection) || {}),
      ...getRowData(activeToothSelection),
    };
    return proc.teethLimit || proc.teeth || [];
  };

  return (
    <Box sx={{ border: '1px solid #DFE5EC', borderRadius: '12px', backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column', width: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', bgcolor: '#f8f9fc', p: 1.5, borderBottom: '1px solid #DFE5EC' }}>
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
          <Box sx={{ bgcolor: '#e6f0fd', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32 }}>
            <ArticleIcon sx={{ fontSize: 16, color: '#2563eb' }} />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 600, color: "#111827", fontSize: "0.9rem", mb: 0.1, letterSpacing: '-0.3px' }}>
              Coverage Book Summary
            </Typography>
            <Typography sx={{ fontSize: '0.7rem', color: '#6b7280' }}>
              Procedure-level limits, age and downgrade rules
            </Typography>
          </Box>
        </Box>
        <Box sx={{ bgcolor: '#f3f4f6', px: 1.5, py: 0.5, borderRadius: '50px', height: 'fit-content' }}>
          <Typography sx={{ fontSize: '0.6rem', fontWeight: 700, color: '#4b5563', letterSpacing: '0.8px', textTransform: 'uppercase' }}>OPTIONAL</Typography>
        </Box>
      </Box>

      <Box sx={{ p: 1.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button
            variant="contained"
            className="view-btn"
            onClick={onViewFullBook}
            sx={{
              bgcolor: '#2563eb',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.75rem',
              borderRadius: '8px',
              px: 2.5,
              py: 1,
              boxShadow: 'none',
              '&:hover': { bgcolor: '#1d4ed8' },
            }}
          >
            View Full Coverage Book
          </Button>
        </Box>

        <TableContainer sx={{ overflowX: 'auto' }}>
          <Table size="small" sx={{ minWidth: 900 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ ...headerCellSx, textAlign: 'left', minWidth: '80px' }}>Code</TableCell>
                <TableCell sx={{ ...headerCellSx, textAlign: 'left', minWidth: '150px' }}>Procedure Name</TableCell>
                <TableCell sx={{ ...headerCellSx, minWidth: '100px' }}>Max Allowed / UCR ($)</TableCell>
                <TableCell sx={{ ...headerCellSx, minWidth: '120px' }}>Delivery Pattern (F,M,Y)</TableCell>
                <TableCell sx={{ ...headerCellSx, minWidth: '100px' }}>Lifetime Limit</TableCell>
                <TableCell sx={{ ...headerCellSx, minWidth: '80px' }}>Age Limit (Yrs)</TableCell>
                <TableCell sx={{ ...headerCellSx, minWidth: '70px' }}>Teeth Limit</TableCell>
                <TableCell sx={{ ...headerCellSx, minWidth: '70px' }}>Downgrade</TableCell>
                <TableCell sx={{ ...headerCellSx, minWidth: '50px' }}>NC</TableCell>
                <TableCell sx={{ ...headerCellSx, minWidth: '100px' }}>Flat Plan Portion</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayRows.map((templateRow, index) => {
                const row = { ...templateRow, ...getRowData(templateRow.code) };
                return (
                  <CoverageBookRow
                    key={index}
                    row={row}
                    index={row.code}
                    handleFieldChange={handleFieldChange}
                    setActiveToothSelection={setActiveToothSelection}
                  />
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <ToothSelectionDialog
        open={activeToothSelection !== null}
        onClose={() => setActiveToothSelection(null)}
        selectedTeeth={getActiveSelectedTeeth()}
        onToggle={handleToothToggle}
      />
    </Box>
  );
};

export default CoverageBookSummary;
