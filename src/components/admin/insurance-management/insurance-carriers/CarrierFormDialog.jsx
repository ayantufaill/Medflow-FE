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
  IconButton,
  Box
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import docSvg from '../../../../assets/practicesetupicon/documents.svg';
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
      PaperProps={{ sx: { borderRadius: "12px", overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' } }}
    >
      <Box sx={{
        display: "flex", alignItems: "center", gap: "12px",
        px: "10px", py: "10px",
        borderBottom: "1px solid #e0e5eb", flexShrink: 0,
        backgroundColor: "#f3f8fd",
      }}>
        <Box sx={{
          width: "36px", height: "36px", borderRadius: "8px",
          backgroundColor: "#eff6ff",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <img src={docSvg} alt="Document" style={{ width: 20, height: 20, filter: 'brightness(0) saturate(100%) invert(35%) sepia(87%) saturate(5833%) hue-rotate(219deg) brightness(97%) contrast(98%)' }} />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: 1 }}>
          <Typography sx={{
            display: "flex", flexDirection: "column", justifyContent: "flex-start",
            alignItems: "flex-start", height: "24px", padding: "0px",
            fontFamily: "Inter", fontSize: "15px", fontWeight: 700, color: "#09121f",
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
          }}>
            {title}
          </Typography>
          <Typography sx={{
            fontWeight: 400, lineHeight: "16.25px", letterSpacing: "0px",
            textAlign: "left", color: "#5c646f", fontFamily: "Inter", fontSize: "11px",
          }}>
            Configure insurance carrier details.
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: "#6b7280", "&:hover": { color: "#111928", backgroundColor: "#e5e7eb" } }}>
          <CloseIcon />
        </IconButton>
      </Box>
      <DialogContent sx={{ mt: 1, px: 4, py: 3 }}>
        <Grid container spacing={2}>
          {/* Row 1 */}
          <Grid item xs={4}>
            <Typography sx={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 500, color: '#374151', mb: '4px' }}>Carrier's Name *</Typography>
            <TextField
              fullWidth size="small" placeholder="Enter Name"
              value={carrier.name || ''}
              onChange={(e) => setCarrier({ ...carrier, name: e.target.value })}
              sx={{ "& .MuiInputBase-root": { fontFamily: "Inter", fontSize: "13px", borderRadius: "8px" }, "& .MuiInputBase-input": { color: "#374151" } }}
            />
          </Grid>
          <Grid item xs={4}>
            <Typography sx={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 500, color: '#374151', mb: '4px' }}>Carrier's Electronic Id *</Typography>
            <TextField
              fullWidth size="small"
              value={carrier.payerId || ''}
              onChange={(e) => setCarrier({ ...carrier, payerId: e.target.value })}
              sx={{ "& .MuiInputBase-root": { fontFamily: "Inter", fontSize: "13px", borderRadius: "8px" }, "& .MuiInputBase-input": { color: "#374151" } }}
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
            <Typography sx={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 500, color: '#374151', mb: '4px' }}>Phone</Typography>
            <TextField
              fullWidth size="small"
              placeholder="(201) 555-0123"
              value={carrier.phone || ''}
              onChange={(e) => {
                const formatted = formatPhoneInput(e.target.value);
                setCarrier({ ...carrier, phone: formatted });
              }}
              sx={{ "& .MuiInputBase-root": { fontFamily: "Inter", fontSize: "13px", borderRadius: "8px" }, "& .MuiInputBase-input": { color: "#374151" } }}
            />
          </Grid>

          {/* Row 2 */}
          <Grid item xs={4}>
            <Typography sx={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 500, color: '#374151', mb: '4px' }}>Email</Typography>
            <TextField
              fullWidth size="small"
              value={carrier.email || ''}
              onChange={(e) => setCarrier({ ...carrier, email: e.target.value })}
              sx={{ "& .MuiInputBase-root": { fontFamily: "Inter", fontSize: "13px", borderRadius: "8px" }, "& .MuiInputBase-input": { color: "#374151" } }}
            />
          </Grid>
          <Grid item xs={4}>
            <Typography sx={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 500, color: '#374151', mb: '4px' }}>Fax</Typography>
            <TextField
              fullWidth size="small"
              placeholder="(201) 555-0123"
              value={carrier.fax || ''}
              onChange={(e) => {
                const formatted = formatPhoneInput(e.target.value);
                setCarrier({ ...carrier, fax: formatted });
              }}
              sx={{ "& .MuiInputBase-root": { fontFamily: "Inter", fontSize: "13px", borderRadius: "8px" }, "& .MuiInputBase-input": { color: "#374151" } }}
            />
          </Grid>
          <Grid item xs={4}>
            <Typography sx={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 500, color: '#374151', mb: '4px' }}>Website</Typography>
            <TextField
              fullWidth size="small"
              value={carrier.website || ''}
              onChange={(e) => setCarrier({ ...carrier, website: e.target.value })}
              sx={{ "& .MuiInputBase-root": { fontFamily: "Inter", fontSize: "13px", borderRadius: "8px" }, "& .MuiInputBase-input": { color: "#374151" } }}
            />
          </Grid>

          {/* Address Row 1 */}
          <Grid item xs={4}>
            <Typography sx={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 500, color: '#374151', mb: '4px' }}>Country:</Typography>
            <FormControl fullWidth size="small">
              <Select
                value={carrier.country || 'United States'}
                onChange={(e) => setCarrier({ ...carrier, country: e.target.value })}
                sx={{ fontFamily: "Inter", fontSize: "13px", borderRadius: "8px" }}
                MenuProps={{ sx: { zIndex: 10000 } }}
              >
                <MenuItem value="United States">United States</MenuItem>
                <MenuItem value="Canada">Canada</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <Typography sx={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 500, color: '#374151', mb: '4px' }}>Address Line 1:</Typography>
            <TextField
              fullWidth size="small" placeholder="Address line 1"
              value={carrier.address || ''}
              onChange={(e) => setCarrier({ ...carrier, address: e.target.value })}
              sx={{ "& .MuiInputBase-root": { fontFamily: "Inter", fontSize: "13px", borderRadius: "8px" }, "& .MuiInputBase-input": { color: "#374151" } }}
            />
          </Grid>
          <Grid item xs={4}>
            <Typography sx={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 500, color: '#374151', mb: '4px' }}>Address Line 2:</Typography>
            <TextField
              fullWidth size="small" placeholder="Address line 2"
              value={carrier.address2 || ''}
              onChange={(e) => setCarrier({ ...carrier, address2: e.target.value })}
              sx={{ "& .MuiInputBase-root": { fontFamily: "Inter", fontSize: "13px", borderRadius: "8px" }, "& .MuiInputBase-input": { color: "#374151" } }}
            />
          </Grid>

          {/* Address Row 2 */}
          <Grid item xs={4}>
            <Typography sx={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 500, color: '#374151', mb: '4px' }}>State/Province:</Typography>
            <FormControl fullWidth size="small">
              <Select
                value={carrier.state || ''}
                displayEmpty
                onChange={(e) => setCarrier({ ...carrier, state: e.target.value, city: '' })}
                sx={{ fontFamily: "Inter", fontSize: "13px", borderRadius: "8px" }}
                MenuProps={{ sx: { zIndex: 10000 } }}
              >
                <MenuItem value="" disabled>State/Province</MenuItem>
                {US_STATES.map((s) => <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <Typography sx={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 500, color: '#374151', mb: '4px' }}>City:</Typography>
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
                  sx={{ "& .MuiInputBase-root": { fontFamily: "Inter", fontSize: "13px", borderRadius: "8px" }, "& .MuiInputBase-input": { color: "#374151" } }}
                />
              )}
            />
          </Grid>

          <Grid item xs={4}>
            <Typography sx={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 500, color: '#374151', mb: '4px' }}>Zip/Postal Code:</Typography>
            <TextField
              fullWidth size="small" placeholder="Zip/Postal Code"
              value={carrier.zipCode || ''}
              onChange={(e) => setCarrier({ ...carrier, zipCode: e.target.value })}
              sx={{ "& .MuiInputBase-root": { fontFamily: "Inter", fontSize: "13px", borderRadius: "8px" }, "& .MuiInputBase-input": { color: "#374151" } }}
            />
          </Grid>

          {/* Bottom Row */}
          <Grid item xs={12} md={8}>
            <Typography sx={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 500, color: '#374151', mb: '4px' }}>Providers out of network</Typography>
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
            <Typography sx={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 600, display: 'block', mb: 0.5, color: '#374151' }}>Claim Type</Typography>
            <FormControl fullWidth size="small">
              <Select
                value={carrier.claimType || ''}
                onChange={(e) => setCarrier({ ...carrier, claimType: e.target.value })}
                sx={{ fontFamily: "Inter", fontSize: "13px", borderRadius: "8px", backgroundColor: "#fff", '& .MuiOutlinedInput-notchedOutline': { borderColor: '#d0d5dd' } }}
                displayEmpty
                MenuProps={{ sx: { zIndex: 10000 } }}
              >
                <MenuItem value="" disabled>Select Type</MenuItem>
                <MenuItem value="Dental">Dental</MenuItem>
                <MenuItem value="Medical">Medical</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Row 7: Notes */}
          <Grid item xs={12}>
            <Typography sx={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 600, display: 'block', mb: 0.5, color: '#374151' }}>Notes</Typography>
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
      <DialogActions sx={{ px: "20px", py: "12px", borderTop: '1px solid #e0e5eb', gap: 1.5, justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{
            fontFamily: "Inter", fontSize: "13px", fontWeight: 500,
            textTransform: "none", borderRadius: "8px",
            border: "1px solid #d0d5dd", color: "#374151",
            px: "16px", py: "7px",
            "&:hover": { borderColor: "#9aa3ae", backgroundColor: "#f9fafb" },
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={onSave}
          sx={{
            fontFamily: "Inter", fontSize: "13px", fontWeight: 600,
            textTransform: "none", borderRadius: "8px",
            backgroundColor: "#2262ef", color: "#fff",
            px: "20px", py: "7px",
            boxShadow: "none",
            "&:hover": { backgroundColor: "#1a50cc", boxShadow: "none" },
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CarrierFormDialog;
