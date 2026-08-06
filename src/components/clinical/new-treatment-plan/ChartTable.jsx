import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectProviderDropdownList } from '../../../store/slices/providerSlice';
import {
  Box,
  Paper,
  Typography,
  MenuItem,
  IconButton,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  Button,
  Divider,
  Menu,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  KeyboardArrowDown as ExpandMoreIcon,
  ScienceOutlined as ScienceIcon,
  AssignmentOutlined as AssignmentIcon,
  DownloadOutlined as DownloadIcon,
  TuneOutlined as FilterIcon,
  UnfoldMoreOutlined as SortIcon,
  MoreVert as MoreVertIcon,
  EditOutlined as EditIcon,
  DeleteOutlined as DeleteIcon
} from '@mui/icons-material';
import ChartFiltersDrawer from './ChartFiltersDrawer';

const ChartTable = ({ treatmentPlans, onUpdateItemStatus }) => {
  const providersList = useSelector(selectProviderDropdownList) || [];
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [activeRowId, setActiveRowId] = useState(null);
  const [activeFilters, setActiveFilters] = useState({ 
    type: 'All Types', 
    toothState: 'All Tooth States', 
    teeth: [], 
    regions: [],
    columns: { icd: true, provider: true, created: true, completed: true, lab: true, comments: true }
  });

  const handleApplyFilters = (filters) => {
    setActiveFilters(filters);
  };

  const filteredPlans = treatmentPlans.filter(row => {
    // Filter by Type
    if (activeFilters.type !== 'All Types' && activeFilters.type !== 'Procedure') return false; 
    
    // Filter by Tooth State
    if (activeFilters.toothState !== 'All Tooth States') return false; 

    // Filter by Site (teeth)
    if (activeFilters.teeth && activeFilters.teeth.length > 0) {
      if (!row.site) return false;
      const siteStr = row.site.toUpperCase();
      
      const primaryMap = { 4:'A', 5:'B', 6:'C', 7:'D', 8:'E', 9:'F', 10:'G', 11:'H', 12:'I', 13:'J', 20:'K', 21:'L', 22:'M', 23:'N', 24:'O', 25:'P', 26:'Q', 27:'R', 28:'S', 29:'T' };
      
      const hasMatch = activeFilters.teeth.some(tooth => {
        if (tooth === 'Supernumerary') return siteStr.includes('SUPERNUMERARY');
        const pLabel = primaryMap[tooth];
        const toothRegex = new RegExp(`\\b${tooth}\\b`);
        const labelRegex = pLabel ? new RegExp(`\\b${pLabel}\\b`) : null;
        return toothRegex.test(siteStr) || (labelRegex && labelRegex.test(siteStr));
      });
      
      if (!hasMatch) return false;
    }
    
    return true;
  });

  const handleMenuOpen = (event, id) => {
    setMenuAnchorEl(event.currentTarget);
    setActiveRowId(id);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setActiveRowId(null);
  };

  const handleEdit = () => {
    handleMenuClose();
    // Logic for editing procedure could go here
  };

  const handleDelete = () => {
    handleMenuClose();
    // Logic for deleting procedure could go here
  };

  const getProviderName = (providerId) => {
    if (!providerId) return '-';
    if (providerId === 'CB') return 'CB'; 
    const provider = providersList.find(p => p._id === providerId || p.providerCode === providerId);
    if (!provider) return providerId;
    
    const first = provider.userId?.firstName || provider.firstName || provider.FName || '';
    const last = provider.userId?.lastName || provider.lastName || provider.LName || '';
    
    if (first || last) {
      return `${first.charAt(0).toUpperCase()}${last.charAt(0).toUpperCase()}`;
    }
    return provider.providerCode || provider._id || 'Unknown';
  };

  const getStatusStyles = (status) => {
    const s = status?.toLowerCase() || '';
    if (s === 'scheduled' || s === 'rejected') {
      return { bgcolor: '#fecaca', color: '#b91c1c' };
    }
    if (s === 'completed') {
      return { bgcolor: '#bbf7d0', color: '#15803d' };
    }
    if (s === 'unplanned') {
      return { bgcolor: '#fef3c7', color: '#b45309' };
    }
    return { bgcolor: '#f1f5f9', color: '#475569' };
  };

  return (
    <Paper elevation={0} sx={{ borderRadius: '8px', border: 'none', mt: 1 }}>
      {/* Table Toolbar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, px: 2, pt: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton size="small" sx={{ border: 'none', color: '#64748b' }}>
            <DownloadIcon fontSize="small" />
          </IconButton>
          
          <Divider orientation="vertical" flexItem sx={{ height: 24, alignSelf: 'center', borderColor: '#e2e8f0' }} />
          
          <Box sx={{ bgcolor: '#f1f5f9', px: 1.5, py: 0.5, borderRadius: 1 }}>
            <Typography variant="body2" sx={{ color: '#475569', fontWeight: 500 }}>
              {filteredPlans?.length || 0} results
            </Typography>
          </Box>
        </Box>
        <Button 
          variant="outlined" 
          endIcon={<FilterIcon />}
          onClick={() => setIsDrawerOpen(true)}
          sx={{ 
            textTransform: 'none', 
            borderColor: '#e2e8f0', 
            color: '#1e293b',
            borderRadius: '6px',
            px: 2,
            py: 0.5,
            fontWeight: 500
          }}
        >
          Filters
        </Button>
      </Box>

      {/* Table */}
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ borderBottom: '2px solid #f1f5f9' }}>
              <TableCell sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#0f172a', borderBottom: 'none', minWidth: '120px' }}>Type</TableCell>
              <TableCell sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#0f172a', borderBottom: 'none' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  Status
                  <SortIcon sx={{ fontSize: '1rem', color: '#cbd5e1' }} />
                </Box>
              </TableCell>
              <TableCell sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#0f172a', borderBottom: 'none' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  Site
                  <SortIcon sx={{ fontSize: '1rem', color: '#cbd5e1' }} />
                </Box>
              </TableCell>
              <TableCell sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#0f172a', borderBottom: 'none' }}>Code</TableCell>
              <TableCell sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#0f172a', borderBottom: 'none' }}>Description</TableCell>
              {activeFilters.columns?.icd !== false && <TableCell sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#0f172a', borderBottom: 'none' }}>ICD</TableCell>}
              {activeFilters.columns?.provider !== false && <TableCell sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#0f172a', borderBottom: 'none' }}>Provider</TableCell>}
              {activeFilters.columns?.created !== false && (
                <TableCell sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#0f172a', borderBottom: 'none' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    Created
                    <SortIcon sx={{ fontSize: '1rem', color: '#cbd5e1' }} />
                  </Box>
                </TableCell>
              )}
              {activeFilters.columns?.completed !== false && (
                <TableCell sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#0f172a', borderBottom: 'none' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    Completed
                    <SortIcon sx={{ fontSize: '1rem', color: '#cbd5e1' }} />
                  </Box>
                </TableCell>
              )}
              {activeFilters.columns?.lab !== false && (
                <TableCell sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#0f172a', borderBottom: 'none', textAlign: 'center' }}>
                  <ScienceIcon sx={{ fontSize: '1.2rem', color: '#475569' }} />
                </TableCell>
              )}
              {activeFilters.columns?.comments !== false && <TableCell sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#0f172a', borderBottom: 'none' }}>Comments</TableCell>}
              <TableCell align="right" sx={{ borderBottom: 'none' }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPlans.map((row) => (
              <TableRow key={row.id} hover sx={{ '& td': { borderBottom: '1px solid #f1f5f9' } }}>
                <TableCell sx={{ fontSize: '0.85rem', color: '#475569' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AssignmentIcon sx={{ fontSize: '1.1rem', color: '#64748b' }} />
                    Procedure
                  </Box>
                </TableCell>
                <TableCell sx={{ fontSize: '0.85rem' }}>
                  <Box 
                    sx={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      bgcolor: getStatusStyles(row.status).bgcolor, 
                      color: getStatusStyles(row.status).color,
                      borderRadius: '4px',
                      pl: 1,
                      pr: 0.5,
                      py: 0.25,
                      fontWeight: 500
                    }}
                  >
                    <Select
                      value={row.status}
                      onChange={(e) => onUpdateItemStatus && onUpdateItemStatus(row.id, e.target.value)}
                      variant="standard"
                      disableUnderline
                      IconComponent={() => <ExpandMoreIcon sx={{ fontSize: '1rem', color: 'inherit', ml: 0.5 }} />}
                      sx={{ 
                        fontSize: '0.8rem', 
                        color: 'inherit',
                        fontWeight: 'inherit',
                        '& .MuiSelect-select': { py: 0, px: 0, display: 'flex', alignItems: 'center' },
                      }}
                    >
                      <MenuItem value="Unplanned" sx={{ fontSize: '0.8rem' }}>Unplanned</MenuItem>
                      <MenuItem value="Rejected" sx={{ fontSize: '0.8rem' }}>Rejected</MenuItem>
                      <MenuItem value="Existing Current" sx={{ fontSize: '0.8rem' }}>Existing Current</MenuItem>
                      <MenuItem value="Existing Other" sx={{ fontSize: '0.8rem' }}>Existing Other</MenuItem>
                      <MenuItem value="Referred" sx={{ fontSize: '0.8rem' }}>Referred</MenuItem>
                    </Select>
                  </Box>
                </TableCell>
                <TableCell sx={{ fontSize: '0.85rem', color: '#475569' }}>{row.site}</TableCell>
                <TableCell sx={{ fontSize: '0.85rem', color: '#475569' }}>{row.code}</TableCell>
                <TableCell sx={{ fontSize: '0.85rem', color: '#475569' }}>{row.description}</TableCell>
                {activeFilters.columns?.icd !== false && <TableCell sx={{ fontSize: '0.85rem', color: '#475569' }}>{row.icd}</TableCell>}
                {activeFilters.columns?.provider !== false && (
                  <TableCell sx={{ fontSize: '0.85rem', color: '#475569' }}>
                    <Box sx={{ bgcolor: '#f1f5f9', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 600 }}>
                      {getProviderName(row.provider)}
                    </Box>
                  </TableCell>
                )}
                {activeFilters.columns?.created !== false && <TableCell sx={{ fontSize: '0.85rem', color: '#475569' }}>{row.created}</TableCell>}
                {activeFilters.columns?.completed !== false && <TableCell sx={{ fontSize: '0.85rem', color: '#3b82f6' }}>{row.scheduled || '-'}</TableCell>}
                {activeFilters.columns?.lab !== false && (
                  <TableCell sx={{ fontSize: '0.85rem', color: '#475569', textAlign: 'center' }}>
                    {row.labCase === '+' ? (
                      <Box sx={{ width: 18, height: 18, borderRadius: '50%', border: '1px solid #475569', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', margin: '0 auto' }}>+</Box>
                    ) : '-'}
                  </TableCell>
                )}
                {activeFilters.columns?.comments !== false && <TableCell sx={{ fontSize: '0.85rem', color: '#475569' }}>-</TableCell>}
                <TableCell align="right">
                  <IconButton size="small" onClick={(e) => handleMenuOpen(e, row.id)}>
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Row Action Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          elevation: 3,
          sx: { minWidth: 180, borderRadius: 2, mt: 0.5 }
        }}
      >
        <MenuItem onClick={handleEdit} sx={{ fontSize: '0.85rem' }}>
          <ListItemIcon>
            <EditIcon fontSize="small" sx={{ color: '#64748b' }} />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: 500 }}>Edit Procedure</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ fontSize: '0.85rem', color: '#ef4444' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" sx={{ color: '#ef4444' }} />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: 500 }}>Delete Procedure</ListItemText>
        </MenuItem>
      </Menu>

      {/* Filters Drawer */}
      <ChartFiltersDrawer 
        open={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        onApply={handleApplyFilters}
      />
    </Paper>
  );
};

export default ChartTable;
