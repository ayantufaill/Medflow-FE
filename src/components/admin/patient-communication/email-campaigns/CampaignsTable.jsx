import React from 'react';
import {
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Link,
  Paper
} from '@mui/material';
import {
  Search as SearchIcon,
  PrintOutlined as PrintIcon,
  ContentCopy as CopyIcon,
  PersonOutline as PersonIcon,
} from '@mui/icons-material';

const mockData = [
  { name: 'Membership Plan-541244220-431372052', status: 'Sent', date: '12/11/2025', opened: '13', clicked: 'NA', bounced: 'NA', notOpened: '4', sentTo: '68 / 67' },
  { name: 'BOTOX-1042548036', status: 'Sent', date: '12/08/2025', opened: '149', clicked: '2', bounced: '5', notOpened: '144', sentTo: '225 / 248' },
  { name: 'BOTOX-1504342631', status: 'Sent', date: '12/02/2025', opened: '120', clicked: '1', bounced: '8', notOpened: '158', sentTo: '225 / 248' },
  { name: 'BOTOX-404166013', status: 'Sent', date: '11/24/2025', opened: '145', clicked: '1', bounced: '9', notOpened: '144', sentTo: '225 / 248' },
  { name: 'Use it or Lose it-1213300343', status: 'Sent', date: '11/03/2025', opened: '188', clicked: 'NA', bounced: '8', notOpened: '134', sentTo: '233 / 234' },
  { name: 'BOTOX-2134410491', status: 'Sent', date: '10/27/2025', opened: '156', clicked: '1', bounced: '4', notOpened: '164', sentTo: '223 / 233' },
  { name: 'BOTOX-1551912592', status: 'Draft', date: '10/14/2025', opened: 'NA', clicked: 'NA', bounced: 'NA', notOpened: 'NA', sentTo: '0' },
  { name: '4 Year Birthday-1121418329', status: 'Sent', date: '10/08/2025', opened: '121', clicked: '3', bounced: '2', notOpened: '142', sentTo: '225 / 233' },
  { name: 'BOTOX-107004543', status: 'Sent', date: '10/02/2025', opened: '151', clicked: '2', bounced: '5', notOpened: '158', sentTo: '220 / 225' },
  { name: 'BOTOX-655677420', status: 'Draft', date: '10/01/2025', opened: 'NA', clicked: 'NA', bounced: 'NA', notOpened: 'NA', sentTo: '0' },
];

