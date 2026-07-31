import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProcedureCodes, selectProcedureCodes, selectProcedureCodesLoading } from '../../store/slices/feeGuideSlice';
import { COLORS } from '../../constants/colors';
import { FormatListNumbered as FormatListNumberedIcon } from '@mui/icons-material';

const classifyCode = (code) => {
  const num = parseInt((code || '').replace(/\D/g, ''), 10);
  if (isNaN(num)) return { type: 'Other', group: 'Other' };

  if (num >= 100 && num <= 999) {
    if (num >= 120 && num <= 191) return { type: 'Diagnostic', group: 'Oral evaluation' };
    if (num >= 210 && num <= 395) return { type: 'Diagnostic', group: 'Diagnostic imaging' };
    return { type: 'Diagnostic', group: 'Other Diagnostic' };
  }
  if (num >= 1000 && num <= 1999) {
    if (num >= 1110 && num <= 1120) return { type: 'Preventative', group: 'Dental prophylaxis' };
    if (num >= 1206 && num <= 1208) return { type: 'Preventative', group: 'Topical fluoride treatment' };
    return { type: 'Preventative', group: 'Other Preventative' };
  }
  if (num >= 2000 && num <= 2999) {
    if (num >= 2140 && num <= 2161) return { type: 'Restorative', group: 'Amalgam restorations' };
    if (num >= 2330 && num <= 2394) return { type: 'Restorative', group: 'Resin-based composite' };
    return { type: 'Restorative', group: 'Other Restorative' };
  }
  if (num >= 3000 && num <= 3999) {
    if (num >= 3110 && num <= 3120) return { type: 'Endodontics', group: 'Pulp capping' };
    return { type: 'Endodontics', group: 'Other Endodontics' };
  }
  if (num >= 4000 && num <= 4999) {
    if (num >= 4210 && num <= 4231) return { type: 'Periodontics', group: 'Surgical services' };
    return { type: 'Periodontics', group: 'Other Periodontics' };
  }
  if (num >= 5000 && num <= 5899) {
    if (num >= 5110 && num <= 5140) return { type: 'Prosthodontics, Removable', group: 'Complete dentures' };
    return { type: 'Prosthodontics, Removable', group: 'Other Removable' };
  }
  if (num >= 5900 && num <= 5999) {
    return { type: 'Maxillofacial Prosthetics', group: 'Prostheses' };
  }
  if (num >= 6000 && num <= 6199) {
    return { type: 'Implant Services', group: 'Implants' };
  }
  if (num >= 6200 && num <= 6999) {
    if (num >= 6200 && num <= 6253) return { type: 'Prosthodontics, Fixed', group: 'Fixed partial denture pontics' };
    return { type: 'Prosthodontics, Fixed', group: 'Other Fixed' };
  }
  if (num >= 7000 && num <= 7999) {
    if (num >= 7111 && num <= 7250) return { type: 'Oral Surgery', group: 'Extractions' };
    return { type: 'Oral Surgery', group: 'Other Surgery' };
  }
  if (num >= 8000 && num <= 8999) {
    if (num >= 8070 && num <= 8090) return { type: 'Orthodontics', group: 'Comprehensive orthodontic treatment' };
    return { type: 'Orthodontics', group: 'Other Orthodontics' };
  }
  if (num >= 9000 && num <= 9999) {
    if (num >= 9110 && num <= 9110) return { type: 'Adjunct General Services', group: 'Unclassified treatment' };
    return { type: 'Adjunct General Services', group: 'Other General Services' };
  }
  
  return { type: 'Uncategorized', group: 'Uncategorized' };
};

