import React, { useState } from 'react';
import { Stack, Button, Menu, MenuItem, Typography, IconButton, Chip } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DeleteIcon from '@mui/icons-material/Delete';
import PrintIcon from '@mui/icons-material/Print';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import SettingsIcon from '@mui/icons-material/Settings';
import SecurityIcon from '@mui/icons-material/Security';
import ReEstimateMenu from '../../components/clinical/ReEstimateMenu';

export const GlobalActionBar = ({ 
  onReEstimateOptionClick, 
  onSettingsClick, 
  onPredetermineClick, 
  onViewFeeGuideClick,
  visits = [],
  handleAddVisit,
  selectedProcedureIds = [],
  handleMoveProceduresToVisit,
  onStateClick,
  onDeleteClick,
  onReferClick,
  onDbiClick,
  onPrintClick
}) => {
  const [reEstimateAnchor, setReEstimateAnchor] = useState(null);
  const [visitAnchorEl, setVisitAnchorEl] = useState(null);
  const [phaseAnchorEl, setPhaseAnchorEl] = useState(null);

  const handleReEstimateClick = (event) => {
    setReEstimateAnchor(event.currentTarget);
  };

  const handleReEstimateClose = () => {
    setReEstimateAnchor(null);
  };

  const handleVisitClick = (event) => {
    setVisitAnchorEl(event.currentTarget);
  };

  const handleVisitClose = () => {
    setVisitAnchorEl(null);
    setPhaseAnchorEl(null);
  };

  const handlePhaseMouseEnter = (event) => {
    setPhaseAnchorEl(event.currentTarget);
  };

  return (
    <Stack 
      direction="row" 
      alignItems="center" 
      justifyContent="space-between" 
      sx={{ p: 1, bgcolor: '#f8f9fc', borderBottom: '1px solid #e0e0e0' }}
    >
      {/* Left Button Group */}
      <Stack direction="row" spacing={1} alignItems="center">
        <Button 
          variant="contained" 
          size="small" 
          endIcon={<KeyboardArrowDownIcon />}
          onClick={handleVisitClick}
          sx={{ 
            bgcolor: '#2d4571', 
            color: '#fff', 
            textTransform: 'none', 
            borderRadius: 1,
            '&:hover': {
              bgcolor: '#1e3050'
            }
          }}
        >
          Visit
        </Button>

        {/* Primary Visit Dropdown Menu */}
        <Menu
          anchorEl={visitAnchorEl}
          open={Boolean(visitAnchorEl)}
          onClose={handleVisitClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          PaperProps={{
            sx: {
              minWidth: 160,
              boxShadow: '0px 4px 20px rgba(0,0,0,0.1)',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              py: 0.5,
              mt: 0.5
            }
          }}
        >
          <MenuItem 
            onMouseEnter={handlePhaseMouseEnter}
            onClick={handlePhaseMouseEnter}
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              fontSize: '0.8rem',
              py: 1,
              px: 2,
              color: '#334155',
              '&:hover': {
                bgcolor: '#f1f5f9'
              }
            }}
          >
            <Typography sx={{ fontSize: '0.8rem' }}>Phase 1</Typography>
            <ChevronRightIcon sx={{ fontSize: 16, color: '#64748b' }} />
          </MenuItem>
          <MenuItem 
            onClick={handleVisitClose}
            sx={{ 
              fontSize: '0.8rem', 
              py: 1,
              px: 2,
              color: '#1976d2',
              fontWeight: 'medium',
              '&:hover': {
                bgcolor: '#f0f7ff'
              }
            }}
          >
            +Add New Phase
          </MenuItem>
        </Menu>

        {/* Secondary Phase Dropdown Menu */}
        <Menu
          anchorEl={phaseAnchorEl}
          open={Boolean(phaseAnchorEl)}
          onClose={() => setPhaseAnchorEl(null)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          PaperProps={{
            sx: {
              minWidth: 160,
              boxShadow: '0px 4px 20px rgba(0,0,0,0.1)',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              py: 0.5,
              ml: 0.5
            }
          }}
        >
          <MenuItem 
            onClick={handleVisitClose}
            sx={{ 
              fontSize: '0.8rem', 
              py: 1, 
              px: 2, 
              color: '#334155',
              '&:hover': { bgcolor: '#f1f5f9' } 
            }}
          >
            Recare
          </MenuItem>
          {visits.map((v) => (
            <MenuItem 
              key={v.id}
              onClick={() => {
                if (selectedProcedureIds.length > 0) {
                  handleMoveProceduresToVisit(v.id);
                } else {
                  const element = document.getElementById(v.id);
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }
                }
                handleVisitClose();
              }}
              sx={{ 
                fontSize: '0.8rem', 
                py: 1, 
                px: 2, 
                color: '#334155',
                '&:hover': { bgcolor: '#f1f5f9' } 
              }}
            >
              {v.label}
            </MenuItem>
          ))}
          <MenuItem 
            onClick={() => {
              if (handleAddVisit) {
                handleAddVisit();
              }
              handleVisitClose();
            }}
            sx={{ 
              fontSize: '0.8rem', 
              py: 1, 
              px: 2, 
              color: '#1976d2', 
              fontWeight: 'medium',
              '&:hover': { bgcolor: '#f0f7ff' } 
            }}
          >
            +Add New Visit
          </MenuItem>
        </Menu>

        <Button 
          variant="contained" 
          size="small" 
          endIcon={<KeyboardArrowDownIcon />}
          onClick={onStateClick}
          sx={{ 
            bgcolor: '#2d4571', 
            color: '#fff', 
            textTransform: 'none', 
            borderRadius: 1,
            '&:hover': {
              bgcolor: '#1e3050'
            }
          }}
        >
          State
        </Button>
        <IconButton 
          size="small" 
          onClick={onDeleteClick}
          sx={{ bgcolor: '#f4c7c3', mx: 1 }}
        >
          <DeleteIcon fontSize="small" sx={{ color: '#d93025' }} />
        </IconButton>
        <Button 
          variant="contained" 
          color="success" 
          size="small" 
          sx={{ borderRadius: 20, textTransform: 'none', px: 2, bgcolor: '#b7e1cd', color: '#137333' }}
        >
          Complete
        </Button>
        <Button 
          variant={selectedProcedureIds.length > 0 ? "contained" : "outlined"}
          size="small" 
          onClick={(e) => {
            if (selectedProcedureIds.length > 0) {
              onReferClick(e);
            }
          }}
          sx={{ 
            borderRadius: 20, 
            textTransform: 'none', 
            px: 2, 
            ...(selectedProcedureIds.length > 0 ? {
              bgcolor: '#e0e0e0',
              color: '#424242',
              boxShadow: 'none',
              '&:hover': {
                bgcolor: '#cbd5e1',
                boxShadow: 'none'
              }
            } : {
              color: '#9e9e9e', 
              borderColor: '#e0e0e0',
              cursor: 'default'
            })
          }}
        >
          Refer To
        </Button>
      </Stack>

      {/* Right Action Group */}
      <Stack direction="row" spacing={1} alignItems="center">
        <Stack direction="row">
          <Button 
            variant="contained" 
            size="small" 
            sx={{ bgcolor: '#1a237e', textTransform: 'none', borderRight: '1px solid #3f51b5', borderRadius: '4px 0 0 4px' }}
            onClick={handleReEstimateClick}
          >
            Re-Estimate
          </Button>
          <Button 
            variant="contained" 
            size="small" 
            sx={{ bgcolor: '#1a237e', minWidth: 30, borderRadius: '0 4px 4px 0' }}
            onClick={handleReEstimateClick}
          >
            <KeyboardArrowDownIcon fontSize="small" />
          </Button>
        </Stack>
        
        <ReEstimateMenu 
          anchorEl={reEstimateAnchor}
          open={Boolean(reEstimateAnchor)}
          onClose={handleReEstimateClose}
          onOptionClick={onReEstimateOptionClick}
        />
        
        <Chip 
          label="DBI" 
          variant="outlined" 
          size="small" 
          onClick={onDbiClick}
          sx={{ 
            borderRadius: 1, 
            height: 24, 
            bgcolor: selectedProcedureIds.length > 0 ? '#2d4571' : '#a3b1d6', 
            color: selectedProcedureIds.length > 0 ? '#fff' : 'inherit',
            border: 'none',
            cursor: selectedProcedureIds.length > 0 ? 'pointer' : 'default',
            '&:hover': {
              bgcolor: selectedProcedureIds.length > 0 ? '#1e3050' : '#a3b1d6'
            }
          }} 
        />
        
        <IconButton size="small" onClick={onPrintClick}><PrintIcon fontSize="small" sx={{ color: '#1a237e' }} /></IconButton>
        <IconButton size="small"><CreditCardIcon fontSize="small" sx={{ color: '#1a237e' }} /></IconButton>
        <IconButton size="small" onClick={onSettingsClick}><SettingsIcon fontSize="small" sx={{ color: '#1a237e' }} /></IconButton>
        <IconButton size="small" onClick={onPredetermineClick}><SecurityIcon fontSize="small" sx={{ color: '#1a237e' }} /></IconButton>
        
        <Button 
          variant="outlined" 
          size="small" 
          sx={{ textTransform: 'none', color: '#1a237e', borderColor: '#1a237e' }}
          onClick={onViewFeeGuideClick}
        >
          View Used Fee Guide
        </Button>
        
        <Button 
          variant="contained" 
          size="small" 
          endIcon={<KeyboardArrowDownIcon />}
          sx={{ bgcolor: '#1a237e', textTransform: 'none' }}
        >
          INS. COVERAGE
        </Button>
      </Stack>
    </Stack>
  );
};

export default GlobalActionBar;
