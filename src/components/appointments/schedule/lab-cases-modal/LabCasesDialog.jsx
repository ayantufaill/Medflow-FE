import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  IconButton,
  Box,
  Link,
  Button
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ScienceIcon from '@mui/icons-material/Science';
import { COLORS } from '../../../../constants/colors';
import dayjs from 'dayjs';
import { labCaseService } from '../../../../services/lab-case.service';

import LabCasesFilters from './LabCasesFilters';
import LabCasesActions from './LabCasesActions';
import LabCasesTable from './LabCasesTable';

const LabCasesDialog = ({ open, onClose }) => {
  const [labCases, setLabCases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, limit: 25, total: 0 });
  const [filters, setFilters] = useState({
    status: 'Select Status',
    includeInactive: false,
    dateRange: 'Range',
    startDate: dayjs().subtract(30, 'day'),
    endDate: dayjs()
  });
  const [sortConfig, setSortConfig] = useState({ key: 'dueDate', order: 'asc' });
  const [expandedNotes, setExpandedNotes] = useState(false);

  const fetchLabCases = useCallback(async (pageToFetch = pagination.page) => {
    if (!open) return;
    setLoading(true);
    try {
      const result = await labCaseService.getAllLabCases({
        page: pageToFetch,
        limit: pagination.limit,
        status: filters.status,
        startDate: filters.startDate ? filters.startDate.format('YYYY-MM-DD') : undefined,
        endDate: filters.endDate ? filters.endDate.format('YYYY-MM-DD') : undefined,
        sortBy: sortConfig.key,
        order: sortConfig.order
      });
      setLabCases(result?.data?.labCases || result?.labCases || []);
      setPagination(result?.data?.pagination || result?.pagination || { page: 1, limit: 25, total: 0 });
    } catch (error) {
      console.error('Failed to fetch lab cases:', error);
    } finally {
      setLoading(false);
    }
  }, [open, filters.status, filters.startDate, filters.endDate, sortConfig.key, sortConfig.order, pagination.limit]);

  useEffect(() => {
    if (open) {
      fetchLabCases(1);
    }
  }, [open, sortConfig, filters.status]); // Only re-fetch on status/sort change or open. Date changes require "Apply".

  // Reset state when the dialog is closed
  useEffect(() => {
    if (!open) {
      setFilters({
        status: 'Select Status',
        includeInactive: false,
        dateRange: 'Range',
        startDate: dayjs().subtract(30, 'day'),
        endDate: dayjs()
      });
      setSortConfig({ key: 'dueDate', order: 'asc' });
      setPagination({ page: 1, limit: 25, total: 0 });
    }
  }, [open]);

  const handleApplyFilters = () => {
    fetchLabCases(1);
  };

  const handleSort = (newSortConfig) => {
    setSortConfig(newSortConfig);
  };

  const handlePageChange = (newPage) => {
    fetchLabCases(newPage);
  };

  const handleExportCSV = () => {

    const headers = ['Patient', 'Lab Provider', 'Due Date', 'Appointment Date', 'Shared Date', 'Status', 'Notes'];
    const csvContent = [
      headers.join(','),
      ...labCases.map(lc => [
        `"${(lc.patient?.name || '').replace(/"/g, '""')}"`,
        `"${(lc.laboratory?.name || '').replace(/"/g, '""')}"`,
        `"${lc.dueDate ? dayjs(lc.dueDate).format('MM/DD/YYYY') : ''}"`,
        `"${lc.appointmentDate ? dayjs(lc.appointmentDate).format('MM/DD/YYYY') : ''}"`,
        `"${lc.sentDate ? dayjs(lc.sentDate).format('MM/DD/YYYY') : ''}"`,
        `"${(lc.status || '').replace(/"/g, '""')}"`,
        `"${(lc.instructions || '').replace(/<[^>]*>?/gm, '').replace(/"/g, '""')}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('url');
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `lab-cases-${dayjs().format('YYYY-MM-DD')}.csv`);
    a.style.visibility = 'hidden';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      sx={{ zIndex: 1500 }}
      PaperProps={{
        sx: {
          borderRadius: "12px",
          border: '1px solid #e0e5eb',
          boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.1)',
          minHeight: '80vh',
          display: 'flex',
          flexDirection: 'column'
        }
      }}
    >
      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <DialogTitle
        sx={{
          display: "flex", alignItems: "center", gap: "12px",
          px: "10px", py: "10px",
          borderBottom: "1px solid #e0e5eb", flexShrink: 0,
          backgroundColor: "#f3f8fd",
          m: 0,
        }}
      >
        <Box sx={{
          width: "36px", height: "36px", borderRadius: "8px",
          backgroundColor: "#eff6ff",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <ScienceIcon sx={{ fontSize: "20px", color: "#2262ef" }} />
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: 1 }}>
          <Typography sx={{
            display: "flex", flexDirection: "column", justifyContent: "flex-start",
            alignItems: "flex-start", height: "24px", padding: "0px",
            fontFamily: "Inter", fontSize: "15px", fontWeight: 700, color: "#09121f",
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
          }}>
            Lab Cases
          </Typography>
        </Box>

        <IconButton onClick={onClose} size="small" sx={{ color: "#6b7280", ml: 1 }}>
          <CloseIcon sx={{ fontSize: "18px" }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: '25px', display: 'flex', flexDirection: 'column', backgroundColor: '#fff', flexGrow: 1, overflowY: 'auto' }}>
        <Link
          href="#"
          underline="always"
          sx={{ color: '#3b82f6', fontWeight: 600, fontSize: '0.85rem', mt: 1, mb: 2, display: 'inline-block' }}
        >
        </Link>

        {/* Filters */}
        <LabCasesFilters
          filters={filters}
          onFiltersChange={setFilters}
          onApplyFilters={handleApplyFilters}
        />

        {/* Actions */}
        <LabCasesActions
          onExportCSV={handleExportCSV}
          onPrint={handlePrint}
          expandedNotes={expandedNotes}
          onToggleNotes={() => setExpandedNotes(!expandedNotes)}
          disabled={loading}
        />

        {/* Table */}
        <Box sx={{ mb: '25px' }}>
          <LabCasesTable
            labCases={labCases}
            loading={loading}
            onSort={handleSort}
            sortConfig={sortConfig}
            pagination={pagination}
            onPageChange={handlePageChange}
            expandedNotes={expandedNotes}
          />
        </Box>

        <Box sx={{ p: "12px 24px", borderTop: '1px solid #e0e5eb', backgroundColor: '#fff', display: 'flex', justifyContent: 'flex-end', mt: 'auto', mx: '-25px', mb: '-25px' }}>
          <Button
            variant="outlined"
            size="small"
            onClick={onClose}
            sx={{
              borderColor: "#d0d5dd",
              color: "#374151",
              fontFamily: "Inter",
              "&:hover": { borderColor: "#9aa3ae", backgroundColor: "#f9fafb" },
              textTransform: "none",
              borderRadius: "8px",
              px: "16px", py: "7px",
              height: 36,
              fontSize: "13px",
              fontWeight: 500,
            }}
          >
            Close
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default LabCasesDialog;
