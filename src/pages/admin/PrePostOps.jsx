import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchInstructionTemplates,
  addInstructionTemplate,
  updateInstructionTemplate,
  deleteInstructionTemplate,
  selectInstructionTemplates,
  selectLoadingInstructions
} from '../../store/slices/clinicalManagementSlice';
import { useSnackbar } from '../../contexts/SnackbarContext';
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from '@mui/material';
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FileUploadOutlined as UploadIcon,
} from '@mui/icons-material';


const mapBackendToFrontend = (backend) => {
  let contentData = {};
  try {
    if (backend.content) {
      contentData = JSON.parse(backend.content);
    }
  } catch (e) {
    contentData = { description: backend.content || '' };
  }
  return {
    id: backend.id || backend.TemplateId?.toString(),
    name: backend.name || '',
    type: backend.type || 'Post Operation',
    procedures: contentData.procedures || 'General',
    description: contentData.description || '',
    sendHours: contentData.sendHours || '',
    sendUnit: contentData.sendUnit || 'hours',
    fileOption: contentData.fileOption || 'Upload PDF'
  };
};

const PrePostOps = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showSnackbar } = useSnackbar();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Views: 'list' or 'add'
  const [view, setView] = useState('list');
  const [prePostOps, setPrePostOps] = useState([]);
  
  const instructionTemplates = useSelector(selectInstructionTemplates);
  const loading = useSelector(selectLoadingInstructions);
  
  const [editingId, setEditingId] = useState(null);

  // Form State for Add screen
  const [type, setType] = useState('Post Operation');
  const [sendHours, setSendHours] = useState('');
  const [sendUnit, setSendUnit] = useState('hours');
  const [fileOption, setFileOption] = useState('Upload PDF');
  const [docName, setDocName] = useState('');
  const [procedures, setProcedures] = useState('');

  useEffect(() => {
    dispatch(fetchInstructionTemplates());
  }, [dispatch]);

  useEffect(() => {
    if (instructionTemplates) {
      setPrePostOps(instructionTemplates.map(mapBackendToFrontend));
    } else {
      setPrePostOps([]);
    }
  }, [instructionTemplates]);

  const handleSearch = (e) => setSearchQuery(e.target.value.toLowerCase());

  const handleDeleteOp = async (id) => {
    if (id && !id.toString().startsWith('m')) {
      try {
        await dispatch(deleteInstructionTemplate(id)).unwrap();
        dispatch(fetchInstructionTemplates());
        showSnackbar('Instruction template deleted successfully', 'success');
      } catch (e) {
        console.error(e);
        showSnackbar('Failed to delete template', 'error');
        return;
      }
    } else {
      setPrePostOps(prePostOps.filter(op => op.id !== id));
    }
  };

  const handleSaveDocument = async () => {
    if (!docName) return;
    const desc = `${type} instructions. Send ${sendHours || '0'} ${sendUnit} after appointment. Mode: ${fileOption}`;
    const contentObj = {
      procedures: procedures || 'General',
      description: desc,
      sendHours: sendHours,
      sendUnit: sendUnit,
      fileOption: fileOption
    };

    try {
      if (editingId && !editingId.toString().startsWith('m')) {
        await dispatch(updateInstructionTemplate({
          templateId: editingId,
          updates: {
            name: docName,
            type: type,
            content: JSON.stringify(contentObj)
          }
        })).unwrap();
        dispatch(fetchInstructionTemplates());
        showSnackbar('Instruction template updated successfully', 'success');
      } else {
        await dispatch(addInstructionTemplate({
          name: docName,
          type: type,
          content: JSON.stringify(contentObj)
        })).unwrap();
        dispatch(fetchInstructionTemplates());
        showSnackbar('Instruction template created successfully', 'success');
      }
      
      // Reset Form and return to list
      setEditingId(null);
      setDocName('');
      setProcedures('');
      setSendHours('');
      setType('Post Operation');
      setFileOption('Upload PDF');
      setView('list');
    } catch (e) {
      console.error(e);
      showSnackbar('Failed to save instruction template', 'error');
    }
  };

  const filteredOps = prePostOps.filter(op => 
    op.name.toLowerCase().includes(searchQuery) || 
    op.procedures.toLowerCase().includes(searchQuery)
  );

  if (view === 'add') {
    return (
      <Box sx={{ p: 0, backgroundColor: '#fff', minHeight: '80vh' }}>
        
        {/* Navigation Breadcrumbs */}
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography 
            onClick={() => setView('list')} 
            sx={{ 
              color: '#1a3a6b', 
              fontSize: '0.9rem', 
              fontWeight: 700, 
              cursor: 'pointer', 
              '&:hover': { textDecoration: 'underline' } 
            }}
          >
            Pre & Post-Ops List
          </Typography>
          <Typography sx={{ color: '#1a3a6b', fontSize: '0.85rem' }}>{'>'}</Typography>
          <Typography sx={{ color: '#1a3a6b', fontSize: '0.85rem', fontWeight: 500 }}>Add New Pre/Post Operation Document</Typography>
        </Box>

        {/* Heading */}
        <Typography 
          variant="h5" 
          sx={{ 
            color: '#1a3a6b', 
            fontWeight: 600, 
            fontSize: '1.25rem', 
            mb: 4 
          }}
        >
          Add New Pre/Post Operation Document
        </Typography>

        {/* Form Inputs Container */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5, maxWidth: 800 }}>
          
          {/* Type Selection */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: '#333', minWidth: 60 }}>
              Type:
            </Typography>
            <RadioGroup
              row
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <FormControlLabel 
                value="Post Operation" 
                control={<Radio size="small" />} 
                label={<Typography sx={{ fontSize: '0.85rem', color: '#333' }}>Post Operation</Typography>} 
              />
              <FormControlLabel 
                value="Pre Operation" 
                control={<Radio size="small" />} 
                label={<Typography sx={{ fontSize: '0.85rem', color: '#333' }}>Pre Operation</Typography>} 
              />
            </RadioGroup>
          </Box>

          {/* Send form to patient */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: '#333' }}>
              Send form to patient
            </Typography>
            <input 
              type="text" 
              value={sendHours}
              onChange={(e) => setSendHours(e.target.value)}
              style={{ 
                width: 48, 
                height: 28, 
                border: '1.5px solid #ef5350', 
                borderRadius: 4, 
                textAlign: 'center',
                fontSize: '0.85rem',
                outline: 'none',
                color: '#333'
              }} 
            />
            <select 
              value={sendUnit} 
              onChange={(e) => setSendUnit(e.target.value)}
              style={{ 
                height: 28, 
                border: '1.5px solid #cbd5e1', 
                borderRadius: 4,
                fontSize: '0.85rem',
                padding: '0 4px',
                outline: 'none',
                backgroundColor: '#fff',
                color: '#333'
              }}
            >
              <option value="hours">hours</option>
              <option value="days">days</option>
            </select>
            <Typography sx={{ fontSize: '0.85rem', color: '#333' }}>
              after appointment.
            </Typography>
          </Box>

          {/* File Option Selection */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: '#333', minWidth: 60 }}>
              File:
            </Typography>
            <RadioGroup
              row
              value={fileOption}
              onChange={(e) => setFileOption(e.target.value)}
            >
              <FormControlLabel 
                value="Upload PDF" 
                control={<Radio size="small" />} 
                label={<Typography sx={{ fontSize: '0.85rem', color: '#333' }}>Upload PDF</Typography>} 
              />
              <FormControlLabel 
                value="Create Form" 
                control={<Radio size="small" />} 
                label={<Typography sx={{ fontSize: '0.85rem', color: '#333' }}>Create Form</Typography>} 
              />
            </RadioGroup>
          </Box>

          {/* Dotted Upload Box */}
          {fileOption === 'Upload PDF' && (
            <Box>
              <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: '#333', mb: 1 }}>
                Upload PDF <span style={{ fontWeight: 400, color: '#666', fontStyle: 'italic' }}>(The system only accepts .pdf files)</span>
              </Typography>
              <Box
                sx={{
                  border: '1.5px dashed #cbd5e1',
                  borderRadius: '6px',
                  p: 3,
                  textAlign: 'center',
                  backgroundColor: '#fff',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderColor: '#1a3a6b',
                    backgroundColor: '#f8fafc'
                  },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1.5,
                  maxWidth: 500
                }}
              >
                <UploadIcon sx={{ color: '#4b71a1', fontSize: '1.4rem' }} />
                <Typography sx={{ fontSize: '0.85rem', color: '#666' }}>
                  Drop items here or <span style={{ fontWeight: 600, color: '#333' }}>Browse Files</span>
                </Typography>
              </Box>
              <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8', mt: 1 }}>
                Up to 1MB • File name without special characters
              </Typography>
            </Box>
          )}

          {/* Document Name */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: '#333', minWidth: 110 }}>
              Document Name:
            </Typography>
            <TextField
              size="small"
              placeholder="Enter Name"
              value={docName}
              onChange={(e) => setDocName(e.target.value)}
              sx={{ 
                width: 250,
                '& .MuiInputBase-input': { fontSize: '0.85rem', py: 0.8 },
                '& .MuiOutlinedInput-root': { borderRadius: '4px' }
              }}
            />
          </Box>

          {/* Procedures */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: '#333', minWidth: 110 }}>
              Procedures:
            </Typography>
            <TextField
              size="small"
              placeholder="Enter code or procedure"
              value={procedures}
              onChange={(e) => setProcedures(e.target.value)}
              sx={{ 
                width: 250,
                '& .MuiInputBase-input': { fontSize: '0.85rem', py: 0.8 },
                '& .MuiOutlinedInput-root': { borderRadius: '4px' }
              }}
            />
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'flex-end', maxWidth: 650 }}>
            <Button
              variant="outlined"
              onClick={handleSaveDocument}
              disabled={!docName}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.85rem',
                borderRadius: '20px',
                px: 3.5,
                py: 0.6,
                borderColor: '#1a3a6b',
                color: '#1a3a6b',
                boxShadow: 'none',
                '&:hover': {
                  borderColor: '#0c2447',
                  backgroundColor: '#f1f5f9',
                  boxShadow: 'none'
                },
                '&.Mui-disabled': {
                  borderColor: '#e2e8f0',
                  color: '#cbd5e1'
                }
              }}
            >
              Add Pre/Post-Op Document
            </Button>
            <Button
              variant="contained"
              onClick={() => setView('list')}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.85rem',
                borderRadius: '20px',
                px: 3.5,
                py: 0.6,
                backgroundColor: '#e2e8f0',
                color: '#475569',
                boxShadow: 'none',
                '&:hover': {
                  backgroundColor: '#cbd5e1',
                  boxShadow: 'none'
                }
              }}
            >
              Cancel
            </Button>
          </Box>

        </Box>
      </Box>
    );
  }

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
        <Typography sx={{ color: '#1a3a6b', fontSize: '0.85rem', fontWeight: 500 }}>Pre & Post-Ops</Typography>
      </Box>

      {/* Header Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ color: '#1a3a6b', fontWeight: 600, fontSize: '1.1rem' }}>
          Pre & Post-Ops
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            size="small"
            placeholder="Search"
            value={searchQuery}
            onChange={handleSearch}
            sx={{ 
              width: 300, 
              '& .MuiInputBase-root': { fontSize: '0.85rem', height: 36, backgroundColor: '#fff' }
            }}
            InputProps={{ 
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon sx={{ fontSize: '1.1rem', color: '#999' }} />
                </InputAdornment>
              ) 
            }}
          />
          <Button
            variant="contained"
            onClick={() => setView('add')}
            sx={{ 
              backgroundColor: '#0c345d', 
              color: '#fff', 
              textTransform: 'none', 
              fontSize: '0.85rem', 
              height: 36, 
              px: 3,
              borderRadius: '18px',
              '&:hover': { backgroundColor: '#082646' }
            }}
          >
            + Add Pre/Post-Op
          </Button>
        </Box>
      </Box>

      {/* Main Table */}
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #eef2f6', borderRadius: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f8fafc' }}>
              <TableCell sx={{ py: 1.5, fontWeight: 600, color: '#1a3a6b', fontSize: '0.8rem', width: '25%' }}>Name</TableCell>
              <TableCell sx={{ py: 1.5, fontWeight: 600, color: '#1a3a6b', fontSize: '0.8rem', width: '15%' }}>Type</TableCell>
              <TableCell sx={{ py: 1.5, fontWeight: 600, color: '#1a3a6b', fontSize: '0.8rem', width: '15%' }}>Procedures</TableCell>
              <TableCell sx={{ py: 1.5, fontWeight: 600, color: '#1a3a6b', fontSize: '0.8rem' }}>Description</TableCell>
              <TableCell align="right" sx={{ py: 1.5, fontWeight: 600, color: '#1a3a6b', fontSize: '0.8rem', width: 100 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOps.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                  <Typography sx={{ color: '#999', fontSize: '0.9rem' }}>No Pre or Post Ops Found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredOps.map((op) => (
                <TableRow key={op.id} sx={{ '&:hover': { backgroundColor: '#fbfcfd' } }}>
                  <TableCell sx={{ py: 2, fontSize: '0.85rem', fontWeight: 500, color: '#333' }}>{op.name}</TableCell>
                  <TableCell sx={{ py: 2, fontSize: '0.85rem', color: '#666' }}>{op.type || 'Post Operation'}</TableCell>
                  <TableCell sx={{ py: 2, fontSize: '0.85rem', color: '#666' }}>{op.procedures || 'General'}</TableCell>
                  <TableCell sx={{ py: 2, fontSize: '0.85rem', color: '#666' }}>{op.description}</TableCell>
                  <TableCell align="right" sx={{ py: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                      <IconButton size="small" onClick={() => {
                        setEditingId(op.id);
                        setDocName(op.name);
                        setProcedures(op.procedures);
                        setType(op.type || 'Post Operation');
                        setSendHours(op.sendHours || '');
                        setSendUnit(op.sendUnit || 'hours');
                        setFileOption(op.fileOption || 'Upload PDF');
                        setView('add');
                      }} sx={{ color: '#4a90e2' }}>
                        <EditIcon sx={{ fontSize: '1.1rem' }} />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDeleteOp(op.id)} sx={{ color: '#e57373' }}>
                        <DeleteIcon sx={{ fontSize: '1.1rem' }} />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default PrePostOps;
