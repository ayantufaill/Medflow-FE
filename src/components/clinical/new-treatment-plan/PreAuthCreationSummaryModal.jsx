import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import dayjs from 'dayjs';
import { COLORS } from '../../../constants/colors';

/**
 * PreAuthCreationSummaryModal
 *
 * Shown after pre-auth records are created when the selected procedures belong
 * to more than one provider. Each row represents one provider group and
 * exposes a "View Pre-Auth" link that opens the full PreAuthModal for that group.
 *
 * Props:
 *   open           - boolean
 *   onClose        - () => void   (x button)
 *   onDone         - () => void   (Done button)
 *   providerGroups - Array<{
 *                      provider:   string,
 *                      codes:      string[],
 *                      procedures: object[],
 *                      preAuthId:  string | null,
 *                      status:     string,
 *                      date:       Date | string | null,
 *                    }>
 *   onViewPreAuth  - (group) => void
 *   onSubmit       - () => void   (Submit button, creates one pre-auth per group)
 *   isSubmitting   - boolean      (disables the Submit button while saving)
 */
const PreAuthCreationSummaryModal = ({
  open,
  onClose,
  onDone,
  onSubmit,
  isSubmitting = false,
  providerGroups = [],
  onViewPreAuth,
}) => {
  const statusColor = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'draft') return '#D97706';
    if (s === 'approved') return '#16A34A';
    if (s === 'denied') return '#DC2626';
    if (s === 'requested') return '#2563EB';
    return '#64748B';
  };

  const statusBg = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'draft') return '#FFFBEB';
    if (s === 'approved') return '#F0FDF4';
    if (s === 'denied') return '#FEF2F2';
    if (s === 'requested') return '#EFF6FF';
    return '#F8FAFC';
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{ zIndex: 1390 }}
      PaperProps={{
        sx: {
          borderRadius: '12px',
          boxShadow: '0px 8px 32px rgba(0,0,0,0.14)',
        },
      }}
    >
      <DialogTitle
        sx={{
          m: 0,
          px: 3,
          py: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #E5E7EB',
          backgroundColor: '#FFFFFF',
        }}
      >
        <Typography
          sx={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 700,
            fontSize: '16px',
            color: '#111827',
            letterSpacing: '-0.3px',
          }}
        >
          Pre-Auth Creation
        </Typography>
        <IconButton size="small" onClick={onClose} sx={{ color: '#6B7280' }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 3, pt: 2.5, pb: 1, backgroundColor: '#FFFFFF' }}>
        <Typography
          sx={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            fontWeight: 600,
            color: '#111827',
            mb: 2,
          }}
        >
          {providerGroups.length > 1
            ? `These codes belong to ${providerGroups.length} providers. A separate Pre-Auth will be submitted for each provider.`
            : 'A Pre-Auth will be submitted for the selected codes.'}
        </Typography>

        <TableContainer
          sx={{
            border: '1px solid #E5E7EB',
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#F9FAFB' }}>
                {['Date', 'Code', 'Provider', 'Status', ''].map((col) => (
                  <TableCell
                    key={col}
                    sx={{
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 600,
                      fontSize: '13px',
                      color: '#6B7280',
                      py: 1.25,
                      borderBottom: '1px solid #E5E7EB',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {col}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {providerGroups.map((group, idx) => (
                <TableRow
                  key={idx}
                  sx={{
                    '&:last-child td': { border: 0 },
                    '&:hover': { backgroundColor: '#F9FAFB' },
                  }}
                >
                  <TableCell
                    sx={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '13px',
                      color: '#374151',
                      py: 1.5,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {group.date
                      ? dayjs(group.date).format('DD-MMM-YYYY')
                      : dayjs().format('DD-MMM-YYYY')}
                  </TableCell>

                  <TableCell
                    sx={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '13px',
                      color: '#374151',
                      py: 1.5,
                      maxWidth: 160,
                    }}
                  >
                    {(group.codes || []).join(', ') || '-'}
                  </TableCell>

                  <TableCell
                    sx={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#111827',
                      py: 1.5,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {group.provider || '-'}
                  </TableCell>

                  <TableCell sx={{ py: 1.5, whiteSpace: 'nowrap' }}>
                    <Typography
                      component="span"
                      sx={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: statusColor(group.status),
                        backgroundColor: statusBg(group.status),
                        px: '8px',
                        py: '3px',
                        borderRadius: '4px',
                        textTransform: 'capitalize',
                      }}
                    >
                      {group.status || 'Draft'}
                    </Typography>
                  </TableCell>

                  <TableCell sx={{ py: 1.5, textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <Typography
                      component="span"
                      onClick={() => onViewPreAuth && onViewPreAuth(group)}
                      sx={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#2563EB',
                        textDecoration: 'underline',
                        cursor: 'pointer',
                        '&:hover': { color: '#1D4ED8' },
                      }}
                    >
                      View Pre-Auth
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}

              {providerGroups.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    sx={{
                      textAlign: 'center',
                      py: 4,
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '13px',
                      color: '#9CA3AF',
                    }}
                  >
                    No pre-auth records found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 2,
          backgroundColor: '#FFFFFF',
          justifyContent: 'flex-end',
        }}
      >
        <Button
          variant="outlined"
          disableElevation
          onClick={onDone || onClose}
          disabled={isSubmitting}
          sx={{
            borderColor: '#D1D5DB',
            color: '#374151',
            backgroundColor: '#FFFFFF',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 500,
            fontSize: '14px',
            textTransform: 'none',
            borderRadius: '6px',
            px: 3,
            py: 0.9,
            boxShadow: 'none',
            '&:hover': { backgroundColor: '#F3F4F6', borderColor: '#D1D5DB', boxShadow: 'none' },
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          disableElevation
          onClick={onSubmit}
          disabled={isSubmitting || providerGroups.length === 0}
          startIcon={isSubmitting ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : null}
          sx={{
            backgroundColor: COLORS.ACCENT,
            color: '#FFFFFF',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 600,
            fontSize: '14px',
            textTransform: 'none',
            borderRadius: '6px',
            px: 3,
            py: 0.9,
            boxShadow: 'none',
            '&:hover': { backgroundColor: COLORS.ACCENT_HOVER, boxShadow: 'none' },
            '&.Mui-disabled': { backgroundColor: '#cbd5e1', color: '#fff' },
          }}
        >
          {isSubmitting ? 'Submitting…' : 'Submit'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PreAuthCreationSummaryModal;
