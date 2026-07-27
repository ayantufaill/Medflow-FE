import { TableRow, TableCell, TextField, Checkbox, IconButton, Box } from '@mui/material';
import { Save as SaveIcon, Close as CloseIcon } from '@mui/icons-material';

const ChoiceInlineForm = ({
  inlineChoiceDraft,
  setInlineChoiceDraft,
  handleSaveInlineChoice,
  handleCancelInlineChoice
}) => {
  return (
    <TableRow sx={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe' }}>
      <TableCell>
        <TextField
          autoFocus
          placeholder="Choice name"
          size="small"
          variant="outlined"
          fullWidth
          value={inlineChoiceDraft.name}
          onChange={(e) => setInlineChoiceDraft({ ...inlineChoiceDraft, name: e.target.value })}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: '#fff' }, '& .MuiInputBase-input': { fontSize: '0.8rem', py: 0.75 } }}
        />
      </TableCell>
      <TableCell>
        <Checkbox
          size="small"
          checked={inlineChoiceDraft.isDefault}
          onChange={(e) => setInlineChoiceDraft({ ...inlineChoiceDraft, isDefault: e.target.checked })}
          sx={{ p: 0.5, color: '#cbd5e1', '&.Mui-checked': { color: '#2563eb' } }}
        />
      </TableCell>
      <TableCell>
        <Checkbox
          size="small"
          checked={inlineChoiceDraft.quickList}
          onChange={(e) => setInlineChoiceDraft({ ...inlineChoiceDraft, quickList: e.target.checked })}
          sx={{ p: 0.5, color: '#cbd5e1', '&.Mui-checked': { color: '#2563eb' } }}
        />
      </TableCell>
      <TableCell>
        <Checkbox
          size="small"
          checked={inlineChoiceDraft.isRecommended}
          onChange={(e) => setInlineChoiceDraft({ ...inlineChoiceDraft, isRecommended: e.target.checked })}
          sx={{ p: 0.5, color: '#cbd5e1', '&.Mui-checked': { color: '#10b981' } }}
        />
      </TableCell>
      <TableCell>
        <TextField
          placeholder="00.0"
          size="small"
          variant="outlined"
          value={inlineChoiceDraft.price}
          onChange={(e) => setInlineChoiceDraft({ ...inlineChoiceDraft, price: e.target.value })}
          sx={{ width: 70, '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: '#fff' }, '& .MuiInputBase-input': { fontSize: '0.8rem', py: 0.75 } }}
        />
      </TableCell>
      <TableCell>
        <TextField
          placeholder="Code"
          size="small"
          variant="outlined"
          value={inlineChoiceDraft.code}
          onChange={(e) => setInlineChoiceDraft({ ...inlineChoiceDraft, code: e.target.value })}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: '#fff' }, '& .MuiInputBase-input': { fontSize: '0.8rem', py: 0.75 } }}
        />
      </TableCell>
      <TableCell align="right">
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton size="small" onClick={handleSaveInlineChoice} sx={{ color: '#10b981', backgroundColor: '#d1fae5', '&:hover': { backgroundColor: '#a7f3d0' } }}>
            <SaveIcon sx={{ fontSize: '1.2rem' }} />
          </IconButton>
          <IconButton size="small" onClick={handleCancelInlineChoice} sx={{ color: '#ef4444', backgroundColor: '#fee2e2', '&:hover': { backgroundColor: '#fecaca' } }}>
            <CloseIcon sx={{ fontSize: '1.2rem' }} />
          </IconButton>
        </Box>
      </TableCell>
    </TableRow>
  );
};

export default ChoiceInlineForm;
