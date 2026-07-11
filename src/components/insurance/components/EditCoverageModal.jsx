import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Button,
  IconButton,
  Grid,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Radio,
  FormControlLabel,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const TYPO = {
  fontFamily: '"Manrope", "Segoe UI", sans-serif',
  header: { fontWeight: 700, color: '#424242', fontSize: '1.05rem' },
  sectionTitle: { fontWeight: 600, color: '#616161', fontSize: '0.875rem' },
  label: { fontWeight: 600, color: '#424242', fontSize: 14 },
  value: { color: '#757575', fontSize: 14 },
  button: { fontSize: 14, fontWeight: 600 },
};

const DEDUCTIBLE_CATEGORIES = ['Standard', 'Preventative', 'Basic', 'Major', 'Orthodontics'];
const DEDUCTIBLE_FREQUENCIES = ['Annual', 'Per Visit', 'Lifetime'];

const COVERAGE_ITEMS = [
  { service: 'Diagnostic Preventative', pct: 100 },
  { service: 'Diagnostic Basic', pct: 100 },
  { service: 'Preventative Preventative', pct: 100 },
  { service: 'Preventative Basic', pct: 80 },
  { service: 'Restorative Basic', pct: 80 },
  { service: 'Restorative Major', pct: 50 },
  { service: 'Endodontics', pct: 80 },
  { service: 'Periodontics Major', pct: 50 },
  { service: 'Periodontics Basic', pct: 80 },
  { service: 'Prosthodontics, Removable', pct: 50 },
  { service: 'Maxillofacial Prosthetics', pct: 50 },
  { service: 'Implant Services', pct: 50 },
  { service: 'Prosthodontics, Fixed', pct: 50 },
  { service: 'Oral Surgery Basic', pct: 80 },
  { service: 'Oral Surgery Major', pct: 50 },
  { service: 'Orthodontics', pct: 50 },
  { service: 'Adjunctive General Services Basic', pct: 50 },
  { service: 'Adjunctive General Services Major', pct: 50 },
  { service: 'Adjunctive General Services Standard', pct: 50 },
];

