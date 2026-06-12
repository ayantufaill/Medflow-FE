import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchConsentTemplates,
  addConsentTemplate,
  deleteConsentTemplate,
  selectConsentTemplates,
  selectLoadingConsent
} from '../../store/slices/clinicalManagementSlice';
import { useSnackbar } from '../../contexts/SnackbarContext';
import {
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  InputAdornment,
  Collapse,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Radio,
  RadioGroup,
  FormControlLabel,
  Checkbox,
  Grid,
  Divider,
} from '@mui/material';
import {
  Search as SearchIcon,
  CloudDownload as DownloadIcon,
  Visibility as ViewIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Description as DocIcon,
  FileUpload as UploadIcon,
} from '@mui/icons-material';

const INITIAL_CUSTOM_CONSENTS = [
  {
    name: 'ICON Therapy Consent',
    procedures: [{ code: 'D2990', desc: 'resin infiltration of incipient smooth surface lesions' }]
  },
  {
    name: 'Oral DNA',
    procedures: [{ code: 'D0699', desc: 'Oral DNA pathogen testing for hygiene customization' }]
  },
  {
    name: 'SRP CONSENT',
    procedures: [
      { code: 'D4341', desc: 'periodontal scaling and root planing - four or more teeth per quadrant' },
      { code: 'D4342', desc: 'periodontal scaling and root planing - one to three teeth per quadrant' }
    ]
  },
  {
    name: 'Tooth supported bridge',
    procedures: [
      { code: 'D6740', desc: 'retainer crown - porcelain/ceramic' },
      { code: 'D6750', desc: 'retainer crown - porcelain fused to high noble metal' },
      { code: 'D6751', desc: 'retainer crown - porcelain fused to predominantly base metal' }
    ]
  },
  {
    name: 'Veneers',
    procedures: [
      { code: 'D2960', desc: 'labial veneer (resin laminate) - direct' },
      { code: 'D2961', desc: 'labial veneer (resin laminate) - indirect' },
      { code: 'D2962', desc: 'labial veneer (porcelain laminate) - indirect' }
    ]
  }
];

const INITIAL_SYSTEM_CONSENTS = [
  {
    name: 'bone-grafting',
    procedures: [
      { code: 'D3428', desc: 'bone graft in conjunction with periradicular surgery - per tooth, single site' },
      { code: 'D7995', desc: 'synthetic graft - mandible or facial bones, by report' }
    ]
  },
  {
    name: 'build-up',
    procedures: [{ code: 'D2950', desc: 'core buildup, including any pins when required' }]
  }
];



const mapBackendToFrontend = (backend) => {
  let contentData = {};
  try {
    if (backend.content) {
      contentData = JSON.parse(backend.content);
    }
  } catch (e) {
    contentData = { procedures: [] };
  }
  return {
    id: backend.id || backend.TemplateId?.toString(),
    name: backend.name || '',
    procedures: contentData.procedures || [],
    signatures: contentData.signatures || { guardian: false, office: false, patient: false, witness: false, doctor: false, other: false },
    fileType: contentData.fileType || 'Upload PDF',
    isSystem: contentData.isSystem || false
  };
};

