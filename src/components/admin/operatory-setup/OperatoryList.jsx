import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Paper,
  Chip,
} from '@mui/material';
import DeleteSvg from '../../../assets/practicesetupicon/deleteicon.svg';

const OperatoryList = ({ operatories, onDeleteOperatory }) => (
  <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e8eaf0', borderRadius: 2 }}>
    <Table size="small">
      <TableHead>
        <TableRow sx={{ '& th': { borderBottom: '1px solid #dce6f7', bgcolor: '#eef3fc' } }}>
          <TableCell sx={{ fontWeight: 600, color: '#5b6b8c', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: 0.3 }}>Operatory</TableCell>
          <TableCell sx={{ fontWeight: 600, color: '#5b6b8c', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: 0.3 }}>Status</TableCell>
          <TableCell sx={{ fontWeight: 600, color: '#5b6b8c', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: 0.3 }}>Order</TableCell>
          <TableCell sx={{ fontWeight: 600, color: '#5b6b8c', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: 0.3 }}>Note</TableCell>
          <TableCell align="right" sx={{ width: 48 }} />
        </TableRow>
      </TableHead>
      <TableBody>
        {operatories.map((op, i) => {
          const isActive = op.isActive !== false;
          return (
            <TableRow
              key={op._id || i}
              sx={{
                '&:last-child td, &:last-child th': { border: 0 },
                '& td': { borderBottom: '1px solid #f0f1f4', color: '#5b6068', fontSize: '0.875rem' },
                opacity: isActive ? 1 : 0.6,
              }}
            >
              <TableCell sx={{ py: 1.5 }}>{op.name || op.roomNumber}</TableCell>
              <TableCell>
                <Chip
                  label={isActive ? (op.status || 'Active') : 'Deleted'}
                  size="small"
                  sx={{
                    backgroundColor: isActive ? '#dcfce7' : '#fee2e2',
                    color: isActive ? '#16a34a' : '#ef4444',
                    fontWeight: 600,
                    fontSize: '0.7rem',
                    height: 22,
                  }}
                />
              </TableCell>
              <TableCell>{op.order || i + 1}</TableCell>
              <TableCell>{op.note || '—'}</TableCell>
              <TableCell align="right">
                {isActive && (
                  <IconButton size="small" onClick={() => onDeleteOperatory(op._id || op.roomNumber)} sx={{ p: 0.5 }}>
                    <img src={DeleteSvg} alt="delete" width="16" height="16" />
                  </IconButton>
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  </TableContainer>
);

export default OperatoryList;