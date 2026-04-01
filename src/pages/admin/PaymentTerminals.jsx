import React from 'react';
import {
  Box,
  Typography,
  Breadcrumbs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Link,
  IconButton,
  Tooltip,
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';

const PaymentTerminals = () => {
  const headerStyle = { fontWeight: 600, color: '#555', fontSize: '0.85rem', borderBottom: '1px solid #e0e0e0' };
  const actionLinkStyle = { 
    display: 'flex', 
    alignItems: 'center', 
    color: '#1976d2', 
    fontSize: '0.8rem', 
    textDecoration: 'none', 
    mt: 1, 
    cursor: 'pointer',
    '&:hover': { textDecoration: 'underline' }
  };

  return (
    <Box sx={{ p: 4, bgcolor: '#fff' }}>
      {/* --- BREADCRUMB --- */}
      <Breadcrumbs 
        separator={<NavigateNextIcon fontSize="small" />} 
        sx={{ mb: 3, fontSize: '0.85rem' }}
      >
        <Link underline="hover" color="inherit" href="#">Finance Management</Link>
        <Typography color="text.primary" sx={{ fontWeight: 500 }}>Payment Terminals</Typography>
      </Breadcrumbs>

      {/* --- OPENEDGE SECTION --- */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>OpenEdge payment terminals</Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={headerStyle}>Terminal Serial Num.</TableCell>
                <TableCell sx={headerStyle}>
                  OpenEdge Account Token <InfoOutlinedIcon sx={{ fontSize: 14, ml: 0.5, verticalAlign: 'middle' }} />
                </TableCell>
                <TableCell sx={headerStyle} />
              </TableRow>
            </TableHead>
            <TableBody>
              {/* Data rows would go here */}
            </TableBody>
          </Table>
        </TableContainer>
        <Link sx={actionLinkStyle}><AddIcon sx={{ fontSize: 16 }} /> add new workstation manually</Link>
        <Link sx={actionLinkStyle}><AddIcon sx={{ fontSize: 16 }} /> add workstation using connected device</Link>
      </Box>

      {/* --- PROSPERIPAY SECTION --- */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Prosperipay payment terminals</Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={headerStyle}>Name <InfoOutlinedIcon sx={{ fontSize: 14, verticalAlign: 'middle' }} /></TableCell>
                <TableCell sx={headerStyle}>Terminal Serial Num. <InfoOutlinedIcon sx={{ fontSize: 14, verticalAlign: 'middle' }} /></TableCell>
                <TableCell sx={headerStyle}>Prosperipay Merchant ID</TableCell>
                <TableCell sx={headerStyle}>Device Model</TableCell>
                <TableCell sx={headerStyle}>Device ID</TableCell>
                <TableCell sx={headerStyle} />
              </TableRow>
            </TableHead>
            <TableBody>
              {['Checkin', 'Checkout'].map((row) => (
                <TableRow key={row}>
                  <TableCell>{row}</TableCell>
                  <TableCell sx={{ color: '#1976d2' }}>XXXX-XXXX</TableCell>
                  <TableCell>XXXX-XXXX</TableCell>
                  <TableCell>Model Name</TableCell>
                  <TableCell>ID-XXXX</TableCell>
                  <TableCell align="right">
                    <IconButton size="small"><DeleteOutlineIcon fontSize="small" sx={{ color: '#ccc' }} /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Link sx={actionLinkStyle}><AddIcon sx={{ fontSize: 16 }} /> add new device manually</Link>
      </Box>

      {/* --- PAYRIX SECTION --- */}
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Payrix payment terminals</Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={headerStyle}>Terminal ID <InfoOutlinedIcon sx={{ fontSize: 14, verticalAlign: 'middle' }} /></TableCell>
                <TableCell sx={headerStyle}>Terminal Serial Num. <InfoOutlinedIcon sx={{ fontSize: 14, verticalAlign: 'middle' }} /></TableCell>
                <TableCell sx={headerStyle}>Terminal Model Number</TableCell>
                <TableCell sx={headerStyle}>Lane ID</TableCell>
                <TableCell sx={headerStyle} />
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Checkout</TableCell>
                <TableCell sx={{ color: '#1976d2' }}>XXXX-XXXX</TableCell>
                <TableCell>XXXX-XXXX</TableCell>
                <TableCell>01</TableCell>
                <TableCell align="right">
                  <IconButton size="small"><DeleteOutlineIcon fontSize="small" sx={{ color: '#ccc' }} /></IconButton>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Link sx={actionLinkStyle}><AddIcon sx={{ fontSize: 16 }} /> add new device manually</Link>
      </Box>
    </Box>
  );
};

export default PaymentTerminals;
