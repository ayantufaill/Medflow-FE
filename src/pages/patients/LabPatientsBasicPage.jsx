import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { patientService } from '../../services/patient.service';

const formatDate = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString();
};

const LabPatientsBasicPage = () => {
  const [rows, setRows] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const result = await patientService.getBasicPatients(
          pagination.page,
          pagination.limit,
          search.trim(),
          '',
          controller.signal,
          'dueDate',
          'asc',
        );
        setRows(result?.patients || []);
        setPagination((prev) => ({
          ...prev,
          total: result?.pagination?.total || 0,
        }));
      } catch (err) {
        if (err.name !== 'CanceledError' && err.name !== 'AbortError') {
          setError(err.response?.data?.error?.message || 'Unable to load patients.');
        }
      } finally {
        setLoading(false);
      }
    };

    load();
    return () => controller.abort();
  }, [pagination.page, pagination.limit, search]);

  const emptyMessage = useMemo(
    () => (search.trim() ? 'No lab patients match your search.' : 'No lab-linked patients found.'),
    [search],
  );

  return (
    <Box sx={{ p: 3, bgcolor: 'background.paper', minHeight: 400 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Patients
        </Typography>
        <TextField
          size="small"
          label="Search"
          value={search}
          onChange={(event) => {
            setPagination((prev) => ({ ...prev, page: 1 }));
            setSearch(event.target.value);
          }}
          sx={{ width: { xs: '100%', sm: 280 } }}
        />
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 1 }}>
        <Table size="small" aria-label="Basic patient list for lab work">
          <TableHead>
            <TableRow>
              <TableCell>Patient</TableCell>
              <TableCell>Chart #</TableCell>
              <TableCell>DOB</TableCell>
              <TableCell>Branch</TableCell>
              <TableCell>Ordering Provider</TableCell>
              <TableCell>Lab Case</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Due Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 5 }}>
                  <CircularProgress size={24} />
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 5, color: 'text.secondary' }}>
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : rows.map((patient) => (
              <TableRow key={`${patient.patientId}-${patient.relatedLabCase?.id}`} hover={false}>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {patient.name || '-'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    ID {patient.patientId}
                  </Typography>
                </TableCell>
                <TableCell>{patient.chartNumber || '-'}</TableCell>
                <TableCell>{formatDate(patient.dateOfBirth)}</TableCell>
                <TableCell>{patient.branch?.name || patient.branch?.id || '-'}</TableCell>
                <TableCell>{patient.orderingProvider?.name || '-'}</TableCell>
                <TableCell>{patient.relatedLabCase?.id || '-'}</TableCell>
                <TableCell>
                  <Chip size="small" label={patient.labCaseStatus || '-'} />
                </TableCell>
                <TableCell>{formatDate(patient.dueDate)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={pagination.total}
        page={Math.max(0, pagination.page - 1)}
        rowsPerPage={pagination.limit}
        onPageChange={(_, nextPage) => setPagination((prev) => ({ ...prev, page: nextPage + 1 }))}
        onRowsPerPageChange={(event) => setPagination({ page: 1, limit: parseInt(event.target.value, 10), total: pagination.total })}
        rowsPerPageOptions={[10, 25, 50]}
      />
    </Box>
  );
};

export default LabPatientsBasicPage;
