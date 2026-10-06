import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';

import NumberSelectionWizard from '../../components/admin/patient-communication/messaging-services/number-selection/NumberSelectionWizard';
import { messagingApi } from '../../components/admin/patient-communication/emailMessagingApi';
import { EMAIL_MESSAGING_PATHS } from '../../components/admin/patient-communication/emailMessagingPaths';

const MESSAGING_SERVICES_PATH = EMAIL_MESSAGING_PATHS.messagingServices;

/**
 * Standalone route for the messaging-number wizard, reachable from the
 * Patient Communication menu or from "Edit" on Messaging Services. Hands the
 * result back to Messaging Services through router state.
 */
const NumberSelection = () => {
  const navigate = useNavigate();
  const [currentNumber, setCurrentNumber] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    messagingApi
      .getMessagingService()
      .then((data) => setCurrentNumber(data.phoneNumber))
      .catch(() => setCurrentNumber(null))
      .finally(() => setReady(true));
  }, []);

  return (
    <Box sx={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E9F2', overflow: 'hidden' }}>
      {ready ? (
        <NumberSelectionWizard
          api={messagingApi}
          currentNumber={currentNumber}
          onClose={() => navigate(MESSAGING_SERVICES_PATH)}
          onComplete={(result) => navigate(MESSAGING_SERVICES_PATH, { state: { numberSelected: result.phoneNumber } })}
        />
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
};

export default NumberSelection;
