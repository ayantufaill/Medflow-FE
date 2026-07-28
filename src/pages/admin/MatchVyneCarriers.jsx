import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectVyneOfficePayers,
  selectVynePayersList,
  selectVyneMatchedPayers,
  fetchVyneCarriersThunk,
  matchVyneCarrierThunk
} from '../../store/slices/insuranceSlice';

import VynePayersComparison from '../../components/admin/insurance-management/match-vyne-carriers/VynePayersComparison';
import VyneMatchActionButtons from '../../components/admin/insurance-management/match-vyne-carriers/VyneMatchActionButtons';
import VyneMatchedPayersTable from '../../components/admin/insurance-management/match-vyne-carriers/VyneMatchedPayersTable';

const MatchVyneCarriers = () => {
  const dispatch = useDispatch();
  
  const [officeSearch, setOfficeSearch] = useState('');
  const [vyneSearch, setVyneSearch] = useState('');
  const [matchedSearch, setMatchedSearch] = useState('');
  const [isLiveData, setIsLiveData] = useState(false);

  const [selectedOffice, setSelectedOffice] = useState(null);
  const [selectedVyne, setSelectedVyne] = useState(null);
  const [activeButton, setActiveButton] = useState("Match Payer");

  const officePayers = useSelector(selectVyneOfficePayers);
  const vynePayers = useSelector(selectVynePayersList);
  const matchedPayers = useSelector(selectVyneMatchedPayers);

  // Filter logic
  const filteredOfficePayers = officePayers.filter(p => 
    p.name.toLowerCase().includes(officeSearch.toLowerCase()) || 
    p.id.toLowerCase().includes(officeSearch.toLowerCase())
  );

  const filteredVynePayers = vynePayers.filter(p => 
    p.name.toLowerCase().includes(vyneSearch.toLowerCase()) || 
    p.id.toLowerCase().includes(vyneSearch.toLowerCase())
  );

  const filteredMatchedPayers = matchedPayers.filter(p => 
    p.officeName.toLowerCase().includes(matchedSearch.toLowerCase()) || 
    p.vyneName.toLowerCase().includes(matchedSearch.toLowerCase()) ||
    p.officeId.toLowerCase().includes(matchedSearch.toLowerCase()) ||
    p.vyneId.toLowerCase().includes(matchedSearch.toLowerCase())
  );

  useEffect(() => {
    dispatch(fetchVyneCarriersThunk());
  }, [dispatch]);

  const handleMatch = () => {
    if (selectedOffice && selectedVyne) {
      dispatch(matchVyneCarrierThunk({
        officeName: selectedOffice.name,
        vyneName: selectedVyne.name,
        officeId: selectedOffice.id,
        vyneId: selectedVyne.id,
        vyneMasterId: 'MASTER-' + selectedVyne.id
      }));
      setSelectedOffice(null);
      setSelectedVyne(null);
    }
  };

  const getTableTitle = () => {
    if (activeButton === "Match Payer") return "Matched Payers";
    return activeButton;
  };

  return (
    <Box sx={{ p: 4, backgroundColor: '#FBFCFE', borderRadius: '12px', border: '1px solid #E5E9F2', minHeight: '100vh' }}>
      
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
        <Typography sx={{ fontWeight: 700, fontSize: '1.25rem', color: '#1e293b' }}>
          Match Vyne Carriers
        </Typography>
        <FormControlLabel
          control={
            <Checkbox
              size="small"
              checked={isLiveData}
              onChange={(e) => setIsLiveData(e.target.checked)}
              sx={{ p: 0.5, color: '#cbd5e1', '&.Mui-checked': { color: '#2563eb' } }}
            />
          }
          label={<Typography sx={{ fontSize: '0.85rem', color: '#475569', fontWeight: 500 }}>Live data</Typography>}
        />
      </Box>

      <VynePayersComparison 
        officeSearch={officeSearch}
        setOfficeSearch={setOfficeSearch}
        vyneSearch={vyneSearch}
        setVyneSearch={setVyneSearch}
        officePayers={filteredOfficePayers}
        vynePayers={filteredVynePayers}
        selectedOffice={selectedOffice}
        setSelectedOffice={setSelectedOffice}
        selectedVyne={selectedVyne}
        setSelectedVyne={setSelectedVyne}
      />

      <VyneMatchActionButtons 
        onMatch={handleMatch}
        matchDisabled={!selectedOffice || !selectedVyne}
        activeButton={activeButton}
        setActiveButton={setActiveButton}
      />

      <VyneMatchedPayersTable 
        matchedPayers={filteredMatchedPayers}
        matchedSearch={matchedSearch}
        setMatchedSearch={setMatchedSearch}
        title={getTableTitle()}
      />
      
    </Box>
  );
};

export default MatchVyneCarriers;
