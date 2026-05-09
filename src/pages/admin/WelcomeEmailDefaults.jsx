import { useState } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Link, Button, TextField, Checkbox, Dialog, DialogTitle, DialogContent,
  DialogActions, InputAdornment, FormControlLabel,
} from '@mui/material';
import { Delete as DeleteIcon, Search as SearchIcon, Add as AddIcon } from '@mui/icons-material';

const defaultForms = [
  { name: 'Confidential', type: 'Onyx Form' },
  { name: 'Dental History', type: 'Onyx Form' },
  { name: 'HIPAA', type: 'Onyx Form' },
  { name: 'Medical History', type: 'Onyx Form' },
  { name: 'Pediatric Dental Hx', type: 'Onyx Form' },
  { name: 'Pediatric Medical Hx', type: 'Onyx Form' },
  { name: 'TDS Financial Agreement', type: 'Custom Form' },
  { name: 'Elective to Self Pay', type: 'Custom Form' },
  { name: 'HIPAA 2026', type: 'Custom Form' },
];

const updateForms = [
  { name: 'Confidential', checked: true, type: 'Onyx Form' },
  { name: 'Dental History', checked: false, type: 'Onyx Form' },
  { name: 'HIPAA', checked: false, type: 'Onyx Form' },
  { name: 'Medical History', checked: true, type: 'Onyx Form' },
  { name: 'Pediatric Dental Hx', checked: false, type: 'Onyx Form' },
  { name: 'Pediatric Medical Hx', checked: true, type: 'Onyx Form' },
  { name: 'TDS Financial Agreement', checked: true, type: 'Custom Form' },
  { name: 'Elective to Self Pay', checked: false, type: 'Custom Form' },
  { name: 'HIPAA 2026', checked: false, type: 'Custom Form' },
];

const availableForms = [
  'COVID 19', 'KOR Whitening Informed Consent', 'Kor Whitening Post op sensitivity',
  'Composite (tooth colored restoration) Informed Consent', 'N2O (Nitrous Oxide) Sedation Informed Consent',
  'Acknowledgement of Non-Services Agreement', 'Biochar Rejuvenating Alternative Informed Consent',
  'TDS School Absence Form (returning to Work/school same day)', 'Patient Referral',
  'TDS School Absence Form (not returning)', 'Crown and Bridge Informed Consent',
  'Recement Permanent Crown Informed Consent', 'Tooth Extraction Informed Consent',
];

