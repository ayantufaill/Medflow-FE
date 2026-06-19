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
  Radio,
  FormControlLabel
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProcedureCodes, selectProcedureCodes, selectProcedureCodesLoading } from '../../store/slices/feeGuideSlice';

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
  const [selectedProc, setSelectedProc] = useState(null);

  useEffect(() => {
    if (open && codes.length === 0) {
      dispatch(fetchProcedureCodes({ limit: 1000 }));
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

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#f5f5f5' }}>
        <Typography variant="h6" fontWeight={700}>
          Select Code:
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
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
              <Accordion key={type} disableGutters elevation={0} square sx={{ borderBottom: '1px solid #e0e0e0', '&:before': { display: 'none' } }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ bgcolor: '#ebebeb', minHeight: '36px', '& .MuiAccordionSummary-content': { my: 0.5 } }}>
                  <Typography fontWeight={600} fontSize="0.85rem" color="#333">- {type}</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 0 }}>
                  <Box sx={{ pl: 2, bgcolor: '#f4f4f4' }}>
                    {Object.keys(hierarchy[type]).sort().map((group) => (
                      <Box key={group}>
                        <Typography sx={{ py: 1, px: 2, fontSize: '0.8rem', color: '#555' }}>
                          - {group}
                        </Typography>
                        <List disablePadding sx={{ bgcolor: '#fff' }}>
                          {hierarchy[type][group].map((proc) => (
                            <ListItem key={proc.ProcCode} disablePadding sx={{ px: 4, py: 0.5, borderBottom: '1px solid #f9f9f9' }}>
                              <FormControlLabel
                                value={proc.ProcCode}
                                control={
                                  <Radio 
                                    size="small" 
                                    checked={selectedProc?.ProcCode === proc.ProcCode}
                                    onChange={() => setSelectedProc(proc)}
                                    sx={{ p: 0.5, color: '#888', '&.Mui-checked': { color: '#555' } }}
                                  />
                                }
                                label={
                                  <Typography sx={{ fontSize: '0.8rem', color: '#555' }}>
                                    {proc.ProcCode} <span style={{ marginLeft: '12px' }}>{proc.Descript || 'Unknown'}</span>
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
      <DialogActions sx={{ p: 2, bgcolor: '#f5f5f5' }}>
        <Button 
          onClick={() => {
            if (selectedProc) {
              onSelect(selectedProc);
            }
          }} 
          disabled={!selectedProc}
          variant="contained" 
          sx={{ bgcolor: '#d2b48c', color: 'white', '&:hover': { bgcolor: '#c1a37b' } }}
        >
          Ok
        </Button>
        <Button onClick={onClose} variant="contained" sx={{ bgcolor: '#9ca3af', color: 'white', '&:hover': { bgcolor: '#8b949e' } }}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProcedureCategorySelectDialog;
