import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNewOutlined';

const ACCENT_BLUE = '#2262EF';

const OfficeFiltersSection = ({ onAddFilter }) => (
  <Box
    sx={{
      mt: 3,
      bgcolor: '#ffffff',
      border: '1px solid #e8eaf0',
      borderRadius: 2,
      overflow: 'hidden',
    }}
  >
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        bgcolor: '#eef3fc',
        borderRadius: '8px 8px 0 0',
        px: 2.5,
        py: 1.25,
      }}
    >
      <AccessibilityNewIcon sx={{ fontSize: 18, color: ACCENT_BLUE }} />
      <Typography variant="subtitle1" sx={{ color: '#333', fontWeight: 600 }}>
        Office Filters
      </Typography>
    </Box>

    <Box sx={{ p: 2.5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAddFilter}
          sx={{
            borderRadius: '20px',
            textTransform: 'none',
            px: 2.5,
            bgcolor: ACCENT_BLUE,
            boxShadow: 'none',
            '&:hover': { bgcolor: '#1a4fc4', boxShadow: 'none' },
          }}
        >
          Add Filter
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e8eaf0', borderRadius: 2, bgcolor: '#ffffff' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ '& th': { borderBottom: '1px solid #e8eaf0', bgcolor: '#eef3fc' } }}>
              <TableCell sx={{ fontWeight: 600, color: '#8a8f98', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: 0.3, width: '30%' }}>
                Filter
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#8a8f98', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: 0.3, width: '40%' }}>
                Ops Included
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#8a8f98', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: 0.3, width: '30%' }}>
                Schedule
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell colSpan={3} sx={{ py: 4 }} />
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  </Box>
);

export default OfficeFiltersSection;