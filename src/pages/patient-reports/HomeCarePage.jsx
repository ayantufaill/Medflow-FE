import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Tabs, 
  Tab, 
  Button, 
  IconButton, 
  Tooltip, 
  Menu, 
  MenuItem, 
  CircularProgress 
} from '@mui/material';
import TabletMacOutlinedIcon from '@mui/icons-material/TabletMacOutlined';
import SmsOutlinedIcon from '@mui/icons-material/SmsOutlined';
import CategoryTabContent from '../../components/shared/CategoryTabContent';
import PatientSummaryCard from '../../components/patient-detail/PatientSummaryCard';
import ClickableReportImage from '../../components/patient-reports/ClickableReportImage';
import { usePatient } from '../../hooks/redux/usePatient';
import { COLORS } from '../../constants/colors';
import { radius } from '../../constants/styles';
import { usePatientReport } from '../../hooks/queries/usePatientReport';
import { useSnackbar } from '../../contexts/SnackbarContext';
import shareSvg from '../../assets/finance icons/share.svg';
import printSvg from '../../assets/clinicalicons/print icon.svg';
import { printPatientHomeCare } from '../../utils/printPatientHomeCare';

const HomeCarePage = () => {
  const { patientId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState(0);

  const { currentPatient: patient, fetchById } = usePatient();
  const { showSnackbar } = useSnackbar();
  const [shareMenuAnchorEl, setShareMenuAnchorEl] = useState(null);
  const [isPrinting, setIsPrinting] = useState(false);

  const handleShareOption = (channel) => {
    setShareMenuAnchorEl(null);
    showSnackbar(`Report shared with patient via ${channel}`, 'success');
  };

  useEffect(() => {
    if (patientId) fetchById(patientId);
  }, [patientId, fetchById]);

  // Navigation sections for the report pages
  const reportSections = [
    { id: 'risk', label: 'RISK ASSESSMENT', path: `/patients/${patientId}/report/risk` },
    { id: 'homecare', label: 'HOME CARE', path: `/patients/${patientId}/report/homecare` },
    { id: 'concerns', label: 'CONCERNS', path: `/patients/${patientId}/report/concerns` },
    { id: 'showcase', label: 'SHOWCASE', path: `/patients/${patientId}/report/showcase` },
  ];

  const { data: reportData, isLoading, isError, error } = usePatientReport(patientId, searchParams.get('appointmentId') || undefined);

  const formatIssues = (issuesArr) => {
    if (!issuesArr || !Array.isArray(issuesArr)) return [];
    return issuesArr.map((issueStr, idx) => {
      const parts = issueStr.split(' — ');
      if (parts.length > 1) {
        return { id: idx, label: parts[0], value: parts.slice(1).join(' — ') };
      }
      return { id: idx, label: issueStr, value: '' };
    });
  };

  const categories = reportData?.homeCare ? [
    {
      title: 'Oral Hygiene Routine',
      subtitle: 'Your daily brushing and cleaning habits',
      description: 'Based on our examination and your reported habits, we\'ve evaluated your current oral hygiene routine and identified areas for improvement.',
      findingsTitle: 'Current Status',
      issues: formatIssues(reportData.homeCare.oralHygiene.issues),
      explanations: reportData.homeCare.oralHygiene.recommendations,
    },
    {
      title: 'Flossing Habits',
      subtitle: 'Interdental cleaning practices',
      description: 'Regular flossing is essential for removing plaque and food particles between teeth where your toothbrush cannot reach.',
      findingsTitle: 'Assessment Findings',
      issues: formatIssues(reportData.homeCare.flossing.issues),
      explanations: reportData.homeCare.flossing.recommendations,
    },
    {
      title: 'Recommended Products',
      subtitle: 'Tools and products for optimal care',
      description: 'Using the right oral care products can significantly improve your dental health outcomes and make your home care routine more effective.',
      findingsTitle: 'Product Recommendations',
      issues: formatIssues(reportData.homeCare.products.productRecommendations),
    }
  ] : [];

  // Navigation categories for Home Care
  const homeCareCategories = [
    'Oral Hygiene',
    'Flossing', 
    'Products',
  ];

  const canPrint = !isLoading && !isError && !!categories[activeCategory] &&
    !!patient && String(patient._id || patient.id) === String(patientId);

  const handlePrint = async () => {
    if (!canPrint || isPrinting) return;
    setIsPrinting(true);
    try {
      await printPatientHomeCare({
        patient,
        patientId,
        category: categories[activeCategory],
        categoryLabel: homeCareCategories[activeCategory],
        sectionNumber: activeCategory + 1,
        primaryConcern: reportData?.concerns?.primaryConcern,
      });
    } catch (printError) {
      showSnackbar(printError.message || 'Unable to print this report.', 'error');
    } finally {
      setIsPrinting(false);
    }
  };

  return (
    <Box sx={{
      '@media print': {
        '.print-hide': { display: 'none !important' },
      }
    }}>
      {/* Patient Header Card */}
      <Box sx={{
        mb: 2,
        p: 2,
        backgroundColor: COLORS.SURFACE_CARD,
        borderRadius: radius.xl,
        border: `0.8px solid ${COLORS.BORDER}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 2,
      }}>
        {patient ? <PatientSummaryCard patient={patient} /> : <Box />}
        
        <Box className="print-hide" sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
          {reportSections.map((section) => (
            <Button
              key={section.id}
              variant="text"
              size="small"
              onClick={() => navigate(section.path)}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.75rem',
                letterSpacing: '0.02em',
                py: 1,
                px: 1.5,
                borderRadius: 1,
                bgcolor: section.id === 'homecare' ? 'primary.main' : 'grey.100',
                color: section.id === 'homecare' ? 'primary.contrastText' : 'text.primary',
                minWidth: 'auto',
                '&:hover': {
                  bgcolor: section.id === 'homecare' ? 'primary.dark' : 'grey.200',
                },
              }}
            >
              {section.label}
            </Button>
          ))}
        </Box>
      </Box>

      {/* Main Content Area */}
      <Box sx={{ pb: 4 }}>
        {/* Unified Card Layout */}
        <Box sx={{ 
          backgroundColor: COLORS.SURFACE_CARD, 
          borderRadius: radius.xl, 
          border: `1px solid ${COLORS.BORDER}`, 
          p: 3 
        }}>
          {/* Header Row with Share and Print Icons */}
          <Box sx={{ 
            mb: 3, 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2 
          }}>
            <Typography 
              sx={{ 
                fontWeight: 600, 
                fontSize: '0.90rem',
                color: COLORS.PRIMARY
              }}
            >
              Personalized oral hygiene recommendations and care instructions
            </Typography>

            <Box className="print-hide" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Tooltip title="Share with Patient">
                <IconButton 
                  size="small"
                  aria-label="Share with patient"
                  onClick={(e) => setShareMenuAnchorEl(e.currentTarget)}
                >
                  <Box component="img" src={shareSvg} alt="share" sx={{ width: 22, height: 22 }} />
                </IconButton>
              </Tooltip>

              <Menu
                anchorEl={shareMenuAnchorEl}
                open={Boolean(shareMenuAnchorEl)}
                onClose={() => setShareMenuAnchorEl(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                PaperProps={{
                  sx: {
                    mt: 1,
                    minWidth: 180,
                    border: `1px solid ${COLORS.BORDER}`,
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    '& .MuiMenuItem-root': {
                      gap: 1.5,
                      py: 1.25,
                      fontSize: '0.875rem',
                      color: '#0f172a',
                      fontFamily: 'Inter, sans-serif',
                    },
                  },
                }}
              >
                <MenuItem onClick={() => handleShareOption('Kiosk')}>
                  <TabletMacOutlinedIcon sx={{ fontSize: '1.2rem', color: '#334155' }} />
                  Send to Kiosk
                </MenuItem>
                <MenuItem onClick={() => handleShareOption('SMS')}>
                  <SmsOutlinedIcon sx={{ fontSize: '1.2rem', color: '#334155' }} />
                  Send to SMS
                </MenuItem>
              </Menu>

              <Tooltip title="Print">
                <IconButton 
                  size="small"
                  aria-label="Print"
                  onClick={handlePrint}
                  disabled={!canPrint || isPrinting}
                >
                  <Box component="img" src={printSvg} alt="print" sx={{ width: 22, height: 22 }} />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : isError ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <Typography color="error">Error loading report: {error?.response?.data?.error?.message || error?.message || 'Unknown error'}</Typography>
            </Box>
          ) : !reportData ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <Typography>No clinical report data found.</Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', gap: 3 }}>
          {/* Left Side - Visual */}
          <Box sx={{ flex: '0 0 calc(50% - 12px)', maxWidth: 'calc(50% - 12px)' }}>
            <ClickableReportImage />
          </Box>

          {/* Vertical Divider */}
          <Box sx={{ 
            width: '1px', 
            bgcolor: COLORS.BORDER,
            minHeight: '400px',
            flexShrink: 0
          }} />

          {/* Right Side - Content with Navigation */}
          <Box sx={{ flex: '1 1 calc(50% - 12px)', minWidth: 0 }}>
            {/* Category Navigation Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: COLORS.BORDER, mb: 3 }}>
              <Tabs
                value={activeCategory}
                onChange={(event, newValue) => setActiveCategory(newValue)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  '& .MuiTab-root': {
                    color: COLORS.TEXT_MUTED,
                    '&.Mui-selected': { color: COLORS.PRIMARY }
                  },
                  '& .MuiTabs-indicator': {
                    backgroundColor: COLORS.PRIMARY
                  }
                }}
              >
                {homeCareCategories.map((name) => (
                  <Tab 
                    key={name} 
                    label={name} 
                    sx={{ 
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      minHeight: 48,
                    }} 
                  />
                ))}
              </Tabs>
            </Box>

            {/* Content for Selected Category */}
            <Box sx={{ p: 0 }}>
              <CategoryTabContent 
                category={categories[activeCategory]} 
                sectionNumber={activeCategory + 1}
              />
            </Box>
          </Box>
        </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default HomeCarePage;