const InformedConsent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showSnackbar } = useSnackbar();
  const [customExpanded, setCustomExpanded] = useState(true);
  const [systemExpanded, setSystemExpanded] = useState(true);
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const templates = useSelector(selectConsentTemplates);
  const loading = useSelector(selectLoadingConsent);

  const [customConsents, setCustomConsents] = useState([]);
  const [systemConsents, setSystemConsents] = useState([]);

  const [newConsentDraft, setNewConsentDraft] = useState({
    name: '',
    procedures: '',
    fileType: 'Upload PDF',
    selectedFile: null,
    signatures: { guardian: false, office: false, patient: false, witness: false, doctor: false, other: false }
  });

  useEffect(() => {
    dispatch(fetchConsentTemplates());
  }, [dispatch]);

  useEffect(() => {
    if (templates && templates.length > 0) {
      const loaded = templates.map(mapBackendToFrontend);
      setCustomConsents(loaded.filter(c => !c.isSystem));
      setSystemConsents(loaded.filter(c => c.isSystem));
    } else {
      setCustomConsents(INITIAL_CUSTOM_CONSENTS.map((c, i) => ({ id: `c_${i}`, ...c, isSystem: false })));
      setSystemConsents(INITIAL_SYSTEM_CONSENTS.map((c, i) => ({ id: `s_${i}`, ...c, isSystem: true })));
    }
  }, [templates]);

  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setNewConsentDraft({ ...newConsentDraft, selectedFile: file });
    }
  };

  const handleSearch = (e) => setSearchQuery(e.target.value.toLowerCase());

  const filteredCustom = customConsents.filter(c => c.name.toLowerCase().includes(searchQuery));
  const filteredSystem = systemConsents.filter(c => c.name.toLowerCase().includes(searchQuery));

  const handleDeleteCustom = async (idx) => {
    const item = customConsents[idx];
    if (item.id && !item.id.toString().startsWith('c_')) {
      try {
        await dispatch(deleteConsentTemplate(item.id)).unwrap();
        dispatch(fetchConsentTemplates());
        showSnackbar('Consent template deleted successfully', 'success');
      } catch (e) {
        console.error(e);
        showSnackbar('Failed to delete consent template', 'error');
        return;
      }
    }
    setCustomConsents(customConsents.filter((_, i) => i !== idx));
  };

  const handleDeleteSystem = async (idx) => {
    const item = systemConsents[idx];
    if (item.id && !item.id.toString().startsWith('s_')) {
      try {
        await dispatch(deleteConsentTemplate(item.id)).unwrap();
        dispatch(fetchConsentTemplates());
        showSnackbar('Consent template deleted successfully', 'success');
      } catch (e) {
        console.error(e);
        showSnackbar('Failed to delete consent template', 'error');
        return;
      }
    }
    setSystemConsents(systemConsents.filter((_, i) => i !== idx));
  };

  const handleSaveConsent = async () => {
    if (newConsentDraft.name) {
      try {
        const procedureParts = newConsentDraft.procedures.split('-').map(s => s.trim());
        const procs = [{ 
          code: procedureParts[0] || 'N/A', 
          desc: procedureParts[1] || procedureParts[0] || 'No description' 
        }];

        const contentObj = {
          procedures: procs,
          signatures: newConsentDraft.signatures,
          fileType: newConsentDraft.fileType,
          isSystem: false
        };

        await dispatch(addConsentTemplate({ name: newConsentDraft.name, content: JSON.stringify(contentObj) })).unwrap();
        dispatch(fetchConsentTemplates());
        setAddDialogOpen(false);
        showSnackbar('Consent template created successfully', 'success');

        // Reset state
        setNewConsentDraft({
          name: '',
          procedures: '',
          fileType: 'Upload PDF',
          selectedFile: null,
          signatures: { guardian: false, office: false, patient: false, witness: false, doctor: false, other: false }
        });
      } catch (e) {
        console.error(e);
        showSnackbar('Failed to create consent template', 'error');
      }
    }
  };

  return (
    <Box sx={{ p: 0 }}>
      {/* Breadcrumb Navigation */}
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography 
          onClick={() => navigate('/admin/clinical-management')} 
          sx={{ 
            color: '#1a3a6b', 
            fontSize: '0.9rem', 
            fontWeight: 700, 
            cursor: 'pointer', 
            '&:hover': { textDecoration: 'underline' } 
          }}
        >
          Clinical Management
        </Typography>
        <Typography sx={{ color: '#1a3a6b', fontSize: '0.85rem' }}>{'>'}</Typography>
        <Typography sx={{ color: '#1a3a6b', fontSize: '0.85rem', fontWeight: 500 }}>Informed Consents</Typography>
      </Box>

      {/* Header Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ color: '#1a3a6b', fontWeight: 600, fontSize: '1rem' }}>Informed Consents</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            size="small"
            placeholder="Search"
            value={searchQuery}
            onChange={handleSearch}
            sx={{ width: 300, '& .MuiInputBase-root': { fontSize: '0.85rem', height: 36 } }}
            InputProps={{ endAdornment: (<InputAdornment position="end"><SearchIcon sx={{ fontSize: '1.2rem', color: '#999' }} /></InputAdornment>) }}
          />
          <Button
            variant="contained"
            onClick={() => setAddDialogOpen(true)}
            startIcon={<Typography sx={{ fontSize: '1.2rem' }}>+</Typography>}
            sx={{ backgroundColor: '#0c345d', color: '#fff', textTransform: 'none', fontSize: '0.85rem', height: 36, px: 3 }}
          >
            Add New Consent
          </Button>
        </Box>
      </Box>

      {/* Main Table */}
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ borderBottom: '1px solid #e0e0e0' }}>
              <TableCell sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#1a3a6b', width: '30%' }}>Consent Name</TableCell>
              <TableCell sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#1a3a6b' }}>Procedures</TableCell>
              <TableCell sx={{ width: 100 }} />
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Custom Informed Consents */}
            <TableRow onClick={() => setCustomExpanded(!customExpanded)} sx={{ backgroundColor: '#f0f4fa', cursor: 'pointer' }}>
              <TableCell colSpan={3} sx={{ py: 1, px: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#1a3a6b' }}>Custom Informed Consents</Typography>
                  {customExpanded ? <ExpandLessIcon sx={{ fontSize: '1.2rem' }} /> : <ExpandMoreIcon sx={{ fontSize: '1.2rem' }} />}
                </Box>
              </TableCell>
            </TableRow>
            {customExpanded && filteredCustom.map((item, idx) => (
              <TableRow key={idx} sx={{ '& td': { py: 2, borderBottom: '1px solid #f0f0f0' } }}>
                <TableCell><Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}><DocIcon sx={{ fontSize: '1.1rem', color: '#d9a36d' }} /><Typography sx={{ fontSize: '0.85rem', color: '#333', fontWeight: 500 }}>{item.name}</Typography></Box></TableCell>
                <TableCell>{item.procedures.map((proc, pIdx) => (<Box key={pIdx} sx={{ mb: 0.5, display: 'flex', gap: 1 }}><Typography sx={{ fontSize: '0.75rem', color: '#1a3a6b', fontWeight: 600, minWidth: 45 }}>{proc.code}</Typography><Typography sx={{ fontSize: '0.75rem', color: '#666' }}>{proc.desc}</Typography></Box>))}</TableCell>
                <TableCell align="right"><Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}><IconButton size="small"><DownloadIcon sx={{ fontSize: '1rem' }} /></IconButton><IconButton size="small"><ViewIcon sx={{ fontSize: '1rem' }} /></IconButton><IconButton size="small" onClick={() => handleDeleteCustom(idx)}><DeleteIcon sx={{ fontSize: '1rem', color: '#e57373' }} /></IconButton></Box></TableCell>
              </TableRow>
            ))}

            {/* System Default Informed Consents */}
            <TableRow onClick={() => setSystemExpanded(!systemExpanded)} sx={{ backgroundColor: '#f0f4fa', cursor: 'pointer' }}>
              <TableCell colSpan={3} sx={{ py: 1, px: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#1a3a6b' }}>System Default Informed Consents</Typography>
                  {systemExpanded ? <ExpandLessIcon sx={{ fontSize: '1.2rem' }} /> : <ExpandMoreIcon sx={{ fontSize: '1.2rem' }} />}
                </Box>
              </TableCell>
            </TableRow>
            {systemExpanded && filteredSystem.map((item, idx) => (
              <TableRow key={idx} sx={{ '& td': { py: 2, borderBottom: '1px solid #f0f0f0' } }}>
                <TableCell><Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}><DocIcon sx={{ fontSize: '1.1rem', color: '#d9a36d' }} /><Typography sx={{ fontSize: '0.85rem', color: '#333', fontWeight: 500 }}>{item.name}</Typography></Box></TableCell>
                <TableCell>{item.procedures.map((proc, pIdx) => (<Box key={pIdx} sx={{ mb: 0.5, display: 'flex', gap: 1 }}><Typography sx={{ fontSize: '0.75rem', color: '#1a3a6b', fontWeight: 600, minWidth: 45 }}>{proc.code}</Typography><Typography sx={{ fontSize: '0.75rem', color: '#666' }}>{proc.desc}</Typography></Box>))}</TableCell>
                <TableCell align="right"><Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}><IconButton size="small"><DownloadIcon sx={{ fontSize: '1rem' }} /></IconButton><IconButton size="small"><ViewIcon sx={{ fontSize: '1rem' }} /></IconButton><IconButton size="small" onClick={() => handleDeleteSystem(idx)}><DeleteIcon sx={{ fontSize: '1rem', color: '#e57373' }} /></IconButton></Box></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add New Informed Consent Dialog */}
      <Dialog open={isAddDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 1 } }}>
        <DialogTitle sx={{ color: '#1a3a6b', fontSize: '1.1rem', fontWeight: 600, pb: 1 }}>Add New Informed Consent</DialogTitle>
        <DialogContent sx={{ px: 4 }}>
          <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography sx={{ fontSize: '0.85rem', fontWeight: 600 }}>File:</Typography>
            <RadioGroup row value={newConsentDraft.fileType} onChange={(e) => setNewConsentDraft({ ...newConsentDraft, fileType: e.target.value })}>
              <FormControlLabel value="Upload PDF" control={<Radio size="small" />} label={<Typography sx={{ fontSize: '0.85rem' }}>Upload PDF</Typography>} />
              <FormControlLabel value="Create Form" control={<Radio size="small" />} label={<Typography sx={{ fontSize: '0.85rem' }}>Create Form</Typography>} />
            </RadioGroup>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 500, mb: 1 }}>Upload PDF <Typography component="span" sx={{ fontSize: '0.75rem', color: '#666' }}>(The system only accepts .pdf files)</Typography></Typography>
            <Box 
              sx={{ 
                border: '1px dashed #ccc', 
                borderRadius: 1, 
                p: 4, 
                textAlign: 'center', 
                backgroundColor: '#fafafa',
                cursor: 'pointer',
                '&:hover': { backgroundColor: '#f0f4fa' }
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                accept=".pdf"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              <UploadIcon sx={{ fontSize: '2rem', color: '#ccc', mb: 1 }} />
              {newConsentDraft.selectedFile ? (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                  <Typography sx={{ fontSize: '0.85rem', fontWeight: 500, color: '#1a3a6b' }}>
                    {newConsentDraft.selectedFile.name}
                  </Typography>
                  <IconButton 
                    size="small" 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      setNewConsentDraft({ ...newConsentDraft, selectedFile: null });
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                  >
                    <DeleteIcon sx={{ fontSize: '1.1rem', color: '#e57373' }} />
                  </IconButton>
                </Box>
              ) : (
                <Typography sx={{ fontSize: '0.85rem', color: '#666' }}>
                  Drop items here or <Typography component="span" sx={{ color: '#4a90e2', fontWeight: 600 }}>Browse Files</Typography>
                </Typography>
              )}
            </Box>
            <Typography sx={{ fontSize: '0.7rem', color: '#999', mt: 0.5 }}>Up to 3MB • Filename without special characters</Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, mb: 0.5 }}>Informed Consent Name:</Typography>
            <TextField fullWidth size="small" placeholder="Enter Name" value={newConsentDraft.name} onChange={(e) => setNewConsentDraft({ ...newConsentDraft, name: e.target.value })} />
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, mb: 0.5 }}>Procedures:</Typography>
            <TextField fullWidth size="small" placeholder="Enter code or procedure" value={newConsentDraft.procedures} onChange={(e) => setNewConsentDraft({ ...newConsentDraft, procedures: e.target.value })} />
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ mb: 2 }}>
            <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, mb: 2 }}>Signature</Typography>
            <Grid container spacing={2}>
              {['Guardian', 'Office', 'Patient', 'Witness', 'Doctor', 'Other'].map((item) => (
                <Grid size={4} key={item}>
                  <FormControlLabel
                    control={<Checkbox size="small" checked={newConsentDraft.signatures[item.toLowerCase()]} onChange={(e) => setNewConsentDraft({ ...newConsentDraft, signatures: { ...newConsentDraft.signatures, [item.toLowerCase()]: e.target.checked } })} />}
                    label={<Typography sx={{ fontSize: '0.85rem' }}>{item}</Typography>}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 4, pb: 4, gap: 1 }}>
          <Button
            onClick={handleSaveConsent}
            variant="contained"
            sx={{ backgroundColor: '#6b8fb9', color: '#fff', textTransform: 'none', px: 4, borderRadius: 5 }}
            disabled={!newConsentDraft.name}
          >
            Add Consent
          </Button>
          <Button
            onClick={() => setAddDialogOpen(false)}
            variant="contained"
            sx={{ backgroundColor: '#cbd5e0', color: '#4a5568', textTransform: 'none', px: 4, borderRadius: 5, boxShadow: 'none' }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InformedConsent;
