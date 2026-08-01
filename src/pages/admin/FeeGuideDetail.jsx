import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchFeeGuideDetails,
  updateProcedureFee,
  roundFeeGuideFees,
  selectFeeGuideDetails,
  selectFeeGuides,
  fetchFeeGuides,
  selectFeeGuideDetailsLoading
} from '../../store/slices/feeGuideSlice';
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
  InputAdornment,
  IconButton,
} from '@mui/material';
import { HelpOutline as HelpOutlineIcon, ArrowBack as ArrowBackIcon, Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';
import FeeGuideDetailHeader from '../../components/admin/feeguides/FeeGuideDetailHeader';
import CategoryRow from '../../components/admin/feeguides/CategoryRow';
import RoundFeeGuideDialog from '../../components/admin/feeguides/RoundFeeGuideDialog';
import SetProviderFeeGuideDialog from '../../components/admin/feeguides/SetProviderFeeGuideDialog';
import UploadFeeGuideDialog from '../../components/admin/feeguides/UploadFeeGuideDialog';

const FeeGuideDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expandedCategories, setExpandedCategories] = useState([]);
  const [expandedGroups, setExpandedGroups] = useState([]);
  const [roundDialogOpen, setRoundDialogOpen] = useState(false);
  const [setProviderOpen, setSetProviderOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const dispatch = useDispatch();

  const backendData = useSelector(selectFeeGuideDetails);
  const loading = useSelector(selectFeeGuideDetailsLoading);
  const feeGuides = useSelector(selectFeeGuides);

  const currentGuide = feeGuides.find(g =>
    g._id === id ||
    g.id === id ||
    (g.FeeSchedNum && g.FeeSchedNum.toString() === id)
  );

  const feeGuideName = currentGuide?.description || currentGuide?.Description || currentGuide?.name || "Fee Guide";

  useEffect(() => {
    if (feeGuides.length === 0) {
      dispatch(fetchFeeGuides());
    }
    // Fetch all fees without pagination since we want client side group/search
    dispatch(fetchFeeGuideDetails({ id, params: { limit: 1000 } }));
  }, [id, dispatch, feeGuides.length]);

  const categoryData = useMemo(() => {
    const cats = {};
    backendData.forEach(proc => {
      const catName = proc.category || 'Uncategorized';
      if (!cats[catName]) {
        cats[catName] = {
          name: catName,
          groups: [{ name: 'All Procedures', procedures: [] }]
        };
      }
      cats[catName].groups[0].procedures.push({
        code: proc.code,
        name: proc.name,
        description: proc.name, // The backend doesn't give a long description, so use name
        fee: proc.fee !== null ? `$${proc.fee.toFixed(2)}` : '$0.00'
      });
    });
    return Object.values(cats).sort((a, b) => a.name.localeCompare(b.name));
  }, [backendData]);

  // Removed hardcoded mock data

  const toggleCategory = (name) => {
    setExpandedCategories(prev =>
      prev.includes(name) ? prev.filter(c => c !== name) : [...prev, name]
    );
  };

  const toggleGroup = (name) => {
    setExpandedGroups(prev =>
      prev.includes(name) ? prev.filter(g => g !== name) : [...prev, name]
    );
  };

  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = categoryData.map(cat => {
    const filteredGroups = cat.groups.map(group => {
      const filteredProcedures = group.procedures.filter(proc =>
        proc.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proc.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (filteredProcedures.length > 0) {
        return { ...group, procedures: filteredProcedures };
      }
      return null;
    }).filter(g => g !== null);

    if (filteredGroups.length > 0 || cat.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return { ...cat, groups: filteredGroups };
    }
    return null;
  }).filter(c => c !== null);

  const displayData = searchQuery ? filteredData : categoryData;

  // Auto-expand on search
  React.useEffect(() => {
    if (searchQuery) {
      const allCatNames = filteredData.map(c => c.name);
      const allGroupKeys = filteredData.flatMap(c => c.groups.map(g => `${c.name}-${g.name}`));
      setExpandedCategories(allCatNames);
      setExpandedGroups(allGroupKeys);
    }
  }, [searchQuery]);

  return (
    <Box sx={{ p: 4, backgroundColor: '#FBFCFE', borderRadius: '12px', border: '1px solid #E5E9F2', minHeight: '100vh' }}>
      <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={() => navigate(-1)} 
        sx={{ mb: 3, color: '#64748b', textTransform: 'none', fontWeight: 600, '&:hover': { backgroundColor: '#f1f5f9' } }}
      >
        Back to Fee Guides
      </Button>
      <FeeGuideDetailHeader
        feeGuideName={feeGuideName}
        onSetProvider={() => setSetProviderOpen(true)}
        onRoundUp={() => setRoundDialogOpen(true)}
        onUpload={() => setUploadDialogOpen(true)}
      />

      {/* Search Bar Section */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>

        <TextField
          size="small"
          placeholder="Search for code or procedure..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            width: 300,
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              backgroundColor: '#fff',
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#94a3b8', fontSize: 20 }} />
              </InputAdornment>
            ),
            endAdornment: searchQuery ? (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setSearchQuery('')} edge="end">
                  <ClearIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </InputAdornment>
            ) : null,
          }}
        />
      </Box>

      {/* Main Table */}
      <TableContainer sx={{ border: '1px solid #e2e8f0', borderRadius: 2, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#F8FAFC' }}>
              <TableCell sx={{ color: '#475569', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '2px solid #e2e8f0 !important', width: '15%', whiteSpace: 'nowrap' }}>Type</TableCell>
              <TableCell sx={{ color: '#475569', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '2px solid #e2e8f0 !important', width: '15%', whiteSpace: 'nowrap' }}>Group</TableCell>
              <TableCell sx={{ color: '#475569', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '2px solid #e2e8f0 !important', width: '10%', whiteSpace: 'nowrap' }}>Code</TableCell>
              <TableCell sx={{ color: '#475569', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '2px solid #e2e8f0 !important', width: '20%', whiteSpace: 'nowrap' }}>Procedure Name</TableCell>
              <TableCell sx={{ color: '#475569', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '2px solid #e2e8f0 !important', width: '20%', whiteSpace: 'nowrap' }}>Description</TableCell>
              <TableCell sx={{ color: '#475569', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '2px solid #e2e8f0 !important', width: '10%', whiteSpace: 'nowrap' }}>Fee</TableCell>
              <TableCell align="center" sx={{ color: '#475569', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '2px solid #e2e8f0 !important', width: '10%', whiteSpace: 'nowrap' }}>
                Change fee by % <HelpOutlineIcon sx={{ fontSize: '0.85rem', verticalAlign: 'middle', ml: 0.5 }} />
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mt: 0.5, fontSize: '0.75rem' }}>
                  <span>(-/+)</span>
                  <span>%</span>
                </Box>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} sx={{ textAlign: 'center', py: 4 }}>Loading procedures...</TableCell>
              </TableRow>
            ) : displayData.map((cat, index) => (
              <CategoryRow
                key={index}
                cat={cat}
                expandedCategories={expandedCategories}
                toggleCategory={toggleCategory}
                expandedGroups={expandedGroups}
                toggleGroup={toggleGroup}
                feeGuideId={id}
                dispatch={dispatch}
                updateProcedureFee={updateProcedureFee}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialogs */}
      <RoundFeeGuideDialog
        open={roundDialogOpen}
        onClose={() => setRoundDialogOpen(false)}
        onSave={(val) => {
          const numericVal = parseFloat(val);
          if (!isNaN(numericVal)) {
            dispatch(roundFeeGuideFees({ id, toNearest: numericVal })).then(() => {
              dispatch(fetchFeeGuideDetails({ id, params: { limit: 1000 } }));
            });
          }
          setRoundDialogOpen(false);
        }}
      />
      <SetProviderFeeGuideDialog
        open={setProviderOpen}
        onClose={() => setSetProviderOpen(false)}
        onSave={(name) => {
          console.log('Setting provider:', name);
          setSetProviderOpen(false);
        }}
      />
      <UploadFeeGuideDialog
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        onUpload={(file) => {
          console.log('Uploading file:', file);
          setUploadDialogOpen(false);
        }}
      />
    </Box>
  );
};

export default FeeGuideDetail;
