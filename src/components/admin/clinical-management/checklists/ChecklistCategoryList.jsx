import { Box, Typography, Divider, Button, TextField, IconButton } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DeleteIcon from '@mui/icons-material/Delete';
import ChecklistRow from './ChecklistRow';

const ChecklistCategoryList = ({
  checklists,
  expandedCategories,
  toggleCategory,
  expandedChecklists,
  toggleChecklist,
  handleIconClick,
  handleToggleChecklistField,
  handleCopyChecklistToClipboard,
  handleDeleteChecklist,
  handleDeleteCategory,
  activeInput,
  setActiveInput,
  handleInputSubmit,
  handleDeleteItem,
  handleCopyItemToClipboard,
  handleRemoveChoice,
  handleRemoveProduct
}) => {
  return (
    <Box sx={{ mt: 3 }}>
      {Object.keys(checklists).map((category, idx) => (
        <Box key={idx} sx={{ 
          mb: 2, 
          backgroundColor: '#fff', 
          border: '1px solid #e2e8f0', 
          borderRadius: 3, 
          overflow: 'hidden',
          boxShadow: expandedCategories.includes(category) ? '0 4px 12px rgba(0,0,0,0.03)' : 'none',
          transition: 'all 0.2s'
        }}>
          <Box 
            onClick={() => toggleCategory(category)}
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              py: 2, 
              px: 3,
              cursor: 'pointer',
              backgroundColor: expandedCategories.includes(category) ? '#f8fafc' : '#fff',
              '&:hover': { backgroundColor: '#f8fafc' },
              transition: 'background-color 0.2s'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
              {expandedCategories.includes(category) ? (
                 <KeyboardArrowDownIcon sx={{ color: '#0f172a', fontSize: '1.5rem' }} />
              ) : (
                 <ChevronRightIcon sx={{ color: '#64748b', fontSize: '1.5rem' }} />
              )}
              <Typography sx={{ color: '#0f172a', fontSize: '1.05rem', fontWeight: 700 }}>
                {category}
              </Typography>
            </Box>
            <IconButton 
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteCategory(category);
              }}
              size="small"
              sx={{ color: '#94a3b8', '&:hover': { color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)' } }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
          
          {expandedCategories.includes(category) && (
            <Box sx={{ backgroundColor: '#fff', borderTop: '1px solid #e2e8f0' }}>
              {checklists[category].length > 0 && (
                <Box sx={{ display: 'flex', backgroundColor: '#fff', py: 1.5, pl: 4, pr: 2, borderBottom: '1px solid #e2e8f0', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', flex: 1, alignItems: 'center', gap: 2 }}>
                    <Box sx={{ width: 22 }} />
                    <Box sx={{ width: 34 }} />
                    <Typography sx={{ flex: 1, fontSize: '0.8rem', fontWeight: 700, color: '#475569', ml: 1, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Checklist Name</Typography>
                    
                    <Typography sx={{ minWidth: 160, fontSize: '0.8rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Short Name</Typography>
                    
                    <Typography sx={{ minWidth: 380, fontSize: '0.8rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Type</Typography>
                    
                    <Box sx={{ minWidth: 80, display: 'flex', justifyContent: 'flex-start' }}>
                      <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Actions</Typography>
                    </Box>
                  </Box>
                </Box>
              )}
              {checklists[category].map((item, itemIdx) => (
                <ChecklistRow 
                  key={itemIdx}
                  item={item}
                  idx={itemIdx}
                  category={category}
                  expandedChecklists={expandedChecklists}
                  toggleChecklist={toggleChecklist}
                  handleIconClick={handleIconClick}
                  handleToggleChecklistField={handleToggleChecklistField}
                  handleCopyChecklistToClipboard={handleCopyChecklistToClipboard}
                  handleDeleteChecklist={handleDeleteChecklist}
                  activeInput={activeInput}
                  setActiveInput={setActiveInput}
                  handleInputSubmit={handleInputSubmit}
                  handleDeleteItem={handleDeleteItem}
                  handleCopyItemToClipboard={handleCopyItemToClipboard}
                  handleRemoveChoice={handleRemoveChoice}
                  handleRemoveProduct={handleRemoveProduct}
                />
              ))}
              <Box sx={{ pl: 6, py: 3, backgroundColor: checklists[category].length > 0 ? '#f8fafc' : '#fff' }}>
                {activeInput?.type === 'checklist' && activeInput.category === category ? (
                  <Box sx={{ mb: 1, maxWidth: 350 }}>
                    <TextField
                      autoFocus
                      size="small"
                      placeholder="Enter checklist name and press Enter"
                      value={activeInput.value}
                      onChange={(e) => setActiveInput({ ...activeInput, value: e.target.value })}
                      onKeyDown={handleInputSubmit}
                      onBlur={() => setActiveInput(null)}
                      sx={{
                        width: 320,
                        '& .MuiOutlinedInput-root': { 
                          borderRadius: 2, 
                          backgroundColor: '#fff',
                          '&.Mui-focused fieldset': {
                            borderColor: '#3b82f6',
                            borderWidth: '2px',
                          }
                        },
                        '& .MuiInputBase-input': { fontSize: '0.9rem', py: 1.1, px: 2 },
                      }}
                    />
                  </Box>
                ) : (
                  <Button
                    variant="outlined"
                    onClick={() => setActiveInput({ type: 'checklist', category, value: '' })}
                    sx={{
                      textTransform: 'none',
                      color: '#3b82f6',
                      borderColor: '#3b82f6',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      borderRadius: 1.5,
                      px: 2,
                      py: 0.8,
                      '&:hover': { backgroundColor: '#eff6ff', borderColor: '#2563eb' }
                    }}
                  >
                    + Add Checklist
                  </Button>
                )}
              </Box>
            </Box>
          )}
        </Box>
      ))}
    </Box>
  );
};

export default ChecklistCategoryList;
