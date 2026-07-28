import { useState, useEffect } from 'react';
import { Box, Typography, Breadcrumbs, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectConvertedOldPayers,
  selectConvertedOryxPayers,
  selectConvertedMatchedPayers,
  fetchConvertedCarriersThunk,
  matchConvertedCarrierThunk,
  clearConvertedMatchesThunk
} from '../../store/slices/insuranceSlice';

import PayersComparison from '../../components/admin/insurance-management/match-converted-carriers/PayersComparison';
import MatchActionButtons from '../../components/admin/insurance-management/match-converted-carriers/MatchActionButtons';
import MatchedPayersTable from '../../components/admin/insurance-management/match-converted-carriers/MatchedPayersTable';
import MigratePayerSection from '../../components/admin/insurance-management/match-converted-carriers/MigratePayerSection';

const MatchConvertedCarriers = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [oldSearch, setOldSearch] = useState('');
  const [oryxSearch, setOryxSearch] = useState('');
  const [testRealmUrl, setTestRealmUrl] = useState('https://test.local-ofe.com/fhirservlet/onyx/v1/');

  const oldPayers = useSelector(selectConvertedOldPayers);
  const oryxPayers = useSelector(selectConvertedOryxPayers);
  const matchedPayers = useSelector(selectConvertedMatchedPayers);
  
  const [selectedOld, setSelectedOld] = useState(null);
  const [selectedOryx, setSelectedOryx] = useState(null);
  const [activeButton, setActiveButton] = useState("Match Payer");

  useEffect(() => {
    dispatch(fetchConvertedCarriersThunk());
  }, [dispatch]);

  const handleMatch = () => {
    if (selectedOld && selectedOryx) {
      dispatch(matchConvertedCarrierThunk({
        oldName: selectedOld.name,
        oryxName: selectedOryx.name,
        oldId: selectedOld.id,
        oryxId: selectedOryx.id
      }));
      setSelectedOld(null);
      setSelectedOryx(null);
    }
  };

  const handleClear = () => {
    dispatch(clearConvertedMatchesThunk());
  };

  // Compute table title based on active button
  const getTableTitle = () => {
    if (activeButton === "Match Payer") return "Matched Payers";
    if (activeButton === "Set Insurance Payer Code") return "Insurance Payer Codes";
    return activeButton;
  };

  return (
    <Box sx={{ p: 4, backgroundColor: '#FBFCFE', borderRadius: '12px', border: '1px solid #E5E9F2', minHeight: '100vh' }}>
      
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography sx={{ fontWeight: 700, fontSize: '1.25rem', color: '#1e293b' }}>
          Match Converted Carriers
        </Typography>
      </Box>

      <PayersComparison 
        oldSearch={oldSearch}
        setOldSearch={setOldSearch}
        oryxSearch={oryxSearch}
        setOryxSearch={setOryxSearch}
        oldPayers={oldPayers}
        oryxPayers={oryxPayers}
        selectedOld={selectedOld}
        setSelectedOld={setSelectedOld}
        selectedOryx={selectedOryx}
        setSelectedOryx={setSelectedOryx}
      />

      <MatchActionButtons 
        onMatch={handleMatch}
        matchDisabled={!selectedOld || !selectedOryx}
        activeButton={activeButton}
        setActiveButton={setActiveButton}
      />

      <MatchedPayersTable 
        matchedPayers={matchedPayers}
        onClear={handleClear}
        title={getTableTitle()}
      />

      <MigratePayerSection 
        testRealmUrl={testRealmUrl}
        setTestRealmUrl={setTestRealmUrl}
      />

    </Box>
  );
};

export default MatchConvertedCarriers;
