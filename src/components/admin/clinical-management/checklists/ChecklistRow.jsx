import { Box, Typography, Checkbox, FormControlLabel } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DeleteIcon from '@mui/icons-material/Delete';
import CopyIcon from '@mui/icons-material/ContentCopy';
import SettingsIcon from '@mui/icons-material/Settings';
import { ChecklistIcon } from './ChecklistIcons';
import ChecklistItemsTable from './ChecklistItemsTable';

const ChecklistRow = ({
  item,
  idx,
  category,
  expandedChecklists,
  toggleChecklist,
  handleIconClick,
  handleToggleChecklistField,
  handleCopyChecklistToClipboard,
  handleDeleteChecklist,
  activeInput,
  setActiveInput,
  handleInputSubmit,
  handleDeleteItem,
  handleCopyItemToClipboard,
  handleRemoveChoice,
  handleRemoveProduct
}) => {
  const isExpanded = expandedChecklists.includes(item.name);
  
  return (
    <Box sx={{ borderBottom: '1px solid #f1f5f9' }}>
      <Box 
        onClick={() => toggleChecklist(item.name)}
        sx={{ 
          pl: 4, 
          pr: 2, 
          py: 1.5, 
          display: 'flex', 
          alignItems: 'center', 
          cursor: 'pointer',
          backgroundColor: isExpanded ? '#f8fafc' : 'transparent',
          '&:hover': { backgroundColor: isExpanded ? '#f1f5f9' : '#f8fafc' },
          borderLeft: isExpanded ? '4px solid #3b82f6' : '4px solid transparent',
          transition: 'all 0.2s ease'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
           {isExpanded ? (
              <KeyboardArrowDownIcon sx={{ color: '#3b82f6', fontSize: '1.4rem' }} />
           ) : (
              <ChevronRightIcon sx={{ color: '#64748b', fontSize: '1.4rem' }} />
           )}
           <Box 
             onClick={(e) => {
               e.stopPropagation();
               handleIconClick(e, category, idx);
             }}
             sx={{ 
               cursor: 'pointer', 
               p: 0.5, 
               borderRadius: '6px',
               '&:hover': { backgroundColor: '#e2e8f0' } 
             }}
           >
             <ChecklistIcon iconId={item.iconId} color="#3b82f6" />
           </Box>
          <Typography sx={{ color: '#1e293b', fontSize: '0.9rem', fontWeight: 600, flex: 1, ml: 1 }}>
            {item.name}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 160 }}>
            <Typography sx={{ color: '#334155', fontSize: '0.85rem', fontWeight: 600 }}>{item.shortName}</Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, minWidth: 380 }}>
            <FormControlLabel
              onClick={(e) => e.stopPropagation()}
              control={
                <Checkbox 
                  size="small" 
                  checked={item.isTreatment} 
                  onChange={(e) => handleToggleChecklistField(category, idx, 'isTreatment', e.target.checked)}
                  sx={{ p: 0.5, color: '#cbd5e1', '&.Mui-checked': { color: '#3b82f6' } }} 
                />
              }
              label={<Typography sx={{ fontSize: '0.85rem', color: '#475569' }}>Treatment</Typography>}
            />
            <FormControlLabel
              onClick={(e) => e.stopPropagation()}
              control={
                <Checkbox 
                  size="small" 
                  checked={item.isHygiene} 
                  onChange={(e) => handleToggleChecklistField(category, idx, 'isHygiene', e.target.checked)}
                  sx={{ p: 0.5, color: '#cbd5e1', '&.Mui-checked': { color: '#3b82f6' } }} 
                />
              }
              label={<Typography sx={{ fontSize: '0.85rem', color: '#475569' }}>Hygiene</Typography>}
            />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 80 }} onClick={(e) => e.stopPropagation()}>
            <CopyIcon 
              onClick={() => handleCopyChecklistToClipboard(item)}
              sx={{ color: '#94a3b8', fontSize: '1.2rem', cursor: 'pointer', '&:hover': { color: '#3b82f6', transform: 'scale(1.1)' }, transition: 'all 0.2s' }} 
            />
            <SettingsIcon sx={{ color: '#94a3b8', fontSize: '1.2rem', cursor: 'pointer', '&:hover': { color: '#334155', transform: 'scale(1.1)' }, transition: 'all 0.2s' }} />
            <DeleteIcon 
              onClick={() => handleDeleteChecklist(category, idx)}
              sx={{ color: '#94a3b8', fontSize: '1.2rem', cursor: 'pointer', '&:hover': { color: '#ef4444', transform: 'scale(1.1)' }, transition: 'all 0.2s' }} 
            />
          </Box>
        </Box>
      </Box>
      {isExpanded && item.items && item.items.length > 0 && (
        <ChecklistItemsTable 
          items={item.items} 
          category={category} 
          checklistIdx={idx}
          activeInput={activeInput}
          setActiveInput={setActiveInput}
          handleInputSubmit={handleInputSubmit}
          handleDeleteItem={handleDeleteItem}
          handleCopyItemToClipboard={handleCopyItemToClipboard}
          handleRemoveChoice={handleRemoveChoice}
          handleRemoveProduct={handleRemoveProduct}
        />
      )}
    </Box>
  );
};

export default ChecklistRow;
