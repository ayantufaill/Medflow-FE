import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Paper,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

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
        {operatories.map((op, i) => (
          <TableRow
            key={op._id || i}
            sx={{
              '&:last-child td, &:last-child th': { border: 0 },
              '& td': { borderBottom: '1px solid #f0f1f4', color: '#5b6068', fontSize: '0.875rem' },
            }}
          >
            <TableCell sx={{ py: 1.5 }}>{op.name || op.roomNumber}</TableCell>
            <TableCell>{op.status || 'Active'}</TableCell>
            <TableCell>{op.order || i + 1}</TableCell>
            <TableCell>{op.note || '—'}</TableCell>
            <TableCell align="right">
              <IconButton size="small" onClick={() => onDeleteOperatory(op._id || op.roomNumber)}>
                <DeleteOutlineIcon fontSize="small" sx={{ color: '#e05252' }} />
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

export default OperatoryList;