import React, { useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Menu,
  MenuItem,
  IconButton,
} from '@mui/material';
import {
  KeyboardArrowRight,
  KeyboardArrowLeft,
  ArrowDropDown,
  Edit,
  InsertDriveFile,
} from '@mui/icons-material';

const AgingTable = () => {
  const [familyCreditAnchor, setFamilyCreditAnchor] = useState(null);
  const [accountCreditAnchor, setAccountCreditAnchor] = useState(null);
  const [currentSection, setCurrentSection] = useState('individual');

  const handleFamilyCreditClick = (event) => {
    setFamilyCreditAnchor(event.currentTarget);
  };

  const handleAccountCreditClick = (event) => {
    setAccountCreditAnchor(event.currentTarget);
  };

  const handleFamilyCreditClose = () => {
    setFamilyCreditAnchor(null);
  };

  const handleAccountCreditClose = () => {
    setAccountCreditAnchor(null);
  };

  const handleNextSection = () => {
    setCurrentSection('individual');
  };

  const handlePrevSection = () => {
    setCurrentSection('family');
  };

  return (
    <Box sx={{ width: '62%', flexGrow: 1, minWidth: 0 }}>
      <TableContainer 
        sx={{ 
          border: '1px solid #eee', 
          borderRight: 'none', 
          width: '100%', 
          borderRadius: '4px 0 0 4px', 
          bgcolor: 'white',
          boxShadow: 'none'
        }}
      >
        <Table 
          size="small" 
          sx={{ 
            width: '100%', 
            tableLayout: 'fixed',
            borderCollapse: 'collapse', 
            '& td, & th': { 
              border: '1px solid #eee', 
              fontSize: '11px', 
              p: '4px',
              '&:last-child': { borderRight: 'none' } 
            } 
          }}
        >
          <TableHead>
            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
              {['', 'Aging 0-30', '31-60', '61-90', '>90', 'Total', ''].map((head, i) => (
                <TableCell 
                  key={i} 
                  align={i === 0 ? 'left' : 'center'} 
                  sx={{ 
                    fontWeight: 'bold', 
                    width: i === 0 ? '25%' : i === 6 ? '40px' : 'auto',
                    bgcolor: i === 5 ? '#e57373' : 'inherit',
                    color: i === 5 ? '#fff' : '#555',
                    borderRight: i === 6 ? 'none' : '1px solid #eee'
                  }}
                >
                  {head}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {[
              { section: 'family', rows: ['Family Outstanding Bills', 'Family Balance', 'Insurance Balance'] },
              { section: 'individual', rows: ['Outstanding Bills', 'Balance', 'Insurance Balance'], hasReset: true, resetBg: '#7986cb', rowBg: '#5c6bc0', textColor: '#fff' }
            ].map((sectionData) => (
              sectionData.rows.map((row, idx) => (
                <TableRow key={row} sx={{ bgcolor: sectionData.rowBg || 'inherit' }}>
                  <TableCell sx={{ color: sectionData.textColor || '#666', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: sectionData.textColor ? 'bold' : 'normal' }}>
                    {row}
                  </TableCell>
                  {[0, 1, 2, 3].map((i) => (
                    <TableCell key={i} align="right" sx={{ color: sectionData.textColor || 'inherit' }}>$0.00</TableCell>
                  ))}
                  <TableCell align="right" sx={{ bgcolor: sectionData.section === 'family' ? '#ef9a9a' : '#e57373', color: '#fff', fontWeight: 'bold' }}>$0.00</TableCell>
                  <TableCell sx={{ p: 0, borderRight: 'none', bgcolor: sectionData.hasReset ? sectionData.resetBg : 'inherit', color: '#fff', textAlign: 'center' }}>
                    {sectionData.hasReset && (
                      <>
                        {idx === 0 && (
                          <IconButton 
                            size="small" 
                            onClick={handleNextSection}
                            sx={{ color: '#fff', p: 0, '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}
                          >
                            <KeyboardArrowRight sx={{ fontSize: 16 }} />
                          </IconButton>
                        )}
                        {idx === 1 && <Typography sx={{ fontSize: '8px', fontWeight: 'bold' }}>RESET</Typography>}
                        {idx === 2 && (
                          <IconButton 
                            size="small" 
                            onClick={handlePrevSection}
                            sx={{ color: '#fff', p: 0, '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}
                          >
                            <KeyboardArrowLeft sx={{ fontSize: 16 }} />
                          </IconButton>
                        )}
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Credits Summary Footer */}
      <Box sx={{ bgcolor: '#7e57c2', color: '#fff', p: 0.5, display: 'flex', alignItems: 'center', width: '100%' }}>
        <Box sx={{ flexGrow: 1, pl: 1 }}>
          <Typography variant="caption" display="block" sx={{ fontSize: '10px' }}>Courtesy Credit: <b>$0.00</b></Typography>
          <Typography variant="caption" sx={{ fontSize: '10px' }}>
            Family Credit: <b>$200.00</b> 
            <IconButton 
              size="small" 
              onClick={handleFamilyCreditClick}
              sx={{ color: '#fff', p: 0, ml: 0.5, '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
            >
              <ArrowDropDown sx={{ fontSize: 16 }} />
            </IconButton>
          </Typography>
        </Box>
        <Button size="small" sx={{ bgcolor: '#5c6bc0', color: '#fff', fontSize: '10px', height: '24px', mr: 2, textTransform: 'none' }}>Refund</Button>
        <Typography variant="caption" sx={{ fontSize: '11px', mr: 1 }}>
          Account Credit: <b>$200.00</b>
          <IconButton 
            size="small" 
            onClick={handleAccountCreditClick}
            sx={{ color: '#fff', p: 0, ml: 0.5, '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
          >
            <ArrowDropDown sx={{ fontSize: 16 }} />
          </IconButton>
        </Typography>
        <IconButton size="small" sx={{ color: '#fff', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
          <Edit sx={{ fontSize: 14 }} />
        </IconButton>
        <IconButton size="small" sx={{ color: '#fff', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
          <InsertDriveFile sx={{ fontSize: 14 }} />
        </IconButton>
      </Box>

      {/* Family Credit Dropdown Menu */}
      <Menu
        anchorEl={familyCreditAnchor}
        open={Boolean(familyCreditAnchor)}
        onClose={handleFamilyCreditClose}
        PaperProps={{
          sx: {
            maxHeight: 300,
            minWidth: 200,
          }
        }}
      >
        {/* Options to be added */}
      </Menu>

      {/* Account Credit Dropdown Menu */}
      <Menu
        anchorEl={accountCreditAnchor}
        open={Boolean(accountCreditAnchor)}
        onClose={handleAccountCreditClose}
        PaperProps={{
          sx: {
            maxHeight: 300,
            minWidth: 200,
          }
        }}
      >
        {/* Options to be added */}
      </Menu>
    </Box>
  );
};

export default AgingTable;
