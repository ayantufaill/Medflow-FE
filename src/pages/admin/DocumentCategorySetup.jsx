import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

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
  Stack
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import EditNoteIcon from '@mui/icons-material/EditNote';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';

const DocumentCategorySetup = () => {
  const documentList = [
    "BOB (Breakdown of benefits)", "Insurance Fax Back", "Treatment consent",
    "N2O Consent", "Signed Treatment Plan", "Pre-D", "Driver License",
    "Spouse Driver License", "Ins Card", "Ortho Rx", "Lab Certificate",
    "DFA", "Smile Mock Up", "Implant Info", "Lab Rx", "Lab Invoice",
    "Financial Agreement", "Confidential Info", "Medical/Dental History",
    "Referral form", "XRAY", "Demographics", "Invisalign", "Dental History",
    "BOB (Breakdown of benefits) - Sec", "BOB (Breakdown of benefits) - Pri",
    "Insurance Fax Back - Pri", "Insurance Fax Back - Sec"
  ];

  const categoryList = [
    "Insurance", "Consent", "Medical/Dental History", "Treatment Plan",
    "Referral", "Signed Receipt", "Medications", "ID", "Lab", "Injectables",
    "Consult", "Ortho", "Implant certificate", "Evident Hub", "New Patient Forms",
    "XRAY", "Demographics", "Eligibility verified (Detailed)", "Diagnosis",
    "Invisalign", "New Patient", "Eligibility verification", "Outstanding Balance"
  ];

  const TableRowItem = ({ name }) => (
    <TableRow sx={{ '&:hover': { bgcolor: '#f9f9f9' } }}>
      <TableCell sx={{ py: 0.5, borderBottom: '1px solid #f0f0f0', color: '#444' }}>
        {name}
      </TableCell>
      <TableCell align="right" sx={{ py: 0.5, borderBottom: '1px solid #f0f0f0' }}>
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <IconButton size="small" sx={{ color: '#1976d2' }}>
            <EditNoteIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" sx={{ color: '#ff8a80' }}>
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        </Stack>
      </TableCell>
    </TableRow>
  );

  return (
    <Box sx={{ p: 4, bgcolor: '#fff', minHeight: '100vh' }}>
      
      {/* --- BREADCRUMB --- */}
      <Breadcrumbs 
        separator={<NavigateNextIcon fontSize="small" sx={{ color: '#bdbdbd' }} />} 
        sx={{ mb: 4, fontSize: '0.85rem' }}
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

      <Box sx={{ maxWidth: 800 }}>
        {/* --- DOCUMENTS SECTION --- */}
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 700, color: '#555' }}>
          Documents
        </Typography>
        <TableContainer sx={{ mb: 1 }}>
          <Table size="small">
            <TableBody>
              {documentList.map((item, index) => <TableRowItem key={index} name={item} />)}
            </TableBody>
          </Table>
        </TableContainer>
        <Link 
          component="button" 
          variant="body2" 
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
              {categoryList.map((item, index) => <TableRowItem key={index} name={item} />)}
            </TableBody>
          </Table>
        </TableContainer>
        <Link 
          component="button" 
          variant="body2" 
          sx={{ display: 'flex', alignItems: 'center', mb: 4, color: '#9e9e9e', textDecoration: 'none' }}
        >
          <AddIcon sx={{ fontSize: 16, mr: 0.5 }} /> Add new item
        </Link>
      </Box>

    </Box>
  );
};

export default DocumentCategorySetup;
