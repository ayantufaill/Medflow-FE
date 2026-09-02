import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
} from '@mui/material';
import deleteSvg from '../../../assets/practicesetupicon/deleteicon.svg';
import editSvg from '../../../assets/practicesetupicon/editicon.svg';
import syncSvg from '../../../assets/claimicons/refreshicon.svg';
import viewSvg from '../../../assets/usermanagement icons/view.svg';
import documentsSvg from '../../../assets/practicesetupicon/documents.svg';

const FeeGuidesTable = ({
  feeGuidesData,
  onRowClick,
  onExportCSV,
  onSync,
  onDelete,
  onEdit,
  onOpenPlans,
  onAuditHistory,
}) => {
  const actionBtnStyle = {
    color: '#64748b',
    '&:hover': { color: '#2563eb', backgroundColor: '#eff6ff' },
    padding: '6px',
  };

  return (
    <TableContainer 
      component={Box} 
      sx={{ 
        backgroundColor: '#fff', 
        borderRadius: 2, 
        border: '1px solid #e2e8f0', 
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)', 
        overflow: 'hidden' 
      }}
    >
      <Table size="small" sx={{ '& .MuiTableCell-root': { py: 1.5, px: 2 } }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#F8FAFC' }}>
            <TableCell sx={{ color: '#475569', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '2px solid #e2e8f0 !important' }}>Name</TableCell>
            <TableCell sx={{ color: '#475569', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '2px solid #e2e8f0 !important' }}>Default</TableCell>
            <TableCell sx={{ color: '#475569', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '2px solid #e2e8f0 !important' }}>Default Provider</TableCell>
            <TableCell align="right" sx={{ borderBottom: '2px solid #e2e8f0 !important' }}></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {feeGuidesData.map((row) => (
            <TableRow 
              key={row.id} 
              sx={{ '&:hover': { backgroundColor: '#f8fafc' }, cursor: 'pointer' }}
              onClick={() => onRowClick(row.id)}
            >
              <TableCell sx={{ fontWeight: 600, color: '#1e293b', borderBottom: '1px solid #f1f5f9' }}>{row.name}</TableCell>
              <TableCell sx={{ color: '#64748b', borderBottom: '1px solid #f1f5f9' }}>{row.default}</TableCell>
              <TableCell sx={{ color: '#64748b', borderBottom: '1px solid #f1f5f9' }}>{row.defaultProvider}</TableCell>
              <TableCell align="right" sx={{ borderBottom: '1px solid #f1f5f9' }} onClick={(e) => e.stopPropagation()}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                  <Tooltip title="Export as CSV" arrow>
                    <IconButton size="small" sx={actionBtnStyle} onClick={(e) => { e.stopPropagation(); onExportCSV(e); }}>
                      <img src={documentsSvg} alt="Export" style={{ width: 16, height: 16 }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Sync" arrow>
                    <IconButton size="small" sx={actionBtnStyle} onClick={(e) => { e.stopPropagation(); onSync(); }}>
                      <img src={syncSvg} alt="Sync" style={{ width: 16, height: 16 }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete" arrow>
                    <IconButton size="small" sx={{ color: '#ef4444', '&:hover': { color: '#dc2626', backgroundColor: '#fef2f2' }, padding: '6px' }} onClick={(e) => { e.stopPropagation(); onDelete(row.id); }}>
                      <img src={deleteSvg} alt="Delete" style={{ width: 16, height: 16 }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit" arrow>
                    <IconButton size="small" sx={actionBtnStyle} onClick={(e) => { e.stopPropagation(); onEdit(row); }}>
                      <img src={editSvg} alt="Edit" style={{ width: 16, height: 16 }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Visibility" arrow>
                    <IconButton size="small" sx={actionBtnStyle}>
                      <img src={viewSvg} alt="View" style={{ width: 16, height: 16 }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={`${row.plans} Plan(s)`} arrow>
                    <IconButton size="small" sx={actionBtnStyle} onClick={(e) => { e.stopPropagation(); onOpenPlans(row.name); }}>
                      <img src={documentsSvg} alt="Plans" style={{ width: 16, height: 16 }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Audit History" arrow>
                    <IconButton size="small" sx={actionBtnStyle} onClick={(e) => { e.stopPropagation(); onAuditHistory(); }}>
                      <img src={documentsSvg} alt="Audit History" style={{ width: 16, height: 16 }} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </TableCell>
            </TableRow>
          ))}
          {feeGuidesData.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} align="center" sx={{ py: 4, color: '#64748b' }}>
                No fee guides found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default FeeGuidesTable;
