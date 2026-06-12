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
      PaperProps={{ sx: { borderRadius: 1 } }}
    >
      <DialogTitle sx={{ 
        bgcolor: '#4b71a1', 
        color: 'white', 
        textAlign: 'center',
        py: 1,
        fontSize: '1rem',
        fontWeight: 600
      }}>
        Edit Fee Guide
      </DialogTitle>
      <DialogContent sx={{ py: 3, px: 2 }}>
        <Typography variant="body2" sx={{ mb: 1, fontWeight: 700, color: '#333' }}>
          Name
        </Typography>
        <TextField
          size="small"
          fullWidth
          value={localName}
          onChange={(e) => setLocalName(e.target.value)}
          sx={{ 
            mb: 2,
            '& .MuiOutlinedInput-root': { 
              '& fieldset': { borderColor: '#4fc3f7' },
            }
          }}
        />
        <Button 
          variant="contained" 
          onClick={() => {
            if (feeGuideObj) {
              dispatch(setDefaultFeeGuide(feeGuideObj.id));
              onClose();
            }
          }}
          sx={{ 
            bgcolor: '#d9a366', 
            textTransform: 'none', 
            mb: 4,
            fontSize: '0.875rem',
            '&:hover': { bgcolor: '#c08d50' } 
          }}
        >
          Set As Default Fee Guide
        </Button>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button 
            variant="contained" 
            sx={{ bgcolor: '#d9a366', textTransform: 'none', minWidth: 80, '&:hover': { bgcolor: '#c08d50' } }}
            onClick={handleSave}
          >
            Save
          </Button>
          <Button 
            variant="contained" 
            sx={{ bgcolor: '#999', textTransform: 'none', minWidth: 80, '&:hover': { bgcolor: '#888' } }}
            onClick={onClose}
          >
            Cancel
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default EditFeeGuideDialog;
