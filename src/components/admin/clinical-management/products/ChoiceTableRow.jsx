import { TableRow, TableCell, Checkbox, Button } from '@mui/material';
import { Check as CheckIcon } from '@mui/icons-material';

const ChoiceTableRow = ({ choice, section, categoryId, handleCheckboxChange, handleDeactivateChoice }) => {
  return (
    <TableRow sx={{ transition: 'background-color 0.2s', '&:hover': { backgroundColor: '#f8fafc' } }}>
      <TableCell sx={{ fontSize: '0.8rem', color: '#0f172a', fontWeight: 500 }}>{choice.name}</TableCell>
      <TableCell>
        <Checkbox
          size="small"
          checked={choice.isDefault}
          onChange={() => handleCheckboxChange(section, categoryId, choice.id, 'isDefault')}
          sx={{ p: 0.5, color: '#cbd5e1', '&.Mui-checked': { color: '#2563eb' }, '& .MuiSvgIcon-root': { fontSize: '1.2rem' } }}
        />
      </TableCell>
      <TableCell>
        <Checkbox
          size="small"
          checked={choice.quickList}
          onChange={() => handleCheckboxChange(section, categoryId, choice.id, 'quickList')}
          sx={{ p: 0.5, color: '#cbd5e1', '&.Mui-checked': { color: '#2563eb' }, '& .MuiSvgIcon-root': { fontSize: '1.2rem' } }}
        />
      </TableCell>
      <TableCell>
        {choice.isRecommended && (
          <CheckIcon sx={{ color: '#10b981', fontSize: '1.2rem', ml: 1 }} />
        )}
      </TableCell>
      <TableCell sx={{ fontSize: '0.8rem', color: '#475569' }}>${parseFloat(choice.price || 0).toFixed(2)}</TableCell>
      <TableCell sx={{ fontSize: '0.8rem', color: '#475569' }}>{choice.code || '-'}</TableCell>
      <TableCell align="right">
        <Button
          size="small"
          variant="outlined"
          onClick={() => handleDeactivateChoice(section, categoryId, choice.id)}
          sx={{
            textTransform: 'none',
            color: '#ef4444',
            borderColor: '#fca5a5',
            fontWeight: 600,
            '&:hover': { backgroundColor: '#fef2f2', borderColor: '#ef4444' },
            fontSize: '0.75rem',
            minWidth: 70,
            height: 24,
            borderRadius: 2,
          }}
        >
          Deactivate
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default ChoiceTableRow;
