import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
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
} from '@mui/material';
import { HelpOutline as HelpOutlineIcon } from '@mui/icons-material';
import FeeGuideDetailHeader from '../../components/admin/feeguides/FeeGuideDetailHeader';
import CategoryRow from '../../components/admin/feeguides/CategoryRow';
import RoundFeeGuideDialog from '../../components/admin/feeguides/RoundFeeGuideDialog';
import SetProviderFeeGuideDialog from '../../components/admin/feeguides/SetProviderFeeGuideDialog';
import UploadFeeGuideDialog from '../../components/admin/feeguides/UploadFeeGuideDialog';

const FeeGuideDetail = () => {
  const { id } = useParams();
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
    <Box sx={{ p: 0 }}>
      <FeeGuideDetailHeader 
        feeGuideName={feeGuideName} 
        onSetProvider={() => setSetProviderOpen(true)}
        onRoundUp={() => setRoundDialogOpen(true)}
        onUpload={() => setUploadDialogOpen(true)}
      />

      {/* Search Bar Section */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Typography variant="body2" sx={{ color: '#4b71a1', fontWeight: 600, textDecoration: 'underline' }}>Search for Code</Typography>
        <TextField
          size="small"
          placeholder="Enter code or procedure"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ 
            width: 200,
            '& .MuiInputBase-root': { 
              fontSize: '0.85rem',
              borderBottom: '1px solid #e0e0e0',
              borderRadius: 0,
            },
            '& .MuiOutlinedInput-notchedOutline': { border: 'none' }
          }}
        />
      </Box>

      {/* Main Table */}
      <TableContainer sx={{ border: '1px solid #e0e0e0' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: '#1a3a6b' }}>
              <TableCell sx={{ color: 'white', fontWeight: 600, fontSize: '0.9rem', width: '15%', whiteSpace: 'nowrap' }}>Type</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600, fontSize: '0.9rem', width: '15%', whiteSpace: 'nowrap' }}>Group</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600, fontSize: '0.9rem', width: '10%', whiteSpace: 'nowrap' }}>Code</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600, fontSize: '0.9rem', width: '20%', whiteSpace: 'nowrap' }}>Procedure Name</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600, fontSize: '0.9rem', width: '20%', whiteSpace: 'nowrap' }}>Description</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600, fontSize: '0.9rem', width: '10%', whiteSpace: 'nowrap' }}>Fee</TableCell>
              <TableCell align="center" sx={{ color: 'white', fontWeight: 600, fontSize: '0.9rem', width: '10%', whiteSpace: 'nowrap' }}>
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
