import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  fetchClinicAnalytics,
  selectClinicAnalyticsSelectedBranchId,
  selectClinicAnalyticsData,
  selectClinicAnalyticsLoading,
} from '../../store/slices/clinicAnalyticsSlice';
import { useBranch } from '../../hooks/redux';

const MetricCard = ({ title, value, color }) => (
  <Paper
    elevation={0}
    sx={{
      flex: 1,
      p: 2.5,
      borderRadius: '22px',
      border: '1px solid #DFE5EC',
      bgcolor: '#FFFFFF',
      boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.02)',
    }}
  >
    <Typography sx={{ color: '#6B778C', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
      {title}
    </Typography>
    <Typography sx={{ color: color || '#1A1A1A', fontSize: '28px', fontWeight: 700, mt: 1 }}>
      {value}
    </Typography>
  </Paper>
);

const ClinicAnalyticsPage = () => {
  const dispatch = useDispatch();
  const selectedBranchId = useSelector(selectClinicAnalyticsSelectedBranchId);
  const data = useSelector(selectClinicAnalyticsData);
  const loading = useSelector(selectClinicAnalyticsLoading);
  // Branch list is owned by the global branchSlice (shared with the header's switcher in
  // UserProfile.jsx), not fetched separately here. Also land on whichever branch the user
  // already switched to from the header, so "View full analytics" continues the context
  // they were already working in rather than resetting to "All Branches".
  const { branches, currentBranchId, fetchBranches: loadBranches } = useBranch();

  useEffect(() => {
    if (branches.length === 0) {
      loadBranches();
    }
    dispatch(fetchClinicAnalytics({ branchId: currentBranchId || 'all' }));
    // Only meant to seed the initial branch once on mount — the Select below is the
    // source of truth for subsequent changes, independent of the global context.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const handleBranchChange = (event) => {
    dispatch(fetchClinicAnalytics({ branchId: event.target.value }));
  };

  return (
    <Box sx={{ backgroundColor: '#FFFFFF', p: '24px', minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#111827', mb: 0.5, letterSpacing: '-0.02em', fontSize: '1.75rem' }}>
            Clinic Analytics
          </Typography>
          <Typography variant="body2" sx={{ color: '#6B7280', fontSize: '0.9rem' }}>
            Appointment activity across your clinic locations.
          </Typography>
        </Box>

        <FormControl size="small" sx={{ minWidth: 220 }}>
          <InputLabel id="branch-select-label">Branch</InputLabel>
          <Select
            labelId="branch-select-label"
            label="Branch"
            value={selectedBranchId}
            onChange={handleBranchChange}
          >
            <MenuItem value="all">All Branches</MenuItem>
            {(branches || []).map((branch) => (
              <MenuItem key={branch.id} value={branch.id}>{branch.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {loading || !data ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box sx={{ display: 'flex', gap: 3, width: '100%', mb: 4, flexWrap: 'wrap' }}>
            <MetricCard title="Total Appointments" value={data.totalAppointments.toLocaleString('en-US')} color="#2362EF" />
            <MetricCard title="Completed" value={data.completed.toLocaleString('en-US')} color="#42C070" />
            <MetricCard title="Cancelled" value={data.cancelled.toLocaleString('en-US')} color="#E55353" />
            <MetricCard title="No-Show" value={data.noShow.toLocaleString('en-US')} color="#F59E0B" />
            <MetricCard title="New Patients" value={data.newPatients.toLocaleString('en-US')} color="#8B5CF6" />
          </Box>

          <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: '16px', border: '1px solid #DFE5EC' }}>
            <Typography sx={{ fontWeight: 600, color: '#111827', mb: 2 }}>
              Appointments by Month {selectedBranchId === 'all' ? '(All Branches)' : `(${data.branchName})`}
            </Typography>
            <Box sx={{ height: 320, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.appointmentsByMonth} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                  <XAxis dataKey="month" axisLine={{ stroke: '#000' }} tickLine={false} tick={{ fontSize: 11, fill: '#000' }} />
                  <YAxis axisLine={{ stroke: '#000' }} tickLine={false} tick={{ fontSize: 11, fill: '#000' }} />
                  <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="appointments" fill="#2362EF" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>

          {selectedBranchId === 'all' && data.byBranch && (
            <Paper elevation={0} sx={{ borderRadius: '16px', border: '1px solid #DFE5EC', overflow: 'hidden' }}>
              <Typography sx={{ fontWeight: 600, color: '#111827', p: 3, pb: 2 }}>
                Breakdown by Branch
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Branch</TableCell>
                      <TableCell align="right">Total Appointments</TableCell>
                      <TableCell align="right">Completed</TableCell>
                      <TableCell align="right">Cancelled</TableCell>
                      <TableCell align="right">No-Show</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.byBranch.map((row) => (
                      <TableRow key={row.branchId}>
                        <TableCell>{row.branchName}</TableCell>
                        <TableCell align="right">{row.totalAppointments.toLocaleString('en-US')}</TableCell>
                        <TableCell align="right">{row.completed.toLocaleString('en-US')}</TableCell>
                        <TableCell align="right">{row.cancelled.toLocaleString('en-US')}</TableCell>
                        <TableCell align="right">{row.noShow.toLocaleString('en-US')}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}
        </>
      )}
    </Box>
  );
};

export default ClinicAnalyticsPage;
