import { TableRow, TableCell, TextField, Checkbox, Box, Button } from '@mui/material';

const ChoiceInlineForm = ({
  inlineChoiceDraft,
  setInlineChoiceDraft,
  handleSaveInlineChoice,
  handleCancelInlineChoice
}) => {
  return (
    <TableRow sx={{ backgroundColor: '#f3f8fd', border: '1px solid #e0e5eb' }}>
      <TableCell>
        <TextField
          autoFocus
          placeholder="Choice name"
          size="small"
          variant="outlined"
          fullWidth
          value={inlineChoiceDraft.name}
          onChange={(e) => setInlineChoiceDraft({ ...inlineChoiceDraft, name: e.target.value })}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSaveInlineChoice(); }}
          sx={{
            '& .MuiInputBase-root': { fontFamily: 'Inter', fontSize: '13px', borderRadius: '8px', backgroundColor: '#fff' },
            '& .MuiInputBase-input': { color: '#374151', py: '8.5px' },
            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#d0d5dd' }
          }}
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
          onKeyDown={(e) => { if (e.key === 'Enter') handleSaveInlineChoice(); }}
          sx={{
            width: 70,
            '& .MuiInputBase-root': { fontFamily: 'Inter', fontSize: '13px', borderRadius: '8px', backgroundColor: '#fff' },
            '& .MuiInputBase-input': { color: '#374151', py: '8.5px' },
            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#d0d5dd' }
          }}
        />
      </TableCell>
      <TableCell>
        <TextField
          placeholder="Code"
          size="small"
          variant="outlined"
          value={inlineChoiceDraft.code}
          onChange={(e) => setInlineChoiceDraft({ ...inlineChoiceDraft, code: e.target.value })}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSaveInlineChoice(); }}
          sx={{
            '& .MuiInputBase-root': { fontFamily: 'Inter', fontSize: '13px', borderRadius: '8px', backgroundColor: '#fff' },
            '& .MuiInputBase-input': { color: '#374151', py: '8.5px' },
            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#d0d5dd' }
          }}
        />
      </TableCell>
      <TableCell align="right">
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            onClick={handleCancelInlineChoice}
            sx={{
              fontFamily: 'Inter', fontSize: '13px', fontWeight: 500,
              textTransform: 'none', borderRadius: '8px',
              border: '1px solid #d0d5dd', color: '#374151',
              px: '12px', py: '4.5px', minWidth: 'auto',
              '&:hover': { borderColor: '#9aa3ae', backgroundColor: '#f9fafb' },
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            disableElevation
            onClick={handleSaveInlineChoice}
            sx={{
              fontFamily: 'Inter', fontSize: '13px', fontWeight: 600,
              textTransform: 'none', borderRadius: '8px',
              backgroundColor: '#2262ef', color: '#fff',
              px: '16px', py: '4.5px', minWidth: 'auto',
              '&:hover': { backgroundColor: '#1a50cc' },
            }}
          >
            Save
          </Button>
        </Box>
      </TableCell>
    </TableRow>
  );
};

export default ChoiceInlineForm;