const WelcomeEmailDefaults = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSearch, setModalSearch] = useState('');
  const [selectedForms, setSelectedForms] = useState([]);
  const [age, setAge] = useState('12');

  const filteredForms = availableForms.filter(f =>
    f.toLowerCase().includes(modalSearch.toLowerCase())
  );

  const toggleForm = (form) => {
    setSelectedForms(prev =>
      prev.includes(form) ? prev.filter(f => f !== form) : [...prev, form]
    );
  };

  const tHeadSx = { bgcolor: '#1a3a6b', color: '#fff', fontWeight: 700, fontSize: '0.75rem', py: 0.8, borderRight: '1px solid rgba(255,255,255,0.15)' };
  const tCellSx = { fontSize: '0.8rem', py: 1, borderBottom: '1px solid #eee' };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', color: '#222' }}>Welcome/Update Email Defaults</Typography>
        <Button variant="contained" sx={{ bgcolor: '#2e7d32', textTransform: 'none', fontWeight: 600, borderRadius: 2, px: 3, '&:hover': { bgcolor: '#1b5e20' } }}>Save</Button>
      </Box>

      {/* Age filter */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <Typography sx={{ fontSize: '0.82rem', color: '#555' }}>Send pediatric forms to patients below the age of</Typography>
        <TextField size="small" value={age} onChange={(e) => setAge(e.target.value)} sx={{ width: 50, '& .MuiOutlinedInput-root': { height: 28, fontSize: '0.8rem' } }} />
      </Box>

      {/* Two-column tables */}
      <Box sx={{ display: 'flex', gap: 4 }}>
        {/* Left — Default Welcome Email Forms */}
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', mb: 0.5 }}>Default Welcome Email Forms</Typography>
          <Typography sx={{ fontSize: '0.78rem', color: '#4b71a1', mb: 2 }}>Forms in this list will be sent out with the welcome email</Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ ...tHeadSx, width: 40 }}></TableCell>
                  <TableCell sx={tHeadSx}>Welcome Email Forms</TableCell>
                  <TableCell sx={{ ...tHeadSx, borderRight: 'none' }}>Type</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {defaultForms.map((form, i) => (
                  <TableRow key={i} hover>
                    <TableCell sx={{ ...tCellSx, width: 40 }}>
                      <IconButton size="small"><DeleteIcon sx={{ fontSize: '0.9rem', color: '#999' }} /></IconButton>
                    </TableCell>
                    <TableCell sx={{ ...tCellSx, color: '#1a3a6b', fontWeight: 500 }}>{form.name}</TableCell>
                    <TableCell sx={{ ...tCellSx, color: '#c06000' }}>{form.type}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Link href="#" underline="hover" onClick={(e) => { e.preventDefault(); setModalOpen(true); }}
            sx={{ fontSize: '0.82rem', color: '#1a3a6b', fontWeight: 600, mt: 2, display: 'inline-flex', alignItems: 'center' }}>
            + Add More Forms
          </Link>
        </Box>

        {/* Right — Update Request Appearance */}
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', mb: 0.5 }}>Update Request Appearance</Typography>
          <Typography sx={{ fontSize: '0.78rem', color: '#4b71a1', mb: 2 }}>Choose what forms appear under the update request option</Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ ...tHeadSx, width: 40 }}></TableCell>
                  <TableCell sx={tHeadSx}>Include in update request list</TableCell>
                  <TableCell sx={tHeadSx}>Checked by Default ⓘ</TableCell>
                  <TableCell sx={{ ...tHeadSx, borderRight: 'none' }}>Type</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {updateForms.map((form, i) => (
                  <TableRow key={i} hover>
                    <TableCell sx={{ ...tCellSx, width: 40 }}>
                      <IconButton size="small"><DeleteIcon sx={{ fontSize: '0.9rem', color: '#999' }} /></IconButton>
                    </TableCell>
                    <TableCell sx={{ ...tCellSx, color: '#1a3a6b', fontWeight: 500 }}>{form.name}</TableCell>
                    <TableCell sx={tCellSx} align="center">
                      <Checkbox size="small" defaultChecked={form.checked} sx={{ p: 0.3 }} />
                    </TableCell>
                    <TableCell sx={{ ...tCellSx, color: '#c06000' }}>{form.type}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Link href="#" underline="hover" onClick={(e) => { e.preventDefault(); setModalOpen(true); }}
            sx={{ fontSize: '0.82rem', color: '#1a3a6b', fontWeight: 600, mt: 2, display: 'inline-flex', alignItems: 'center' }}>
            + Add More Forms
          </Link>
        </Box>
      </Box>

      {/* Add Custom Form Modal */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
        <DialogTitle sx={{ bgcolor: '#1a3a6b', color: '#fff', fontWeight: 700, fontSize: '0.95rem', py: 1.5 }}>
          Add Custom Form
        </DialogTitle>
        <DialogContent sx={{ pt: 2, px: 3 }}>
          <TextField
            fullWidth size="small" placeholder="Search" value={modalSearch}
            onChange={(e) => setModalSearch(e.target.value)}
            InputProps={{ endAdornment: <InputAdornment position="end"><SearchIcon sx={{ fontSize: '1rem', color: '#999' }} /></InputAdornment> }}
            sx={{ mb: 2, mt: 1, '& .MuiOutlinedInput-root': { height: 36 } }}
          />
          <Box sx={{ maxHeight: 350, overflow: 'auto' }}>
            {filteredForms.map((form, i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', py: 0.8, borderBottom: '1px solid #f0f0f0' }}>
                <Checkbox size="small" checked={selectedForms.includes(form)} onChange={() => toggleForm(form)} sx={{ p: 0.3, mr: 1 }} />
                <Typography sx={{ fontSize: '0.82rem' }}>{form}</Typography>
              </Box>
            ))}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setModalOpen(false)} sx={{ textTransform: 'none', color: '#666' }}>Cancel</Button>
          <Button variant="contained" onClick={() => setModalOpen(false)}
            sx={{ bgcolor: '#2e7d32', textTransform: 'none', fontWeight: 600, borderRadius: 2, px: 3, '&:hover': { bgcolor: '#1b5e20' } }}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WelcomeEmailDefaults;
