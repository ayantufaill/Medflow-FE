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
    if (!labCases.length) return;
    
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
          borderRadius: "14px",
          border: `1px solid ${COLORS.BORDER}`,
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
          boxSizing: "border-box",
          px: "25px",
          py: "16px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          borderBottom: `1px solid ${COLORS.BORDER}`,
          backgroundColor: COLORS.SURFACE_TINT,
          m: 0,
          flexShrink: 0,
        }}
      >
        <ScienceIcon sx={{ fontSize: "20px", color: COLORS.ACCENT }} />
        <Typography sx={{ fontSize: "15px", fontWeight: 600, color: COLORS.TEXT_PRIMARY, flex: 1 }}>
          Lab Cases
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: COLORS.TEXT_SECONDARY }}>
          <CloseIcon sx={{ fontSize: "18px" }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: '25px', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc', flexGrow: 1, overflowY: 'auto' }}>
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
          disabled={loading || labCases.length === 0}
        />

        {/* Table */}
        <LabCasesTable 
          labCases={labCases}
          loading={loading}
          onSort={handleSort}
          sortConfig={sortConfig}
          pagination={pagination}
          onPageChange={handlePageChange}
          expandedNotes={expandedNotes}
        />

        <Box sx={{ p: "12px 24px", borderTop: `1px solid ${COLORS.BORDER_LIGHT}`, backgroundColor: COLORS.WHITE, display: 'flex', justifyContent: 'flex-end', mt: 'auto', mx: '-25px', mb: '-25px' }}>
          <Button 
            variant="outlined" 
            size="small"
            onClick={onClose}
            sx={{ 
              borderColor: COLORS.BORDER,
              color: COLORS.TEXT_SECONDARY,
              "&:hover": { borderColor: COLORS.TEXT_SECONDARY, backgroundColor: "transparent" },
              textTransform: "none",
              borderRadius: "6px",
              px: "20px",
              height: 32,
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
