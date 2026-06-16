import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
} from '@mui/material';

const LabelCell = ({ children }) => (
  <Typography sx={{ fontWeight: 600, color: '#444', fontSize: '0.85rem' }}>
    {children}
  </Typography>
);

const ValueCell = ({ children }) => (
  <Typography sx={{ color: '#555', fontSize: '0.85rem', wordBreak: 'break-all', overflowWrap: 'anywhere' }}>
    {children || ''}
  </Typography>
);

const CarrierInfoModal = ({ open, onClose, carrier }) => {
  if (!carrier) return null;

  // Safely extract address fields whether they are nested in an address object or at the top level
  const addressObj = typeof carrier.address === 'object' && carrier.address ? carrier.address : {};
  const addressLine1 = typeof carrier.address === 'string' ? carrier.address : (addressObj.addressLine1 || addressObj.address1 || addressObj.street || carrier.addressLine1 || carrier.address1 || '');
  const addressLine2 = addressObj.addressLine2 || addressObj.address2 || carrier.addressLine2 || carrier.address2 || '';
  const city = addressObj.city || carrier.city || '';
  const state = addressObj.state || carrier.state || '';
  const zipCode = addressObj.zipCode || carrier.zipCode || '';
  const country = addressObj.country || carrier.country || 'US';

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" PaperProps={{ sx: { width: '650px', borderRadius: '4px' } }}>
      <DialogTitle sx={{ 
        bgcolor: '#4a72b2', 
        color: '#fff', 
        textAlign: 'center', 
        p: 1.5, 
        fontSize: '1rem', 
        fontWeight: 500 
      }}>
        Carrier Info
      </DialogTitle>
      <DialogContent sx={{ p: '24px !important', pb: '16px !important' }}>
        <Box sx={{ 
          border: '1px solid #eee', 
          borderRadius: '4px',
          '& > div': {
            display: 'grid',
            gridTemplateColumns: '1fr 2fr 1fr 2fr',
            borderBottom: '1px solid #eee',
            '& > div': {
              p: 1.5,
              display: 'flex',
              alignItems: 'center'
            },
            '& > div:nth-of-type(odd)': {
              bgcolor: '#fbfbfb'
            }
          },
          '& > div:last-child': {
            borderBottom: 'none'
          }
        }}>
          {/* Row 1 */}
          <Box>
            <Box><LabelCell>Name</LabelCell></Box>
            <Box><ValueCell>{carrier.name}</ValueCell></Box>
            <Box><LabelCell>Country</LabelCell></Box>
            <Box><ValueCell>{country}</ValueCell></Box>
          </Box>
          {/* Row 2 */}
          <Box>
            <Box><LabelCell>Electronic ID</LabelCell></Box>
            <Box><ValueCell>{carrier.payerId || carrier.electronicId}</ValueCell></Box>
            <Box><LabelCell>Address Line 1</LabelCell></Box>
            <Box><ValueCell>{addressLine1}</ValueCell></Box>
          </Box>
          {/* Row 3 */}
          <Box>
            <Box><LabelCell>Phone</LabelCell></Box>
            <Box><ValueCell>{carrier.phone}</ValueCell></Box>
            <Box><LabelCell>Address Line 2</LabelCell></Box>
            <Box><ValueCell>{addressLine2}</ValueCell></Box>
          </Box>
          {/* Row 4 */}
          <Box>
            <Box><LabelCell>Email</LabelCell></Box>
            <Box><ValueCell>{carrier.email}</ValueCell></Box>
            <Box><LabelCell>City</LabelCell></Box>
            <Box><ValueCell>{city}</ValueCell></Box>
          </Box>
          {/* Row 5 */}
          <Box>
            <Box><LabelCell>Fax</LabelCell></Box>
            <Box><ValueCell>{carrier.fax}</ValueCell></Box>
            <Box><LabelCell>State</LabelCell></Box>
            <Box><ValueCell>{state}</ValueCell></Box>
          </Box>
          {/* Row 6 */}
          <Box>
            <Box><LabelCell>Website</LabelCell></Box>
            <Box><ValueCell>{carrier.website}</ValueCell></Box>
            <Box><LabelCell>Zip/Postal Code</LabelCell></Box>
            <Box><ValueCell>{zipCode}</ValueCell></Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 0, justifyContent: 'flex-end' }}>
        <Button 
          onClick={onClose} 
          variant="contained" 
          sx={{ 
            bgcolor: '#a0a0a0', 
            '&:hover': { bgcolor: '#8c8c8c' },
            textTransform: 'none',
            boxShadow: 'none',
            px: 3
          }}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CarrierInfoModal;
