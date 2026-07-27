import React from 'react';
import { useDispatch } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  TextField,
  Box,
  Button,
} from '@mui/material';
import { updateFeeGuide, setDefaultFeeGuide } from '../../../store/slices/feeGuideSlice';

const EditFeeGuideDialog = ({ open, onClose, feeGuideObj }) => {
  const dispatch = useDispatch();
  const [localName, setLocalName] = React.useState('');

  React.useEffect(() => {
    if (feeGuideObj) {
      setLocalName(feeGuideObj.name || '');
    }
  }, [feeGuideObj, open]);

  const handleSave = () => {
    if (!feeGuideObj || !localName.trim()) return;
    dispatch(updateFeeGuide({ id: feeGuideObj.id, name: localName }));
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      sx={{ zIndex: 9999 }}
      PaperProps={{ sx: { borderRadius: 3, overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' } }}
    >
      <DialogTitle sx={{ 
        backgroundColor: '#fff',
        color: '#0f172a',
        fontSize: '1.1rem',
        fontWeight: 700,
        py: 3,
        px: 4,
        lineHeight: 1.3,
        borderBottom: '1px solid #f1f5f9'
      }}>
        Edit Fee Guide
      </DialogTitle>
      <DialogContent sx={{ py: 4, px: 4 }}>
        <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: '#334155' }}>
          Name
        </Typography>
        <TextField
          size="small"
          fullWidth
          value={localName}
          onChange={(e) => setLocalName(e.target.value)}
          sx={{ 
            mb: 4,
            '& .MuiInputBase-root': { backgroundColor: '#f8fafc', borderRadius: 2 },
            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e2e8f0' },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#cbd5e1' },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#2563eb' }
          }}
        />
        <Button 
          variant="outlined" 
          onClick={() => {
            if (feeGuideObj) {
              dispatch(setDefaultFeeGuide(feeGuideObj.id));
              onClose();
            }
          }}
          sx={{ 
            color: '#2563eb', 
            borderColor: '#2563eb',
            textTransform: 'none', 
            mb: 4,
            fontWeight: 600,
            borderRadius: 2,
            width: '100%',
            '&:hover': { backgroundColor: '#eff6ff', borderColor: '#1d4ed8' } 
          }}
        >
          Set As Default Fee Guide
        </Button>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
          <Button 
            variant="text" 
            sx={{ 
              textTransform: 'none', 
              color: '#475569', 
              fontWeight: 600, 
              borderRadius: 2, 
              px: 3, 
              '&:hover': { backgroundColor: '#f1f5f9' } 
            }}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            sx={{ 
              textTransform: 'none', 
              backgroundColor: '#2563eb', 
              fontWeight: 600, 
              borderRadius: 2, 
              px: 3, 
              boxShadow: 'none', 
              '&:hover': { backgroundColor: '#1d4ed8', boxShadow: 'none' } 
            }}
            onClick={handleSave}
            disabled={!localName.trim()}
          >
            Save
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default EditFeeGuideDialog;
