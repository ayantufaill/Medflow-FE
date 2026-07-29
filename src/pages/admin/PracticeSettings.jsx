import { useState, useRef, useEffect, createContext, useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import AI from '../../components/admin/practice-setup/practice-settings/AI';
import AgingReport from '../../components/admin/practice-setup/practice-settings/AgingReport';
import AutomatedWorkflows from '../../components/admin/practice-setup/practice-settings/AutomatedWorkflows';
import ClaimManagement from '../../components/admin/practice-setup/practice-settings/ClaimManagement';
import Communication from '../../components/admin/practice-setup/practice-settings/Communication';
import ExamPageItems from '../../components/admin/practice-setup/practice-settings/ExamPageItems';
import General from '../../components/admin/practice-setup/practice-settings/General';
import ImagingSettings from '../../components/admin/practice-setup/practice-settings/ImagingSettings';
import Insurance from '../../components/admin/practice-setup/practice-settings/Insurance';
import MenuItems from '../../components/admin/practice-setup/practice-settings/MenuItems';
import PatientConfidentialInfo from '../../components/admin/practice-setup/practice-settings/PatientConfidentialInfo';
import Reports from '../../components/admin/practice-setup/practice-settings/Reports';
import Templates from '../../components/admin/practice-setup/practice-settings/Templates';
import TextEditors from '../../components/admin/practice-setup/practice-settings/TextEditors';
import TimeClock from '../../components/admin/practice-setup/practice-settings/TimeClock';
import TreatmentPlanPage from '../../components/admin/practice-setup/practice-settings/TreatmentPlanPage';
import TreatmentPrintoutForm from '../../components/admin/practice-setup/practice-settings/TreatmentPrintoutForm';
import { SettingsContext } from '../../components/admin/practice-setup/practice-settings/SharedSettings';

import {
  fetchCurrentPracticeInfo,
  createPracticeInfo,
  updatePracticeSettings,
  selectPracticeInfo,
} from '../../store/slices/practiceInfoSlice';
import { useSnackbar } from '../../contexts/SnackbarContext';
import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  Switch,
  TextField,
  Divider,
  InputAdornment,
  Tooltip,
  RadioGroup,
  Radio,
  MenuItem,
  Select,
  FormControl,
  Button
} from '@mui/material';
import {
  Search as SearchIcon,
  InfoOutlined as InfoOutlinedIcon,
  Save as SaveIcon
} from '@mui/icons-material';





// ─── Main component ───────────────────────────────────────────────────────────