const ProcedureCategorySelectDialog = ({ open, onClose, onSelect }) => {
  const dispatch = useDispatch();
  const codes = useSelector(selectProcedureCodes);
  const loading = useSelector(selectProcedureCodesLoading);
  
  const [hierarchy, setHierarchy] = useState({});
  const [selectedProcs, setSelectedProcs] = useState([]);

  useEffect(() => {
    if (open) {
      // Clear selections on open
      setSelectedProcs([]);
      if (codes.length === 0) {
        dispatch(fetchProcedureCodes({ limit: 1000 }));
      }
    }
  }, [open, codes.length, dispatch]);

  useEffect(() => {
    if (codes.length > 0) {
      // Group by type and group
      const newHierarchy = {};
      codes.forEach(code => {
        const { type, group } = classifyCode(code.ProcCode);
        if (!newHierarchy[type]) newHierarchy[type] = {};
        if (!newHierarchy[type][group]) newHierarchy[type][group] = [];
        newHierarchy[type][group].push(code);
      });
      
      setHierarchy(newHierarchy);
    }
  }, [codes]);

  const handleToggleProcedure = (proc) => {
    setSelectedProcs((prev) => {
      const isSelected = prev.some((p) => p.ProcCode === proc.ProcCode);
      if (isSelected) {
        return prev.filter((p) => p.ProcCode !== proc.ProcCode);
      } else {
        return [...prev, proc];
      }
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth sx={{ zIndex: 1500 }}>
      <DialogTitle 
        sx={{ 
          m: 0, 
          px: "24px", 
          py: "16px", 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          bgcolor: COLORS.SURFACE_TINT,
          borderBottom: `1px solid ${COLORS.BORDER}` 
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FormatListNumberedIcon sx={{ fontSize: "20px", color: COLORS.ACCENT }} />
          <Typography sx={{ fontSize: "15px", fontWeight: 600, color: COLORS.TEXT_PRIMARY, flex: 1 }}>
            Select Code(s):
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: COLORS.TEXT_SECONDARY }}>
          <CloseIcon sx={{ fontSize: "18px" }} />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 2, minHeight: '300px' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box>
            {Object.keys(hierarchy).sort().map((type) => (
              <Accordion key={type} disableGutters elevation={0} square sx={{ borderBottom: `1px solid ${COLORS.BORDER}`, '&:before': { display: 'none' } }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: COLORS.TEXT_SECONDARY }} />} sx={{ bgcolor: COLORS.SURFACE_TINT, minHeight: '36px', '& .MuiAccordionSummary-content': { my: 0.5 } }}>
                  <Typography fontWeight={600} fontSize="0.85rem" color={COLORS.TEXT_PRIMARY}>- {type}</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 0 }}>
                  <Box sx={{ pl: 2, bgcolor: COLORS.SURFACE_TINT }}>
                    {Object.keys(hierarchy[type]).sort().map((group) => (
                      <Box key={group}>
                        <Typography sx={{ py: 1, px: 2, fontSize: '0.8rem', color: COLORS.TEXT_SECONDARY }}>
                          - {group}
                        </Typography>
                        <List disablePadding sx={{ bgcolor: 'white' }}>
                          {hierarchy[type][group].map((proc) => (
                            <ListItem key={proc.ProcCode} disablePadding sx={{ px: 4, py: 0.5, borderBottom: `1px solid ${COLORS.BORDER_LIGHT}` }}>
                              <FormControlLabel
                                value={proc.ProcCode}
                                control={
                                  <Checkbox 
                                    size="small" 
                                    checked={selectedProcs.some(p => p.ProcCode === proc.ProcCode)}
                                    onChange={() => handleToggleProcedure(proc)}
                                    sx={{ p: 0.5, color: COLORS.TEXT_SECONDARY, '&.Mui-checked': { color: COLORS.ACCENT } }}
                                  />
                                }
                                label={
                                  <Typography sx={{ fontSize: '0.8rem', color: COLORS.TEXT_PRIMARY }}>
                                    {proc.ProcCode} <span style={{ marginLeft: '12px', color: COLORS.TEXT_SECONDARY }}>{proc.Descript || 'Unknown'}</span>
                                  </Typography>
                                }
                              />
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    ))}
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2, bgcolor: COLORS.SURFACE_TINT, borderTop: `1px solid ${COLORS.BORDER}` }}>
        <Button 
          onClick={() => {
            if (selectedProcs.length > 0) {
              onSelect(selectedProcs);
            }
          }} 
          disabled={selectedProcs.length === 0}
          variant="contained" 
          sx={{ 
            bgcolor: COLORS.ACCENT, 
            color: 'white', 
            textTransform: 'none',
            boxShadow: 'none',
            '&:hover': { bgcolor: '#1565c0', boxShadow: 'none' },
            '&.Mui-disabled': { bgcolor: '#e0e0e0', color: '#9e9e9e' }
          }}
        >
          Ok
        </Button>
        <Button 
          onClick={onClose} 
          variant="outlined" 
          sx={{ 
            color: COLORS.TEXT_SECONDARY, 
            borderColor: COLORS.BORDER, 
            bgcolor: 'white',
            textTransform: 'none',
            '&:hover': { bgcolor: '#f5f5f5' } 
          }}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProcedureCategorySelectDialog;
