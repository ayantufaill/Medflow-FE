import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Sync as SyncIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';

// Sub-components
import PlansDialog from '../../components/admin/feeguides/PlansDialog';
import ClearManualFeeGuideDialog from '../../components/admin/feeguides/ClearManualFeeGuideDialog';
import ClearLockedFeeDialog from '../../components/admin/feeguides/ClearLockedFeeDialog';
import CopyFeeGuideDialog from '../../components/admin/feeguides/CopyFeeGuideDialog';
import EmptyFeeGuideDialog from '../../components/admin/feeguides/EmptyFeeGuideDialog';
import ReestimateDialog from '../../components/admin/feeguides/ReestimateDialog';
import EditFeeGuideDialog from '../../components/admin/feeguides/EditFeeGuideDialog';
import AuditHistoryDialog from '../../components/admin/feeguides/AuditHistoryDialog';
import { feeService } from '../../services/fee.service';

const FeeGuides = () => {
  const navigate = useNavigate();
  const [plansDialogOpen, setPlansDialogOpen] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [lockedFeesDialogOpen, setLockedFeesDialogOpen] = useState(false);
  const [addMenuAnchor, setAddMenuAnchor] = useState(null);
  const [copyDialogOpen, setCopyDialogOpen] = useState(false);
  const [emptyDialogOpen, setEmptyDialogOpen] = useState(false);
  const [reestimateDialogOpen, setReestimateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [auditDialogOpen, setAuditDialogOpen] = useState(false);
  const [selectedFeeGuide, setSelectedFeeGuide] = useState('');

  const [feeGuidesData, setFeeGuidesData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFeeGuides();
  }, []);

  const fetchFeeGuides = async () => {
    try {
      setLoading(true);
      const data = await feeService.getFeeSchedules();
      const mappedData = data.map(fs => ({
        id: fs.FeeSchedNum.toString(),
        name: fs.Description,
        default: fs.FeeSchedType === 0 ? 'Yes' : 'No', // Simplified logic
        defaultProvider: '',
        plans: 0 // Mocked for now
      }));
      setFeeGuidesData(mappedData);
    } catch (error) {
      console.error('Failed to fetch fee guides:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenPlans = (name) => {
    setSelectedFeeGuide(name.toUpperCase());
    setPlansDialogOpen(true);
  };

  const tanButtonStyle = {
    backgroundColor: '#d9a366',
    color: 'white',
    textTransform: 'none',
    fontSize: '0.8rem',
    fontWeight: 500,
    px: 2,
    '&:hover': {
      backgroundColor: '#c08d50',
    },
    whiteSpace: 'nowrap',
  };

  const actionLinkStyle = {
    color: '#4b71a1',
    fontSize: '0.8rem',
    textDecoration: 'none',
    fontWeight: 500,
    '&:hover': {
      textDecoration: 'underline',
    },
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 0.5,
  };

  return (
    <Box sx={{ p: 0 }}>
      {/* Breadcrumb & Top Sync */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Link to="/admin/finance-management" style={{ textDecoration: 'none', color: '#4b71a1' }}>Finance Management</Link> &gt; Fee Guides
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography sx={actionLinkStyle}>
            <SyncIcon fontSize="small" /> Sync
          </Typography>
        </Box>
      </Box>

      {/* Action Bar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button variant="contained" sx={tanButtonStyle} onClick={() => setReestimateDialogOpen(true)}>Re-estimate Tplans</Button>
          <Button variant="contained" sx={tanButtonStyle} onClick={() => setLockedFeesDialogOpen(true)}>Clear Locked Fees</Button>
          <Button variant="contained" sx={tanButtonStyle} onClick={() => setResetDialogOpen(true)}>Reset Treatment Plans to Default Fee Guide</Button>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <TextField
            size="small"
            placeholder="search"
            sx={{ 
              width: 250,
              '& .MuiInputBase-root': { bgcolor: '#f5f5f5', borderRadius: 1 },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e0e0e0' }
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
          <Typography 
            sx={{ ...actionLinkStyle, fontWeight: 600 }}
            onClick={(e) => setAddMenuAnchor(e.currentTarget)}
          >
            Add Fee Guide <AddIcon fontSize="small" />
          </Typography>
          <Menu
            anchorEl={addMenuAnchor}
            open={Boolean(addMenuAnchor)}
            onClose={() => setAddMenuAnchor(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem onClick={() => { setAddMenuAnchor(null); setCopyDialogOpen(true); }} sx={{ fontSize: '0.875rem' }}>
              Copy from existing
            </MenuItem>
            <MenuItem onClick={() => { setAddMenuAnchor(null); setEmptyDialogOpen(true); }} sx={{ fontSize: '0.875rem' }}>
              Empty Fee Guide
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      {/* Table */}
      <TableContainer sx={{ border: '1px solid #e0e0e0', borderRadius: 1, overflow: 'hidden' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: '#1a3a6b' }}>
              <TableCell sx={{ color: 'white', fontWeight: 600, py: 1.5 }}>Name</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600, py: 1.5 }}>Default</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600, py: 1.5 }}>Default Provider</TableCell>
              <TableCell align="right" sx={{ color: 'white', fontWeight: 600, py: 1.5 }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {feeGuidesData.map((row) => (
              <TableRow 
                key={row.id} 
                sx={{ '&:hover': { bgcolor: '#f9fafb' }, cursor: 'pointer' }}
                onClick={() => navigate(`/admin/finance-management/fee-guide/${row.id}`)}
              >
                <TableCell sx={{ py: 1, fontWeight: 500, color: '#333' }}>{row.name}</TableCell>
                <TableCell sx={{ py: 1, color: '#666' }}>{row.default}</TableCell>
                <TableCell sx={{ py: 1, color: '#666' }}>{row.defaultProvider}</TableCell>
                <TableCell align="right" sx={{ py: 1 }} onClick={(e) => e.stopPropagation()}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1.5 }}>
                    <Typography sx={actionLinkStyle}>Export as CSV</Typography>
                    <Typography sx={actionLinkStyle}><SyncIcon sx={{ fontSize: '1rem' }} /> Sync</Typography>
                    <IconButton size="small" sx={{ color: '#ccc' }}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                    <Typography sx={actionLinkStyle} onClick={() => { setSelectedFeeGuide(row.name); setEditDialogOpen(true); }}>Edit</Typography>
                    <IconButton size="small" sx={{ color: '#4b71a1' }}>
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                    <Typography sx={actionLinkStyle} onClick={() => handleOpenPlans(row.name)}>{row.plans} Plan(s)</Typography>
                    <IconButton size="small" sx={{ color: '#4b71a1' }} onClick={() => setAuditDialogOpen(true)}>
                      <DescriptionIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Extracted Dialogs */}
      <PlansDialog 
        open={plansDialogOpen} 
        onClose={() => setPlansDialogOpen(false)} 
        selectedFeeGuide={selectedFeeGuide} 
      />
      <ClearManualFeeGuideDialog 
        open={resetDialogOpen} 
        onClose={() => setResetDialogOpen(false)} 
      />
      <ClearLockedFeeDialog 
        open={lockedFeesDialogOpen} 
        onClose={() => setLockedFeesDialogOpen(false)} 
      />
      <CopyFeeGuideDialog 
        open={copyDialogOpen} 
        onClose={() => setCopyDialogOpen(false)} 
        feeGuidesData={feeGuidesData}
      />
      <EmptyFeeGuideDialog 
        open={emptyDialogOpen} 
        onClose={() => setEmptyDialogOpen(false)} 
      />
      <ReestimateDialog 
        open={reestimateDialogOpen} 
        onClose={() => setReestimateDialogOpen(false)} 
      />
      <EditFeeGuideDialog 
        open={editDialogOpen} 
        onClose={() => setEditDialogOpen(false)} 
        selectedFeeGuide={selectedFeeGuide}
        setSelectedFeeGuide={setSelectedFeeGuide}
      />
      <AuditHistoryDialog 
        open={auditDialogOpen} 
        onClose={() => setAuditDialogOpen(false)} 
      />
    </Box>
  );
};

export default FeeGuides;
