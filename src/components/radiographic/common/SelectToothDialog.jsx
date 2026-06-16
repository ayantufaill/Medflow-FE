import React from "react";
import { 
  Dialog, DialogTitle, DialogContent, Box, Typography, Stack, IconButton, Divider 
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

const ColumnDivider = () => (
  <Box sx={{ borderLeft: '1px solid #e2e8f0', mx: 2, height: 'auto', alignSelf: 'stretch' }} />
);

const ClickableTooth = ({ label, isSelected, onClick }) => (
  <Box 
    onClick={onClick}
    sx={{
      width: 28,
      height: 28,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      fontSize: '0.75rem',
      fontWeight: 'bold',
      color: isSelected ? '#1976d2' : '#334155',
      bgcolor: isSelected ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
      borderRadius: '4px',
      transition: 'all 0.15s ease-in-out',
      userSelect: 'none',
      border: isSelected ? '1.5px solid #1976d2' : '1px solid transparent',
      '&:hover': {
        bgcolor: isSelected ? 'rgba(25, 118, 210, 0.15)' : '#f1f5f9',
        color: '#1976d2',
        borderColor: isSelected ? '#1976d2' : '#cbd5e1'
      }
    }}
  >
    {label}
  </Box>
);

const ToothGridSection = ({ title, rightPost, anterior, leftPost, selectedTeeth, onSelect }) => (
  <Box sx={{ mb: 3 }}>
    <Typography sx={{ fontWeight: 'bold', fontSize: '0.85rem', color: '#1e3a8a', mb: 1.5 }}>
      {title}
    </Typography>
    
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'stretch' }}>
      
      {/* Right Posterior Column */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography sx={{ fontSize: '0.75rem', color: '#64748b', mb: 1.5, fontWeight: 500 }}>
          Right Posterior
        </Typography>
        <Stack spacing={1} alignItems="center">
          <Stack direction="row" spacing={1}>
            {rightPost.top.map(t => (
              <ClickableTooth 
                key={t} 
                label={t} 
                isSelected={selectedTeeth.includes(t)} 
                onClick={() => onSelect(t)} 
              />
            ))}
          </Stack>
          <Stack direction="row" spacing={1}>
            {rightPost.bottom.map(t => (
              <ClickableTooth 
                key={t} 
                label={t} 
                isSelected={selectedTeeth.includes(t)} 
                onClick={() => onSelect(t)} 
              />
            ))}
          </Stack>
        </Stack>
      </Box>

      <ColumnDivider />

      {/* Anterior Column */}
      <Box sx={{ flex: 1.2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography sx={{ fontSize: '0.75rem', color: '#64748b', mb: 1.5, fontWeight: 500 }}>
          Anterior
        </Typography>
        <Stack spacing={1} alignItems="center">
          <Stack direction="row" spacing={1}>
            {anterior.top.map(t => (
              <ClickableTooth 
                key={t} 
                label={t} 
                isSelected={selectedTeeth.includes(t)} 
                onClick={() => onSelect(t)} 
              />
            ))}
          </Stack>
          <Stack direction="row" spacing={1}>
            {anterior.bottom.map(t => (
              <ClickableTooth 
                key={t} 
                label={t} 
                isSelected={selectedTeeth.includes(t)} 
                onClick={() => onSelect(t)} 
              />
            ))}
          </Stack>
        </Stack>
      </Box>

      <ColumnDivider />

      {/* Left Posterior Column */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography sx={{ fontSize: '0.75rem', color: '#64748b', mb: 1.5, fontWeight: 500 }}>
          Left Posterior
        </Typography>
        <Stack spacing={1} alignItems="center">
          <Stack direction="row" spacing={1}>
            {leftPost.top.map(t => (
              <ClickableTooth 
                key={t} 
                label={t} 
                isSelected={selectedTeeth.includes(t)} 
                onClick={() => onSelect(t)} 
              />
            ))}
          </Stack>
          <Stack direction="row" spacing={1}>
            {leftPost.bottom.map(t => (
              <ClickableTooth 
                key={t} 
                label={t} 
                isSelected={selectedTeeth.includes(t)} 
                onClick={() => onSelect(t)} 
              />
            ))}
          </Stack>
        </Stack>
      </Box>
    </Box>
  </Box>
);

const SelectToothDialog = ({ open, onClose, selectedTeeth = [], onSelect }) => {
  // 1. Supernumerary Adult Teeth
  const adultRightPost = { top: ['51', '52', '53', '54', '55'], bottom: ['82', '81', '80', '79', '78'] };
  const adultAnterior = { top: ['56', '57', '58', '59', '60', '61'], bottom: ['77', '76', '75', '74', '73', '72'] };
  const adultLeftPost = { top: ['62', '63', '64', '65', '66'], bottom: ['71', '70', '69', '68', '67'] };

  // 2. Retained Primary Teeth
  const primaryRightPost = { top: ['A', 'B'], bottom: ['T', 'S'] };
  const primaryAnterior = { top: ['C', 'D', 'E', 'F', 'G', 'H'], bottom: ['R', 'Q', 'P', 'O', 'N', 'M'] };
  const primaryLeftPost = { top: ['I', 'J'], bottom: ['L', 'K'] };

  // 3. Supernumerary Primary Teeth
  const superRightPost = { top: ['AS', 'BS'], bottom: ['TS', 'SS'] };
  const superAnterior = { top: ['CS', 'DS', 'ES', 'FS', 'GS', 'HS'], bottom: ['RS', 'QS', 'PS', 'OS', 'NS', 'MS'] };
  const superLeftPost = { top: ['IS', 'JS'], bottom: ['LS', 'KS'] };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '4px',
          border: '1px solid #cbd5e1',
          position: 'relative',
          p: 1.5
        }
      }}
    >
      <DialogTitle sx={{ 
        textAlign: 'center', 
        fontSize: '0.9rem', 
        fontWeight: 'bold', 
        color: '#334155',
        p: 1,
        borderBottom: '1px solid #f1f5f9'
      }}>
        Select Tooth
      </DialogTitle>
      
      <IconButton 
        onClick={onClose} 
        size="small"
        sx={{ position: 'absolute', right: 12, top: 12, color: '#94a3b8' }}
      >
        <CloseIcon sx={{ fontSize: 18 }} />
      </IconButton>

      <DialogContent sx={{ p: 2, '&:first-of-type': { pt: 2 } }}>
        
        {/* Section 1: Supernumerary Adult Teeth */}
        <ToothGridSection 
          title="Supernumerary Adult Teeth"
          rightPost={adultRightPost}
          anterior={adultAnterior}
          leftPost={adultLeftPost}
          selectedTeeth={selectedTeeth}
          onSelect={onSelect}
        />

        <Divider sx={{ my: 2.5 }} />

        {/* Section 2: Retained Primary Teeth */}
        <ToothGridSection 
          title="Retained Primary Teeth"
          rightPost={primaryRightPost}
          anterior={primaryAnterior}
          leftPost={primaryLeftPost}
          selectedTeeth={selectedTeeth}
          onSelect={onSelect}
        />

        <Divider sx={{ my: 2.5 }} />

        {/* Section 3: Supernumerary Primary Teeth */}
        <ToothGridSection 
          title="Supernumerary Primary Teeth"
          rightPost={superRightPost}
          anterior={superAnterior}
          leftPost={superLeftPost}
          selectedTeeth={selectedTeeth}
          onSelect={onSelect}
        />
        
      </DialogContent>
    </Dialog>
  );
};

export default SelectToothDialog;