const CampaignsTable = ({ onEditCampaign, onPreviewCampaign }) => {
  const thSx = { fontSize: '0.8rem', fontWeight: 700, color: '#1E293B', py: 1.5, borderBottom: '1px solid #E5E9F2', backgroundColor: '#FBFCFE' };
  const tdSx = { fontSize: '0.85rem', py: 1.5, borderBottom: '1px solid #F1F5F9' };

  return (
    <Box>
      {/* Table Controls */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <TextField
            size="small"
            placeholder="Search campaigns..."
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: '1.2rem', color: '#94a3b8' }} /></InputAdornment> }}
            sx={{ width: 260, '& .MuiOutlinedInput-root': { height: 36, fontSize: '0.85rem', borderRadius: 1, bgcolor: '#fff', '& fieldset': { borderColor: '#E5E9F2' }, '&:hover fieldset': { borderColor: '#cbd5e1' }, '&.Mui-focused fieldset': { borderColor: '#3B82F6' } } }}
          />
          <Select size="small" defaultValue="status" sx={{ minWidth: 140, height: 36, fontSize: '0.85rem', borderRadius: 1, bgcolor: '#fff', '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E5E9F2' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#cbd5e1' }, '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#3B82F6' } }}>
            <MenuItem value="status" sx={{ fontSize: '0.85rem' }}>View By Status</MenuItem>
          </Select>
          <Button variant="contained" sx={{ bgcolor: '#4285F4', textTransform: 'none', fontWeight: 500, fontSize: '0.85rem', borderRadius: 1, px: 3, height: 36, boxShadow: 'none', '&:hover': { bgcolor: '#3367d6', boxShadow: 'none' } }}>
            Apply
          </Button>
        </Box>
        <IconButton sx={{ bgcolor: '#fff', border: '1px solid #E5E9F2', borderRadius: 1.5, '&:hover': { bgcolor: '#F8FAFC' } }}>
          <PrintIcon sx={{ color: '#64748b', fontSize: '1.1rem' }} />
        </IconButton>
      </Box>

      {/* Data Table */}
      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2, border: '1px solid #E5E9F2', overflow: 'hidden' }}>
        <Table size="medium">
          <TableHead>
            <TableRow>
              <TableCell sx={thSx}>Name</TableCell>
              <TableCell sx={thSx}>Status</TableCell>
              <TableCell sx={thSx}>Created</TableCell>
              <TableCell sx={thSx} align="center">Opened</TableCell>
              <TableCell sx={thSx} align="center">Clicked</TableCell>
              <TableCell sx={thSx} align="center">Bounced</TableCell>
              <TableCell sx={thSx} align="center">Not Opened</TableCell>
              <TableCell sx={thSx}>Sent to</TableCell>
              <TableCell sx={{ ...thSx, backgroundColor: '#FBFCFE' }} align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockData.map((row, i) => (
              <TableRow key={i} hover sx={{ '&:last-child td, &:last-child th': { border: 0 }, transition: 'background-color 0.15s', '&:hover': { bgcolor: '#F8FAFC' } }}>
                <TableCell sx={{ ...tdSx, fontWeight: 500, color: '#1E293B' }}>{row.name}</TableCell>
                <TableCell sx={tdSx}>
                  <Box sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    px: 1.2, py: 0.3,
                    borderRadius: 1,
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    bgcolor: row.status === 'Sent' ? '#ECFDF5' : '#F1F5F9',
                    color: row.status === 'Sent' ? '#059669' : '#64748b',
                    border: '1px solid',
                    borderColor: row.status === 'Sent' ? '#A7F3D0' : '#E2E8F0'
                  }}>
                    {row.status}
                  </Box>
                </TableCell>
                <TableCell sx={{ ...tdSx, color: '#64748b' }}>{row.date}</TableCell>
                <TableCell sx={tdSx} align="center">
                  {row.opened !== 'NA' ? <Link href="#" underline="hover" sx={{ fontWeight: 500, color: '#3B82F6' }}>{row.opened}</Link> : <Typography sx={{ fontSize: '0.8rem', color: '#94a3b8' }}>NA</Typography>}
                </TableCell>
                <TableCell sx={tdSx} align="center">
                  {row.clicked !== 'NA' ? <Link href="#" underline="hover" sx={{ fontWeight: 500, color: '#3B82F6' }}>{row.clicked}</Link> : <Typography sx={{ fontSize: '0.8rem', color: '#94a3b8' }}>NA</Typography>}
                </TableCell>
                <TableCell sx={tdSx} align="center">
                  {row.bounced !== 'NA' ? <Link href="#" underline="hover" sx={{ fontWeight: 500, color: '#3B82F6' }}>{row.bounced}</Link> : <Typography sx={{ fontSize: '0.8rem', color: '#94a3b8' }}>NA</Typography>}
                </TableCell>
                <TableCell sx={tdSx} align="center">
                  {row.notOpened !== 'NA' ? <Link href="#" underline="hover" sx={{ fontWeight: 500, color: '#3B82F6' }}>{row.notOpened}</Link> : <Typography sx={{ fontSize: '0.8rem', color: '#94a3b8' }}>NA</Typography>}
                </TableCell>
                <TableCell sx={tdSx}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonIcon sx={{ fontSize: '1rem', color: '#64748b' }} />
                    <Link href="#" underline="hover" sx={{ fontWeight: 500, color: '#1E293B' }}>{row.sentTo}</Link>
                  </Box>
                </TableCell>
                <TableCell sx={tdSx} align="right">
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                    {row.status === 'Draft' && (
                      <Button 
                        variant="outlined" 
                        size="small" 
                        onClick={() => onEditCampaign(row.name)}
                        sx={{ borderRadius: 1.5, textTransform: 'none', py: 0.3, px: 1.5, fontSize: '0.75rem', borderColor: '#3B82F6', color: '#3B82F6', fontWeight: 600, '&:hover': { bgcolor: '#F0F5FF', borderColor: '#2563EB' } }}
                      >
                        Edit
                      </Button>
                    )}
                    <Button 
                      variant="contained" 
                      size="small" 
                      onClick={() => onPreviewCampaign(row.name)}
                      sx={{ borderRadius: 1.5, textTransform: 'none', py: 0.3, px: 1.5, fontSize: '0.75rem', bgcolor: '#F1F5F9', color: '#475569', boxShadow: 'none', fontWeight: 600, '&:hover': { bgcolor: '#E2E8F0', boxShadow: 'none' } }}
                    >
                      Preview
                    </Button>
                    <IconButton size="small" sx={{ color: '#94a3b8', '&:hover': { color: '#3B82F6', bgcolor: '#F0F5FF' } }}>
                      <CopyIcon sx={{ fontSize: '1.1rem' }} />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CampaignsTable;
