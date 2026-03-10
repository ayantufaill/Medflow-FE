import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Collapse,
} from '@mui/material';
import {
  Close as CloseIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  Delete as DeleteIcon,
  ContentCopy as CopyIcon,
} from '@mui/icons-material';
import { formatDate } from './utils';

const STATUS_ROWS = [
  { id: 'hipaa', label: 'HIPAA', completed: 'No', pending: 'Yes', action: 'delete' },
  { id: 'confidential', label: 'Confidential Info', completed: 'No', pending: 'Yes', action: 'delete' },
  { id: 'medicalHistory', label: 'Medical History', completed: 'No', pending: 'Yes', action: 'copy' },
  { id: 'dentalHistory', label: 'Dental History', completed: 'No', pending: 'Yes', action: 'copy' },
];

export default function MyChartProfileModal({ open, onClose, patient }) {
  const [statusExpanded, setStatusExpanded] = useState(true);

  const name = patient ? `${patient.firstName || ''} ${patient.lastName || ''}`.trim() : 'Anna';
  const dob = formatDate(patient?.dateOfBirth) || '08/25/1998';
  const email = patient?.email || '–';

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 1.5,
          overflow: 'hidden',
        },
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          fontWeight: 700,
          fontSize: '1rem',
          py: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        MyChart File
        <IconButton size="small" onClick={onClose} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 400 }}>
          {/* Left: MYCHART PATIENT PROFILE */}
          <Box sx={{ borderRight: 1, borderColor: 'divider' }}>
            <Box
              sx={{
                bgcolor: 'success.light',
                color: 'success.dark',
                py: 1,
                px: 2,
                fontWeight: 700,
                fontSize: '0.9rem',
              }}
            >
              MYCHART PATIENT PROFILE
            </Box>
            <Box sx={{ p: 2 }}>
              <Typography variant="body2" fontWeight={600}>
                {name} {dob}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Email: {email}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Registered With: –
              </Typography>

              <Box sx={{ mt: 2 }}>
                <Button
                  fullWidth
                  onClick={() => setStatusExpanded(!statusExpanded)}
                  sx={{
                    justifyContent: 'flex-start',
                    textTransform: 'none',
                    fontWeight: 600,
                    color: 'text.primary',
                  }}
                  endIcon={statusExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                >
                  Mychart Profile Status
                </Button>
                <Collapse in={statusExpanded}>
                  <Table size="small" sx={{ mt: 1, '& td, & th': { borderBottom: 1, borderColor: 'divider', py: 1 } }}>
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600, width: '40%' }} />
                        <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem' }}>Completed</TableCell>
                        <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem' }}>Request Pending</TableCell>
                        <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem' }}>Import from MyChart</TableCell>
                      </TableRow>
                      {STATUS_ROWS.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell sx={{ fontWeight: 500 }}>{row.label}</TableCell>
                          <TableCell>{row.completed}</TableCell>
                          <TableCell>{row.pending}</TableCell>
                          <TableCell>
                            {row.action === 'delete' ? (
                              <IconButton size="small" color="error" sx={{ p: 0.25 }}>
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            ) : (
                              <Button
                                size="small"
                                variant="contained"
                                color="success"
                                startIcon={<CopyIcon fontSize="small" />}
                                sx={{ textTransform: 'none', fontSize: '0.75rem', py: 0.25 }}
                              >
                                Copy
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Collapse>
              </Box>
            </Box>
          </Box>

          {/* Right: OFFICE PATIENT PROFILE */}
          <Box>
            <Box
              sx={{
                bgcolor: 'grey.200',
                color: 'grey.800',
                py: 1,
                px: 2,
                fontWeight: 700,
                fontSize: '0.9rem',
              }}
            >
              OFFICE PATIENT PROFILE
            </Box>
            <Box sx={{ p: 2 }}>
              <Typography variant="body2" fontWeight={600}>
                {name} - {dob}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Email: {email}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                <Button
                  variant="contained"
                  size="small"
                  sx={{ textTransform: 'none', fontWeight: 600 }}
                >
                  Unlink
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  disabled
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    borderColor: 'grey.300',
                    color: 'grey.500',
                  }}
                >
                  Ignore Patient Requests
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              borderColor: 'grey.300',
              color: 'grey.700',
            }}
          >
            Cancel
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
