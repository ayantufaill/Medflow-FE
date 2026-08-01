import { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Box, Typography, Collapse
} from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp, Close as CloseIcon, DescriptionOutlined as DescriptionIcon } from '@mui/icons-material';

const PlanFeeGuideDialog = ({ open, onClose, planName }) => {
  const [expandedRows, setExpandedRows] = useState({});

  const toggleRow = (id) => {
    setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const categories = [
    { id: 1, name: 'Diagnostic' },
    { id: 2, name: 'Preventative' },
    { id: 3, name: 'Restorative' },
    { id: 4, name: 'Endodontics' },
    { id: 5, name: 'Periodontics' },
    { id: 6, name: 'Prosthodontics, Removable' },
    { id: 7, name: 'Maxillofacial Prosthetics' },
    { id: 8, name: 'Implant Services' },
    { id: 9, name: 'Prosthodontics, Fixed' },
    { id: 10, name: 'Oral Surgery' },
    { id: 11, name: 'Orthodontics' },
    { id: 12, name: 'Adjunctive General Services' },
  ];

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="lg" 
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
          <DescriptionIcon sx={{ fontSize: "20px", color: "#2262ef" }} />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: 1 }}>
          <Typography sx={{ 
            display: "flex", flexDirection: "column", justifyContent: "flex-start",
            alignItems: "flex-start", height: "24px", padding: "0px",
            fontFamily: "Inter", fontSize: "15px", fontWeight: 700, color: "#09121f",
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
          }}>
            {planName || 'Careington PPO Platinum (directly in network)'}
          </Typography>
          <Typography sx={{ 
            fontWeight: 400, lineHeight: "16.25px", letterSpacing: "0px",
            textAlign: "left", color: "#5c646f", fontFamily: "Inter", fontSize: "11px",
          }}>
            Manage the fee guide for this insurance plan.
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: "#6b7280", "&:hover": { color: "#111928", backgroundColor: "#e5e7eb" } }}>
          <CloseIcon />
        </IconButton>
      </Box>
      <DialogContent sx={{ p: 0 }}>
        <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 0 }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: '#0c345d' }}>
                <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: '0.8rem', width: '200px' }}>Type</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: '0.8rem' }}>Group</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: '0.8rem' }}>Code</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: '0.8rem' }}>Procedure Name</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: '0.8rem' }}>Fee</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((cat) => (
                <TableRow key={cat.id} hover onClick={() => toggleRow(cat.id)} sx={{ cursor: 'pointer' }}>
                  <TableCell colSpan={5} sx={{ p: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', py: 0.5, px: 1 }}>
                      <IconButton size="small">
                        {expandedRows[cat.id] ? <KeyboardArrowUp fontSize="small" /> : <KeyboardArrowDown fontSize="small" />}
                      </IconButton>
                      <Typography variant="body2" sx={{ fontSize: '0.8rem', fontWeight: 500 }}>{cat.name}</Typography>
                    </Box>
                    <Collapse in={expandedRows[cat.id]} timeout="auto" unmountOnExit>
                      <Box sx={{ pl: 4, pb: 1 }}>
                        <Typography variant="caption" color="textSecondary">No procedures defined for this category.</Typography>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
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
          Close
        </Button>
        <Button 
          variant="contained" 
          sx={{ 
            fontFamily: "Inter", fontSize: "13px", fontWeight: 600,
            textTransform: "none", borderRadius: "8px",
            backgroundColor: "#2262ef", color: "#fff",
            px: "20px", py: "7px",
            boxShadow: "none",
            "&:hover": { backgroundColor: "#1a50cc", boxShadow: "none" },
          }}
        >
          Export as CSV
        </Button>
        <Button 
          variant="contained" 
          sx={{ 
            fontFamily: "Inter", fontSize: "13px", fontWeight: 600,
            textTransform: "none", borderRadius: "8px",
            backgroundColor: "#2262ef", color: "#fff",
            px: "20px", py: "7px",
            boxShadow: "none",
            "&:hover": { backgroundColor: "#1a50cc", boxShadow: "none" },
          }}
        >
          Upload fee Guide
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PlanFeeGuideDialog;
