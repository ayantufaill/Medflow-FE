import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { practiceInfoService } from '../../services/practice-info.service';
import { useSnackbar } from '../../contexts/SnackbarContext';

import {
  Box,
  Typography,
  Breadcrumbs,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Stack,
  Button
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import EditNoteIcon from '@mui/icons-material/EditNote';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';

const defaultDocumentList = [
  "BOB (Breakdown of benefits)", "Insurance Fax Back", "Treatment consent",
  "N2O Consent", "Signed Treatment Plan", "Pre-D", "Driver License"
];

const defaultCategoryList = [
  "Insurance", "Consent", "Medical/Dental History", "Treatment Plan"
];

const DocumentCategorySetup = () => {
  const [practiceInfoId, setPracticeInfoId] = useState(null);
  const [documents, setDocuments] = useState(defaultDocumentList);
  const [categories, setCategories] = useState(defaultCategoryList);
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const practiceInfo = await practiceInfoService.getCurrentPracticeInfo();
        if (practiceInfo) {
          setPracticeInfoId(practiceInfo._id || practiceInfo.id);
          if (practiceInfo.documentCategories) {
            setDocuments(practiceInfo.documentCategories.documents || defaultDocumentList);
            setCategories(practiceInfo.documentCategories.categories || defaultCategoryList);
          }
        }
      } catch (error) {
        console.error('Failed to fetch practice info:', error);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    try {
      let id = practiceInfoId;
      if (!id) {
        const newPractice = await practiceInfoService.createPracticeInfo({
          practiceName: 'Default Practice',
          phone: '555-000-0000',
          email: 'info@defaultpractice.com',
          address: { line1: '123 St', city: 'Metropolis', state: 'NY', postalCode: '10001', country: 'US' }
        });
        id = newPractice._id || newPractice.id;
        setPracticeInfoId(id);
      }
      
      await practiceInfoService.updateDocumentCategories(id, { documents, categories });
      showSnackbar('Document Categories saved successfully', 'success');
    } catch (error) {
      console.error(error);
      const errMsg = error.response?.data?.error?.message || error.response?.data?.message || 'Failed to save configuration';
      showSnackbar(errMsg, 'error');
    }
  };

  const handleAddItem = (type) => {
    const name = window.prompt(`Enter new ${type} name:`);
    if (!name) return;
    if (type === 'document') setDocuments(prev => [...prev, name]);
    else setCategories(prev => [...prev, name]);
  };

  const handleEditItem = (type, index, oldName) => {
    const name = window.prompt(`Edit ${type} name:`, oldName);
    if (!name) return;
    if (type === 'document') {
      const newDocs = [...documents];
      newDocs[index] = name;
      setDocuments(newDocs);
    } else {
      const newCats = [...categories];
      newCats[index] = name;
      setCategories(newCats);
    }
  };

  const handleDeleteItem = (type, index) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;
    if (type === 'document') {
      setDocuments(prev => prev.filter((_, i) => i !== index));
    } else {
      setCategories(prev => prev.filter((_, i) => i !== index));
    }
  };

  const TableRowItem = ({ type, name, index }) => (
    <TableRow sx={{ '&:hover': { bgcolor: '#f9f9f9' } }}>
      <TableCell sx={{ py: 0.5, borderBottom: '1px solid #f0f0f0', color: '#444' }}>
        {name}
      </TableCell>
      <TableCell align="right" sx={{ py: 0.5, borderBottom: '1px solid #f0f0f0' }}>
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <IconButton size="small" sx={{ color: '#1976d2' }} onClick={() => handleEditItem(type, index, name)}>
            <EditNoteIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" sx={{ color: '#ff8a80' }} onClick={() => handleDeleteItem(type, index)}>
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        </Stack>
      </TableCell>
    </TableRow>
  );

  return (
    <Box sx={{ p: 4, bgcolor: '#fff', minHeight: '100vh' }}>
      
      {/* --- HEADER SECTION --- */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Breadcrumbs 
          separator={<NavigateNextIcon fontSize="small" sx={{ color: '#bdbdbd' }} />} 
          sx={{ fontSize: '0.85rem' }}
        >
          <Typography
              variant="caption"
              component={RouterLink}
              to="/admin/practice-setup"
              sx={{ color: 'primary.main', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
            >
              Practice Setup
            </Typography>
          <Typography sx={{ fontWeight: 600, color: '#1976d2' }}>Document Category Setup</Typography>
        </Breadcrumbs>
        
        <Button 
          variant="contained" 
          color="success" 
          startIcon={<SaveIcon />}
          onClick={handleSave}
          sx={{ borderRadius: 5, textTransform: 'none', px: 3 }}
        >
          Save Configuration
        </Button>
      </Box>

      <Box sx={{ maxWidth: 800 }}>
        {/* --- DOCUMENTS SECTION --- */}
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 700, color: '#555' }}>
          Documents
        </Typography>
        <TableContainer sx={{ mb: 1 }}>
          <Table size="small">
            <TableBody>
              {documents.map((item, index) => <TableRowItem key={index} index={index} type="document" name={item} />)}
            </TableBody>
          </Table>
        </TableContainer>
        <Link 
          component="button" 
          variant="body2" 
          onClick={() => handleAddItem('document')}
          sx={{ display: 'flex', alignItems: 'center', mb: 6, color: '#9e9e9e', textDecoration: 'none' }}
        >
          <AddIcon sx={{ fontSize: 16, mr: 0.5 }} /> Add new item
        </Link>

        {/* --- CATEGORY SECTION --- */}
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 700, color: '#555' }}>
          Category
        </Typography>
        <TableContainer sx={{ mb: 1 }}>
          <Table size="small">
            <TableBody>
              {categories.map((item, index) => <TableRowItem key={index} index={index} type="category" name={item} />)}
            </TableBody>
          </Table>
        </TableContainer>
        <Link 
          component="button" 
          variant="body2" 
          onClick={() => handleAddItem('category')}
          sx={{ display: 'flex', alignItems: 'center', mb: 4, color: '#9e9e9e', textDecoration: 'none' }}
        >
          <AddIcon sx={{ fontSize: 16, mr: 0.5 }} /> Add new item
        </Link>
      </Box>

    </Box>
  );
};

export default DocumentCategorySetup;