const PracticeSettings = () => {
  const [search, setSearch] = useState('');
  const contentRef = useRef(null);
  const { showSnackbar } = useSnackbar();

  const [settings, setSettings] = useState({});
  const practiceInfo = useSelector(selectPracticeInfo);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCurrentPracticeInfo());
  }, [dispatch]);

  useEffect(() => {
    if (practiceInfo?.practiceSettings) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSettings(practiceInfo.practiceSettings);
    }
  }, [practiceInfo?.practiceSettings]);

  const handleChange = (key, val) => setSettings(prev => ({ ...prev, [key]: val }));

  const hasChanges = JSON.stringify(settings) !== JSON.stringify(practiceInfo?.practiceSettings || {});

  const handleSave = async () => {
    try {
      let id = practiceInfo?._id || practiceInfo?.id;
      if (!id) {
        const newPractice = await dispatch(createPracticeInfo({
          practiceName: 'Default Practice',
          phone: '555-000-0000',
          email: 'info@defaultpractice.com',
          address: { line1: '123 St', city: 'Metropolis', state: 'NY', postalCode: '10001', country: 'US' }
        })).unwrap();
        id = newPractice._id || newPractice.id;
      }

      await dispatch(updatePracticeSettings({ practiceInfoId: id, practiceSettingsData: settings })).unwrap();
      showSnackbar('Practice Settings saved successfully', 'success');
    } catch (error) {
      console.error(error);
      showSnackbar(error || 'Failed to save settings', 'error');
    }
  };



  return (
    <SettingsContext.Provider value={{ settings, handleChange }}>
      <Box
        sx={{
          bgcolor: '#FBFCFE',
          borderRadius: '12px',
          border: '1px solid #DFE5EC',
          p: { xs: 2, sm: 3, md: 4 },
          fontFamily: '"Segoe UI", sans-serif'
        }}
      >
        <Box sx={{ display: 'flex', gap: 3, position: 'relative' }}>
          {/* ── Main content ── */}
          <Box ref={contentRef} sx={{ flex: 1, minWidth: 0 }}>

            {/* Header + Search */}
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
              <Typography variant="h6" fontWeight="bold" color="#11223F">
                Practice Settings
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <TextField
                  size="small"
                  placeholder="Search settings"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" sx={{ color: '#9CA3AF' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    width: '220px',
                    '& .MuiOutlinedInput-root': {
                      height: '31.33px',
                      borderRadius: '8px',
                      bgcolor: '#F9FAFB',
                      fontSize: '12px',
                    }
                  }}
                />
                <Button
                  variant="contained"
                  startIcon={<SaveIcon sx={{ width: 14, height: 14 }} />}
                  onClick={handleSave}
                  disabled={!hasChanges}
                  sx={{
                    width: '166.59px',
                    height: '30.67px',
                    borderRadius: '8px',
                    bgcolor: '#3B63E0',
                    textTransform: 'none',
                    fontSize: '12px',
                    boxShadow: 'none',
                    '&:hover': {
                      bgcolor: '#2f51bd',
                      boxShadow: 'none'
                    },
                    '&.Mui-disabled': {
                      bgcolor: '#E5E7EB',
                      color: '#9CA3AF'
                    }
                  }}
                >
                  Save Configuration
                </Button>
              </Box>
            </Box>

            {/* ── First Row: AI & Aging Report ── */}
            <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
              <Box id="ai" sx={{ width: { xs: '100%', md: '30%' }, flexShrink: 0 }}>
                <AI />
              </Box>
              <Box id="aging-report" sx={{ flex: 1, minWidth: 0 }}>
                <AgingReport />
              </Box>
            </Box>

            {/* ── Automated Workflows ── */}
            <Box id="automated-workflows" sx={{ mb: 4 }}>
              <AutomatedWorkflows />
            </Box>

            {/* ── Claim Management ── */}
            <Box id="claim-management" sx={{ mb: 4 }}>
              <ClaimManagement />
            </Box>

            {/* ── Communication ── */}
            <Box id="communication" sx={{ mb: 4 }}>
              <Communication />
            </Box>

            {/* ── Exam Page Items ── */}
            <Box id="exam-page-items" sx={{ mb: 4 }}>
              <ExamPageItems />
            </Box>

            {/* ── General ── */}
            <Box id="general" sx={{ mb: 4 }}>
              <General />
            </Box>

            {/* ── Imaging Settings ── */}
            <Box id="imaging-settings" sx={{ mb: 4 }}>
              <ImagingSettings />
            </Box>

            {/* ── Insurance (for NEA/Vyne offices) ── */}
            <Box id="insurance-nea-vyne" sx={{ mb: 4 }}>
              <Insurance />
            </Box>

            {/* ── Menu Items ── */}
            <Box id="menu-items" sx={{ mb: 4 }}>
              <MenuItems />
            </Box>

            {/* ── Patient Confidential Info ── */}
            <Box id="patient-confidential-info" sx={{ mb: 4 }}>
              <PatientConfidentialInfo />
            </Box>

            {/* ── Reports ── */}
            <Box id="reports" sx={{ mb: 4 }}>
              <Reports />
            </Box>

            {/* ── Templates (Emails/Texts) ── */}
            <Box id="templates" sx={{ mb: 4 }}>
              <Templates />
            </Box>

            {/* ── Text Editors ── */}
            <Box id="text-editors" sx={{ mb: 4 }}>
              <TextEditors />
            </Box>

            {/* ── Time Clock ── */}
            <Box id="time-clock" sx={{ mb: 4 }}>
              <TimeClock />
            </Box>

            {/* ── Treatment Plan Page ── */}
            <Box id="treatment-plan-page" sx={{ mb: 4 }}>
              <TreatmentPlanPage />
            </Box>

            {/* ── Treatment Printout Form ── */}
            <Box id="treatment-printout-form" sx={{ mb: 4 }}>
              <TreatmentPrintoutForm />
            </Box>

          </Box>


        </Box>
      </Box>
    </SettingsContext.Provider>
  );
};

export default PracticeSettings;
