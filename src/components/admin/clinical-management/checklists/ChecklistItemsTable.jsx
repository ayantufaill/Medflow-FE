import { Box, Typography, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CopyIcon from '@mui/icons-material/ContentCopy';
import { ChoiceIcon } from './ChecklistIcons';

const ChecklistItemsTable = ({
  items,
  category,
  checklistIdx,
  activeInput,
  setActiveInput,
  handleInputSubmit,
  handleDeleteItem,
  handleCopyItemToClipboard
}) => {
  return (
    <Box sx={{ ml: 8, mr: 2, mb: 2, border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
      <Box sx={{ display: 'flex', backgroundColor: '#f8fafc', py: 1.5, px: 3, borderBottom: '1px solid #e2e8f0' }}>
        <Typography sx={{ width: 40, fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>#</Typography>
        <Typography sx={{ flex: 2, fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Item</Typography>
        <Typography sx={{ flex: 1.5, fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Item Choices</Typography>
        <Typography sx={{ flex: 1, fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Product</Typography>
        <Box sx={{ width: 100 }} />
      </Box>
      {items.map((item, idx) => (
        <Box key={idx} sx={{ display: 'flex', py: 2, px: 3, borderBottom: idx === items.length - 1 ? 'none' : '1px solid #e2e8f0', '&:hover': { backgroundColor: '#f8fafc' } }}>
          <Typography sx={{ width: 40, fontSize: '0.85rem', color: '#64748b' }}>{item.id}-</Typography>
          <Typography sx={{ flex: 2, fontSize: '0.85rem', color: '#1e293b', pr: 2, fontWeight: 500 }}>{item.text}</Typography>
          <Box sx={{ flex: 1.5 }}>
            {item.choices.map((choice, cIdx) => (
              <Box key={cIdx} sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                <ChoiceIcon />
                <Typography sx={{ fontSize: '0.85rem', color: '#334155' }}>{choice}</Typography>
              </Box>
            ))}
            {activeInput?.type === 'choice' && activeInput.itemIdx === idx && activeInput.checklistIdx === checklistIdx && activeInput.category === category ? (
              <Box sx={{ mt: 1 }}>
                <TextField
                  autoFocus
                  size="small"
                  placeholder="Type and press Enter"
                  value={activeInput.value}
                  onChange={(e) => setActiveInput({ ...activeInput, value: e.target.value })}
                  onKeyDown={handleInputSubmit}
                  onBlur={() => setActiveInput(null)}
                  sx={{
                    width: '100%',
                    '& .MuiOutlinedInput-root': { 
                      borderRadius: 2, 
                      backgroundColor: '#fff',
                      '&.Mui-focused fieldset': {
                        borderColor: '#3b82f6',
                        borderWidth: '2px',
                      }
                    },
                    '& .MuiInputBase-input': { fontSize: '0.85rem', py: 0.8, px: 1.5 },
                  }}
                />
              </Box>
            ) : (
              <Typography 
                onClick={() => setActiveInput({ type: 'choice', category, checklistIdx, itemIdx: idx, value: '' })}
                sx={{ fontSize: '0.8rem', color: '#3b82f6', fontWeight: 600, cursor: 'pointer', mt: 0.5, '&:hover': { textDecoration: 'underline' } }}
              >
                + Add choice
              </Typography>
            )}
          </Box>
          <Box sx={{ flex: 1 }}>
            {item.products && item.products.map((product, pIdx) => (
               <Typography key={pIdx} sx={{ fontSize: '0.85rem', color: '#334155', mb: 1 }}>• {product}</Typography>
            ))}
            {activeInput?.type === 'product' && activeInput.itemIdx === idx && activeInput.checklistIdx === checklistIdx && activeInput.category === category ? (
              <Box sx={{ mt: 1 }}>
                <TextField
                  autoFocus
                  size="small"
                  placeholder="Type and press Enter"
                  value={activeInput.value}
                  onChange={(e) => setActiveInput({ ...activeInput, value: e.target.value })}
                  onKeyDown={handleInputSubmit}
                  onBlur={() => setActiveInput(null)}
                  sx={{
                    width: '100%',
                    '& .MuiOutlinedInput-root': { 
                      borderRadius: 2, 
                      backgroundColor: '#fff',
                      '&.Mui-focused fieldset': {
                        borderColor: '#3b82f6',
                        borderWidth: '2px',
                      }
                    },
                    '& .MuiInputBase-input': { fontSize: '0.85rem', py: 0.8, px: 1.5 },
                  }}
                />
              </Box>
            ) : (
              <Typography 
                onClick={() => setActiveInput({ type: 'product', category, checklistIdx, itemIdx: idx, value: '' })}
                sx={{ fontSize: '0.8rem', color: '#3b82f6', fontWeight: 600, cursor: 'pointer', mt: 0.5, '&:hover': { textDecoration: 'underline' } }}
              >
                + Add Product
              </Typography>
            )}
          </Box>
          <Box sx={{ width: 100, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1.5 }}>
            <DeleteIcon 
              onClick={() => handleDeleteItem(category, checklistIdx, idx)}
              sx={{ color: '#ef4444', fontSize: '1.2rem', cursor: 'pointer', opacity: 0.7, '&:hover': { opacity: 1, transform: 'scale(1.1)' }, transition: 'all 0.2s' }} 
            />
            <CopyIcon 
              onClick={() => handleCopyItemToClipboard(item)}
              sx={{ color: '#64748b', fontSize: '1.2rem', cursor: 'pointer', opacity: 0.7, '&:hover': { opacity: 1, color: '#3b82f6', transform: 'scale(1.1)' }, transition: 'all 0.2s' }} 
            />
          </Box>
        </Box>
      ))}
      <Box sx={{ py: 2, px: 3, backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
        {activeInput?.type === 'item' && activeInput.checklistIdx === checklistIdx && activeInput.category === category ? (
          <Box sx={{ mb: 1 }}>
            <TextField
              autoFocus
              size="small"
              placeholder="Enter item text and press Enter"
              value={activeInput.value}
              onChange={(e) => setActiveInput({ ...activeInput, value: e.target.value })}
              onKeyDown={handleInputSubmit}
              onBlur={() => setActiveInput(null)}
              sx={{
                width: 320,
                '& .MuiOutlinedInput-root': { 
                  borderRadius: 2, 
                  backgroundColor: '#fff',
                  '&.Mui-focused fieldset': {
                    borderColor: '#3b82f6',
                    borderWidth: '2px',
                  }
                },
                '& .MuiInputBase-input': { fontSize: '0.85rem', py: 1, px: 2 },
              }}
            />
          </Box>
        ) : (
          <Typography 
            onClick={() => setActiveInput({ type: 'item', category, checklistIdx, value: '' })}
            sx={{ fontSize: '0.85rem', color: '#3b82f6', fontWeight: 600, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
          >
            + Add Checklist Item
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default ChecklistItemsTable;
