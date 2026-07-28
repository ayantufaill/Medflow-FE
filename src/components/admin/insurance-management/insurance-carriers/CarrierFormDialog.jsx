import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  FormControl,
  Select,
  MenuItem,
  Autocomplete,
  Button,
} from '@mui/material';
import { US_STATES, STATE_CITIES } from '../../../../constants/usAddressData';

const formatPhoneInput = (value) => {
  const digits = (value || "").replace(/\D/g, "").slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};

const CarrierFormDialog = ({
  open,
  onClose,
  title,
  carrier,
  setCarrier,
  onSave,
  providersList,
  getProviderName,
}) => {
  if (!carrier) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      sx={{ zIndex: 9999 }}
      PaperProps={{ sx: { borderRadius: 2, overflow: 'hidden' } }}
    >
      <DialogTitle sx={{ backgroundColor: '#F8FAFC', color: '#1e293b', fontSize: '1.1rem', py: 2, px: 3, fontWeight: 600, borderBottom: '1px solid #e2e8f0' }}>
        {title}
      </DialogTitle>
      <DialogContent sx={{ mt: 3, px: 3 }}>
        <Grid container spacing={2}>
          {/* Row 1 */}
          <Grid item xs={4}>
            <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 0.5, color: '#475569' }}>Carrier's Name *</Typography>
            <TextField
              fullWidth size="small" placeholder="Enter Name"
              value={carrier.name || ''}
              onChange={(e) => setCarrier({ ...carrier, name: e.target.value })}
              sx={{ '& .MuiInputBase-input': { fontSize: '0.85rem' } }}
            />
          </Grid>
          <Grid item xs={4}>
            <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 0.5, color: '#475569' }}>Carrier's Electronic Id *</Typography>
            <TextField
              fullWidth size="small"
              value={carrier.payerId || ''}
              onChange={(e) => setCarrier({ ...carrier, payerId: e.target.value })}
              sx={{ '& .MuiInputBase-input': { fontSize: '0.85rem' } }}
            />
            {title.includes('New') && (
              <FormControlLabel
                control={<Checkbox size="small" sx={{ p: 0.5, color: '#cbd5e1', '&.Mui-checked': { color: '#2563eb' } }} />}
                label={<Typography sx={{ fontSize: '0.75rem', color: '#475569' }}>Not Applicable</Typography>}
                sx={{ mt: 0.5 }}
              />
            )}
          </Grid>
          <Grid item xs={4}>
            <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 0.5, color: '#475569' }}>Phone</Typography>
            <TextField
              fullWidth size="small"
              placeholder="(201) 555-0123"
              value={carrier.phone || ''}
              onChange={(e) => {
                const formatted = formatPhoneInput(e.target.value);
                setCarrier({ ...carrier, phone: formatted });
              }}
              sx={{ '& .MuiInputBase-input': { fontSize: '0.85rem' } }}
            />
          </Grid>

          {/* Row 2 */}
          <Grid item xs={4}>
            <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 0.5, color: '#475569' }}>Email</Typography>
            <TextField
              fullWidth size="small"
              value={carrier.email || ''}
              onChange={(e) => setCarrier({ ...carrier, email: e.target.value })}
              sx={{ '& .MuiInputBase-input': { fontSize: '0.85rem' } }}
            />
          </Grid>
          <Grid item xs={4}>
            <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 0.5, color: '#475569' }}>Fax</Typography>
            <TextField
              fullWidth size="small"
              placeholder="(201) 555-0123"
              value={carrier.fax || ''}
              onChange={(e) => {
                const formatted = formatPhoneInput(e.target.value);
                setCarrier({ ...carrier, fax: formatted });
              }}
              sx={{ '& .MuiInputBase-input': { fontSize: '0.85rem' } }}
            />
          </Grid>
          <Grid item xs={4}>
            <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 0.5, color: '#475569' }}>Website</Typography>
            <TextField
              fullWidth size="small"
              value={carrier.website || ''}
              onChange={(e) => setCarrier({ ...carrier, website: e.target.value })}
              sx={{ '& .MuiInputBase-input': { fontSize: '0.85rem' } }}
            />
          </Grid>

          {/* Address Row 1 */}
          <Grid item xs={4}>
            <Typography variant="caption" sx={{ display: 'block', mb: 0.5, fontWeight: 600, color: '#475569' }}>Country:</Typography>
            <FormControl fullWidth size="small">
              <Select
                value={carrier.country || 'United States'}
                onChange={(e) => setCarrier({ ...carrier, country: e.target.value })}
                sx={{ fontSize: '0.85rem' }}
              >
                <MenuItem value="United States">United States</MenuItem>
                <MenuItem value="Canada">Canada</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="caption" sx={{ display: 'block', mb: 0.5, fontWeight: 600, color: '#475569' }}>Address Line 1:</Typography>
            <TextField
              fullWidth size="small" placeholder="Address line 1"
              value={carrier.address || ''}
              onChange={(e) => setCarrier({ ...carrier, address: e.target.value })}
              sx={{ '& .MuiInputBase-input': { fontSize: '0.85rem' } }}
            />
          </Grid>
          <Grid item xs={4}>
            <Typography variant="caption" sx={{ display: 'block', mb: 0.5, fontWeight: 600, color: '#475569' }}>Address Line 2:</Typography>
            <TextField
              fullWidth size="small" placeholder="Address line 2"
              value={carrier.address2 || ''}
              onChange={(e) => setCarrier({ ...carrier, address2: e.target.value })}
              sx={{ '& .MuiInputBase-input': { fontSize: '0.85rem' } }}
            />
          </Grid>

          {/* Address Row 2 */}
          <Grid item xs={4}>
            <Typography variant="caption" sx={{ display: 'block', mb: 0.5, fontWeight: 600, color: '#475569' }}>State/Province:</Typography>
            <FormControl fullWidth size="small">
              <Select
                value={carrier.state || ''}
                displayEmpty
                onChange={(e) => setCarrier({ ...carrier, state: e.target.value, city: '' })}
                sx={{ fontSize: '0.85rem' }}
              >
                <MenuItem value="" disabled>State/Province</MenuItem>
                {US_STATES.map((s) => <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="caption" sx={{ display: 'block', mb: 0.5, fontWeight: 600, color: '#475569' }}>City:</Typography>
            <Autocomplete
              freeSolo
              options={STATE_CITIES[carrier.state] || []}
              value={carrier.city || ''}
              onChange={(_, newVal) => setCarrier({ ...carrier, city: newVal || '' })}
              onInputChange={(_, newVal) => setCarrier({ ...carrier, city: newVal || '' })}
              disabled={!carrier.state && title.includes('New')}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth size="small" placeholder={carrier.state || !title.includes('New') ? "City" : "Select state first"}
                  sx={{ '& .MuiInputBase-input': { fontSize: '0.85rem' } }}
                />
              )}
            />
          </Grid>
          
          <Grid item xs={4}>
            <Typography variant="caption" sx={{ display: 'block', mb: 0.5, fontWeight: 600, color: '#475569' }}>Zip/Postal Code:</Typography>
            <TextField
              fullWidth size="small" placeholder="Zip/Postal Code"
              value={carrier.zipCode || ''}
              onChange={(e) => setCarrier({ ...carrier, zipCode: e.target.value })}
              sx={{ '& .MuiInputBase-input': { fontSize: '0.85rem' } }}
            />
          </Grid>

          {/* Bottom Row */}
          <Grid item xs={12} md={8}>
            <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 0.5, color: '#475569' }}>Providers out of network</Typography>
            <Grid container spacing={1}>
              {providersList?.map((provider) => (
                <Grid item xs={6} sm={4} key={provider._id}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        size="small"
                        sx={{ p: 0.5, color: '#cbd5e1', '&.Mui-checked': { color: '#2563eb' } }}
                        checked={carrier?.providersOutOfNetwork?.includes(provider._id) || false}
                        onChange={(e) => {
                          const currentList = carrier.providersOutOfNetwork || [];
                          if (e.target.checked) {
                            setCarrier({ ...carrier, providersOutOfNetwork: [...currentList, provider._id] });
                          } else {
                            setCarrier({
                              ...carrier,
                              providersOutOfNetwork: currentList.filter(id => id !== provider._id)
                            });
                          }
                        }}
                      />
                    }
                    label={<Typography sx={{ fontSize: '0.75rem', color: '#475569' }}>{getProviderName(provider)}</Typography>}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 0.5, color: '#475569' }}>Claim Type</Typography>
            <FormControl fullWidth size="small">
              <Select
                value={carrier.claimType || ''}
                onChange={(e) => setCarrier({ ...carrier, claimType: e.target.value })}
                sx={{ fontSize: '0.85rem' }}
                displayEmpty
              >
                <MenuItem value="" disabled>Select Type</MenuItem>
                <MenuItem value="Dental">Dental</MenuItem>
                <MenuItem value="Medical">Medical</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Row 7: Notes */}
          <Grid item xs={12}>
            <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 0.5, color: '#475569' }}>Notes</Typography>
            <TextField
              fullWidth multiline rows={4}
              value={carrier.notes || ''}
              onChange={(e) => setCarrier({ ...carrier, notes: e.target.value })}
              sx={{
                '& .MuiInputBase-root': { py: 1, fontSize: '0.85rem' },
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e2e8f0' }
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, pt: 2, gap: 1, backgroundColor: '#F8FAFC', borderTop: '1px solid #e2e8f0' }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            textTransform: 'none',
            color: '#475569',
            borderColor: '#cbd5e1',
            fontSize: '0.85rem',
            px: 3,
            borderRadius: '6px',
            '&:hover': { backgroundColor: '#f1f5f9', borderColor: '#94a3b8' }
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onSave}
          variant="contained"
          sx={{
            textTransform: 'none',
            backgroundColor: '#2563eb',
            color: '#fff',
            fontSize: '0.85rem',
            px: 3,
            borderRadius: '6px',
            boxShadow: 'none',
            '&:hover': { backgroundColor: '#1d4ed8', boxShadow: 'none' }
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CarrierFormDialog;
