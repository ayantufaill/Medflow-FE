import { useState } from 'react';
import { Box } from '@mui/material';
import LeftPanelTabs from './LeftPanelTabs';
import PatientSearch from './PatientSearch';
import PatientCard from './PatientCard';
import PatientActions from './PatientActions';
import { usePatient } from '../../../hooks/redux';
import { COLORS } from '../../../constants/colors';

// LeftPanel orchestrates the left-rail of the schedule page.
// - PatientSearch is always visible — it lets the user search and select a patient.
// - PatientCard and PatientActions only mount after a patient is selected so
//   they never render in an empty/null state.

const LeftPanel = () => {
  const [activeTab, setActiveTab] = useState('Patient');

  // Read currentPatient from Redux to conditionally show patient sub-components.
  const { currentPatient } = usePatient();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', overflow: 'hidden' }}>

      {/* Sticky tab strip */}
      <Box sx={{ position: 'sticky', top: 0, zIndex: 2, backgroundColor: COLORS.SURFACE_CARD, flexShrink: 0 }}>
        <LeftPanelTabs activeTab={activeTab} onChange={setActiveTab} />
      </Box>

      {/* Scrollable panel body */}
      <Box sx={{ flex: 1, overflowY: 'auto', p: '12px', backgroundColor: COLORS.SURFACE_CARD }}>
        {activeTab === 'Patient' && (
          <>
            {/* Search is always shown — the user must be able to search before a patient is selected */}
            <PatientSearch />

            {/* Card and actions render only once a patient has been selected from search.
                key forces a full remount when the selected patient changes so stale
                data never bleeds through from a previous patient's render. */}
            {currentPatient && (
              <>
                <PatientCard key={currentPatient._id || currentPatient.id} />
                <PatientActions key={`actions-${currentPatient._id || currentPatient.id}`} />
              </>
            )}
          </>
        )}
      </Box>

    </Box>
  );
};

export default LeftPanel;