export default function EditCoverageModal({ open, onClose, insurance, getInsuranceCompanyName, onSave, mode = 'edit' }) {
  const isViewMode = mode === 'view';
  const [deductibles, setDeductibles] = useState(() =>
    DEDUCTIBLE_CATEGORIES.map((cat) => ({
      category: cat,
      individual: cat === 'Preventative' ? 0 : 50,
      family: cat === 'Preventative' ? 0 : 100,
      frequency: 'Annual',
      standard: cat !== 'Preventative',
    }))
  );
  const [notes, setNotes] = useState(insurance?.notes || '');

  const companyName = getInsuranceCompanyName?.(insurance?.insuranceCompanyId) || 'Unknown';
  const planName = insurance?.employerName || insurance?.planName?.split(' by ')[0] || companyName;
  const policyType = (insurance?.insuranceType || 'Primary').charAt(0).toUpperCase() + (insurance?.insuranceType || 'primary').slice(1);

  const handleSave = () => {
    onSave?.({ deductibles, notes });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth PaperProps={{ sx: { borderRadius: 1 } }}>
      <Box sx={{ bgcolor: 'primary.main', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 1.5 }}>
        <Typography sx={{ fontFamily: TYPO.fontFamily, ...TYPO.header, textTransform: 'uppercase' }}>
          {isViewMode ? 'View Plan' : 'Edit Coverage'}
        </Typography>
        <IconButton size="small" onClick={onClose} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent sx={{ p: 2, bgcolor: 'white' }}>
        <Box sx={{ mb: 3 }}>
          <Typography sx={{ fontFamily: TYPO.fontFamily, ...TYPO.sectionTitle, mb: 0.5 }}>
            {policyType}: {planName} by {companyName}
          </Typography>
          {insurance && (insurance.usedAmount != null || insurance.individualAnnualMax != null) && (
            <Typography sx={{ fontFamily: TYPO.fontFamily, ...TYPO.value, mt: 0.5 }}>
              Used up-to-date: ${Number(insurance.usedAmount ?? insurance.copayAmount ?? 0).toFixed(2)} / ${Number(insurance.individualAnnualMax ?? insurance.deductibleAmount ?? 1500).toFixed(2)}
            </Typography>
          )}
        </Box>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography sx={{ fontFamily: TYPO.fontFamily, ...TYPO.sectionTitle, mb: 1.5, display: 'block' }}>
              Deductibles
            </Typography>
            <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
              <Table size="small" sx={{ '& .MuiTableCell-root': { py: 0.5, px: 1 } }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontFamily: TYPO.fontFamily, fontWeight: 600, fontSize: '0.7rem', py: 0.5, px: 1 }}>Category</TableCell>
                    <TableCell sx={{ fontFamily: TYPO.fontFamily, fontWeight: 600, fontSize: '0.7rem', py: 0.5, px: 1 }}>Individual</TableCell>
                    <TableCell sx={{ fontFamily: TYPO.fontFamily, fontWeight: 600, fontSize: '0.7rem', py: 0.5, px: 1 }}>Family</TableCell>
                    <TableCell sx={{ fontFamily: TYPO.fontFamily, fontWeight: 600, fontSize: '0.7rem', py: 0.5, px: 1 }}>Frequency</TableCell>
                    <TableCell sx={{ fontFamily: TYPO.fontFamily, fontWeight: 600, fontSize: '0.7rem', py: 0.5, px: 1 }}>Standard</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {deductibles.map((d, i) => (
                    <TableRow key={d.category}>
                      <TableCell sx={{ fontFamily: TYPO.fontFamily, fontSize: '0.75rem', py: 0.5, px: 1 }}>{d.category}</TableCell>
                      <TableCell sx={{ fontFamily: TYPO.fontFamily, fontSize: '0.75rem', py: 0.5, px: 1 }}>
                        {isViewMode ? d.individual : (
                          <TextField
                            type="number"
                            size="small"
                            value={d.individual}
                            onChange={(e) => setDeductibles((prev) => prev.map((x, j) => (j === i ? { ...x, individual: Number(e.target.value) || 0 } : x)))}
                            sx={{ width: 72, minWidth: 72, '& .MuiInputBase-input': { fontFamily: TYPO.fontFamily, fontSize: '0.75rem', py: 0.5 } }}
                          />
                        )}
                      </TableCell>
                      <TableCell sx={{ fontFamily: TYPO.fontFamily, fontSize: '0.75rem', py: 0.5, px: 1 }}>
                        {isViewMode ? d.family : (
                          <TextField
                            type="number"
                            size="small"
                            value={d.family}
                            onChange={(e) => setDeductibles((prev) => prev.map((x, j) => (j === i ? { ...x, family: Number(e.target.value) || 0 } : x)))}
                            sx={{ width: 72, minWidth: 72, '& .MuiInputBase-input': { fontFamily: TYPO.fontFamily, fontSize: '0.75rem', py: 0.5 } }}
                          />
                        )}
                      </TableCell>
                      <TableCell sx={{ fontFamily: TYPO.fontFamily, fontSize: '0.75rem', py: 0.5, px: 1 }}>
                        {isViewMode ? d.frequency : (
                          <FormControl size="small" sx={{ minWidth: 72 }}>
                            <Select
                              value={d.frequency}
                              sx={{ fontFamily: TYPO.fontFamily, fontSize: '0.75rem', '& .MuiSelect-select': { fontSize: '0.75rem', py: 0.5 } }}
                              onChange={(e) => setDeductibles((prev) => prev.map((x, j) => (j === i ? { ...x, frequency: e.target.value } : x)))}
                            >
                              {DEDUCTIBLE_FREQUENCIES.map((f) => (
                                <MenuItem key={f} value={f} sx={{ fontSize: '0.75rem' }}>{f}</MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        )}
                      </TableCell>
                      <TableCell sx={{ fontFamily: TYPO.fontFamily, fontSize: '0.75rem', py: 0.5, px: 1 }}>
                        {isViewMode ? (d.standard ? 'Yes' : 'No') : (
                          d.category === 'Preventative' ? (
                            <FormControlLabel
                              control={<Radio size="small" checked={d.standard} onChange={() => setDeductibles((prev) => prev.map((x, j) => (j === i ? { ...x, standard: !x.standard } : x)))} sx={{ '& .MuiSvgIcon-root': { fontSize: 16 } }} />}
                              label="standard"
                              sx={{ fontFamily: TYPO.fontFamily, '& .MuiFormControlLabel-label': { fontSize: '0.7rem' } }}
                            />
                          ) : (
                            <FormControlLabel
                              control={<Checkbox size="small" checked={d.standard} onChange={() => setDeductibles((prev) => prev.map((x, j) => (j === i ? { ...x, standard: !x.standard } : x)))} sx={{ '& .MuiSvgIcon-root': { fontSize: 16 } }} />}
                              label="standard"
                              sx={{ fontFamily: TYPO.fontFamily, '& .MuiFormControlLabel-label': { fontSize: '0.7rem' } }}
                            />
                          )
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography sx={{ fontFamily: TYPO.fontFamily, ...TYPO.sectionTitle, mb: 1.5, display: 'block' }}>
              Coverage
            </Typography>
            <TableContainer component={Paper} variant="outlined" sx={{ mb: 2, maxHeight: 360 }}>
              <Table size="small" stickyHeader sx={{ '& .MuiTableCell-root': { py: 0.5, px: 1 } }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontFamily: TYPO.fontFamily, fontWeight: 600, fontSize: '0.7rem', py: 0.5, px: 1 }}>Service</TableCell>
                    <TableCell align="right" sx={{ fontFamily: TYPO.fontFamily, fontWeight: 600, fontSize: '0.7rem', py: 0.5, px: 1 }}>%</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {COVERAGE_ITEMS.map((item) => (
                    <TableRow key={item.service}>
                      <TableCell sx={{ fontFamily: TYPO.fontFamily, fontSize: '0.75rem', py: 0.5, px: 1 }}>{item.service}</TableCell>
                      <TableCell align="right" sx={{ fontFamily: TYPO.fontFamily, fontSize: '0.75rem', py: 0.5, px: 1 }}>{item.pct}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>

        {!isViewMode && (
          <TextField
            fullWidth
            size="small"
            label="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes"
            multiline
            rows={2}
            sx={{ mb: 2, '& .MuiInputBase-input': { fontFamily: TYPO.fontFamily } }}
          />
        )}
        {notes && isViewMode && (
          <Box sx={{ mb: 2 }}>
            <Typography sx={{ fontFamily: TYPO.fontFamily, ...TYPO.label, mb: 0.5 }}>Notes</Typography>
            <Typography sx={{ fontFamily: TYPO.fontFamily, ...TYPO.value }}>{notes}</Typography>
          </Box>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          {isViewMode ? (
            <Button variant="contained" onClick={onClose} sx={{ fontFamily: TYPO.fontFamily, ...TYPO.button, textTransform: 'none' }}>
              Close
            </Button>
          ) : (
            <>
              <Button variant="outlined" onClick={onClose} sx={{ fontFamily: TYPO.fontFamily, ...TYPO.button, borderColor: '#9e9e9e', color: '#616161' }}>
                Cancel
              </Button>
              <Button variant="contained" color="primary" onClick={handleSave} sx={{ fontFamily: TYPO.fontFamily, ...TYPO.button, textTransform: 'none' }}>
                Save
              </Button>
            </>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
